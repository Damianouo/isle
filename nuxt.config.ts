// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
  ],

  devtools: {
    enabled: true,
  },
  app: {
    baseURL: '/demo/isle/',
    head: {
      title: 'Isle',

      htmlAttrs: {
        lang: 'zh-TW',
      },
      meta: [
        {
          name: 'description',
          content: 'Isle--anonymous blog',
        },
      ],
      link: [
        {
          rel: 'icon',
          href: '/demo/isle/favicon.ico',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        arrowParens: true,
      },
    },
  },
  fonts: {
    families: [
      {
        name: 'Noto Sans TC',
        provider: 'google',
        weights: ['400 700'],
      },
    ],
  },
});
