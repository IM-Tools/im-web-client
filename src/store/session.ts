import { defineStore } from 'pinia'
import { sessionList } from '@/api/session'
import { chatMessage } from '@/api/chat'
import { timestampChange } from '@/utils'
import type { userType, sessionType } from '@/api/session/type'
import type { chatRecordType,chatItemType } from '@/api/chat/type'
export const sessionStore = defineStore('sessionStore', {
  state: () => {
    const sessionList: sessionType<userType>[] = sessionStorage.getItem(
      'sessionList'
    )
      ? JSON.parse(sessionStorage.getItem('sessionList') as string)
      : []
    const selectSession: sessionType<userType> = sessionStorage.getItem(
      'selectSession'
    )
      ? JSON.parse(sessionStorage.getItem('selectSession') as string)
      : {}
    const chattingRecords: chatRecordType<chatItemType> = sessionStorage.getItem('chattingRecords')
    ? JSON.parse(sessionStorage.getItem('chattingRecords') as string)
    : {}
    return {
      sessionChat: localStorage.getItem('sessionChat')
        ? JSON.parse(localStorage.getItem('sessionInfo') as string)
        : {},
      sessionList,
      selectSession,
      chattingRecords,
    }
  },
  actions: {
    async setSessionList() {
      if (this.sessionList[0]) {
        if (this.selectSession.id) {
          return
        } else {
          this.selectSession = this.sessionList[0]
        }
        return
      }
      const res = await sessionList()
      sessionStorage.setItem('sessionList', JSON.stringify(res))
      this.sessionList = res.map( item => {
        const time = new Date()
        const option = {
          content: '开始聊天',
          time: timestampChange(time, 'HH:mm:ss')
        }
        item.last_message = option
        return item
      })
      if (this.selectSession.id) {
        return
      } else {
        this.selectSession = this.sessionList[0]
      }
    },
    changeSessionList(session: sessionType<userType>, type: string) {
      if (type === 'add') {
        let isAdd: boolean = false
        this.sessionList.forEach((item) => {
          if (item.id !== session.id) {
            isAdd = true
          }
        })
        if (isAdd) {
          this.sessionList.push(session)
          sessionStorage.setItem(
            'sessionList',
            JSON.stringify(this.sessionList)
          )
        }
      }
      if (type === 'delete') {
        const idx: number = this.sessionList.findIndex((item) => {
          return item.id === session.id
        })
        if (idx >= 0) {
          this.sessionList.splice(idx, 1)
          sessionStorage.setItem(
            'sessionList',
            JSON.stringify(this.sessionList)
          )
        }
      }
      if(type === 'send'){
        
        const idx: number = this.sessionList.findIndex((item) => {
          return item.id === session.id
        })
        console.log('send',this.sessionList[idx]);
        if (idx >= 0) {
          this.sessionList[idx].last_message = session.last_message
          sessionStorage.setItem(
            'sessionList',
            JSON.stringify(this.sessionList)
          )
        }
      }
    },
    setSelectSession(session: sessionType<userType>) {
      this.selectSession = session
      sessionStorage.setItem(
        'selectSession',
        JSON.stringify(this.selectSession)
      )
    },
    async setChattingRecords(session: sessionType<userType>) {
      const message = await chatMessage({
        page: 1,
        pageSize: 20,
        to_id: session.to_id,
      })
      const chatRecord = {
        list: message.list || [],
        mate: message.mate|| {},
        id: session.to_id,
        from_id: session.form_id
      }
      this.chattingRecords = chatRecord
      sessionStorage.setItem('chattingRecords', JSON.stringify(this.chattingRecords))
    },
    changeChattingRecords(message: chatItemType){
      if(message.form_id === this.chattingRecords.id || message.form_id === this.chattingRecords.from_id){
        this.chattingRecords.list.push(message)
        sessionStorage.setItem('chattingRecords', JSON.stringify(this.chattingRecords))
      }
    }
  },
})
