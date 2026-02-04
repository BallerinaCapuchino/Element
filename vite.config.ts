import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Базовый путь для GitHub Pages. 
  // Если репозиторий называется 'Element', путь должен быть '/Element/'.
  // Если вы привязываете свой домен (например element.com), поменяйте на '/'
  base: '/Element/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true // Позволяет тестировать на телефоне в локальной сети
  }
});