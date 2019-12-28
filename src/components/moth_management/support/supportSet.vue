<template>
  <div class="supportSet">
    <div class="fromBox">
      <el-form ref="form" :model="form" :rules="rules" label-width="0px">
        <el-form-item prop="name">
          <span>每人每天可发起</span>
          <el-input
            v-model="form.AUSPICES_TIMES_USER_PER_DAY"
            style="width:80px;"
            size="small"
            :disabled="disabled"
          ></el-input>
          <span>次赞助</span>
        </el-form-item>
        <el-form-item prop="name2">
          <span>每人每天可赞助他人</span>
          <el-input
            v-model="form.AUSPICES_TIMES_OTHERS_USER_PER_DAY "
            style="width:80px;"
            size="small"
            :disabled="disabled"
          ></el-input>
          <span>次</span>
        </el-form-item>
        <el-form-item prop="name3">
          <span>每个商品可被赞助</span>
          <el-input
            v-model="form.AUSPICES_TIMES_GOODS "
            style="width:80px;"
            size="small"
            :disabled="disabled"
          ></el-input>
          <span>次</span>
        </el-form-item>
        <el-form-item prop="name4">
          <span>赞助发起后持续时间</span>
          <el-input
            v-model="form.AUSPICES_EXPIRE_HOURS "
            style="width:80px;"
            size="small"
            :disabled="disabled"
          ></el-input>
          <span>小时</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="imgWrap">
      <div class="imgTitle">活动头图：</div>
      <div class="imgBox">
        <img :src="imgUrl " v-if="imgUrl" />
        <div
          style="width:300px;height:200px;border:1px solid #eee;line-height:200px;text-align:center;font-size:14px;color:#ccc"
          v-else
        >暂无图片</div>
        <el-upload
          class="upload-demo"
          action="/opadmin/fileStore/uploadFile"
          :limit="1"
          :show-file-list="false"
          :headers="myHeaders"
          :on-success="uploadSuccess"
          :on-error="uploadFail"
          :before-upload="beforeVideoUpload"
          :disabled="disabled"
        >
          <el-button
            size="small"
            type="primary"
            style="margin-top:20px;width:100px;"
            :disabled="disabled"
          >点击更换</el-button>
        </el-upload>
      </div>
    </div>
    <div style="width:100%;height:1px;backgroundColor:#ccc;margin:40px 0px;"></div>
    <el-button
      style="margin-top:40px;margin-left:60px;width:140px;"
      type="danger"
      v-if="disabled"
      @click="disabled = false"
    >修 改</el-button>
    <el-button
      style="margin-top:40px;margin-left:60px;width:140px;"
      type="success"
      v-else
      @click="submitForm('form')"
    >保 存</el-button>
  </div>
</template>
<script>
import { getCookie } from "@/common/cookie.js";
import {
  getAuspicesParamConfig,
  updateAuspicesParamConfig
} from "@/network/api";
export default {
  data() {
    // 自定义表单校验规则
    var supportNum = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (!value) {
        return callback();
      }
      if (!reg.test(value) || value > 100) {
        callback(new Error("不可小于1，不可大于100，不可为小数。"));
      } else {
        callback();
      }
    };
    // 自定义表单校验规则
    var supportNum2 = (rule, value, callback) => {
      var reg = /^[0-9]\d*$/;
      if (!value) {
        return callback();
      }
      if (!reg.test(value) || value > 100) {
        callback(new Error("不可小于0，不可大于100，不可为小数。"));
      } else {
        callback();
      }
    };
    return {
      myHeaders: { token: "" },
      fullscreenLoading: false, // elementui菊花图
      disabled: true,
      imgUrl: "",
      form: {
        AUSPICES_TIMES_USER_PER_DAY: "",
        AUSPICES_TIMES_OTHERS_USER_PER_DAY: "",
        AUSPICES_TIMES_GOODS: "",
        AUSPICES_EXPIRE_HOURS: ""
      },
      MARKETING_AUSPICES_IMG: null,
      rules: {
        AUSPICES_TIMES_USER_PER_DAY: [
          { validator: supportNum, trigger: "blur" }
        ],
        AUSPICES_TIMES_OTHERS_USER_PER_DAY: [
          { validator: supportNum, trigger: "blur" }
        ],
        AUSPICES_TIMES_GOODS: [{ validator: supportNum2, trigger: "blur" }],
        AUSPICES_EXPIRE_HOURS: [{ validator: supportNum, trigger: "blur" }]
      }
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.getAuspicesParamConfig();
  },
  methods: {
    // 获取赞助规则
    getAuspicesParamConfig() {
      getAuspicesParamConfig().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          if (data) {
            data.forEach(item => {
              if (item.key == "MARKETING_AUSPICES_IMG") {
                this.imgUrl = item.value;
              } else {
                this.form[item.key] = item.value;
              }
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传图片之前
    beforeVideoUpload() {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    // 图片上传成功
    uploadSuccess(response, file, fileList) {
      this.MARKETING_AUSPICES_IMG = response.content.key;
      this.imgUrl = response.content.url;
      this.fullscreenLoading.close();
    },
    // 图片上传失败
    uploadFail() {
      this.fullscreenLoading.close();
      this.$message.error("图片上传失败");
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果没有上传图片，提交的表单参数不带有图片的字段
          if (this.MARKETING_AUSPICES_IMG) {
            this.form.MARKETING_AUSPICES_IMG = this.MARKETING_AUSPICES_IMG;
          }
          updateAuspicesParamConfig(this.form).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.MARKETING_AUSPICES_IMG = null;
              this.form = {
                AUSPICES_TIMES_USER_PER_DAY: "",
                AUSPICES_TIMES_OTHERS_USER_PER_DAY: "",
                AUSPICES_TIMES_GOODS: "",
                AUSPICES_EXPIRE_HOURS: ""
              };
              this.getAuspicesParamConfig();
              this.$message.success("保存成功");
              this.disabled = true;
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.fromBox {
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
}
.imgWrap {
  display: flex;
  margin-top: 20px;
  .imgTitle {
    height: 200px;
    line-height: 200px;
  }
  .imgBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 300px;
      height: 200px;
    }
  }
}
</style>