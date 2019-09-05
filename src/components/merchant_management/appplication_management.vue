<template>
    <div class="contents">
        <div class="top">
            <div class="inline">
                <span>姓名：</span>
                <el-input class="inp" v-model="name"></el-input>
            </div> 
            <div class="inline">
                <span>电话：</span>
                <el-input class="inp" v-model="mobileNumber"></el-input>
            </div>
            <div class="inline">
                <span>分类：</span>
                <el-select v-model="businessId" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="inline">
                <span>申请时间：</span>
                <el-date-picker
                    v-model="beginTime"
                    type="date"
                    placeholder="选择开始日期">
                </el-date-picker>
                <el-date-picker
                    v-model="endTime"
                    type="date"
                    placeholder="选择结束日期">
                </el-date-picker>
            </div>

            <el-button type="primary" @click="search(1)">搜 索</el-button>
            <el-button type="info">导 出</el-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%;margin-top:20px;"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            align="center">
            </el-table-column>
            <el-table-column
            prop="id"
            label="申请编号"
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
            prop="mobileNumber"
            label="电话"
            align="center">
            </el-table-column>
            <el-table-column
            prop="storeName"
            label="店铺名称"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="addressDetail"
            label="店铺所在位置"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="onlineRebate"
            label="店铺平均折扣"
            align="center">
            </el-table-column>
            <el-table-column
            prop="businessName"
            label="分类"
            align="center">
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="申请时间"
            align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | dateFormat}}
                </template>            
            </el-table-column>
            <el-table-column
            prop="name"
            label="操作"
            align="center"
            width="200">
                <template slot-scope="scope">
                    <span @click="seeDetail(scope.row)" class="handle">查看详情</span>
                    <span @click="pass(scope.row)" class="handle">通过</span>
                    <span @click="refuse(scope.row)" class="handle">拒绝</span>
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
    </div>
</template>

<script>
import {getMerchantBusinessList,getMerchantAuditList,getMerchantAuditListExcel,changeAuditStatus} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            name:"",
            mobileNumber:"",
            beginTime:"",
            endTime:"",
            options: [{
                id:'',
                name:'全部'
            }],
            businessId: '',
            tableData:[],
            currentPage:1,
            total:0
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
        this.getMerchantBusinessList()
        this.search(1)
    },
    methods: {
        // 获取行业分类
        getMerchantBusinessList(){
            getMerchantBusinessList().then(res=>{
                if(res.data.content){
                    this.options = this.options.concat(res.data.content)
                }
            })
        },

        // 获取申请列表
        getMerchantAuditList(parms){
            getMerchantAuditList({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.tableData = res.data.content.items;
                    this.total = res.data.content.totalSize;
                }
            })
        },

        handleCurrentChange(val){
            this.search(val)
            this.currentPage = val
        },

        search(val){
            let start,end
            if(!this.beginTime){
                start = ""
            }else{
                start = this.beginTime.getTime()
            } 
            if(!this.endTime){
                end = ""
            }else{
                end = this.endTime.getTime()
            }

            if(this.beginTime && this.endTime){
              if(this.beginTime.getTime()>this.endTime.getTime()){
                  this.$message.error('请正确输入时间');
                  return
              }
            }
            let obj = {}
            if(this.name){
                obj = {
                    pageNumber:val,
                    pageSize:10,
                    beginTime:start,
                    endTime:end,
                    name:this.name,
                    businessId:this.businessId,
                    mobileNumber:this.mobileNumber
                }
            }else{
                obj = {
                    pageNumber:val,
                    pageSize:10,
                    beginTime:start,
                    endTime:end,
                    businessId:this.businessId,
                    mobileNumber:this.mobileNumber
                }
            }
            
            this.getMerchantAuditList(obj)
            this.currentPage = 1
        },

        handleSelectionChange(selection){
        },
        seeDetail(row){
            this.$router.push({
                path:'/appplicationDetails',
                query:{
                    id:row.id
                }
            })
        },
        pass(row){
            this.$confirm('生成默认登录密码88888888', '通过申请?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
            }).then(() => {
                let parms = {
                    id:row.id,
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
        refuse(row){
            this.$prompt('', '确定拒绝此次申请？', {
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
                    id:row.id,
                    status:3,
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
        }
    },
};
</script>

<style scoped lang="less">
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
    .handle{
        color: red;
        cursor: pointer;
        margin-right: 15px;
    }
</style>    
