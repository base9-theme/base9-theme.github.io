/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module '*.md' {
  const s: string;
  export default s;
}
declare module '*.yaml' {
  const s: any;
  export default s;
}
declare module '*.mustache' {
  const s: string;
  export default s;
}
