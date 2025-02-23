import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
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
