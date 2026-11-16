import baseConfig from "@fillcart/config/eslint";

export default [
  ...baseConfig,
  {
    ignores: ["src/generated/**"],
  },
];
