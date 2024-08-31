import { glob } from 'glob'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  appType: 'custom',
  server: {
    hmr: false,
    middlewareMode: true,
  },
  build: {
    ssr: true,
    target: 'node20',
    outDir: '../../dist/server/views',
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      input: [...await glob('../ui/views/**/*.tsx')],
    },
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
})
