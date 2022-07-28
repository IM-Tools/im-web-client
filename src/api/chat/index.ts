import request from '../request'
import { chatData, sendChatData } from './type'
// 获取私聊消息
export function chatMessage(params: chatData) {
  return request.get('/messages', {params})
}
// 发送消息
export function sendChatMessage(data: sendChatData) {
  return request.post('/messages/private', data)
}

