<template>
    <div class="contents">
        <div>
            <span>角色：</span>
            <el-select v-model="role " placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="margin-top:20px">
            <span>时间：</span>
            <el-date-picker
                v-model="beginTime"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker
                v-model="endTime"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="选择结束时间">
            </el-date-picker>
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
                    prop="incomeName"
                    align="center"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="role"
                    align="center"
                    label="角色">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align="center"
                    label="时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="gainAmount"
                    align="center"
                    label="获得奖金">
                </el-table-column>
                <el-table-column
                    prop="gainReason"
                    align="center"
                    label="获得原因">
                </el-table-column>
            </el-table>
            <div class="bot">
                <span>总计:{{total}}条</span>
                 <el-pagination
                    background
                    layout="prev, pager, next,jumper"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :total="total">
                </el-pagination>
            </div> 
        </div>
    </div>
</template>

<script>
import {getAllUnexpectedIncome} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            beginTime:"",
            endTime:"",
            options: [{
            value: '',
            label: '全部'
            }, {
            value: 1,
            label: '平台'
            }, {
            value: 3,
            label: 'PLUS会员'
            }],
            role:'',
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            total:0,
            tableData:[],
            currentPage:1
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
        getUnexpectedIncome(parms){
            getAllUnexpectedIncome({params:parms}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.total = res.data.content.items.totalSize
                    this.tableData = res.data.content.items.items
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
                role :this.role
            }
            this.getUnexpectedIncome(obj)
            this.currentPage = 1
        },
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
