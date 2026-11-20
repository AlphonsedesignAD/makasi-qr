/* MAKASI QR — données.
   Sans compte : les QR codes restent sur l'appareil (localStorage).
   Avec compte (Supabase) : ils sont enregistrés en ligne, protégés par RLS. */
const SUPABASE_URL = "https://lopaqtgbeorlmbtwlqjg.supabase.co";   // ex. https://xxxx.supabase.co
const SUPABASE_KEY = "sb_publishable_S4it_UNBPl0wk71UPhtDCw_Pra8aWKn";   // clé publique (anon / publishable) — jamais la clé service_role
const sb = (SUPABASE_URL && SUPABASE_KEY && window.supabase) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const pick = ({ name, type, payload, fields, style, downloads }) => Object.fromEntries(Object.entries({ name, type, payload, fields, style, downloads }).filter(([, v]) => v !== undefined));
const G = 'mk_guest', lget = () => JSON.parse(localStorage.getItem(G) || '[]'), lset = l => localStorage.setItem(G, JSON.stringify(l));

const store = {
  async user() {
    if (!sb) return null;
    try { const { data } = await sb.auth.getUser(); const u = data?.user; return u ? { id: u.id, email: u.email, name: u.user_metadata?.name || u.user_metadata?.full_name || u.email } : null; } catch { return null; }
  },
  async list() {
    if (await this.user()) { const { data, error } = await sb.from('qr_codes').select('*').order('created_at', { ascending: false }); if (error) throw error; return data; }
    return lget();
  },
  async save(q) {
    if (await this.user()) {
      const r = q.id ? await sb.from('qr_codes').update(pick(q)).eq('id', q.id).select().single() : await sb.from('qr_codes').insert(pick(q)).select().single();
      if (r.error) throw r.error; return r.data;
    }
    const all = lget();
    if (q.id) { const i = all.findIndex(x => x.id === q.id); all[i] = { ...all[i], ...q }; q = all[i]; }
    else { q = { ...q, id: crypto.randomUUID(), downloads: 0, created_at: new Date().toISOString() }; all.unshift(q); }
    lset(all); return q;
  },
  async remove(id) {
    if (await this.user()) { const { error } = await sb.from('qr_codes').delete().eq('id', id); if (error) throw error; return; }
    lset(lget().filter(x => x.id !== id));
  },
  async importGuest() { // à la connexion : ajoute au compte les QR codes créés sans compte
    const g = lget(); if (!g.length || !(await this.user())) return 0;
    const { error } = await sb.from('qr_codes').insert(g.map(pick)); if (error) return 0;
    localStorage.removeItem(G); return g.length;
  }
};
