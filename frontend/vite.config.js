
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        // Fixes 'eval' block: Vite requires this for Hot Module Replacement (HMR)
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        // Fixes Image block: Added http://localhost:8000 to allow backend uploads
        "img-src 'self' data: blob: https: http://localhost:8000",
        // Fixes Connection block: Allows API calls and WebSockets to your backend
        "connect-src 'self' http://localhost:8000 ws://localhost:*",
        "worker-src 'self' blob:",
      ].join("; "),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  }
});



