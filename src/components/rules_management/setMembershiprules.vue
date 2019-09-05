<template>
    <div class="contents">
        <div class="pluscontent">
            <div class="title">
                <span>plus会员:</span>
                <span class="xg" @click="revise" v-if="right">修改</span>
                <span class="xg" v-else @click="save">保存</span>
            </div>
            <div class="con">
                <span>成为会员条件：</span>
                <ul>
                    <li v-for="(item,index) in content" :key="index">
                        <el-checkbox v-model="item.enabled">
                        <span>{{index+1}}</span>.<span>{{item.key | plusSet}}</span><el-input :disabled="disabled" class="inp" v-model.number="item.value" placeholder=""></el-input>-送1个月
                        </el-checkbox>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {getMemberParamConfig,updateMemberParamConfig} from '@/network/api'
export default {
    props: {

    },
    data() {
        return {
            right:true,
            content:[],
            disabled:true
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
        this.getMemberParamConfig()
    },
    beforeRouteLeave(to, from, next){
        if(this.right == false){
            this.$confirm('', '内容未保存，需要保存吗', {
                confirmButtonText: '保存',
                cancelButtonText: '不用保存',
                center: true
                }).then(() => {
                    next()
                    this.save()
                }).catch(() => {
                    next()
            });
        }else{
            next()
        }
    },
    methods: {
        getMemberParamConfig(){
            getMemberParamConfig().then(res=>{
                if(res.data.content){
                    let result = res.data.content
                    for(var i=0;i<result.length;i++){
                        if(result[i].enabled == 1){
                            result[i].enabled = true
                        }else if(result[i].enabled == 2){
                            result[i].enabled = false
                        }
                    }
                    this.content = result
                }
            })
        },
        revise(){
            this.right = false
            this.disabled = false
        },
        save(){
            this.right = true
            this.disabled = true
            let copyContent = JSON.parse(JSON.stringify(this.content))
            for(var i=0;i<copyContent.length;i++){
                if(copyContent[i].enabled == true){
                    copyContent[i].enabled = 1
                }else if(copyContent[i].enabled == false){
                    copyContent[i].enabled = 2
                }
            }
            updateMemberParamConfig(copyContent).then(res=>{
                if(res.data.messageCode == "MSG_1001"){
                    this.$message.success('修改成功')
                    this.getMemberParamConfig()
                }else{
                    this.$message.error(res.data.message)
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .pluscontent{
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
            li{
                margin-top: 15px;
                .inp{
                    width: 250px;
                }
            }
        }
    }
</style>
