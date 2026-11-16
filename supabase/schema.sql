-- NovoCode — Supabase schema. Run once in the Supabase SQL editor.
-- Each user sees and edits only their own projects (row level security).

create table if not exists public.projects (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  data        jsonb not null,          -- the whole project: files, messages, publish info
  updated_at  timestamptz not null default now()
);

create index if not exists projects_user_updated on public.projects (user_id, updated_at desc);

alter table public.projects enable row level security;

drop policy if exists "own projects: read" on public.projects;
drop policy if exists "own projects: write" on public.projects;
create policy "own projects: read"  on public.projects for select using (auth.uid() = user_id);
create policy "own projects: write" on public.projects for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);
