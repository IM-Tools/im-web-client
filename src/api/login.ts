import request from './request'
// 登录接口
export function login(data: Object) {
  return request.post('/api/auth/login', data)
}
//注册
export function registerede(data: Object) {
  return request.post('/api/auth/registered', data)
}
// 邮箱验证码
export function sendEmailCode(data: Object) {
  return request.post('/api/auth/sendEmailCode', data)
}

