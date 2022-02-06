import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from "vue-router";

import TheHome from "@/views/TheHome.vue";
import TheConverter from "@/views/TheConverter.vue";
import TheTable from "@/views/TheTable.vue";
const NotFound = () => import("@/views/TheNotFound.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: TheHome
  },
  {
    path: "/converter",
    name: "Converter",
    component: TheConverter
  },
  {
    path: "/table",
    name: "Table",
    component: TheTable
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { hidden: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// filter out hidden routes
const clonedGetRoutes = router.getRoutes.bind({});
router.getRoutes = () =>
  clonedGetRoutes().filter((route) => !route.meta.hidden);

export default router;
