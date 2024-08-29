import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/ui',
  publicDir: '../../public',
  build: {
    copyPublicDir: false,
    rollupOptions: {
      input: ['src/ui/index.html', 'src/ui/loader.ts', ...await glob('src/ui/views/**/*.tsx')],
      output: {
        entryFileNames: 'views/[name].js',
      },
    },
  },
  plugins: [
    react(),
  ],
})
