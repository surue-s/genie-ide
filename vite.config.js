import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "renderer",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: [],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});