import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss(), glsl({
    include: [
      '**/*.glsl',
      '**/*.vs',
      '**/*.fs'
    ],
    exclude: undefined,
    defaultExtension: 'glsl',
    warnDuplicatedImports: true,
    compress: false,
    watch: true,
    root: '.'
  })],
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})
