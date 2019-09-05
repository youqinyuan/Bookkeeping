<template>
    <div>
        <el-dialog
            title="转为plus会员"
            :visible.sync="DialogVisible"
            width="30%"
            top="30vh"
            center>
            <div style="text-align:center">
                <el-radio-group v-model="radio">
                    <el-radio v-for="(item,index) in radioArr" :key="index" :label="item.id">{{item.name}}</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {exchangeMemberRole,allProfitsDistributionIdAndName} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            DialogVisible:false,
            radioArr:[],
            radio:"",
            id:""
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
        this.getallProfitsDistributionIdAndName()
    },
    methods: {
        getallProfitsDistributionIdAndName(){
            allProfitsDistributionIdAndName().then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.radioArr = res.data.content
                }
            })
        },
        open(id){
            this.DialogVisible = true;
            this.id = id
        },

        save(){
            let parms = {
                id:this.id,
                distribId:this.radio,
                role:3
            }
            exchangeMemberRole(this.qs.stringify(parms)).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.DialogVisible = false;
                    this.$parent.search(1)
                }else{
                    this.$message.error(res.data.message);
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .reduce{
        text-align: center;
        span{
            display: inline-block;
            width: 150px;
            height: 30px;
            line-height: 30px;
            border: 1px solid black
        }
        i{
           font-size: 25px;
           margin-left: 10px;
           vertical-align: sub;
           cursor: pointer;
        }
    }
</style>
