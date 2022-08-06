import { createApp } from 'vue';
import { create } from 'naive-ui';
import router from './router';
import App from './App.vue';
import init from 'base9-builder';
import Antd from 'ant-design-vue'
import { ConfigProvider } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.variable.min.css'


ConfigProvider.config({
  theme: {
    primaryColor: '#25b864',
  },
});

function x() {}

async function main() {
  try {
    await init()
  } catch(e) {
    console.log('dev mode');
    const input = new URL('/node_modules/base9-builder/base9_builder_bg.wasm', import.meta.url);
    await init(input)
  }

  // hack, uncomment during dev

  // uncomment during prod

  const naive = create();
  createApp(App)
    .use(naive)
    .use(router)
    .use(Antd)
    .mount('#app');
}

main();
