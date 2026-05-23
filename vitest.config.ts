import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
})
