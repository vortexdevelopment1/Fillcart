import baseConfig from "@fillcart/config/eslint";

export default [
  ...baseConfig,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
    ],
  },
];
