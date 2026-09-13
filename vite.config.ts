import { copyFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // app.js is a classic (non-module) script for the landing page, so it can stay
      // openable via file:// — Vite won't bundle it, so copy it into dist verbatim.
      name: 'copy-landing-app-js',
      writeBundle() {
        copyFileSync('app.js', 'dist/app.js')
      },
    },
  ],
  server: {
    port: 5183,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app/index.html',
      },
    },
  },
})
