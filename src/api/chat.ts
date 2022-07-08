import request from './request'
// 登录接口
export function chatMessage(data: Object) {
  return request.get('/api/messages', {data})
}

