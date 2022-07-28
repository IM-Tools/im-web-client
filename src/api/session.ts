import request from './request'
// 获取会话列表
export function sessionList(data?: Object) {
  return request.get('/api/sessions/', { data })
}
//创建会话
interface sessionData {
  id: number,
  type: number
}
export function createSession(data: sessionData) {
  return request.post('/api/sessions/', data)
}

