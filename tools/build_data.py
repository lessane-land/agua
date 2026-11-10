#!/usr/bin/env python3
"""Builds data/agua.json from MITECO's weekly reservoir history (BD-Embalses).

Standard library only. Reading the Access file is delegated to mdbtools
(mdb-tables, mdb-export), installed with apt in the GitHub Action.

For every reservoir in the latest bulletin it keeps the fill percentage on the
bulletin closest to the same day of each year since 1988, so the site can show
"this week in other years" from one small file.

Usage:
  python3 tools/build_data.py              download, convert, write data/agua.json
  python3 tools/build_data.py --mdb X.mdb  skip the download and read a local file
"""
import csv, datetime, io, json, os, subprocess, sys, tempfile, time, urllib.request, zipfile

URL = ("https://www.miteco.gob.es/content/dam/miteco/es/agua/temas/"
       "evaluacion-de-los-recursos-hidricos/boletin-hidrologico/"
       "Historico-de-embalses/BD-Embalses.zip")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "agua.json")
FIRST_YEAR = 1988
MAX_DAYS_APART = 4          # a bulletin counts as "the same week" within this many days
# Basins in reading order, north to south, with the short name shown on the site.
BASINS = [
    ("Galicia Costa", "Galicia Costa"), ("Miño - Sil", "Miño-Sil"),
    ("Cantábrico Occidental", "Cantábrico Occidental"), ("Cantábrico Oriental", "Cantábrico Oriental"),
    ("Cuencas Internas del País Vasco", "País Vasco"), ("Duero", "Duero"), ("Ebro", "Ebro"),
    ("Cuencas Internas de Cataluña", "Cataluña"), ("Tajo", "Tajo"), ("Júcar", "Júcar"),
    ("Guadiana", "Guadiana"), ("Segura", "Segura"), ("Guadalquivir", "Guadalquivir"),
    ("Tinto, Odiel y Piedras", "Tinto, Odiel y Piedras"), ("Guadalete-Barbate", "Guadalete-Barbate"),
    ("Cuenca Mediterránea Andaluza", "Mediterránea Andaluza"),
]


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def download(url, dest, tries=8):
    """Downloads with resume, because the server sometimes cuts the transfer."""
    done = 0
    for attempt in range(1, tries + 1):
        req = urllib.request.Request(url, headers={"User-Agent": "agua.lessane.es data builder"})
        if done:
            req.add_header("Range", "bytes=%d-" % done)
        try:
            with urllib.request.urlopen(req, timeout=120) as r, open(dest, "ab" if done else "wb") as f:
                if done and r.status != 206:      # server ignored the range, start again
                    f.close(); done = 0
                    f = open(dest, "wb")
                while True:
                    chunk = r.read(1 << 16)
                    if not chunk:
                        break
                    f.write(chunk); done += len(chunk)
            if zipfile.is_zipfile(dest):
                return
            log("attempt %d: incomplete at %d bytes" % (attempt, done))
        except Exception as e:                      # network errors are retried
            log("attempt %d: %s at %d bytes" % (attempt, type(e).__name__, done))
        time.sleep(3 * attempt)
    raise SystemExit("download failed")


def num(s):
    s = (s or "").strip()
    if not s:
        return None
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    return float(s)


def read_rows(mdb):
    tables = subprocess.run(["mdb-tables", "-1", mdb], check=True, capture_output=True, text=True).stdout.split("\n")
    table = next(t for t in tables if t.startswith("T_Datos"))
    log("table:", table)
    p = subprocess.Popen(["mdb-export", "-D", "%Y-%m-%d", "-T", "%Y-%m-%d", mdb, table],
                         stdout=subprocess.PIPE)
    for row in csv.DictReader(io.TextIOWrapper(p.stdout, encoding="utf-8")):
        cap, vol = num(row["AGUA_TOTAL"]), num(row["AGUA_ACTUAL"])
        if cap is None or cap <= 0:
            continue
        yield (datetime.date.fromisoformat(row["FECHA"][:10]), row["AMBITO_NOMBRE"].strip(),
               row["EMBALSE_NOMBRE"].strip(), cap, vol or 0.0)
    if p.wait() != 0:
        raise SystemExit("mdb-export failed")


def nice(name):
    """'Atazar, El' becomes 'El Atazar'."""
    if ", " in name:
        a, b = name.split(", ", 1)
        return b + " " + a
    return name


def build(mdb):
    by_date = {}
    for d, basin, name, cap, vol in read_rows(mdb):
        by_date.setdefault(d, []).append((basin, name, cap, vol))
    dates = sorted(by_date)
    latest = dates[-1]
    years = list(range(FIRST_YEAR, latest.year + 1))
    picked = []                                     # the bulletin used for each year, or None
    for y in years:
        try:
            target = latest.replace(year=y)
        except ValueError:                          # 29 February
            target = latest.replace(year=y, day=28)
        best = min(dates, key=lambda d: abs((d - target).days))
        picked.append(best if abs((best - target).days) <= MAX_DAYS_APART else None)

    known = dict(BASINS)
    today = by_date[latest]
    unknown = sorted({b for b, _, _, _ in today} - set(known))
    if unknown:
        raise SystemExit("unknown basins, add them to BASINS: %s" % unknown)

    pct = {}          # (basin, name) -> [percent per year]
    nat, basin_pct = [], {b: [] for b in known}
    for d in picked:
        rows = by_date.get(d, []) if d else []
        cap = sum(r[2] for r in rows); vol = sum(r[3] for r in rows)
        nat.append(round(100 * vol / cap, 1) if cap else None)
        sums = {}
        for b, n, c, v in rows:
            s = sums.setdefault(b, [0.0, 0.0]); s[0] += c; s[1] += v
        for b in known:
            s = sums.get(b)
            basin_pct[b].append(round(100 * s[1] / s[0]) if s and s[0] else None)
        seen = {(b, n): min(100, round(100 * v / c)) for b, n, c, v in rows}
        for key in {(b, n) for b, n, _, _ in today}:
            pct.setdefault(key, []).append(seen.get(key))

    basins = []
    for full, short in BASINS:
        rs = sorted([r for r in today if r[0] == full], key=lambda r: (-r[2], r[1]))
        if rs:
            basins.append({"n": short, "p": basin_pct[full],
                           "r": [[nice(n), round(c), pct[(b, n)], round(v)] for b, n, c, v in rs]})
    out = {"date": latest.isoformat(), "first": FIRST_YEAR, "dates": [d.isoformat() if d else None for d in picked],
           "nat": nat, "total": round(sum(r[2] for r in today)), "stored": round(sum(r[3] for r in today)),
           "basins": basins}
    count = sum(len(b["r"]) for b in basins)
    # Refuse to publish something that looks broken; the site keeps last week's file.
    if count < 300 or not (5 <= nat[-1] <= 100) or not (40000 <= out["total"] <= 80000):
        raise SystemExit("sanity check failed: %d reservoirs, %s %%, %s hm3" % (count, nat[-1], out["total"]))
    log("latest %s, %d reservoirs, %s %% of %s hm3" % (latest, count, nat[-1], out["total"]))
    return out


def main():
    with tempfile.TemporaryDirectory() as tmp:
        if "--mdb" in sys.argv:
            mdb = sys.argv[sys.argv.index("--mdb") + 1]
        else:
            z = os.path.join(tmp, "bd.zip")
            download(URL, z)
            with zipfile.ZipFile(z) as zf:
                name = next(n for n in zf.namelist() if n.lower().endswith(".mdb"))
                zf.extract(name, tmp)
            mdb = os.path.join(tmp, name)
        out = build(mdb)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    log("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
