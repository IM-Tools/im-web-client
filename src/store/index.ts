import { defineStore } from 'pinia'
import { sessionList } from '@/api/session'
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
      sessionInfo: localStorage.getItem('sessionInfo')
        ? JSON.parse(localStorage.getItem('sessionInfo') as string)
        : {},
      sessionList: [],
    }
  },
  actions: {
    setTheme(theme: string) {
      localStorage.setItem('theme', theme)
      this.themeSelect = theme
    },
    setToken(token: string) {
      localStorage.setItem('token', token)
      this.themeSelect = token
    },
    async setUserInfo(data: Object) {
      localStorage.setItem('userInfo', JSON.stringify(data))
      this.userInfo = data
    },
    setSessionInfo(data: Object) {
      localStorage.setItem('sessionInfo', JSON.stringify(data))
      this.sessionInfo = data
    },
    async getSessionInfo() {
      const res = await sessionList()
      this.sessionList = res as any
    },
    logOut(){
      this.token = ''
      this.userInfo = {}
      this.sessionInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('sessionInfo')
    }
  },
})
