import request from './config'

const userLoginRequest = p => request.post('/accounts/login', p) // 登录
const addGoodsRequest = p => request.post('/goodsControl/addGoods', p) // 添加商品（电商/自营商品）
const upDataGoodsRequest = p => request.post('/goodsControl/updateGoods', p) // 修改商品-（电商/自营商品）
const queryGoodsDetailRequest = p => request.get('/goodsControl/onlineGoodsDetail', p) // 查询商品详情(电商/自营)
const queryofflineGoodsDetail = p => request.get('/goodsControl/offlineGoodsDetail', p) // 查询商品详情(非电商)
const getBusinessOptionsRequest = p => request.get('/merchant/manage/allMerchantIdAndName', p) // 拉取所有商户列表（正常运营的非自营商户）
const getGoodsClassRequest = p => request.get('/goodsCategory/getAllGoodsCategory', p) // 获取商品分类
const getOrderList = orderList => request.get(`/order/queryOperateOrderList`, orderList) // 获取订单列表
const getLogisticsCompanyList = () => request.get('/logisticsCompany/getLogisticsCompanyList') // 获取物流公司列表
const addOrderLogistics = p => request.post('/order/addOrderLogistics', p) // 订单添加物流信息
const refundAudit = p => request.post('/order/refundAudit', p) // 审核退款
const getMerchantBusinessList = () => request.get('/merchant/getMerchantBusinessList') // 获取行业分类列表
const queryOrderReason = p => request.get(`/order/queryOrderReason${p}`) // 查询退款或拒绝原因
const queryOrder = p => request.get(`/order/queryOrder${p}`) // 查询订单详情
const applyRefundMerchant = p => request.post('/order/applyRefundMerchant', p) // 申请退款
const queryLogistics = p => request.get(`/order/queryLogistics${p}`) // 查询物流信息
const cancelOrderMerchant = p => request.post('/order/cancelOrderMerchant', p) // 取消订单
const getExcel = ids => request.get('/order/getMerchantAuditListExcel', {params: {ids}, responseType: 'blob'}) // 导出excel

// dupeng
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

export {
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
  updateGoodsAuditStatus
}
