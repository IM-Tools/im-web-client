import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getStorage } from '@/utils/storage'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/session',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/about/index.vue'),
    meta: {
      isNav: true,
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {
      isNav: true,
    },
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/address/index.vue'),
    meta: {
      isNav: true,
    },
  },
  {
    path: '/session',
    name: 'Session',
    component: () => import('../views/session/index.vue'),
    meta: {
      isNav: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(), //process.env.BASE_URL
  routes,
})
// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getStorage('token')
  if (to.path === '/login' && token) {
    next('/')
    return
  }
  if(to.path !== '/login' && !token){
    next('/login')
    return
  }
  next()
})
export default router
