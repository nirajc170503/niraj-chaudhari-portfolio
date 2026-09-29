import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // The reader arrives on a phone, usually on a phone network, and the hero
    // image is the largest paint. Assets are hashed so they can be cached
    // indefinitely, and the case studies are already split into their own
    // chunks in App.jsx.
    assetsInlineLimit: 1024,
    reportCompressedSize: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/content/**/*.js'],
      reporter: ['text', 'html'],
    },
  },
})
