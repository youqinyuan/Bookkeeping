<template>
  <div class="template">
    <div class="left">
      <div class="navTitle">{{form.name}}</div>
      <div class="box">
        <img class="headImg" :src="form.firstImageUrl" alt />
        <div class="goodsBox" v-for="(item,index) in form.activityAreaList" :key="index">
          <div class="title">
            <span class="bigTitle">{{item.title}}</span>
            <span class="smallTitle">{{item.subTitle}}</span>
          </div>
          <div class="goodsArea">
            <div class="goodsItem" v-for="(ite,idx) in item.activityGoodsList" :key="idx">
              <img class="goodsImg" :src="ite.goodsImgUrl" alt />
              <div class="goodsName">{{ite.goodsName}}</div>
              <div class="explainBox">
                <span
                  class="explainItem"
                  v-for="(remark,remarkIdx) in form.remarkList"
                  :key="remarkIdx"
                >{{remark.title}}</span>
              </div>
              <div class="priceBox">
                <span class="price">¥{{ite.orgPrice}}</span>
                <span
                  class="label"
                  v-for="(label,labelIdx) in form.tagList"
                  :key="labelIdx"
                >{{label.title}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div>
        <div style="margin:10px 0px;">头图：</div>
        <el-upload
          action="/opadmin/fileStore/uploadFile"
          list-type="picture-card"
          :headers="myHeaders"
          :on-success="handleAvatarSuccessLabelImg"
          :on-error="uploadImgErrorLabelImg"
          :on-remove="handleRemoveLabelImg"
          :file-list="buttonImageUrl"
          :disabled="isDisabled"
          :on-exceed="btnImgNumber"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="margin-top:10px;">
        <div>
          <span>说明：</span>
          <el-button
            type="text"
            style="margin-left:250px;"
            @click="addRemark"
            :disabled="isDisabled || form.remarkList.length >= 3"
          >添加</el-button>
        </div>
        <div v-for="(item,index) in form.remarkList" :key="index">
          <el-input
            v-model="item.title"
            style="width:340px;margin-top:10px;"
            :maxlength="20"
            :disabled="isDisabled"
          ></el-input>
          <i class="el-icon-remove" v-if="index > 0 && !isDisabled" @click="delRemark(index)"></i>
        </div>
      </div>
      <div style="margin-top:10px;">
        <div>
          <span>标签：</span>
          <el-button
            type="text"
            style="margin-left:250px;"
            @click="addTagList"
            :disabled="isDisabled || form.tagList.length >= 3"
          >添加</el-button>
        </div>
        <div v-for="(item,index) in form.tagList" :key="index">
          <el-input
            v-model="item.title"
            style="width:340px;margin-top:10px;"
            :maxlength="5"
            :disabled="isDisabled"
          ></el-input>
          <i class="el-icon-remove" v-if="index > 0 && !isDisabled" @click="delTagList(index)"></i>
        </div>
      </div>
      <div style="margin-top:20px;">
        <el-button type="primary" @click="back">上一步</el-button>
        <el-button
          type="primary"
          style="margin-left:40px;"
          @click="onSubmit"
          :disabled="isDisabled"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addOrUpdateCustomizeActivity } from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      fullscreenLoading: false,
      isDisabled: false,
      type: "",
      myHeaders: { token: "" },
      form: {},
      buttonImageUrl: []
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.form = JSON.parse(this.$route.query.form);
    if (this.form.firstImageUrl) {
      this.buttonImageUrl.push({
        url: this.form.firstImageUrl
      });
    }
    if (this.form.tagList.length == 0) {
      this.form.tagList.push({
        title: ""
      });
    }
    this.isDisabled = this.$route.query.type == 2 ? true : false;
    this.type = this.$route.query.type;
  },
  methods: {
    // 上传图片成功
    handleAvatarSuccessLabelImg(response, file, fileList) {
      this.form.firstImageUrl = response.content.url;
      this.form.firstImage = response.content.key;
    },
    // 上传图片失败
    uploadImgErrorLabelImg(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 上传图片超出个数限制时的钩子
    btnImgNumber() {
      this.$message.error("最多添加1张图片");
    },
    // 删除图片
    handleRemoveLabelImg(file, fileList) {
      this.form.firstImage = "";
      this.form.firstImageUrl = "";
      this.firstImageUrl = fileList;
    },
    // 添加说明
    addRemark() {
      this.form.remarkList.push({
        title: ""
      });
    },
    // 删除说明
    delRemark(index) {
      this.form.remarkList.splice(index, 1);
    },
    // 添加标签
    addTagList() {
      this.form.tagList.push({
        title: ""
      });
    },
    // 删除标签
    delTagList(index) {
      this.form.tagList.splice(index, 1);
    },
    // 上一步
    back() {
      this.$router.replace({
        path: "/add_custom_activity",
        query: {
          form: JSON.stringify(this.form),
          type: this.type
        }
      });
    },
    // 保存
    onSubmit() {
      let form = JSON.parse(JSON.stringify(this.form));
      form.beginTime = new Date(form.beginTime).getTime();
      form.endTime = new Date(form.endTime).getTime();
      // 奖励配置中没有勾选的种类配置对象转化为null
      if (form.rewardSeed) {
        form.rewardSeed = 1;
      } else {
        form.rewardSeed = 2;
        form.rewardSeedDto = null;
      }
      if (form.rewardCashBack) {
        form.rewardCashBack = 1;
      } else {
        form.rewardCashBack = 2;
        form.rewardCashBackDto = null;
      }
      form.rewardGoods = form.rewardGoods ? 1 : 2;
      if (form.rewardMember) {
        form.rewardMember = 1;
      } else {
        form.rewardMember = 2;
        form.rewardMemberDto = null;
      }
      if (form.rewardPaymentAmount) {
        form.rewardPaymentAmount = 1;
      } else {
        form.rewardPaymentAmount = 2;
        form.rewardPaymentAmountDto = null;
      }
      if (form.rewardExpressFee) {
        form.rewardExpressFee = 1;
      } else {
        form.rewardExpressFee = 2;
        form.rewardExpressFeeDto = null;
      }
      if (form.userRole instanceof Array) {
        form.userRole = form.userRole.join(",");
      }
      addOrUpdateCustomizeActivity(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.$router.go("-1");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.template {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  // 隐藏滚动条
  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  .left {
    height: 770px;
    border: 20px solid #000;
    border-radius: 60px;
    box-shadow: 0px 0px 4px 8px #ccc;
    margin-top: 20px;
    margin-left: 20px;
    background-color: #f4f4f4;
    overflow: hidden;
    .navTitle {
      width: 100%;
      height: 64px;
      background-color: #fff;
      line-height: 64px;
      text-align: center;
      color: #333333;
      font-size: 17px;
    }
    .box {
      width: 375px;
      height: 667px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 15px;
      box-sizing: border-box;
      .headImg {
        width: 100%;
        height: 150px;
        margin-top: 10px;
      }
      .goodsBox {
        width: 100%;
        box-shadow: 0px 0px 15px 0px rgba(216, 127, 168, 0.35);
        border-radius: 4px;
        background-color: #fff;
        padding: 17px 8px;
        margin-top: 10px;
        box-sizing: border-box;
        .title {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          box-sizing: border-box;
          .bigTitle {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }
          .smallTitle {
            font-size: 14px;
            font-weight: 400;
            color: #999999;
          }
        }
        .goodsArea {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          .goodsItem {
            width: 157px;
            margin-top: 20px;
            .goodsImg {
              width: 157px;
              height: 157px;
              border-radius: 2px;
            }
            .goodsName {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-top: 12px;
              font-size: 14px;
              font-weight: 500;
              color: #666666;
            }
            .explainBox {
              width: 133.5%;
              margin-top: 8px;
              display: flex;
              transform: scale(0.75);
              transform-origin: 0px 0px;
              .explainItem {
                margin-right: 4px;
                font-size: 9px;
                font-weight: 400;
                color: #ff2644;
                border: 1px solid #ff2644;
                border-radius: 2px;
              }
            }
            .priceBox {
              width: 118%;
              margin-top: 12px;
              transform: scale(0.85);
              transform-origin: 0px;
              .price {
                font-size: 15px;
                font-weight: bold;
                color: #ff2644;
              }
              .label {
                background: #ffeed3;
                border-radius: 1px;
                font-size: 10px;
                padding: 5px 2px;
                box-sizing: border-box;
                font-weight: 400;
                color: #cb8631;
                margin-left: 5px;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: 400px;
    margin-left: 40px;
    background-color: #f2f2f2;
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>