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
export interface sessionType<T> {
  id: number,
  name: string,
  note: string,
  created_at: string,
  avatar: string,
  top_time: string,
  status: number, 
  to_id: number, 
  form_id: number, 
  top_status: number, 
  Users: T, 
  value?: any,
  last_message: {
    content: string,
    time: string,
    isPoint?: boolean,
    num?: number
  }
}