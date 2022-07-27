import request from './request'
// 获取私聊消息
interface chatData {
  page: number | string,
  pageSize: number | string,
  to_id: number | string,
}
export function chatMessage(data: chatData) {
  return request.get('/messages', {data})
}
// 发送消息

interface sendChatData {
  msg_client_id: number | string,//客户端唯一值 用时间戳生成
  msg_type: number,//1.文本 2.语音 3.文件
  to_id: number,//推送人
  channel_type: number,//1.私聊 2.频道 3.广播
  data?: string,
  message: string,
}
export function sendChatMessage(data: sendChatData) {
  return request.post('/messages/private', data)
}

