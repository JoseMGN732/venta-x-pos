import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'pwa-192x192.png',
        'pwa-512x512.png'
      ],

      manifest: {
        name: 'Venta X',
        short_name: 'Venta X',
        description: 'Sistema de Punto de Venta desarrollado por Synkro ERP Solution',
        theme_color: '#1688E5',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '.',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  base: './'
});