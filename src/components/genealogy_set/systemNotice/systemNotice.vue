<template>
  <div class="systemNotice">
    <div class="container">
      <div class="items" @click="nav('/wxappNotice')">小程序通知设置</div>
      <div class="items" @click="nav('/shortMessage')">短信通知</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 路由跳转
    nav(router) {
      this.$router.push(router);
    }
  }
};
</script>
<style lang="less" scoped>
.systemNotice {
  padding: 20px;
  .container {
    width: 100%;
    display: flex;
    .items {
      width: 220px;
      height: 200px;
      text-align: center;
      line-height: 200px;
      font-size: 26px;
      font-weight: bold;
      border: 1px solid #000;
      cursor: pointer;
      margin: 10px;
    }
  }
}
</style>