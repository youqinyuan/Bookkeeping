<template>
    <div class="contents">
        <div class="details_content">
            <div class="titles">基本信息:</div>
            <div class="details">
                <div class="mar_bot">商品名称：{{details.name}}</div>
                <div class="mar_bot">分享描述：{{details.sharedDesc}}</div>
                <div class="goodsimg mar_bot">商品图片：
                    <el-image v-for="(item,index) in details.imageUrls" :key="index"
                    style="width: 50px; height: 50px;cursor: pointer;"
                    :src="item"
                    fit="contain"
                    @click="seebig(item)"></el-image>

                    <span style="margin-left:20px;color:#169BD5">点击任意图片图片可查看大图</span>
                </div>
                <div class="mar_bot">
                    <span>商品分类：{{$route.query.categoryName}}</span>
                    <span>快递费：{{details.expressFee==0||null?'包邮':details.expressFee}}</span>
                </div>
            </div>
        </div>

        <div class="details_content" v-show="RenderGoodsSpec.length > 0">
            <div class="titles">价格库存:</div>
            <div class="details">
                <div class="header">
                    <div v-for="(item,index) in details.specs" :key="index">{{item.name}}</div>
                    <div>原价</div>
                    <div>成本价</div>
                    <div>折扣</div>
                    <div>返现</div>
                    <div>销量</div>
                </div>

                <el-row type="flex" class="table_content">
                    <el-col
                        v-for="(item, index) in RenderGoodsSpec"
                        :key="index"
                        style="display: flex; flex-direction: column;"
                        >
                        <el-row
                            type="flex"
                            style="flex: 1; border-top: 1px solid #dddddd; border-left: 1px solid #dddddd; padding: 5px;"
                            v-for="(ite, dex) in item"
                            :key="dex">
                            <el-col style="display: flex; align-items: center">
                                <div>{{ ite }}</div>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col
                    v-for="(item, index) in 5"
                    :key="'item' + index"
                    >
                        <el-row
                            v-for="(ite, dex) in RenderGoodsSpec[RenderGoodsSpec.length - 1]"
                            :key="'item' + dex">
                            <el-col v-if="index < 5">
                                <el-input v-model="userInputSpecDetail[index][dex]" :disabled="true"></el-input>
                            </el-col>
                        </el-row>
                    </el-col>                    
                </el-row>
                
            </div>
        </div>

        <div class="details_content">
            <div class="titles">比价信息:</div>
            <div class="details">
                <div class="mar_bot">
                    <span v-for="(item,index) in details.competitorPrices" :key="index">{{item.mallName}}：{{item.price}}元</span>
                </div>
            </div>
        </div>

        <div class="details_content">
            <div class="titles">详情信息:</div>
            <div class="details">
                <div class="mar_bot" v-for="(item,index) in details.introductions" :key="index">
                    <span v-if="item.resourceType == 1">{{item.content}}</span>
                    <el-image
                    v-else
                    :src="item.content"
                    fit="contain"></el-image>
                </div>
            </div>
        </div>

        <bigImg v-show="showImg" @clickit="clickit" :imgSrc="imgSrc"></bigImg>  
    </div>
</template>

<script>
import {queryGoodsDetailRequest} from '@/network/api'
import bigImg from './common/bigImg.vue'
export default {
    props: {

    },
    data() {
        return {
            showImg:false,
            imgSrc:"",
            details:{},
            categoryName:"",
            // 商品规格
            goodsSpec: [
                {
                specName: '',
                specNum: ['']
                }
            ],
            RenderGoodsSpec: [], // 数据渲染-(商品规格)
            userInputSpecDetail:[]
        };
    },
    components: {
        bigImg
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.getDetails()
    },
    methods: {
        // 查看大图
        seebig(imgSrc){
            this.showImg = true
            this.imgSrc = imgSrc
        },
        clickit(){
            this.showImg = false;
        },
        // 获取详情
        getDetails () {
            let id = this.$route.query.id
            queryGoodsDetailRequest({params: {id}}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    let result = res.data.content
                    this.details = result
                    this.handleSpecs(result.specs) 
                    this.handleStockDetail(result.stockDetail)
                }else{
                    this.details = []
                }
                
            })
            
        },

        // handleSpecs(data,detail){
        //     let arr = []
        //     // let arrImg = []
        //     let copyData = JSON.parse(JSON.stringify(data))
        //     let tree = copyData.shift()
        //     let add = (father, arr) => {
        //         let next = arr.shift()
        //         if (!next) return
        //         for(let f1 of father.items) {
        //             f1.items = next
        //         }
        //         add(next, arr)
        //     }
        //     add(tree,copyData)
        //     this.goodsSpecs = tree
        // }

         // 深拷贝
        deepCopy (data) {
            let d = JSON.stringify(data)

            return JSON.parse(d)
        },
        // 处理接口返回规格数据
        handleSpecs (specs) {
            let arr = []
            let arrImg = []

            specs.map((item, index) => {
                arr.push({
                    specName: item.name,
                    specNum: []
                })

                item.items.map((ite, dex) => {
                arr[index].specNum.push(ite.name)
                    if (index === 0) {
                        if (ite.iconUrl !== null) {
                        arrImg.push({
                            key: ite.id,
                            url: ite.iconUrl
                        })
                        } else {
                        arrImg.push(null)
                        }
                    }
                })
            })

            this.goodsSpec = arr
            this.specImg = arrImg

            this.handleGoodsSpec()
        },
        // 处理商品规格数据-(确认规格)
        handleGoodsSpec () {
            let arr = []
            let keyArr = []
            let nowIndex = 0
            let len = this.goodsSpec.length

            this.goodsSpecTle = this.deepCopy(this.goodsSpec)
            this.specImgParam = this.deepCopy(this.specImg)

            if (len > 0) {

                arr.push(this.goodsSpec[0].specNum)

                for (let i = 0; i < arr[0].length; i++) {
                keyArr.push(i)
                }

                if (len === 1) {
                    this.recGoodsSpecDetail(arr)
                }

                if (len > 1) {
                    this.recGoodsSpec(nowIndex, arr, keyArr)
                }
            }
        },
        // 处理接口返回商品规格数据
        handleStockDetail (detail) {
            let index = 0
            let keyArr = Object.keys(detail).sort()
            for (let i = 0; i < keyArr.length; i++) {
                let item = keyArr[i]
                this.userInputSpecDetail[0][i] = detail[item].orgPrice
                this.userInputSpecDetail[1][i] = detail[item].dctPrice
                this.userInputSpecDetail[2][i] = detail[item].dctRate
                this.userInputSpecDetail[3][i] = detail[item].specCashBacks.length === 0?"":detail[item].specCashBacks[0].amount
                this.userInputSpecDetail[4][i] = detail[item].sales
            }
        },        
        // 递归处理商品规格数据
        recGoodsSpec (now, array, keyArr) {
            let ar = []
            let keyAr = []
            let index = now
            let arr = this.deepCopy(array)
            let nextIndex = index + 1
            let goodsSpec = this.goodsSpec

            if (nextIndex < goodsSpec.length) {
                let len = arr[index].length
                let nextLen = goodsSpec[nextIndex].specNum.length

                for (let i = 0; i < len; i++) {
                    let item = goodsSpec[nextIndex]

                    for (let j = 0; j < nextLen; j++) {
                        let ite = item.specNum[j]
                        let key = keyArr[i] + ',' + j

                        ar.push(ite)
                        keyAr.push(key)
                    }
                }
                arr.push(ar)

                this.recGoodsSpec(nextIndex, arr, keyAr)

                return true
            }
            this.recGoodsSpecDetail(arr)
        },
        // 处理商品规格详情输入数据格式
        recGoodsSpecDetail (array) {
            let ar = []
            let arr = []
            let len = array[array.length - 1].length
            let val = ''
            this.RenderGoodsSpec = this.deepCopy(array)

            for (let i = 0; i < 5; i++) {
                    ar = []
                for (let j = 0; j < len; j++) {
                    ar.push(val)
                }
                    arr.push(ar)
            }

            this.userInputSpecDetail = arr  
          
        },        
    },
};
</script>

<style scoped lang="less">
.details_content{
    width: 100%;
    margin-bottom: 20px;
    .details{
        padding-top:20px;
    }
    .titles{
        width: 100%;
        font-size: 20px;
        background: rgb(248, 248, 248);
    }
    .mar_bot{
        margin-bottom: 20px;
        span{
            margin-right: 80px;
        }
    }
    .goodsimg{
        display: flex;
        align-items: center;
        
    }
}
    .table_content{
       border: 1px solid #dddddd;
    }
    .header {
        display: flex;
        width: 100%;
        div {
            flex: 1;
            padding: 10px 0;
            font-size: 14px;
            color: #333333;
            // text-align: center;
        }
    }
</style>
