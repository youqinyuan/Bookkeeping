let dateFormat = time => { // 全局时间过滤-精确到秒
  let date = new Date(time)
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

// 订单类型
let orderType = val => {
  if (val == 0 || val == 1) {
    return '正常购买'
  } else if (val == 3) {
    return '新人免费体验订单'
  } else if (val == 4) {
    return '信用卡用户免费领订单'
  } else if (val == 5) {
    return '渠道合作活动订单'
  } else if (val == 6) {
    return 'FreeBuy活动订单'
  } else if (val == 7) {
    return 'FreeBuy订单'
  } else if (val == 8) {
    return '线下-普通订单'
  } else if (val == 9) {
    return '线下-FreeBuy订单'
  } else if (val == 10) {
    return 'FreeBuy转正常购买'
  } else if (val == 11) {
    return '钻石合伙人订单'
  } else if (val == 12) {
    return '爱心捐助订单'
  } else if (val == 13) {
    return '好友赞助订单'
  } else if (val == 14) {
    return '一折购赞助订单'
  } else if (val == 15) {
    return '线上新人专区订单'
  } else if (val == 16) {
    return '线下新人专区订单'
  } else if (val == 17) {
    return '线上商品活动订单'
  } else if (val == 18) {
    return '线下商品活动订单'
  } else if (val == 19) {
    return '线上商品活动-一折购订单'
  } else if (val == 20) {
    return '线下商品活动-一折购订单'
  } else if (val == 21) {
    return '预售订单'
  } else if (val == 22) {
    return '商品预售订单'
  } else if (val == 23) {
    return '线下商家-普通购买订单'
  } else if (val == 24) {
    return '线下商家-一折购订单'
  } else if (val == 26) {
    return '闪付订单'
  } else if (val == 27) {
    return '一折购分期订单'
  } else if (val == 28) {
    return '普通拼团订单'
  } else if (val == 29) {
    return '一折购拼团订单'
  } else if (val == 30) {
    return '自定义活动'
  }
}

let registrySource = val => { // 注册的来源
  if (val === 1) {
    return 'Android'
  } else if (val === 2) {
    return '小程序'
  } else if (val === 3) {
    return 'H5'
  } else if (val === 4) {
    return 'IOS'
  } else {
    return '未知'
  }
}

let postType = val => { // 贴子种类
  if (val === 1) {
    return '普通贴'
  } else if (val === 2) {
    return '返现卖贴'
  } else if (val === 3) {
    return '返现买贴'
  } else if (val === 4) {
    return '预售订单'
  } else if (val === 5) {
    return '商品卖贴'
  } else if (val === 6) {
    return '商品买贴'
  } else if (val === 7) {
    return '提期贴'
  } else {
    return '未知'
  }
}

let postStatus = val => { // 贴子状态
  if (val === 1) {
    return '草稿'
  } else if (val === 2) {
    return '已发布(未交易)'
  } else if (val === 3) {
    return '已卖出(交易完成)'
  } else if (val === 4) {
    return '金额已变更'
  } else if (val === 5) {
    return '已过期'
  } else if (val === 6) {
    return '已预订(交易中)'
  } else if (val === 7) {
    return '自行关闭交易（已撤销）'
  } else if (val === 8) {
    return '未付款交易关闭'
  } else if (val === 9) {
    return '超时未支付关闭交易'
  } else {
    return '未知'
  }
}


let activeStatus = val => { // 活动的状态
  if (val === 1) {
    return '未开始'
  } else if (val === 2) {
    return '进行中'
  } else if (val === 3) {
    return '中断'
  } else if (val === 4) {
    return '已结束'
  } else {
    return '未知'
  }
}
let plusSet = val => { // plus规则设置
  if (val === "ORDERS_COUNT") {
    return '下单次数大于等于'
  } else if (val === "INVITEES_COUNT") {
    return '邀请好友，好友个数超过'
  } else if (val === "RECHARGE_AMOUNT") {
    return '累计充值金额为'
  } else if (val === "ROYALTY_RATE") {
    return '会员费用提成百分比'
  } else if (val === "MIN_DISCOUNT_RATE") {
    return '最低优惠百分比'
  } else if (val === "MAX_GOODS_QUANTITY") {
    return '最大爆品数量'
  } else if (val === "MIN_AMOUNT") {
    return '单次充值最低金额'
  } else {
    return '未知'
  }
}
let rechargeWay = val => { // 充值的方式
  if (val == 1) {
    return '账户充值'
  } else if (val == 2) {
    return '账户提现'
  } else if (val == 3) {
    return '购买商品'
  } else if (val == 4) {
    return '开通会员'
  } else if (val == 5) {
    return '佣金到帐'
  } else if (val == 31) {
    return '邀请新用户注册获得佣金'
  } else if (val == 32) {
    return '用户消费获得佣金'
  } else if (val == 33) {
    return '佣金提现到余额'
  } else {
    return '未知'
  }
}

let merchantHistoryStatus = val => { // 商户冻结/解冻状态
  if (val == 1) {
    return '冻结'
  } else if (val == 2) {
    return '解冻'
  } else if (val == 3) {
    return '流失'
  } else {
    return '未知'
  }
}



export {
  dateFormat,
  orderType,
  registrySource,
  postType,
  postStatus,
  activeStatus,
  plusSet,
  rechargeWay,
  merchantHistoryStatus
}
