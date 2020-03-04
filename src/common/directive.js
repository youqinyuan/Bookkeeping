import Vue from 'vue'

// 虚拟号码时设置号码字体颜色为红色
const fictitiousNumber = Vue.directive('fictitiousNumber', function (el) {
  // 屏蔽全部虚拟号段正则式: ^(?:\+?86)?1(?:7[01]|6[257])\d{8}$
  // 验证是true就是虚拟号
  if (/^(?:\+?86)?1(?:7[01]|6[257])\d{8}$/.test(el.innerText)) {
    el.style.color = '#F56C6C'
  }
})
export default {
  fictitiousNumber
}
