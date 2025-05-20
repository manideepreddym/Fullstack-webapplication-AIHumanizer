import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: 3000,
    },
    define: {
      // Safely handle the WS token by ensuring it's a string or defaulting to empty string
      __WS_TOKEN__: JSON.stringify(env.VITE_WS_TOKEN || ''),
    }
  };
});