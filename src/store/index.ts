import { defineStore } from 'pinia'
import { getStorage, setStorage,removeStorage  } from '@/utils/storage'
export { sessionStore } from './session'
export { userStore} from './user'
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
      themeSelect: getStorage('theme') || 'light',
      token: getStorage('token') || '',
      userInfo: getStorage('userInfo', 'object') || {}
    }
  },
  actions: {
    setTheme(theme: string) {
      setStorage('theme', theme)
      this.themeSelect = theme
    },
    setToken(token: string) {
      setStorage('token', token)
      this.token = token
    },
    async setUserInfo(data: Object) {
      setStorage('userInfo', data)
      this.userInfo = data
    },
    logOut(){
      this.token = ''
      this.userInfo = {}
      removeStorage('token')
      removeStorage('userInfo')
      removeStorage('sessionList')
      removeStorage('selectSession')
      removeStorage('chattingRecords')
    }
  },
})
