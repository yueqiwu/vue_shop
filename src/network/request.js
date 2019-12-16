import axios from 'axios'
export default function (config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('vue_shop_token')
    // console.log(config.headers)
    return config
  })
  return instance(config)
}
