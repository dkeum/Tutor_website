import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'defer-css',
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+)">/,
          `<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="$1"></noscript>`
        )
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["remark-math", "rehype-katex", "react-markdown"],
  },
})