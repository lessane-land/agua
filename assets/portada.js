/* Agua, the front door.
   agua.js draws the wall, the map, the glass and the drowned places. This file decides
   which of them you see (one view at a time instead of one long corridor) and adds the
   voice: the verdict on the home page, the weekly prizes, the mood of each reservoir.
   It talks to agua.js only through window.AGUA and four events:
   agua:ready, agua:year, agua:card, agua:vaso. */
(function () {
'use strict';

const S = {
  es: {
    nav: { home: 'Portada', muro: 'El muro', mapa: 'El mapa', 'tu-vaso': 'Tu vaso', esconde: 'Lo que esconde', premios: 'Los premios' },
    navLabel: 'Secciones',
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    verdict: [
      [70, m => 'Hasta arriba. Así da gusto.'],
      [55, m => 'Medio lleno. Para ser ' + m + ', bastante digno.'],
      [45, m => 'Ni fu ni fa. Mitad agua, mitad roca.'],
      [35, m => 'Justito. Ya se le ve la roca.'],
      [0, m => 'Mal. Más roca que agua.']
    ],
    rank: (r, n, m) => r === 1 ? 'El mejor ' + m + ' desde 1988.' : r === n ? 'El peor ' + m + ' desde 1988.' : 'El ' + r + '.º mejor ' + m + ' de ' + n + '.',
    pools: x => 'Hay agua para ' + x + ' millones de piscinas olímpicas, que nadie ha pedido.',
    doors: {
      muro: n => n + ' embalses, piedra a piedra',
      'tu-vaso': () => '¿De dónde bebes? Te lo digo',
      mapa: () => 'Dónde está cada uno',
      esconde: n => n + ' lugares bajo el agua, por ahora'
    },
    prizeOne: 'PREMIO DE LA SEMANA', prizeAll: 'Ver todos los premios',
    prizesNow: 'Los premios de la semana', prizesYear: y => 'Los premios de ' + y,
    prizesLede: 'Los reparte el boletín del ministerio. Aquí solo ponemos el nombre y la mala idea.',
    prizesRule: 'Compiten los embalses de 30 hm3 o más, y cada uno se lleva un solo premio.',
    out: 'Fuera de concurso', src: 'Fuente',
    aw: {
      chulo: ['El más chulo', (k, p) => 'No le cabe ni una lágrima.'],
      huesos: ['En los huesos', (k, p) => 'Se le ven las costillas. Y el fondo.'],
      estiron: ['El estirón', (k, p, d) => d + ' puntos más que hace un año. Alguien ha dado el estirón.'],
      disgusto: ['El disgusto', (k, p, d) => Math.abs(d) + ' puntos menos que hace un año. Algo habrá hecho.'],
      record: ['Récord personal', (k, p, d, m) => 'Su mejor ' + m + ' desde 1988.' + (p < 60 ? ' Sí, con el ' + p + ' %. No preguntes.' : '')]
    },
    fromTo: (a, b) => 'del ' + a + ' al ' + b + ' %',
    mood: [[90, 'A rebosar'], [75, 'Va sobrado'], [60, 'Va bien'], [45, 'Tirando'], [30, 'Justito'], [15, 'Pidiendo la hora'], [0, 'En los huesos']],
    up: d => d + ' puntos más que hace un año.', down: d => d + ' puntos menos que hace un año.', same: 'Igual que hace un año.',
    hides: 'LO QUE ESCONDE', story: 'Ver la historia y los avistamientos',
    drinks: n => 'De aquí bebe ' + n,
    shower: [
      [80, 'Dúchate tranquilo. Con canción y bises.'],
      [50, 'Puedes ducharte. Cantando, incluso.'],
      [35, 'Ducha sí. Concierto no.'],
      [20, 'Ducha de cuartel: entrar y salir.'],
      [0, 'Mal asunto. Ducha corta y grifo cerrado.']
    ],
    shortSong: ' Eso sí, canta una corta.',
    usual: (n, p) => 'Nivel habitual de ' + n + ' esta semana: ' + p + ' % (mediana desde 1988).',
    share: 'Compartir mi vaso', copied: 'Enlace copiado',
    shareText: (n, p) => 'El agua de ' + n + ' está al ' + p + ' %.'
  },
  en: {
    nav: { home: 'Home', muro: 'The wall', mapa: 'The map', 'tu-vaso': 'Your glass', esconde: 'What it hides', premios: 'The prizes' },
    navLabel: 'Sections',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    verdict: [
      [70, m => 'Full to the brim. Lovely.'],
      [55, m => 'Half full. For ' + m + ', rather respectable.'],
      [45, m => 'So-so. Half water, half rock.'],
      [35, m => 'Tight. The rock is starting to show.'],
      [0, m => 'Bad. More rock than water.']
    ],
    rank: (r, n, m) => r === 1 ? 'The best ' + m + ' since 1988.' : r === n ? 'The worst ' + m + ' since 1988.' : 'The ' + r + ord(r) + ' best ' + m + ' out of ' + n + '.',
    pools: x => 'Enough water for ' + x + ' million Olympic pools, which nobody ordered.',
    doors: {
      muro: n => n + ' reservoirs, stone by stone',
      'tu-vaso': () => 'Where does your water come from? I will tell you',
      mapa: () => 'Where each one is',
      esconde: n => n + ' places under water, for now'
    },
    prizeOne: 'PRIZE OF THE WEEK', prizeAll: 'See all the prizes',
    prizesNow: 'Prizes of the week', prizesYear: y => 'The ' + y + ' prizes',
    prizesLede: 'Handed out by the ministry bulletin. We only add the names and the mischief.',
    prizesRule: 'Reservoirs of 30 hm3 or more compete, and each one takes a single prize.',
    out: 'Not competing', src: 'Source',
    aw: {
      chulo: ['The show-off', (k, p) => 'Not room for one more tear.'],
      huesos: ['Skin and bones', (k, p) => 'You can count its ribs. And see the bottom.'],
      estiron: ['The growth spurt', (k, p, d) => d + ' points up on a year ago. Somebody shot up.'],
      disgusto: ['The letdown', (k, p, d) => Math.abs(d) + ' points down on a year ago. It must have done something.'],
      record: ['Personal best', (k, p, d, m) => 'Its best ' + m + ' since 1988.' + (p < 60 ? ' Yes, at ' + p + ' %. Do not ask.' : '')]
    },
    fromTo: (a, b) => 'from ' + a + ' to ' + b + ' %',
    mood: [[90, 'Brimming'], [75, 'Plenty to spare'], [60, 'Doing fine'], [45, 'Getting by'], [30, 'Tight'], [15, 'On its last legs'], [0, 'Skin and bones']],
    up: d => d + ' points up on a year ago.', down: d => d + ' points down on a year ago.', same: 'Same as a year ago.',
    hides: 'WHAT IT HIDES', story: 'See the story and the sightings',
    drinks: n => n + ' drinks from here',
    shower: [
      [80, 'Shower in peace. Song and encore included.'],
      [50, 'You may shower. Singing, even.'],
      [35, 'Shower yes. Concert no.'],
      [20, 'Barracks shower: in and out.'],
      [0, 'Not good. Short shower, tap off.']
    ],
    shortSong: ' Make it a short song, though.',
    usual: (n, p) => 'Usual level of ' + n + ' this week: ' + p + ' % (median since 1988).',
    share: 'Share my glass', copied: 'Link copied',
    shareText: (n, p) => 'The water of ' + n + ' is at ' + p + ' %.'
  }
};
function ord(n) { const v = n % 100; return v > 10 && v < 14 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'; }
const band = (table, v) => table.find(row => v >= row[0])[1];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = s => document.querySelector(s);

/* One reservoir drawn the way the wall draws it: rock on top, water below. */
function brick(p, w, h) {
  const y = h * (1 - p / 100); let lines = '';
  for (let yy = 9; yy < y - 2; yy += 9) lines += '<rect x="0" y="' + yy + '" width="' + w + '" height="1" fill="#B19C72"/>';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><rect width="' + w + '" height="' + h + '" fill="#CDB98F"/>' +
    lines + '<rect x="0" y="' + y.toFixed(1) + '" width="' + w + '" height="' + (h - y).toFixed(1) + '" fill="#3F93A8"/></svg>';
}

const VIEWS = ['home', 'muro', 'mapa', 'tu-vaso', 'esconde', 'premios'];
let A, L, view = 'home', NOTES = { fuera_de_concurso: [], contexto: [] };
let home, prem, nav, plus;

addEventListener('agua:ready', init, { once: true });
if (window.AGUA) init();

function init() {
  if (A) return; A = window.AGUA;
  const main = $('#main');

  /* every section agua.js built belongs to exactly one view */
  [...main.children].forEach(el => {
    if (el.tagName !== 'SECTION') return;
    el.dataset.view = el.id === 'mapa' ? 'mapa' : el.id === 'tu-vaso' ? 'tu-vaso' : el.id === 'esconde' ? 'esconde' : 'muro';
  });
  /* the "every brick is a reservoir" explanation belongs to the wall, not to the home page */
  A.ALL.sec.querySelector('.bh').after($('#lede'));

  home = document.createElement('section'); home.className = 'basin home'; home.id = 'portada'; home.dataset.view = 'home';
  main.prepend(home);
  prem = document.createElement('section'); prem.className = 'basin prem'; prem.id = 'premios'; prem.dataset.view = 'premios';
  main.querySelector('footer').before(prem);
  nav = $('#nav');
  plus = document.createElement('div'); plus.id = 'cplus'; $('#card').appendChild(plus);

  addEventListener('agua:year', renderAll);
  addEventListener('agua:card', renderCard);
  addEventListener('agua:vaso', renderGlass);
  addEventListener('hashchange', route);
  fetch('data/notas.json').then(r => r.ok ? r.json() : NOTES).then(j => { NOTES = j; renderAll(); A.refreshGlass(); }).catch(() => {});
  renderAll(); route();
}

/* ---------- which view ---------- */
function route() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')), parts = h.split('/');
  let v = VIEWS.includes(parts[0]) ? parts[0] : 'home', pick = null;
  if (parts[0] === 'embalse' && parts[1]) { v = 'muro'; pick = parts.slice(1).join('/'); }
  if (parts[0] === 'tu-vaso' && parts[1]) { const c = A.VAS.find(x => x.id === parts[1]); if (c) A.pickCity(c); }
  const changed = v !== view; view = v;
  document.body.dataset.view = v;
  $('.hero').classList.toggle('off', v !== 'home');
  [...$('#main').children].forEach(el => { if (el.dataset.view) el.classList.toggle('off', el.dataset.view !== v); });
  [...nav.querySelectorAll('a')].forEach(a => a.getAttribute('href') === '#/' + (v === 'home' ? '' : v) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  /* canvases cannot measure themselves while hidden, so they are sized again on arrival */
  A.fitHead(); A.layout();
  if (pick) A.pick(pick); else if (changed) A.pick(null);
  if (changed) scrollTo(0, 0);
}

function renderAll() {
  L = S[A.lang];
  nav.setAttribute('aria-label', L.navLabel);
  nav.innerHTML = VIEWS.map(v => '<a href="#/' + (v === 'home' ? '' : v) + '"' + (v === view ? ' aria-current="page"' : '') + '>' + L.nav[v] + '</a>').join('');
  const prizes = awards();
  renderHome(prizes); renderPrizes(prizes); renderCard();
}

/* ---------- home ---------- */
function monthName() { const d = A.D.dates[A.yi] || A.D.date; return L.months[+d.slice(5, 7) - 1]; }
function renderHome(prizes) {
  const D = A.D, yi = A.yi, v = D.nat[yi]; let h = '';
  if (v != null) {
    const m = monthName(), all = D.nat.filter(x => x != null), r = all.filter(x => x > v).length + 1;
    h += '<p class="hv">' + band(L.verdict, v)(m) + '</p><p class="hs">' + L.rank(r, all.length, m);
    /* an Olympic pool is 2,500 m3, so one hm3 fills 400 of them */
    if (yi === D.nat.length - 1) h += ' ' + L.pools(A.num(D.stored * 400 / 1e6, 1));
    h += '</p>';
  }
  const count = { muro: A.ALL.bricks.length, esconde: A.TESN.size };
  h += '<div class="doors">' + ['muro', 'tu-vaso', 'mapa', 'esconde'].map(d =>
    '<a class="door" href="#/' + d + '"><b>' + L.nav[d] + '</b><span>' + L.doors[d](count[d]) + '</span></a>').join('') + '</div>';
  const t = prizes.find(a => a.id === 'estiron') || prizes[0];
  if (t) h += '<a class="teaser" href="#/premios"><span class="tk">' + L.prizeOne + '</span><span class="tb">' + brick(t.p, 46, 60) +
    '<span><b>' + L.aw[t.id][0] + ': ' + esc(t.k.n) + '</b><i>' + t.line + '</i><u>' + L.prizeAll + '</u></span></span></a>';
  home.innerHTML = h;
}

/* ---------- prizes ---------- */
/* Rules: 30 hm3 or more, one prize each, and the reservoirs listed in data/notas.json
   as "fuera de concurso" (empty by design, with a source) do not compete. */
function awards() {
  const yi = A.yi, m = monthName(), skip = new Set(NOTES.fuera_de_concurso.map(x => x.embalse));
  const C = A.ALL.bricks.filter(k => k.c >= 30 && k.p[yi] != null && !skip.has(k.n));
  const D1 = yi > 0 ? C.filter(k => k.p[yi - 1] != null) : [], delta = k => k.p[yi] - k.p[yi - 1];
  const taken = new Set(), out = [];
  const give = (id, list, score) => {
    const k = list.filter(x => !taken.has(x.n)).sort((a, b) => score(b) - score(a) || b.c - a.c)[0]; if (!k) return;
    taken.add(k.n); const p = k.p[yi], d = yi > 0 && k.p[yi - 1] != null ? delta(k) : null;
    out.push({ id, k, p, d, line: L.aw[id][1](k, p, d, m) });
  };
  give('chulo', C, k => k.p[yi]);
  give('estiron', D1.filter(k => delta(k) > 0), delta);
  give('record', C.filter(k => { const o = k.p.filter((v, j) => v != null && j !== yi); return o.length >= 20 && o.every(v => v < k.p[yi]); }), k => k.c);
  give('disgusto', D1.filter(k => delta(k) < 0), k => -delta(k));
  give('huesos', C, k => -k.p[yi]);
  const order = ['chulo', 'huesos', 'estiron', 'disgusto', 'record'];
  return out.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
function renderPrizes(prizes) {
  const yi = A.yi, latest = yi === A.D.nat.length - 1;
  let h = '<div class="bh"><h2>' + (latest ? L.prizesNow : L.prizesYear(A.D.first + yi)) + '</h2></div><p class="lede">' + L.prizesLede + '</p><div class="aws">';
  prizes.forEach(a => {
    const num = (a.id === 'estiron' || a.id === 'disgusto') ? L.fromTo(a.k.p[yi - 1], a.p) : a.p + ' %';
    h += '<a class="aw" href="#/embalse/' + encodeURIComponent(a.k.n) + '">' + brick(a.p, 56, 92) + '<span><b>' + L.aw[a.id][0] + '</b><em>' + esc(a.k.n) + ', ' + esc(a.k.basin) +
      ' <strong>' + num + '</strong></em><i>' + a.line + '</i></span></a>';
  });
  h += '</div><p class="rule">' + L.prizesRule;
  NOTES.fuera_de_concurso.forEach(x => { h += ' ' + L.out + ': ' + esc(x.embalse) + ', ' + x[A.lang] + ' (<a href="' + x.u + '" rel="noopener">' + L.src.toLowerCase() + '</a>).'; });
  prem.innerHTML = h + '</p>';
}

/* ---------- the card of one reservoir ---------- */
function renderCard() {
  if (!plus) return; const k = A.picked, yi = A.yi;
  /* a card that is open has an address, so it can be shared */
  if (view === 'muro') history.replaceState(null, '', k ? '#/embalse/' + encodeURIComponent(k.n) : '#/muro');
  if (!k || k.p[yi] == null) { plus.innerHTML = ''; return; }
  const p = k.p[yi], q = yi > 0 ? k.p[yi - 1] : null;
  let h = '<p class="cm"><span class="mood">' + band(L.mood, p) + '</span>';
  if (q != null) { const d = p - q; h += ' ' + (d === 0 ? L.same : d > 0 ? L.up(d) : L.down(-d)); }
  h += '</p>';
  const t = A.hidden(k.n);
  if (t) h += '<a class="hid" href="#/esconde"><span class="tk">' + L.hides + '</span><b>' + esc(t.t.n[A.lang]) + (t.v ? ' · ' + A.T[A.lang]['v_' + t.v.v] : '') + '</b><u>' + L.story + '</u></a>';
  A.VAS.filter(c => c.r.includes(k.n)).forEach(c => { h += '<a class="go" href="#/tu-vaso/' + c.id + '">' + L.drinks(esc(c.n[A.lang])) + '</a>'; });
  plus.innerHTML = h;
}

/* ---------- your glass ---------- */
function median(a) { const s = a.filter(v => v != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; }
function renderGlass() {
  if (!A) return; L = S[A.lang];
  const v = A.vsel, box = $('#tu-vaso .vtxt'), big = box && box.querySelector('.vd'); if (!v || !big) return;
  const yi = A.yi, p = v.r.length ? A.vPct(v, yi) : null; if (p == null) return;
  const ctx = NOTES.contexto.filter(x => v.r.includes(x.embalse));
  let h = '';
  /* A joke only where the supply is documented. For the "five nearest" fallback we do not
     know it is this town's water, so we do not pretend to. A known explanation beats a joke. */
  if (!v.town && !ctx.length) {
    const q = yi > 0 ? A.vPct(v, yi - 1) : null;
    h += '<p class="joke">' + band(L.shower, p) + (p >= 50 && q != null && Math.round(p) - Math.round(q) <= -10 ? L.shortSong : '') + '</p>';
  }
  ctx.forEach(x => {
    const k = A.ALL.bricks.find(b => b.n === x.embalse), md = k && median(k.p);
    h += '<p class="ctx">' + x[A.lang] + (md != null ? ' ' + L.usual(esc(x.embalse), md) : '') + ' <a href="' + x.u + '" rel="noopener">' + L.src + '</a></p>';
  });
  big.insertAdjacentHTML('afterend', h);
  if (!v.town && v.id) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'share'; b.textContent = L.share;
    b.addEventListener('click', () => {
      const url = location.origin + location.pathname + '#/tu-vaso/' + v.id, text = L.shareText(v.n[A.lang], Math.round(p));
      if (navigator.share) navigator.share({ title: 'Agua', text, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text + ' ' + url).then(() => { b.textContent = L.copied; });
    });
    box.appendChild(b);
  }
}
})();
