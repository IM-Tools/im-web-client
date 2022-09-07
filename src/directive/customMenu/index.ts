import { createApp } from 'vue'
import customMenu from './index.vue'

export const CustomMenuBox = (props: any) => {
  // 获取组件
  const instance = createApp(customMenu, { ...props })
  // 提供父元素
  const parent = document.createElement('div')
  instance.mount(parent)
  document.body.appendChild(parent)
  return { instance, parent }
}
