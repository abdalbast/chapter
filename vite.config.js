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
    },
  },
});
