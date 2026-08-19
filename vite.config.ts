import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// BASE_PATH lets the same build serve from a custom domain ("/") or from a
// GitHub Pages project path ("/Akash2377_portfolio/").
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH ?? "/",
  build: { assetsInlineLimit: 2048 },
});
