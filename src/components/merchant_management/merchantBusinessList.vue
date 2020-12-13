<template>
  <div class="contents">
    <span>商户行业分类管理：{{content.length}}个分类</span>

    <ul>
      <li v-for="(item,index) in content" :key="index">{{item.name}} (商品数量{{item.count}})个</li>
    </ul>
  </div>
</template>

<script>
import { getMerchantBusinessList } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      content: []
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getMerchantBusinessList();
  },
  methods: {
    getMerchantBusinessList() {
      getMerchantBusinessList().then(res => {
        if (res.data.content) {
          this.content = res.data.content;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
ul {
  margin-top: 20px;
  li {
    width: 500px;
    border-bottom: 1px solid black;
    padding: 15px 0;
  }
}
</style>
