import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    base: "/portfolio/",
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@contracts": path.resolve(__dirname, "./src/contracts"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@screens": path.resolve(__dirname, "./src/screens"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@theme": path.resolve(__dirname, "./src/theme"),
      }
    },
    plugins: [react()]
  };
});
