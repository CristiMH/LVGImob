import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  ssr: {
    noExternal: [
      /^primereact/,
      'react-router-dom',
      'react-helmet-async'
    ]
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})
