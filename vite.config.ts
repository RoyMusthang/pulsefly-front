import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Optional: Disable sourcemaps for production
  },
  server: {
    port: 3000,
    host: true, // Important to ensure proper host binding in production
  },
  preview: {
    port: 3000,
    host: true, // Same as above for preview mode
  },
  define: {
    "import.meta.env": {},
  },
})
