<template>
  <div class="hero_list">
    <div class="btnBox">
      <span>配置导航时请注意前端显示视觉效果，同时你也可在此页面批量配置导航营销功能。</span>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
    <div class="addNavigationBox">
      <div class="addNavigator">
        <div class="formBox">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="导航图标：" prop="iconKey">
              <el-upload
                class="upload-demo"
                action="/opadmin/fileStore/uploadFile"
                :limit="1"
                :show-file-list="false"
                :headers="myHeaders"
                :on-success="uploadSuccess"
                :on-error="uploadFail"
                :before-upload="beforeVideoUpload"
              >
                <el-button size="small" type="primary">上传图片</el-button>
                <div slot="tip" class="el-upload__tip" style="color:#999">建议尺寸 150px * 150px</div>
                <img :src="iconUrl" style="width:100px;height:100px;display:block;margin-top:10px;" />
              </el-upload>
            </el-form-item>
            <el-form-item label="导航路径：" prop required>
              <span style="margin-left:10px;font-size:12px;color:#409EFF;">路径：英雄榜</span>
            </el-form-item>
            <el-form-item label="上架状态：" prop>
              <el-button
                type="primary"
                @click="changeNavigationStatus(1)"
                v-if="ruleForm.status == 2"
              >上架</el-button>
              <el-button
                type="primary"
                @click="changeNavigationStatus(2)"
                v-if="ruleForm.status == 1"
              >下架</el-button>
              <span v-if="ruleForm.status == 1">当前状态：已上架</span>
              <span v-if="ruleForm.status == 2">当前状态：已下架</span>
            </el-form-item>
            <el-form-item label="排名管理：" prop>
              <el-button type="primary" @click="nav_zeroListDetail">管理英雄榜</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addOrUpdateNavigation,
  findByHeroRank,
  updateStatusNavigation
} from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      myHeaders: { token: "" },
      fullscreenLoading: false, // elementui菊花图
      navigationType: "", // 导航类型
      ruleForm: {
        id: null,
        title: "英雄榜",
        category: 1,
        iconKey: "",
        navType: 7,
        status: 1,
        param: 22,
        paramExt: ""
      },
      iconUrl: "",
      rules: {
        iconKey: [{ required: true, message: "请上传图片" }]
      }
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.findByHeroRank()
  },
  methods: {
    findByHeroRank() {
      findByHeroRank().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            // 遍历this.ruleForm给this.ruleForm赋值
            for (let key in this.ruleForm) {
              this.ruleForm[key] = data[key];
            }
            this.iconUrl = data.iconUrl;
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
      this.iconUrl = response.content.url;
      this.ruleForm.iconKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 图片上传失败
    uploadFail() {
      this.fullscreenLoading.close();
      this.$message.error("图片上传失败");
    },

    // 上架或者下架
    changeNavigationStatus(status) {
      if (status == 1) {
        // 上架
        var tips = "导航营销上架";
        var tipsContent =
          "是否上架此导航入口？上架前请检查功能是否配置完成，以及前端的视觉效果。";
      } else if (status == 2) {
        // 下架
        var tips = "导航营销下架";
        var tipsContent = "是否下架此导航入口？下架前请确保前端布局完整。";
      }
      this.$confirm(tipsContent, tips, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let params = {
            id: this.ruleForm.id,
            status: status
          };
          updateStatusNavigation(this.qs.stringify(params)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.findByHeroRank();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 管理英雄榜
    nav_zeroListDetail() {
      this.$router.push("/hero_list_detail");
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrUpdateNavigation(this.ruleForm).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.hero_list {
  padding: 20px;
  padding-top: 0px;
  box-sizing: border-box;
  .btnBox {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #888;
  }
  .addNavigationBox {
    display: flex;
    .addNavigator {
      .formBox {
        width: 100%;
        margin-top: 20px;
      }
    }
  }
}
</style>