import request from './request'

// 登录接口
interface loginData {
  email: string,
  password: string | number
}
export function login(data: loginData) {
  return request.post('/auth/login', data)
}
//注册
interface registerData {
  email: string,
  name: string,
  password: string | number,
  password_repeat: string | number,
  code: string | number,
  email_type?:string | number,
}
export function registerede(data: registerData) {
  return request.post('/auth/registered', data)
}
// 邮箱验证码
interface emailData {
  email: string,
  email_type: string | number
}
export function sendEmailCode(data: emailData) {
  return request.post('/auth/sendEmailCode', data)
}

