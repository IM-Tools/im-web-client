import { defineStore } from 'pinia'
import { sessionList, removeSession, createSession } from '@/api/session'
import { chatMessage } from '@/api/chat'
import { timestampChange } from '@/utils'
import type { userType, sessionType, groupType } from '@/api/session/type'
import type { chatRecordType, chatItemType } from '@/api/chat/type'
import router from '@/router'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { getPointMsg } from '@/utils/session'
import { mainStore } from './index'

export const sessionStore = defineStore('sessionStore', {
  state: () => {
    const scrollType: boolean = true
    const sessionList: sessionType<userType, groupType>[] =
      getStorage('sessionList', 'object') || []
    const querySessionList: sessionType<userType, groupType>[] = []
    const selectSession: sessionType<userType, groupType> | null =
      getStorage('selectSession', 'object') || null
    const chattingRecords: chatRecordType<chatItemType> | null =
      getStorage('chattingRecords', 'object') || null
    const total: number = 0
    const isShowMoreBtn: boolean = false
    return {
      sessionList,
      selectSession,
      chattingRecords,
      scrollType,
      total,
      isShowMoreBtn,
      page: 1,
      querySessionList,
    }
  },
  actions: {
    // 是否滚动
    startScroll() {
      this.scrollType = !this.scrollType
    },
    // 查询会话
    getQuerySessionList(search: string, clear?: boolean) {
      if (clear) {
        this.querySessionList = []
        return
      }
      this.querySessionList = this.sessionList.filter((item) => {
        return (
          item.name.indexOf(search) !== -1 ||
          (item.Users && item.Users.email.indexOf(search) !== -1)
        )
      })
    },
    // 获取会话列表
    async setSessionList() {
      if (this.sessionList[0]) {
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
      if (!this.selectSession) {
        this.selectSession = this.sessionList[0]
        setStorage('selectSession', this.selectSession)
        this.setChattingRecords(this.selectSession)
      }
    },
    // 改变会话列表
    changeSessionList(session: sessionType<userType, groupType>, type: string) {
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
        this.setChattingRecords(session)
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
            // 判断是否是选中的会话
            console.log('判断是否是选中的会话', this.selectSession, session.id)

            if (this.selectSession && this.selectSession.id === session.id) {
              if (this.sessionList[0]) {
                this.selectSession = this.sessionList[0]
                setStorage('selectSession', this.selectSession)
                return this.setChattingRecords(this.selectSession)
              }
              this.selectSession = null
              setStorage('selectSession', '')
              // 删除对应聊天记录
              this.chattingRecords = null
              setStorage('chattingRecords', '')
              return new Promise((resolve) => {
                resolve(true)
              })
            }
          })
        }
      }
      if (type === 'agree') {
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
      }
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    // 改变提示消息
    async changeSessionPoint(message: chatItemType) {
      const idx: number = this.sessionList.findIndex((item) => {
        const userStore = mainStore()
        const res =
          item.to_id === message.to_id && item.form_id === userStore.userInfo.id
        return (
          res ||
          (item.to_id === message.form_id && item.form_id === message.to_id)
        )
      })
      // 有会话记录
      if (idx >= 0) {
        const time = new Date(message.created_at)
        if (
          this.sessionList[idx].to_id === message.form_id &&
          this.sessionList[idx].form_id === message.to_id
        ) {
          // 判断是不是选中的会话
          if (
            !this.selectSession ||
            this.sessionList[idx].id !== this.selectSession.id
          ) {
            const { isPoint, num } = this.sessionList[idx].last_message
            let number = 1
            if (isPoint && num) {
              number = num + 1
            }
            const lastMessage = {
              content: getPointMsg(message.msg_type, message.msg),
              time: timestampChange(time, 'HH:mm'),
              isPoint: true,
              num: number,
            }
            this.sessionList[idx].last_message = lastMessage
            setStorage('sessionList', this.sessionList)
            return
          }
        }
        const lastMessage = {
          content: getPointMsg(message.msg_type, message.msg),
          time: timestampChange(time, 'HH:mm'),
        }
        this.sessionList[idx].last_message = lastMessage
        setStorage('sessionList', this.sessionList)
      } else {
        // 没有会话记录则创建会话
        const result = await createSession({
          id: message.form_id,
          type: 1,
        })
        const time = new Date(message.created_at)
        const session = Object.assign(result, {
          last_message: {
            content: getPointMsg(message.msg_type, message.msg),
            time: timestampChange(time, 'HH:mm'),
            isPoint: true,
            num: 1,
          },
        })
        this.changeSessionList(session, 'add')
      }
    },
    // 设置选中会话
    setSelectSession(session: sessionType<userType, groupType>) {
      this.selectSession = session
      setStorage('selectSession', this.selectSession)
      // 清除选中会话提示
      const idx: number = this.sessionList.findIndex((item) => {
        return item.id === session.id
      })
      const times = new Date()
      const { content, time } = this.sessionList[idx].last_message || {
        content: '开始聊天',
        time: timestampChange(times, 'HH:mm'),
      }
      const lastMessage = {
        content: content,
        time: time,
        isPoint: false,
        num: 0,
      }
      this.sessionList[idx].last_message = lastMessage
      setStorage('sessionList', this.sessionList)
    },
    // 获取聊天记录
    async setChattingRecords(session: sessionType<userType, groupType>) {
      const message = await chatMessage({
        page: '',
        pageSize: 20,
        to_id: session.to_id,
      })
      this.total = message.mate.total
      if (this.total <= this.page * 20) {
        this.isShowMoreBtn = false
      } else {
        this.isShowMoreBtn = true
      }
      console.log(this.total)
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
    async moreRecord(
      session: sessionType<userType, groupType>,
      chatId: number
    ) {
      this.page++
      const message = await chatMessage({
        page: chatId,
        pageSize: 20,
        to_id: session.to_id,
      })
      if (this.total <= this.page * 20) {
        this.isShowMoreBtn = false
      } else {
        this.isShowMoreBtn = true
      }
      const isArray = message.list instanceof Array
      const chatRecord = {
        list:
          isArray && this.chattingRecords
            ? message.list.concat(this.chattingRecords.list)
            : !isArray && this.chattingRecords
            ? this.chattingRecords.list
            : [],
        mate: message.mate || {},
        id: session.to_id,
        from_id: session.form_id,
      }
      this.chattingRecords = chatRecord
      setStorage('chattingRecords', this.chattingRecords)
      return true
    },
    // 发送和接收聊天记录
    changeChattingRecords(message: chatItemType) {
      if (this.selectSession && this.chattingRecords) {
        const userStore = mainStore()
        // 接收消息
        if (
          message.form_id === this.selectSession.to_id &&
          message.to_id === this.selectSession.form_id
        ) {
          this.chattingRecords.list.push(message)
          setStorage('chattingRecords', this.chattingRecords)
        }
        // 发送消息
        if (
          message.form_id === userStore.userInfo.id &&
          message.to_id === this.selectSession.to_id
        ) {
          this.chattingRecords.list.push(message)
          setStorage('chattingRecords', this.chattingRecords)
        }
      }
      this.changeSessionPoint(message)
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
    init() {
      this.sessionList = []
      this.selectSession = null
      this.chattingRecords = null
      removeStorage('sessionList')
      removeStorage('selectSession')
      removeStorage('chattingRecords')
    },
  },
  getters: {
    // 判断是否展示聊天时间
    chattingRecordsList(state) {
      if (!state.chattingRecords) {
        return state.chattingRecords
      }
      const recordsList = JSON.parse(JSON.stringify(state.chattingRecords))
      recordsList.list = []
      if (!state.chattingRecords.list[0]) {
        return []
      }
      let timesStr = state.chattingRecords.list[0].created_at
      let time = new Date(timesStr).getTime()
      state.chattingRecords.list.forEach((item, index) => {
        if (index === 0) {
          item.isShowTime = true
        }
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
