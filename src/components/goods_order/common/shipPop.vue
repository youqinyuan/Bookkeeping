<template>
    <div>
        <el-dialog title="发货" :visible.sync="choosePop" width='550px' center>
            <div style="text-align:center">
                <el-button type="primary" @click="UnitePop = true">统一物流单号</el-button>
                <el-button type="primary" @click="MultiplePop = true">多个物流单号</el-button>
            </div>
        </el-dialog>

        <!-- 统一  -->
        <el-dialog :title="title" :visible.sync="UnitePop" width='550px'>
            <el-form :model="dgformUnite">
                <el-form-item label="选择物流">
                    <el-select v-model="dgformUnite.logisticsId" placeholder="选择物流" style="width:400px">
                        <el-option v-for="(item,index) in logisticsListArr" :key="index" :label="item.companyName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流单号">
                    <el-input v-model="dgformUnite.trackingNumber" autocomplete="off" style="width:400px" maxlength="32"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="UnitePop = false">取 消</el-button>
                <el-button type="primary" @click="saveUnite">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 多个  -->
        <el-dialog title="发货" :visible.sync="MultiplePop" width='550px'>
            <el-form :model="dgformMultiple">
                <el-form-item label="选择商品">
                    <el-select v-model="dgformMultiple.goodsId" multiple placeholder="选择商品" style="width:300px">
                        <el-option v-for="(item,index) in goodsArr" :key="index" :label="item.goodsName" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                    <el-button type="primary" @click="sure">确 定</el-button>
                </el-form-item>

                <div class="common" v-for="(item,index) in commonArr" :key="index">
                    <span class="name" v-for="(ite,inx) in item.selectedList" :key="inx">商品名称:{{ite.goodsName}}</span>
                    <el-form-item label="选择物流">
                        <el-select v-model="item.logisticsId" placeholder="选择物流" style="width:400px" >
                            <el-option 
                                v-for="(itemLogistics,index) in item.logisticsListArr"
                                :key="index" 
                                :label="itemLogistics.companyName"
                                :value="itemLogistics.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流单号">
                        <el-input v-model="item.trackingNumber" autocomplete="off" style="width:400px" maxlength="32"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveMultiple">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getLogisticsCompanyList, queryTobeShippedOrderGoods, addOrderLogistics} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            title:"",
            choosePop:false,
            UnitePop:false,
            MultiplePop:false,
            logisticsListArr:[],// 物流下拉数据
            dgformUnite: {
                logisticsId: 13,
                trackingNumber: '',
                orderId: ''
            },
            dgformMultiple: {
                goodsId:[]
            },
            goodsArr:[],// 多物流下拉选择商品数组
            commonArr:[],
            uniteParam:{ // 单个物流信息提交数据
                orderId:"",
                orderLogisticsList:[
                    {
                        id:"",
                        logisticsId:"",
                        trackingNumber: "",
                        orderDetailIds:""
                    }
                ]
            },
            MultipleParam:{ // 多个物流信息提交数据
                orderId:"",
                orderLogisticsList:[]
            },
            Ids:[]
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
        this.getLogisticsList()
    },
    methods: {
        // 获取物流公司列表
        getLogisticsList () {
            getLogisticsCompanyList().then(res => {
                this.logisticsListArr = res.data.content
            })
        },
        open(orderId,id){
            this.title = "发货"
            this.goodsArr = []
            this.uniteParam.orderId = orderId
            this.MultipleParam.orderId = orderId
            this.uniteParam.orderLogisticsList[0].id = id?id:''
            let parm = {
                orderId:orderId
            }
            queryTobeShippedOrderGoods({params:parm}).then(res=>{
                if(res.data.content){
                    this.choosePop = true
                    let content = res.data.content;
                    for (var i =0; i<content.length; i++){  //处理多个物流信息数据
                        let obj = {}
                        obj.goodsName = content[i].goodsName + '-' + content[i].specDesc
                        obj.id = content[i].id
                        obj.disabled = false
                        this.goodsArr.push(obj)
                    }
                }
            })
        },
        // 单独打开统一物流
        openUnitePop(orderId,item){
            this.title = "修改物流单号"
            this.uniteParam.orderId = orderId
            this.uniteParam.orderLogisticsList[0].id = item.id?item.id:''
            this.uniteParam.orderLogisticsList[0].orderDetailIds = item.goodsDetailIds
            this.dgformUnite.logisticsId = item.logisticsId
            this.dgformUnite.trackingNumber = item.trackingNumber
            this.UnitePop = true
        },

        // 单独打开多个物流
        openMultiplePop(orderId){
            this.MultipleParam.orderId = orderId
            let parm = {
                orderId:orderId
            }
            queryTobeShippedOrderGoods({params:parm}).then(res=>{
                if(res.data.content){
                    this.MultiplePop = true
                    let content = res.data.content;
                    for (var i =0; i<content.length; i++){  //处理多个物流信息数据
                        let obj = {}
                        obj.goodsName = content[i].goodsName + '-' + content[i].specDesc
                        obj.id = content[i].id
                        obj.disabled = false
                        this.goodsArr.push(obj)
                    }
                }
            })
        },

        sure(){
            let selectedList = [];
            this.commonArr = []
            let chooseId = this.dgformMultiple.goodsId;
            if(chooseId.length<1){
                this.$message("请选择商品")
                return
            }
            this.goodsArr.forEach(item=>{
                chooseId.forEach(iteId=>{
                    if(item.id == iteId){
                        item.disabled = true
                        selectedList.push(item)
                    }
                })
            })
            this.commonArr.push({
                selectedList:selectedList,
                logisticsId:13,
                logisticsListArr:this.logisticsListArr,
                trackingNumber:""
            })
            this.dgformMultiple.goodsId = []
        },
        // 保存统一物流
        saveUnite(){
            if (this.dgformUnite.logisticsId === '') {
                this.$message('请先选择物流公司')
                return
            } else if (this.dgformUnite.trackingNumber === '') {
                this.$message('请先填写物流单号')
                return
            }
            let path = this.$route.path
            this.uniteParam.orderLogisticsList[0].logisticsId = this.dgformUnite.logisticsId
            this.uniteParam.orderLogisticsList[0].trackingNumber = this.dgformUnite.trackingNumber
            addOrderLogistics(this.uniteParam).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message.success(res.data.message)
                    this.UnitePop = false
                    this.choosePop = false
                    this.dgformUnite.logisticsId = 13
                    this.dgformUnite.trackingNumber = ''
                    if(path == "/selfSupportOrder" || path == "/businessOrder"){
                        this.$parent.searchOrderList()
                    }else{
                        this.$parent.getOrderList(this.$route.query.orderid)
                    }
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },

        // 保存多个物流
        saveMultiple(){
            let path = this.$route.path
            for(var i=0,len=this.commonArr.length; i<len; i++){
                let obj = {}
                obj.id = ""
                obj.logisticsId = this.commonArr[i].logisticsId
                obj.trackingNumber = this.commonArr[i].trackingNumber
                if (obj.logisticsId === '') {
                    this.$message('请先选择物流公司')
                    return
                } else if (obj.trackingNumber === '') {
                    this.$message('请先填写物流单号')
                    return
                }
                this.Ids = []
                this.commonArr[i].selectedList.forEach(item=>{
                    this.Ids.push(item.id)
                })
                obj.orderDetailIds = this.Ids.join(',')
                this.MultipleParam.orderLogisticsList.push(obj)
            }
            if(this.Ids.length<1){
                this.$message('请选择商品并完善物流信息')
                return
            }
            addOrderLogistics(this.MultipleParam).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message.success(res.data.message)
                    this.MultiplePop = false
                    this.choosePop = false
                    if(path == "/selfSupportOrder" || path == "/businessOrder"){
                        this.$parent.searchOrderList()
                    }else{
                        this.$parent.getOrderList(this.$route.query.orderid)
                    }                    
                }else{
                    this.MultiplePop = false
                    this.choosePop = false
                    this.$message.error(res.data.message)
                }
                this.Ids = []
                this.commonArr = []
                this.goodsArr = []
                this.MultipleParam.orderLogisticsList = []
            })
        }
    },
};
</script>

<style scoped lang="less">
    .common{
        margin-bottom: 15px;
        .name{
            color: red;
            margin-right: 15px;
        }
    }
</style>
