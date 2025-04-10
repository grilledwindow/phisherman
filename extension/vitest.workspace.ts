import tailwindcss from '@tailwindcss/vite'
import solidPlugin from 'vite-plugin-solid'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: [
        'src/**/*.{test,spec}.ts',
      ],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    plugins: [solidPlugin(), tailwindcss()],
    test: {
      browser: {
        enabled: true,
        provider: 'webdriverio',
        instances: [
          {
            browser: 'firefox',
          }
        ],
      },
    },
  },
])
