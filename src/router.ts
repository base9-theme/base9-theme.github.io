import { createRouter, createWebHistory } from 'vue-router';
import Preview from './views/Preview.vue';
import Export from './views/Export.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Preview,
  },
  {
    path: '/export',
    name: 'Export',
    component: Export,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
