<template>
    <div class="contents">
        <div>
            <strong>活动基本信息</strong>
            <div class="bor_box">
                <div>
                    <span>活动名称：<strong>{{content.name}}</strong></span>
                    <span>活动时间：{{content.startTime | dateFormat}}至{{content.endTime | dateFormat}}</span>
                    <span style="font-size:25px;color:#cccccc"><strong>{{content.status | activeStatus}}</strong></span>
                </div>
                <div>
                    <ul>
                        <li v-for="(item,index) in content.item" :key="index">
                            <span>商品：{{item.goodsName}}+【{{item.spcDesc}}】</span>
                            <span>库存：{{item.stock}}</span>
                            <span>原价：{{item.orgPrice}}元</span>
                            <span>邮费：{{item.expressFee}}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <span>购买{{content.purchasePrice}}元返{{content.cashBack}}元</span>
                </div>
                <div>
                    <span>拉新人数：{{content.lachineNumber}}人</span>
                </div>
                <div>
                    <span>领取人数：{{content.receiveNumber}}人</span>
                </div>
                <div>
                    <span>总计花费成本：{{content.totalCost}}元</span>
                </div>
            </div>
        </div>

        <div>
            <strong>{{content.name}}商品信息</strong>
            <div class="bor_box">
                <ul>
                    <li v-for="(item,index) in content.item" :key="index">
                        <span>商品：{{item.goodsName}}+【{{item.spcDesc}}】</span>
                        <span>领取：{{item.receiveNumber}}人</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {activityDetails} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            content:{}
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
        this.getactivityDetails()
    },
    methods: {
        getactivityDetails(){
            let parms = {
                id:this.$route.query.id
            }
            activityDetails({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.content = res.data.content
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .contents{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .bor_box{
            width: auto;
            border: 1px solid black;
            padding: 20px;
            margin:20px 0;
            div{
                margin-bottom: 20px;
            }
            span{
                margin-right: 30px;
            }
            li{
                margin-top: 20px;
            }
        }
    }
</style>
