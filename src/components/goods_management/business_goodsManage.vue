<template>
    <div class="contents">
        <div class="inline_box">
            <span>商品名称:</span>
            <el-input class="inp" v-model="goodsName" placeholder=""></el-input>
        </div>

        <div class="inline_box">
            <span>所属商家:</span>
            <el-input class="inp" v-model="businessName" placeholder=""></el-input>
        </div>

        <div class="inline_box">
            <span>行业分类:</span>
            <el-select v-model="valueCategory" placeholder="请选择"  @change="handleChangeCategory">
                <el-option
                    v-for="item in Category"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                   >
                </el-option>
            </el-select>
        </div>


        <div class="inline_box" v-show="showGoodsClass">
            <span>商品分类:</span>
            <el-cascader
                expand-trigger="hover"
                :options="options_class"
                :props="defaultParams"
                v-model="selectedGoodsId"
                @change="handleChangeGoods">
            </el-cascader>
        </div>     

        <div class="inline_box">
            <el-button type="primary" @click="search(1)">搜索</el-button>
        </div>   


        <div class="table">
            <el-table
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="goodsName"
                    label="名称"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="businessName"
                    label="行业">
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="分类">
                </el-table-column>
                <el-table-column
                    prop="stock"
                    label="库存">
                </el-table-column>
                <el-table-column
                    prop="dctRate"
                    label="折扣">
                    <template slot-scope="scope">
                        <span>{{scope.row.dctRate/10}}折</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cashBackAmount"
                    label="返现金额">
                    <template slot-scope="scope">
                        <span>{{scope.row.cashBackAmount}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orgPrice"
                    label="原价">
                    <template slot-scope="scope">
                        <span>{{scope.row.orgPrice}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="平台价">
                    <template slot-scope="scope">
                        <span>{{scope.row.orgPrice*scope.row.dctRate/100}}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="goodsImage"
                    label="头图">
                    <template slot-scope="scope">
                        <img :src="scope.row.goodsImage" width="40" height="40" class="head_pic"/>
                    </template>                    
                </el-table-column>
                <el-table-column
                    prop="grabbedNumber"
                    label="以抢数量">
                    <template slot-scope="scope">
                        <span @click="openChangeCount(scope.row.id,scope.row.grabbedNumber)" style="color:red;cursor: pointer;">{{scope.row.grabbedNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adWeights"
                    label="广告值">
                    <template slot-scope="scope">
                        <span @click="openAD(scope.row.id,scope.row.adWeights)" style="color:red;cursor: pointer;">{{scope.row.adWeights}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="interactCount"
                    label="评价数量">
                </el-table-column>
                <el-table-column
                    prop="goodInteractRate"
                    label="好评率">
                    <template slot-scope="scope">
                       <span>{{scope.row.goodInteractRate}}%</span>
                    </template>                  
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="所属商家"
                    show-overflow-tooltip>
                </el-table-column>                                                                                           
            </el-table>
            <div class="totalNum">总计：{{pageTotal}}条</div>
            <div class="order-bottom" v-if="tableData.length>0">
                <el-pagination
                background
                layout="prev, pager, next"
                :total="pageTotal"
                :page-size="10"
                @current-change="pageChange($event)"
                ></el-pagination>
            </div>
        </div>


        <!-- 广告值弹窗组件 -->
        <adValuePop ref="ad"></adValuePop>

        <!-- 修改以抢数量弹窗 -->
        <changeCountPop ref="changeCount"></changeCountPop>
    </div>
</template>

<script> 
import {merchantGoodsList,getMerchantBusinessList,getGoodsClassRequest} from '@/network/api'
import adValuePop from './common/adValuePop'
import changeCountPop from './common/changeCountPop'
export default {
    props: {

    },
    data() {
        return {
            tableData:[],
            pageTotal:"",
            goodsName:null,// 商品名称
            businessName:null,// 所属商家
            Category:[],// 分类行业
            valueCategory:"",// 已选行业分类ID
            defaultParams: {
                label: 'name',
                value: 'id',
                children: 'nextLevelData'
            },
            options_class:[],
            selectedGoodsId:"",// 已选商品分类ID
            showGoodsClass:true
        };
    },
    components: {
        adValuePop,
        changeCountPop
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.search(1)
        this.getMerchantBusinessList()
        this.getGoodsCategory()
    },
    methods: {
        // 获取商家商品列表
        getMerchantGoodsList(data){
            let param = {...data}
            merchantGoodsList({params: param}).then(res =>{
                // console.log(res)
                if (res.data.content) {
                    this.tableData = res.data.content.items;
                    this.pageTotal = res.data.content.totalSize
                } else {
                    this.tableData = []
                    this.pageTotal = 0
                }
            })
        },

        // 翻页
        pageChange(val){
            this.search(val)
        },
        // 获取行业分类
        getMerchantBusinessList(){
            getMerchantBusinessList().then(res => {
                this.Category = res.data.content
            })
        },

        // 获取商品分类
        getGoodsCategory(){
            getGoodsClassRequest().then((res)=>{
                this.options_class = this.getTreeData(res.data.content)
            })
        },

        // 递归方法
        getTreeData(data){
            // 循环遍历json数据
            for(var i=0;i<data.length;i++){
                if(data[i].nextLevelData.length<1){
                    // children若为空数组，则将children设为undefined
                    data[i].nextLevelData = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].nextLevelData);
                }
            }
            return data;
        },
        // 切换商品状态
        handleChangeGoods(value){
            console.log(value);
        },

        // 切换行业分类
        handleChangeCategory(val){
            console.log(val)
            if(val === 11){
                this.showGoodsClass = false;
                this.selectedGoodsId = ""
            }else{
                this.showGoodsClass = true;
            }
        },
        // 搜索
        search(val){
            let obj = {}
            obj.pageNumber = val
            obj.pageSize = 10
            obj.goodsName = this.goodsName == ""?null:this.goodsName
            obj.merchantId= this.businessName
            obj.businessId = this.valueCategory
            obj.categoryId= this.selectedGoodsId == "" ? "":this.selectedGoodsId[this.selectedGoodsId.length-1];
            this.getMerchantGoodsList(obj)
        },

        // 打开广告弹窗
        openAD(id,adWeights){
            this.$refs.ad.open(id,adWeights)
        },

        // 打开改变以抢数量弹窗
        openChangeCount(id,adWeights){
            this.$refs.changeCount.open(id,adWeights)
        }
    },
};
</script>

<style scoped lang="less">
    .inline_box{
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 15px;
        .inp{
            width: 180px;
        }
    }
    .order-bottom {
        width: 100%;
        text-align: center;
        margin-top: 30px;
    }
    .totalNum{
        margin-top: 20px;
        font-size: 14px;
    }
</style>
