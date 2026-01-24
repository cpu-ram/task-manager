import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();
const allowedHostsArray = process.env.ALLOWED_HOSTS?.split(',') ?? [];

const baseLaunchDirectory = process.env.BASE_LAUNCH_DIRECTORY ?? '';

export default defineConfig({
  base: `${baseLaunchDirectory}`,
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: allowedHostsArray,
  },
});
