import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/login/index.vue")
    },
    {
        path: "/about",
        name: "About",
        component: () => import("../views/about/index.vue"),
        meta: {
            isNav: true
        }
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/home/index.vue"),
        meta: {
            isNav: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),//process.env.BASE_URL
    routes,
});

export default router;