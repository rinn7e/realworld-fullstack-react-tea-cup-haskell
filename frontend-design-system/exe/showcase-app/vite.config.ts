import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@rinn7e/realworld-design-system/styles.css": path.resolve(
        __dirname,
        "../../dist/styles.css",
      ),
      "@rinn7e/realworld-design-system/plugin": path.resolve(
        __dirname,
        "../../dist/plugin.mjs",
      ),
      "@rinn7e/realworld-design-system": path.resolve(
        __dirname,
        "../../dist/index.mjs",
      ),
    },
  },
  server: {
    port: 5175,
    open: false,
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
  },
});
