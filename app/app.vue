<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui';
import { avatarImage } from '@/assets/images/avatars';

const open = ref(true);

const colorMode = useColorMode();

const route = useRoute();

const isActive = (to: string) =>
  route.path === to || route.path.startsWith(`${to}/`);

const navigationMenuItem = [
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

const mobileNavigationItem = [
  {
    icon: 'i-lucide-square-chart-gantt',
    to: '/posts',
  },
  {
    icon: 'i-lucide-send-horizontal',
    to: '/messages',
  },
  {
    icon: 'i-lucide-square-pen',
    onSelect: () => {},
    class: 'bg-elevated',
  },
  {
    icon: 'i-lucide-bookmark',
    to: '/saved-threads',
  },
  {
    icon: 'i-lucide-user',
    to: '/profile',
  },
] satisfies NavigationMenuItem[];

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
          class="my-5 flex h-12 items-center gap-4 rounded-md p-1 text-4xl font-bold outline-primary/25 focus-visible:outline-3"
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
          :items="navigationMenuItem"
          orientation="vertical"
          :ui="{ link: 'text-base p-2 overflow-hidden gap-2.5', linkLeadingIcon: 'size-6' }"
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
            class="w-full overflow-hidden p-1.5 data-[state=open]:bg-elevated"
            :ui="{
              trailingIcon: 'text-dimmed ms-auto',
            }"
          />
        </UDropdownMenu>
      </template>
    </USidebar>

    <div class="relative flex-1 md:p-2">
      <header class="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center justify-items-start bg-default/95 p-2 backdrop-blur md:hidden">
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)  min-w-48 ' }"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>

        <NuxtLink
          to="/"
          class="flex h-12 items-center gap-4 rounded-md p-1 text-4xl font-bold outline-primary/25 focus-visible:outline-3"
        >
          <img
            src="assets/images/isle-logo.webp"
            class="size-10 shrink-0"
          >
        </NuxtLink>
        <UColorModeButton class="justify-self-end" />
      </header>

      <USeparator class="md:hidden" />
      <UButton
        class="absolute top-4 left-4 z-9999 hidden md:block lg:-left-4"
        icon="i-lucide-panel-left"
        color="neutral"
        variant="subtle"
        aria-label="Toggle sidebar"
        @click="open = !open"
      />

      <UMain class="relative grid min-h-[calc(100vh-121px)] grid-rows-[1fr_auto] md:min-h-[calc(100vh-72px)] md:p-3">
        <NuxtPage />
        <nav
          class="sticky inset-x-0 bottom-0 z-50 block h-fit bg-default/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
          <div class="grid grid-cols-5 gap-1 p-2">
            <template v-for="item in mobileNavigationItem">
              <UButton
                v-if="!item?.to"
                :key="item.icon"
                :icon="item.icon"
                variant="ghost"
                color="neutral"
                class="flex items-center justify-center bg-elevated text-dimmed hover:text-default"
                :ui="{
                  leadingIcon: 'size-7',
                }"
              />

              <UButton
                v-else
                :key="item.to"
                :to="item.to"
                variant="ghost"
                color="neutral"
                :class="[
                  'flex items-center justify-center',
                  isActive(item.to) ? 'bg-primary/10 text-primary':'text-dimmed hover:text-default',
                ]"
              >
                <UIcon
                  :name="item.icon"
                  class="pointer-events-none size-7"
                />
              </UButton>
            </template>
          </div>
        </nav>
      </UMain>
      <USeparator
        icon="i-lucide-shell"
      />

      <UFooter
        class="p-0"
        :ui="{ container: 'p-2 md:p-2 lg:p-2', left: 'mt-0', center: 'mt-0', right: 'mt-0' }"
      >
        <template #default>
          <p class="text-sm text-muted">
            Isle • © {{ new Date().getFullYear() }}
          </p>
        </template>
      </UFooter>
    </div>
  </div>
</template>
