import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    {
      name: "copy-extension-manifest",
      closeBundle() {
        copyFileSync(
          resolve(process.cwd(), "manifest.json"),
          resolve(process.cwd(), "dist/manifest.json")
        );
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: "src/content.ts",
      },
      output: {
        entryFileNames: "content.js",
        format: "iife",
      },
    },
  },
});