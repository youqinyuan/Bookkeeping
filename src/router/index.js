import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
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
      children: [{
          path: '/index',
          name: 'Index',
          component: resolve => require(['@/components/index'], resolve)
        },
        {
          path: '/cityPartner_apply',
          name: 'cityPartner_apply',
          component: resolve => require(['@/components/cityPartner_management/cityPartner_apply'], resolve)
        },
        {
          path: '/cityPartner_management',
          name: 'cityPartner_management',
          component: resolve => require(['@/components/cityPartner_management/cityPartner_management/cityPartner_management'], resolve)
        },
        {
          path: '/cityPartner_detail',
          name: 'cityPartner_detail',
          component: resolve => require(['@/components/cityPartner_management/cityPartner_management/cityPartner_detail'], resolve)
        },
        {
          path: '/wishdraw_apply',
          name: 'wishdraw_apply',
          component: resolve => require(['@/components/cityPartner_management/wishdraw_apply'], resolve)
        },
        {
          path: '/reward',
          name: 'reward',
          component: resolve => require(['@/components/reward_management/reward'], resolve)
        },
        {
          path: '/merchantBusinessList',
          name: 'merchantBusinessList',
          component: resolve => require(['@/components/merchant_management/merchantBusinessList'], resolve)
        },
        {
          path: '/appplicationManagement',
          name: 'appplicationManagement',
          component: resolve => require(['@/components/merchant_management/appplication_management'], resolve)
        },
        {
          path: '/appplicationDetails',
          name: 'appplicationDetails',
          component: resolve => require(['@/components/merchant_management/appplication_details'], resolve)
        },
        {
          path: '/businessManagement',
          name: 'businessManagement',
          component: resolve => require(['@/components/merchant_management/business_management'], resolve)
        },
        {
          path: '/businessDetails',
          name: 'businessDetails',
          component: resolve => require(['@/components/merchant_management/businessDetails'], resolve)
        },
        {
          path: '/ordinaryMember',
          name: 'ordinaryMember',
          component: resolve => require(['@/components/user_management/ordinary_member'], resolve)
        },
        {
          path: '/memberDetail',
          name: 'memberDetail',
          component: resolve => require(['@/components/user_management/memberDetail'], resolve)
        },
        {
          path: '/plusMember',
          name: 'plusMember',
          component: resolve => require(['@/components/user_management/plus_member'], resolve)
        },
        {
          path: '/plusDetail',
          name: 'plusDetail',
          component: resolve => require(['@/components/user_management/plusDetail'], resolve)
        },
        {
          path: '/withDrawMethods',
          name: 'withDrawMethods',
          component: resolve => require(['@/components/user_management/withDraw/withDrawMethods'], resolve)
        },
        {
          path: '/diamondPartner',
          name: 'diamondPartner',
          component: resolve => require(['@/components/user_management/diamondPartner'], resolve)
        },
        {
          path: '/diamond_detail',
          name: 'diamond_detail',
          component: resolve => require(['@/components/user_management/diamond_detail'], resolve)
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
          path: '/businessGoodsCheck',
          name: 'businessGoodsCheck',
          component: resolve => require(['@/components/goods_management/business_goodsCheck'], resolve)
        },
        {
          path: '/addGoods',
          name: 'AddGoods',
          component: resolve => require(['@/components/goods_management/add_goods'], resolve)
        },
        {
          path: '/goodscheckDetails',
          name: 'goodscheckDetails',
          component: resolve => require(['@/components/goods_management/goods_checkDetails'], resolve)
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
          path: '/wishPool_management',
          name: 'wishPool_management',
          component: resolve => require(['@/components/wishPool_management/wishPool_management'], resolve)
        },
        {
          path: '/wishExcelDownLoad',
          name: 'wishExcelDownLoad',
          component: resolve => require(['@/components/wishPool_management/wishExcelDownLoad'], resolve)
        },
        {
          path: '/orderDetail',
          name: 'OrderDetail',
          component: resolve => require(['@/components/goods_order/orderDetail'], resolve)
        },
        {
          path: '/refundOrder',
          name: 'refundOrder',
          component: resolve => require(['@/components/goods_order/refundOrder'], resolve)
        },
        {
          path: '/refundDetail',
          name: 'refundDetail',
          component: resolve => require(['@/components/goods_order/refundDetail'], resolve)
        },
        {
          path: '/bannerManage',
          name: 'BannerManage',
          component: resolve => require(['@/components/moth_management/banner_manage'], resolve)
        },
        {
          path: '/activitiesManage',
          name: 'activitiesManage',
          component: resolve => require(['@/components/moth_management/activities_manage'], resolve)
        },
        {
          path: '/freeBuy',
          name: 'freeBuy',
          component: resolve => require(['@/components/moth_management/freeBuyPage/freeBuy'], resolve)
        },
        {
          path: '/zeroMoneyBuyList',
          name: 'zeroMoneyBuyList',
          component: resolve => require(['@/components/moth_management/zeroMoneyBuyList'], resolve)
        },
        {
          path: '/zeroMoneyBuy',
          name: 'zeroMoneyBuy',
          component: resolve => require(['@/components/moth_management/zeroMoneyBuy'], resolve)
        },
        {
          path: '/activeDetails',
          name: 'activeDetails',
          component: resolve => require(['@/components/moth_management/activeDetails'], resolve)
        },
        {
          path: '/addActive',
          name: 'addActive',
          component: resolve => require(['@/components/moth_management/addActive'], resolve)
        },
        {
          path: '/setMembershiprules',
          name: 'setMembershiprules',
          component: resolve => require(['@/components/rules_management/setMembershiprules'], resolve)
        },
        {
          path: '/merchantrules',
          name: 'merchantrules',
          component: resolve => require(['@/components/rules_management/merchantrules'], resolve)
        },
        {
          path: '/profitrules',
          name: 'profitrules',
          component: resolve => require(['@/components/rules_management/profitrules'], resolve)
        },
        {
          path: '/fastBuy',
          name: 'fastBuy',
          component: resolve => require(['@/components/rules_management/fastBuy'], resolve)
        },
        {
          path: '/cashWithdrawal',
          name: 'cashWithdrawal',
          component: resolve => require(['@/components/rules_management/cashWithdrawal'], resolve)
        },
        {
          path: '/cityPartner',
          name: 'cityPartner',
          component: resolve => require(['@/components/rules_management/cityPartner'], resolve)
        },
        {
          path: '/userRecharge',
          name: 'userRecharge',
          component: resolve => require(['@/components/recharge_management/userRecharge'], resolve)
        },
        {
          path: '/rechargeSet',
          name: 'rechargeSet',
          component: resolve => require(['@/components/recharge_management/rechargeSet'], resolve)
        },
        {
          path: '/logisticsSet',
          name: 'logisticsSet',
          component: resolve => require(['@/components/genealogy_set/logisticsSet'], resolve)
        },
        {
          path: '/citySet',
          name: 'citySet',
          component: resolve => require(['@/components/genealogy_set/citySet'], resolve)
        },
        {
          path: '/cityDetail',
          name: 'cityDetail',
          component: resolve => require(['@/components/genealogy_set/cityDetail'], resolve)
        },
        {
          path: '/setPlatformIntroduction',
          name: 'SetPlatformIntroduction',
          component: resolve => require(['@/components/genealogy_set/SetPlatformIntroduction'], resolve)
        },
        {
          path: '/setPartnerPage',
          name: 'SetPartnerPage',
          component: resolve => require(['@/components/genealogy_set/SetPartnerPage'], resolve)
        },
        {
          path: '/systemNotice',
          name: 'systemNotice',
          component: resolve => require(['@/components/genealogy_set/systemNotice/systemNotice'], resolve)
        },
        {
          path: '/wxappNotice',
          name: 'wxappNotice',
          component: resolve => require(['@/components/genealogy_set/systemNotice/wxappNotice'], resolve)
        },
        {
          path: '/forum_management',
          name: 'forum_management',
          component: resolve => require(['@/components/content_management/forum_management'], resolve)
        },
        {
          path: '/forumDetail',
          name: 'forumDetail',
          component: resolve => require(['@/components/content_management/forumDetail'], resolve)
        },
        {
          path: '/seed_management',
          name: 'seed_management',
          component: resolve => require(['@/components/integral_management/seed_management'], resolve)
        },
        {
          path: '/notice',
          name: 'notice',
          component: resolve => require(['@/components/moth_management/notice'], resolve)
        },
        {
          path: '/navigation',
          name: 'navigation',
          component: resolve => require(['@/components/moth_management/navigation/navigation'], resolve)
        },
        {
          path: '/addNavigation',
          name: 'addNavigation',
          component: resolve => require(['@/components/moth_management/navigation/addNavigation'], resolve)
        }
      ]
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
