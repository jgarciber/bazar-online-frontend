import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    // Leer la variable de entorno VITE_HOST desde process.env en el entorno de compilación
    // Si no está definida, tomará el valor por defecto 'http://localhost:3000'
    'import.meta.env.VITE_HOST': JSON.stringify(
      process.env.VITE_HOST || 'http://localhost:3000'
    )
  }
})