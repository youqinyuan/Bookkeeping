<template>
    <div class="slef_content">
        <div class="inline_box">
            <span>商品名称:</span>
            <el-input class="inp" v-model="name" placeholder="输入商品名称"></el-input>
        </div>

        <div class="inline_box">
            <span>分类:</span>
            <el-cascader
                expand-trigger="hover"
                :options="options_class"
                :props="defaultParams"
                v-model="selectedOptions_class"
                @change="handleChangeClass">
            </el-cascader>
        </div>

        <div class="inline_box">
            <span>状态:</span>
            <el-select v-model="value" placeholder="请选择"  @change="handleChangeStatus">
                <el-option
                    v-for="item in options_status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                   >
                </el-option>
            </el-select>
        </div>

        <div class="inline_box">
            <span>库存低于:</span>
            <el-input class="inp" value="number" maxlength=4 v-model="LowerCount" placeholder="例：10"></el-input>
        </div>

        <div class="inline_box">
            <el-button type="primary" @click="search(1)">搜索</el-button>
            <el-button type="success" @click="add">添加</el-button>
            <el-button @click="setPlatTag" style="background-color: rgba(0, 204, 255, 1);color:white">设置自营标签</el-button>
        </div>

        <div class="table">
            <el-table
            ref="multipleTable"
            :data="tableData"
            :row-key="getRowKeys"
            @selection-change="selectionChange"
            style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="true"
                   >
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="编号">
                    <template slot-scope="scope">
                        <span v-if="scope.row.goodsTagId === 1" class="slef">自营</span>
                        <span>{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="分类">
                </el-table-column>
                <el-table-column
                    prop="stock"
                    label="库存">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stock<=10" style="color:red">{{scope.row.stock}}</span>
                        <span v-else>{{scope.row.stock}}</span>
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
                    prop="dctRate"
                    label="折扣">
                    <template slot-scope="scope">
                        <span>{{scope.row.dctRate/10}}折</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="dctPrice"
                    label="成本价">
                    <template slot-scope="scope">
                        <span>{{scope.row.dctPrice}}元</span>
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
                       <span>{{scope.row.sales}}</span>+<span style="color:red">{{scope.row.adWeights}}</span>
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
                    prop="issueStatus"
                    label="状态">
                    <template slot-scope="scope">
                       <span v-if="scope.row.issueStatus == 1">上架</span>
                       <span v-if="scope.row.issueStatus == 2">下架</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adWeights"
                    label="广告值">
                    <template slot-scope="scope">
                       <span @click="openAD(scope.row.id,scope.row.adWeights)" style="color:red;cursor: pointer;">{{scope.row.adWeights}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span style="color: #169BD5;cursor: pointer;" @click="check(scope.$index, scope.row)">查看</span>
                        <span v-if="scope.row.issueStatus == 1" style="color: #169BD5;cursor: pointer;" @click="changeStatus(scope.$index, scope.row)">下架</span>
                        <span v-if="scope.row.issueStatus == 2" style="color: red;cursor: pointer;" @click="changeStatus(scope.$index, scope.row)">上架</span>
                    </template>
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
    </div>
</template>

<script>
import {platGoodsList,getGoodsClassRequest,updateGoodsIssueStatus,addPlatTag} from '@/network/api'
import adValuePop from './common/adValuePop'
export default {
    data () {
        return {
            name:"",
            defaultParams: {
                label: 'name',
                value: 'id',
                children: 'nextLevelData'
            },
            options_class:[],
            selectedOptions_class:"",
            options_status: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '上架'
            }, {
                value: '2',
                label: '未上架'
            }],
            value: '全部',
            LowerCount:"",
            tableData:[],
            pageTotal:"",
            multipleSelection: [],
            multipleSelectionAll:[],
            select_orderId:[]
        };
    },
    components: {
        adValuePop
    },
    computed: {

    },
    watch: {

    },
    created () {

    },
    mounted () {
        this.search(1);
        this.getGoodsCategory()
    },
    methods: {
         // 获取row的key值
        getRowKeys(row) {
            return row.id;
        },        
        // 获取自营商品管理列表
        getplatGoodsList(data){
            let param = {...data}
            // console.log(param)
            platGoodsList({params: param}).then((res) =>{
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
            // this.$refs.multipleTable.clearSelection()
            this.multipleSelection.forEach(item => {
                this.$refs.multipleTable.toggleRowSelection(item,true);
            });
        },
        // 勾选chebox
        selectionChange(rows){
            if(this.multipleSelection.length<1){
                this.multipleSelection = rows
            }else{
                this.multipleSelection = this.multipleSelection.concat(rows)
            }
        },

        // 获取商品分类
        getGoodsCategory(){
            getGoodsClassRequest().then((res)=>{
                // console.log(res)
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
        // 切换分类
        handleChangeClass(value) {
            console.log(value);
        },
        // 切换状态
        handleChangeStatus(value){
            console.log(value);
        },
        // 搜索
        search(val){
            let obj = {}
            obj.pageNumber = val
            obj.pageSize = 10
            obj.goodsName = this.name;
            obj.categoryId = this.selectedOptions_class == "" ? "":this.selectedOptions_class[this.selectedOptions_class.length-1];
            obj.issueStatus = this.value == "全部" ? "" : this.value;
            obj.stock = this.LowerCount
            this.getplatGoodsList(obj)
        },
        // 添加
        add(){
            this.$router.push({
                path:'/addGoods',
                query:{
                    type:1
                }
            })
        },
        // 查看
        check(index,row){
            this.$router.push({
                path:'/addGoods',
                query:{
                    type:2,
                    id:row.id
                }
            })
        },
        // 设置自营标签
        setPlatTag(){
            if(this.multipleSelection.length<1){
                this.$message({
                    type: 'warning',
                    message: '还未勾选商品'
                });
            }else{
                let arr = []
                this.multipleSelection.forEach((item)=>{
                    arr.push(item.id)
                })
                
                let repeatArr = new Set(arr)
                addPlatTag(repeatArr).then(res =>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.search()
                        // 清空搜索勾选的数据
                        this.multipleSelection = []
                        this.$refs.multipleTable.clearSelection()
                        this.$message({
                            type: 'success',
                            message: res.data.message
                        });
                    }
                })
            }
        },
        // 更改商品状态
        changeStatus(index,row){
            // console.log(row)
            let message = row.issueStatus == 1? "确认下架吗" : "确认上架吗"
            let parms = {
                goodsId:Number(row.id),
                issueStatus:row.issueStatus == 1?2:1
            }
            this.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateGoodsIssueStatus(this.qs.stringify(parms)).then((res) =>{
                    let type,message
                    if (res.data.messageCode == "MSG_4001") {
                        type = 'warning'
                        message = '商品库存不足，请先添加库存!'
                    }else if(res.data.messageCode == "MSG_1001"){
                        type = 'success'
                        message = '处理成功'
                        this.search()
                    }
                    this.$message({
                        type: type,
                        message: message
                    });
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            }); 
        },

        // 打开广告弹窗
        openAD(id,adWeights){
            this.$refs.ad.open(id,adWeights)
        }
    },
};
</script>

<style scoped lang="less">
    .slef_content{
        padding: 30px;
        box-sizing: border-box;
        .slef{
            color:red;
            width:18px;
            text-align: center;
            display:inline-block;
            background: green;
            color: white;
        }
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
    }
</style>
