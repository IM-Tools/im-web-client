import { useWebSocket } from '@vueuse/core'
import { sessionStore } from '@/store/session'
import { timestampChange } from '@/utils'
import { getFriendDetails } from '@/api/friend'
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
    import.meta.env.VITE_APP_WS_API + localStorage.getItem('token'),
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
        console.log('onConnected', ws)
        wsObj = { ws, close, send }
        openBack && openBack()
      },
      async onMessage(ws, event) {
        // console.log('event', event)
        const message = JSON.parse(event.data)
        switch (message.msg_code) {
          case 2002:
            send('{"type":"pong"}')
            break
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
            store.changeChattingRecords(chatMsg)
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
