import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/love-all-stamps/" : "/",
  root: "public",
  build: {
    outDir: "../dist", // This will place the dist folder in the project root
  },
  server: {
    host: "::",
    port: 8080,
  },
  envDir: "../",
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./public"),
    },
  },
}));
