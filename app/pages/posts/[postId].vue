<script setup lang="ts">
import { postsData } from '~/constant';
import PostCard from '~/features/post/PostCard.vue';

const route = useRoute();
const post = postsData.find((post) => post.id === route.params.postId);
const replies = postsData.filter((p) => p.type === 'reply' && p.sourceUrl === post?.url);
</script>

<template>
  <section class="w-full justify-self-center md:max-w-160 ">
    <h1 class="hidden px-4 text-3xl font-bold md:mb-4 md:block md:px-6">
      Posts
    </h1>
    <div class="rounded-3xl md:border md:py-2">
      <PostCard
        v-if="post"
        :post="post"
      />
      <div
        v-for="reply in replies"
        :key="reply.id"
        class="not-first:border-t"
      >
        <PostCard
          :post="reply"
          variant="reply"
        />
      </div>
    </div>
  </section>
</template>
