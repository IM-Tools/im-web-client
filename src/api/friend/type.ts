export interface recordFriend {
  to_id: number | string
  information: string
}

export interface userType {
  avatar: string
  id: number
  name: string
}
export interface requestListType<T> {
  created_at: string
  form_id: number
  id: number
  information: number | string
  to_id: number
  users: T
}
