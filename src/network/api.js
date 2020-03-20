import request from './config'

const userLoginRequest = p => request.post('/accounts/login', p) // 登录
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



// 首页
const getDashboard = p => request.get('/dashboard/getDashboard', p) // 获取首页仪表盘信息

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
const getMerchantAuditListExcel = p => request.get('/excel/getMerchantAuditListExcel', p) // 商户管理-申请管理-导出商户申请Excel
const getMerchantDetails = p => request.get('/merchant/manage/getMerchantDetails', p) // 商户管理-获取商户详细信息（基础信息）
const getMerchantIncomeDetails = p => request.get('/merchant/manage/getMerchantIncomeDetails', p) // 商户管理-获取商户详细信息（营收记录）
const getOfflineStoreList = p => request.get('/merchant/manage/getOfflineStoreList', p) // 商户管理-获取门店商户列表信息
const getOnlineStoreList = p => request.get('/merchant/manage/getOnlineStoreList', p) // 商户管理-获取在线商户列表信息
const updateAdWeights = p => request.post('/merchant/manage/updateAdWeights', p) // 修改广告值
const changeAuditStatus = p => request.post('/merchant/manage/changeAuditStatus', p) // 更改审核状态
const deleteMerchantById = p => request.delete('/merchant/manage/deleteMerchantById', p) // 商户管理-删除商户（只能删除导入的商户）
const resetPassword = p => request.put('/merchant/manage/resetPassword', p) // 商户管理-重置商户密码
const getExportMerchantExcel = p => request.get('/excel/getExportMerchantExcel', {
  responseType: 'blob'
}) // 商户管理-获取导入商家Excel模板
const importMerchantForExcel = p => request.post('/excel/importMerchantForExcel', p) // 商户管理-获取导入商家Excel模板





// 奖励金模块
const getAllUnexpectedIncome = p => request.get('/incomeRecord/getAllUnexpectedIncome', p) // 获取所有的奖励金数据


// 充值模块
const getUserRechargeRecord = p => request.get('/userTradeRecord/getUserRechargeRecord', p) // 充值管理-用户充值管理



//用户管理模块
const memberList = p => request.get('/member/memberList', p) // 用户管理-普通会员管理
const plusMemberList = p => request.get('/member/plusMemberList', p) // 用户管理-PLUS会员管理
const exchangeMemberStatus = p => request.post('/member/exchangeMemberStatus', p) // 用户管理-更新用户状态
const memberDetail = p => request.get('/member/memberDetail', p) // 用户管理-普通会员详情
const plusMemberDetail = p => request.get('/member/plusMemberDetail', p) // 用户管理-PLUS普通会员详情
const diamondMemberList = p => request.get('/member/diamondMemberList', p) // 用户管理-钻石合伙人查询列表
const diamondMemberDetail = p => request.get('/member/diamondMemberDetail', p) // 用户管理-钻石合伙人查询明细
const subtractUserAssets = p => request.post('/member/subtractUserAssets', p) // 减少用户资产
const exchangeMemberRole = p => request.post('/member/exchangeMemberRole', p) // 用户管理-更新用户身份
const getWithdrawMoneyAuditList = p => request.get('/member/getWithdrawMoneyAuditList', p) // 用户管理-获取所有的奖励金数据
const getUserTransferAuditList = p => request.get('/userTradeRecord/getUserTransferAuditList', p) // 获取微信提现申请列表
const getUserTransferAuditListBankCard = p => request.get('/userTradeRecord/getUserTransferAuditListBankCard', p) // 获取用户银行卡提现申请列表
const auditPassedById = p => request.put('/userTradeRecord/auditPassedById', p) // 微信提现申请审核通过
const auditPassedBankCard = p => request.put('/userTradeRecord/auditPassedBankCard', p) // 银行卡提现申请审核通过
const getBankCardInfo = p => request.get(`/userTradeRecord/getBankCardInfo${p}`) // 获取银行卡信息
const getUserTransferAuditListBankCardExcel = p => request.get('/userTradeRecord/getUserTransferAuditListBankCardExcel', {
  params: p,
  responseType: 'blob'
}) // 银行卡提现列表导出excel




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
const getAdvanceOrderParamConfig = p => request.get('/paramConfig/getAdvanceOrderParamConfig', p) // 预售订单规则 - 获取规则
const updateAdvanceOrderParamConfig = p => request.post('/paramConfig/updateAdvanceOrderParamConfig', p) // 预售订单规则 - 修改规则




// 商品管理模块
const platGoodsList = p => request.get('/goodsControl/platGoodsList', p) // 商品管理-自营商品管理列表
const queryPlatAndMerchantGoodsList = p => request.get('/goodsControl/queryPlatAndMerchantGoodsList', p) // 商品管理-获取自营商品和商家商品列表
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



// 心愿池管理模块
const wishQueryPageList = p => request.get('/wishGoods/queryPageList', p) // 分页查询
const wishQueryDetail = p => request.get(`/wishGoods/queryDetail${p}`) // 查看详情
const matchedGoods = p => request.post(`/wishGoods/matchedGoods${p}`) // 满足心愿
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


// 内容管理
const findPageListForum = p => request.get('/forum/topic/findPageList', p) // 分页查询论坛内容
const removeForum = p => request.post('/forum/topic/remove', p) // 删除贴子
const findDetailForum = p => request.get('/forum/topic/findDetail', p) // 查询贴子明细
const removeForumcomment = p => request.post('/forum/comment/remove', p) // 查询贴子评论
const updateIsTopForum = p => request.post('/forum/topic/updateIsTop', p) // 置顶帖子或取消置顶

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


export {
  getDashboard,
  removeForumcomment,
  applyGoodsStages,
  addNewPeople,
  queryActivitiesByOrderType,
  updateNewPeople,
  agentAgents,
  NewPeopleUpdateStatus,
  queryNewPeople,
  goodsAreaUpdateStatus,
  exportApplyBalanceExcel,
  goodsAreaCreateQrCode,
  goodsAreaFindGoods,
  queryGoodsArea,
  goodsAreaActivity,
  agentApplyList,
  newPeopleQueryGoodsQRCode,
  agentRole,
  NewPeopleFindGoods,
  goodsAreaDetail,
  agentApplyBalance,
  queryNewPeopleDetail,
  exportInstallmentGoodsExcel,
  findAgentRoleById,
  updateIssueStatusSupport,
  updateAuspicesParamConfig,
  findPageListH5,
  queryPageListSupport,
  queryOrderListOrderDataExcel,
  updateOrderNumberSupport,
  queryOrderListOrderData,
  addSupport,
  getAuspicesParamConfig,
  updateAdvanceOrderParamConfig,
  addOrUpdateH5,
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
  queryLogistics,
  getAllUnexpectedIncome,
  userLoginRequest,
  addGoodsRequest,
  upDataGoodsRequest,
  queryGoodsDetailRequest,
  queryofflineGoodsDetail,
  noLogistics,
  getBusinessOptionsRequest,
  getGoodsClassRequest,
  getOrderList,
  getLogisticsCompanyList,
  addOrderLogistics,
  refundAudit,
  getMerchantBusinessList,
  queryOrderReason,
  agentResetPassword,
  agentBalance,
  queryOrder,
  applyRefundMerchant,
  queryLogistic,
  agentRefuseBalance,
  cancelOrderMerchant,
  agentRenew,
  getExcel,
  addOrUpdateAgentRole,
  platGoodsList,
  getAdvanceOrderParamConfig,
  updateGoodsIssueStatus,
  addPlatTag,
  merchantGoodsList,
  updateGoodsAdWeights,
  updateGoodsGrabbedNumber,
  addClass,
  deleteClass,
  updateClass,
  sortClass,
  merchantGoodsAuditList,
  updateGoodsAuditStatus,
  getSlideShowByCategory,
  addBanner,
  searchGoodsByName,
  deleteBanner,
  updateBanner,
  sortBanner,
  memberList,
  plusMemberList,
  exchangeMemberStatus,
  memberDetail,
  plusMemberDetail,
  subtractUserAssets,
  allProfitsDistributionIdAndName,
  exchangeMemberRole,
  getWithdrawMoneyAuditList,
  queryPriceActivity,
  queryPriceActivityList,
  deleteActive,
  updatePriceActivityStatus,
  activityDetails,
  addOrUpdatePriceActivity,
  getMemberParamConfig,
  agentApprove,
  updateMemberParamConfig,
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
  getOfflineStoreList,
  deletelogistics,
  agentPassBalance,
  addLogisticsCompany,
  getAllCity,
  getAllCityData,
  getDistrictByCityId,
  modifyByDistrictId,
  getMerchantIncomeDetails,
  updateAdWeights,
  changeAuditStatus,
  resetPassword,
  getExportMerchantExcel,
  importMerchantForExcel,
  deleteMerchantById,
  getMerchantAuditListByWhereExcel,
  updateFastInstallmentConfig,
  findFastInstallmentConfig,
  queryTobeShippedOrderGoods,
  importLogisticsExcel,
  getLogisticsExcelTemplet,
  updateOrderAddress,
  setPage,
  queryPage,
  delFile,
  addStock,
  getStock,
  getUserTransferAuditList,
  getUserTransferAuditListBankCard,
  auditPassedBankCard,
  getBankCardInfo,
  getUserTransferAuditListBankCardExcel,
  addOrUpdateServiceMoney,
  queryServiceMoney,
  findVideoByType,
  deleteVideo,
  addOrUpdateVideo,
  findNoticeSet,
  updateNoticeSet,
  queryPageList,
  updateOrderNumber,
  updateIssueStatus,
  updateVideoIsTop,
  addProduct,
  queryPlatAndMerchantGoodsList,
  wishQueryPageList,
  wishQueryDetail,
  matchedGoods,
  exportWishGoodsExcel,
  getAgentParamConfig,
  updateAgentParamConfig,
  getMerchantParamConfig,
  queryGoodsQRCode,
  diamondMemberList,
  diamondMemberDetail,
  deleteGoods,
  updateSeedParamConfig,
  getSeedParamConfig,
  findPageListNotice,
  findDetailNotice,
  addOrUpdateNotice,
  removeNotice,
  findNavigation,
  updateOrderNoNavigation,
  updateStatusNavigation,
  removeNavigation,
  findDetailNavigation,
  addOrUpdateNavigation,
  findSystemPageListNavigation,
  agentRefuse
}
