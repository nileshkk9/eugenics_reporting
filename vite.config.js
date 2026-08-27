import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      outDir: 'build',
      includeAssets: ['favicon.png', 'icon.png', 'splash.png', 'logo.png'],
      manifest: {
        short_name: 'Eugenics',
        name: 'Eugenics',
        icons: [
          { src: 'icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'splash.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#7386d5',
        background_color: '#7386d5',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/eugenics-backend-nileshkk9\.vercel\.app\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    host: true,
  },
})
