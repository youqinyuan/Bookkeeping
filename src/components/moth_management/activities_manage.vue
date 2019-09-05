<template>
    <div class="contents">
        <span>拉新促活</span>
        <div class="jupm">
            <span @click="gozero">0元购</span>
            <span>自定义活动页</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

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
        gozero(){
            this.$router.push('./zeroMoneyBuy')
        }
    },
};
</script>

<style scoped lang="less">
    .jupm{
        margin-top:30px;
        span{
            display: inline-block;
            width: 200px;
            height: 200px;
            line-height: 200px;
            border: 1px solid black;
            text-align: center;
            margin-right: 20px;
            cursor: pointer;
            font-size: 30px;
            font-weight: bold;
        }
    }
</style>
