import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@user': path.resolve(__dirname, 'src/pages/user'),
      '@admin': path.resolve(__dirname, 'src/pages/admin')
    }
  },
  server: { port: 5173, open: false },
  build: { outDir: 'dist', sourcemap: true }
});
