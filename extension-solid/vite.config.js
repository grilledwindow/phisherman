import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
        input: {
            main: './src/index.jsx'
        },
        output: {
            entryFileNames: 'index.js'
        }
    },
    outDir: 'unpacked/assets/',
    target: 'modules',
  },
});
