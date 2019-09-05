<template>
    <div class="contents">
        <div class="merchant">
            <div class="title">
                <span>商家入驻要求:</span>
                <span class="xg" @click="revise" v-if="right">修改</span>
                <span class="xg" v-else @click="save">保存</span>
            </div>
            <div class="con">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
                    <el-form-item label="爆品数量不可大于" prop="maxGoodsQuantity">
                        <el-input style="width:250px" :disabled="disabled" v-model="ruleForm.maxGoodsQuantity"></el-input>
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
                maxGoodsQuantity:""
            },
            rules:{
                maxGoodsQuantity: [
                    { required: true, message: '数量不能为空', trigger: 'change' },
                    { pattern:/^([1-9]|[1-9]\d|1\d{2}|200)$/, message: '输入数字不可大于200，不可小于1', trigger: 'change' }
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
