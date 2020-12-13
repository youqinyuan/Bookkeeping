<template>
  <div>
    <el-dialog :title="title" :visible.sync="DialogVisible" width="400px" center>
      <el-input v-model="vaule" maxlength="6" placeholder="最多输入6个字符"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addClass, updateClass } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      title: "",
      vaule: "",
      id: "",
      DialogVisible: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open(title, id) {
      this.DialogVisible = true;
      this.title = title;
      this.id = id;
    },
    save() {
      if (this.vaule.length < 1) {
        this.$message.error("字符不能为空");
        return;
      }
      var parms;
      if (this.id == null) {
        parms = {
          parentId: null,
          name: this.vaule
        };
        addClass(this.qs.stringify(parms)).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.DialogVisible = false;
            this.vaule = "";
            this.$parent.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        parms = {
          id: this.id,
          name: this.vaule
        };
        updateClass(this.qs.stringify(parms)).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.DialogVisible = false;
            this.vaule = "";
            this.$parent.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
</style>
