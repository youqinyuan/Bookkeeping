<template>
  <div class="addBannerPage">
    <div style="display:flex;margin-top:40px;">
      <span>图片：</span>
      <el-upload
        class="avatar-uploader"
        style="margin-left:6px;"
        action="/opadmin/fileStore/uploadFile"
        :show-file-list="false"
        :limit="1"
        :headers="myHeaders"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="uploadImgError"
      >
        <img style="width:110px;height:110px;margin-top:20px;" :src="imgUrl" alt v-if="imgUrl" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div style="margin-top:80px;">
      <span>导航路径：</span>
      <el-button type="primary" style="margin:0 10px;" @click="selectedAddress">选择路径</el-button>
      <span style="font-size:14px;color:#409EFF;" v-if="radioName">路径：{{radioName}}</span>
    </div>
    <el-button type="primary" style="margin-top:80px;" @click="submit">保存</el-button>
    <!-- 选择路径弹框 -->
    <addNavigation ref="addNavigation" @func="getRadioData"></addNavigation>
  </div>
</template>
<script>
import { addOrUpdateNavigation } from "@/network/api";
import addNavigation from "./navigation/addNavigationDialog";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      fullscreenLoading: false,
      myHeaders: { token: "" },
      imgUrl: "",
      radioName: "",
      ruleForm: {
        navType: "",
        iconKey: "",
        param: "",
        category: "",
        paramExt: ""
      }
    };
  },
  components: {
    addNavigation
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    let query = this.$route.query;
    this.ruleForm.navType = query.navType;
    if (query.item) {
      let item = JSON.parse(query.item);
      for (let key in this.ruleForm) {
        this.ruleForm[key] = item[key];
      }
      this.ruleForm.id = item.id;
      this.imgUrl = item.iconUrl;
      this.radioName = item.pageName;
    }
  },
  methods: {
    // 上传图片之前
    beforeAvatarUpload(file) {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    // 上传图片成功
    handleAvatarSuccess(response, file, fileList) {
      this.imgUrl = response.content.url;
      this.ruleForm.iconKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传图片失败
    uploadImgError(err, file, fileList) {
      this.fullscreenLoading.close();
      this.$message.error("上传图片失败");
    },
    // 选择路径
    selectedAddress() {
      this.$refs.addNavigation.open();
    },
    // 接收子组件传递过来的值
    getRadioData(radioData, radioName, category, paramExt) {
      this.ruleForm.param = radioData;
      this.radioName = radioName;
      this.ruleForm.category = category;
      this.ruleForm.paramExt = category == 3 ? paramExt : null;
    },
    // 保存
    submit() {
      let form = this.ruleForm;
      if (!form.iconKey) {
        this.$message.error("图片不能为空");
        return;
      }
      if (!form.category) {
        this.$message.error("请选择导航路径");
        return;
      }
      addOrUpdateNavigation(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.$router.go(-1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.addBannerPage {
  padding: 20px;
  box-sizing: border-box;
}
</style>