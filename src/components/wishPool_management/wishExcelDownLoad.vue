<template>
  <div></div>
</template>
<script>
import { exportWishGoodsExcel } from "@/network/api";
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$route.query);
    let param = this.$route.query;
    if (this.beginTime) {
      param.beginTime = param.beginTime.getTime();
    }
    if (this.endTime) {
      param.endTime = param.endTime.getTime();
    }
    console.log(param);
    exportWishGoodsExcel(param).then(res => {
      this.download(res);
    });
  },
  methods: {
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "心愿管理列表.xls");
      document.body.appendChild(a);
      a.click();
    }
  }
};
</script>
<style lang="less" scoped>
</style>