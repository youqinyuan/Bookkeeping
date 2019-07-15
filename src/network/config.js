import axios from 'axios'
import elementUi from 'element-ui'
import router from '@/router/index'
import { setCookie, getCookie } from '@/common/cookie.js'

// axios 配置
axios.defaults.timeout = 300000
axios.defaults.baseURL = process.env.API_ROOT

// http request 拦截器
axios.interceptors.request.use(
  config => {
    document.cookie.split('; ').map(item => {
      if (item.split('=')[0] === 'opadminToken') {
        config.headers.token = getCookie().opadminToken
      }
    })
    return config
  },
  err => {
    return err
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.messageCode === 'MSG_1001') {
      setCookie('opadminToken', response.headers.token, 15)
    } else if (response.data.messageCode === 'MSG_2001') {
      router.push('/')
    }
    return response
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      elementUi.MessageBox('请求超时', '错误', {
        confirmButtonText: '确定'
      })
    }

    return error
  }
)

export default axios
