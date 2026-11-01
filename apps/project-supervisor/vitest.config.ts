import { defineConfig } from "vitest/config";

export default defineConfig({ test: { include: ["test/**/*.vitest.ts"], testTimeout: 30_000 } });
