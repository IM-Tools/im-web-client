import request from './request'
// 获取好友列表
export function friendList(data?: Object) {
  return request.get('/friends', {data})
}
//添加好友
interface recordFriend{
  to_id: number | string,
  information: string
}
export function recordFriend(data: recordFriend) {
  return request.post('/friends/record', data)
}
// 获取好友请求列表
export function friendRecordList(data?: Object) {
  return request.get('/friends/record', {data})
}
// 同意/拒绝好友请求
// export function friendRecordList(data: Object) {
//   return request.get('/api/friends/record', {data})
// }

