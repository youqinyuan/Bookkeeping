// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import './assets/css/reset.css'
// 拖拽排序参考
import VueDND from 'awe-dnd'
import qs from 'qs'
import * as filter from './common/filter'
import * as directive from './common/directive'

// 图片预览插件 vue-photo-preview
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

// Day.js ：一个轻量的处理时间和日期的 JavaScript 库
// 2020-09-29T18:02:02.000Z 转换为年月日
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;

Vue.use(VueDND)
Vue.use(ElementUI)
Vue.use(VueClipboard);

Vue.config.productionTip = false
Vue.prototype.qs = qs
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
Object.keys(directive).forEach((key) => {
  Vue.directive(key, directive[key]);
});
// 全局前置守卫 - 验证菜单访问权限
// import {validatePermission} from '@/network/api'
// router.beforeEach((to, from, next) => {
//   if(to.path == '/login' || to.path == '/home'){
//     next()
//   }else{   
//   let parms = {
//     path:to.path
//   }
//   validatePermission({params:parms}).then(res=>{
//     if(res.data.messageCode == 'MSG_1001'){
//       next()
//     }else{
//       ElementUI.Message.error(res.data.message)
//     }
//   })
//   }
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
