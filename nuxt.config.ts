import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: [],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["html2canvas", "jspdf", "jszip", "papaparse"],
    },
  },
  app: {
    head: {
      title: "Certificate Generator",
      htmlAttrs: { lang: "en" },
      meta: [
        { name: "viewport", content: "width=device-width,initial-scale=1" },
        {
          name: "description",
          content:
            "Design certificate templates with a drag-and-drop canvas editor, upload CSV or JSON data, and generate hundreds of production-ready PDFs or PNGs in seconds. Zero-config, fully local — no sign-up, no API keys.",
        },
        {
          name: "keywords",
          content:
            "certificate generator, bulk certificate, pdf generator, certificate template, award certificate, diploma generator, certificate maker",
        },
        { name: "theme-color", content: "#fafafa" },
        { property: "og:type", content: "website" },
        {
          property: "og:title",
          content: "Certificate Generator — Design once. Generate hundreds.",
        },
        {
          property: "og:description",
          content:
            "Drag-and-drop templates. CSV data. Production-ready PDFs in seconds. Fully local, no sign-up needed.",
        },
        { property: "og:image", content: "/badge.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Certificate Generator" },
        {
          name: "twitter:description",
          content:
            "Design templates, upload data, generate certificates in bulk. Zero-config, fully local.",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/badge.png" },
        { rel: "preconnect", href: "https://api.fontshare.com" },
        { rel: "stylesheet", href: "https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Allura&display=swap" },
        {
           rel: "stylesheet",
           href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..146,100..900;1,9..146,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:ital,wght@0,400..700;1,400..700&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2025-07-01",
});
