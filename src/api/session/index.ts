import request from '../request'
import type { userType, sessionType ,sessionData} from './type'
// 获取会话列表
export function sessionList(params?: Object) {
  return request.get<sessionType<userType>[]>('/sessions', { params })
}
//创建会话
export function createSession(data: sessionData) {
  return request.post<sessionType<userType>>('/sessions', data)
}
// 移除会话
export function removeSession(id: number){
  return request.delete(`/sessions/${id}`)
}

