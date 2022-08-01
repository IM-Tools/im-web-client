import request from '../request'
import type { recordFriend, requestListType, userType, friendRecordType, friendType} from './type'
// 获取好友列表
export function friendList(params?: Object) {
  return request.get('/friends', { params })
}
//添加好友
export function recordFriend(data: recordFriend) {
  return request.post('/friends/record', data)
}
// 获取好友详情
export function getFriendDetails(params: number) {
  return request.get(`/user/${params}`)
}
// 获取好友请求列表
export function friendRecordList(params?: Object) {
  return request.get<requestListType<userType>[]>('/friends/record', { params })
}
//同意/拒绝好友请求
export function friendRecord(data: friendRecordType) {
  return request.put<friendType<userType>[]>('/friends/record', data)
}
