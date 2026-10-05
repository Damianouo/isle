<script setup lang="ts">
import { avatarImage } from '~/assets/images/avatars';
import type { Post } from '~/types/post';

withDefaults(defineProps<{
  post: Post;
  variant?: 'post' | 'reply';
}>(),
{
  variant: 'post',
},
);

const statIcons = { like: 'i-lucide-heart', reply: 'i-lucide-message-circle', repost: 'i-lucide-refresh-ccw', share: 'i-lucide-send-horizontal' };
</script>

<template>
  <section
    :class="[
      'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-4 p-4 md:px-6', variant==='post'?'gap-y-2':'gap-y-1',
    ]"
  >
    <UAvatar
      :class="variant==='post'?'':'row-span-2'"
      :src="avatarImage[post.imgSrc as keyof typeof avatarImage]"
      size="xl"
      loading="lazy"
    />
    <div class="col-start-2 flex items-center gap-4">
      <span class="font-bold">{{ post.author }}</span>
      <span>{{ post.published_at }}</span>
      <UButton
        class="ml-auto"
        variant="outline"
        color="neutral"
        size="sm"
        icon="i-lucide-external-link"
        :to="post?.url"
        target="_blank"
        @click.stop
      />
    </div>

    <div :class="variant==='post'?'col-span-2':'col-start-2'">
      <p class="mx-auto max-w-147.5 whitespace-pre-line">
        {{ post.text }}
      </p>

      <div class="mt-3 flex items-center gap-6">
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
    </div>
  </section>
</template>
