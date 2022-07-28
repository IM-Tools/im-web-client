export interface loginData {
  email: string,
  password: string | number
}

export interface registerData {
  email: string,
  name: string,
  password: string | number,
  password_repeat: string | number,
  code: string | number,
  email_type?:string | number,
}

export interface emailData {
  email: string,
  email_type: string | number
}