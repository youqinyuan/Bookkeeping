<template>
  <div class="navigationTab">
    <div class="tabBox">
      <el-tabs v-model="activeName">
        <el-tab-pane label="图标导航" name="first">
          <navigationIcon></navigationIcon>
        </el-tab-pane>
        <el-tab-pane label="活动导航" name="second">
          <navigationActivits></navigationActivits>
        </el-tab-pane>
      </el-tabs>
      <div class="btnBox">
        <el-button type="primary" @click="addNavigation_icon">添加图导</el-button>
        <el-button type="primary" @click="dialogVisible = true">添加活导</el-button>
      </div>
    </div>
    <!-- 添加活动导航弹窗 -->
    <el-dialog
      title="选择导航样式"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="rectangle">
        <div>示例图</div>
        <div>长方形样式占用活动专区1行，且为固定样式不支持调整顺序</div>
      </div>
      <el-radio v-model="radio" :label="1" style="margin-top:15px">选择这个长方形样式-此样式为1行1个</el-radio>
      <div class="square">
        <div class="squareItem">示例图</div>
        <div class="squareItem">示例图</div>
      </div>
      <el-radio v-model="radio" :label="2" style="margin-top:15px">选择这个正方形样式-此样式为1行2个</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNavigation_activits">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import navigationIcon from "./navigation_icon";
import navigationActivits from "./navigation_activits";
export default {
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      radio: ""
    };
  },
  components: {
    navigationIcon,
    navigationActivits
  },
  methods: {
    // 添加图标导航
    addNavigation_icon() {
      // type 1-添加或修改图标导航 2-添加或修改长方形样式活动导航 3-添加或修改正方形样式活动导航
      this.$router.push({
        path: "/addNavigation",
        query: {
          type: 1
        }
      });
    },
    // 添加活动导航
    addNavigation_activits() {
      if (!this.radio) {
        this.$message.error("请选择导航样式");
        return;
      }
      // type 1-添加或修改图标导航 2-添加或修改长方形样式活动导航 3-添加或修改正方形样式活动导航
      let type;
      if (this.radio == 1) {
        type = 2;
      } else if (this.radio == 2) {
        type = 3;
      }
      this.$router.push({
        path: "/addNavigation",
        query: {
          type: type
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.navigationTab {
  padding: 20px;
  box-sizing: border-box;
  .tabBox {
    position: relative;
    .btnBox {
      position: absolute;
      top: -10px;
      right: 40px;
    }
  }
  .rectangle {
    width: 360px;
    height: 80px;
    margin: 0 auto;
    border: 1px solid #000;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      font-size: 12px;
      color: #666;
      width: 100%;
      text-align: center;
    }
  }
  .square {
    width: 360px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    div {
      width: 160px;
      height: 160px;
      border-radius: 10px;
      border: 1px solid #000;
      text-align: center;
      line-height: 160px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>