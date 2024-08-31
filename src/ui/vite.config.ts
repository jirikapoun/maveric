import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  publicDir: '../../public',
  appType: 'custom',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
    ssrManifest: true,
    rollupOptions: {
      input: ['index.html', 'loader.ts', ...await glob('views/**/*.tsx')],
      output: {
        entryFileNames: 'views/[name].js',
      },
    },
  },
  plugins: [
    react(),
  ],
})
