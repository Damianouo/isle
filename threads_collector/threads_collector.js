// ==UserScript==
// @name         Threads Collector
// @namespace    local.threads.collector
// @version      2.0.0
// @description  Collect Threads posts/replies and send JSON to a Supabase Edge Function.
// @match        https://www.threads.com/*
// @match        https://threads.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      mjxspoqkeuunuqoghcid.supabase.co
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const APP_ID = '__threads_virtual_collector__';
  const LAUNCHER_ID = '__threads_virtual_collector_launcher__';

  document.getElementById(APP_ID)?.remove();
  document.getElementById(LAUNCHER_ID)?.remove();

  const CONFIG = {
    EDGE_URL: 'https://mjxspoqkeuunuqoghcid.supabase.co/functions/v1/openrouter-chat',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_kspgHNFi3JTmPoDPhD5eJA_5lx3timS',
    COLLECTOR_TOKEN: '0zkXky{g?>r<RN[GHr_*MlZEzAY/t0-%',
    AUTO_COPY_ON_FINISH: true,
    AUTO_SEND_ON_FINISH: false,
    EDGE_TIMEOUT_MS: 90000,
    SCROLL_RATIO: 0.72,
    MIN_SCROLL_STEP: 360,
    AFTER_SCROLL_MS: 550,
    BOTTOM_STABLE_ROUNDS: 5,
    MIN_IDLE_AFTER_NEW_MS: 4500,
    MAX_LOOPS: 1600,
    BOTTOM_BOUNCE_RATIO: 0.62,
  };

  const EXCLUDE_POSTS = [
    '卡',
    '卡一個',
    '卡位',
    '先卡',
    '卡著',
    '存',
    '先存',
    '收藏',
    '留己看',
    '留著看',
    '留友看',
    '留給朋友看',
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const $all = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const main = document.querySelector('main,[role="main"]') || document.body;

  const store = new Map();
  const excludedUrls = new Set();

  let running = false;
  let loops = 0;
  let stableBottom = 0;
  let lastNewAt = Date.now();

  let observerQueued = false;
  let sending = false;
  let observerStarted = false;

  /* =========================================================
     URL
     ========================================================= */

  function canonicalizeThreadsUrl(input) {
    try {
      const url = new URL(input, location.href);
      url.search = '';
      url.hash = '';
      url.protocol = 'https:';
      url.hostname = 'www.threads.com';
      url.pathname = url.pathname.replace(/\/+$/, '');
      return url.toString();
    } catch (_) {
      return '';
    }
  }

  function cleanUrl(href) {
    try {
      const url = new URL(href, location.href);
      const match = url.pathname.match(/\/@[^/]+\/(?:post|t)\/[^/?#]+/i);
      if (!match) {
        return '';
      }
      return canonicalizeThreadsUrl(`https://www.threads.com${match[0]}`);
    } catch (_) {
      return '';
    }
  }

  function isPostUrl(href) {
    return /\/@[^/]+\/(?:post|t)\//i.test(href || '');
  }

  function pathOf(url) {
    try {
      return new URL(url).pathname.replace(/\/+$/, '');
    } catch (_) {
      return '';
    }
  }

  function pageUrl() {
    return cleanUrl(location.href) || canonicalizeThreadsUrl(location.href);
  }

  /* =========================================================
     Author
     ========================================================= */

  function authorFromUrl(url) {
    try {
      const pathname = new URL(url).pathname;
      const match = pathname.match(/^\/@([^/]+)\/(?:post|t)\//i);
      return match?.[1] || null;
    } catch (_) {
      return null;
    }
  }

  function authorFromRoot(root) {
    for (const link of $all('a[href]', root)) {
      try {
        const url = new URL(link.href, location.href);
        const match = url.pathname.match(/^\/@([^/]+)(?:\/)?$/i);
        if (match?.[1]) {
          return match[1];
        }
      } catch (_) {}
    }
    return null;
  }

  function extractAuthor(root, url) {
    return authorFromUrl(url) || authorFromRoot(root) || null;
  }

  /* =========================================================
     Time
     ========================================================= */

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function timezoneOffsetString(date) {
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absolute = Math.abs(offsetMinutes);
    const hours = Math.floor(absolute / 60);
    const minutes = absolute % 60;
    return `${sign}${pad2(hours)}:${pad2(minutes)}`;
  }

  function formatDateOnly(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }
    return [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join('-');
  }

  function formatDateHour(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }
    return (
      `${formatDateOnly(date)}T` + `${pad2(date.getHours())}:00:00` + timezoneOffsetString(date)
    );
  }

  /**
   * 絕對 datetime。
   *
   * 如果來源本身包含時分資訊：
   *   2026-09-10T10:30:00+08:00
   * 會轉成：
   *   2026-09-10T10:00:00+08:00
   *
   * 如果來源只有日期：
   *   2026-09-10
   * 保留：
   *   2026-09-10
   */
  function parseAbsoluteTime(value) {
    const raw = String(value || '').trim();
    if (!raw) {
      return null;
    }
    // 單純 YYYY-MM-DD
    const dateOnlyMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`;
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    // ISO / datetime 有時間資訊
    if (/T\d{1,2}:\d{2}/i.test(raw) || /\d{1,2}:\d{2}/.test(raw)) {
      return formatDateHour(date);
    }
    return formatDateOnly(date);
  }

  /**
   * Threads 相對時間，例如：
   *
   * 10秒
   * 5分鐘
   * 3小時
   * 2天
   * 1週
   * 3個月
   * 1年
   *
   * 英文：
   * 10s
   * 5m
   * 3h
   * 2d
   * 1w
   * 3mo
   * 1y
   */
  function parseRelativeTime(value, now = new Date()) {
    let raw = String(value || '')
      .normalize('NFKC')
      .trim()
      .toLowerCase();
    if (!raw) {
      return null;
    }
    raw = raw.replace(/\s+/g, '').replace(/ago$/i, '').replace(/前$/, '');
    if (/^(剛剛|刚刚|現在|现在|justnow|now)$/.test(raw)) {
      return formatDateHour(now);
    }
    let match;
    /*
     * 秒
     *
     * 因為秒數仍代表今天的具體時間，
     * 最終只保留到小時。
     */
    match = raw.match(/^(\d+)(?:s|sec|secs|second|seconds|秒)$/);
    if (match) {
      const date = new Date(now.getTime() - Number(match[1]) * 1000);
      return formatDateHour(date);
    }
    /*
     * 分鐘
     */
    match = raw.match(/^(\d+)(?:m|min|mins|minute|minutes|分鐘|分钟|分)$/);
    if (match) {
      const date = new Date(now.getTime() - Number(match[1]) * 60 * 1000);
      return formatDateHour(date);
    }
    /*
     * 小時
     */
    match = raw.match(/^(\d+)(?:h|hr|hrs|hour|hours|小時|小时|時|时)$/);
    if (match) {
      const date = new Date(now.getTime() - Number(match[1]) * 60 * 60 * 1000);
      return formatDateHour(date);
    }
    /*
     * 天
     *
     * Threads 如果只告訴我們「3 天前」，
     * 無法知道當天的確切小時，因此只保留日期。
     */
    match = raw.match(/^(\d+)(?:d|day|days|天|日)$/);
    if (match) {
      const date = new Date(now);
      date.setDate(date.getDate() - Number(match[1]));
      return formatDateOnly(date);
    }
    /*
     * 週
     */
    match = raw.match(/^(\d+)(?:w|wk|wks|week|weeks|週|周)$/);
    if (match) {
      const date = new Date(now);
      date.setDate(date.getDate() - Number(match[1]) * 7);
      return formatDateOnly(date);
    }
    /*
     * 月
     *
     * 不用 30 天估算，
     * 直接使用 calendar month。
     */
    match = raw.match(/^(\d+)(?:mo|mos|month|months|個月|个月|月)$/);
    if (match) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - Number(match[1]));
      return formatDateOnly(date);
    }
    /*
     * 年
     */
    match = raw.match(/^(\d+)(?:y|yr|yrs|year|years|年)$/);
    if (match) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - Number(match[1]));
      return formatDateOnly(date);
    }
    /*
     * 昨天 / yesterday
     */
    if (raw === '昨天' || raw === '昨日' || raw === 'yesterday') {
      const date = new Date(now);
      date.setDate(date.getDate() - 1);
      return formatDateOnly(date);
    }
    return null;
  }

  function extractPublishedAt(root) {
    /*
     * 第一優先：
     * Threads DOM 的 <time datetime="...">
     */
    const timeElements = $all('time', root);
    for (const time of timeElements) {
      const datetime = time.getAttribute('datetime');
      if (datetime) {
        const parsed = parseAbsoluteTime(datetime);
        if (parsed) {
          return parsed;
        }
      }
    }
    /*
     * 第二優先：
     * <time title="">
     */
    for (const time of timeElements) {
      const title = time.getAttribute('title');
      if (title) {
        const absolute = parseAbsoluteTime(title);
        if (absolute) {
          return absolute;
        }
        const relative = parseRelativeTime(title);
        if (relative) {
          return relative;
        }
      }
    }
    /*
     * 第三優先：
     * time 元素本身顯示的文字，例如：
     *
     * 3小時
     * 2天
     */
    for (const time of timeElements) {
      const text = time.textContent?.trim();
      const relative = parseRelativeTime(text);
      if (relative) {
        return relative;
      }
      const absolute = parseAbsoluteTime(text);
      if (absolute) {
        return absolute;
      }
    }
    /*
     * 第四優先：
     * aria-label
     *
     * Threads 有時時間資訊藏在這裡。
     */
    const labelled = $all('[aria-label]', root);
    for (const element of labelled) {
      const label = element.getAttribute('aria-label');
      if (!label) {
        continue;
      }
      const relative = parseRelativeTime(label);
      if (relative) {
        return relative;
      }
      /*
       * aria-label 可能不是純時間，
       * 所以只對明顯像日期的內容做絕對時間解析。
       */
      if (/\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(label)) {
        const absolute = parseAbsoluteTime(label);
        if (absolute) {
          return absolute;
        }
      }
    }
    /*
     * 最後 fallback：
     * 從貼文文字每一行找相對時間。
     */
    const lines = String(root.innerText || '')
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const line of lines) {
      const relative = parseRelativeTime(line);
      if (relative) {
        return relative;
      }
    }
    return null;
  }

  /* =========================================================
     排除文字
     ========================================================= */

  function normalizeForExclude(text) {
    return String(text || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[\s\p{P}\p{S}]+/gu, '')
      .trim();
  }

  const excludeSet = new Set(EXCLUDE_POSTS.map(normalizeForExclude));

  function shouldExcludePost(text, author = '') {
    const whole = normalizeForExclude(text);
    if (excludeSet.has(whole)) {
      return true;
    }
    const authorNorm = normalizeForExclude(author);
    const userNorm = normalizeForExclude(String(author).replace(/^@/, ''));
    const lines = String(text || '')
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((x) => {
        const n = normalizeForExclude(x);
        return n && n !== authorNorm && n !== userNorm;
      });
    return lines.length === 1 && excludeSet.has(normalizeForExclude(lines[0]));
  }

  /* =========================================================
     UI
     ========================================================= */

  const launcher = document.createElement('button');

  launcher.id = LAUNCHER_ID;
  launcher.textContent = '</>';
  launcher.title = '開啟 Threads Collector';

  launcher.style.cssText = [
    'position:fixed',
    'top:18px',
    'right:18px',
    'z-index:2147483647',
    'width:36px',
    'height:36px',
    'border:1px solid #666666',
    'border-radius:50%',
    'background:#111',
    'color:#fff',
    'font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    'box-shadow:0 4px 16px rgba(0,0,0,.35)',
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:0',
  ].join(';');

  document.body.appendChild(launcher);

  const panel = document.createElement('div');

  panel.id = APP_ID;

  panel.style.cssText = [
    'position:fixed',
    'top:18px',
    'right:18px',
    'z-index:2147483647',
    'width:400px',
    'background:#111',
    'color:#eee',
    'padding:14px',
    'border:1px solid #333',
    'border-radius:12px',
    'box-shadow:0 8px 30px rgba(0,0,0,.45)',
    'font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    'display:none',
    'box-sizing:border-box',
  ].join(';');

  const header = document.createElement('div');

  header.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'gap:10px',
    'margin-bottom:8px',
  ].join(';');

  const title = document.createElement('div');

  title.textContent = 'Threads Collector';

  title.style.cssText = ['font-weight:700', 'font-size:13px'].join(';');

  const collapseBtn = document.createElement('button');

  collapseBtn.textContent = '−';
  collapseBtn.title = '收合';

  collapseBtn.style.cssText = [
    'width:26px',
    'height:26px',
    'padding:0',
    'border:1px solid #444',
    'border-radius:7px',
    'background:#222',
    'color:#ccc',
    'cursor:pointer',
    'font-size:18px',
    'line-height:20px',
  ].join(';');

  header.append(title, collapseBtn);

  const status = document.createElement('div');

  status.textContent = '尚未開始掃描';

  status.style.cssText = [
    'color:#aaa',
    'white-space:pre-line',
    'margin-bottom:10px',
    'word-break:break-word',
  ].join(';');

  function makeBtn(text, css = '') {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText
      = [
        'width:100%',
        'border:0',
        'border-radius:8px',
        'padding:9px 10px',
        'font-weight:700',
        'cursor:pointer',
        'box-sizing:border-box',
      ].join(';')
      + ';'
      + css;
    return button;
  }

  const startBtn = makeBtn('開始掃描', 'background:#fff;color:#111');
  const stopBtn = makeBtn('停止掃描', 'background:#222;color:#ccc;border:1px solid #444');
  const copyBtn = makeBtn('複製 JSON', 'background:#fff;color:#111');
  const sendBtn = makeBtn('送出到 Edge Function', 'background:#fff;color:#111');
  const resetBtn = makeBtn('重製', 'background:#fff;color:#111');

  stopBtn.disabled = true;
  stopBtn.style.opacity = '0.55';

  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = [
    'padding:8px',
    'border:1px solid #444',
    'border-radius:8px',
    'display:grid',
    'grid-template-columns:1fr 1fr',
    'grid-template-rows:1fr 1fr 1fr',
    'gap:6px',
  ].join(';');
  btnGroup.append(startBtn, stopBtn, copyBtn, sendBtn, resetBtn);
  panel.append(header, status, btnGroup);

  document.body.appendChild(panel);

  function openPanel() {
    launcher.style.display = 'none';
    panel.style.display = 'block';
  }

  function collapsePanel() {
    panel.style.display = 'none';
    launcher.style.display = 'flex';
  }

  launcher.addEventListener('click', openPanel);

  collapseBtn.addEventListener('click', collapsePanel);

  /* =========================================================
     DOM
     ========================================================= */

  function findRootFromLink(link) {
    let root = link.closest('article,[role="article"]');
    if (root) {
      const urls = new Set(
        $all('a[href]', root)
          .map((x) => cleanUrl(x.href))
          .filter(Boolean),
      );
      if (urls.size === 1) {
        return root;
      }
    }
    root = link.closest('[data-pressable-container="true"]');
    if (root && (root.innerText || '').trim().length > 8) {
      const urls = new Set(
        $all('a[href]', root)
          .map((x) => cleanUrl(x.href))
          .filter(Boolean),
      );
      if (urls.size === 1) {
        return root;
      }
    }
    let p = link;
    let best = null;
    for (let i = 0; i < 12 && p && p !== main && p !== document.body; i++, p = p.parentElement) {
      const text = (p.innerText || '').trim();
      if (text.length < 8) {
        continue;
      }
      const urls = new Set(
        $all('a[href]', p)
          .map((x) => cleanUrl(x.href))
          .filter(Boolean),
      );
      if (urls.size === 1) {
        best = p;
      }
      if (urls.size > 1) {
        break;
      }
    }
    return best;
  }

  function getRoots() {
    const roots = new Set();
    $all('a[href]', main)
      .filter((a) => isPostUrl(a.href))
      .forEach((a) => {
        const root = findRootFromLink(a);
        if (root) {
          roots.add(root);
        }
      });
    return Array.from(roots);
  }

  const ui
    = /^(?:like|reply|repost|quote|share|translate|follow|following|more|send|copy link|view activity|hide|report|讚|按讚|回覆|回應|轉發|轉貼|引用|分享|翻譯|追蹤|追蹤中|更多|傳送|複製連結|查看動態|檢舉|赞|点赞|回复|转发|引用|分享|翻译|关注|更多)$/i;

  const tm
    = /^(?:\d+\s*(?:s|m|h|d|w|y)|\d+\s*(?:秒|分鐘|分钟|小時|小时|天|日|週|周|個月|个月|年)|just now|now|剛剛|刚刚)$/i;

  const met
    = /^(?:[\d,.]+\s*[KMB萬万千]?)\s*(?:likes?|repl(?:y|ies)|reposts?|quotes?|views?|讚|赞|回覆|回复|轉發|转发|瀏覽|浏览)$/i;

  function cleanText(raw) {
    const out = [];
    const seen = new Set();
    for (const line of String(raw || '').split(/\n+/)) {
      const text = line.replace(/\s+/g, ' ').trim();
      if (!text || ui.test(text) || tm.test(text) || met.test(text) || seen.has(text)) {
        continue;
      }
      seen.add(text);
      out.push(text);
    }
    return out.join('\n').trim();
  }

  function removeLeadingAuthor(text, author) {
    if (!text || !author) {
      return text;
    }
    const lines = String(text).split('\n');
    const normalizeAuthor = (value) =>
      String(value || '')
        .normalize('NFKC')
        .trim()
        .replace(/^@/, '')
        .toLowerCase();
    if (lines.length && normalizeAuthor(lines[0]) === normalizeAuthor(author)) {
      lines.shift();
    }
    return lines.join('\n').trim();
  }

  function extract(root) {
    const urls = [
      ...new Set(
        $all('a[href]', root)
          .map((a) => cleanUrl(a.href))
          .filter(Boolean),
      ),
    ];
    if (urls.length !== 1) {
      return null;
    }
    const url = canonicalizeThreadsUrl(urls[0]);
    if (!url) {
      return null;
    }
    const author = extractAuthor(root, url);
    const published_at = extractPublishedAt(root);
    const text = removeLeadingAuthor(cleanText(root.innerText), author);
    if (!text || text.length < 2) {
      return null;
    }
    if (shouldExcludePost(text, author || '')) {
      excludedUrls.add(url);
      return {
        excluded: true,
        url,
      };
    }
    return {
      url,
      author,
      published_at,
      text,
    };
  }

  function collect() {
    let added = 0;
    let updated = 0;
    for (const root of getRoots()) {
      const item = extract(root);
      if (!item || item.excluded) {
        continue;
      }
      const prev = store.get(item.url);
      if (!prev) {
        store.set(item.url, {
          ...item,
          seq: store.size + 1,
        });
        added++;
        lastNewAt = Date.now();
        continue;
      }
      const next = {
        ...prev,
        // author 第一次沒抓到的話，之後補
        author: prev.author || item.author || null,
        // published_at 第一次沒抓到的話，之後補
        published_at: prev.published_at || item.published_at || null,
        // 永遠保留較完整的文字
        text: item.text.length > prev.text.length ? item.text : prev.text,
      };
      const changed
        = next.author !== prev.author
          || next.published_at !== prev.published_at
          || next.text !== prev.text;
      if (changed) {
        store.set(item.url, next);
        updated++;
      }
    }
    return {
      added,
      updated,
      total: store.size,
    };
  }

  /* =========================================================
     MutationObserver
     ========================================================= */

  const liveObserver = new MutationObserver(() => {
    if (!running || observerQueued) {
      return;
    }
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      if (running) {
        collect();
      }
    });
  });

  function startObserver() {
    if (observerStarted) {
      return;
    }
    try {
      liveObserver.observe(main, {
        subtree: true,
        childList: true,
        characterData: true,
      });
      observerStarted = true;
    } catch (_) {}
  }

  function stopObserver() {
    try {
      liveObserver.disconnect();
    } catch (_) {}
    observerStarted = false;
  }

  /* =========================================================
     Scroll
     ========================================================= */

  function pageHeight() {
    return Math.max(document.body?.scrollHeight || 0, document.documentElement?.scrollHeight || 0);
  }

  function maxScrollY() {
    return Math.max(0, pageHeight() - innerHeight);
  }

  function atBottom() {
    return scrollY >= maxScrollY() - 100;
  }

  async function settle(ms = CONFIG.AFTER_SCROLL_MS) {
    collect();
    await sleep(ms);
    collect();
  }

  async function stepDown() {
    collect();
    const step = Math.max(CONFIG.MIN_SCROLL_STEP, Math.floor(innerHeight * CONFIG.SCROLL_RATIO));
    scrollTo(0, Math.min(maxScrollY(), scrollY + step));
    await settle();
  }

  async function probeBottom() {
    const beforeCount = store.size;
    const beforeHeight = pageHeight();
    scrollTo(0, pageHeight());
    await settle(700);
    const bounce = Math.max(300, Math.floor(innerHeight * CONFIG.BOTTOM_BOUNCE_RATIO));
    scrollBy(0, -bounce);
    await settle(300);
    scrollTo(0, pageHeight());
    await settle(800);
    return {
      gained: store.size > beforeCount,
      heightChanged: Math.abs(pageHeight() - beforeHeight) > 8,
      bottom: atBottom(),
    };
  }

  /* =========================================================
     Payload
     ========================================================= */

  function buildPayload() {
    collect();
    const sourceUrl = pageUrl();
    const sourcePath = pathOf(sourceUrl);
    const items = Array.from(store.values())
      .sort((a, b) => a.seq - b.seq)
      .map((item) => {
        const itemUrl = canonicalizeThreadsUrl(item.url);
        return {
          type: pathOf(itemUrl) === sourcePath ? 'post' : 'reply',
          url: itemUrl,
          author: item.author || null,
          published_at: item.published_at || null,
          text: item.text,
        };
      });
    return {
      url: sourceUrl,
      items,
    };
  }

  /* =========================================================
     Clipboard
     ========================================================= */

  async function copyText(text) {
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, 'text');
        return true;
      }
    } catch (_) {}
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-99999px;top:0;opacity:0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_) {}
    textarea.remove();
    return ok;
  }

  /* =========================================================
     Supabase
     ========================================================= */

  function edgeConfigured() {
    return (
      /^https:\/\//.test(CONFIG.EDGE_URL)
      && !CONFIG.EDGE_URL.includes('YOUR_PROJECT_REF')
      && CONFIG.SUPABASE_PUBLISHABLE_KEY
      && !CONFIG.SUPABASE_PUBLISHABLE_KEY.includes('YOUR_SUPABASE_PUBLISHABLE_KEY')
    );
  }

  function sendToEdge() {
    return new Promise((resolve, reject) => {
      if (sending) {
        reject(new Error('request already in progress'));
        return;
      }
      if (!edgeConfigured()) {
        reject(new Error('尚未設定 EDGE_URL / SUPABASE_PUBLISHABLE_KEY'));
        return;
      }
      sending = true;
      sendBtn.disabled = true;
      sendBtn.textContent = '送出中…';
      GM_xmlhttpRequest({
        method: 'POST',
        url: CONFIG.EDGE_URL,
        timeout: CONFIG.EDGE_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SUPABASE_PUBLISHABLE_KEY,
          'x-collector-token': CONFIG.COLLECTOR_TOKEN,
        },
        data: JSON.stringify(buildPayload()),
        onload(response) {
          sending = false;
          sendBtn.disabled = false;
          sendBtn.textContent = '送出到 Edge Function';
          const raw = response.responseText || '';
          let data = raw;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch (_) {}
          if (response.status < 200 || response.status >= 300) {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            reject(new Error(`HTTP ${response.status}: ${message.slice(0, 400)}`));
            return;
          }
          resolve(data);
        },
        ontimeout() {
          sending = false;
          sendBtn.disabled = false;
          sendBtn.textContent = '送出到 Edge Function';
          reject(new Error('Edge Function request timeout'));
        },
        onerror(error) {
          sending = false;
          sendBtn.disabled = false;
          sendBtn.textContent = '送出到 Edge Function';
          reject(new Error(error?.error || 'Edge Function request failed'));
        },
      });
    });
  }

  /* =========================================================
     Status
     ========================================================= */

  function setStatus(extra = '') {
    const idle = Math.max(0, Date.now() - lastNewAt) / 1000;
    status.textContent
      = `收集 ${store.size}｜排除 ${excludedUrls.size}\n`
        + `掃描 ${loops}｜底部 ${stableBottom}/${CONFIG.BOTTOM_STABLE_ROUNDS}\n`
        + `最後新增 ${idle.toFixed(1)}s 前`
        + (extra ? `\n${extra}` : '');
  }

  function setRunningUI(isRunning) {
    startBtn.disabled = isRunning;
    startBtn.style.opacity = isRunning ? '0.55' : '1';
    stopBtn.disabled = !isRunning;
    stopBtn.style.opacity = isRunning ? '1' : '0.55';
  }

  /* =========================================================
     Buttons
     ========================================================= */

  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(JSON.stringify(buildPayload()));
    copyBtn.textContent = ok ? `已複製 ${store.size} 則` : '複製失敗';
    setTimeout(() => {
      copyBtn.textContent = '複製 JSON';
    }, 1600);
  });

  sendBtn.addEventListener('click', async () => {
    try {
      setStatus('送出 Edge Function…');
      const result = await sendToEdge();
      const summary
        = result && typeof result === 'object'
          ? JSON.stringify(result).slice(0, 120)
          : String(result || 'ok');
      setStatus(`Edge Function OK: ${summary}`);
    } catch (err) {
      console.error('Threads Collector Edge Function error', err);
      setStatus(`送出失敗: ${err.message || err}`);
    }
  });

  stopBtn.addEventListener('click', () => {
    if (!running) {
      return;
    }
    running = false;
    stopBtn.textContent = '正在停止…';
    setStatus('正在停止掃描…');
  });

  startBtn.addEventListener('click', async () => {
    if (running) {
      return;
    }
    loops = 0;
    stableBottom = 0;
    lastNewAt = Date.now();
    running = true;
    startObserver();
    setRunningUI(true);
    try {
      await run();
    } catch (err) {
      console.error('Threads Collector fatal error', err);
      running = false;
      stopObserver();
      setRunningUI(false);
      stopBtn.textContent = '停止掃描';
      status.textContent = `錯誤: ${err.message || err}`;
    }
  });

  resetBtn.addEventListener('click', () => {
    if (running) {
      return;
    }
    store.clear();
    excludedUrls.clear();
    loops = 0;
    stableBottom = 0;
    lastNewAt = Date.now();
    copyBtn.textContent = '複製 JSON';
    running = false;
    setRunningUI(false);
    setStatus('');
  });

  /* =========================================================
     Finish
     ========================================================= */

  async function finish(reason) {
    running = false;
    stopObserver();
    collect();
    let extra = reason;
    if (CONFIG.AUTO_COPY_ON_FINISH) {
      const ok = await copyText(JSON.stringify(buildPayload()));
      extra += ok ? '｜已自動複製' : '｜自動複製失敗';
    }
    if (CONFIG.AUTO_SEND_ON_FINISH && edgeConfigured()) {
      try {
        await sendToEdge();
        extra += '｜Edge OK';
      } catch (err) {
        console.error('Threads Collector Edge Function error', err);
        extra += `｜Edge 失敗: ${err.message || err}`;
      }
    }
    status.textContent = `完成｜收集 ${store.size}｜排除 ${excludedUrls.size}\n${extra}`;
    stopBtn.textContent = '停止掃描';
    setRunningUI(false);
  }

  /* =========================================================
     Main scanning loop
     ========================================================= */

  async function run() {
    scrollTo(0, 0);
    await settle(700);
    collect();
    lastNewAt = Date.now();
    while (running && loops < CONFIG.MAX_LOOPS) {
      loops++;
      collect();
      if (!atBottom()) {
        stableBottom = 0;
        await stepDown();
        setStatus('往下掃描中');
        continue;
      }
      const before = store.size;
      const result = await probeBottom();
      if (store.size > before || result.gained || result.heightChanged) {
        stableBottom = 0;
        setStatus('底部仍有新內容');
        continue;
      }
      stableBottom = result.bottom ? stableBottom + 1 : 0;
      setStatus('底部穩定性確認中');
      if (
        stableBottom >= CONFIG.BOTTOM_STABLE_ROUNDS
        && Date.now() - lastNewAt >= CONFIG.MIN_IDLE_AFTER_NEW_MS
      ) {
        await finish(`連續 ${stableBottom} 次底部探測無新增`);
        return;
      }
    }
    if (!running) {
      await finish('使用者停止');
    } else {
      await finish(`達到安全上限 ${CONFIG.MAX_LOOPS}`);
    }
  }

  setRunningUI(false);
})();
