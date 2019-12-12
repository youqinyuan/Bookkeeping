<template>
  <div>
    <el-dialog title :visible.sync="DialogVisible" width="400px" center>
      <div style="text-align: center">
        <el-input-number v-model="changeVaule" @change="handleChange" :min="0" label></el-input-number>
        <div class="simulation">{{changeVaule}}</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateGoodsGrabbedNumber } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      id: "",
      changeVaule: "",
      DialogVisible: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open(id, grabbedNumber) {
      this.changeVaule = grabbedNumber;
      this.id = id;
      this.DialogVisible = true;
    },
    handleChange(value) {},
    save() {
      let parms = {
        goodsId: this.id,
        grabbedNumber: this.changeVaule
      };
      updateGoodsGrabbedNumber(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.$parent.search(1);
          this.DialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.simulation {
  width: 80px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 55px;
  left: 160px;
  z-index: 1000;
}
</style>
