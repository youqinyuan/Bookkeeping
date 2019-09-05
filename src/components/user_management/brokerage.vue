<template>
    <div class="contents">
        <div class="top">
            <span>时间：</span>
            <el-date-picker
            v-model="beginTime"
            type="datetime"
            placeholder="选择开始时间">
            </el-date-picker>
            <span>-</span>
            <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="选择结束时间">
            </el-date-picker>
            <span style="margin-left:40px">电话：</span>
            <el-input style="width:250px" v-model="mobile" placeholder="请输入电话"></el-input>
            <el-button type="primary" @click="search(1)">搜 索</el-button>
        </div>

        <div style="margin-top:30px">
            <el-table
            :data="tableData"
            border
            style="width: 100%">
                <el-table-column
                    prop="id"
                    label="编号"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    align="center"
                    label="会员名称">
                </el-table-column>
                <el-table-column
                    prop="mobileNumber"
                    align="center"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="tradeTime"
                    align="center"
                    label="申请提交时间">
                    <template slot-scope="scope">
                        {{scope.row.tradeTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tradeAmount"
                    align="center"
                    label="申请提现金额">
                    <template slot-scope="scope">
                        <span style="color:red">{{scope.row.tradeAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="balance"
                    align="center"
                    label="余额">
                </el-table-column>
                 <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="success"
                        @click="pass(scope.row)" v-if="scope.row.status === 1">通过</el-button>
                        <el-button
                        v-else
                        size="mini"
                        type="info"
                        disabled
                        >已通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bot">
                <span>总计:{{total}}条</span>
                 <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :total="total">
                </el-pagination>
            </div>
           
        </div>
    </div>
</template>

<script>
import {getWithdrawMoneyAuditList,auditPassedById} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            tableData:[],
            total:0,
            currentPage:1,
            beginTime:"",
            endTime:"",
            mobile:""
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
        this.search(1)
    },
    methods: {
        // 获取提现数据
        getWithdrawMoneyAuditList(parms){
            getWithdrawMoneyAuditList({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.total = res.data.content.totalSize
                    this.tableData = res.data.content.items
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
            let obj = {
                pageNumber:val,
                pageSize:10,
                beginTime:start,
                endTime:end,
                mobile:this.mobile
            }
            this.getWithdrawMoneyAuditList(obj)
            this.currentPage = 1
        },

        // 通过
        pass(row){
             this.$confirm('通过后，提现金额以零钱方式返回给用户微信账户!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true
                }).then(() => {
                    let parms = {
                        id:row.id
                    }                   
                    auditPassedById(this.qs.stringify(parms)).then(res=>{
                        if(res.data.messageCode == "MSG_1001"){
                            this.$message.success(res.data.message);
                            this.search(1)
                        }else{
                            this.$message.error(res.data.message);
                        }
                    })
                }).catch(() => {         
            });
        }
    },
};
</script>

<style scoped lang="less">
    .bot{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
</style>
