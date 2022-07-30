import { defineStore } from 'pinia'
export const mainStore = defineStore('main', {
  state: () => {
    return {
      themeList: [
        {
          name: '亮色主题',
          class: 'light',
          id: 1,
        },
        {
          name: '暗色主题',
          class: 'dark',
          id: 1,
        },
      ],
      themeSelect: localStorage.getItem('theme') || 'light',
      token: localStorage.getItem('token') || '',
      userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo') as string)
        : {},
    }
  },
  actions: {
    setTheme(theme: string) {
      localStorage.setItem('theme', theme)
      this.themeSelect = theme
    },
    setToken(token: string) {
      localStorage.setItem('token', token)
      this.token = token
    },
    async setUserInfo(data: Object) {
      localStorage.setItem('userInfo', JSON.stringify(data))
      this.userInfo = data
    },
    logOut(){
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
})
