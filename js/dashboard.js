const dt = d => new Date(d).toLocaleDateString('fr-FR');
const emptyBox = `<div class="card empty">${ico('qr')}<h3>Aucun QR code pour le moment</h3><p>Créez votre premier code en moins d’une minute.</p><a class="btn pri" href="generator.html">${ico('plus')}Créer un QR code</a></div>`;

function cards(el, L) {
  el.innerHTML = L.length ? L.map(q => `<article class="card qc" data-id="${q.id}"><div class="pv"></div>
    <div><h3>${esc(q.name)}</h3><small>${TL[q.type] || q.type} · ${dt(q.created_at)} · ${q.downloads || 0} téléch.</small></div>
    <div class="row"><button class="btn sm" data-a="dl">${ico('download')}PNG</button><a class="btn sm" href="generator.html?id=${q.id}">${ico('edit')}Modifier</a><button class="btn sm dng" data-a="rm" aria-label="Supprimer">${ico('trash')}</button></div></article>`).join('') : emptyBox;
  L.forEach(q => MKC.make(q.payload, 170, q.style).append($(`[data-id="${q.id}"] .pv`, el)));
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const card = b.closest('[data-id]'), q = L.find(x => x.id === card.dataset.id);
    try {
      if (b.dataset.a === 'dl') { MKC.make(q.payload, 1024, q.style).download({ name: slug(q.name), extension: 'png' }); q.downloads = (q.downloads || 0) + 1; await store.save({ id: q.id, downloads: q.downloads }); }
      else if (confirm('Supprimer ce QR code ?')) { await store.remove(q.id); L.splice(L.indexOf(q), 1); card.remove(); toast('QR code supprimé.'); }
    } catch (x) { toast(x.message, 'bad'); }
  };
}
const pages = {
  dashboard(L) {
    const wk = L.filter(q => Date.now() - new Date(q.created_at) < 7 * 864e5).length;
    const S = [['qr', L.length, 'QR codes créés'], ['download', L.reduce((a, q) => a + (q.downloads || 0), 0), 'Téléchargements'], ['palette', new Set(L.map(q => q.type)).size, 'Types utilisés'], ['bolt', wk, 'Créés cette semaine']];
    $('#stats').innerHTML = S.map(([i, n, l]) => `<div class="card stat"><span>${ico(i)}${l}</span><div class="n">${n}</div></div>`).join('');
    cards($('#recent'), L.slice(0, 4));
    $('#quick').innerHTML = Object.entries(TL).map(([k, v]) => `<a class="qk" href="generator.html?type=${k}">${ico({ url: 'link', text: 'text', wifi: 'wifi', vcard: 'user', email: 'mail', whatsapp: 'chat', sms: 'phone' }[k])}<b>${v}</b></a>`).join('');
    store.user().then(u => $('#hello').textContent = u ? 'Bonjour ' + u.name.split(' ')[0] + ' 👋' : 'Bienvenue 👋');
  },
  'my-qrcodes'(L) {
    const go = () => { const t = $('#search').value.toLowerCase(), k = $('#ftype').value; cards($('#list'), L.filter(q => q.name.toLowerCase().includes(t) && (!k || q.type === k))); };
    $('#ftype').innerHTML = '<option value="">Tous les types</option>' + Object.entries(TL).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    $('#search').oninput = $('#ftype').onchange = go; go();
  },
  statistics(L) {
    const days = [...Array(14)].map((_, i) => { const d = new Date(Date.now() - (13 - i) * 864e5); return { k: d.toDateString(), l: d.getDate(), n: 0 }; });
    L.forEach(q => { const d = days.find(x => x.k === new Date(q.created_at).toDateString()); if (d) d.n++; });
    const mx = Math.max(1, ...days.map(d => d.n));
    $('#bars').innerHTML = days.map(d => `<div title="${d.n} QR code(s)"><span>${d.n || ''}</span><i style="height:${d.n / mx * 140}px"></i>${d.l}</div>`).join('');
    const by = Object.keys(TL).map(k => [k, L.filter(q => q.type === k).length]).sort((a, b) => b[1] - a[1]), m2 = Math.max(1, by[0][1]);
    $('#types').innerHTML = by.map(([k, n]) => `<div class="hbar"><span>${TL[k]}</span><i style="width:${n / m2 * 100}%;min-width:4px"></i><b>${n}</b></div>`).join('');
    const top = [...L].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5).filter(q => q.downloads);
    $('#top').innerHTML = top.length ? top.map(q => `<div class="hbar"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(q.name)}</span><i style="width:${q.downloads / top[0].downloads * 100}%;min-width:4px"></i><b>${q.downloads}</b></div>`).join('') : '<p class="note">Aucun téléchargement pour le moment.</p>';
  }
};
document.addEventListener('mk-ready', async () => {
  let L = []; try { L = await store.list(); } catch (e) { toast('Chargement impossible : ' + e.message, 'bad'); }
  pages[document.body.dataset.page]?.(L);
});
