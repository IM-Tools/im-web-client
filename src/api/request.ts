import Request from "./http";
const baseURL = import.meta.env.VITE_APP_NODE_ENV === 'production' ? import.meta.env.VITE_APP_BASE_API : '/api'
const request = new Request({
  baseURL,
  timeout: 20000
})

export default request