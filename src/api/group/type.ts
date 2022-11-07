export interface createGroupDataType {
  name: string
  info: string
  avatar: string
  password: string
  is_pwd: number
  theme: string
  select_user: number[]
}

export interface groupUserType {
  avatar: string
  created_at: string
  group_id: number
  id: number
  name: string
  remark: string
  user_id: number
  users: {
    age: number,
    avatar: string,
    email: string,
    name: string,
    id: number
  }
}

export interface groupInfoTyep{
  avatar: string
  created_at: string
  id: number
  info: string
  name: string
  user_id: number,
  is_pwd: number
}
export interface groupInfoType<T>{
  group_users: T[],
  groups: groupInfoTyep
}


export interface removeType{
  select_user: number[]
  group_id: number
  type: number
}