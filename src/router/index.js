import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/login'], resolve)
    },
    {
      path: '/home',
      name: 'Home',
      redirect: '/index',
      component: resolve => require(['@/components/home'], resolve),
      children: [
        {
          path: '/index/:name',
          name: 'Index',
          component: resolve => require(['@/components/index'], resolve)
        },
        {
          path: '/goodsClassManage',
          name: 'goodsClassManage',
          component: resolve => require(['@/components/goods_management/goods_classManage'], resolve)
        },
        {
          path: '/selfGoodsManage',
          name: 'selfGoodsManage',
          component: resolve => require(['@/components/goods_management/self_goodsManage'], resolve)
        },
        {
          path: '/businessGoodsManage',
          name: 'businessGoodsManage',
          component: resolve => require(['@/components/goods_management/business_goodsManage'], resolve)
        },
        {
          path: '/addGoods',
          name: 'AddGoods',
          component: resolve => require(['@/components/goods_management/add_goods'], resolve)
        },
        {
          path: '/businessOrder',
          name: 'BusinessOrder',
          component: resolve => require(['@/components/goods_order/businessOrder'], resolve)
        },
        {
          path: '/selfSupportOrder',
          name: 'SelfSupportOrder',
          component: resolve => require(['@/components/goods_order/selfSupportOrder'], resolve)
        },
        {
          path: '/orderDetail',
          name: 'OrderDetail',
          component: resolve => require(['@/components/goods_order/orderDetail'], resolve)
        }
      ]
    }
  ],

  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
