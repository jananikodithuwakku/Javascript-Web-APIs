import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),     // transform JSX correctly
    basicSsl()   // HTTPS support
  ],
  server: {
    https: true, // Enable HTTPS
    port: 3000,
    host: true   // allow access from LAN devices (like iPhone)
  },
  base: ""
});