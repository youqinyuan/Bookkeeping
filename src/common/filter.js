let dateFormat = time => { // 全局时间过滤
    let date   = new Date(time)
    let year   = date.getFullYear();
    let month  = date.getMonth()+1;
    let day    = date.getDate();
    let hour   = date.getHours(); 
    let minute = date.getMinutes(); 
    let second = date.getSeconds(); 
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}

let registrySource = val => {  // 注册的来源
    if(val === 1){
        return 'APP'
    }else if(val === 2){
        return '小程序'
    }else if(val === 3){
        return 'H5'
    }else if(val === 4){
        return '导入'
    }else{
        return '未知'
    }
}
let activeStatus = val => {  // 活动的状态
    if(val === 1){
        return '未开始'
    }else if(val === 2){
        return '进行中'
    }else if(val === 3){
        return '中断'
    }else if(val === 4){
        return '已结束'
    }else{
        return '未知'
    }
}
let plusSet = val => {    // plus规则设置
    if(val === "ORDERS_COUNT"){
        return '下单次数大于等于'
    }else if(val === "INVITEES_COUNT"){
        return '邀请好友，好友个数超过'
    }else if(val === "RECHARGE_AMOUNT"){
        return '累计充值金额为'
    }else if(val === "ROYALTY_RATE"){
        return '会员费用提成百分比'
    }else if(val === "MIN_DISCOUNT_RATE"){
        return '最低优惠百分比'
    }else if(val === "MAX_GOODS_QUANTITY"){
        return '最大爆品数量'
    }else if(val === "MIN_AMOUNT"){
        return '单次充值最低金额'
    }else{
        return '未知'
    }
}
let rechargeWay = val =>{ // 充值的方式
    if(val == 1){
        return '账户充值'
    }else if(val == 2){
        return '账户提现'
    }else if(val == 3){
        return '购买商品'
    }else if(val == 4){
        return '开通会员'
    }else if(val == 5){
        return '佣金到帐'
    }else if(val == 31){
        return '邀请新用户注册获得佣金'
    }else if(val == 32){
        return '用户消费获得佣金'
    }else if(val == 33){
        return '佣金提现到余额'
    }else{
        return '未知'
    }
}

let merchantHistoryStatus = val =>{ // 商户冻结/解冻状态
    if(val == 1){
        return '冻结'
    }else if(val == 2){
        return '解冻'
    }else if(val == 3){
        return '流失'
    }else{
        return '未知'
    }
}



export { 
    dateFormat,
    registrySource,
    activeStatus,
    plusSet,
    rechargeWay,
    merchantHistoryStatus
}