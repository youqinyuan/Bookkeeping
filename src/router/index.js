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
      // redirect: '/index',
      component: resolve => require(['@/components/home'], resolve),
      children: [{
          path: '/index',
          name: 'Index',
          component: resolve => require(['@/components/index'], resolve)
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
          path: '/forumComments',
          name: 'forumComments',
          component: resolve => require(['@/components/content_management/forumComments'], resolve)
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
          path: '/navigation_icon',
          name: 'navigation_icon',
          component: resolve => require(['@/components/moth_management/navigation/navigation_icon'], resolve)
        },
        {
          path: '/navigation_activits',
          name: 'navigation_activits',
          component: resolve => require(['@/components/moth_management/navigation/navigation_activits'], resolve)
        },
        {
          path: '/addNavigation',
          name: 'addNavigation',
          component: resolve => require(['@/components/moth_management/navigation/addNavigation'], resolve)
        },
        {
          path: '/stagesApply',
          name: 'stagesApply',
          component: resolve => require(['@/components/stages_management/stagesApply'], resolve)
        },
        {
          path: '/orderData',
          name: 'orderData',
          component: resolve => require(['@/components/data/orderData'], resolve)
        },
        {
          path: '/supportPage',
          name: 'supportPage',
          component: resolve => require(['@/components/moth_management/support/supportPage'], resolve)
        },
        {
          path: '/addActive_newPeople',
          name: 'addActive_newPeople',
          component: resolve => require(['@/components/moth_management/addActive_newPeople'], resolve)
        },
        {
          path: '/goodsArea',
          name: 'goodsArea',
          component: resolve => require(['@/components/moth_management/goodsArea'], resolve)
        }, {
          path: '/addActive_goods',
          name: 'addActive_goods',
          component: resolve => require(['@/components/moth_management/addActive_goods'], resolve)
        },
        {
          path: '/newbornZoneList',
          name: 'newbornZoneList',
          component: resolve => require(['@/components/moth_management/newbornZoneList'], resolve)
        },
        {
          path: '/advanceOrder',
          name: 'advanceOrder',
          component: resolve => require(['@/components/rules_management/advanceOrder'], resolve)
        },
        {
          path: '/agentRule',
          name: 'agentRule',
          component: resolve => require(['@/components/rules_management/agentRule'], resolve)
        },
        {
          path: '/addAgent',
          name: 'addAgent',
          component: resolve => require(['@/components/rules_management/addAgent'], resolve)
        },
        {
          path: '/personalityRule',
          name: 'personalityRule',
          component: resolve => require(['@/components/rules_management/personalityRule'], resolve)
        },
        {
          path: '/addPersonalityRule',
          name: 'addPersonalityRule',
          component: resolve => require(['@/components/rules_management/addPersonalityRule'], resolve)
        },
        {
          path: '/agentApply',
          name: 'agentApply',
          component: resolve => require(['@/components/agent_management/agentApply'], resolve)
        },
        {
          path: '/agentManagement',
          name: 'agentManagement',
          component: resolve => require(['@/components/agent_management/agentManagement'], resolve)
        },
        {
          path: '/withdrawalApply',
          name: 'withdrawalApply',
          component: resolve => require(['@/components/agent_management/withdrawalApply'], resolve)
        },
        {
          path: '/freeBuyReduceNum',
          name: 'freeBuyReduceNum',
          component: resolve => require(['@/components/rules_management/freeBuyReduceNum'], resolve)
        },
        {
          path: '/withdrawal_bus',
          name: 'withdrawal_bus',
          component: resolve => require(['@/components/merchant_management/withdrawal/withdrawal'], resolve)
        },
        {
          path: '/changeMoney',
          name: 'changeMoney',
          component: resolve => require(['@/components/merchant_management/changeMoney'], resolve)
        },
        {
          path: '/delivery',
          name: 'delivery',
          component: resolve => require(['@/components/merchant_management/delivery'], resolve)
        },
        {
          path: '/presaleAndPost',
          name: 'presaleAndPost',
          component: resolve => require(['@/components/rules_management/presaleAndPost/presaleAndPost'], resolve)
        },
        {
          path: '/noticeManagement',
          name: 'noticeManagement',
          component: resolve => require(['@/components/homePage_management/noticeManagement'], resolve)
        },
        {
          path: '/newUser',
          name: 'newUser',
          component: resolve => require(['@/components/moth_management/newUser/newUser'], resolve)
        },
        {
          path: '/hero_list',
          name: 'hero_list',
          component: resolve => require(['@/components/homePage_management/hero_list'], resolve)
        },
        {
          path: '/hero_list_detail',
          name: 'hero_list_detail',
          component: resolve => require(['@/components/homePage_management/hero_list_detail'], resolve)
        },
        {
          path: '/navigationList',
          name: 'navigationList',
          component: resolve => require(['@/components/homePage_management/navigationList'], resolve)
        },
        {
          path: '/addNavigations',
          name: 'addNavigations',
          component: resolve => require(['@/components/homePage_management/addNavigation'], resolve)
        },
        {
          path: '/module1',
          name: 'module1',
          component: resolve => require(['@/components/homePage_management/module1'], resolve)
        },
        {
          path: '/module2',
          name: 'module2',
          component: resolve => require(['@/components/homePage_management/module2'], resolve)
        },
        {
          path: '/module3',
          name: 'module3',
          component: resolve => require(['@/components/homePage_management/module3'], resolve)
        },
        {
          path: '/module4',
          name: 'module4',
          component: resolve => require(['@/components/homePage_management/module4'], resolve)
        },
        {
          path: '/homePage_banner',
          name: 'homePage_banner',
          component: resolve => require(['@/components/homePage_management/banner'], resolve)
        },
        {
          path: '/ten-percent_discount',
          name: 'ten-percent_discount',
          component: resolve => require(['@/components/rules_management/ten-percent_discount'], resolve)
        },
        {
          path: '/brandLabel',
          name: 'brandLabel',
          component: resolve => require(['@/components/goods_management/brandLabel'], resolve)
        },
        {
          path: '/seed_consume',
          name: 'seed_consume',
          component: resolve => require(['@/components/integral_management/seed_consume'], resolve)
        },
        {
          path: '/addSeedConsume',
          name: 'addSeedConsume',
          component: resolve => require(['@/components/integral_management/addSeedConsume'], resolve)
        },
        {
          path: '/giveOrDeduction',
          name: 'giveOrDeduction',
          component: resolve => require(['@/components/integral_management/giveOrDeduction'], resolve)
        },
        {
          path: '/pre_bussiness',
          name: 'pre_bussiness',
          component: resolve => require(['@/components/merchant_management/pre_bussiness'], resolve)
        },
        {
          path: '/shortMessage',
          name: 'shortMessage',
          component: resolve => require(['@/components/genealogy_set/systemNotice/shortMessage/shortMessage'], resolve)
        },
        {
          path: '/noviceTutorialList',
          name: 'noviceTutorialList',
          component: resolve => require(['@/components/genealogy_set/noviceTutorial/noviceTutorialList'], resolve)
        },
        {
          path: '/addNoviceTutorial',
          name: 'addNoviceTutorial',
          component: resolve => require(['@/components/genealogy_set/noviceTutorial/addNoviceTutorial'], resolve)
        },
        {
          path: '/dialogList',
          name: 'dialogList',
          component: resolve => require(['@/components/moth_management/dialog/dialogList'], resolve)
        },
        {
          path: '/addDialog',
          name: 'addDialog',
          component: resolve => require(['@/components/moth_management/dialog/addDialog'], resolve)
        },
        {
          path: '/specialTab',
          name: 'specialTab',
          component: resolve => require(['@/components/data/special/specialTab'], resolve)
        },
        {
          path: '/addBannerPage',
          name: 'addBannerPage',
          component: resolve => require(['@/components/moth_management/addBannerPage'], resolve)
        },
        {
          path: '/consumeData',
          name: 'consumeData',
          component: resolve => require(['@/components/integral_management/consumeData'], resolve)
        },
        {
          path: '/getPetal',
          name: 'getPetal',
          component: resolve => require(['@/components/integral_management/getPetal'], resolve)
        },
        {
          path: '/ten-percent_pay',
          name: 'ten-percent_pay',
          component: resolve => require(['@/components/rules_management/ten-percent_pay'], resolve)
        },
        {
          path: '/set_meal_goodsList',
          name: 'set_meal_goodsList',
          component: resolve => require(['@/components/goods_management/set_meala_goods/set_meal_goodsList'], resolve)
        },
        {
          path: '/add_set_meal_goods',
          name: 'add_set_meal_goods',
          component: resolve => require(['@/components/goods_management/set_meala_goods/add_set_meal_goods'], resolve)
        },
        {
          path: '/comment',
          name: 'comment',
          component: resolve => require(['@/components/goods_management/set_meala_goods/comment'], resolve)
        },
        {
          path: '/activityList',
          name: 'activityList',
          component: resolve => require(['@/components/moth_management/custom_activity/activityList'], resolve)
        },
        {
          path: '/add_custom_activity',
          name: 'add_custom_activity',
          component: resolve => require(['@/components/moth_management/custom_activity/add_custom_activity'], resolve)
        },
        {
          path: '/coupon',
          name: 'coupon',
          component: resolve => require(['@/components/moth_management/coupon/coupon'], resolve)
        },
        {
          path: '/addCoupon',
          name: 'addCoupon',
          component: resolve => require(['@/components/moth_management/coupon/addCoupon'], resolve)
        },
        {
          path: '/nearbyBanner',
          name: 'nearbyBanner',
          component: resolve => require(['@/components/nearbyHomePage/banner'], resolve)
        },
        {
          path: '/nearbyIcon',
          name: 'nearbyIcon',
          component: resolve => require(['@/components/nearbyHomePage/iconNavigation'], resolve)
        },
        {
          path: '/package_write_off',
          name: 'package_write_off',
          component: resolve => require(['@/components/goods_order/package_write_off'], resolve)
        },
        {
          path: '/general_write_off',
          name: 'general_write_off',
          component: resolve => require(['@/components/goods_order/general_write_off'], resolve)
        },
        {
          path: '/template1',
          name: 'template1',
          component: resolve => require(['@/components/moth_management/custom_activity/template1'], resolve)
        },
        {
          path: '/template2',
          name: 'template2',
          component: resolve => require(['@/components/moth_management/custom_activity/template2'], resolve)
        },
        {
          path: '/guessingGameList',
          name: 'guessingGameList',
          component: resolve => require(['@/components/moth_management/guessingGame/guessingGameList'], resolve)
        },
        {
          path: '/guessingGameDetail',
          name: 'guessingGameDetail',
          component: resolve => require(['@/components/moth_management/guessingGame/guessingGameDetail'], resolve)
        },
        {
          path: '/discussDetail',
          name: 'discussDetail',
          component: resolve => require(['@/components/moth_management/guessingGame/discussDetail'], resolve)
        },
        {
          path: '/petalMall',
          name: 'petalMall',
          component: resolve => require(['@/components/moth_management/petalMall'], resolve)
        },
        {
          path: '/addPickPoint',
          name: 'addPickPoint',
          component: resolve => require(['@/components/merchant_management/addPickPoint'], resolve)
        },
        {
          path: '/userBehaviorData',
          name: 'userBehaviorData',
          component: resolve => require(['@/components/brushOrder_management/userBehaviorData'], resolve)
        },
        {
          path: '/contentSet',
          name: 'contentSet',
          component: resolve => require(['@/components/insure_management/contentSet'], resolve)
        },
        {
          path: '/addTime',
          name: 'addTime',
          component: resolve => require(['@/components/insure_management/addTime'], resolve)
        },
        {
          path: '/insureIntroduction',
          name: 'insureIntroduction',
          component: resolve => require(['@/components/insure_management/insureIntroduction'], resolve)
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
