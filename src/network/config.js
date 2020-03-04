import axios from 'axios'
import router from '@/router/index'
import {
  Loading,
  MessageBox
} from 'element-ui'
import {
  setCookie,
  getCookie
} from '@/common/cookie.js'

// axios 配置
axios.defaults.timeout = 600000
axios.defaults.baseURL = process.env.API_ROOT

var loadinginstace
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.log(config)
    document.cookie.split('; ').map(item => {
      if (item.split('=')[0] === 'opadminToken') {
        config.headers.token = getCookie().opadminToken
      }
    })
    if (config.url == '/newPeople/queryGoodsQRCode' || config.url == '/mdse/activity/createQrCode') {
      // 此两个接口不添加loading方法
    } else {
      // element ui Loading方法
      loadinginstace = Loading.service({
        lock: true,
        text: '请求中……',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    // element ui Loading方法
    // loadinginstace = Loading.service({
    //   lock: true,
    //   text: '请求中……',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    return config
  },
  err => {
    MessageBox({
      title: '错误',
      message: '请求超时',
      callback: action => {
        loadinginstace.close()
      }
    })
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
    loadinginstace.close()
    return response
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      MessageBox({
        title: '错误',
        message: '请求超时',
        callback: action => {
          loadinginstace.close()
        }
      })
    }

    return error
  }
)

export default axios
