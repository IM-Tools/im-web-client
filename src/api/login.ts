import request from './request'
// 登录接口
export function login(data: Object) {
  return request.post('/index/login', data)
}

