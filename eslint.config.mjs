import baseConfig from "@fillcart/config/eslint";

export default [
  ...baseConfig,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/coverage/**",
      "**/generated/**",
      "packages/flutter_shared/**",
      "apps/*-app/**",
    ],
  },
];
