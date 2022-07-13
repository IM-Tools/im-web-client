import axios from 'axios'
// import { Message } from 'element-ui'
// import router from '@/router'
// import store from '@/store'
console.log('import.meta.env.NODE_ENV',import.meta.env.VITE_APP_NODE_ENV);

const baseURL = import.meta.env.VITE_APP_NODE_ENV === 'production' ? import.meta.env.VITE_APP_BASE_API : '/api'

// 一般接口请求
const request = axios.create({
  baseURL: baseURL,
  timeout: 20000
})

// 请求前拦截
request.interceptors.request.use((config: any) => {
  let { data = {}, method } = config
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['m-token'] = token
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
  }

  return config
})

// 请求成功回调
function successCallback(response: any) {
  if (Object.prototype.toString.apply(response.data) === '[object Blob]') {
    return response.data
  }
  const res = response.data
  const { data, code, msg } = res
  if (res.status === true) {
    return data
  } else if (code === 1005 || (code === 2001 && localStorage.getItem('token'))) {
    // // 未登入
    // localStorage.removeItem('token')
    // localStorage.removeItem('client_id')
    // localStorage.removeItem('openvidu_url')
    // localStorage.removeItem('userInfo')
    // const { ipcRenderer } = require('electron')
    // ipcRenderer.invoke('change-window', { isChange: true })
    // router.push({ path: '/login' })
  } else {
    // Message.error(`${msg}(${code})`)
    // Message({
    //   type: 'error',
    //   message: msg,
    //   customClass: 'message-box'
    // })
    return Promise.reject(res)
  }
}
// 请求错误回调
function errorCallback(error: any) {
  // Message.error(
  //   error.response
  //     ? `网络请求错误，错误码：${error.response.code}`
  //     : '网络请求超时，请稍后重试，或联系技术人员！'
  // )
  // Message({
  //   type: 'error',
  //   message: error.response
  //     ? `网络请求错误，错误码：${error.response.code}`
  //     : '网络请求超时，请稍后重试，或联系技术人员！'
  // })
  return Promise.reject(error)
}
// 响应拦截
request.interceptors.response.use(successCallback, errorCallback)

export default request
