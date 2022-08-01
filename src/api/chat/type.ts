export interface chatData {
  page: number | string,
  pageSize: number | string,
  to_id: number | string,
}

export interface sendChatData {
  msg_client_id: number | string,//客户端唯一值 用时间戳生成
  msg_type: number,//1.文本 2.语音 3.文件
  to_id: number,//推送人
  channel_type: number,//1.私聊 2.频道 3.广播
  data?: string,
  message: string,
}

export interface chatItemType{
  created_at: string
  data: string
  form_id: number
  id: number
  is_read: number
  msg: string
  msg_type: number
  status: number
  to_id: number
  Users: {
    avatar: string
    email: string
    id: number
    name: string
  }
}
export interface chatRecordType<T>{
  list: T[],
  mate: {
    page: number,
    pageSize: number,
    total: number
  },
  id?: number
  from_id?: number
}