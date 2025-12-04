// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', 'shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  nitro: {
    experimental: {
      websocket: true,
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
    server: {
      // ⚠️ IMPORTANT: Only add hosts you trust!
      hmr: {
        // Hot Module Replacement (HMR) needs to recognize the external host
        host: 'synchronic-raffishly-julieta.ngrok-free.dev',
        protocol: 'wss',
      },
      // This setting tells Vite to accept connections from the ngrok domain
      allowedHosts: [
        'synchronic-raffishly-julieta.ngrok-free.dev'
      ],
    },
  },
})