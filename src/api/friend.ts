import request from './request'
// 获取好友列表
export function friendList(data: Object) {
  return request.get('/api/friends', {data})
}
//添加好友
export function recordFriend(data: Object) {
  return request.post('/api/friends/record', data)
}
// 获取好友请求列表
export function friendRecordList(data: Object) {
  return request.get('/api/friends/record', {data})
}
// 同意/拒绝好友请求
// export function friendRecordList(data: Object) {
//   return request.get('/api/friends/record', {data})
// }

