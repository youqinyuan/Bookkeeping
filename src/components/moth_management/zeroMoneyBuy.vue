<template>
    <div class="contents">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="clear:both">
            <el-tab-pane label="活动设置" name="tab_1">
                <activeSet></activeSet>
            </el-tab-pane>
            <el-tab-pane label="往期活动记录" name="tab_2">
                <activeRecord></activeRecord>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import activeSet from './common/activeSet'
import activeRecord from './common/activeRecord'
export default {
    props: {

    },
    data() {
        return {
            activeName:"tab_1",
        };
    },
    components: {
        activeSet,activeRecord
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
        handleClick(tab,event){
            
        },
    },
};
</script>

<style scoped lang="less">
    .bor_content{
        border: 1px solid black;
        padding: 10px;
        margin-bottom: 10px;
        div{
            margin-bottom: 20px;
        }
        li{
            margin-top: 20px;
        }
        span{
            margin-right: 30px;
        }
    }
</style>
