const TYPES = {
  url: { l: TL.url, i: 'link', f: [['url', 'Adresse du site', 'url']], b: d => /^https?:\/\//i.test(d.url.trim()) ? d.url.trim() : 'https://' + d.url.trim() },
  text: { l: TL.text, i: 'text', f: [['text', 'Votre texte', 'textarea']], b: d => d.text },
  wifi: { l: TL.wifi, i: 'wifi', f: [['ssid', 'Nom du réseau'], ['pass', 'Mot de passe'], ['enc', 'Sécurité', 'select', ['WPA', 'WEP', 'nopass']]], b: d => `WIFI:T:${d.enc};S:${d.ssid};P:${d.pass};;` },
  vcard: { l: TL.vcard, i: 'user', f: [['name', 'Nom complet'], ['tel', 'Téléphone'], ['email', 'E-mail'], ['org', 'Organisation']], b: d => `BEGIN:VCARD\nVERSION:3.0\nFN:${d.name}\nTEL:${d.tel}\nEMAIL:${d.email}\nORG:${d.org}\nEND:VCARD` },
  email: { l: TL.email, i: 'mail', f: [['to', 'Adresse e-mail'], ['sub', 'Objet'], ['body', 'Message', 'textarea']], b: d => `mailto:${d.to}?subject=${encodeURIComponent(d.sub)}&body=${encodeURIComponent(d.body)}` },
  whatsapp: { l: TL.whatsapp, i: 'chat', f: [['tel', 'Numéro avec indicatif (ex. 243…)'], ['msg', 'Message prérempli', 'textarea']], b: d => `https://wa.me/${d.tel.replace(/\D/g, '')}?text=${encodeURIComponent(d.msg)}` },
  sms: { l: TL.sms, i: 'phone', f: [['tel', 'Numéro de téléphone'], ['msg', 'Message', 'textarea']], b: d => `SMSTO:${d.tel}:${d.msg}` }
};
let cur = 'url', vals = {}, editing = null, qr = null;
const payload = () => TYPES[cur].b(new Proxy(vals, { get: (o, k) => o[k] || '' }));
const valid = () => !!(vals[TYPES[cur].f[0][0]] || '').trim();
const name = () => $('#qname').value.trim() || `${TL[cur]} ${new Date().toLocaleDateString('fr-FR')}`;

function tabs() {
  $('#tabs').innerHTML = Object.entries(TYPES).map(([k, t]) => `<button type="button" class="tab ${k === cur ? 'on' : ''}" data-k="${k}">${ico(t.i)}${t.l}</button>`).join('');
  $$('#tabs .tab').forEach(b => b.onclick = () => { cur = b.dataset.k; vals = {}; tabs(); fields(); draw(); });
}
function fields() {
  $('#fields').innerHTML = TYPES[cur].f.map(([k, l, ty, o]) => {
    const v = esc(vals[k] || '');
    const inp = ty === 'textarea' ? `<textarea name="${k}" rows="3">${v}</textarea>`
      : ty === 'select' ? `<select name="${k}">${o.map(x => `<option ${vals[k] === x ? 'selected' : ''}>${x}</option>`).join('')}</select>`
      : `<input name="${k}" value="${v}" ${ty === 'url' ? 'placeholder="https://"' : ''}>`;
    return `<div class="fld"><label>${l}</label>${inp}</div>`;
  }).join('');
  $$('#fields [name]').forEach(e => { vals[e.name] ??= e.value; e.oninput = () => { vals[e.name] = e.value; draw(); }; });
}
function draw() {
  const ok = valid(), data = ok ? payload() : 'MAKASI QR';
  if (!qr) { qr = MKC.make(data, 300); qr.append($('#qrOut')); } else qr.update(MKC.opts(data, 300));
  $$('.needs').forEach(b => b.disabled = !ok);
  $('#hintEmpty').hidden = ok;
}
const dl = ext => {
  if (!valid()) return;
  MKC.make(payload(), 1024).download({ name: slug(name()), extension: ext });
  if (editing) store.list().then(L => { const q = L.find(x => x.id === editing); store.save({ id: editing, downloads: (q?.downloads || 0) + 1 }); });
};
document.addEventListener('mk-ready', async () => {
  const t0 = new URLSearchParams(location.search).get('type'); if (TYPES[t0]) cur = t0;
  tabs(); fields(); MKC.ui($('#custom'), draw); draw();
  $$('[data-dl]').forEach(b => b.onclick = () => dl(b.dataset.dl));
  $('#save').onclick = async () => {
    if (!valid()) return toast('Remplissez d’abord le contenu du QR code.', 'bad');
    try {
      const q = { name: name(), type: cur, payload: payload(), fields: { ...vals }, style: MKC.get() }; if (editing) q.id = editing;
      editing = (await store.save(q)).id; toast((await store.user()) || !sb ? 'QR code enregistré.' : 'Enregistré sur cet appareil. Créez un compte pour le retrouver partout.');
    } catch (e) { toast('Enregistrement impossible : ' + e.message, 'bad'); }
  };
  const id = new URLSearchParams(location.search).get('id');
  if (id) { const q = (await store.list()).find(x => x.id === id); if (q) { editing = id; cur = q.type; vals = { ...q.fields }; $('#qname').value = q.name; MKC.set(q.style); tabs(); fields(); draw(); } }
});
