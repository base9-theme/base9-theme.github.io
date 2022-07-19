import { createRouter, createWebHistory } from 'vue-router';
import Preview from './views/Preview.vue';
import Development from './views/Development.vue';
import Export from './views/Export.vue';
import about from './assets/about.md';
import colorPaletteGuide from './assets/color_palette_guide.md';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Preview,
  },
  {
    path: '/about',
    name: 'about',
    component: about,
  },
  {
    path: '/export',
    name: 'Export',
    component: Export,
  },
  {
    path: '/dev',
    name: 'Development',
    component: Development,
  },
  {
    path: '/guide/color_palette',
    name: 'Color Palette',
    component: colorPaletteGuide,
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
