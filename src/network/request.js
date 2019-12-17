import axios from 'axios'
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function (config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  // 请求拦截 展示进度条 NProgress.start()
  instance.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('vue_shop_token')
    // console.log(config.headers)
    return config
  })
  // 响应拦截 隐藏进度条 NProgress.done()
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res
  })
  return instance(config)
}
