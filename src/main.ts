import { createApp } from 'vue'
import { store, key } from './store'
import router from "./router";
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css'


const app = createApp(App)
 

app.use(ElementPlus)
app.use(store, key)
app.use(router)
app.mount('#app')