-- MAKASI QR — à coller dans Supabase > SQL Editor > Run
create table public.qr_codes (
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
create index on public.qr_codes (user_id, created_at desc);

alter table public.qr_codes enable row level security;
alter table public.qr_codes force row level security;

create policy "lire mes qr"       on public.qr_codes for select to authenticated using (user_id = (select auth.uid()));
create policy "creer mes qr"      on public.qr_codes for insert to authenticated with check (user_id = (select auth.uid()));
create policy "modifier mes qr"   on public.qr_codes for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "supprimer mes qr"  on public.qr_codes for delete to authenticated using (user_id = (select auth.uid()));

revoke all on public.qr_codes from anon;
