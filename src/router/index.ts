import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import Login from "../view/auth/Login.vue";
 
const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "About" */ "../components/About.vue")
    }
];
 
const router = createRouter({
    history: createWebHistory(),//process.env.BASE_URL
    routes,
});
 
export default router;