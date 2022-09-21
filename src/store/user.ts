import { defineStore } from 'pinia'
import { friendList, deleteFriend } from '@/api/friend'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import type { friendType, userType } from '@/api/friend/type'
import { sessionStore } from './session'
export const userStore = defineStore('user', {
  state: () => {
    const userList: friendType<userType>[] =
      getStorage('userList', 'object') || []
    const queryUserList: friendType<userType>[] = []
    const selectUser: friendType<userType> | null =
      getStorage('selectUser', 'object') || {}
    const selectName: string = getStorage('selectName') || 'newFriend'
    return {
      userList,
      selectUser,
      selectName,
      queryUserList,
    }
  },
  actions: {
    getQueryUserList(search: string, clear?: boolean) {
      if (clear) {
        this.queryUserList = []
        return
      }
      this.queryUserList = this.userList.filter((item) => {
        return (
          item.Users.name.indexOf(search) !== -1 ||
          (item.Users.email && item.Users.email.indexOf(search) !== -1)
        )
      })
    },
    setUserList() {
      if (this.userList[0]) {
        return new Promise((resolve) => {
          resolve(true)
        })
      }
      friendList().then((res) => {
        this.userList = res
        setStorage('userList', res)
        return new Promise((resolve) => {
          resolve(true)
        })
      })
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    changeUserList(user: friendType<userType>, type: string = 'add') {
      if (type === 'add') {
        let isAdd: boolean = false
        this.userList.forEach((item) => {
          if (item.id === user.id) {
            isAdd = true
          }
        })
        if (!isAdd) {
          this.userList.push(user)
          setStorage('userList', this.userList)
        }
      }
      if (type === 'delete') {
        const idx: number = this.userList.findIndex((item) => {
          return item.id === user.id
        })
        if (idx >= 0) {
          this.userList.splice(idx, 1)
          setStorage('userList', this.userList)
        }
        if (this.selectUser && user.id === this.selectUser.id) {
          this.selectUser = null
          setStorage('selectUser', '')
        }
        deleteFriend(user.Users.id).then(() => {
          console.log('删除成功')
          const otherStore = sessionStore()
          otherStore.checkSession(user.Users.id)
        })
      }
    },
    setSelectUser(user: friendType<userType>) {
      this.selectUser = user
      setStorage('selectUser', user)
    },
    setSelectName(name: string) {
      this.selectName = name
      setStorage('selectName', name)
    },
    init() {
      this.userList = []
      this.selectUser = null
      removeStorage('userList')
      removeStorage('selectUser')
    },
  },
})
