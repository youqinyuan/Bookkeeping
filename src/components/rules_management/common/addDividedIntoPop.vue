<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisibleOne"
            width="400px"
            center>
            <div class="cen">
                <span>名称：</span>
                <el-input style="width:250px" v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="next">下一步</el-button>
            </span>
        </el-dialog>

         <el-dialog
            :visible.sync="dialogVisibleTwo"
            width="600px"
            center>
            <div>
                <div class="title">
                    <strong>余额支付：</strong><span>占比设置</span>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px">
                    <el-form-item label="Plus会员：占商品利润空间的" prop="plusRate">
                        <el-input style="width:100px" v-model="ruleForm.plusRate"></el-input>
                        <span>%</span>
                    </el-form-item>
                    <el-form-item label="代理商：占商品利润空间的" prop="agentRate">
                        <el-input style="width:100px" v-model="ruleForm.agentRate"></el-input>
                        <span>%</span>
                    </el-form-item>
                    <el-form-item label="平台：占商品利润空间的" prop="platformRate">
                        <el-input style="width:100px" v-model="ruleForm.platformRate"></el-input>
                        <span>%</span>
                    </el-form-item>
                    <el-form-item label="Plus会员：占商品付款金额的" prop="plusPaymentRate">
                        <el-input style="width:100px" v-model="ruleForm.plusPaymentRate"></el-input>
                        <span>%</span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="up">上一步</el-button>
                <el-button type="primary" @click="save('ruleForm')">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {modifyProfitsDistribution} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            id:"",
            name:"",
            isDefault:2, // 默认为添加时的值
            ruleForm:{
                paymentChannel:1, // 支付渠道1：普通支付
                plusRate:"", // plus会员占比（%之前的值）
                agentRate:"", // 代理商占比（%之前的值）
                platformRate:"" ,// 平台占比（%之前的值）
                plusPaymentRate:"" // plus会员占商品付款金额比（%之前的值）
            },
            rules:{
                plusRate: [
                    { required: true, message: '不能为空值', trigger: 'change' },
                    { pattern:/^99$|^(\d|[1-9]\d)$/, message: '只能大于等于0小于100', trigger: 'change' }
                ],
                agentRate: [
                    { required: true, message: '不能为空值', trigger: 'change' },
                    { pattern:/^99$|^(\d|[1-9]\d)$/, message: '只能大于等于0小于100', trigger: 'change' }
                ],
                platformRate: [
                    { required: true, message: '不能为空值', trigger: 'change' },
                    { pattern:/^99$|^(\d|[1-9]\d)$/, message: '只能大于等于0小于100', trigger: 'change' }
                ],
                plusPaymentRate:[
                    { required: true, message: '不能为空值', trigger: 'change' },
                    { pattern:/^(([1-9])|([1-4][0-9]))$/, message: '只能大于0小于50', trigger: 'change' }
                ]
            },
            title:"",
            dialogVisibleOne:false,
            dialogVisibleTwo:false,
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
        open(title,ite){
            this.dialogVisibleOne = true;
            this.title = title;
            if(ite){
                this.id = ite.id
                this.name = ite.name
                this.isDefault = ite.isDefault
                this.ruleForm.plusRate = ite.items[0].plusRate
                this.ruleForm.agentRate = ite.items[0].agentRate
                this.ruleForm.platformRate = ite.items[0].platformRate
                this.ruleForm.plusPaymentRate = ite.items[0].plusPaymentRate
            }else{
                this.id = ''
                this.name = ''
                this.isDefault = 2
                this.ruleForm.plusRate = ''
                this.ruleForm.agentRate = ''
                this.ruleForm.platformRate = ''
                this.ruleForm.plusPaymentRate = ''
            }
        },
        next(){
            if(this.name){
                this.dialogVisibleOne = false
                this.dialogVisibleTwo = true
            }else{
                this.$message.error('请先输入名称')
            }
            
        },
        up(){
            this.dialogVisibleOne = true
            this.dialogVisibleTwo = false
        },
        save(formName){ 
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let result = Number(this.ruleForm.plusRate) + Number(this.ruleForm.agentRate) + Number(this.ruleForm.platformRate)
                    if(result!=100){
                        this.$message.error('输入框内内容加起来必须等于100')
                        return
                    }
                    let item = []
                    item.push(this.ruleForm)
                    let parms = {
                       id:this.id,
                       name:this.name,
                       isDefault:this.isDefault,
                       items:item
                   }
                   modifyProfitsDistribution(parms).then(res=>{
                       if(res.data.messageCode == "MSG_1001"){
                           this.$parent.getProfitsDistributions()
                           this.dialogVisibleTwo = false
                           this.$message.success(res.data.message)
                       }else{
                           this.$message.error(res.data.message)
                       }
                   })
                } else {
                    return false;
                }
            });
        }
    },
};
</script>

<style scoped lang="less">
    .cen{
        text-align: center
    }
    .title{
        border-bottom: 1px solid #cccccc;
        padding-bottom: 5px;
        margin-bottom: 15px;
    }
</style>
