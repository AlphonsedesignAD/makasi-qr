# MAKASI QR

© Makasi · Conçu par Alphonse Design

Site statique (HTML/CSS/JS) : déployez le dossier tel quel sur Vercel ou Netlify.

🔗 Dépôt : <https://github.com/AlphonsedesignAD/makasi-qr>

> 🔐 **Sécurité** : les clés privées ne sont jamais publiées. La clé `sb_publishable_…`
> présente dans `js/supabase.js` est publique **par conception** et protégée par la
> RLS de `supabase.sql`. Voir [`SECURITY.md`](SECURITY.md) avant toute contribution.

## Mode local (par défaut)
Sans configuration, comptes et QR codes sont stockés dans le navigateur.

## Mode cloud (Supabase)
1. Créez un projet sur supabase.com, puis renseignez `SUPABASE_URL` et `SUPABASE_KEY` (clé anon) dans `js/supabase.js`.
2. Exécutez `supabase.sql` (guide complet : `SUPABASE_GUIDE.md`).

```sql
create table qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null, type text not null, payload text not null,
  fields jsonb, style jsonb, downloads int default 0,
  created_at timestamptz default now()
);
alter table qr_codes enable row level security;
create policy "mes qr" on qr_codes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Python (optionnel)
`pip install "qrcode[pil]"` puis `python python/qr_processing.py "https://exemple.com" -o qr.png`
