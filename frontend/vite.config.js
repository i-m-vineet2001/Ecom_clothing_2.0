// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },

//   server: {
//     port: 5173,
//     // Fix: allow Vite's HMR to use eval in dev without CSP errors
//     headers: {
//       "Content-Security-Policy": [
//         "default-src 'self'",
//         "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Vite HMR + React
//         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//         "font-src 'self' https://fonts.gstatic.com",
//         "img-src 'self' data: blob: https:", // allow all https images (Unsplash, uploads)
//         "connect-src 'self' ws: wss: http://localhost:8000", // backend API + Vite websocket HMR
//         "object-src 'none'",
//         "base-uri 'self'",
//       ].join("; "),
//     },
//   },

//   // In production build, don't set CSP here — handle via server headers (nginx/caddy)
//   preview: {
//     port: 4173,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     headers: {
//       // ── CSP: allow eval() which Vite HMR and some React tooling require
//       // ── in development. Tighten this in production.
//       "Content-Security-Policy": [
//         "default-src 'self'",
//         "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
//         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//         "font-src 'self' https://fonts.gstatic.com",
//         "img-src 'self' data: blob: https:",
//         "connect-src 'self' http://localhost:8000 ws://localhost:*",
//         "worker-src 'self' blob:",
//       ].join("; "),
//     },
//   },
// });



// ... existing imports

// ... existing imports

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
});