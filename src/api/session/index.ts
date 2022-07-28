import request from '../request'
import { sessionData } from './type'
// 获取会话列表
export function sessionList(params?: Object) {
  return request.get('/sessions', { params })
}
//创建会话
export function createSession(data: sessionData) {
  return request.post('/sessions', data)
}

