import { defineStore } from 'pinia'
export const mainStore = defineStore('main', {
  state: () => {
    return {
      themeList: [
        {
          name: '亮色主题',
          class: 'light-theme'
        },
        {
          name: '暗色主题',
          class: 'dark-theme'
        }
      ],
      themeSelect: 'light-theme'
    }
  },
  actions: {},
})