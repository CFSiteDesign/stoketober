-- Stoketoberfest giveaway entries (shared MM-indo-giveaway Supabase project, ref bunucgwewziajfbiwnhp)
create table if not exists public.stoketober_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  source text default 'direct',
  created_at timestamptz default now()
);

alter table public.stoketober_entries enable row level security;

drop policy if exists "public can insert entries" on public.stoketober_entries;
create policy "public can insert entries"
  on public.stoketober_entries for insert to anon, authenticated with check (true);

drop policy if exists "admins can read entries" on public.stoketober_entries;
create policy "admins can read entries"
  on public.stoketober_entries for select to authenticated using (true);
