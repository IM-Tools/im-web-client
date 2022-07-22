import request from './request'
// 获取私聊消息
export function chatMessage(data: Object) {
  return request.get('/api/messages', {data})
}
// 发送消息
export function sendChatMessage(data: Object) {
  return request.post('/api/messages/private', data)
}

