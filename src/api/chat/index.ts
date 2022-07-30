import request from '../request'
import { chatData, sendChatData, chatRecordType,chatItemType } from './type'
// 获取私聊消息
export function chatMessage(params: chatData) {
  return request.get<chatRecordType<chatItemType>>('/messages', {params})
}
// 发送消息
export function sendChatMessage(data: sendChatData) {
  return request.post('/messages/private', data)
}

