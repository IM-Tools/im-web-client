import { defineStore } from 'pinia'
import { sessionList } from '@/api/session'
import { chatMessage } from '@/api/chat'
import { timestampChange } from '@/utils'
import type { userType, sessionType } from '@/api/session/type'
import type { chatRecordType,chatItemType } from '@/api/chat/type'
import router from '@/router'
import { getStorage, setStorage } from '@/utils/storage'

export const sessionStore = defineStore('sessionStore', {
  state: () => {
    const scrollType: boolean = true
    const sessionList: sessionType<userType>[] = getStorage('sessionList','object') || []
    const selectSession: sessionType<userType> = getStorage('selectSession','object') || []
    const chattingRecords: chatRecordType<chatItemType> = getStorage('chattingRecords','object') || []
    return {
      sessionList,
      selectSession,
      chattingRecords,
      scrollType
    }
  },
  actions: {
    startScroll(){
      console.log(223366);
      
      this.scrollType = !this.scrollType
    },
    async setSessionList() {
      if (this.sessionList[0]) {
        if (!this.selectSession.id) {
          this.selectSession = this.sessionList[0]
        }
        this.setChattingRecords(this.selectSession)
        return
      }
      const res = await sessionList()
      setStorage('sessionList', res)
      this.sessionList = res.map( item => {
        const time = new Date()
        const option = {
          content: '开始聊天',
          time: timestampChange(time, 'HH:mm')
        }
        item.last_message = option
        return item
      })
      if (!this.selectSession.id) {
        this.selectSession = this.sessionList[0]
      }
      this.setChattingRecords(this.selectSession)
    },
    changeSessionList(session: sessionType<userType>, type: string) {
      if (type === 'add') {
        let isAdd: boolean = false
        this.sessionList.forEach((item) => {
          if (item.id === session.id) {
            isAdd = true
          }
        })
        if (!isAdd) {
          this.sessionList.push(session)
          setStorage('sessionList', this.sessionList)
        }
        // 改变选中的会话
        this.selectSession = session
        setStorage('selectSession', session)
        router.push('/session')
      }
      if (type === 'delete') {
        const idx: number = this.sessionList.findIndex((item) => {
          return item.id === session.id
        })
        // 移除对应会话
        if (idx >= 0) {
          this.sessionList.splice(idx, 1)
          setStorage('sessionList', this.sessionList)
        }
        // 判断是否是选中的会话
        if(this.selectSession.id === session.id){
          this.selectSession = this.sessionList[0] || {}
          setStorage('selectSession', this.selectSession)
        }
      }
      if(type === 'send'){
        const idx: number = this.sessionList.findIndex((item) => {
          return item.id === session.id
        })
        console.log('send',this.sessionList[idx]);
        if (idx >= 0) {
          this.sessionList[idx].last_message = session.last_message
          setStorage('sessionList', this.sessionList)
        }
      }
    },
    setSelectSession(session: sessionType<userType>) {
      this.selectSession = session
      setStorage('selectSession', this.selectSession)
    },
    async setChattingRecords(session: sessionType<userType>) {
      const message = await chatMessage({
        page: "",
        pageSize: 20,
        to_id: session.to_id,
      })
      console.log(message);
      const isArray = message.list instanceof Array
      const chatRecord = {
        list: isArray ? message.list : [],
        mate: message.mate || {},
        id: session.to_id,
        from_id: session.form_id
      }
      this.chattingRecords = chatRecord
      setStorage('chattingRecords', this.chattingRecords)
      return true
    },
    async moreRecord(session: sessionType<userType>, chatId: number){
      const message = await chatMessage({
        page: chatId,
        pageSize: 20,
        to_id: session.to_id,
      })
      console.log(message);
      const isArray = message.list instanceof Array
      const chatRecord = {
        list: isArray ? message.list.concat(this.chattingRecords.list) : this.chattingRecords.list,
        mate: message.mate || {},
        id: session.to_id,
        from_id: session.form_id
      }
      this.chattingRecords = chatRecord
      setStorage('chattingRecords', this.chattingRecords)
    },
    changeChattingRecords(message: chatItemType){
      if(message.form_id === this.chattingRecords.id || message.form_id === this.chattingRecords.from_id){
        this.chattingRecords.list.push(message)
        setStorage('chattingRecords', this.chattingRecords)
      }
      return new Promise(resolve => {
        resolve(true)
      })
    }
  },
})
