-- Todo 앱 테이블 (Supabase SQL Editor에서 실행)

-- 회원 프로필: auth.users와 1:1
create table if not exists public.profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    name        text not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz,
    deleted_at  timestamptz
);

-- 할일
create table if not exists public.todos (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references public.profiles (id) on delete cascade,
    user_name   text not null,
    status      text not null default 'READY' check (status in ('READY', 'PROGRESS', 'DONE')),
    title       text not null,
    content     text not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz,
    deleted_at  timestamptz
);

-- RLS: 본인 데이터만 접근
alter table public.profiles enable row level security;
alter table public.todos enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
    for all to authenticated
    using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "todos_own" on public.todos;
create policy "todos_own" on public.todos
    for all to authenticated
    using (user_id = auth.uid()) with check (user_id = auth.uid());
