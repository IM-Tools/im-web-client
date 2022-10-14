export interface sessionData {
  id: number,
  type: number
}
export interface userType{
  age: number
  avatar: string
  bio: string
  client_type: number
  email: string
  id: number
  last_login_time: string
  name: string
  sex: number
  status: number
}
export interface groupType{
  avatar: string
  id: number
  created_at: string
  name: string
  hot: number
  user_id: number,
  is_pwd: number,
  info: string
}
export interface sessionType<T,K> {
  id: number,
  name: string,
  note: string,
  created_at: string,
  avatar: string,
  top_time: string,
  status: number, 
  to_id: number, 
  form_id: number, 
  group_id?: number,
  channel_type: number,
  top_status: number, 
  Users?: T, 
  Groups?: K, 
  value?: any,
  last_message: {
    content: string,
    time: string,
    isPoint?: boolean,
    num?: number
  }
}