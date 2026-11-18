import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["apps/backend/test/**/*.test.ts", "test/**/*.test.ts"],
    exclude: ["**/dist/**", "**/node_modules/**", "**/.git/**"],
    testTimeout: 15000,
    fileParallelism: false,
  },
});
