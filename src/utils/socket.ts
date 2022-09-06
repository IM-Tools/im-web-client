import { useWebSocket } from '@vueuse/core'
import { sessionStore } from '@/store/session'
import { computed } from '@vue/reactivity'
import { timestampChange } from '@/utils'
import { getFriendDetails } from '@/api/friend'
import { getStorage } from '@/utils/storage'
interface socketOptions {
  close: Function
  ws: object
  send: Function
}
let wsObj: socketOptions | null = null
function closeWs() {
  wsObj && wsObj.close()
  wsObj = null
}
function initWebsocket(openBack: Function, closeBack: Function) {
  if (wsObj) {
    return
  }
  const store = sessionStore()
  const { status, data, send, open, close } = useWebSocket(
    import.meta.env.VITE_APP_WS_API + getStorage('token'),
    {
      autoReconnect: {
        retries: 3,
        delay: 1500,
        onFailed() {
          console.log('websocket重连失败')
          closeBack && closeBack()
          wsObj = null
        },
      },
      onConnected(ws) {
        // 心跳
        setInterval(() => {
          send('{"msg_code": 1004,"message":"ping"}')
        },10000)
        console.log('onConnected', ws)
        wsObj = { ws, close, send }
        openBack && openBack()
      },
      async onMessage(ws, event) {
        // 选中的会话
        const selectSession = computed(() => store.selectSession)
        // console.log('event', event)
        if(!event.data){
          return
        }
        const message = JSON.parse(event.data)
        switch (message.msg_code) {
          case 200:
            console.log('聊天消息', message)
            const time = new Date()
            const res = await getFriendDetails(message.form_id)
            const chatMsg = {
              Users: {
                avatar: res.avatar,
                email: res.email,
                id: res.id,
                name: res.name,
              },
              created_at: timestampChange(time),
              data: message.data,
              form_id: message.form_id,
              id: time.getTime() + 1,
              is_read: 0,
              msg: message.message,
              msg_type: message.msg_type,
              to_id: message.to_id,
              status: 1,
            }
            // 聊天记录
            const result = store.changeChattingRecords(chatMsg)
            result.then( () => {
              store.startScroll()
            })
            // 会话列表记录
            const sessionMsg = Object.assign(selectSession.value, {
              last_message: {
                content: message.message,
                time: timestampChange(time, 'HH:mm'),
              },
            })
            store.changeSessionList(sessionMsg, 'send')
            break
          case 1000:
            console.log('添加好友请求', message)
            break
          case 1001:
            console.log('同意好友请求', message)
            break
          case 1002:
            console.log('拒绝好友请求', message)
            break
          case 1003:
            console.log('非好友关系', message)
            break
          case 2000:
            console.log('用户离线', message)
            break
          case 2001:
            console.log('用户上线', message)
            break
        }
      },
    }
  )
}

export { initWebsocket, closeWs }
