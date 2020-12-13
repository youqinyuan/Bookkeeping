<template>
  <div class="add_set_meal_goods">
    <el-button plain @click="goBack">返回上一页</el-button>
    <div class="formBox">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-position="right">
        <el-form-item label="商品名称:" prop="name">
          <el-input v-model="form.name" style="width:260px;" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="普通拼团原价:" prop="name">
          <el-input v-model="form.ordOrgPrice" style="width:260px;"></el-input>
        </el-form-item>
        <el-form-item label="一折拼团原价:" prop="name">
          <el-input v-model="form.orgPrice" style="width:260px;"></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="name">
          <el-upload
            ref="uploadImg"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-exceed="imgNumber"
            :on-change="changeFile"
            :limit="10"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="所属商家:" prop>
          <el-select v-model="form.merchantId" style="width:260px;">
            <el-option
              v-for="item in businessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返现设置:" prop="name">
          <el-button type="primary" @click="fanxianSet">设置</el-button>
        </el-form-item>
        <div v-if="form.introductions.length == 0">
          <el-form-item label="介绍标题:" prop="name">
            <el-button plain @click="addItem">添加</el-button>
          </el-form-item>
        </div>
        <div v-else v-for="(item,index) in form.introductions" :key="index">
          <el-form-item :label="index == 0 ? '介绍标题:':''" prop="name">
            <el-input v-model="item.title" style="width:260px;" :maxlength="20"></el-input>
            <el-button plain @click="removeItem(index)">删除</el-button>
          </el-form-item>
          <el-form-item label prop>
            <el-upload
              ref="uploadImg"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-remove="handleRemoveImg.bind(null,{'index':index,'data':item})"
              :on-exceed="imgNumberImg"
              :on-change="changeFileImg.bind(null,{'index':index,'data':item})"
              :limit="1"
              :file-list="fileListImg[index]"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label prop="name" v-if="form.introductions.length > 0">
          <el-button plain @click="addItem">添加</el-button>
        </el-form-item>
        <el-form-item label prop="name" label-width="28px">
          <el-button type="primary" style="width:120px;" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 返现设置弹窗 -->
    <fanxianPop ref="fanxian" @func="getFanxianData"></fanxianPop>
  </div>
</template>
<script>
import {
  getBusinessOptionsRequest,
  addEvaluationGoods,
  getEvaluationGoodsDetail,
  updateEvaluationGoods
} from "@/network/api";
import fanxianPop from "../common/fanxianPop2";
export default {
  data() {
    return {
      id: "",
      form: {
        name: "",
        ordOrgPrice: "",
        orgPrice: "",
        merchantId: "",
        goodsImageFiles: [],
        stockDetail: {},
        introductions: []
      },
      fileList: [], // 上传的文件列表，用于图片回显
      fileListImg: [], // 上传的文件列表，用于图片回显
      businessOptions: [],
      rules: {}
    };
  },
  components: {
    fanxianPop
  },
  created() {
    this.id = this.$route.query.id;
    if (this.id) {
      // 编辑-查询商品详情
      this.getEvaluationGoodsDetail();
    }
    // 获取商家列表数据
    this.getBusinessOptions();
  },
  methods: {
    // 查询商品详情
    getEvaluationGoodsDetail(id) {
      let parms = {
        id: this.id
      };
      getEvaluationGoodsDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          let stockDetail = res.data.content.stockDetail;
          this.form.name = content.name;
          this.form.ordOrgPrice = stockDetail.ordOrgPrice;
          this.form.orgPrice = stockDetail.orgPrice;
          this.form.merchantId = content.merchantId;
          this.form.stockDetail.specCashBacks = stockDetail.specCashBacks;
          this.form.stockDetail.periodScope = stockDetail.specPeriodScope;
          content.imageUrls.forEach(val => {
            this.form.goodsImageFiles.push({
              url: val
            });
            this.fileList.push({
              url: val
            });
          });
          content.introductions.forEach(val => {
            this.form.introductions.push({
              title: val.title,
              image: {
                url: val.imageUrl
              }
            });
            this.fileListImg.push([
              {
                url: val.imageUrl
              }
            ]);
          });
          // 把请求回来的图片url转化为base64格式的
          this.form.goodsImageFiles.forEach(async val => {
            val.url = await this.cacheImage(val.url);
          });
          // 把请求回来的图片url转化为base64格式的
          this.form.introductions.forEach(async val => {
            val.image.url = await this.cacheImage(val.image.url);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传图片
    changeFile(file, fileList) {
      let that = this;
      this.fileList = fileList;
      let image = new Image();
      image.src = file.url;
      image.onload = function() {
        let base64 = that.getBase64Image(image);
        that.form.goodsImageFiles.push({
          url: base64
        });
      };
    },
    // 删除已经上传的图片
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.form.goodsImageFiles.splice(index, 1);
      this.fileList = fileList;
    },
    // 上传图片超出个数限制时的钩子
    imgNumber() {
      this.$message.error("最多添加10张图片");
    },
    // 上传图片
    changeFileImg(obj, file, fileList) {
      let that = this;
      let index = obj.index;
      let image = new Image();
      image.src = file.url;
      image.onload = function() {
        let base64 = that.getBase64Image(image);
        that.form.introductions[index].image.url = base64;
      };
    },
    // 删除已经上传的图片
    handleRemoveImg(obj, file, fileList) {
      let index = obj.index;
      this.form.introductions[index].image.url = "";
    },
    // 上传图片超出个数限制时的钩子
    imgNumberImg() {
      this.$message.error("最多添加1张图片");
    },

    // 缓存图片
    async cacheImage(src) {
      var baseImg = null;

      if (src.substring(0, 4) === "data") return src;

      await new Promise(resolve => {
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = src;
        image.onload = () => {
          let dataURL = this.getBase64Image(image);
          resolve(dataURL);
        };
      }).then(res => {
        baseImg = res;
      });

      return baseImg;
    },
    // 图片格式转为base64
    getBase64Image(image) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      let type = image.src.substring(
        image.src.lastIndexOf(".") + 1,
        image.src.lastIndexOf(".") + 4
      );
      let dType = type === "jpg" ? "jpeg" : "png";
      let dataURL = canvas.toDataURL(`image/${dType}`);
      return dataURL;
    },
    // 打开返现设置弹窗
    fanxianSet() {
      if (!this.form.ordOrgPrice) {
        this.$message.error("请先填写商品价格");
        return;
      }
      this.$refs.fanxian.open(this.form.ordOrgPrice, this.form.stockDetail);
    },
    // 获取设置的返现数据
    getFanxianData(data) {
      this.form.stockDetail = data;
    },
    // 获取商家列表数据
    getBusinessOptions() {
      let parms = {
        businessId: 0
      };
      getBusinessOptionsRequest({ params: parms }).then(res => {
        if (res.data.messageCode === "MSG_1001") {
          let businessOptions = [];
          res.data.content.map(item => {
            businessOptions.push({
              label: item.storeName,
              value: item.id
            });
          });
          this.businessOptions = businessOptions;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加
    addItem() {
      if (this.form.introductions.length >= 5) {
        this.$message.error("最多可添加5组");
        return;
      }
      this.form.introductions.push({
        title: "",
        image: {
          url: ""
        }
      });
    },
    // 删除
    removeItem(index) {
      this.form.introductions.splice(index, 1);
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          if (!form.name) {
            this.$message.error("商品名称不能为空");
            return;
          }
          if (!form.ordOrgPrice || !form.orgPrice) {
            this.$message.error("请填写商品价格");
            return;
          }
          if (this.fileList.length == 0) {
            this.$message.error("请上传图片");
            return;
          }
          if (!form.merchantId) {
            this.$message.error("请选择所属商家");
            return;
          }
          if (form.stockDetail.length == 0) {
            this.$message.error("请添加返现设置");
            return;
          }
          let a = true;
          let b = true;
          form.introductions.forEach(val => {
            if (!val.title) {
              a = false;
            }
            if (!val.image.url) {
              b = false;
            }
          });
          if (!a) {
            this.$message.error("标题不能为空");
            return;
          }
          if (!b) {
            this.$message.error("请补全图片");
            return;
          }
          const formData = new FormData();
          for (let key in form) {
            if (typeof form[key] === "object") {
              formData.append(key, JSON.stringify(form[key]));
            } else {
              formData.append(key, form[key]);
            }
          }
          if (this.id) {
            // 修改商品保存
            formData.append("id", this.id);
            updateEvaluationGoods(formData).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("添加成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            // 添加商品保存
            addEvaluationGoods(formData).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("添加成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
        }
      });
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.add_set_meal_goods {
  padding: 20px;
  box-sizing: border-box;
  .formBox {
    margin-left: 60px;
    margin-top: 40px;
  }
}
</style>