<script setup>
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 flex font-bold text-4xl gap-4 items-center rounded-md p-1"
        >
          <img
            src="assets/images/isle-logo.webp"
            class="w-auto h-6 shrink-0"
          >
          <span>Isle</span>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator
      icon="i-lucide-circle-dashed"
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
  </UApp>
</template>
