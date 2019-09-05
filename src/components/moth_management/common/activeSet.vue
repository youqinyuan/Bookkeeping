<template>
    <div>
        <div class="bor_content">
            <span>活动名称：<strong>0元购</strong></span>
            <el-button style="margin-left:200px" type="primary" @click="goAdd">添加活动</el-button>
        </div>

        <div class="bor_content" v-if="content">
            <div>
                <span>活动名称：<strong>{{content.name}}</strong></span>
                <span>活动时间：{{content.startTime | dateFormat}}至{{content.endTime | dateFormat}}</span>
                <span style="font-size:25px;color:#cccccc"><strong>{{content.status | activeStatus}}</strong></span>
            </div>
            <div>
                <ul>
                    <li v-for="(item,index) in content.priceActivityGoodsList" :key="index">
                        <span>商品：{{item.goodsName}}</span>
                        <span>邮费：{{item.expressFee}}元</span>
                        <span>返现：{{item.cashBack}}元/{{item.period}}期</span>

                        <div v-for="(ite,inx) in item.priceActivityGoodsStockList" :key="inx" class="guige">
                            <span>规格名：{{ite.spcDesc}}</span>
                            <span>库存：{{ite.stock}}</span>
                            <span>原价：{{ite.orgPrice}}</span>
                            <span>领取人数：{{ite.receiveNumber}}</span>
                        </div>
                    </li>
                </ul>
            </div>
           
            <!-- <div>
                <span>H5页面链接：{{url}}<span style="color:#169BD5;cursor: pointer;margin-left:10px" v-clipboard:copy="url" v-clipboard:success="onCopyUrl" v-clipboard:error="onErrorUrl">复制链接</span></span>
            </div> -->

            <div>
                <!-- <el-button type="primary" @click="revise(content)">修改活动</el-button> -->
                <div v-if="content.status == 1">
                    <el-button type="primary" @click="revise(content)">修改活动</el-button>
                    <el-button type="danger" @click="deleteActive(content.id)">删除活动</el-button>
                </div>
                <div v-if="content.status == 2">
                    <el-button type="primary" @click="goDetails(content.id)">查看详情</el-button>
                    <el-button type="danger" @click="breakActive(content.id)">中断活动</el-button>
                </div>
                <div v-if="content.status == 3">
                    <el-button type="primary" @click="goOnActive(content.id)">活动继续</el-button>
                    <el-button type="danger" @click="finishActive(content.id)">活动结束</el-button>
                </div>
                <div v-if="content.status == 4">
                    <el-button type="primary" @click="goDetails(content.id)">查看详情</el-button>
                    <el-button type="success">添加活动</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {queryPriceActivity,updatePriceActivityStatus,deleteActive} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            content:{},
            url:"www.baidu.com"
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
        this.getqueryPriceActivity()
    },
    methods: {
        getqueryPriceActivity(){
            queryPriceActivity().then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.content = res.data.content
                }
            })
        },
        onCopyUrl(){
            this.$message.success("复制成功!");
        },
        onErrorUrl(){
            this.$message.error("复制失败!");
        },

        // 修改活动
        revise(content){
            this.$router.push({
                path:'/addActive',
                query:{
                    type:2
                }
            })
            this.$store.commit('changeDetails',content);
        },

        // 查看详情
        goDetails(id){
            // this.$router.push({
            //     path:'/activeDetails',
            //     query:{
            //         id:id
            //     }
            // })
        },

        // 添加活动
        goAdd(){
            this.$router.push({
                path:'/addActive'
            })
        },

        // 删除活动
        deleteActive(id){
            this.$confirm('', '删除活动？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                deleteActive({params:{id:id}}).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success('删除成功')
                        this.getqueryPriceActivity()
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
                }).catch(() => {         
            });
        },

        // 中断活动
        breakActive(id){
            this.$confirm('活动中断后，可能影响最终的运营成果，确定中断？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
                center:true
            }).then(() => {
                let parms = {
                    id:id,
                    status:3
                }
                updatePriceActivityStatus(parms).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success('中断成功')
                        this.getqueryPriceActivity()
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
                }).catch(() => {         
            });
        },
        
        // 活动继续
        goOnActive(id){
            this.$confirm('', '确定活动继续？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                let parms = {
                    id:id,
                    status:2
                }
                updatePriceActivityStatus(parms).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success('继续成功')
                        this.getqueryPriceActivity()
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
                }).catch(() => {         
            });
        },

        // 活动结束
        finishActive(id){
            this.$confirm('', '确定活动结束？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                let parms = {
                    id:id,
                    status:4
                }
                updatePriceActivityStatus(parms).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success('结束成功')
                        this.getqueryPriceActivity()
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
                }).catch(() => {         
            });
        }
    },
};
</script>

<style scoped lang="less">
    .bor_content{
        border: 1px solid black;
        padding: 10px;
        margin-bottom: 10px;
        div{
            margin-bottom: 20px;
        }
        .guige{
            margin-left: 25px;
            margin-top: 10px;
        }
        li{
            margin-top: 20px;
        }
        span{
            margin-right: 30px;
        }
    }
</style>
