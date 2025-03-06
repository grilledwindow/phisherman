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
        // index.html isn't used as entry point because we don't need to render it.
        // config.html is used as an entry point since it's rendered as the "default_popup" action.
        // when bundling config.html, a config.js file is also created.
        input: ['src/index.tsx', 'config.html'],
        output: {
            entryFileNames: () => '[name].js',
            assetFileNames: () => '[name][extname]',
            manualChunks: (id) => {
                // idk what this actually does, but it removes the random chunk generated that causes import errors...
                // console.log(id);
                return '';
            }
        }
    },
    outDir: 'unpacked/assets/',
    target: 'modules',
  },
});
