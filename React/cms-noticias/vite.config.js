import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ProyectoFinal_2025g1_Velasquez_Arianna/', // 👈 nombre EXACTO del repo con '/'
});
