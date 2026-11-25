create table if not exists public.study_records (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  id text not null,
  kind text not null,
  body jsonb not null,
  updated timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.study_records enable row level security;
revoke all on public.study_records from anon, authenticated;
grant select, insert, update on public.study_records to authenticated;
create policy "Owner study records" on public.study_records for all
to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
insert into storage.buckets (id, name, public, file_size_limit)
values ('preply-private', 'preply-private', false, 5242880)
on conflict (id) do nothing;
create policy "Owner Preply files" on storage.objects for all to authenticated
using (bucket_id = 'preply-private' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'preply-private' and (storage.foldername(name))[1] = (select auth.uid())::text);
