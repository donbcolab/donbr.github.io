import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  // Configure base conditionally based on command
  base: command === 'serve'? '/': '/donbr.github.io/',  
  // Add React plugin
  plugins: [react()],
  
  // // Resolve aliases for easier imports
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, 'src'),
  //     '@components': resolve(__dirname, 'src/components'),
  //     '@assets': resolve(__dirname, 'src/assets'),
  //     '@lib': resolve(__dirname, 'src/lib'),
  //     '@hooks': resolve(__dirname, 'src/hooks'),
  //     '@pages': resolve(__dirname, 'src/pages'),
  //   }
  // },
  
  // Configure build output
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    host: true,
  }
}));
