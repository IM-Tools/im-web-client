import { createApp } from 'vue'
// 引入pinia
import { createPinia } from "pinia";
// 创建 Pinia 实例
const pinia = createPinia();
// 导入路由
import router from "./router";
// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入基本样式
import 'normalize.css/normalize.css'
import '@/assets/css/base.css'
import '@/assets/css/theme.less'

import App from './App.vue'
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
