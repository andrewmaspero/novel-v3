import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig(() => ({
  plugins: [reactRouter()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
}));
