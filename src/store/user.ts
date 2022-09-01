import { defineStore } from 'pinia'
import { friendList } from '@/api/friend'
import { getStorage, setStorage  } from '@/utils/storage'
import type { friendType, userType } from '@/api/friend/type'
export const userStore = defineStore('user', {
  state: () => {
    const userList: friendType<userType>[] = getStorage('userList','object') || []
    const selectUser: friendType<userType> = getStorage('selectUser','object') || {}
    const selectName: string = getStorage('selectName') || 'newFriend'
    return {
      userList,
      selectUser,
      selectName
    }
  },
  actions: {
    setUserList(){
      if(this.userList[0]){
        return new Promise(resolve => {
          resolve(true)
        })
      }
      friendList().then((res) => {
        this.userList= res
        setStorage('userList', res)
        return new Promise(resolve => {
          resolve(true)
        })
      })
      return new Promise(resolve => {
        resolve(true)
      })
    },
    changeUserList(user: friendType<userType>, type: string = 'add'){
      if(type === 'add'){
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
      if(type === 'delete'){
        const idx: number = this.userList.findIndex((item) => {
          return item.id === user.id
        })
        if (idx >= 0) {
          this.userList.splice(idx, 1)
          setStorage('userList', this.userList)
        }
      }
    },
    setSelectUser(user: friendType<userType>){
      this.selectUser = user
      setStorage('selectUser', user)
    },
    setSelectName(name: string){
      this.selectName = name
      setStorage('selectName', name)
    }
  },
})
