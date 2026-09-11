<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui';
import { avatarImage } from '@/assets/images/avatars';

const open = ref(true);

const colorMode = useColorMode();

function getItems() {
  return [
    {
      label: 'Posts',
      icon: 'i-lucide-square-chart-gantt',
      to: '/posts',
    },
    {
      label: 'New Post',
      icon: 'i-lucide-square-pen',
      onSelect: () => {},
    },
    {
      label: 'Messages',
      icon: 'i-lucide-send-horizontal',
      badge: '4',
      to: '/messages',
    },
    {
      label: 'Saved Threads',
      icon: 'i-lucide-bookmark',
      badge: '12',
      to: '/saved-threads',
    },
    {
      label: 'Bug Report',
      icon: 'i-lucide-inbox',
      to: '/bug-report',
    },
  ] satisfies NavigationMenuItem[];
}

const user = ref({
  name: 'Damian',
  avatar: {
    src: avatarImage.cat,
    alt: 'Damian',
  },
});

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
    },
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'light';
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'dark';
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
    },
  ],
]);
</script>

<template>
  <div class="flex flex-1">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      :ui="{
        container: 'h-full',
        inner: 'bg-elevated/25 divide-transparent',
        body: 'py-0',
      }"
      :style="{
        '--sidebar-width-icon': '4.25rem',
      }"
    >
      <template #header>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 flex font-bold text-4xl gap-4 items-center rounded-md p-1 my-5 h-12"
        >
          <img
            src="assets/images/isle-logo.webp"
            class="size-7 shrink-0"
          >
          <span v-show="open">Isle</span>
        </NuxtLink>
      </template>

      <template #default="{ state }">
        <UNavigationMenu
          :collapsed="state==='collapsed'"
          :items="getItems()"
          orientation="vertical"
          :ui="{ link: 'text-base p-1.5 overflow-hidden gap-2.5', linkLeadingIcon: 'size-6' }"
        />
      </template>

      <template #footer>
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
        >
          <UButton
            v-bind="user"
            :label="user?.name"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            size="xl"
            square
            class="w-full p-1.5 data-[state=open]:bg-elevated overflow-hidden"
            :ui="{
              trailingIcon: 'text-dimmed ms-auto',
            }"
          />
        </UDropdownMenu>
      </template>
    </USidebar>

    <div class="flex-1 relative p-2">
      <header class="block md:hidden sticky top-0 h-[var(--ui-header-height)] flex justify-center items-center border-b">
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 flex font-bold text-4xl gap-4 items-center rounded-md p-1 h-12"
        >
          <img
            src="assets/images/isle-logo.webp"
            class="size-10 shrink-0"
          >
        </NuxtLink>
      </header>
      <UButton
        class="hidden md:block absolute top-4 left-4 lg:-left-4 z-9999"
        icon="i-lucide-panel-left"
        color="neutral"
        variant="subtle"
        aria-label="Toggle sidebar"
        @click="open = !open"
      />
      <UMain class="min-h-[calc(100vh-100px)] md:p-3 grid">
        <NuxtPage />
      </UMain>
      <USeparator
        icon="i-lucide-shell"
      />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">
            Isle • © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <UButton
            to="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UFooter>
    </div>
  </div>
</template>
