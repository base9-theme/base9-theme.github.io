import { createApp } from 'vue';
import { create } from 'naive-ui';
import router from './router';
import App from './App.vue';
import init from 'base9-builder';

async function main() {
  await init()
  const naive = create();
  createApp(App)
    .use(naive)
    .use(router)
    .mount('#app');
}

main();
