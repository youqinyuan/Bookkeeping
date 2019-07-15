<template>
    <div>
        <el-dialog
            title=""
            :visible.sync="DialogVisible"
            width="30%"
            center>
            <div style="text-align: center">
                <el-input-number v-model="changeVaule" @change="handleChange" :min="0"  label=""></el-input-number>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {updateGoodsGrabbedNumber} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            id:"",
            changeVaule:"",
            DialogVisible:false
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
        open(id,grabbedNumber){
            this.changeVaule = grabbedNumber
            this.id = id 
            this.DialogVisible = true
        },
        handleChange (value) {
            console.log(value);
        },
        save(){
            let parms = {
                goodsId:this.id,
                grabbedNumber :this.changeVaule
            }
            updateGoodsGrabbedNumber(this.qs.stringify(parms)).then(res=>{
                console.log(res)
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        type: 'success',
                        message: res.data.message
                    });
                    this.$parent.search(1)
                    this.DialogVisible = false
                }else{
                    this.$message.error(res.data.message)
                }
            })
            console.log(this.changeVaule)
        }
    },
};
</script>

<style scoped lang="less">
   
</style>
