
<template>
  <div class="addDialog">
    <el-button type="info" style="width:120px;" @click="back">返回</el-button>
    <div class="content">
      <div class="items">
        <span>{{typeName}}名称：</span>
        <el-input type="text" v-model="form.title" style="width:180px;" :maxlength="20"></el-input>
      </div>
      <div class="items" style="display:flex;">
        <span>{{typeName}}样式：</span>
        <el-upload
          class="upload-demo"
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
          <el-button size="small" type="primary" v-else>点击上传</el-button>
          <div slot="tip" class="el-upload__tip">上传尺寸：宽110px*高110px</div>
        </el-upload>
      </div>
      <div class="items">
        <span>显示页面：</span>
        <el-button type="primary" @click="pageDialog_page = true">选择页面</el-button>
        <span
          style="font-size:14px;color:#409EFF;margin-left:10px;"
          v-if="form.displayPage.length > 0"
        >
          <span>路径：</span>
          <span v-for="(item,index) in form.displayPage" :key="index">
            <span v-if="item == 1">首页</span>
            <span v-if="item == 2">商城</span>
            <span v-if="item == 3">寻商品</span>
            <span v-if="item == 4">订单交易</span>
            <span v-if="item == 5">我的</span>
            <span v-if="index != form.displayPage.length - 1">|</span>
          </span>
        </span>
      </div>
      <div class="items">
        <span>显示用户：</span>
        <el-button type="primary" @click="pageDialog_users = true">选择用户</el-button>
        <span style="font-size:14px;color:#409EFF;margin-left:10px;" v-if="form.displayUserType">
          <span>用户：</span>
          <span v-if="form.displayUserType == 1">全部用户</span>
          <span v-if="form.displayUserType == 2">新注册用户</span>
          <span v-if="form.displayUserType == 3">导入用户</span>
        </span>
      </div>
      <div class="items">
        <span>跳转路径：</span>
        <el-button type="primary" @click="selectedAddress">选择路径</el-button>
        <span
          style="font-size:14px;color:#409EFF;margin-left:10px;"
          v-if="routeName"
        >路径：{{routeName}}</span>
      </div>
      <div class="items" v-if="form.navType == 2">
        <span>关闭按钮：</span>
        <el-radio-group v-model="form.showStyle">
          <el-radio-button label="1">顶部靠右</el-radio-button>
          <el-radio-button label="2">无需关闭按钮</el-radio-button>
        </el-radio-group>
      </div>
      <div class="items">
        <span>优先级：</span>
        <el-input type="text" v-model="form.orderNo" style="width:120px;"></el-input>
      </div>
      <div class="items">
        <div>
          <span>{{typeName}}唤醒：</span>
          <span>用户关闭{{typeName}}</span>
          <el-select v-model="form.closeAwaken" style="width:100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>分钟后加载时再次发起{{typeName}}</span>
        </div>
        <div style="margin-left:84px;margin-top:10px;">
          <span>用户点击跳转</span>
          <el-select v-model="form.jumpAwaken" style="width:100px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>分钟后加载时再次发起{{typeName}}</span>
        </div>
      </div>
      <el-button type="primary" style="width:120px;margin-top:30px;" @click="submit">保存</el-button>
    </div>

    <!-- 选择页面弹窗 -->
    <el-dialog
      title
      :visible.sync="pageDialog_page"
      width="360px"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-checkbox-group v-model="form.displayPage" class="pageDialog">
        <el-checkbox class="pageDialog_items" label="1">首页</el-checkbox>
        <el-checkbox class="pageDialog_items" label="2">商城</el-checkbox>
        <el-checkbox class="pageDialog_items" label="3">寻商品</el-checkbox>
        <el-checkbox class="pageDialog_items" label="4">订单交易</el-checkbox>
        <el-checkbox class="pageDialog_items" label="5">我的</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pageDialog_page = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择用户弹窗 -->
    <el-dialog
      title
      :visible.sync="pageDialog_users"
      width="400px"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-radio-group
        v-model="form.displayUserType"
        class="pageDialog"
        @change="selectDisplayUserType"
      >
        <el-radio class="pageDialog_items" :label="1">
          <div style="width:260px;text-align:center;">全部用户</div>
        </el-radio>
        <el-radio class="pageDialog_items" :label="2">
          <div style="width:260px;text-align:center;">新注册用户</div>
          <div style="width:260px;text-align:center;">(注册一周内的用户)</div>
        </el-radio>
        <el-radio class="pageDialog_items" :label="3">
          <div style="width:260px;text-align:center;">导入用户</div>
          <div style="width:260px;text-align:center;" v-if="excelName">{{excelName}}</div>
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pageDialog_users = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择路径弹框 -->
    <addNavigation ref="addNavigation" @func="getRadioData"></addNavigation>
    <!-- 导入用户弹窗 -->
    <ImportMerchantPop ref="ImportMerchant" @func="getExcelData"></ImportMerchantPop>
  </div>
</template>
<script>
import { addOrUpdate_floating, findDetail_floating } from "@/network/api";
import { getCookie } from "@/common/cookie.js";
import addNavigation from "../navigation/addNavigationDialog";
import ImportMerchantPop from "./ImportMerchantPop";
export default {
  data() {
    return {
      fullscreenLoading: false,
      myHeaders: { token: "" },
      pageDialog_page: false,
      pageDialog_users: false,
      imgUrl: "",
      typeName: "",
      routeName: "",
      excelName: "",
      form: {
        id: "",
        navType: "",
        title: "",
        iconKey: "",
        displayPage: [],
        displayUserType: "",
        category: "",
        param: "",
        paramExt: "",
        showStyle: "1",
        orderNo: "",
        closeAwaken: 1,
        jumpAwaken: 1
      },
      excel: "",
      options: [
        {
          value: 1,
          label: "0min"
        },
        {
          value: 2,
          label: "5min"
        },
        {
          value: 3,
          label: "10min"
        },
        {
          value: 4,
          label: "15min"
        },
        {
          value: 5,
          label: "30min"
        },
        {
          value: 6,
          label: "1h"
        },
        {
          value: 7,
          label: "3h"
        },
        {
          value: 8,
          label: "6h"
        },
        {
          value: 9,
          label: "12h"
        },
        {
          value: 10,
          label: "1天"
        },
        {
          value: 11,
          label: "3天"
        },
        {
          value: 12,
          label: "1周"
        },
        {
          value: 13,
          label: "+∞"
        }
      ]
    };
  },
  components: {
    addNavigation,
    ImportMerchantPop
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    let type = this.$route.query.type;
    this.form.navType = type;
    this.typeName = type == 1 ? "弹窗" : "浮窗";
    let id = this.$route.query.id;
    if (id) {
      // 如果id存在，则为编辑
      this.findDetail_floating(id);
    }
  },
  methods: {
    // 查询明细
    findDetail_floating(id) {
      let parms = {
        id: id
      };
      findDetail_floating({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.form = content;
          this.form.displayPage = this.form.displayPage.split(",");
          this.imgUrl = content.iconUrl;
          this.routeName = content.pageName;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
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
      this.form.iconKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传图片失败
    uploadImgError(err, file, fileList) {
      this.fullscreenLoading.close();
      this.$message.error("上传图片失败");
    },
    // 选择显示用户
    selectDisplayUserType(val) {
      // 上传自定义用户
      if (val == 3) {
        this.$refs.ImportMerchant.open();
      }
    },
    // 获取上传的自定义用户excel
    getExcelData(file) {
      this.excel = file;
      this.excelName = file.name;
    },
    // 选择路径
    selectedAddress() {
      this.$refs.addNavigation.open();
    },
    // 接收子组件传递过来的值
    getRadioData(radioData, radioName, category, paramExt) {
      this.form.param = radioData;
      this.routeName = radioName;
      this.form.category = category;
      this.form.paramExt = category == 3 ? paramExt : null;
    },
    // 保存
    submit() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (this.excel) {
        form.excel = this.excel;
      } else {
        form.excel = "";
      }
      // 正整数正则验证
      let a = /^[1-9]\d*$/;
      if (!form.title) {
        this.$message.error("名称不能为空");
        return;
      }
      if (!form.iconKey) {
        this.$message.error("样式不能为空");
        return;
      }
      if (form.displayPage.length == 0) {
        this.$message.error("请选择显示页面");
        return;
      }
      if (!form.displayUserType) {
        this.$message.error("请选择显示用户");
        return;
      }
      if (!form.category) {
        this.$message.error("请选择跳转路径");
        return;
      }
      if (!a.test(form.orderNo)) {
        this.$message.error("优先级只能为正整数");
        return;
      }
      if (!form.closeAwaken || !form.jumpAwaken) {
        this.$message.error("弹窗唤醒不能为空");
        return;
      }
      form.displayPage = form.displayPage.join(",");
      let formData = new FormData();
      for (let key in form) {
        if (typeof form[key] === "object") {
          if (key == "excel") {
            formData.append(key, form[key]);
          } else {
            formData.append(key, JSON.stringify(form[key]));
          }
        } else {
          formData.append(key, form[key]);
        }
      }
      addOrUpdate_floating(formData).then(res => {
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
.addDialog {
  padding: 20px;
  box-sizing: border-box;
  .content {
    margin-top: 40px;
    margin-left: 40px;
    .items {
      margin-top: 30px;
    }
  }
}
.pageDialog {
  width: 100%;
  display: flex;
  flex-direction: column;
  .pageDialog_items {
    width: 100%;
    height: 46px;
    border: 1px solid #ccc;
    margin-top: 14px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    box-sizing: border-box;
    border-radius: 40px;
  }
}
</style>