import request from '../request'
import {
  chatData,
  sendChatData,
  chatRecordType,
  chatItemType,
  chatGroupType,
} from './type'
// 获取私聊消息
export function chatMessage(params: chatData) {
  return request.get<chatRecordType<chatItemType>>('/messages', { params })
}
// 获取群聊消息
export function chatGroupMessage(params: chatData) {
  return request.get<chatRecordType<chatGroupType>>('/messages/groups', {
    params,
  })
}
// 发送消息
export function sendChatMessage(data: sendChatData) {
  return request.post('/messages/private', data)
}
// 文件上传
export function uploadFile(data: { file: any }) {
  return request.post('/upload/file', data)
}
