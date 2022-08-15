export interface recordFriend {
  to_id: number | string
  information: string
}

export interface userType {
  avatar: string
  id: number
  name: string
  age?: number
  client_type?: number
  email?: string
  last_login_time?: string
  sex?: number
  status?: number
  uid?: string
  bio?: string
}
export interface requestListType<T> {
  created_at: string
  form_id: number
  id: number
  information: number | string
  to_id: number
  status: number
  users: T
}

export interface friendRecordType {
  id: number
  status: number
}

export interface friendType<T> {
  created_at: string
  form_id: number
  id: number
  note: string
  to_id: number
  status: number
  top_time: string
  uid: string
  update_at: string
  Users: T
}

export interface noFriendType{
  avatar: string,
  bio: string,
  email: string,
  id: number,
  name: string,
  sex: number,
  status: number
}