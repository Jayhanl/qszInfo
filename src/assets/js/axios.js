import axios from 'axios'
import {
  Toast
} from 'vant'
import qs from 'qs'
// 设置公共请求头
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
const root = process.env.NODE_ENV === 'production' ? 'http://192.168.3.41:9408' : '' // http://192.168.3.41:9408,//https://maintain.zhiwei99.com
// axios.defaults.headers.common.Authorization = '2de4fbc38c9a6fc5b68054b2af9e11e7'
// token
// console.log(window.sessionStorage.getItem('token'))
if (window.sessionStorage.getItem('token') !== 'undefined' && window.sessionStorage.getItem('token') !== null) {
  axios.defaults.headers.common.Authorization = window.sessionStorage.getItem('token')
}
axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    Toast.loading({
      duration: 0,
      message: '请稍等...',
      forbidClick: true
    })
  }
  (config.method === 'post' || config.method === 'put')
    ? config.data = qs.stringify({
      ...config.data
    }) : config.params = {
      ...config.params
    }
  const ind = process.env.NODE_ENV === 'production' ? config.url.replace('/api', '/qpf') : config.url

  config.url = root + ind
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    // console.log(response.data.status)
    if (response.config.method === 'post' || response.config.method === 'put') Toast.clear()
    if (response.data.status === 'failure' && response.data.status !== undefined) {
      if (response.data.data.errCode === 10005) {
        Toast(response.data.data.errDetail)
      } else {
        Toast(response.data.data.errMsg)
      }
      return Promise.reject(response)
    } else {
      return Promise.resolve(response.data)
    }

    // if (response.status === 200) {
    //   if (response.data.access_token) {
    //     axios.defaults.headers.common.Authorization = response.data.access_token
    //   }
    //   return Promise.resolve(response)
    // } else {
    //   return Promise.reject(response)
    // }
  },
  // 错误catch
  error => {
    if (error.config.method === 'post' || error.config.method === 'put') Toast.clear()
    const errorInfo = error.response
    if (errorInfo.status === 401) {
      // store.dispatch('handleLogOut')
      window.sessionStorage.removeItem('token')
      window.location.reload()
    }
    if (errorInfo.data.data.errMsg) {
      Toast(errorInfo.data.data.errMsg)
    } else {
      Toast('请求服务器错误')
      return
    }
    return Promise.reject(error)
  }
)
