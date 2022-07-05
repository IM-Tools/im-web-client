import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Login",
        component: () => import("../views/login/index.vue")
    },
    {
        path: "/about",
        name: "About",
        component: () => import("../views/about/index.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),//process.env.BASE_URL
    routes,
});

export default router;