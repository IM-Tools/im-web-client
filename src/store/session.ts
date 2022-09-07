import { defineStore } from 'pinia'
import { sessionList, removeSession } from '@/api/session'
import { chatMessage } from '@/api/chat'
import { timestampChange } from '@/utils'
import type { userType, sessionType } from '@/api/session/type'
import type { chatRecordType, chatItemType } from '@/api/chat/type'
import router from '@/router'
import { getStorage, setStorage } from '@/utils/storage'
import { getPointMsg } from '@/utils/session'
export const sessionStore = defineStore('sessionStore', {
  state: () => {
    const scrollType: boolean = true
    const sessionList: sessionType<userType>[] =
      getStorage('sessionList', 'object') || []
    const selectSession: sessionType<userType> =
      getStorage('selectSession', 'object') || []
    const chattingRecords: chatRecordType<chatItemType> | null =
      getStorage('chattingRecords', 'object') || null
    return {
      sessionList,
      selectSession,
      chattingRecords,
      scrollType,
    }
  },
  actions: {
    // 是否滚动
    startScroll() {
      this.scrollType = !this.scrollType
    },
    // 获取会话列表
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
      if (!Array.isArray(res)) {
        return
      }
      this.sessionList = res.map((item) => {
        const time = new Date()
        const option = {
          content: '开始聊天',
          time: timestampChange(time, 'HH:mm'),
        }
        item.last_message = option
        return item
      })
      if (!this.selectSession.id) {
        this.selectSession = this.sessionList[0]
      }
      this.setChattingRecords(this.selectSession)
    },
    // 改变会话列表
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
          removeSession(session.id).then(() => {
            this.sessionList.splice(idx, 1)
            setStorage('sessionList', this.sessionList)
          })
        }
        // 判断是否是选中的会话
        if (this.selectSession.id === session.id) {
          this.selectSession = this.sessionList[0] || {}
          setStorage('selectSession', this.selectSession)
          // 删除对应聊天记录
          this.chattingRecords = null
          setStorage('chattingRecords', '')
        }
      }
    },
    // 改变提示消息
    changeSessionPoint( message: chatItemType){
      const idx: number = this.sessionList.findIndex((item) => {
        return item.to_id === message.to_id
      })
      if (idx >= 0) {
        const time = new Date(message.created_at)
        const lastMessage = {
          content: getPointMsg(message.msg_type, message.msg),
          time: timestampChange(time, 'HH:mm')
        }
        this.sessionList[idx].last_message = lastMessage
        setStorage('sessionList', this.sessionList)
      }
    },
    // 设置选中会话
    setSelectSession(session: sessionType<userType>) {
      this.selectSession = session
      setStorage('selectSession', this.selectSession)
    },
    // 获取聊天记录
    async setChattingRecords(session: sessionType<userType>) {
      const message = await chatMessage({
        page: '',
        pageSize: 20,
        to_id: session.to_id,
      })
      console.log(message)
      const isArray = message.list instanceof Array
      const chatRecord = {
        list: isArray ? message.list : [],
        mate: message.mate || {},
        id: session.to_id,
        from_id: session.form_id,
      }
      this.chattingRecords = chatRecord
      setStorage('chattingRecords', this.chattingRecords)
      return true
    },
    // 更改聊天记录/更多聊天记录
    async moreRecord(session: sessionType<userType>, chatId: number) {
      const message = await chatMessage({
        page: chatId,
        pageSize: 20,
        to_id: session.to_id,
      })
      console.log(message)
      const isArray = message.list instanceof Array
      const chatRecord = {
        list: isArray && this.chattingRecords
          ? message.list.concat(this.chattingRecords.list)
          :  message.list,
        mate: message.mate || {},
        id: session.to_id,
        from_id: session.form_id,
      }
      this.chattingRecords = chatRecord
      setStorage('chattingRecords', this.chattingRecords)
    },
    // 发送和接收聊天记录
    changeChattingRecords(message: chatItemType) {
      this.changeSessionPoint(message)
      if(!this.chattingRecords){
        // 无聊天记录时
        const chatRecord = {
          list: [message],
          mate: {
            page: 1,
            pageSize: 10,
            total: 1
          },
          id: message.form_id,
          from_id: message.to_id,
        }
        this.chattingRecords = chatRecord
        setStorage('chattingRecords', this.chattingRecords)
        return new Promise((resolve) => {
          resolve(true)
        })
      }
      if (
        message.form_id === this.chattingRecords.id ||
        message.form_id === this.chattingRecords.from_id
      ) {
        this.chattingRecords.list.push(message)
        setStorage('chattingRecords', this.chattingRecords)
      }
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    // 判断是否存在会话 存在则移除
    checkSession(id: number) {
      const session = this.sessionList.filter((item) => {
        return item.to_id === id
      })
      if (!session[0]) {
        return
      }
      // 移除对应会话
      this.changeSessionList(session[0], 'delete')
    },
  },
  getters: {
    // 判断是否展示聊天时间
    chattingRecordsList(state) {
      if(!state.chattingRecords){
        return state.chattingRecords
      }
      const recordsList = JSON.parse(JSON.stringify(state.chattingRecords))
      recordsList.list = []
      console.log(recordsList,state.chattingRecords);
      if(!state.chattingRecords.list[0]){
        return []
      }
      let timesStr = state.chattingRecords.list[0].created_at
      let time = new Date(timesStr).getTime()
      state.chattingRecords.list.forEach((item) => {
        const timeMs = new Date(item.created_at).getTime()
        if (timeMs - time > 120 * 1000) {
          item.isShowTime = true
        }
        recordsList.list.push(item)
        time = new Date(item.created_at).getTime()
      })
      return recordsList
    },
  },
})
