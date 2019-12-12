<template>
  <div class="contents">
    <span>新品免费体验</span>
    <div class="jupm">
      <span @click="goPage('./zeroMoneyBuy',1)">新人免费体验</span>
      <span @click="goPage('./zeroMoneyBuy',2)">信用卡用户免费领</span>
      <span @click="goPage('./zeroMoneyBuy',4)">FreeBuy购买免费领</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //路由跳转
    goPage(e, activityType) {
      this.$router.push({
        path: e,
        query: {
          activityType: activityType
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.jupm {
  margin-top: 30px;
  span {
    display: inline-block;
    padding: 0 16px;
    height: 200px;
    line-height: 200px;
    border: 1px solid black;
    text-align: center;
    margin-right: 20px;
    cursor: pointer;
    font-size: 26px;
    font-weight: bold;
  }
}
</style>
