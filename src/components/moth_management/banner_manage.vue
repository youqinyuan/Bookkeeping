<template>
    <div class="contents">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="爆品首页页面轮播图" name="tab_1">
                <div class="banner_content">
                    <div v-for="(item,index) in bannerList" :key="index" class="banners">
                        <div class="title">
                            <i @click="forward(index)" class="el-icon-d-arrow-left" style="cursor: pointer" v-if="index !=0"></i>
                            <span v-if="index == 0">首图</span>
                            <span @click="setFirst(index)" v-else style="color:#008000;cursor: pointer;margin:0 70px">设为首图</span>
                            <i @click="backward(index)" class="el-icon-d-arrow-right" style="cursor: pointer" v-if="index !=0 && index != bannerList.length-1"></i>
                        </div>
                        <el-image
                        class="imgs"
                        style="width: 250px; height: 100px;cursor: pointer;"
                        :src="item.imageKey"
                        fit="contain"
                        @click="open(2,item)"></el-image>
                        <div class="bot_btn">
                            <el-button type="primary" size="mini" @click="open(2,item)">更换链接</el-button>
                            <div class="name" :title="item.name">{{item.name}}</div>
                            <el-button type="danger" size="mini" @click="deleteBanner(item.id)">删除</el-button> 
                        </div>
                    </div>
                </div>
                <el-button type="primary" @click="open(1,null)" style="margin:50px 0">添加轮播图</el-button> 
            </el-tab-pane>
            
        </el-tabs>


        <addBanner ref="banner"></addBanner>
    </div>
</template>

<script>
import {getSlideShowByCategory,deleteBanner,sortBanner} from '@/network/api'
import addBanner from './common/addBanner'
export default {
    props: {

    },
    data() {
        return {
            activeName:"tab_1",
            bannerList:[],
            ids:[]
        };
    },
    components: {
        addBanner
    },
    computed: {

    },
    watch: {

    },
    created() {
        
    },
    mounted() {
        this.getBanners()
    },
    methods: {
        //切换tab
        handleClick(tab,event){
        
        },
        
        // 打开弹窗
        open(title,item){
            this.$refs.banner.open(title,item)
        },

        // 获取轮播图列表
        getBanners(){
            getSlideShowByCategory({ params:{ category : "1"}}).then(res =>{
                this.ids = []
                if(res.data.messageCode == "MSG_1001"){
                    this.bannerList = res.data.content
                    this.bannerList.forEach((item,index)=>{
                        this.ids.push(item.id)
                    })
                }
            })
        },

        deleteBanner(id){
            this.$confirm('', '确定删除此图片吗', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                deleteBanner({params:{id:id}}).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
                        this.getBanners()
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
            }).catch(() => {

            }); 
        },

        swapArray(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },

        // 向前排序
        forward(index){
            this.swapArray(this.ids, index, index - 1);
            let parms = {
                category:1,
                ids:this.ids
            }
            sortBanner(parms).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.getBanners()
                }else{
                    this.$message.error(res.data.message);
                }
            })

        },

        // 向后排序
        backward(index){
            this.swapArray(this.ids, index, index + 1);
            let parms = {
                category:1,
                ids:this.ids
            }
            sortBanner(parms).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.getBanners()
                }else{
                    this.$message.error(res.data.message);
                }
            })
        },

        // 设为首图
        setFirst(index){
            let s = this.ids.splice(index,1);
            this.ids.unshift(s[0])   
            let parms = {
                category:1,
                ids:this.ids
            }
            sortBanner(parms).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                    this.getBanners()
                }else{
                    this.$message.error(res.data.message);
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
.contents{
    text-align: center;
}
    .banner_content{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .banners{
            margin-right: 50px;
            margin-top: 20px;
            background: LightGray;
            width:250px;
            height: auto;
            padding: 10px 15px;
            box-sizing: content-box;
            .title{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
            }
            .bot_btn{
                display: flex;
                justify-content: space-around;
                align-items: center;
                .name{
                    background: rgba(0, 204, 153, 1);
                    color: white;
                    font-size: 13px;
                    padding: 5px 5px;
                    border-radius: 5px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>
