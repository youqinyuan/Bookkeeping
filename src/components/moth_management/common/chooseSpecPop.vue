<template>
    <div>
        <el-dialog
            title="选择商品规格"
            :visible.sync="DialogVisible"
            width="500px"
            center>
            <div class="info_top">
                <img :src="content.adImage" width="100" height="100" alt="">
                <div class="right">
                    <div>{{content.name}}</div>
                    <div>
                        价格：{{price}}
                    </div>
                </div>
            </div>

            <div class="info_bot">
                <span>请选择规格：</span>
                <ul>
                    <li ref="specName" v-for="(item,index) in specsList" :key="index" @click="clickSpecs(item.details,index)" :class="{active:cur===index}">
                        <span v-for="(itemName,index) in item.name" :key="index">{{itemName}}</span>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {queryGoodsDetailRequest} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            cur:0,
            price:"",
            DialogVisible:false,
            goodsId:"",
            parentIndex:"",
            content:{},
            specs:[],
            specsList:[]
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

    },
    methods: {
        open(goodsId,index){
            this.DialogVisible = true
            this.goodsId = goodsId
            this.parentIndex = index
            this.getqueryGoodsDetail(goodsId)
        },
        handleSpecs(data){
            let arr = []
            for(var i =0;i<data.length;i++){
                let result = data[i].items
                for(var j=0;j<result.length;j++){
                    arr.push(result[j])
                }
            }
            return arr
        },

        // 根据id返回对应规格名字
        backName(arr){
            for(var i = 0;i<this.specs.length;i++){
                for(var j = 0;j<arr.length;j++){
                    if(arr[j] == this.specs[i].id){
                        arr[j] = this.specs[i].name
                    }
                }
            }
            return arr
        },
        getqueryGoodsDetail(goodsId){
            let id = goodsId
            queryGoodsDetailRequest({params: {id}}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.content = res.data.content
                    this.specs = this.handleSpecs(res.data.content.specs)
                    this.stockDetail = res.data.content.stockDetail
                    let arr = []
                    for(var s in this.stockDetail){
                        let obj = {}
                        obj['id'] = s.split(',')
                        obj['name'] = this.backName(s.split(',')) 
                        obj['details'] = this.stockDetail[s]
                        arr.push(obj)
                    }
                    this.$nextTick(()=>{
                        this.specsList = arr
                        this.price = arr[0].details.orgPrice;
                        this.cur = 0
                        this.DialogVisible = true
                    })
                    
                }
            })
        },

        // 点击规格
        clickSpecs(details,index){
            this.price = details.orgPrice;
            this.cur = index
            details['expressFee'] = this.content.expressFee //将邮费放在这里以便传输
            if(this.$refs.specName){
                details['sepcName'] = this.$refs.specName[index].innerText //获取选中的规格文字以便展示
            }else{
                details['sepcName'] = ''
            }
            this.$emit('getgoodsSpec',details,this.parentIndex)
            this.DialogVisible = false
        }   
    },
};
</script>

<style scoped lang="less">
    .active{
        background: #00CD66;
        color: white;
    }
    .info_top{
        display: flex;
        .right{
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .info_bot{
        margin-top: 20px;
        ul{
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            li{
                width: auto;
                margin-right: 20px;
                margin-bottom: 15px;
                border: 1px solid #00CD66;
                cursor: pointer;
                padding: 8px;
            }
        }
    }
</style>
