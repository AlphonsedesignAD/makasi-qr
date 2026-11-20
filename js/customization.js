/* Personnalisation visuelle du QR code (couleurs, formes, logo) — basé sur qr-code-styling */
const MKC = (() => {
  const D = { fg: '#1B1240', bg: '#FFFFFF', fg2: '#7B5CFF', grad: true, dots: 'rounded', corner: 'extra-rounded', cdot: 'dot', ec: 'M', logo: '', margin: 8 };
  const P = [['Makasi', '#1B1240', '#FFFFFF', '#7B5CFF', true], ['Or', '#3A2A00', '#FFF8E1', '#E0A000', true], ['Forêt', '#0B3D2E', '#FFFFFF', '#1FA971', true], ['Corail', '#7A1F2B', '#FFFFFF', '#E0485C', true], ['Classique', '#000000', '#FFFFFF', '#000000', false]];
  let S = { ...D }, sync = null;
  const opts = (data, size, s = S) => {
    s = { ...D, ...s };
    return {
      width: size, height: size, type: 'canvas', data: data || 'MAKASI QR', margin: s.margin, image: s.logo || undefined,
      qrOptions: { errorCorrectionLevel: s.logo ? 'H' : s.ec },
      dotsOptions: s.grad ? { type: s.dots, gradient: { type: 'linear', rotation: .785, colorStops: [{ offset: 0, color: s.fg }, { offset: 1, color: s.fg2 }] } } : { type: s.dots, color: s.fg },
      cornersSquareOptions: { type: s.corner, color: s.fg }, cornersDotOptions: { type: s.cdot, color: s.fg },
      backgroundOptions: { color: s.bg }, imageOptions: { crossOrigin: 'anonymous', margin: 6, imageSize: .28 }
    };
  };
  const sel = (k, l, o) => `<div class="fld"><label>${l}</label><select data-k="${k}">${o.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></div>`;
  return {
    make: (data, size = 300, s = S) => new QRCodeStyling(opts(data, size, s)),
    opts,
    get: () => ({ ...S }),
    set(s) { S = { ...D, ...s }; sync && sync(); },
    ui(el, cb) {
      el.innerHTML = `<div class="two"><div class="fld"><label>Couleur des points</label><input type="color" data-k="fg"></div><div class="fld"><label>Couleur du fond</label><input type="color" data-k="bg"></div></div>
      <label class="chk"><input type="checkbox" data-k="grad"> Dégradé sur les points</label>
      <div class="fld" id="g2"><label>Deuxième couleur</label><input type="color" data-k="fg2"></div>
      <div class="presets">${P.map((p, i) => `<button type="button" class="pre" data-p="${i}" title="${p[0]}" aria-label="Style ${p[0]}" style="background:linear-gradient(135deg,${p[1]},${p[3]})"></button>`).join('')}</div>
      <p class="hint">Gardez des points plus foncés que le fond : c’est le plus fiable à scanner.</p>
      ${sel('dots', 'Forme des points', [['square', 'Carrés'], ['dots', 'Ronds'], ['rounded', 'Arrondis'], ['extra-rounded', 'Très arrondis'], ['classy', 'Élégants'], ['classy-rounded', 'Élégants arrondis']])}
      <div class="two">${sel('corner', 'Cadre des coins', [['square', 'Carré'], ['extra-rounded', 'Arrondi'], ['dot', 'Rond']])}${sel('cdot', 'Centre des coins', [['square', 'Carré'], ['dot', 'Rond']])}</div>
      ${sel('ec', 'Correction d’erreur', [['L', 'Basse (7 %)'], ['M', 'Moyenne (15 %)'], ['Q', 'Haute (25 %)'], ['H', 'Maximale (30 %)']])}
      <div class="fld"><label>Marge</label><input type="range" min="0" max="30" data-k="margin"></div>
      <div class="fld"><label>Logo au centre (PNG, JPG, SVG)</label><input type="file" accept="image/*" id="logoIn"></div>
      <button type="button" class="btn sm" id="logoRm">${ico('trash')}Retirer le logo</button>`;
      sync = () => { $$('[data-k]', el).forEach(i => { const v = S[i.dataset.k]; i.type === 'checkbox' ? i.checked = !!v : i.value = v; }); $('#g2', el).hidden = !S.grad; };
      el.oninput = e => { const i = e.target.closest('[data-k]'); if (!i) return; S[i.dataset.k] = i.type === 'checkbox' ? i.checked : i.type === 'range' ? +i.value : i.value; sync(); cb(); };
      el.onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const p = P[b.dataset.p]; Object.assign(S, { fg: p[1], bg: p[2], fg2: p[3], grad: p[4] }); sync(); cb(); };
      $('#logoIn', el).onchange = e => {
        const f = e.target.files[0]; if (!f) return; const img = new Image();
        img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d'), r = Math.min(160 / img.width, 160 / img.height); x.drawImage(img, (160 - img.width * r) / 2, (160 - img.height * r) / 2, img.width * r, img.height * r); S.logo = c.toDataURL('image/png'); cb(); };
        img.src = URL.createObjectURL(f);
      };
      $('#logoRm', el).onclick = () => { S.logo = ''; $('#logoIn', el).value = ''; cb(); };
      sync();
    }
  };
})();
