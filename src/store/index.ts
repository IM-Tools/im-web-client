import { defineStore } from 'pinia'
export const mainStore = defineStore('main', {
  state: () => {
    return {
      themeList: [
        {
          name: '亮色主题',
          class: 'light-theme',
          id: 1
        },
        {
          name: '暗色主题',
          class: 'dark-theme',
          id: 1
        }
      ],
      themeSelect: localStorage.getItem('theme') || 'light-theme'
    }
  },
  actions: {
    setTheme(theme: string){
      localStorage.setItem('theme',theme)
      this.themeSelect = theme
    }
  },
})