import csv, json, re, unicodedata, collections
d=json.load(open('/home/claude/agua/data/agua.json'))
def norm(s):
    s=''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
    s=re.sub(r'\(.*?\)',' ',s)
    s=re.sub(r'\b(embalse|pantano|presa|salto|central hidroelectrica|encoro|panta|embassament|urtegia|y)\b',' ',s)
    s=re.sub(r"\b(de la|de los|de las|del|de|d'|el|la|los|las|els|les|l'|o|a|os|as)\b",' ',s)
    s=re.sub(r'[^a-z0-9]+',' ',s).strip()
    return s
cands=collections.defaultdict(set); info={}
for r in csv.DictReader(open('res.csv')):
    m=re.match(r'Point\(([-\d.]+) ([-\d.]+)\)',r['coord']); 
    if not m: continue
    lon,lat=float(m[1]),float(m[2])
    if not(35.5<lat<44.2 and -9.6<lon<3.6): continue
    info[r['r']]=(lat,lon,r['rLabel'],r['admLabel'])
    for nm in [r['rLabel']]+r['alts'].split('|'):
        k=norm(nm)
        if k: cands[k].add(r['r'])
# rough basin boxes to disambiguate (lat/lon bounds, generous)
BOX={'Galicia Costa':(41.8,43.9,-9.4,-7.0),'Miño-Sil':(41.7,43.5,-8.9,-6.0),'Cantábrico Occidental':(42.7,43.8,-7.6,-3.3),'Cantábrico Oriental':(42.7,43.5,-3.6,-1.4),'País Vasco':(42.9,43.5,-3.5,-1.7),
'Duero':(40.1,43.3,-7.6,-1.8),'Ebro':(40.3,43.3,-4.5,2.5),'Cataluña':(40.5,42.9,0.1,3.4),'Tajo':(39.0,41.4,-7.6,-1.4),'Júcar':(38.0,41.0,-2.8,0.6),'Guadiana':(37.1,40.0,-7.6,-2.4),
'Segura':(37.2,39.2,-3.1,-0.5),'Guadalquivir':(36.6,39.0,-6.9,-2.2),'Tinto, Odiel y Piedras':(37.1,38.0,-7.5,-6.3),'Guadalete-Barbate':(36.0,37.1,-6.5,-5.0),'Mediterránea Andaluza':(36.0,37.6,-5.7,-1.6)}
out={}; miss=[]; amb=[]
for b in d['basins']:
    la0,la1,lo0,lo1=BOX[b['n']]
    for r in b['r']:
        name=r[0]; keys={norm(name)}
        for part in re.split(r'\s+-\s+|,|/',name): keys.add(norm(part))
        keys.discard('')
        ids=set()
        for k in keys: ids|=cands.get(k,set())
        inb=[i for i in ids if la0<=info[i][0]<=la1 and lo0<=info[i][1]<=lo1]
        if len(inb)==1: out[name]=info[inb[0]]
        elif len(inb)>1:
            # same place listed twice?
            pts=[info[i] for i in inb]; 
            if max(abs(p[0]-pts[0][0])+abs(p[1]-pts[0][1]) for p in pts)<0.08: out[name]=pts[0]
            else: amb.append((name,b['n'],[(p[2],p[3]) for p in pts]))
        else: miss.append((name,b['n'],r[1], len(ids)))
tot=sum(len(b['r']) for b in d['basins']); cap=sum(r[1] for b in d['basins'] for r in b['r'])
capm=sum(r[1] for b in d['basins'] for r in b['r'] if r[0] in out)
print('matched',len(out),'of',tot,'capacity share',round(100*capm/cap,1))
print('ambiguous',len(amb),amb[:12])
print('missing big',sorted(miss,key=lambda x:-x[2])[:45])
json.dump({k:[round(v[0],4),round(v[1],4),v[2]] for k,v in out.items()},open('matched.json','w'),ensure_ascii=False)
# second pass: close spellings, still inside the basin box, single best candidate
import difflib
fz={}
allk=list(cands)
for name,bn,capn,_ in miss:
    la0,la1,lo0,lo1=BOX[bn]; k0=norm(name.replace('ç','c')); 
    k0=re.sub(r'\b(ii|i|sistema|n s|na sa|san\.)\b',' ',k0).strip() or norm(name)
    best=[]
    for k in allk:
        r=difflib.SequenceMatcher(None,k0,k).ratio()
        sub=(len(k0)>=5 and (k0 in k or k in k0) and len(k)>=5)
        if r>=0.84 or sub:
            for i in cands[k]:
                if la0<=info[i][0]<=la1 and lo0<=info[i][1]<=lo1: best.append((max(r,0.85 if sub else 0),i))
    ids={i for _,i in best}
    if ids:
        top=max(best)[1]; pts=[info[i] for i in ids]
        if len(ids)==1 or max(abs(p[0]-info[top][0])+abs(p[1]-info[top][1]) for p in pts)<0.08: fz[name]=info[top]
        else: fz[name]=('AMB',[(info[i][2]) for i in ids])
for k,v in fz.items(): print(k,'=>',v[2] if v[0]!='AMB' else v)
json.dump({k:[round(v[0],4),round(v[1],4),v[2]] for k,v in fz.items() if v[0]!='AMB'},open('fuzzy.json','w'),ensure_ascii=False)
