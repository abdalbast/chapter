import { defineConfig } from "vite";

export default defineConfig({
  root: "HTML_TEMPLATE",
  server: {
    port: 5173,
    open: "/index.html",
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // Optimise build performance
    minify: "terser",
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: "HTML_TEMPLATE/index.html",
        about: "HTML_TEMPLATE/about.html",
        contact: "HTML_TEMPLATE/contact.html",
        blog: "HTML_TEMPLATE/blog.html",
        service: "HTML_TEMPLATE/service.html",
        pricing: "HTML_TEMPLATE/pricing.html",
        faq: "HTML_TEMPLATE/faq.html",
        partnership: "HTML_TEMPLATE/partnership.html",
        search: "HTML_TEMPLATE/search.html",
        single_post: "HTML_TEMPLATE/single_post.html",
        single_services: "HTML_TEMPLATE/single_services.html",
        case_studies: "HTML_TEMPLATE/case_studies.html",
        team: "HTML_TEMPLATE/team.html",
        testimonial: "HTML_TEMPLATE/testimonial.html",
        page404: "HTML_TEMPLATE/404_page.html",
      },
      output: {
        // Manual chunking for better caching
        manualChunks: {
          vendor: ["jquery"],
          bootstrap: ["bootstrap"],
          swiper: ["swiper"],
        },
        // Optimise asset naming for caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Optimise chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
