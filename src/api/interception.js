import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui';
import { clearCookie } from '@/utils/auth'

// 超时时间
axios.defaults.timeout = 30000
// 默认基地址
// axios.defaults.baseURL =
// http请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(res => {
  return res.data
}, error => {
  let res = error.response

  // 401 token校验不通过  2100菜单没权限
  if(res.status == 401 || res.data.code == 2100){
    clearCookie('shop_token')
    router.push({path: '/login'})
  }
  
  Message.error({
    showClose: true,
    dangerouslyUseHTMLString: true,
    message: res.data.message,
    type: 'warning'
  })
  return Promise.reject(res.data)
})

export default axios
