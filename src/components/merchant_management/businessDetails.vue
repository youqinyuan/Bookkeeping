<template>
    <div class="contents">   
        <div class="title">
            <strong>基本信息:</strong>
        </div>
        <div class="con">
            <ul>
                <li>申请编号：{{content.id}}</li>
                <li>姓名：{{content.name}}</li>
                <li>联系方式：{{content.mobileNumber}}</li>
                <li>店铺名称：{{content.storeName}}</li>
            </ul>
            <ul>
                <li>身份证：{{content.idNumber}}</li>
                <li>分类：{{content.businessName}}</li>
                <li>店铺所在位置：{{content.addressDetail}}</li>
                <li>店铺平均折扣：{{content.onlineRebate}}</li>
            </ul>
            <ul>
                <li>所属代理商：{{content.agentName}}</li>
                <li>来源：{{content.source}}</li>
            </ul>
        </div>  
        <div class="title">
            <strong>营业执照:</strong>
        </div>
        <div>
            <el-image style="width: 200px; height: 100px;margin:20px 0" :src="content.businessLicenseKey" fit="contain"></el-image>
        </div>
        <div class="title">
            <strong>营收记录:</strong>
        </div>
        <div class="table_con">
            <div class="table">
                <div class="top">
                    <span>线上营收：{{IncomeON}}元(总计：{{totalON}}条)</span>
                    <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    @current-change="handleCurrentChangeON"
                    :page-size="10"
                    :total="totalON"></el-pagination>                    
                </div>
                <el-table
                    border
                    :data="tableDataON"
                    style="width: 100%">
                    <el-table-column
                        prop="createTime"
                        label="入账时间"
                        align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="购买用户"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="goodsName"
                        label="商品"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="gainAmount"
                        label="收入金额"
                        align="center">
                    </el-table-column>
                </el-table>
            </div>  
            <div class="table">
                <div class="top">
                    <span>线下营收：{{IncomeOff}}元(总计：{{totalOff}}条)</span>
                    <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    @current-change="handleCurrentChangeOff"
                    :page-size="10"
                    :total="totalOff"></el-pagination>                    
                </div>
                <el-table
                    :data="tableDataOff"
                    border
                    style="width: 100%">
                     <el-table-column
                        prop="createTime"
                        label="入账时间"
                        align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nickname"
                        label="购买用户"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="categoryName"
                        label="商品分类"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="rebate"
                        label="折扣"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="gainAmount"
                        label="收入金额"
                        align="center">
                    </el-table-column>
                </el-table>
            </div>  
        </div>
        <div class="title">
            <strong>冻结/流失历史:</strong>
        </div>
        <div class="details">
            <span v-if="history.length == 0">暂无记录</span>
            <ul v-if="history.length > 0">
                <li v-for="(item,index) in content.records" :key="index">
                    <span>
                        {{item.createTime | dateFormat}} {{item.status | merchantHistoryStatus}} 
                        <span v-if="item.status != 2">
                            原因：{{item.remark}}
                        </span>
                        
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getMerchantDetails,getMerchantIncomeDetails} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            content:{},
            history:[],
            tableDataON:[],
            tableDataOff:[],
            IncomeON:0,
            IncomeOff:0,
            totalON:0,
            totalOff:0
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
        this.getMerchantDetails()
        this.getOnData(1)
        this.getOffData(1)
    },
    methods: {
        getMerchantDetails(){
            let parms = {
                id:this.$route.query.id
            }
            getMerchantDetails({params:parms}).then(res=>{
                if(res.data.content){
                    this.content = res.data.content
                    this.history = res.data.content.records
                }else{
                    this.content = {}
                }
            })
        },
        handleCurrentChangeON(val){
            this.getOnData(val)
        },
        handleCurrentChangeOff(val){
            this.getOffData(val)
        },

        getOnData(val){
            let obj = {
                pageNumber:val,
                pageSize:10,
                merchantId:this.$route.query.id,
                goodsType:1
            }
            getMerchantIncomeDetails({params:obj}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.tableDataON = res.data.content.items.items
                    this.totalON = res.data.content.items.totalSize
                    this.IncomeON = res.data.content.totalIncome
                }
            })
        },
        getOffData(val){
            let obj = {
                pageNumber:val,
                pageSize:10,
                merchantId:this.$route.query.id,
                goodsType:2
            }
            getMerchantIncomeDetails({params:obj}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.tableDataOff = res.data.content.items.items
                    this.totalOff = res.data.content.items.totalSize
                    this.IncomeOff = res.data.content.totalIncome
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .title{
        border-bottom: 1px solid #cccccc;
    }
    .con{
        display: flex;
        flex-wrap: wrap;
        ul{
            width: 350px;
            li{
                margin: 20px 0;
            }
        }
    }
    .table_con{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 20px;
        .table{
            width: 600px;
            .top{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 20px 0;
            }
        }
    }
    .details{
        margin-top: 20px;
        li{
            margin-top: 15px;
        }
    }
</style>
