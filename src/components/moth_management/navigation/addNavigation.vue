<template>
  <div class="wrap">
    <div class="btnBox">
      <span v-if="navigationType == 1">配置导航时请注意前端显示视觉效果，同时你也可在此页面批量配置导航营销功能。</span>
      <span v-if="navigationType == 2">配置导航时请注意前端显示视觉效果，长方形样式位置是固定的，不可调整和被替换哦。</span>
      <span v-if="navigationType == 3">配置导航时请注意前端显示视觉效果，正方形样式记得要配置2个导航入口哦</span>
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
            <el-form-item label="导航名称：" prop="title">
              <el-input v-model="ruleForm.title" style="width:300px" placeholder="请输入导航名称"></el-input>
            </el-form-item>
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
            <el-form-item label="导航路径：" prop="param">
              <el-button size="small" type="primary" @click="selectedAddress">选择路径</el-button>
              <span
                style="margin-left:10px;font-size:12px;color:#409EFF;"
                v-if="radioName"
              >路径：{{radioName}}</span>
            </el-form-item>
            <el-form-item label="导航排序：" prop="orderNo">
              <el-input
                v-model="ruleForm.orderNo"
                style="width:300px"
                placeholder="数值越大排序越靠后，前端为横向排序"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="stylePreview" v-if="navigationType == 2 || navigationType == 3">
        <span>样式预览：</span>
        <div class="styleBox">
          <div class="rectangle">长方形样式</div>
          <span class="square" style="margin-right:15px">正方形</span>
          <span class="square">正方形</span>
        </div>
      </div>
    </div>
    <!-- 选择路径弹框 -->
    <addNavigation ref="addNavigation" @func="getRadioData"></addNavigation>
  </div>
</template>
<script>
import { addOrUpdateNavigation, findDetailNavigation } from "@/network/api";
import addNavigation from "./addNavigationDialog";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      myHeaders: { token: "" },
      fullscreenLoading: false, // elementui菊花图
      navigationType: "", // 导航类型
      ruleForm: {
        id: null,
        title: "",
        iconKey: "",
        category: "",
        param: "",
        orderNo: "",
        paramExt: "",
        navType: "", // 导航类别：1-营销导航 2-活动导航,默认为1
        showStyle: "" // 显示样式：1-长方形 2-正方形,默认为1
      },
      radioName: "",
      iconUrl: "",
      rules: {
        title: [
          { required: true, message: "请输入导航名称", trigger: "blur" },
          { min: 1, max: 8, message: "最多输入8个字符", trigger: "blur" }
        ],
        iconKey: [{ required: true, message: "请上传图片" }],
        param: [{ required: true, message: "请选择路径" }],
        orderNo: [
          { required: true, message: "请输入导航排序", trigger: "blur" },
          { pattern: /^[0-9]\d*$/, message: "格式不正确", trigger: "blur" },
          { min: 1, max: 6, message: "最多输入6个字符", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    addNavigation
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    // type 1-添加或修改图标导航 2-添加或修改长方形样式活动导航 3-添加或修改正方形样式活动导航
    this.navigationType = this.$route.query.type;
    if (this.navigationType != 1) {
      this.ruleForm.navType = 2;
    }
    // showStyle 显示样式：1-长方形 2-正方形
    this.ruleForm.showStyle = this.$route.query.showStyle;
    // 如果this.$route.query.id存在，说明为修改导航，否则为添加导航
    if (this.$route.query.id) {
      let id = this.$route.query.id;
      let param = {
        id: id
      };
      findDetailNavigation(param).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            // 遍历this.ruleForm给this.ruleForm赋值
            for (let key in this.ruleForm) {
              this.ruleForm[key] = data[key];
            }
            this.ruleForm.orderNo = this.ruleForm.orderNo.toString();
            this.radioName = data.pageName;
            this.iconUrl = data.iconUrl;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  methods: {
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrUpdateNavigation(this.ruleForm).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.$router.go(-1);
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
.wrap {
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
    .stylePreview {
      padding-top: 30px;
      margin-left: 200px;
      font-size: 14px;
      display: flex;
      .styleBox {
        height: 230px;
        border: 1px solid #000;
        border-radius: 10px;
        padding: 10px;
        margin-left: 10px;
        .rectangle {
          width: 260px;
          height: 80px;
          border: 1px solid #000;
          margin: 0 auto;
          border-radius: 8px;
          line-height: 80px;
          text-align: center;
        }
        .square {
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          border: 1px solid #000;
          border-radius: 8px;
          display: inline-block;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>