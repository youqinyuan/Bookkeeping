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

Vue.use(VueDND)
Vue.use(ElementUI)
Vue.use(VueClipboard);

Vue.config.productionTip = false
Vue.prototype.qs = qs
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
