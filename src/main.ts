import { createApp } from 'vue';
import { create } from 'naive-ui';
import router from './router';
import App from './App.vue';

const naive = create();

createApp(App)
  .use(naive)
  .use(router)
  .mount('#app');
