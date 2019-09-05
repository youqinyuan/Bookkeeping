<template>
    <div>
        <el-dialog
            title="请输入广告值"
            :visible.sync="DialogVisible"
            width="30%"
            center>
            <el-input v-model="advaule" placeholder="不可大于10000的数字，默认为0"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {updateGoodsAdWeights,updateAdWeights} from '@/network/api'
export default {
    props: {

    },
    data () {
        return {
            id:"",
            advaule:"",
            type:"",
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
        open(id,adWeights,type){
            this.advaule = adWeights 
            this.id = id 
            this.type = type
            this.DialogVisible = true
        },
        comres(res){
            if(res.data.messageCode == "MSG_1001"){
                this.$message({
                    type: 'success',
                    message: res.data.message
                });
                this.$parent.search(1)
                this.DialogVisible = false
            }else{
                this.$message.error('请正确填写广告值')
            }
        },
        save(){
            if(this.type == 2){
                let parms = {
                    id:this.id,
                    adWeights:this.advaule
                }
                updateAdWeights(this.qs.stringify(parms)).then(res=>{
                    this.comres(res)
                })
            }else{
                let parms = {
                    goodsId:this.id,
                    adWeights:this.advaule
                }
                updateGoodsAdWeights(this.qs.stringify(parms)).then(res=>{
                    this.comres(res)
                })
            }
        }
    },
};
</script>

<style scoped lang="less">

</style>
