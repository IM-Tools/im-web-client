import { createApp } from 'vue'
// 导入路由
import router from "./router";
// 引入pinia
import { createPinia } from "pinia";
// 创建 Pinia 实例
const pinia = createPinia();
// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
createApp(App).use(router).use(ElementPlus).use(pinia).mount('#app')
