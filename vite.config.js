// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/document_library/',  // ← ตรงกับชื่อ repo
  plugins: [react()],
});
