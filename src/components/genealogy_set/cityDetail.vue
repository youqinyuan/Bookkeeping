<template>
    <div class="contents">
        <el-button type="primary" @click="add">添加区域</el-button>
        <ul>
            <li v-for="(item,index) in districtDetail" :key="index">
                <strong>{{item.name}}</strong>
                <span class="con">代理数量：{{item.agentsCount== null?0:item.agentsCount}}</span>
                <span class="con">商家数量：{{item.merchantCount == null?0:item.merchantCount}}</span>
                <span class="xg" @click="modify(item)">修改</span>
            </li>
        </ul>

        <addDistrictPop ref="district"></addDistrictPop>
    </div>
</template>

<script>
import {getDistrictByCityId} from '@/network/api'
import addDistrictPop from './common/addDistrictPop'
export default {
    props: {

    },
    data() {
        return {
            districtDetail:[]
        };
    },
    components: {
        addDistrictPop
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.getDistrictByCityId()
    },
    methods: {
        getDistrictByCityId(){
            let parms = {
                cityId:this.$route.query.id
            }
            getDistrictByCityId({params:parms}).then(res=>{
                if(res.data.content){
                    this.districtDetail = res.data.content
                }else{
                    this.districtDetail = []
                }
            })
        },
        add(){
            this.$refs.district.open("添加区域")
        },
        modify(item){
            this.$refs.district.open("修改区域",item)
        }
    },
};
</script>

<style scoped lang="less">
    li{
        width: 100%;
        height: 50px;
        border: 1px solid black;
        margin-top: 30px;
        line-height: 50px;
        padding: 0 20px;
        .con{
            margin-left: 40px;
        }
        .xg{
            float: right;
            color: #169BD5;
            cursor: pointer;
        }
    }
</style>
