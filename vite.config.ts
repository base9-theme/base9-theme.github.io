import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import content from '@originjs/vite-plugin-content';
import rawPlugin from 'vite-raw-plugin';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: '404.html',
        // nested: resolve(__dirname, 'nested/index.html')
      },
    },
  },
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    vue(),
    content(),
    rawPlugin({fileRegex: /\.mustache$/}),
    AutoImport({
      resolvers: [NaiveUiResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
});
