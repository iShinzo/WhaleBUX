import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env.VITE_BOT_TOKEN': JSON.stringify(process.env.VITE_BOT_TOKEN),
    'process.env.VITE_BOT_USERNAME': JSON.stringify(process.env.VITE_BOT_USERNAME),
    'process.env.VITE_WEBAPP_URL': JSON.stringify('https://zippy-rugelach-9d46c3.netlify.app')
  }
});