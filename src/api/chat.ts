import request from './request'
// 获取私聊消息
interface chatData {
  page: number | string,
  pageSize: number | string,
  to_id: number | string,
}
export function chatMessage(data: chatData) {
  return request.get('/api/messages', {data})
}
// 发送消息
export function sendChatMessage(data: Object) {
  return request.post('/api/messages/private', data)
}

