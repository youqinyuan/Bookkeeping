<template>
    <div class="contents">
        <div class="merchant">
            <div class="title">
                <span>充值金额设置:</span>
                <span class="xg" @click="revise" v-if="right">修改</span>
                <span class="xg" v-else @click="save">保存</span>
            </div>
            <div class="con">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
                    <el-form-item label="每次最低充值金额" prop="value">
                        <el-input style="width:250px" :disabled="disabled" v-model.number="ruleForm.value"></el-input>
                        <span>个</span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {updateMerchantParamConfig} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            right:true,
            disabled:true,
            ruleForm:{
                value:""
            },
            rules:{
                value: [
                    { required: true, message: '金额不能为空', trigger: 'change' },
                ],
            }
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
        revise(){
            this.right = false
            this.disabled = false
        },
        save(){
            this.right = true
            this.disabled = true
            if(this.ruleForm.value<1 || this.ruleForm.value>10000 || typeof this.ruleForm.value == "string"){
                this.$message.error('请输入大于0小于10000的数字')
            }
        }
    },
};
</script>

<style scoped lang="less">
    .merchant{
        width: 600px;
        padding: 15px;
        border: 1px solid black;
        .title{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 10px;
            .xg{
                color: #169BD5;
                cursor: pointer;
            }
        }
        .con{
            margin-top: 15px;
        }
    }
</style>
