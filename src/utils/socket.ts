import { useWebSocket } from '@vueuse/core'
import { sessionStore,userStore,mainStore } from '@/store'
// import { computed } from '@vue/reactivity'
import { timestampChange } from '@/utils'
import { getFriendDetails } from '@/api/friend'
import { getStorage } from '@/utils/storage'
import { useRoute } from 'vue-router'
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
  const usersStore = userStore()
  const mainStores = mainStore()
  const route = useRoute()
  const { status, data, send, open, close } = useWebSocket(
    import.meta.env.VITE_APP_WS_API + getStorage('token'),
    {
      autoReconnect: {
        retries: -1,
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
        }, 10000)
        wsObj = { ws, close, send }
        openBack && openBack()
      },
      async onMessage(ws, event) {
        if (!event.data) {
          return
        }
        console.log(event.data)

        const message = JSON.parse(event.data)
        switch (message.msg_code) {
          case 200:
            console.log('聊天消息', message,route.path)
            if(route.path !== '/session'){
              mainStores.changPoint('session', true)
            }
            if(message.channel_type === 1){
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
                channel_type: message.channel_type,
                status: 1,
              }
              // 聊天记录
              const result = store.changeChattingRecords(chatMsg)
              result.then(() => {
                store.startScroll()
              })
            } else{
              console.log('群聊');
              
            }
            break
          case 1000:
            console.log('添加好友请求', message,route)
            if(route.path !== '/address'){
              mainStores.changPoint('address', true)
            }
            break
          case 1001:
            console.log('同意好友请求', message)
            if(route.path !== '/session'){
              mainStores.changPoint('session', true)
            }
            const times = new Date()
            const list = {
              id: message.id,
              name: message.users.name,
              note: '',
              created_at: message.created_at,
              avatar: message.users.avatar,
              top_time: '',
              status: message.status,
              to_id: message.to_id,
              form_id: message.form_id,
              top_status: 0,
              channel_type: 1,
              Users: {
                age: 0,
                avatar: message.users.avatar,
                bio: '',
                client_type: 1,
                email: '',
                id: message.users.id,
                last_login_time: '',
                name: message.users.name,
                sex: 0,
                status: message.status,
              },
              last_message: {
                content: '添加好友成功',
                time: timestampChange(times, 'HH:mm'),
                isPoint: true,
                num: 1,
              },
            }
            store.changeSessionList(list, 'agree')
            const user = {
              created_at: message.created_at,
              form_id: message.form_id,
              id: message.form_id,
              note: message.note,
              to_id: message.to_id,
              status: message.status,
              top_time: message.top_time,
              uid: '',
              update_at: '',
              Users: {
                avatar: message.users.avatar,
                id: message.users.id,
                name: message.users.name,
              },
            }
            usersStore.changeUserList(user, 'add')
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
          case 2003:
            console.log('群聊通知', message)
            if(route.path !== '/session'){
              mainStores.changPoint('session', true)
            }
            const timeNow = new Date()
            const session = {
              id: message.sessions.id,
              name: message.sessions.name,
              note: message.sessions.note,
              created_at: message.sessions.created_at,
              avatar: message.sessions.avatar,
              top_time: message.sessions.top_time,
              status: message.sessions.status,
              to_id: message.sessions.to_id,
              form_id: message.sessions.form_id,
              group_id: message.sessions.group_id,
              top_status: message.sessions.top_status,
              channel_type: 2,
              Groups: message.sessions.Groups,
              last_message: {
                content: '添加好友成功',
                time: timestampChange(timeNow, 'HH:mm'),
                isPoint: true,
                num: 1,
              },
            }
            store.changeSessionList(session, 'add')
            break
        }
      },
    }
  )
}

export { initWebsocket, closeWs }
