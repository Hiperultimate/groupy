// vitest.config.ts
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: 'v8'
    },
    alias : {
      "~": path.resolve(__dirname, 'src'),
    }
  },
})