// @ts-check
import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  eslintPluginTailwindcss.configs['flat/recommended'] || eslintPluginTailwindcss.configs.recommended,
   {
    settings: {
      tailwindcss: {
        cssConfigPath: "./app/assets/css/main.css",
      },
    },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["custom\\-*"] },
      ],
      "tailwindcss/no-contradicting-classname": "warn",
    },
  },
);
