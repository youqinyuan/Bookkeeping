<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" center>
      <div style="text-align:center">
        <span>区域名称</span>
        <el-input v-model="name" style="width:200px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" @>保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { modifyByDistrictId } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      title: "",
      cityId: "",
      districtId: "",
      name: "",
      dialogVisible: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open(title, item) {
      this.title = title;
      this.cityId = this.$route.query.id;
      if (item) {
        this.districtId = item.id;
        this.name = item.name;
      } else {
        this.districtId = "";
        this.name = "";
      }
      this.dialogVisible = true;
    },
    save() {
      if (!this.name) {
        this.$message.error("请输入区域名称");
        return;
      }
      let parms = {
        cityId: this.cityId,
        districtId: this.districtId,
        name: this.name
      };
      modifyByDistrictId(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogVisible = false;
          this.$message.success(res.data.message);
          this.$parent.getDistrictByCityId();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>
