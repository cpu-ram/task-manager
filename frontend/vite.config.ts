import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();
const allowedHostsArray = process.env.ALLOWED_HOSTS?.split(',') ?? [];

const baseLaunchDirectory = process.env.BASE_LAUNCH_DIRECTORY ?? '';

export default defineConfig({
  base: `${baseLaunchDirectory}`,
  plugins: [react()],
  resolve: {
    alias: {
      'nested-core': path.resolve(__dirname, '../../nested-core/src'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: allowedHostsArray,
  },
});
