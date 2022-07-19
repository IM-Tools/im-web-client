import { useWebSocket } from '@vueuse/core'
interface socketOptions {
  close: Function,
  ws: object,
  send: Function
}
let wsObj: socketOptions | null = null
function closeWs() {
  wsObj && wsObj.close()
  wsObj = null
}
function initWebsocket(openBack: Function, closeBack: Function){
  if(wsObj){
    return
  }
  const { status, data, send, open, close } = useWebSocket('ws://websocketurl', {
    autoReconnect: {
      retries: 3,
      delay: 1500,
      onFailed() {
        console.log('websocket重连失败')
        closeBack && closeBack()
        wsObj = null
      }
    },
    onConnected(ws) {
      console.log('onConnected', ws)
      wsObj = { ws, close, send }
      openBack && openBack()
    },
    onMessage(ws, event) {
      // console.log('event', event)
      const message = JSON.parse(event.data)
      switch (message.type) {
        case 'ping':
          send('{"type":"pong"}')
          break
        case 'connect':
          console.log(message);
          break
        case 'notice':
          console.log(message);
          break
        case 'close':
          // 清除登录记录
          console.log(message);
          break
      }
    }
  })
}

export {
  initWebsocket,
  closeWs
}