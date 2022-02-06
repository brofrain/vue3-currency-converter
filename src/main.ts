import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import * as baseComponents from "@/components/base";

const app = createApp(App);

app.use(router).use(createPinia());

for (const [componentName, component] of Object.entries(baseComponents)) {
  app.component(componentName, component);
}

app.mount("#app");
