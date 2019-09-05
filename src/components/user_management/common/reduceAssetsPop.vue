<template>
    <div>
        <el-dialog
            title="仅限减少"
            :visible.sync="DialogVisible"
            width="30%"
            top="30vh"
            center>
            <div class="reduce">
                <span>{{money}}</span>
                <i class="el-icon-remove-outline" @click="reduceMoney"></i>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {subtractUserAssets} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            DialogVisible:false,
            copyMoney:"",
            money:"",
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

    },
    methods: {
        open(row){
            this.DialogVisible = true;
            this.id = row.id
            this.money = row.balance
            this.copyMoney = JSON.parse(JSON.stringify(row.balance))
        },

        reduceMoney(){
            if(this.money === 0){
                return
            }else{
                this.money--
            }
        },

        save(){
            let parms = {
                id:this.id,
                amount:this.copyMoney - this.money
            }
            subtractUserAssets(this.qs.stringify(parms)).then(res=>{
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
