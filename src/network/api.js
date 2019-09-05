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

const getExcel = ids => request.get('/order/getMerchantAuditListExcel', {params: {ids}, responseType: 'blob'}) // 导出excel
const getMerchantAuditListByWhereExcel = p => request.get('/order/getMerchantAuditListByWhereExcel', {params: p,responseType: 'blob'}) // 订单管理-导出全部查询结果订单信息Excel

//导入物流信息接口
const importLogisticsExcel = p => request.post('/order/importLogisticsExcel', p) // 商户管理-获取导入商家Excel模板
// const importLogisticsExcel = p => request.post('/order/importLogisticsExcel', {responseType: 'blob'}) // 商户管理-获取导入商家Excel模板
// const importMerchantForExcel = p => request.post('/excel/importMerchantForExcel', p) // 商户管理-获取导入商家Excel模板
//导入物流信息接口



// dupeng
const getDashboard = p => request.get('/dashboard/getDashboard', p) // 获取首页仪表盘信息


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
const getExportMerchantExcel = p => request.get('/excel/getExportMerchantExcel', {responseType: 'blob'}) // 商户管理-获取导入商家Excel模板
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
const subtractUserAssets = p => request.post('/member/subtractUserAssets', p) // 减少用户资产
const exchangeMemberRole = p => request.post('/member/exchangeMemberRole', p) // 用户管理-更新用户身份
const getWithdrawMoneyAuditList = p => request.get('/member/getWithdrawMoneyAuditList', p) // 用户管理-获取所有的奖励金数据
const auditPassedById = p => request.put('/userTradeRecord/auditPassedById', p) // 提现申请审核通过




// 规则配置模块
const allProfitsDistributionIdAndName = p => request.get('/paramConfig/allProfitsDistributionIdAndName', p) // 拉取所有利润分成列表(第一个为默认分成规则)
const getMemberParamConfig = p => request.get('/paramConfig/getMemberParamConfig', p) // 会员规则设置-获取会员规则设置
const getProfitsDistributions = p => request.get('/paramConfig/getProfitsDistributions', p) // 利润分成设置-获取利润分成设置
const updateMemberParamConfig = p => request.post('/paramConfig/updateMemberParamConfig', p) // 会员规则设置-修改会员规则设置
const updateMerchantParamConfig = p => request.post('/paramConfig/updateMerchantParamConfig', p) // 商家规则设置-商家入驻要求
const modifyProfitsDistribution = p => request.post('/paramConfig/modifyProfitsDistribution', p) // 利润分成设置-添加/修改利润分成设置（有无ID区分）-->返回ID
const updateFastInstallmentConfig = p => request.post('/paramConfig/updateFastInstallmentConfig', p) // 快速分期购设置
const findFastInstallmentConfig = p => request.get('/paramConfig/findFastInstallmentConfig', p) // 快速分期购设置-获取设置




// 商品管理模块
const platGoodsList = p => request.get('/goodsControl/platGoodsList', p) // 商品管理-自营商品管理列表
const updateGoodsIssueStatus = p => request.post('/goodsControl/updateGoodsIssueStatus', p) // 商品管理-更改商品上下架状态
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

// 营销管理模块
const getSlideShowByCategory = p => request.get('/slideShow/getSlideShowByCategory', p) // 首页轮播图-获取所有
const addBanner = p => request.post('/slideShow/add', p) // 新增一条轮播图数据-（from表单上传）
const deleteBanner = p => request.delete('/slideShow/deleteById', p) // 根据ID删除轮播图
const updateBanner = p => request.post('/slideShow/updateById', p) // 根据ID更新轮播图-（from表单上传）
const sortBanner = p => request.post('/slideShow/sortBySlideShowIds', p) // 修改分类排序
const searchGoodsByName = p => request.get('/goodsControl/searchGoodsByName', p) // 营销管理-轮播图管理-搜索商品关键字
const queryPriceActivity = p => request.get('/activity/queryPriceActivity', p) // 查询当前活动
const queryPriceActivityList = p => request.get('/activity/queryPriceActivityList', p) // 查询往期活动
const activityDetails = p => request.get('/activity/queryPriceActivityById', p) // 查询活动详情
const deleteActive = p => request.delete('/activity/deleteById', p) // 根据ID删除活动
const updatePriceActivityStatus = p => request.post('/activity/updatePriceActivityStatus', p) // 修改活动状态
const addOrUpdatePriceActivity = p => request.post('/activity/addOrUpdatePriceActivity', p) // 添加or修改活动

// 系统管理
const getLogisticsCompanyList = () => request.get('/logisticsCompany/getLogisticsCompanyList') // 获取所有可用的物流信息
const deletelogistics = p => request.delete('/logisticsCompany/deleteById', p) // 根据ID删除物流信息
const addLogisticsCompany = p => request.post('/logisticsCompany/addLogisticsCompany', p) // 新增一条数据
const getAllCity = p => request.get('/city/getAllCity', p) // 获取所有的城市数据
const getDistrictByCityId = p => request.get('/city/getDistrictByCityId', p) // 根据城市ID获取区数据
const modifyByDistrictId = p => request.post('/city/modifyByDistrictId', p) // 修改添加区操作-->返回ID


export {
  getDashboard,
  getAllUnexpectedIncome,
  userLoginRequest,
  addGoodsRequest,
  upDataGoodsRequest,
  queryGoodsDetailRequest,
  queryofflineGoodsDetail,
  getBusinessOptionsRequest,
  getGoodsClassRequest,
  getOrderList,
  getLogisticsCompanyList,
  addOrderLogistics,
  refundAudit,
  getMerchantBusinessList,
  queryOrderReason,
  queryOrder,
  applyRefundMerchant,
  queryLogistics,
  cancelOrderMerchant,
  getExcel,
  platGoodsList,
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
  updateMemberParamConfig,
  updateMerchantParamConfig,
  getProfitsDistributions,
  modifyProfitsDistribution,
  getUserRechargeRecord,
  auditPassedById,
  getMerchantAuditList,
  getMerchantAuditListExcel,
  getMerchantDetails,
  getOnlineStoreList,
  getOfflineStoreList,
  deletelogistics,
  addLogisticsCompany,
  getAllCity,
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
  importLogisticsExcel
}
