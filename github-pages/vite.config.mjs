import tailwindcss from '@tailwindcss/vite';

export default {
  base: './',
  plugins: [tailwindcss()],
  esbuild: { jsx: 'automatic' },
  build: { outDir: '../docs', emptyOutDir: true },
};
