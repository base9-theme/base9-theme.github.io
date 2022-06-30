import { createRouter, createWebHistory } from 'vue-router';
import Preview from './views/Preview.vue';
import Export from './views/Export.vue';
import About from './views/About.vue';
import about from './assets/about.md';
import templateGuide from './assets/template_guide.md';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Preview,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    props: { mdString: about},
  },
  {
    path: '/export',
    name: 'Export',
    component: Export,
  },
  {
    path: '/guide/template',
    name: 'Template',
    component: About,
    props: { mdString: templateGuide },
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
