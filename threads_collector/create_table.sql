create table public.threads_documents (
  url text primary key,

  -- LLM generated metadata
  title text not null,
  summary text not null,

  -- Document-level categories
  tags text[] not null default '{}',


  key_points jsonb not null default '[]'::jsonb,

  -- 收藏時間
  saved_at timestamptz not null default now(),

  constraint threads_documents_key_points_is_array
    check (jsonb_typeof(key_points) = 'array')
);

-- 查詢 document tags 時使用
create index threads_documents_tags_idx
  on public.threads_documents
  using gin (tags);


-- 如果之後會搜尋 / filter key_points JSONB，可以保留這個 index
create index threads_documents_key_points_idx
  on public.threads_documents
  using gin (key_points);


create table public.threads_items (
  url text primary key,

  -- 所屬 Threads 主貼文
  source_url text not null,

  -- post / reply
  type text not null,

  author text,
  published_at timestamptz,

  -- Threads 原始文字
  text text not null,

  -- 此 item 支援哪些 document key points
  -- 建議這裡存 key point ID，例如：
  -- {"kp_01", "kp_03"}
  tags text[] not null default '{}',

  constraint threads_items_source_url_fkey
    foreign key (source_url)
    references public.threads_documents (url)
    on delete cascade,

  constraint threads_items_type_check
    check (type in ('post', 'reply'))
);

-- 最常用的查詢：
-- select * from threads_items where source_url = ?
create index threads_items_source_url_idx
  on public.threads_items (source_url);


-- 如果會按照發文時間排序
create index threads_items_published_at_idx
  on public.threads_items (published_at);


-- 查哪些 item 支援某個 key point
create index threads_items_tags_idx
  on public.threads_items
  using gin (tags);
