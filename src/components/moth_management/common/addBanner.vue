<template>
    <div>
         <el-dialog
            :title="title==1?'添加轮播图':'修改轮播图'"
            :visible.sync="DialogVisible"
            width="500px"
            center>
            <el-form ref="form" label-width="100px">
                <el-form-item label="图片:">
                    <el-upload
                        class=""
                        action=""
                        :auto-upload="false"
                        :show-file-list="false"                        
                        drag
                        :on-change="changeUpload"
                        >
                        <el-image v-if="imageUrl" :src="imageUrl" fit="contain" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item >

                <el-form-item label="选择跳转链接:">
                    <el-select v-model="valueOne" @change=changeValueOne placeholder="跳转内容">
                        <el-option
                        v-for="item in optionsOne"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="showTwo">
                    <el-cascader
                            ref="cascaderAddr"
                            v-model="valueTwo"
                            @change="changeValueTwo"
                            :options="optionsTwo"
                            :props="defaultParams">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="" @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span>

            <el-dialog
                title="选择商品"
                :visible.sync="RelatedVisible"
                width="400px"
                append-to-body
                :show-close=false
                :close-on-click-modal=false
                :close-on-press-escape=false
            >
                <div>
                    <el-input style="width:250px" placeholder="关键字检索" v-model="name"></el-input>
                    <el-button type="primary" @click="search">搜索</el-button>
                </div>
                
                <div v-for="(item,index) in searchResult" :key="index" class="seachReasult" :title="item.name" @click="handleReasult(item)">
                        {{item.name}}
                </div>

                <div v-show="showNone" class="none">
                    没有这个商品
                </div>
                

                <span slot="footer" class="dialog-footer">
                    <el-button @click="close">关 闭</el-button>
                </span>
            </el-dialog>            
        </el-dialog>
    </div>
</template>

<script>
import {getGoodsClassRequest,searchGoodsByName,addBanner,updateBanner} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            title:"",
            imageUrl:"",
            goodsID:"",
            DialogVisible:false,
            RelatedVisible:false,
            showTwo:false,
            categoryId:"",
            searchResult:[],
            name:'',
            file:{},
            defaultParams: {
                label: 'name',
                value: 'id',
                children: 'nextLevelData',
                checkStrictly: true
            },
            optionsOne: [
                {
                    id: 1,
                    name: '商品详情页',
                }, 
                {
                    id: 2,
                    name: '商品分类页',
                },
                {
                    id: 4,
                    name: '会员页'
                },
                {
                    id: 5,
                    name: '话题分类页' 
                },
                {
                    id: 6,
                    name: '话题详情页'
                },
                {
                    id: 7,
                    name: '充值页'
                },
                {
                    id: 8,
                    name: '商家入驻页'
                }
            ],
            valueOne: '',
            optionsTwo:[],
            valueTwo: '',
            returnedItem:{},
            showNone:false,
            forwardDestId:"",//轮播图跳转目标页id
            forwardParamId:"" // 所选择商品id或者所选分类id
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
        this.getGoodsClass()
    },
    methods: {
        open(title,item){
            this.DialogVisible = true
            this.showTwo = false
            this.valueOne = ''
            this.valueTwo = ''
            this.title = title
            if(item){
                this.imageUrl = item.imageKey
                this.forwardDestId = item.forwardDest
                this.forwardParamId = item.forwardParam
                this.goodsID = item.id
                // this.$nextTick(()=>{
                //     this.$refs.cascaderAddr.inputValue = item.name
                // })
                
            }else{
                this.imageUrl = ""
                this.forwardDestId = ""
                this.forwardParamId = ""
                // this.$nextTick(()=>{
                //     this.$refs.cascaderAddr.inputValue = ""
                // })
            }
        },
        changeUpload(file, fileList){
            this.file = file
            this.imageUrl = window.URL.createObjectURL(file.raw) 
        },

         // 递归方法
        getTreeData(data){
            // 循环遍历json数据
            for(var i=0;i<data.length;i++){
                if(data[i].nextLevelData.length<1){
                    // children若为空数组，则将children设为undefined
                    data[i].nextLevelData = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].nextLevelData);
                }
            }
            return data;
        },

        // 递归获取对应id是否可以关键字搜索时
        getAmount(arr,id){
            arr.forEach((item) => { 
                 if(id == item.id)
                 {        
                    this.returnedItem = item
                 }
                 else if(item.nextLevelData)
                 {
                    this.getAmount(item.nextLevelData, id);                        
                 }                   
            })
        },

        // 获取下拉选中id
        changeValueOne(val){
            if(val == 1 || val == 2){
                this.showTwo = true
                this.valueTwo = ''
            }else{
                this.showTwo = false
            }
            this.forwardDestId =  val //轮播图跳转目标页id  
        },

        changeValueTwo(val){
            this.forwardParamId = val[val.length - 1] // 所选择商品id或者所选分类id
            if(this.forwardDestId == 1){ 
                this.getAmount(this.optionsTwo,this.forwardParamId)
                let res = this.returnedItem
                if(res.goodsCount>0){
                    this.categoryId = res.id
                    this.RelatedVisible = true
                    this.searchResult = []
                }else{
                    this.categoryId = ""
                    this.RelatedVisible = false
                }
            }
        },
        save(){
            if(!this.imageUrl){
                this.$message.error('图片不能为空')
                return
            }else if(this.file.size / 1024 / 1024 > 2){
                this.$message.error('上传图片大小不能超过 2MB!');
                return
            }else if(this.showTwo && !this.valueTwo){
                this.$message.error('请选择跳转内容');
                return
            }
            let formData = new FormData();
            formData.append("icon", this.file.raw)
            if(this.title == 1){
                let param = {
                    category:1,
                    forwardDest:this.forwardDestId,
                    forwardParam:this.forwardParamId
                }
                for (let key in param) {
                    if (typeof param[key] === 'object') {
                    formData.append(key, JSON.stringify(param[key]))
                    } else {
                    formData.append(key, param[key])
                    }
                }
                addBanner(formData).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
                        this.DialogVisible = false;
                        this.$parent.getBanners()
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
            }else{
               let param = {
                    id:this.goodsID,
                    forwardDest:this.forwardDestId,
                    forwardParam:this.forwardParamId
                }
                for (let key in param) {
                    if (typeof param[key] === 'object') {
                    formData.append(key, JSON.stringify(param[key]))
                    } else {
                    formData.append(key, param[key])
                    }
                }
                updateBanner(formData).then(res=>{
                    if(res.data.messageCode == "MSG_1001"){
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
                        this.DialogVisible = false;
                        this.$parent.getBanners()
                    }else{
                        this.$message.error(res.data.message);
                    }
                })                
            }
        },

        // 获取商品分类
        getGoodsClass(){
            getGoodsClassRequest().then(res=>{
                this.optionsTwo = this.getTreeData(res.data.content)
            })
        },

        // 关键字搜索
        search(){
            if(!this.name){
                this.$message.error('关键字不能为空')
                return
            }
            searchGoodsByName({ params:{ categoryId : this.categoryId,name:this.name}}).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.searchResult = res.data.content
                    if(this.searchResult.length>0){
                        this.showNone = false
                    }else{
                        this.showNone = true
                    }
                }else{
                    this.searchResult = []
                }
            })
        },

        // 点击搜索结果
        handleReasult(item){
            this.forwardParamId = item.id
            this.$refs.cascaderAddr.inputValue = item.name
            this.RelatedVisible = false;
        },

        close(){
            this.RelatedVisible = false
            if(this.searchResult.length<1){
                this.valueTwo = ''
            }
           
        }
     },
};
</script>

<style scoped lang="less">
   .seachReasult{
        width: 250px;
        padding: 10px 0;
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: green;
   }
   .none{
       text-align: center;
       color: Grey;
       margin-top: 30px;
   }
</style>
