let Base64 = require('js-base64').Base64

// 获取cookie
const getCookie = () => {
  let obj = {}
  let arr = document.cookie.split('; ')

  arr.map(item => {
    let arrItem = item.split('=')

    obj[arrItem[0]] = decode(arrItem[1])
  })

  return obj
}

/**
 * 设置cookie
 * @param {String} cookieName 储存在cookie里面的key
 * @param {String} cookieNum 储存在cookie里面的value
 * @param {Number} exdays 在cookie里存储天数
 */
const setCookie = (cookieName, cookieNum, exdays) => {
  let exdate = new Date() // 获取时间

  // 保存的天数
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)

  // 字符串拼接cookie
  window.document.cookie = cookieName + '=' + encode(cookieNum) + ';path=/;expires=' + exdate.toGMTString()
}

/**
 * 清空cookie
 * @param {String} cookieName 储存在cookie里面的key
 */
const clearCookie = (cookieName) => {
  setCookie(cookieName, ' ', -1)
}

/**
 * 加密
 * @param {String} code 需要加密的参数
 */
const encode = (code) => {
  if (code.length > 30) return code
  return Base64.encode(code)
}

/**
 * 解密
 * @param {String} code 需要解密的参数
 */
const decode = (code) => {
  if (code.length > 30) return code
  return Base64.decode(code)
}

export {
  getCookie,
  setCookie,
  clearCookie
}
