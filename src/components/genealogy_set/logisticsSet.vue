<template>
    <div class="contents">
        <span>物流名称：</span>
        <el-input v-model="name" style="width:200px"></el-input>
        <el-button type="primary">搜 索</el-button>
        <el-button type="success" @click="add">添 加</el-button>
        <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top:20px">
            <el-table-column
                prop="id"
                label="编号"
                align="center">
            </el-table-column>
            <el-table-column
                prop="companyName"
                label="物流名称"
                align="center">
            </el-table-column>
            <el-table-column
                prop="useCount"
                label="使用次数"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <span class="handle" @click="deletes(scope.row.id)">删除</span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            title="添加物流公司"
            :visible.sync="dialogVisible"
            width="400px">
            <span>物流名称</span>
            <el-input v-model="addname" style="width:200px" maxlength="20" placeholder="20子以内"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getLogisticsCompanyList,addLogisticsCompany,deletelogistics} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            name:"",
            addname:"",
            tableData:[],
            dialogVisible:false
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
        this.getLogisticsCompanyList()
    },
    methods: {
        getLogisticsCompanyList(){
            getLogisticsCompanyList().then(res=>{
                this.tableData = res.data.content
            })
        },
        add(){
            this.dialogVisible = true
        },
        save(){
            if(this.addname == ""){
                this.$message.error('不能为空')
                return
            }else{
                let parms = {
                    name:this.addname
                }
                addLogisticsCompany(this.qs.stringify(parms)).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.getLogisticsCompanyList()
                        this.$message.success(res.data.message)
                        this.dialogVisible = false
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            } 
        },
        deletes(id){
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deletelogistics({params:{id:id}}).then(res=>{
                        if(res.data.messageCode == "MSG_1001"){
                            this.getLogisticsCompanyList()
                            this.$message.success(res.data.message)
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
    .handle{
        color: red;
        cursor: pointer;
    }
</style>
