<script setup lang="ts">
import { avatarImage } from '~/assets/images/avatars';
import type { Post } from '~/types/post';

defineProps<{
  post: Post;
}>();

const statIcons = { like: 'i-lucide-heart', reply: 'i-lucide-message-circle', repost: 'i-lucide-refresh-ccw', share: 'i-lucide-send-horizontal' };
</script>

<template>
  <section class="py-4">
    <div class="mb-3 flex items-center gap-4">
      <UAvatar
        :src="avatarImage[post.imgSrc as keyof typeof avatarImage]"
        size="xl"
        loading="lazy"
      />
      <span class="font-bold">{{ post.author }}</span>
      <span>{{ post.published_at }}</span>
    </div>

    <p class="mx-auto max-w-147.5 whitespace-pre-line">
      {{ post.text }}
    </p>

    <div class="mt-4 flex items-center gap-6 ">
      <span
        v-for="(value, key) in statIcons"
        :key="key"
        class="flex items-center gap-1"
      >
        <UIcon
          :name="value"
          class="size-5"
        />
        <span>{{ post[key] }}</span>
      </span>
    </div>
  </section>
</template>
