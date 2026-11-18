import { describe, it, expect } from "vitest";
import type { Server } from "node:http";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";

describe("Lifecycle & Port Binding Integration Tests", () => {
  it("starts HTTP server, binds to loopback host/port, and closes cleanly", async () => {
    const config = validateConfig({
      PORT: "4567",
      HOST: "127.0.0.1",
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
    });

    const app = createApp(config);

    const server: Server = await new Promise((resolve) => {
      const s = app.listen(config.PORT, config.HOST, () => {
        resolve(s);
      });
    });

    expect(server.listening).toBe(true);
    const address = server.address();
    expect(address).toBeDefined();

    // Clean shutdown
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    expect(server.listening).toBe(false);
  });
});
