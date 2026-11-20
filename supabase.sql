-- ============================================================
--  MAKASI QR — à coller dans Supabase > SQL Editor > Run
--  Ce script est re-jouable sans risque (if not exists / drop policy).
-- ============================================================

-- 1) Table -----------------------------------------------------
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  type text not null check (type in ('url','text','wifi','vcard','email','whatsapp','sms')),
  payload text not null check (char_length(payload) <= 2000),
  fields jsonb,
  style jsonb check (style is null or pg_column_size(style) < 200000),
  downloads int not null default 0 check (downloads >= 0),
  created_at timestamptz not null default now()
);

create index if not exists qr_codes_user_created_idx
  on public.qr_codes (user_id, created_at desc);

-- 2) RLS -------------------------------------------------------
alter table public.qr_codes enable row level security;
alter table public.qr_codes force row level security;

drop policy if exists "lire mes qr"      on public.qr_codes;
drop policy if exists "creer mes qr"     on public.qr_codes;
drop policy if exists "modifier mes qr"  on public.qr_codes;
drop policy if exists "supprimer mes qr" on public.qr_codes;

create policy "lire mes qr"       on public.qr_codes for select to authenticated using (user_id = (select auth.uid()));
create policy "creer mes qr"      on public.qr_codes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "modifier mes qr"   on public.qr_codes for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "supprimer mes qr"  on public.qr_codes for delete to authenticated using (user_id = (select auth.uid()));

-- 3) GRANTs ----------------------------------------------------
-- RLS filtre les LIGNES ; les GRANT ouvrent l'accès à la TABLE.
-- Sans ces lignes : « permission denied for table qr_codes ».
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.qr_codes to authenticated;

-- Aucun accès pour les visiteurs non connectés (le site utilise le localStorage).
revoke all on public.qr_codes from anon;

-- 4) Vérification (facultatif) --------------------------------
-- Doit renvoyer : authenticated | SELECT/INSERT/UPDATE/DELETE
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'qr_codes'
order by grantee, privilege_type;
