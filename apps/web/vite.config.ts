import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@challenge/contracts": path.resolve(__dirname, "../../packages/contracts/src/index.js"),
    },
  },
  server: {
    port: 5173,
  },
});
