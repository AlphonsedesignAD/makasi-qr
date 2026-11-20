const GSVG = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.700 8.300 6.300 14.700z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const Auth = {
  need() { if (!sb) { toast('Les comptes ne sont pas encore activés sur ce site.', 'bad'); return true; } },
  async google() { if (this.need()) return; const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } }); if (error) toast(error.message, 'bad'); },
  async signOut() { if (sb) await sb.auth.signOut(); location.href = 'index.html'; },
  render(el, mode = 'register', done = () => location.reload()) {
    const reg = () => mode === 'register';
    const draw = () => {
      el.innerHTML = `<h2 class="ah">${reg() ? 'Enregistrez vos projets' : 'Bon retour'}</h2><p class="ap">${reg() ? 'Créez un compte gratuit pour retrouver vos QR codes sur tous vos appareils.' : 'Connectez-vous pour retrouver vos QR codes.'}</p>
      <button type="button" class="btn gbtn" id="g">${GSVG}Continuer avec Google</button><div class="or"><span>ou avec votre e-mail</span></div>
      <form>${reg() ? '<div class="fld"><label>Nom</label><input name="name" required autocomplete="name"></div>' : ''}<div class="fld"><label>E-mail</label><input name="email" type="email" required autocomplete="email"></div>
      <div class="fld"><label>Mot de passe${reg() ? ' (8 caractères minimum)' : ''}</label><input name="pw" type="password" required ${reg() ? 'minlength="8"' : ''} autocomplete="${reg() ? 'new' : 'current'}-password"></div>
      <button class="btn pri" style="width:100%">${reg() ? 'Créer mon compte' : 'Se connecter'}</button></form>
      <p class="alt">${reg() ? 'Déjà inscrit ?' : 'Pas encore de compte ?'} <a href="#" id="sw">${reg() ? 'Se connecter' : 'Créer un compte'}</a></p>`;
      $('#sw', el).onclick = e => { e.preventDefault(); mode = reg() ? 'login' : 'register'; draw(); };
      $('#g', el).onclick = () => Auth.google();
      $('form', el).onsubmit = async e => {
        e.preventDefault(); if (Auth.need()) return; const b = $('form .pri', el); b.disabled = true;
        const d = Object.fromEntries(new FormData(e.target));
        try {
          if (reg()) {
            const { data, error } = await sb.auth.signUp({ email: d.email.trim(), password: d.pw, options: { data: { name: d.name.trim() } } });
            if (error) throw error;
            if (!data.session) { toast('Compte créé. Confirmez votre e-mail, puis connectez-vous.'); mode = 'login'; draw(); return; }
          } else {
            const { error } = await sb.auth.signInWithPassword({ email: d.email.trim(), password: d.pw });
            if (error) throw new Error('E-mail ou mot de passe incorrect.');
          }
          done();
        } catch (x) { toast(x.message, 'bad'); b.disabled = false; }
      };
    };
    draw();
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const b = $('#authBox'); if (b) Auth.render(b, b.dataset.mode, () => location.href = 'generator.html');
});
