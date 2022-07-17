import axios from 'axios'
import { ElMessage,ElNotification } from 'element-plus'
// import router from '@/router'
// import store from '@/store'
console.log('import.meta.env.NODE_ENV',import.meta.env.VITE_APP_NODE_ENV);

const baseURL = import.meta.env.VITE_APP_NODE_ENV === 'production' ? import.meta.env.VITE_APP_BASE_API : '/api'

// 一般接口请求
const request = axios.create({
  baseURL: baseURL,
  timeout: 20000,
})

// 请求前拦截
request.interceptors.request.use((config: any) => {
  let { data = {}, method } = config
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer '+token
  }
  if (Object.prototype.toString.call(data) === '[object FormData]') {
    console.log('文件上传')
  } else {
    // config.headers['content-type'] = 'application/x-www-form-urlencoded'
    data = { ...data }
    Object.keys(data).forEach((item) => {
      if (data[item] === undefined || data[item] === null || data[item] === '') {
        delete data[item]
      }
    })
    console.log(data);
    
    config.data = data
    // get请求转参数key为params
    if (method === 'get') {
      config.params = data
    }
    if(method === 'post'){
      const formData = new FormData()
      Object.keys(data).forEach((item) => {
        formData.append(item,data[item])
      })
      config.data = formData
    }
  }

  return config
})

// 请求成功回调
function successCallback(response: any) {
  console.log(response);
  
  if (Object.prototype.toString.apply(response.data) === '[object Blob]') {
    return response.data
  }
  const res = response.data
  const { data, code, msg } = res
  if (res.code === 200) {
    return data
  } else {
    ElNotification({
      title: 'Warning',
      message: res.message,
      type: 'warning',
    })
    return Promise.reject(res)
  }
}
// 请求错误回调
function errorCallback(error: any) {
  const err = JSON.parse(error.request.response)
  ElMessage({
    message: err.message,
    type: 'error',
  })
  
  return Promise.reject(error)
}
// 响应拦截
request.interceptors.response.use(successCallback, errorCallback)

export default request
