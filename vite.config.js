import { defineConfig } from 'vite';

export default defineConfig({
  root: ".",   // ✅ Set project root correctly
  publicDir: "public",
  server: {
    port: 5173,
  }
});
