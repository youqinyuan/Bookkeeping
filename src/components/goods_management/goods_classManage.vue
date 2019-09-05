<template>
    <div class="contents">
        <div class="title_top">
            <span>分类管理：{{classList.length}}个分类</span>
            <el-button  type="primary" @click="add">添加分类</el-button>
        </div>

        <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in classList" :key="index">
                <template slot="title">
                    <span>{{item.name}}</span>
                    <span class="next" v-if="item.nextLevelData.length !=0">二级分类：{{item.nextLevelData.length}}个</span>                    
                    <span class="center">(商品数量：{{item.goodsCount}}个,已销数量：{{item.goodsSales}}个)</span>  
                    <span class="icon">
                        <i class="el-icon-bottom" v-if="index != classList.length-1" @click.stop="Down(index)"></i>
                        <i class="el-icon-top" v-if="index !=0 " @click.stop="Up(index)"></i>
                    </span>
                    <el-button size="mini" @click.stop="modify(item.id)" type="primary">修 改</el-button>
                    <el-button size="mini" @click.stop="deletes(item.id)" type="danger">删 除</el-button>
                    <el-button size="mini" @click.stop="addNext(item.id)">添加二级分类</el-button>
                </template>
                <!-- 二级分类 -->
                <div class="nextClass" v-for="(nextItem,index) in item.nextLevelData" :key="index">
                    <img class="img" :src="nextItem.imageKey" alt="" width="40" height="40">
                    <span>{{nextItem.name}}</span>
                    <span class="center">(商品数量：{{nextItem.goodsCount}}个,已销数量：{{nextItem.goodsSales}}个)</span> 
                    <el-button size="mini" type="primary" @click="modifyNext(nextItem.id,nextItem.name,nextItem.imageKey)">修 改</el-button>
                    <el-button size="mini" type="danger" @click="deletes(nextItem.id)">删 除</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>

        <!-- 添加修改一级分类弹窗 -->
        <addDeleteOneClassPop ref="addDelete"></addDeleteOneClassPop>
        
        <!-- 添加修改二级分类弹窗 -->
        <addDeleteTwoClassPop ref="addDeleteTwo"></addDeleteTwoClassPop>
    </div>

</template>

<script>
import {getGoodsClassRequest,deleteClass,sortClass} from '@/network/api'
import addDeleteOneClassPop from './common/addDeleteOneClassPop.vue'
import addDeleteTwoClassPop from './common/addDeleteTwoClassPop.vue'
export default {
    props: {

    },
    data() {
        return {
            classList:[],
            ids:[]
        };
    },
    components: {
        addDeleteOneClassPop,addDeleteTwoClassPop
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.getGoodsClassRequest()
    },
    methods: {
        // 获取商品分类
        getGoodsClassRequest(){
            getGoodsClassRequest().then(res =>{
                this.ids = []
                this.classList = res.data.content
                this.classList.forEach((item,index)=>{
                    this.ids.push(item.id)
                })
            })
        },

        // 添加一级分类
        add(){
            this.$refs.addDelete.open("添加分类",null)
        },
        // 修改一级分类
        modify(id){
            this.$refs.addDelete.open("修改分类",id)
        },
        // 添加二级分类
        addNext(id){
            this.$refs.addDeleteTwo.open(id,'','',1)
        },
        modifyNext(id,name,imgUrl){
            this.$refs.addDeleteTwo.open(id, name, imgUrl,2)
        },
        // 删除分类
        deletes(id){
            this.$confirm('确定删除当前分类?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteClass({params:{id:id}}).then(res =>{
                        if(res.data.messageCode == "MSG_1001"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });   
                            this.getGoodsClassRequest()                         
                        }else{
                            this.$message.error(res.data.message)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },

        swapArray(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },

        // 向下排序
        Down(index){
            this.swapArray(this.ids, index, index + 1);
            let parms = {
                ids:this.ids,
                parentId:null
            }
            sortClass(parms).then(res =>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.getGoodsClassRequest()
                }else{
                    this.$message.error(res.data.message);
                }
            })
        },

        // 向上排序
        Up(index){
            this.swapArray(this.ids, index, index - 1);
            let parms = {
                ids:this.ids,
                parentId:null
            }
            sortClass(parms).then(res =>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.getGoodsClassRequest()
                }else{
                    this.$message.error(res.data.message);
                }
            })
        }

    },
};
</script>

<style scoped lang="less">
    .title_top{
        margin-bottom: 50px;
        span{
            margin-right: 20px;
        }
    }
    .next{
        margin-left: 20px;
    }
    .nextClass{
        display: flex;
        align-items: center;
        margin-left: 50px;
        padding: 10px 0;
        border-bottom: 1px solid #EBEEF5;
        .img{
            margin-right: 20px;
        }
    }
    .icon{
        margin-right:20px;
    }
    .center{
        margin: 0 20px;
    }
</style>
