-- ============================================================
-- Threads tables RLS
--
-- 需求：
-- 1. anon / authenticated 都可以讀取
-- 2. 只有指定的 Supabase Auth 使用者可以 INSERT / UPDATE / DELETE
-- 3. Edge Function 使用 ctx.supabaseAdmin 時 bypass RLS
-- ============================================================


-- ============================================================
-- 1. 啟用 RLS
-- ============================================================

alter table public.threads_documents
enable row level security;

alter table public.threads_items
enable row level security;


-- ============================================================
-- 2. 先清掉 anon / authenticated 現有 table privileges
--    再明確給需要的權限
-- ============================================================

revoke all
on table public.threads_documents
from anon, authenticated;

revoke all
on table public.threads_items
from anon, authenticated;


-- 未登入訪客只能讀
grant select
on table public.threads_documents
to anon;

grant select
on table public.threads_items
to anon;


-- 已登入使用者：
-- RLS 會再決定誰真正可以寫
grant select, insert, update, delete
on table public.threads_documents
to authenticated;

grant select, insert, update, delete
on table public.threads_items
to authenticated;


-- ============================================================
-- 3. 移除舊 policy
--    policy 名稱如果不存在也不會報錯
-- ============================================================

drop policy if exists "Public can read threads_documents"
on public.threads_documents;

drop policy if exists "Only owner can insert threads_documents"
on public.threads_documents;

drop policy if exists "Only owner can update threads_documents"
on public.threads_documents;

drop policy if exists "Only owner can delete threads_documents"
on public.threads_documents;


drop policy if exists "Public can read threads_items"
on public.threads_items;

drop policy if exists "Only owner can insert threads_items"
on public.threads_items;

drop policy if exists "Only owner can update threads_items"
on public.threads_items;

drop policy if exists "Only owner can delete threads_items"
on public.threads_items;


-- ============================================================
-- 4. threads_documents
-- ============================================================

-- 所有人都可以讀，包括未登入使用者
create policy "Public can read threads_documents"
on public.threads_documents
for select
to anon, authenticated
using (true);


-- 只有你的 Supabase Auth account 可以新增
create policy "Only owner can insert threads_documents"
on public.threads_documents
for insert
to authenticated
with check (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);


-- 只有你的 Supabase Auth account 可以修改
create policy "Only owner can update threads_documents"
on public.threads_documents
for update
to authenticated
using (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
)
with check (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);


-- 只有你的 Supabase Auth account 可以刪除
create policy "Only owner can delete threads_documents"
on public.threads_documents
for delete
to authenticated
using (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);


-- ============================================================
-- 5. threads_items
-- ============================================================

-- 所有人都可以讀，包括未登入使用者
create policy "Public can read threads_items"
on public.threads_items
for select
to anon, authenticated
using (true);


-- 只有你的 Supabase Auth account 可以新增
create policy "Only owner can insert threads_items"
on public.threads_items
for insert
to authenticated
with check (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);


-- 只有你的 Supabase Auth account 可以修改
create policy "Only owner can update threads_items"
on public.threads_items
for update
to authenticated
using (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
)
with check (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);


-- 只有你的 Supabase Auth account 可以刪除
create policy "Only owner can delete threads_items"
on public.threads_items
for delete
to authenticated
using (
  (select auth.uid()) =
  'b1176932-4a30-4508-9ef1-f483e236be0a'::uuid
);
