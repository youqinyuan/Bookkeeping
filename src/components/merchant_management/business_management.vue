<template>
    <div class="contents">
        <div class="top">
            <div class="inline">
                <span>电话：</span>
                <el-input class="inp" v-model="mobileNumber"></el-input>
            </div>
            <div class="inline">
                <span>分类：</span>
                <el-select v-model="businessId"  @change="changeBusinessId" placeholder="请选择" style="width:150px">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="inline">
                <span>状态：</span>
                <el-select v-model="status" placeholder="请选择" style="width:90px">
                    <el-option
                    v-for="item in options_status"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="inline">
                <span>来源</span>
                <el-select v-model="source" placeholder="请选择" style="width:90px">
                    <el-option
                    v-for="item in options_source"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <el-button type="primary" @click="search(1)">搜 索</el-button>
            <el-button type="info">导 出</el-button>
            <el-button type="success" @click="importMerchant">导入商家</el-button>
        </div>
        
        <el-table
            v-if="businessId === 1"
            :data="tableData_on"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                align="center">
            </el-table-column>
            <el-table-column
                prop="id"
                label="商家编号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                align="center">
            </el-table-column>
            <el-table-column
                prop="source"
                align="center"
                label="来源">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="所属代理商"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="businessName"
                label="分类"
                align="center">
            </el-table-column>
            <el-table-column
                prop="mobileNumber"
                label="电话"
                align="center">
            </el-table-column>
            <el-table-column
                prop="storeName"
                label="店铺名称"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span @click="godetail(scope.row.id)" style="color:#2E8B57;cursor: pointer;">{{scope.row.storeName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="onlineGains"
                label="线上营业额（总）"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="offlineGains"
                label="线下营业额（总）"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200">
                <template v-if="businessId === 1" slot-scope="scope">
                    <div class="handle_box" v-if="scope.row.source == '导入'">
                        <span class="handle" @click="deletes(scope.row.id)">删除</span>
                    </div>
                    <div class="handle_box" v-else>
                        <span class="handle">重置密码</span>
                        <span class="handle" v-if="scope.row.status == 2">冻结</span>
                        <span class="handle" v-else-if="scope.row.status == 4" style="color:#008000;">解冻</span>
                        <span class="handle">流失</span>
                        <span class="handle">更换代理商</span>
                        <span v-if="scope.row.channel == 2">设为供应商</span>
                        <span v-else-if="scope.row.channel == 4" class="handle" style="color:#996666;">改为普通商家</span>
                    </div>                    
                     <div class="handle_box" v-if="scope.row.status == 5">
                        <span class="handle" style="color:#cccccc">已流失</span>
                    </div>

                </template>   
            </el-table-column>
        </el-table>

        <el-table
            v-else
            :data="tableData_off"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                align="center">
            </el-table-column>
            <el-table-column
                prop="id"
                label="商家编号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                align="center">
            </el-table-column>
            <el-table-column
                prop="source"
                align="center"
                label="来源">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="所属代理商"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="businessName"
                label="行业"
                align="center">
            </el-table-column>
            <el-table-column
                prop="mobileNumber"
                label="电话"
                align="center">
            </el-table-column>
            <el-table-column
                prop="storeName"
                label="店铺名称"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span @click="godetail(scope.row.id)" style="color:#2E8B57;cursor: pointer;">{{scope.row.storeName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="onlineGains"
                label="线上营业额（总）"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="offlineGains"
                label="线下营业额（总）"
                align="center"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="adWeights"
                label="广告值"
                align="center">
                <template slot-scope="scope" v-if="businessId != 1">
                    <span style="color:red;cursor: pointer;" @click="open(scope.row.id,scope.row.adWeights)">{{scope.row.adWeights}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="200">
                <template slot-scope="scope">
                    <div v-if="scope.row.status != 5">
                        <div class="handle_box" v-if="scope.row.source == '导入'">
                            <span class="handle">删除</span>
                        </div>
                        <div class="handle_box" v-else>
                            <span class="handle" @click="resetPassword(scope.row.id)">重置密码</span>
                            <span class="handle" @click="freeze(scope.row.id)" v-if="scope.row.status == 2">冻结</span>
                            <span class="handle" @click="unfreeze(scope.row.id)" v-else-if="scope.row.status == 4" style="color:#008000;">解冻</span>
                            <span class="handle" @click="loss(scope.row.id)">流失</span>
                            <span class="handle">更换代理商</span>
                        </div>
                    </div>
                    
                     <div class="handle_box" v-if="scope.row.status == 5">
                        <span class="handle" style="color:#cccccc">已流失</span>
                    </div>    
                </template>   
            </el-table-column>
        </el-table>
        <div class="bot">
            <span>总计:{{total}}条</span>
                <el-pagination
                background
                layout="prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="10"
                :total="total">
            </el-pagination>
        </div>

        <!-- 广告值弹窗 -->
        <adValuePop ref="advalue"></adValuePop>

        <!-- 导入商家弹窗 -->
        <ImportMerchantPop ref="ImportMerchant"></ImportMerchantPop>
    </div>
</template>

<script>
import {getMerchantBusinessList,getOnlineStoreList,getOfflineStoreList,resetPassword,changeAuditStatus,deleteMerchantById} from '@/network/api'
import adValuePop from '../goods_management/common/adValuePop'
import ImportMerchantPop from './common/ImportMerchantPop'
export default {
    props: {

    },
    data() {
        return {
            mobileNumber:"",
            options: [],
            businessId: 1,
            options_status: [{
                id:'',
                name:'全部'
            },{
                id:2,
                name:'未冻结'
            },{
                id:4,
                name:'已冻结'
            },{
                id:5,
                name:'已流失'
            }],
            status: '',
            options_source: [{
                id:'',
                name:'全部'
            },{
                id:2,
                name:'小程序'
            },{
                id:4,
                name:'导入'
            }],
            source: '',
            tableData_on:[],
            currentPage:1,
            total:0,
            tableData_off:[],
        };
    },
    components: {
        adValuePop,
        ImportMerchantPop
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.getMerchantBusinessList()
        this.search(1)
    },
    methods: {
        // 获取行业分类
        getMerchantBusinessList(){
            getMerchantBusinessList().then(res=>{
                if(res.data.content){
                    this.options = res.data.content
                }
            })
        },

        // 获取商户列表  默认为电商接口
        getOnlineStoreList(parms){
            getOnlineStoreList({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.tableData_on = res.data.content.items;
                    this.total = res.data.content.totalSize;
                }
            })
        },

        // 获取商户列表  其他行业接口
        getOfflineStoreList(parms){
            getOfflineStoreList({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.tableData_off = res.data.content.items;
                    this.total = res.data.content.totalSize;
                }
            })
        },

        changeBusinessId(){
            this.search(1)
        },
        
        //翻页
        handleCurrentChange(val){
            this.search(val)
            this.currentPage = val
        },

        search(val){
            let obj = {
                pageNumber:val,
                pageSize:10,
                source:this.source,
                status:this.status,
                businessId:this.businessId,
                mobileNumber:this.mobileNumber
            }
            if(this.businessId === 1){
                this.getOnlineStoreList(obj)
            }else{
                this.getOfflineStoreList(obj)
            }
            this.currentPage = 1
        },

        handleSelectionChange(selection){
        },

        // 导入商家
        importMerchant(){
            this.$refs.ImportMerchant.open()
        },
        
        // 更改广告值
        open(id,adWeights){
            this.$refs.advalue.open(id,adWeights,2)
        },

        // 重置密码
        resetPassword(id){
            this.$confirm('重置密码为88888888', '重置密码？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
                }).then(() => {
                    let parms = {
                        id:id
                    }
                    resetPassword(this.qs.stringify(parms)).then(res=>{
                        if(res.data.messageCode == "MSG_1001"){
                            this.$message.success(res.data.message);
                        }else{
                            this.$message.error(res.data.message)
                        }
                    })
                }).catch(() => {          
            });
        },

        // 冻结
        freeze(id){
            this.$prompt('冻结后商家无法登录后台，爆品商城内商家隐藏，商品隐藏!', '冻结商家？', {
                confirmButtonText: '确定',
                cancelButtonText: '点错了',
                confirmButtonClass:'confirmButton',
                cancelButtonClass:'cancelButton',
                inputPlaceholder:"输入拒绝原因：100字以内",
                inputType:"textarea",
                center: true,
                inputPattern:  /\S/,
                inputErrorMessage: '原因不能为空'
            }).then(({ value }) => {
                let parms = {
                    id:id,
                    status:4,
                    reason:value
                }
                changeAuditStatus(this.qs.stringify(parms)).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success(res.data.message);
                        this.search(1)
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }).catch(() => {
            });
        },

        // 解冻
        unfreeze(id){
            this.$confirm('解冻后，商家可正常操作，商品自动上线!', '解冻商家?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                let parms = {
                    id:id,
                    status:2,
                }
                changeAuditStatus(this.qs.stringify(parms)).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success(res.data.message);
                        this.search(1)
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }).catch(() => {          
            });
        },

        // 流失
        loss(id){
            this.$prompt('', '流失商家？', {
                confirmButtonText: '确定',
                cancelButtonText: '点错了',
                confirmButtonClass:'confirmButton',
                cancelButtonClass:'cancelButton',
                inputPlaceholder:"输入备注：200字以内",
                inputType:"textarea",
                center: true,
                inputPattern:  /\S/,
                inputErrorMessage: '备注不能为空'
            }).then(({ value }) => {
                let parms = {
                    id:id,
                    status:5,
                    reason:value
                }
                changeAuditStatus(this.qs.stringify(parms)).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success(res.data.message);
                        this.search(1)
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }).catch(() => {
                      
            });
        },

        // 删除
        deletes(id){
             this.$confirm('', '删除商家?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                let parms = {
                    id:id
                }
                deleteMerchantById({params:parms}).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success(res.data.message);
                        this.search(1)
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            }).catch(() => {          
            });
        },

        // 跳转详情
        godetail(id){
            this.$router.push({
                path:'/businessDetails',
                query:{
                    id:id
                }
            })
        }
        
    },
};
</script>

<style scoped lang="less">
    .top{
        margin-bottom: 15px;
    }
    .inp{
        width: 200px;
    }
    .inline{
        display: inline-block;
        margin-bottom: 20px;
        margin-right: 15px;
    }
    .bot{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
    .handle_box{
        display: flex;
        justify-content:center;
        flex-wrap: wrap;
        .handle{
            color: red;
            cursor: pointer;
            margin: 0px 5px;
        }
    }
    
</style>    
