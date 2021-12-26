import { createRouter, createWebHistory } from 'vue-router';
import Preview from './components/Preview.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Preview,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
