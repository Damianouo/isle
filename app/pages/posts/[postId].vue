<script setup lang="ts">
import { postsData } from '~/constant';
import PostCard from '~/features/post/PostCard.vue';

const route = useRoute();
const post = postsData.find((post) => post.id === route.params.postId);
</script>

<template>
  <section class="w-full justify-self-center md:max-w-160 ">
    <h1 class="hidden px-4 text-3xl font-bold md:mb-4 md:block md:px-6">
      Posts
    </h1>
    <div class="rounded-3xl px-4 md:border md:px-6">
      <NuxtLink
        v-if="post"
        :to="post?.url"
        class="block not-first:border-t first:md:mt-2"
      >
        <PostCard
          :post="post"
        />
      </NuxtLink>
    </div>
  </section>
</template>
