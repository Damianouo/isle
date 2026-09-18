<script setup lang="ts">
import PostCard from '~/features/post/PostCard.vue';
import type { Post } from '~/types/post';

const postsData = [{
  id: '@satzuloves-Ddak57HGQY1',
  url: 'https://www.threads.com/@satzuloves/post/Ddak57HGQY1',
  sourceUrl: 'https://www.threads.com/@satzuloves/post/Ddak57HGQY1',
  type: 'post',
  imgSrc: 'cat',
  author: 'satzulover',
  published_at: '2026-09-10 04:00:00+00',
  text: `260918 Tzu 🫧🫧
Filming with members 😍
`,
  tags: ['k-pop', 'twice'],
  like: 1400,
  reply: 7,
  repost: 32,
  share: 211,
}, {
  id: '@can_mike_-DdaZXiEmfXF',
  url: 'https://www.threads.com/@can_mike_/post/DdaZXiEmfXF',
  sourceUrl: 'https://www.threads.com/@can_mike_/post/DdaZXiEmfXF',
  type: 'post',
  imgSrc: 'dog',
  author: 'can_mike',
  published_at: '2026-09-18 12:40:00+00',
  text: `AAA 2026 女子組合人氣獎投票正式開始啦 🏆
為了讓我們最愛的女孩們能在台灣主場領獎，
恩瑟一定要動起來全力投票！
這次的「女子組合人氣獎」是 100% 透過
🗳️IDOLCHAMP 投票決定🗳️
以下幫大家整理好核心資訊：
⏰投票時間：2026/09/16 10:00 ～ 2026/10/06 23:59 (韓國時間）
⚠️ 台灣時間提早一小時，於10/06 22:59 截止！ 🗳 投票規則：每天每個帳號最多可投 100 票。
每投 1 票需要消耗 20 個心形🩷積分。
📱 投票步驟：
1️⃣ 下載並打開 IDOLCHAMP App。
2️⃣ 首頁找到 [AAA 2026] Popularity Award : GROUP (FEMALE) 投票橫幅。
3️⃣ 在候選人名單中找到我們NMIXX，按下心形投票！ 現在距離投票結束大約還有 18 天 ! !
請大家每天記得上去把 100 票投好投滿，每天簽到、看廣告把免費的心形積分賺起來！🩵💙🐳
讓恩瑟一起送她們登上高雄頒獎典禮的舞台吧✨ `,
  tags: ['k-pop', 'nmixx'],
  like: 95,
  reply: 19,
  repost: 3,
  share: 7,
},
{
  id: '@vulture.s-DdVQCn0k3lN',
  url: 'https://www.threads.com/@vulture.s/post/DdVQCn0k3lN',
  sourceUrl: 'https://www.threads.com/@vulture.s/post/DdVQCn0k3lN',
  type: 'post',
  imgSrc: 'elephant',
  author: 'vulture.s',
  published_at: '2026-09-16 15:00:00+00',
  text: `上週在 Threads 上剛好回覆到一個多人會議的問題。
我目前在 10 人會議上的做法是讓兩顆地端模型交叉跑
faster-whisper large-v3 ＋ Qwen3-ASR-1.7B。
流程的目標就是把「逐字稿」轉到「可交付的會議紀錄」。

目前週例會是最地獄的那種情境：難念的產品代號＋廠商名（相近音超多）＋台灣口音的英文、日文夾雜。

長期11週跑下來，趁著這次分享順便把流程優化。
雙模型對照不一定穩(還是會一起錯，一起幻覺的部分），還得要加上一些特定的流程。
錄製前要注意的兩件事實：
1. 低電平會讓語音活動偵測把整段判斷為非語音、整段不會進模型。
2. 轉錄流程先過一道音量正規化．實測同段
Qwen3-ASR 那顆的語音覆蓋率會大幅度從 49.3% 提升至 90.8%。
faster-whisper 89.2% → 95.0%。

所以錄音的前置作業一定要注意。`,
  tags: ['tips', 'ai-models'],
  like: 21,
  reply: 4,
  repost: 1,
  share: 29,
}] as Post[];
</script>

<template>
  <section class="w-full justify-self-center md:max-w-160 ">
    <h1 class="hidden px-4 text-3xl font-bold md:mb-4 md:block md:px-6">
      Posts
    </h1>
    <div class="rounded-3xl px-4 md:border md:px-6">
      <NuxtLink
        v-for="post in postsData"
        :key="post.id"
        :to="`posts/${post.id}`"
      >
        <PostCard
          :post="post"
        />
      </NuxtLink>
    </div>
  </section>
</template>
