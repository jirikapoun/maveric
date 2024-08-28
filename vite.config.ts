import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    rollupOptions: {
      input: ['index.html', ...await glob('src/ui/views/**/*.tsx')],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    react(),
  ],
})
