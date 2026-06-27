import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: [],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['html2canvas', 'jspdf', 'jszip', 'papaparse'],
    },
  },
  app: {
    head: {
      title: 'Certificate Generator',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1' },
        { name: 'description', content: 'Design templates, upload data, generate certificates in bulk. Zero-config, fully local.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Plus+Jakarta+Sans:ital,wght@0,300..700;1,300..700&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap',
        },
      ],
    },
  },
  compatibilityDate: '2025-07-01',
})