import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const APP_BASENAME = '/iaslab/compu2/AMB';

export default defineConfig({
  plugins: [react()],
  base: `${APP_BASENAME}/`,
});
