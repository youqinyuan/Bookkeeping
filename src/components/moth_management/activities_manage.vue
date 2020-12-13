<template>
  <div class="contents">
    <span>拉新促活</span>
    <div class="jupm">
      <div class="items" @click="nav('./zeroMoneyBuyList')">新品免费体验</div>
      <div class="items" @click="nav('./zeroMoneyBuy', 3)">
        <div>渠道合作活动</div>
        <div>(新人免费体验)</div>
      </div>
      <div class="items" @click="nav('./supportPage')">赞助活动</div>
      <div class="items" @click="nav('./newbornZoneList')">新人专区</div>
      <div class="items" @click="nav('./goodsArea')">商品专区</div>
      <div class="items" @click="nav('./activityList')">自定义活动</div>
      <div class="items" @click="setExtension">
        <div>推广物料</div>
        <div
          style="
            font-size: 12px;
            color: #409eff;
            margin-top: 10px;
            width: 100%;
            word-wrap: break-word;
            word-break: normal;
          "
          v-if="pageName"
        >
          已选：{{ pageName }}
        </div>
      </div>
    </div>
    <!-- 选择路径弹框 -->
    <addNavigation ref="addNavigation" @func="getRadioData"></addNavigation>
  </div>
</template>

<script>
import { addOrUpdateNavigation, queryPromote } from "@/network/api";
import addNavigation from "./navigation/addNavigationDialog";
export default {
  props: {},
  data() {
    return {
      id: "",
      pageName: "",
    };
  },
  components: {
    addNavigation,
  },
  created() {
    this.queryPromote();
  },
  mounted() {},
  methods: {
    //路由跳转
    nav(router, activityType) {
      if (activityType) {
        this.$router.push({
          path: router,
          query: {
            activityType: activityType,
          },
        });
      } else {
        this.$router.push(router);
      }
    },
    // 查询推广物料设置
    queryPromote() {
      queryPromote().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          if (data) {
            this.id = data.id;
            this.pageName = data.pageName;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置推广物料
    setExtension() {
      this.$refs.addNavigation.open();
    },
    // 接收子组件传递过来的值
    getRadioData(radioData, radioName, category, paramExt) {
      let data = {
        id: this.id,
        param: radioData,
        category: category,
        paramExt: category == 3 ? paramExt : null,
        navType: "13",
      };
      addOrUpdateNavigation(data).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.queryPromote();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.jupm {
  display: flex;
  flex-wrap: wrap;
  .items {
    width: 200px;
    height: 200px;
    border: 1px solid black;
    text-align: center;
    margin-right: 20px;
    margin-top: 20px;
    cursor: pointer;
    font-size: 26px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
