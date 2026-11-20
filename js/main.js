const IC = {
 qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4"/>',
 grid:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 library:'<rect x="4" y="4" width="6" height="16" rx="1"/><rect x="14" y="4" width="6" height="16" rx="1"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
 text:'<path d="M4 6h16M4 12h16M4 18h10"/>',
 wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 palette:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 save:'<path d="M5 3h11l3 3v15H5zM8 3v5h7V3M8 21v-7h8v7"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
};
const ico = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = s => (s || 'qr').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'qr';
const TL = { url: 'Lien', text: 'Texte', wifi: 'Wi-Fi', vcard: 'Contact', email: 'E-mail', whatsapp: 'WhatsApp', sms: 'SMS' };
const THEME_KEY = 'mk-theme';
const getTheme = () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
function syncThemeToggle() {
  const t = getTheme();
  $$('[data-theme-toggle]').forEach(b => {
    const light = t === 'light';
    b.innerHTML = ico(light ? 'moon' : 'sun') + (b.dataset.label ? `<span>${light ? 'Sombre' : 'Clair'}</span>` : '');
    b.setAttribute('aria-label', light ? 'Passer en mode sombre' : 'Passer en mode clair');
    b.title = light ? 'Mode sombre' : 'Mode clair';
  });
}
function applyTheme(t) {
  if (t === 'light') document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  syncThemeToggle();
}
function toggleTheme() { applyTheme(getTheme() === 'light' ? 'dark' : 'light'); }

function toast(m, t = 'ok') {
  let box = $('#toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.append(box); }
  const e = document.createElement('div'); e.className = 'toast ' + (t === 'bad' ? 'bad' : ''); e.setAttribute('role', 'status'); e.textContent = m;
  box.append(e); setTimeout(() => e.remove(), 4200);
}
const LOGO = `<a class="logo" href="index.html"><i><img src="assets/icons/logo.svg" alt=""></i>MAKASI QR</a>`;
const footer = () => `<footer class="foot">© ${new Date().getFullYear()} <b>MAKASI QR</b> — un produit <b>Makasi</b> · Conçu par <b>Alphonse Design</b>. Tous droits réservés.</footer>`;

const profBtn = u => `<span class="pwrap"><button class="pbtn" id="pbtn" aria-label="${u ? 'Mon compte' : 'Se connecter ou créer un compte'}">${u ? esc((u.name || '?')[0].toUpperCase()) : ico('user')}</button></span>`;
function openAuth(mode = 'register') {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="card sheet" role="dialog" aria-modal="true" aria-label="Compte"><button class="x" aria-label="Fermer">×</button><div class="mb"></div><button class="btn sm guest" type="button">Continuer sans compte</button></div>`;
  document.body.append(m);
  const close = () => { m.remove(); document.removeEventListener('keydown', esc2); }, esc2 = e => e.key === 'Escape' && close();
  document.addEventListener('keydown', esc2);
  m.onclick = e => { if (e.target === m || e.target.closest('.x,.guest')) close(); };
  Auth.render($('.mb', m), mode);
}
function bindProfile(u) {
  const b = $('#pbtn'); if (!b) return;
  b.onclick = () => {
    if (!u) return openAuth();
    const old = $('.pmenu'); if (old) return old.remove();
    b.parentNode.insertAdjacentHTML('beforeend', `<div class="pmenu card"><b>${esc(u.name)}</b><small>${esc(u.email)}</small><button class="btn sm" id="so">${ico('logout')}Déconnexion</button></div>`);
    $('#so').onclick = () => Auth.signOut();
  };
  document.addEventListener('click', e => { if (!e.target.closest('.pwrap')) $('.pmenu')?.remove(); });
}
function bindTheme() {
  $$('[data-theme-toggle]').forEach(b => b.onclick = toggleTheme);
  syncThemeToggle();
}
function appShell(u) {
  const d = document.body.dataset, main = $('main');
  const nav = [['dashboard', 'Tableau de bord', 'grid'], ['generator', 'Générateur', 'qr'], ['my-qrcodes', 'Mes QR codes', 'library'], ['statistics', 'Statistiques', 'chart']];
  const w = document.createElement('div'); w.className = 'app';
  w.innerHTML = `<aside class="side">${LOGO}${nav.map(([p, l, i]) => `<a class="nav ${d.page === p ? 'on' : ''}" href="${p}.html">${ico(i)}${l}</a>`).join('')}<button class="nav theme-toggle" data-theme-toggle data-label="1" type="button">${ico(getTheme() === 'light' ? 'moon' : 'sun')}<span>${getTheme() === 'light' ? 'Sombre' : 'Clair'}</span></button></aside><div class="main"><div class="bar">${profBtn(u)}</div></div>`;
  document.body.prepend(w); $('.main', w).append(main); $('.main', w).insertAdjacentHTML('beforeend', footer());
  if (!u && sb && ['dashboard', 'my-qrcodes'].includes(d.page)) {
    main.insertAdjacentHTML('afterbegin', `<div class="card tip" style="margin-bottom:22px"><span data-ico="shield"></span><div><b>Vos QR codes sont sur cet appareil.</b><p>Créez un compte gratuit pour les retrouver partout et ne jamais les perdre.</p></div><button class="btn pri sm" id="gn">Créer un compte</button></div>`);
    $('[data-ico]', main).outerHTML = ico('shield'); $('#gn').onclick = () => openAuth('register');
  }
}
async function publicShell(u) {
  document.body.insertAdjacentHTML('afterbegin', `<div class="wrap"><nav class="top">${LOGO}<div class="links"><a class="btn pri sm" href="generator.html">Ouvrir le générateur</a><button class="btn sm theme-toggle" data-theme-toggle type="button" aria-label="Changer de thème">${ico(getTheme() === 'light' ? 'moon' : 'sun')}</button>${profBtn(u)}</div></nav></div>`);
  document.body.insertAdjacentHTML('beforeend', footer());
}
function home() {
  const inp = $('#demoIn'); if (!inp || typeof MKC === 'undefined') return;
  const q = MKC.make(inp.value, 260); q.append($('#demoQr'));
  inp.oninput = () => q.update({ data: inp.value || 'MAKASI QR' });
}
/* Révélation douce des sections au défilement (désactivée si mouvement réduit).
   Basée sur un écouteur de défilement : résiste aux sauts de page et aux ancres. */
function reveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.sec2,.band,.feat>div,.types,.hero>*').filter(el => !el.classList.contains('rv'));
  if (!els.length) return;
  els.forEach(el => el.classList.add('rv'));
  const check = () => {
    const h = innerHeight;
    els.forEach(el => { if (!el.classList.contains('in') && el.getBoundingClientRect().top < h - 30) el.classList.add('in'); });
    if (els.every(el => el.classList.contains('in'))) {
      removeEventListener('scroll', check); removeEventListener('resize', check);
    }
  };
  addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check);
  check();
}
async function init() {
  const d = document.body.dataset, u = await store.user();
  $$('[data-ico]').forEach(e => e.outerHTML = ico(e.dataset.ico));
  if (d.app !== undefined) appShell(u); else await publicShell(u);
  bindProfile(u);
  bindTheme();
  if (u) { const n = await store.importGuest(); if (n) toast(`${n} QR code(s) créés sans compte ont été ajoutés à votre compte.`); }
  if (d.page === 'home') home();
  reveal();
  document.dispatchEvent(new Event('mk-ready'));
}
document.addEventListener('DOMContentLoaded', init);
