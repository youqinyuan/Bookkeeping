<template>
  <div class="contents">
    <span>拉新促活</span>
    <div class="jupm">
      <div class="items" @click="nav('./zeroMoneyBuyList')">新品免费体验</div>
      <div class="items" @click="nav('./zeroMoneyBuy',3)">
        <div>渠道合作活动</div>
        <div>(新人免费体验)</div>
      </div>
      <div class="items" @click="nav('./supportPage')">赞助活动</div>
      <div class="items" @click="nav('./newbornZoneList')">新人专区</div>
      <div class="items" @click="nav('./goodsArea')">商品专区</div>
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
    nav(router, activityType) {
      if (activityType) {
        this.$router.push({
          path: router,
          query: {
            activityType: activityType
          }
        });
      } else {
        this.$router.push(router);
      }
    }
  }
};
</script>

<style scoped lang="less">
.jupm {
  margin-top: 30px;
  display: flex;
  .items {
    width: 200px;
    height: 200px;
    border: 1px solid black;
    text-align: center;
    margin-right: 20px;
    cursor: pointer;
    font-size: 26px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
