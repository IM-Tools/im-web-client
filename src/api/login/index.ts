import request from '../request'
import { loginData, registerData, emailData } from './type'
// 登录接口
export function login(data: loginData) {
  return request.post('/auth/login', data)
}
export function oauthGithub(params?: Object) {
  return request.get('/auth/githubLogin', {params})
}
//注册
export function registerede(data: registerData) {
  return request.post('/auth/registered', data)
}
// 邮箱验证码
export function sendEmailCode(data: emailData) {
  return request.post('/auth/sendEmailCode', data)
}

