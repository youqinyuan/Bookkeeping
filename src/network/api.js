import request from './config'

// 账号
const userLoginRequest = p => request.post('/accounts/login', p) // 登录
const accessibleMenus = p => request.get('/accounts/accessibleMenus', p) // 查询可访问的菜单
const validatePermission = p => request.get('/accounts/validatePermission', p) // 验证菜单访问权限


const addGoodsRequest = p => request.post('/goodsControl/addGoods', p) // 添加商品（电商/自营商品）
const upDataGoodsRequest = p => request.post('/goodsControl/updateGoods', p) // 修改商品-（电商/自营商品）
const queryGoodsDetailRequest = p => request.get('/goodsControl/onlineGoodsDetail', p) // 查询商品详情(电商/自营)
const queryofflineGoodsDetail = p => request.get('/goodsControl/offlineGoodsDetail', p) // 查询商品详情(非电商)
const getBusinessOptionsRequest = p => request.get('/merchant/manage/allMerchantIdAndName', p) // 拉取所有商户列表（正常运营的非自营商户）
const getGoodsClassRequest = p => request.get('/goodsCategory/getAllGoodsCategory', p) // 获取商品分类
const getOrderList = orderList => request.get(`/order/queryOperateOrderList`, orderList) // 获取订单列表
const addOrderLogistics = p => request.post('/order/addOrderLogistics', p) // 订单添加物流信息
const refundAudit = p => request.post('/order/refundAudit', p) // 审核退款
const queryOrderReason = p => request.get(`/order/queryOrderReason${p}`) // 查询退款或拒绝原因
const queryOrder = p => request.get(`/order/queryOrder${p}`) // 查询订单详情
const applyRefundMerchant = p => request.post('/order/applyRefundMerchant', p) // 申请退款
const queryLogistics = p => request.get('/order/queryLogistics', p) // 查询物流信息
const cancelOrderMerchant = p => request.post('/order/cancelOrderMerchant', p) // 取消订单
const queryTobeShippedOrderGoods = p => request.get('/order/queryTobeShippedOrderGoods', p) // 获取待发货的商品信息
const noLogistics = p => request.post('/order/noLogistics', p) // 无需发货
const refundCostomizeActivityOrder = p => request.post('/order/refundCustomizeActivityOrder', p) // 退款(自定义活动拼团失败 - 退款)
const pushVerificationCode = p => request.post('/order/pushVerificationCode', p) // 上传核销码
const getPackageOrderByExcel = p => request.get('/order/getPackageOrderByExcel', {
  params: p,
  responseType: 'blob'
}) // 核销订单管理-导出套餐拼团信息excel
const getNormalOrderByExcel = p => request.get('/order/getNormalOrderByExcel', {
  params: p,
  responseType: 'blob'
}) // 核销订单管理-导出普通拼团信息excel
const groupRefuse = p => request.post('/order/groupRefuse', p) // 核销订单管理-拒绝
const groupRefund = p => request.post('/order/groupRefund', p) // 核销订单管理-退款
const groupFinish = p => request.post('/order/groupFinish', p) // 核销订单管理-完成订单


// 首页
const getDashboard = p => request.get('/dashboard/getDashboard', p) // 获取首页仪表盘信息
const getDeliveryData = p => request.get('/home/merchant/delivery', p) // 查询物流信息
const platDeliveryApplyList = p => request.get('/home/platDelivery/applyList', p) // 获取商家申请平台配送
const platDeliveryApply = p => request.put('/home/platDelivery/apply', p) // 联系




// 代理商管理
const queryAgentRole = p => request.get(`/agent/role/queryRole${p}`) // 查询代理商角色列表
const findAgentRoleById = p => request.get(`/agent/role/findById${p}`) // 查询代理商角色详情
const addOrUpdateAgentRole = p => request.post('/agent/role/addOrUpdateRole', p) // 添加或修改代理商角色
const agentApplyList = p => request.get('/agentUser/applyList', p) // 获取代理商申请数据
const agentApprove = p => request.post('/agentUser/approve', p) // 代理商申请 审核通过
const agentRefuse = p => request.post('/agentUser/refuse', p) // 代理商申请 审核拒绝
const agentRole = p => request.get('/agentUser/role', p) // 代理商申请 获取代理角色
const exportApplyAgentExcel = p => request.get('/agentUser/exportApplyAgentExcel', {
  params: p,
  responseType: 'blob'
}) // 代理商申请 导出excel
const agentAgents = p => request.get('/agentUser/agents', p) // 获取代理商管理数据
const exportAgentExcel = p => request.get('/agentUser/exportAgentExcel', {
  params: p,
  responseType: 'blob'
}) // 代理商管理 导出excel
const agentFreeze = p => request.post('/agentUser/freeze', p) // 代理商管理 冻结代理
const agentUnfreeze = p => request.post('/agentUser/unfreeze', p) // 代理商管理 解冻代理
const agentResetPassword = p => request.post('/agentUser/resetPassword', p) // 代理商管理 重置密码
const agentBalance = p => request.post('/agentUser/balance', p) // 代理商管理 增减余额
const agentRoleById = p => request.get('/agentUser/roleById', p) // 代理商申请 获取代理角色
const agentRenew = p => request.post('/agentUser/renew', p) // 代理商申请 续费
const agentApplyBalance = p => request.get('/agentUser/applyBalance', p) // 提现申请
const exportApplyBalanceExcel = p => request.get('/agentUser/exportApplyBalanceExcel', {
  params: p,
  responseType: 'blob'
}) // 提现申请导出excel
const agentPassBalance = p => request.post('/agentUser/passBalance', p) // 提现申请 通过
const agentRefuseBalance = p => request.post('/agentUser/refuseBalance', p) // 提现申请 拒绝





// 退款订单模块
const queryOperateOrderRefundList = p => request.get('/orderRefund/queryOperateOrderRefundList', p) // 查询退款订单列表
const refundAudits = p => request.post('/orderRefund/refundAudit', p) // 退款审核
const queryLogistic = p => request.get('/orderRefund/queryLogistics', p) // 查询物流信息
const queryOrderRefund = p => request.get('/orderRefund/queryOrderRefund', p) // 查询退款订单详情
const getExcel = ids => request.get('/order/getMerchantAuditListExcel', {
  params: {
    ids
  },
  responseType: 'blob'
}) // 导出excel

const getMerchantAuditListByWhereExcel = p => request.get('/order/getMerchantAuditListByWhereExcel', {
  params: p,
  responseType: 'blob'
}) // 订单管理-导出全部查询结果订单信息Excel

//导入物流信息接口
const importLogisticsExcel = p => request.post('/order/importLogisticsExcel', p) // 商户管理-获取导入商家Excel模板
const getLogisticsExcelTemplet = p => request.get('/order/getLogisticsExcelTemplet', {
  responseType: 'blob'
}) // 商户管理-获取导入商家Excel模板
//导入物流信息接口


// 保险管理
const findPageListInsurance = p => request.get('/insurance/userRecord/findPageList', p) // 保险内容设置-分页查询
const addInsurance = p => request.post('/insurance/userRecord/add', p) // 保险内容设置-添加时长
const findListImagesInsurance = p => request.post('/insurance/userRecord/findListImages', p) // 保险内容设置-查询保险介绍图
const addOrUpdateImagesInsurance = p => request.post('/insurance/userRecord/addOrUpdateImage', p) // 保险内容设置-添加或修改保险介绍图


// 分期购申请
const applyGoodsStages = p => request.get('/installment/applyGoods', p) // 查询商品分期购申请
const refuseStages = p => request.post('/installment/refuse', p) // 拒绝申请
const exportInstallmentGoodsExcel = p => request.get('/installment/exportInstallmentGoodsExcel', {
  params: p,
  responseType: 'blob'
}) // 导出excel


// 商家管理模块
const getMerchantBusinessList = p => request.get('/merchant/getMerchantBusinessList', p) // 获取商户行业分类列表
const getMerchantAuditList = p => request.get('/merchant/getMerchantAuditList', p) // 获取商户申请列表
const getLicenseImage = p => request.get('/merchant/getLicenseImage', p) // 获取商户申请营业执照
const changeAuditStatus = p => request.post('/merchant/manage/changeAuditStatus', p) // 更改审核状态
const getMerchantAuditListExcel = p => request.get('/excel/getMerchantAuditListExcel', p) // 商户管理-申请管理-导出商户申请Excel
const getMerchantDetails = p => request.get('/merchant/manage/getMerchantDetails', p) // 商户管理-获取商户详细信息（基础信息）
const getMerchantGoods = p => request.get('/merchant/manage/getMerchantGoods', p) // 商户管理-获取商户商品列表
const getMerchantGoodsCategory = p => request.get('/merchant/manage/merchantGoodsCategory', p) // 商户管理-获取店铺商品分类
const addMerchantGoodsCategory = p => request.post('/merchant/manage/merchantGoodsCategory', p) // 商户管理-新增店铺商品分类
const removeMerchantGoodsCategory = p => request.delete('/merchant/manage/merchantGoodsCategory', p) // 商户管理-删除店铺商品分类
const changeGoodsSetCategory = p => request.put('/merchant/manage/goodsSetCategory', p) // 商户管理-修改店铺商品分类
const getMerchantIncomeDetails = p => request.get('/merchant/manage/getMerchantIncomeDetails', p) // 商户管理-获取商户详细信息（营收记录）
const getOfflineStoreList = p => request.get('/merchant/manage/getOfflineStoreList', p) // 商户管理-获取门店商户列表信息
const getOnlineStoreList = p => request.get('/merchant/manage/getOnlineStoreList', p) // 商户管理-获取在线商户列表信息
const updateAdWeights = p => request.post('/merchant/manage/updateAdWeights', p) // 修改广告值
const deleteMerchantById = p => request.delete('/merchant/manage/deleteMerchantById', p) // 商户管理-删除商户（只能删除导入的商户）
const resetPassword = p => request.put('/merchant/manage/resetPassword', p) // 商户管理-重置商户密码
const getExportMerchantExcel = p => request.get('/excel/getExportMerchantExcel', {
  responseType: 'blob'
}) // 商户管理-获取导入商家Excel模板
const exportOnlinesStoreListExcel = p => request.get('/excel/exportOnlineStoreListExcel', {
  params: p,
  responseType: 'blob'
}) // 导出excel
const importMerchantForExcel = p => request.post('/excel/importMerchantForExcel', p) // 商户管理-获取导入商家Excel模板
const getMerchantApplyList = p => request.get('/price/apply', p) // 商户管理-商户改价申请列表
const getMerchantApplyDetail = p => request.get('/price/detail', p) // 商户管理-商户改价详情
const changeMerchantApplyStatus = p => request.put('/price/status', p) // 商户管理-商户改价更改审核状态
const getMerchantDrawRecordList = p => request.get('/merchant/manage/drawRecordList', p) // 商户管理-获取提现记录列表
const updateMerchantSales = p => request.post('/merchant/manage/updateSales', p) // 商户管理-修改销量
const updateMerchantScore = p => request.post('/merchant/manage/updateScore', p) // 商户管理-修改评分
const getMerchantOrderList = p => request.get('/delivery/orderList', p) // 商家配送管理-获取平台配送订单
const getfreightPlatList = p => request.get('/delivery/freightPlatList', p) // 商家配送管理-获取计价方案列表
const setDeliveryTime = p => request.post('/delivery/plat/hours', p) // 商家配送管理-设置平台配送时间
const getDeliveryTime = p => request.get('/delivery/plat/hoursList', p) // 商家配送管理-获取平台配送时间
const getDeliveryMerchantList = p => request.get('/delivery/deliveryMerchantList', p) // 商家配送管理-获取配送商户列表
const addDeliveryMerchantList = p => request.post('/delivery/deliveryMerchant', p) // 商家配送管理-添加配送商户
const removeDeliveryMerchantList = p => request.delete('/delivery/deliveryMerchant', p) // 商家配送管理-移除配送商户
const updateDeliveryMerchantList = p => request.put('/delivery/deliveryMerchant', p) // 商家配送管理-修改配送商户配送范围或计价
const setDeliveryMerchantinfo = p => request.put('/delivery/delivery', p) // 商家配送管理-输入配送信息
const getMerchantDrawList = p => request.get('/merchant/draw/drawList', p) // 商家提现管理-获取提现列表
const exportMerchantDrawRecord = p => request.get('/merchant/draw/exportDrawRecord', {
  params: p,
  responseType: 'blob'
}) // 导出商户提现申请
const merchantDrawAdopt = p => request.post('/merchant/draw/adopt', p) // 商家提现管理-通过提现
const merchantAutoAdoptSet = p => request.get('/merchant/draw/autoAdoptSet', p) // 商家提现管理-查看自动提现设置
const merchantSetAutoAdopt = p => request.post('/merchant/draw/setAutoAdopt', p) // 商家提现管理-自动提现设置
const getMerchantBlackList = p => request.get('/merchant/draw/blackList', p) // 商家提现管理-管理黑名单
const merchantAddBlackList = p => request.post('/merchant/draw/addBlackList', p) // 商家提现管理-添加黑名单
const merchantRemoveBlackList = p => request.post('/merchant/draw/removeBlackList', p) // 商家提现管理-移除黑名单
const setAutoAdoptByAliPay = p => request.post('/merchant/draw/setAutoAdoptByAliPay', p) // 商家提现管理-设置支付宝自动提现
const merchantAutoAdoptSetByAliPay = p => request.get('/merchant/draw/autoAdoptSetByAliPay', p) // 商家提现管理-查看支付宝自动提现设置
const updateParent = p => request.post('/merchant/manage/updateParent', p) // 预入驻商家 - 修改上级
const updateGoodsQuantity = p => request.post('/merchant/manage/updateGoodsQuantity', p) // 预入驻商家 - 修改商品数量
const updateDrawQuota = p => request.post('/merchant/manage/updateDrawQuota', p) // 预入驻商家 - 修改提现额度
const updateDefaultValue = p => request.post('/merchant/manage/updateDefaultValue', p) //修改商家预设值
const getDefaultValue = p => request.post('/merchant/manage/getDefaultValue', p) // 查询商家预设值
const updateFlashPaySet = p => request.post('/merchant/manage/updateFlashPaySet', p) // 修改闪付设置
const getMerchantPickPoint = p => request.get('/merchant/manage/getMerchantPickPoint', p) // 获取商户自提点列表
const delPickupPoint = p => request.post('/merchant/manage/delPickupPoint', p) // 删除商户自提点
const addPickupPoint = p => request.post('/merchant/manage/addPickupPoint', p) // 新建商户自提点
const getMerchantPickPointById = p => request.get('/merchant/manage/getMerchantPickPointById', p) // 获取自提点详情
const getRecommendStore = p => request.get('/merchant/manage/getRecommendStore', p) // 查询推荐店铺
const updateRecommendStore = p => request.post('/merchant/manage/updateRecommendStore', p) // 修改推荐店铺
const getMerchantBusinessListByUnderLine = p => request.get('/merchant/getMerchantBusinessListByUnderLine', p) // 获取商户线下行业分类列表
const updateContactNumber = p => request.post('/merchant/manage/updateContactNumber', p) // 修改联系电话





// 奖励金模块
const getAllUnexpectedIncome = p => request.get('/incomeRecord/getAllUnexpectedIncome', p) // 获取所有的奖励金数据


// 充值模块
const getUserRechargeRecord = p => request.get('/userTradeRecord/getUserRechargeRecord', p) // 充值管理-用户充值管理
const updateParamConfigMinAmount = p => request.post('/userTradeRecord/updateParamConfigMinAmount', p) // 充值管理-充值设置



//用户管理模块
const memberList = p => request.get('/member/memberList', p) // 用户管理-普通会员管理
const plusMemberList = p => request.get('/member/plusMemberList', p) // 用户管理-PLUS会员管理
const exchangeMemberStatus = p => request.post('/member/exchangeMemberStatus', p) // 用户管理-更新用户状态
const memberDetail = p => request.get('/member/memberDetail', p) // 用户管理-普通会员详情
const plusMemberDetail = p => request.get('/member/plusMemberDetail', p) // 用户管理-PLUS普通会员详情
const diamondMemberList = p => request.get('/member/diamondMemberList', p) // 用户管理-钻石合伙人查询列表
const diamondMemberDetail = p => request.get('/member/diamondMemberDetail', p) // 用户管理-钻石合伙人查询明细
const memberListByExcel = p => request.get('/member/memberListByExcel', {
  params: p,
  responseType: 'blob'
}) // 银行卡提现列表导出excel
const plusMemberListByExcel = p => request.get('/member/plusMemberListByExcel', {
  params: p,
  responseType: 'blob'
}) // 银行卡提现列表导出excel
const diamondMemberListByExcel = p => request.get('/member/diamondMemberListByExcel', {
  params: p,
  responseType: 'blob'
}) // 银行卡提现列表导出excel
const subtractUserAssets = p => request.post('/member/subtractUserAssets', p) // 减少用户资产
const exchangeMemberRole = p => request.post('/member/exchangeMemberRole', p) // 用户管理-更新用户身份
const getWithdrawMoneyAuditList = p => request.get('/member/getWithdrawMoneyAuditList', p) // 用户管理-获取所有的奖励金数据
const getUserTransferAuditList = p => request.get('/userTradeRecord/getUserTransferAuditList', p) // 获取微信提现申请列表
const getUserTransferAuditListBankCard = p => request.get('/userTradeRecord/getUserTransferAuditListBankCard', p) // 获取用户银行卡提现申请列表
const auditPassedById = p => request.put('/userTradeRecord/auditPassedById', p) // 微信支付宝提现申请审核通过
const auditPassedBankCard = p => request.put('/userTradeRecord/auditPassedBankCard', p) // 银行卡提现申请审核通过
const auditCancelById = p => request.put('/userTradeRecord/auditCancelById', p) // 提现申请-拒绝提现
const getBankCardInfo = p => request.get(`/userTradeRecord/getBankCardInfo${p}`) // 获取银行卡信息
const getUserTransferAuditListBankCardExcel = p => request.get('/userTradeRecord/getUserTransferAuditListBankCardExcel', {
  params: p,
  responseType: 'blob'
}) // 银行卡提现列表导出excel
const getUserTransferAuditListAlipay = p => request.get('/userTradeRecord/getUserTransferAuditListAlipay', p) // 获取银行卡信息



// 规则配置模块
const allProfitsDistributionIdAndName = p => request.get('/paramConfig/allProfitsDistributionIdAndName', p) // 拉取所有利润分成列表(第一个为默认分成规则)
const getMemberParamConfig = p => request.get('/paramConfig/getMemberParamConfig', p) // 会员规则设置-获取会员规则设置
const getProfitsDistributions = p => request.get('/paramConfig/getProfitsDistributions', p) // 利润分成设置-获取利润分成设置
const updateMemberParamConfig = p => request.post('/paramConfig/updateMemberParamConfig', p) // 会员规则设置-修改会员规则设置
const getMerchantParamConfig = p => request.get('/paramConfig/getMerchantParamConfig', p) // 商家规则设置-获取规则设置
const updateMerchantParamConfig = p => request.post('/paramConfig/updateMerchantParamConfig', p) // 商家规则设置-商家入驻要求
const modifyProfitsDistribution = p => request.post('/paramConfig/modifyProfitsDistribution', p) // 利润分成设置-添加/修改利润分成设置（有无ID区分）-->返回ID
const updateFastInstallmentConfig = p => request.post('/paramConfig/updateFastInstallmentConfig', p) // 快速分期购设置
const findFastInstallmentConfig = p => request.get('/paramConfig/findFastInstallmentConfig', p) // 快速分期购设置-获取设置
const addOrUpdateServiceMoney = p => request.post('/poundageConfig/addOrUpdate', p) // 提现手续费设置 -- 添加/修改
const queryServiceMoney = p => request.get('/poundageConfig/query', p) // 提现手续费设置 -- 查询
const getAgentParamConfig = p => request.get('/paramConfig/getAgentParamConfig', p) // 会员规则设置 - 城市合伙人
const updateAgentParamConfig = p => request.post('/paramConfig/updateAgentParamConfig', p) // 会员规则设置修改 - 城市合伙人
const updateSeedParamConfig = p => request.post('/paramConfig/updateSeedParamConfig', p) // 积分设置 - 修改种子设置
const getSeedParamConfig = p => request.get('/paramConfig/getSeedParamConfig', p) // 积分设置 - 获取种子设置
const getMentionPeriodParamConfig = p => request.get('/paramConfig/getMentionPeriodParamConfig', p) // freeBuy提期 - 获取规则
const updateMentionPeriodParamConfig = p => request.post('/paramConfig/updateMentionPeriodParamConfig', p) // freeBuy提期 - 修改规则
const getAdvanceOrderParamConfig = p => request.get('/paramConfig/getAdvanceOrderParamConfig', p) // 预售订单规则 - 获取规则
const updateAdvanceOrderParamConfig = p => request.post('/paramConfig/updateAdvanceOrderParamConfig', p) // 预售订单规则 - 修改规则
const addOrUpdateOrderAndForum = p => request.post('/forum/config/addOrUpdate', p) // 发起预售及待返发帖限制 - 添加限制规则
const findListOrderAndForum = p => request.get('/forum/config/findList', p) // 发起预售及待返发帖限制 - 获取限制规则
const addOrUpdateDetailOrderAndForum = p => request.post('/forum/config/addOrUpdateDetail', p) // 发起预售及待返发帖限制 - 新增或者修改受限人群
const removeOrderAndForum = p => request.post('/forum/config/remove', p) // 发起预售及待返发帖限制 - 删除
const getParamConfigByKey = p => request.get('/paramConfig/getParamConfigByKey', p) // 获取规则设置
const findTopicList = p => request.get('/installment/config/findTopicList', p) // 一折购分期支付-主题查询
const addOrUpdateTopicUser = p => request.post('/installment/config/addOrUpdateTopicUser', p) // 一折购分期支付-添加或者修改受限制人群
const findConfig = p => request.get('/installment/config/findConfig', p) // 一折购分期支付-规则查询
const addOrUpdateTopic = p => request.post('/installment/config/addOrUpdateTopic', p) // 一折购分期支付-新增或修改主题
const removeTopic = p => request.post('/installment/config/removeTopic', p) // 一折购分期支付-删除主题
const findConfigList = p => request.get('/individualization/config/findConfigList', p) // 个性化规则-查询列表
const addOrUpdateTopicIndividualization = p => request.post('/individualization/config/addOrUpdateTopic', p) // 个性化规则-添加或者修改
const findConfigIndividualization = p => request.get('/individualization/config/findConfig', p) // 个性化规则-查询详情
const removeConfigIndividualization = p => request.post('/individualization/config/removeConfig', p) // 个性化规则-删除


// 积分管理
const findProduct_seed = p => request.get('/integral/seed/config/findProduct', p) // 查询种子获取规则
const addOrUpdateProduct_seed = p => request.post('/integral/seed/config/addOrUpdateProduct', p) // 新增或修改种子获取规则
const addOrUpdateOnlineRedEnvelopeUser = p => request.post('/integral/seed/config/addOrUpdateOnlineRedEnvelopeUser', p) // 添加或修改在线种子红包享受人群
const addOrUpdateVideoUser = p => request.post('/integral/seed/config/addOrUpdateVideoUser', p) // 添加或修改观看视频享受人群
const addOrUpdateConsumeTopic = p => request.post('/integral/seed/config/addOrUpdateConsumeTopic', p) // 种子消耗-新增或修改规则
const findConsume = p => request.get('/integral/seed/config/findConsume', p) // 种子消耗-规则查询
const removeConsumeTopic = p => request.post('/integral/seed/config/removeConsumeTopic', p) // 种子消耗-规则删除
const findConsumeTopicList = p => request.get('/integral/seed/config/findConsumeTopicList', p) // 种子消耗-查询种子扣除规则列表
const addOrUpdateConsumeTopicUser = p => request.post('/integral/seed/config/addOrUpdateConsumeTopicUser', p) // 种子消耗-新增或修改受限人群
const findPageListSeedList = p => request.get('/user/seed/findPageList', p) // 种子明细-查询种子明细
const getSendSeedRecordList = p => request.get('/user/seed/getSendSeedRecordList', p) // 种子赠送扣除-分页查询
const getSendSeedRecordListByExcel = p => request.get('/user/seed/getSendSeedRecordListByExcel', {
  params:p,
  responseType:'blob'
}) // 种子赠送扣除-导出操作用户种子明细
const updateUserSeed = p => request.post('/user/seed/updateUserSeed', p) // 种子赠送扣除-修改用户种子
const getFlowerRuleList = p => request.get('/flowerRule/getFlowerRuleList', p) // 花瓣获取管理-查询
const updateFlowerRule = p => request.post('/flowerRule/updateFlowerRule', p) // 花瓣获取管理-修改




// 商品管理模块
const platGoodsList = p => request.get('/goodsControl/platGoodsList', p) // 商品管理-自营商品管理列表
const queryPlatAndMerchantGoodsList = p => request.get('/goodsControl/queryPlatAndMerchantGoodsList', p) // 商品管理-获取自营商品和商家商品列表
const queryPlatAndMerchantGoodsStockList = p => request.get('/goodsControl/queryPlatAndMerchantGoodsStockList', p) // 商品管理-获取自营商品和商家商品的商品规格列表
const updateGoodsIssueStatus = p => request.post('/goodsControl/updateGoodsIssueStatus', p) // 商品管理-更改商品上下架状态
const deleteGoods = p => request.post('/goodsControl/deleteGoods', p) // 商品管理-批量删除商品
const addPlatTag = p => request.post('/goodsControl/addPlatTag', p) // 添加自营标签
const merchantGoodsList = p => request.get('/goodsControl/merchantGoodsList', p) // 商品管理-商家商品管理列表
const updateGoodsAdWeights = p => request.post('/goodsControl/updateGoodsAdWeights', p) // 商品管理-更改商品广告值
const updateGoodsGrabbedNumber = p => request.post('/goodsControl/updateGoodsGrabbedNumber', p) // 商品管理-更改商品已抢件数
const addClass = p => request.post('/goodsCategory/add', p) // 新增一条分类
const deleteClass = p => request.delete('/goodsCategory/deleteById', p) // 根据ID删除商品分类
const updateClass = p => request.post('/goodsCategory/updateById', p) // 根据ID更新商品分类
const sortClass = p => request.post('/goodsCategory/sortByParentId', p) // 修改分类排序
const merchantGoodsAuditList = p => request.get('/goodsControl/merchantGoodsAuditList', p) // 商品管理-商家商品审核管理列表
const updateGoodsAuditStatus = p => request.post('/goodsControl/updateGoodsAuditStatus', p) // 商品管理-更新商品审核状态
const queryGoodsQRCode = p => request.get('/goodsControl/queryGoodsQRCode', {
  params: p,
}) // 商品管理-查询商品太阳码地址
const updateGoodsShowStatus = p => request.delete('/goodsCategory/updateStatus', p) // 商品分类-修改状态
const packageGoodsList = p => request.get('/goodsControl/package/packageGoodsList', p) // 套餐核销商品管理-获取商品数据列表
const evaluationList = p => request.get('/goodsControl/package/evaluationList', p) // 套餐核销商品管理-获取评论列表
const addEvaluation = p => request.post('/goodsControl/package/addEvaluation', p) // 套餐核销商品管理-添加虚拟评论
const evaluationUpdateOrderNo = p => request.post('/goodsControl/package/updateOrderNo', p) // 套餐核销商品管理-修改排序值
const deleteEvaluation = p => request.post('/goodsControl/package/deleteEvaluation', p) // 套餐核销商品管理-删除评论
const addEvaluationGoods = p => request.post('/goodsControl/package/addGoods', p) // 套餐核销商品管理-添加商品
const getEvaluationGoodsDetail = p => request.get('/goodsControl/package/goodsDetail', p) // 套餐核销商品管理-查询商品详情
const deleteEvaluationGoods = p => request.post('/goodsControl/package/deleteGoods', p) // 套餐核销商品管理-批量删除商品
const updateEvaluationGoods = p => request.post('/goodsControl/package/updateGoods', p) // 套餐核销商品管理-修改商品
const updateGoodsSales = p => request.post('/goodsControl/package/updateGoodsGrabbedNumber', p) // 套餐核销商品管理-修改销量

// 营销管理模块
const getSlideShowByCategory = p => request.get('/slideShow/getSlideShowByCategory', p) // 首页轮播图-获取所有
const addBanner = p => request.post('/slideShow/add', p) // 新增一条轮播图数据-（from表单上传）
const deleteBanner = p => request.delete('/slideShow/deleteById', p) // 根据ID删除轮播图
const updateBanner = p => request.post('/slideShow/updateById', p) // 根据ID更新轮播图-（from表单上传）
const sortBanner = p => request.post('/slideShow/sortBySlideShowIds', p) // 修改分类排序
const searchGoodsByName = p => request.get('/goodsControl/searchGoodsByName', p) // 营销管理-轮播图管理-搜索商品关键字
const queryPriceActivity = p => request.get(`/activity/queryPriceActivity${p}`) // 查询当前活动
const queryPriceActivityList = p => request.get('/activity/queryPriceActivityList', p) // 查询往期活动
const activityDetails = p => request.get('/activity/queryPriceActivityById', p) // 查询活动详情
const deleteActive = p => request.delete('/activity/deleteById', p) // 根据ID删除活动
const updatePriceActivityStatus = p => request.post('/activity/updatePriceActivityStatus', p) // 修改活动状态
const addOrUpdatePriceActivity = p => request.post('/activity/addOrUpdatePriceActivity', p) // 添加or修改活动
const addStock = p => request.post('/activity/addStock', p) // 增加库存
const getStock = p => request.get(`/activity/getStock${p}`) // 查询库存
const findVideoByType = p => request.get(`/page/findVideoByType${p}`) // 查询视频
const deleteVideo = p => request.delete(`/page/delVideo${p}`) // 删除视频
const addOrUpdateVideo = p => request.post('/page/addOrUpdateVideo', p) // 添加或修改视频
const updateVideoIsTop = p => request.post(`/page/updateVideoIsTop${p}`) // 设置或取消视频置顶
const queryPageList = p => request.get(`/marketingActivityGoods/queryPageList`, p) // 商品分页查询
const updateOrderNumber = p => request.post(`/marketingActivityGoods/updateOrderNumber${p}`) // 修改排序值
const updateIssueStatus = p => request.post(`/marketingActivityGoods/updateIssueStatus${p}`) // 商品上架和下架
const addProduct = p => request.post('/marketingActivityGoods/add', p) // 添加商品
const findPageListNotice = p => request.get('/marketing/notice/findPageList', {
  params: p
}) // 公告查询
const findDetailNotice = p => request.get('/marketing/notice/findDetail', p) // 公告查询明细
const addOrUpdateNotice = p => request.post('/marketing/notice/addOrUpdate', p) // 公告新增或修改
const removeNotice = p => request.post('/marketing/notice/remove', p) // 公告删除
const findNavigation = p => request.get('/marketing/navigation/findPageList', {
  params: p
}) // 导航查询
const updateOrderNoNavigation = p => request.post('/marketing/navigation/updateOrderNo', p) // 修改导航排序号
const updateStatusNavigation = p => request.post('/marketing/navigation/updateStatus', p) // 修改导航上架或者下架
const removeNavigation = p => request.post('/marketing/navigation/remove', p) // 删除导航
const findDetailNavigation = p => request.get('/marketing/navigation/findDetail', {
  params: p
}) // 导航营销详情
const addOrUpdateNavigation = p => request.post('/marketing/navigation/addOrUpdate', p) // 添加或修改导航
const findSystemPageListNavigation = p => request.get('/marketing/navigation/findSystemPageList', {
  params: p
}) // 导航之系统页面
const findPageListNavigation = p => request.get('/goodsCategory/findPageList', {
  params: p
}) // 导航之商品分类
const findPageListH5 = p => request.get('/marketing/navigation/resources/findPageList', p) // 导航营销-查询H5链接路径
const addOrUpdateH5 = p => request.post('/marketing/navigation/resources/addOrUpdate', p) // 导航营销-新增或修改H5链接路径
const queryPromote = p => request.get('/marketing/navigation/queryPromote', p) // 查询推广物料设置
const sortBySlideShowIds = p => request.post('/marketing/navigation/sortBySlideShowIds ', p) // 轮播图管理--设为首图
const updateVisibleType = p => request.post('/marketing/navigation/updateVisibleType ', p) // 轮播图管理--修改显示类型
const getGuessList = p => request.get('/guess/getGuessList', p) // 竞猜后台-竞猜管理列表
const addGuess = p => request.post('/guess/addGuess', p) // 竞猜后台-新建竞猜
const getGuessById = p => request.get('/guess/getGuessById', p) // 竞猜后台-查询竞猜
const updateGuessById = p => request.put('/guess/updateGuessById', p) // 竞猜后台-修改竞猜
const deleteGuessById = p => request.put('/guess/deleteGuessById', p) // 竞猜后台-删除竞猜
const revealAnswerById = p => request.put('/guess/revealAnswerById', p) // 竞猜后台-揭晓答案
const addOrUpdateGuess = p => request.post('/rule/addOrUpdate', p) // 竞猜后台-新增或修改竞猜规则
const getRuleGuess = p => request.get('/rule/getRule', p) // 竞猜后台-查询竞猜规则
const getGuessCostChoose = p => request.get('/costAmount/getGuessCostChoose', p) // 竞猜后台-查询用户下注选项
const addOrUpdateGuessChoose = p => request.post('/costAmount/addOrUpdateGuessChoose', p) // 竞猜后台-新增或修改用户下注选项
const getGuessRecordList = p => request.get('/guess/getGuessRecordList', p) // 竞猜后台-投票明细列表
const appGuess = p => request.post('/guess/appGuess', p) // 竞猜后台-平台投票
const getGuessDiscussList = p => request.get('/guessDiscuss/getGuessDiscussList', p) // 竞猜后台-查询讨论区明细
const addGuessDiscuss = p => request.post('/guessDiscuss/addGuessDiscuss', p) // 竞猜后台-添加平台虚拟评论
const deleteGuessDiscuss = p => request.put('/guessDiscuss/deleteGuessDiscuss', p) // 竞猜后台-删除评论
const getGoodsFlowerList = p => request.get('/flowerGoods/getGoodsFlowerList', p) // 花瓣商城-花瓣商城管理列表
const updateSerialNumber = p => request.put('/flowerGoods/updateSerialNumber', p) // 花瓣商城-修改排序号
const getChangeRecordList = p => request.get('/flowerGoods/getChangeRecordList', p) // 花瓣商城-商品兑换记录列表
const exportChangeRecordExcel = p => request.get('/flowerGoods/exportChangeRecordExcel', {
  params:p,
  responseType:'blob'
}) // 花瓣商城-导出兑换记录
const getFlowerGoodsById = p => request.get('/flowerGoods/getGoodsById', p) // 花瓣商城-根据商品编号查询商品
const addGoodsFlower = p => request.post('/flowerGoods/addGoodsFlower', p) // 花瓣商城-新增商品
const deleteGoodsFlower = p => request.put('/flowerGoods/deleteGoodsFlower', p) // 花瓣商城-删除商品
const getTakeGoodsInfo = p => request.get('/flowerGoods/getTakeGoodsInfo', p) // 花瓣商城-查询收货人信息
const deliverFlowerGoods = p => request.put('/flowerGoods/deliver', p) // 花瓣商城-确认发货

const addNewPeople = p => request.post('/newPeople/add', p) // 新人专区添加活动
const updateNewPeople = p => request.post('/newPeople/update', p) // 新人专区修改活动
const queryNewPeople = p => request.get('/newPeople/queryPageList', p) // 新人专区查询活动列表
const queryNewPeopleDetail = p => request.get('/newPeople/findDetail', p) // 新人专区查询活动详情
const NewPeopleUpdateStatus = p => request.post('/newPeople/updateStatus', p) // 新人专区活动修改状态
const NewPeopleFindGoods = p => request.get(`/newPeople/findGoodsByActivityId${p}`) // 新人专区活动商品列表
const newPeopleQueryGoodsQRCode = p => request.get('/newPeople/queryGoodsQRCode', p) // 新人专区查询商品二维码
const queryGoodsArea = p => request.get('/mdse/activity/queryPageList', p) // 商品活动专区查询活动列表
const goodsAreaUpdateStatus = p => request.post('/mdse/activity/updateStatus', p) // 商品活动专区修改活动状态
const goodsAreaActivity = p => request.post('/mdse/activity/activity', p) // 商品活动专区添加或者修改活动
const goodsAreaDetail = p => request.get('/mdse/activity/detail', p) // 商品活动专区活动详情
const goodsAreaFindGoods = p => request.get(`/mdse/activity/findGoodsByActivityId${p}`) // 商品活动专区查看活动商品列表
const goodsAreaCreateQrCode = p => request.get('/mdse/activity/createQrCode', p) // 商品活动专区生成二维码
const getGuidePage = p => request.get('/guidePage/query', p) // 用户引导 - 查询内容
const updateGuidePage = p => request.post('/guidePage/update', p) // 用户引导 - 修改内容
const addOrUpdate_floating = p => request.post('/floating/navigation/addOrUpdate', p) // 弹浮窗-新增或修改
const findPageList_floating = p => request.get('/floating/navigation/findPageList', p) // 弹浮窗-分页查询
const updateStatus_floating = p => request.post('/floating/navigation/updateStatus', p) // 弹浮窗-修改状态
const remove_floating = p => request.post('/floating/navigation/remove', p) // 弹浮窗-删除
const updateOrderNo_floating = p => request.post('/floating/navigation/updateOrderNo', p) // 弹浮窗-修改优先级
const findDetail_floating = p => request.get('/floating/navigation/findDetail', p) // 弹浮窗-查询明细
const getExcelTemplet_floating = p => request.get('/floating/navigation/getExcelTemplet', {
  responseType: 'blob'
}) // 弹浮窗-获取导入用户Excel模板
const findCustomizeActivityList = p => request.get('/marketing/customizeActivity/findPageList', p) // 自定义活动-查询活动列表
const updateCustomizeActivityStatus = p => request.post('/marketing/customizeActivity/updateStatus', p) // 自定义活动-修改状态
const findCustomizeActivityGoodsStockList = p => request.get('/marketing/customizeActivity/findGoodsStockList', p) // 自定义活动-查询活动商品规格列表
const addOrUpdateCustomizeActivity = p => request.post('/marketing/customizeActivity/addOrUpdate', p) // 自定义活动-添加或者修改活动
const findCustomizeActivityDetail = p => request.get('/marketing/customizeActivity/findDetail', p) // 自定义活动-查询活动详情

const findPageListCoupon = p => request.get('/marketing/coupon/findPageList', p) // 优惠券-分页查询
const addOrUpdateCoupon = p => request.post('/marketing/coupon/addOrUpdate', p) // 优惠券-添加或修改优惠券
const removeCoupon = p => request.post('/marketing/coupon/remove', p) // 优惠券-删除优惠券
const updateOrderNoCoupon = p => request.get('/marketing/coupon/updateOrderNo', p) // 优惠券-修改排序号
const check4PresentPersonally = p => request.post('/marketing/coupon/check4PresentPersonally', p) // 优惠券-赠送优惠券-个人赠送-校验
const presentPersonally = p => request.post('/marketing/coupon/presentPersonally', p) // 优惠券-赠送优惠券-个人赠送
const getExcelTemplate = p => request.get('/marketing/coupon/excel/getExcelTemplate', {
  params:p,
  responseType: 'blob'
}) // 优惠券-赠送优惠券-下载批量赠送excel模板
const importExcel4Present = p => request.post('/marketing/coupon/excel/importExcel4Present', p) // 优惠券-赠送优惠券-批量赠送
const getExcel4PresentResult = p => request.get('/marketing/coupon/excel/getExcel4PresentResult', {
  params:p,
  responseType: 'blob'
}) // 优惠券-赠送优惠券-下载批量赠送结果



// 心愿池管理模块
const wishQueryPageList = p => request.get('/wishGoods/queryPageList', p) // 分页查询
const wishQueryDetail = p => request.get(`/wishGoods/queryDetail${p}`) // 查看详情
const matchedGoods = p => request.post('/wishGoods/matchedGoods',p) // 满足心愿
const exportWishGoodsExcel = p => request.get('/wishGoods/exportWishGoodsExcel', {
  params: p,
  responseType: 'blob'
}) //心愿管理导出查询内容

const addSupport = p => request.post('/marketingAuspicesGoods/add', p) // 添加赞助活动商品
const queryPageListSupport = p => request.get('/marketingAuspicesGoods/queryPageList', p) // 获取赞助活动列表
const updateIssueStatusSupport = p => request.post('/marketingAuspicesGoods/updateIssueStatus', p) // 赞助商品的上架和下架
const updateOrderNumberSupport = p => request.post('/marketingAuspicesGoods/updateOrderNumber', p) // 设置赞助商品的排序值
const getAuspicesParamConfig = p => request.get('/paramConfig/getAuspicesParamConfig', p) // 获取赞助规则
const updateAuspicesParamConfig = p => request.post('/paramConfig/updateAuspicesParamConfig', p) // 修改赞助规则


// 订单数据统计
const queryOrderListOrderData = p => request.get('order/data/queryOrderList', p) // 查询订单数据统计列表
const queryActivitiesByOrderType = p => request.get('order/queryActivitiesByOrderType', p) // 根据订单类型查询活动
const queryOrderListOrderDataExcel = p => request.get('order/data/queryOrderListExcel', {
  params: p,
  responseType: 'blob'
}) // 导出查询订单数据统计列表

const findSaleTopicPageList = p => request.get('forum/statistics/findSaleTopicPageList', p) // 特殊数据统计 -- 待返卖贴
const findAdvanceOrderTopicPageList = p => request.get('forum/statistics/findAdvanceOrderTopicPageList', p) // 特殊数据统计 -- 预售订单
const findGoodsPreSaleProfitTopicPageList = p => request.get('forum/statistics/findGoodsPreSaleProfitTopicPageList', p) // 特殊数据统计 -- 商品卖贴
const findGoodsPreSaleEconomyTopicPageList = p => request.get('forum/statistics/findGoodsPreSaleEconomyTopicPageList', p) // 特殊数据统计 -- 商品买贴
const findAdvancePeriodTopicPageList = p => request.get('forum/statistics/findAdvancePeriodTopicPageList', p) // 特殊数据统计 -- 提期
const findSeedOrderPageList = p => request.get('forum/statistics/findSeedOrderPageList', p) // 特殊数据统计 -- 种子


// 内容管理
const findPageListForum = p => request.get('/forum/topic/findPageList', p) // 分页查询论坛内容
const removeForum = p => request.post('/forum/topic/remove', p) // 删除贴子
const findDetailForum = p => request.get('/forum/topic/findDetail', p) // 查询贴子明细
const removeForumcomment = p => request.post('/forum/comment/remove', p) // 查询贴子评论
const updateIsTopForum = p => request.post('/forum/topic/updateIsTop', p) // 置顶帖子或取消置顶
const updateVisibleForum = p => request.post('/forum/topic/updateVisible', p) // 展示或者隐藏贴子
const findPageListForumComment = p => request.get('/forum/comment/findPageList', p) // 查询贴子评论
const removeForumComment = p => request.post('/forum/comment/remove', p) // 删除评论
const removeListForumComment = p => request.post('/forum/comment/removeList', p) // 批量删除评论

// 防刷单管理
const findListUserBehavior = p => request.get('/user/findList', p) // 关联用户行为数据-查询
const findChildrenUserBehavior = p => request.get('/user/findChildren', p) // 关联用户行为数据-查询下级
const updateDealHunter = p => request.post('/user/updateDealHunter', p) // 关联用户行为数据-限制或取消限制
const exportExcelUserBehavior = p => request.get('/user/exportExcel', {
  params:p,
  responseType:'blob'
}) // 关联用户行为数据-导出excel


// 首页管理
const findByHeroRank = p => request.get('/marketing/navigation/findByHeroRank', p) // 查询英雄榜
const queryHeroList = p => request.get('/hero/queryHeroList', p) // 查询英雄榜列表
const addHeroList = p => request.post('/hero/addHeroList', p) // 英雄榜 - 新增虚拟用户
const deleteHeroById = p => request.get('/hero/deleteById', p) // 英雄榜 - 删除虚拟用户
const deleteAllHero = p => request.get('/hero/deleteAll', p) // 英雄榜 - 清空虚拟用户
const addHeroGrowthRules = p => request.post('/hero/addHeroGrowthRules', p) // 英雄榜 - 新增或修改虚拟用户规则
const getHeroListExcel = p => request.get('/hero/getHeroListExcelTemplet', {
  responseType: 'blob'
}) // 英雄榜-获取导入虚拟信息Excel模板
const importHeroListExcel = p => request.post('/hero/importHeroListExcel', p) // 英雄榜-导入英雄榜虚拟信息
const hideOrShowHeroList = p => request.get('/hero/hideOrShow', p) // 英雄榜-显示或者隐藏


// 系统管理
const getLogisticsCompanyList = () => request.get('/logisticsCompany/getLogisticsCompanyList') // 获取所有可用的物流信息
const deletelogistics = p => request.delete('/logisticsCompany/deleteById', p) // 根据ID删除物流信息
const addLogisticsCompany = p => request.post('/logisticsCompany/addLogisticsCompany', p) // 新增一条数据
const getAllCity = p => request.get(`/city/getAllCity${p}`) // 获取所有的城市数据
const getAllCityData = p => request.get('/city/getAllCityData', p) // 获取所有的行政区域
const getDistrictByCityId = p => request.get('/city/getDistrictByCityId', p) // 根据城市ID获取区数据
const modifyByDistrictId = p => request.post('/city/modifyByDistrictId', p) // 修改添加区操作-->返回ID
const updateOrderAddress = p => request.post('/order/updateOrderAddress', p) // 修改订单收货信息
const setPage = p => request.post('/page/add', p) // 添加or 修改页面设置
const queryPage = p => request.get(`/page/queryByType${p}`) // 查询页面设置
const delFile = p => request.post('/page/delFile', p) // 文件删除
const findNoticeSet = p => request.get(`/wechat/findNoticeSet${p}`) // 查询微信通知设置
const updateNoticeSet = p => request.post('/wechat/updateNoticeSet', p) // 更新微信通知设置
const findTemplatePageList = p => request.get('/sms/findTemplatePageList', p) // 查询短信模板
const addOrUpdateTemplate = p => request.post('/sms/addOrUpdate', p) // 添加或修改短信模板
const findPageListTemplate = p => request.get('/sms/findPageList', p) // 查询短信列表
const exportExcelTemplate = p => request.get('/sms/exportExcel', {
  params: p,
  responseType: 'blob'
}) // 短信列表-导出excel
const addCourseVideo = p => request.post('/courseVideo/addCourseVideo', p) // 新手教程-上传视频
const deleteCourseVideoById = p => request.delete(`/courseVideo/deleteCourseVideoById${p}`) // 新手教程-删除视频
const selectCourseVideo = p => request.get('/courseVideo/selectCourseVideo', p) // 新手教程-获取新手视频列表


export {
  accessibleMenus,
  validatePermission,
  addCourseVideo,
  deleteCourseVideoById,
  selectCourseVideo,
  getDashboard,
  removeForumcomment,
  applyGoodsStages,
  addNewPeople,
  queryActivitiesByOrderType,
  updateNewPeople,
  updateParent,
  updateGoodsQuantity,
  updateDrawQuota,
  updateDefaultValue,
  getDefaultValue,
  agentAgents,
  NewPeopleUpdateStatus,
  queryNewPeople,
  goodsAreaUpdateStatus,
  getDeliveryTime,
  exportApplyBalanceExcel,
  updateMentionPeriodParamConfig,
  goodsAreaCreateQrCode,
  goodsAreaFindGoods,
  getMentionPeriodParamConfig,
  groupRefuse,
  groupRefund,
  groupFinish,
  queryGoodsArea,
  goodsAreaActivity,
  agentApplyList,
  setAutoAdoptByAliPay,
  updateParamConfigMinAmount,
  getParamConfigByKey,
  newPeopleQueryGoodsQRCode,
  findListUserBehavior,
  findChildrenUserBehavior,
  updateDealHunter,
  exportExcelUserBehavior,
  exportMerchantDrawRecord,
  agentRole,
  NewPeopleFindGoods,
  goodsAreaDetail,
  agentApplyBalance,
  queryNewPeopleDetail,
  findByHeroRank,
  getMerchantBusinessListByUnderLine,
  updateContactNumber,
  exportInstallmentGoodsExcel,
  findAgentRoleById,
  updateIssueStatusSupport,
  updateAuspicesParamConfig,
  findPageListH5,
  queryPageListSupport,
  queryOrderListOrderDataExcel,
  updateOrderNumberSupport,
  getDeliveryMerchantList,
  queryOrderListOrderData,
  addSupport,
  getAuspicesParamConfig,
  removeDeliveryMerchantList,
  getMerchantApplyList,
  updateGoodsShowStatus,
  updateAdvanceOrderParamConfig,
  addOrUpdateH5,
  getHeroListExcel,
  refuseStages,
  findPageListForum,
  removeForum,
  updateIsTopForum,
  queryAgentRole,
  findDetailForum,
  exportAgentExcel,
  agentFreeze,
  agentUnfreeze,
  exportApplyAgentExcel,
  queryOperateOrderRefundList,
  findPageListNavigation,
  refundAudits,
  queryOrderRefund,
  setDeliveryMerchantinfo,
  queryLogistics,
  getAllUnexpectedIncome,
  userLoginRequest,
  packageGoodsList,
  evaluationList,
  addEvaluation,
  queryPromote,
  addGoodsRequest,
  getUserTransferAuditListAlipay,
  findPageListSeedList,
  getSendSeedRecordList,
  getSendSeedRecordListByExcel,
  updateUserSeed,
  getFlowerRuleList,
  updateFlowerRule,
  upDataGoodsRequest,
  queryGoodsDetailRequest,
  queryofflineGoodsDetail,
  noLogistics,
  getBusinessOptionsRequest,
  addDeliveryMerchantList,
  findConsumeTopicList,
  getPackageOrderByExcel,
  getNormalOrderByExcel,
  getGoodsClassRequest,
  getOrderList,
  addOrUpdate_floating,
  getMerchantPickPoint,
  delPickupPoint,
  addPickupPoint,
  getMerchantPickPointById,
  findPageList_floating,
  updateStatus_floating,
  remove_floating,
  updateOrderNo_floating,
  findDetail_floating,
  addEvaluationGoods,
  getRecommendStore,
  updateRecommendStore,
  getEvaluationGoodsDetail,
  deleteEvaluationGoods,
  updateGoodsSales,
  updateEvaluationGoods,
  getLogisticsCompanyList,
  addOrderLogistics,
  findCustomizeActivityGoodsStockList,
  addMerchantGoodsCategory,
  refundAudit,
  findTopicList,
  addOrUpdateTopicUser,
  getMerchantBusinessList,
  queryOrderReason,
  agentResetPassword,
  agentBalance,
  queryOrder,
  merchantAutoAdoptSetByAliPay,
  applyRefundMerchant,
  addOrUpdateOnlineRedEnvelopeUser,
  addOrUpdateVideoUser,
  getMerchantDrawList,
  queryLogistic,
  agentRefuseBalance,
  cancelOrderMerchant,
  findAdvanceOrderTopicPageList,
  findAdvancePeriodTopicPageList,
  findGoodsPreSaleProfitTopicPageList,
  findGoodsPreSaleEconomyTopicPageList,
  findSeedOrderPageList,
  agentRenew,
  getExcel,
  getGuessList,
  addGuess,
  getGuessById,
  updateGuessById,
  deleteGuessById,
  revealAnswerById,
  getRuleGuess,
  getGuessCostChoose,
  addOrUpdateGuessChoose,
  getGuessRecordList,
  appGuess,
  getGuessDiscussList,
  addGuessDiscuss,
  deleteGuessDiscuss,
  getGoodsFlowerList,
  updateSerialNumber,
  getChangeRecordList,
  exportChangeRecordExcel,
  getFlowerGoodsById,
  addGoodsFlower,
  deleteGoodsFlower,
  deliverFlowerGoods,
  getTakeGoodsInfo,
  addOrUpdateGuess,
  changeMerchantApplyStatus,
  getExcelTemplet_floating,
  addOrUpdateAgentRole,
  removeOrderAndForum,
  getLicenseImage,
  platGoodsList,
  getAdvanceOrderParamConfig,
  updateGoodsIssueStatus,
  updateFlashPaySet,
  addPlatTag,
  refundCostomizeActivityOrder,
  merchantGoodsList,
  addOrUpdateConsumeTopicUser,
  pushVerificationCode,
  getMerchantOrderList,
  updateGoodsAdWeights,
  evaluationUpdateOrderNo,
  hideOrShowHeroList,
  updateGoodsGrabbedNumber,
  addClass,
  deleteAllHero,
  addOrUpdateTopic,
  findPageListInsurance,
  addInsurance,
  findListImagesInsurance,
  addOrUpdateImagesInsurance,
  removeTopic,
  addOrUpdateTopicIndividualization,
  findConfigIndividualization,
  removeConfigIndividualization,
  findConfigList,
  deleteClass,
  updateClass,
  deleteHeroById,
  sortBySlideShowIds,
  merchantAddBlackList,
  merchantRemoveBlackList,
  deleteEvaluation,
  addOrUpdateCustomizeActivity,
  findCustomizeActivityDetail,
  findPageListCoupon,
  addOrUpdateCoupon,
  removeCoupon,
  updateOrderNoCoupon,
  check4PresentPersonally,
  presentPersonally,
  getExcelTemplate,
  importExcel4Present,
  getExcel4PresentResult,
  sortClass,
  merchantGoodsAuditList,
  findCustomizeActivityList,
  updateCustomizeActivityStatus,
  queryHeroList,
  findSaleTopicPageList,
  updateGoodsAuditStatus,
  getSlideShowByCategory,
  exportOnlinesStoreListExcel,
  addBanner,
  searchGoodsByName,
  removeConsumeTopic,
  deleteBanner,
  findConfig,
  updateBanner,
  sortBanner,
  memberList,
  addHeroList,
  plusMemberList,
  exchangeMemberStatus,
  exportExcelTemplate,
  memberDetail,
  plusMemberDetail,
  subtractUserAssets,
  updateDeliveryMerchantList,
  getMerchantGoods,
  importHeroListExcel,
  setDeliveryTime,
  allProfitsDistributionIdAndName,
  exchangeMemberRole,
  findConsume,
  getWithdrawMoneyAuditList,
  queryPriceActivity,
  queryPriceActivityList,
  getMerchantApplyDetail,
  findTemplatePageList,
  deleteActive,
  updatePriceActivityStatus,
  activityDetails,
  addOrUpdatePriceActivity,
  getMerchantGoodsCategory,
  findProduct_seed,
  findPageListTemplate,
  getMemberParamConfig,
  agentApprove,
  updateMemberParamConfig,
  addOrUpdateConsumeTopic,
  updateMerchantParamConfig,
  getProfitsDistributions,
  modifyProfitsDistribution,
  agentRoleById,
  getUserRechargeRecord,
  auditPassedById,
  getMerchantAuditList,
  getMerchantAuditListExcel,
  getMerchantDetails,
  getOnlineStoreList,
  getMerchantBlackList,
  getfreightPlatList,
  getOfflineStoreList,
  deletelogistics,
  agentPassBalance,
  addLogisticsCompany,
  getAllCity,
  removeMerchantGoodsCategory,
  getAllCityData,
  getDistrictByCityId,
  modifyByDistrictId,
  getDeliveryData,
  getMerchantIncomeDetails,
  addOrUpdateProduct_seed,
  updateAdWeights,
  changeAuditStatus,
  resetPassword,
  platDeliveryApplyList,
  platDeliveryApply,
  getExportMerchantExcel,
  addOrUpdateTemplate,
  auditCancelById,
  changeGoodsSetCategory,
  importMerchantForExcel,
  deleteMerchantById,
  getMerchantAuditListByWhereExcel,
  addHeroGrowthRules,
  updateVisibleForum,
  removeForumComment,
  removeListForumComment,
  findPageListForumComment,
  merchantDrawAdopt,
  updateFastInstallmentConfig,
  findFastInstallmentConfig,
  queryTobeShippedOrderGoods,
  importLogisticsExcel,
  getLogisticsExcelTemplet,
  updateOrderAddress,
  findListOrderAndForum,
  setPage,
  queryPage,
  delFile,
  addStock,
  getStock,
  getUserTransferAuditList,
  getUserTransferAuditListBankCard,
  addOrUpdateOrderAndForum,
  auditPassedBankCard,
  updateMerchantSales,
  updateMerchantScore,
  getBankCardInfo,
  getUserTransferAuditListBankCardExcel,
  addOrUpdateServiceMoney,
  queryServiceMoney,
  findVideoByType,
  deleteVideo,
  addOrUpdateVideo,
  merchantAutoAdoptSet,
  findNoticeSet,
  updateNoticeSet,
  queryPageList,
  updateOrderNumber,
  updateIssueStatus,
  updateVideoIsTop,
  merchantSetAutoAdopt,
  addProduct,
  queryPlatAndMerchantGoodsList,
  queryPlatAndMerchantGoodsStockList,
  wishQueryPageList,
  wishQueryDetail,
  matchedGoods,
  exportWishGoodsExcel,
  getAgentParamConfig,
  updateAgentParamConfig,
  getMerchantParamConfig,
  getMerchantDrawRecordList,
  queryGoodsQRCode,
  diamondMemberList,
  diamondMemberDetail,
  memberListByExcel,
  plusMemberListByExcel,
  diamondMemberListByExcel,
  deleteGoods,
  updateSeedParamConfig,
  getSeedParamConfig,
  findPageListNotice,
  findDetailNotice,
  addOrUpdateDetailOrderAndForum,
  addOrUpdateNotice,
  removeNotice,
  findNavigation,
  updateOrderNoNavigation,
  updateStatusNavigation,
  removeNavigation,
  findDetailNavigation,
  addOrUpdateNavigation,
  getGuidePage,
  updateGuidePage,
  findSystemPageListNavigation,
  updateVisibleType,
  agentRefuse
}
