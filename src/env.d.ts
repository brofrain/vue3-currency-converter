declare module "*.vue" {
  import { DefineComponent } from "vue";
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMeta {
  env: {
    BASE_URL: string;
    VITE_CURRENCY_RATES_API_URL: string;
    VITE_CURRENCY_NAMES_API_URL: string;
    VITE_BASE_CURRENCY: Lowercase<string>;
  };
}
