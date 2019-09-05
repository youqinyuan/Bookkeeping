<template>
    <div class="contents">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="right" size="mini">
            <div class="common">
                <div class="title">活动信息:</div>
                <el-form-item label="活动名称:" prop="name">
                    <el-input class="inp" v-model="ruleForm.name" placeholder="20字以内" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="活动时间:" required>
                        <div style="display: inline-block">
                            <el-form-item prop="startTime">
                                <el-date-picker
                                v-model="ruleForm.startTime"
                                type="datetime"
                                placeholder="开始时间">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div style="display: inline-block">
                            <el-form-item prop="endTime">
                                <el-date-picker
                                v-model="ruleForm.endTime"
                                type="datetime"
                                placeholder="结束时间">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                </el-form-item>
                <el-form-item label="广告值:" prop="advertValue">
                    <el-input style="width:150px" v-model.number="ruleForm.advertValue" placeholder="" maxlength="2"></el-input>
                </el-form-item>                
            </div>

            <div class="common">
                <div class="title">商品信息:</div>
                <div class="goodinfo" v-for="(item,index) in ruleForm.priceActivityGoods" :key="index">
                    <el-form-item label="选择商品:" :prop="'priceActivityGoods.' + index + '.goodsName'"
                        :rules="{
                            required: true, message: '请选择商品', trigger: 'change' 
                        }">
                        <el-input class="inp" @focus="chooseGoodsfocus(index)" v-model="item.goodsName" placeholder=""></el-input>
                    </el-form-item>

                    <el-form-item label="分享文案:" :prop="'priceActivityGoods.' + index + '.sharedDesc'"
                        :rules="{
                            required: true, message: '请输入分享文案', trigger: 'change' 
                        }">
                        <el-input class="inp" v-model="item.sharedDesc" placeholder="50字符以内" maxlength="50"></el-input>
                    </el-form-item> 

                    <el-form-item label="邮费:" :prop="'priceActivityGoods.' + index + '.expressFee'"
                        :rules="{
                            required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为7位数', trigger: 'change' 
                        }">
                        <el-input class="inp" v-model="item.expressFee" placeholder="" maxlength="7"></el-input>
                    </el-form-item>    

                    <div class="payset">
                        <el-form-item label="返" prop="cashBack">
                        <el-input style="width:150px" v-model="item.cashBack" placeholder="" maxlength="5"></el-input>
                        <span>元</span>
                        </el-form-item>
                        <el-form-item label="分期" label-width="60px">
                            <el-select v-model="item.period" placeholder="请选择">
                                <el-option
                                v-for="ite in options"
                                :key="ite.value"
                                :label="ite.label"
                                :value="ite.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    

                   <ul>
                       <span class="addguige" @click="addGoodsspec(item.goodsId,index)">添加规格</span>
                       <li v-for="(item,index) in ruleForm.priceActivityGoodsStockList" :key="index">
                           <div class="spcDesc">
                               <span>商品规格：{{item.spcDesc}}</span>
                               <span class="caozuo">重新选择</span>
                               <span class="caozuo" @click="deletespcDesc(index)">删除</span>
                           </div>
                           
                         <!-- <el-form-item label="商品规格:" :prop="'priceActivityGoods.' + index + '.spcDesc'"
                            :rules="{
                                    required: true, message: '请选择商品规格', trigger: 'change' 
                            }">
                        <el-input class="inp" @focus="chooseGoodsspec(item.goodsId,index)" v-model="item.spcDesc" placeholder=""></el-input>
                        </el-form-item> -->

                        <el-form-item label="商品库存:" :prop="'priceActivityGoodsStockList.' + index + '.stock'"
                            :rules="{
                                    required: true, message: '请选择库存', trigger: 'change' 
                            }">
                            <el-input class="inp" v-model="item.stock" disabled placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item label="商品原价:" :prop="'priceActivityGoods.' + index + '.orgPrice'"
                            :rules="{
                                required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为7位数', trigger: 'change' 
                            }">
                            <el-input class="inp" v-model="item.orgPrice" placeholder="" maxlength="7"></el-input>
                        </el-form-item>   
                       </li>
                    </ul>           
                </div>
                <el-button style="margin:0 auto" type="primary" @click="addAgin">再次添加商品</el-button>
            </div>

            <div>
                <el-button @click="submitForm('ruleForm')" type="primary">确 定</el-button>
                <el-button type="info" @click="back">返 回</el-button>
            </div>
        </el-form>

        <!-- 选择商品弹窗 -->
        <chooseGoodsPop ref="chooseGoods" @getgoods="getgoods(arguments)"></chooseGoodsPop>

        <!-- 选择商品规格 -->
        <chooseSpecPop ref="chooseGoodsSpec" @getgoodsSpec="getgoodsSpec(arguments)"></chooseSpecPop>
    </div>
</template>

<script>
import {addOrUpdatePriceActivity} from '@/network/api'
import chooseGoodsPop from './common/chooseGoodsPop'
import chooseSpecPop from './common/chooseSpecPop'

export default {
    props: {

    },
    data() {
        return {
            ruleForm: {
                id:"",
                name:"0元购", // 活动名称
                startTime:"", // 开始时间
                endTime:"", // 结束时间
                advertValue:0, // 广告值
                priceActivityGoods:[ 
                    {
                        goodsId:"",
                        goodsName:"",
                        expressFee:"",
                        sharedDesc:"",
                        cashBack:"",
                        period:0,
                    }
                ], // 商品信息
                priceActivityGoodsStockList:[
                    // {   
                    //     spcDesc:"",//规格名字
                    //     stock:"",// 规格库存
                    //     stockId:"", // 规格id
                    //     orgPrice:"" // 规格原价
                    // }
                ] // 商品规格信息
            },
            options: [{
                value: 0,
                label: '立返'
                }, {
                value: 1,
                label: '一期'
                }, {
                value: 2,
                label: '二期'
                }, {
                value: 3,
                label: '三期'
                }, {
                value: 4,
                label: '四期'
                }, {
                value: 5,
                label: '五期'
                }, {
                value: 6,
                label: '六期'
                }, {
                value: 7,
                label: '七期'
                }, {
                value: 8,
                label: '八期'
                }, {
                value: 9,
                label: '九期'
                }, {
                value: 10,
                label: '十期'
                }, {
                value: 11,
                label: '十一期'
                }, {
                value: 12,
                label: '十二期'
                }],
            rules:{
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'change' },
                    { min: 1, max: 20, message: '1-20字以内', trigger: 'change' }
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                advertValue: [
                    { required: true, pattern: /^(\d(\.\d)?|10)$/, message: '只能为数字,最大不可超过10', trigger: 'change' }
                ],
                stock: [
                    { required: true, message: '请输入库存', trigger: 'change' }
                ],
                purchasePrice: [
                    { required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为5位数', trigger: 'change' }
                ],
                cashBack: [
                    { required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为5位数', trigger: 'change' }
                ],
            }
        };
    },
    components: {
        chooseGoodsPop,chooseSpecPop
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        let details = this.$store.state.details
        if(this.$route.query.type == 2){
            this.ruleForm.id = details.id
            this.ruleForm.name = details.name
            this.ruleForm.startTime = new Date(details.startTime)
            this.ruleForm.endTime = new Date(details.endTime)
            this.ruleForm.advertValue = details.advertValue
            this.ruleForm.priceActivityGoods = details.item
            this.ruleForm.purchasePrice = details.purchasePrice
            this.ruleForm.cashBack = details.cashBack
            this.ruleForm.period = details.period
        }
    },
    beforeRouteLeave(to, from, next){
        this.$confirm('', '内容未保存，确定返回吗', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
            }).then(() => {
                next()
            }).catch(() => {
        });
    },
    methods: {
        chooseGoodsfocus(index){
            this.$refs.chooseGoods.open(index,this.ruleForm.priceActivityGoods)
        },

        // 添加商品规格
        addGoodsspec(goodsId,index){
            console.log(goodsId,index)
            if(goodsId){
                    let obj = {
                    spcDesc:"",//规格名字
                    stock:"",// 规格库存
                    stockId:"", // 规格id
                    orgPrice:"" // 规格原价
                }
                this.ruleForm.priceActivityGoodsStockList.push(obj)
                this.$refs.chooseGoodsSpec.open(goodsId,index)
            }else{
                this.$message.error('请先选择商品')
            }
            
        },
        // 删除商品规格
        deletespcDesc(index){
            this.ruleForm.priceActivityGoodsStockList.splice(index,1)
            console.log(index)
        },
        back(){
            this.$router.go(-1);//返回上一页
        },
        // 再次添加
        addAgin(){
            if(this.ruleForm.priceActivityGoods.length>19){
                this.$message.error("最多添加20个商品")
                return 
            }else{
                this.ruleForm.priceActivityGoods.push({goodsName:"",goodsId:"",spcDesc:"",stockId:"",stock:"",orgPrice:"",expressFee:"",sharedDesc:""});
            }
        },
        getgoods(argument){
            let goodinfo = argument[0]
            let i = argument[1]
            this.ruleForm.priceActivityGoods[i].goodsName = goodinfo.name
            this.ruleForm.priceActivityGoods[i].goodsId = goodinfo.id
            this.ruleForm.priceActivityGoods[i].spcDesc = ''
            this.ruleForm.priceActivityGoods[i].stockId = ''
            this.ruleForm.priceActivityGoods[i].stock = ''
            this.ruleForm.priceActivityGoods[i].orgPrice = ''
            this.ruleForm.priceActivityGoods[i].expressFee = ''
        },
        getgoodsSpec(argument){
            let goodinfo = argument[0]
            let i = argument[1]
            this.ruleForm.priceActivityGoods[i].spcDesc = goodinfo.sepcName
            this.ruleForm.priceActivityGoods[i].stockId = goodinfo.specId
            this.ruleForm.priceActivityGoods[i].stock = goodinfo.stock
            this.ruleForm.priceActivityGoods[i].orgPrice = goodinfo.orgPrice
            this.ruleForm.priceActivityGoods[i].expressFee = goodinfo.expressFee
        },


        // 确定
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {    
            if (valid) {
                let startTime = this.ruleForm.startTime.getTime()
                let endTime = this.ruleForm.endTime.getTime()
                var copyRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
                copyRuleForm.startTime = startTime
                copyRuleForm.endTime = endTime
                addOrUpdatePriceActivity(copyRuleForm).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message.success(res.data.message)
                        this.$refs[formName].resetFields();
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
            } else {}
            });
        },        
    },
};
</script>

<style scoped lang="less">
    .common{
        margin-bottom: 20px;
        .goodinfo{
            border-bottom: 1px solid #cccccc;
            margin-bottom: 15px;
        }
        ul{
            margin-top: 10px;
            .addguige{
                font-size: 14px;
                color: #169BD5;
                cursor: pointer;
            }
            .spcDesc{
                font-size: 14px;
                margin: 5px 0;
                .caozuo{
                    margin-left: 15px;
                    color: #169BD5;
                    cursor: pointer;
                }
                
            }
        }
    }
    .inp{
        width: 350px;
    }
    .title{
        border-bottom: 1px solid #cccccc;
        margin-bottom: 20px;
    }
    .payset{
        display: flex;
        border-bottom: 1px dashed #cccccc;
        .back{
            margin: 5px 10px
        }
        .fenqi{
            margin-left: 15px;
        }
    }
</style>
