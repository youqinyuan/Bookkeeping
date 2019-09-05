<template>
    <div class="contents">
        <div class="common">
            <div class="title">基本信息:</div>
            <div class="content">
                    <ul>
                        <li>会员编号：{{content.id}}</li>
                        <li>电话：{{content.mobileNumber}}</li>
                        <li>收货信息：</li>
                        <li v-for="(item,index) in content.addressBooks" :key="index">所在地区：{{item.cityName}}-{{item.districtName}},详细地址：{{item.detailedAddress}}</li>
                    </ul>

                    <ul>
                        <li>昵称：{{content.nickname}}</li>
                        <li>成为plus会员时间：{{content.openTime | dateFormat}}</li>
                    </ul>

                    <ul>
                        <li>钱包余额：{{content.balance}}</li>
                        <li>到期时间：{{content.expireTime | dateFormat}}</li>
                    </ul>

                    <ul>
                       <li>性别：{{content.gender == 1?'男':'女'}}</li>
                       <li>注册来源：{{content.registrySource | registrySource}}(注册的渠道)</li>
                    </ul>
            </div>
        </div>

        <div class="common">
            <div class="title">业绩收益:</div>
            <div class="content">
                   <div class="shouyi_top">
                       <span>邀请好友数量：{{content.count}}</span>
                       <span>总计收益：{{content.incomeAmount}}元</span>
                       <span>提现金额：{{content.withdrawalAmount}}元</span>
                       <span>佣金余额：{{content.commissionBalance}}元</span>
                   </div>

                   <div class="table_content">
                       <div class="table_top">
                           <span>线上收益记录表（正利润）：(总计:{{onlinetotalSizeSY}}条)</span>
                           <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="onlinetotalSizeSY"
                            :page-size="10"
                            @current-change="pageChangeOnlineSY($event)"
                            ></el-pagination>                            
                       </div>
                        <el-table
                        :data="onlinetableDataSY"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="createTime"
                                label="到账时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.createTime | dateFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="storeName"
                                label="商户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="nickname"
                                label="用户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="goodsName"
                                label="商品"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="buyAmount"
                                label="用户消费金额"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="gainAmount"
                                label="获得收益"
                                align="center">
                            </el-table-column>
                        </el-table>

                        <div class="table_top">
                           <span>线上收益记录表（无利润/负利润）：(总计:{{onlinetotalSizeFSY}}条)</span>
                           <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="onlinetotalSizeFSY"
                            :page-size="10"
                            @current-change="pageChangeOnlineFSY($event)"
                            ></el-pagination>                            
                       </div>
                        <el-table
                        :data="onlinetableDataFSY"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="createTime"
                                label="到账时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.createTime | dateFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="storeName"
                                label="商户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="nickname"
                                label="用户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="goodsName"
                                label="商品"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="buyAmount"
                                label="用户消费金额"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="gainAmount"
                                label="获得收益"
                                align="center">
                            </el-table-column>
                        </el-table>   


                       <div class="table_top">
                           <span>线下收益记录表：(总计:{{offlinetotalSizeSY}}条)</span>
                           <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="offlinetotalSizeSY"
                            :page-size="10"
                            @current-change="pageChangeOfflineSY($event)"
                            ></el-pagination>                            
                       </div>
                        <el-table
                        :data="offlinetableDataSY"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="createTime"
                                label="到账时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.createTime | dateFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="storeName"
                                label="商户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="nickname"
                                label="用户"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="categoryName"
                                label="商品分类"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="buyAmount"
                                label="用户消费金额"
                                align="center">
                            </el-table-column>
                            <el-table-column
                                prop="gainAmount"
                                label="获得收益"
                                align="center">
                            </el-table-column>
                        </el-table>                                             
                   </div>
            </div>
        </div>  

        <div class="common">
            <div class="title">消费信息:</div>
            <div class="content">
                    <div class="xiaofei_table">
                        <div class="top">
                            <span>线上消费：{{content.onlineConsumeSum}}元 (总计：{{onlinetotalSizeXF}}条)</span>
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="onlinetotalSizeXF"
                                :page-size="10"
                                @current-change="pageChangeOnlineXF($event)"
                            ></el-pagination>                            
                        </div>
                         <el-table
                        :data="onlinetableDataXF"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="time"
                                label="下单时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.time | dateFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="storeName"
                                label="商家"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="goodsName"
                                label="购买商品"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="消费金额"
                                align="center">
                            </el-table-column>
                        </el-table> 
                    </div>


                    <div class="xiaofei_table">
                        <div class="top">
                            <span>线下消费：{{content.offlineConsumeSum}}元 (总计：{{offlinetotalSizeXF}}条)</span>
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="offlinetotalSizeXF"
                                :page-size="10"
                                @current-change="pageChangeOfflineXF($event)"
                            ></el-pagination>
                        </div>
                         <el-table
                        :data="offlinetableDataXF"
                        border
                        style="width: 100%">
                            <el-table-column
                                prop="time"
                                label="消费时间"
                                align="center">
                                <template slot-scope="scope">
                                    {{scope.row.time | dateFormat}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="storeName"
                                label="商家"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="categoryName"
                                label="商品分类"
                                align="center"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="消费金额"
                                align="center">
                            </el-table-column>
                        </el-table>                        
                    </div>
            </div>
        </div> 

        <div class="common">
            <div class="title">冻结历史:</div>
            <div class="freeze">
                <ul>
                    <li v-for="(item,index) in content.freezeRecords" :key="index">{{item.createTime | dateFormat}},{{item.status == 1?'解冻':'冻结'}}
                        <span v-if="item.remark">,原因:{{item.remark}}</span>
                    </li>
                </ul>
            </div>
        </div> 
    </div>
</template>

<script>
import {plusMemberDetail} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            content:{},
            onlinetableDataSY:[],
            onlinetotalSizeSY:0,
            onlinetableDataFSY:[],
            onlinetotalSizeFSY:0,
            offlinetableDataSY:[],
            offlinetotalSizeSY:0,
            onlinetableDataXF:[],
            onlinetotalSizeXF:0,
            offlinetableDataXF:[],
            offlinetotalSizeXF:0

        };  
    },
    components: {

    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.getplusMemberDetail()
        this.getOnlineSY(1)
        this.getOnlineFSY(1)
        this.getOfflineSY(1)
        this.getOnlineXF(1)
        this.getOfflineXF(1)
    },
    methods: {
        // 获取所有
        getplusMemberDetail(){
            let parms = {
                pageSize:10,
                pageNumber:1,
                id:this.$route.query.id,
                flag:1
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.content = res.data.content;
                } else {
                    this.content = {}
                }
            })
        },

        // 获取线上收益 (正利润)
        getOnlineSY(val){
            let parms = {
                pageSize:10,
                pageNumber:val,
                id:this.$route.query.id,
                flag:4
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.onlinetableDataSY = res.data.content.onlineProfitIncomeItems.items;
                    this.onlinetotalSizeSY = res.data.content.onlineProfitIncomeItems.totalSize;
                } else {
                    this.onlinetableDataSY = []
                }
            })
        },

        // 获取线上收益 (无利润或负利润)
        getOnlineFSY(val){
            let parms = {
                pageSize:10,
                pageNumber:val,
                id:this.$route.query.id,
                flag:5
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.onlinetableDataFSY = res.data.content.onlineLossIncomeItems.items;
                    this.onlinetotalSizeFSY = res.data.content.onlineLossIncomeItems.totalSize;
                } else {
                    this.onlinetableDataFSY = []
                }
            })
        },


        // 获取线下收益
        getOfflineSY(val){
            let parms = {
                pageSize:10,
                pageNumber:val,
                id:this.$route.query.id,
                flag:6
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.offlinetableDataSY = res.data.content.offlineIncomeItems.items;
                    this.offlinetotalSizeSY = res.data.content.offlineIncomeItems.totalSize;
                } else {
                    this.offlinetableDataSY = []
                }
            })
        },

        // 获取线上消费
        getOnlineXF(val){
            let parms = {
                pageSize:10,
                pageNumber:val,
                id:this.$route.query.id,
                flag:2
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.onlinetableDataXF = res.data.content.onlineConsumeItems.items;
                    this.onlinetotalSizeXF = res.data.content.onlineConsumeItems.totalSize;
                } else {
                    this.onlinetableDataXF = []
                }
            })
        },

        // 获取线下消费
        getOfflineXF(val){
            let parms = {
                pageSize:10,
                pageNumber:val,
                id:this.$route.query.id,
                flag:3
            }
            plusMemberDetail({params: parms}).then(res=>{
                if (res.data.messageCode == "MSG_1001") {
                    this.offlinetableDataXF = res.data.content.offlineConsumeItems.items;
                    this.offlinetotalSizeXF = res.data.content.offlineConsumeItems.totalSize;
                } else {
                    this.offlinetableDataXF = []
                }
            })
        },

        pageChangeOnlineSY(val){
            this.getOnlineSY(val)
        },

        pageChangeOnlineFSY(val){
            this.getOnlineFSY(val)
        },

        pageChangeOfflineSY(val){
            this.getOfflineSY(val)
        },

        pageChangeOnlineXF(val){
            this.getOnlineXF(val)
        },
        pageChangeOfflineXF(val){
            this.getOfflineXF(val)
        }
    },
};
</script>

<style scoped lang="less">
    .common{
        margin-bottom: 30px;
        .title{
            border-bottom: 1px solid #cccccc;
            font-size: 18px;
            font-weight: bold;
        }
        .content{
            width: 90%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .shouyi_top{
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin-top: 20px;
            }
            li{
                margin-top: 20px;
            }
        }  
        .table_content{
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .table_top{
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin: 20px 0
            }
        } 
        .xiaofei_table{
            width: 500px;
            .top{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 20px 0
            }
        } 
        .freeze{
            li{
                margin-top: 20px;
            }
        }           
    }
</style>
