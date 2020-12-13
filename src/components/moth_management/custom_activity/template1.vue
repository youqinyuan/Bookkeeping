<template>
  <div class="template">
    <div class="left">
      <div class="navTitle">{{form.name}}</div>
      <div class="box">
        <div class="time">
          <span class="desc">距结束仅剩</span>
          <div class="num">19</div>
          <div class="symbol">:</div>
          <div class="num">06</div>
          <div class="symbol">:</div>
          <div class="num">27</div>
          <div class="symbol">.</div>
          <div class="num">11</div>
        </div>
        <div class="goodsBox">
          <div class="title">
            <span class="bigTitle">{{form.activityAreaList[0].title}}</span>
            <span class="smallTitle">{{form.activityAreaList[0].subTitle}}</span>
          </div>
          <div class="goodsArea">
            <div
              class="goodsItem"
              v-for="(item,index) in form.activityAreaList[0].activityGoodsList"
              :key="index"
            >
              <img class="goodsImg" :src="item.goodsImgUrl" alt v-if="index < 6" />
              <div class="priceBox" v-if="index < 6">
                <span class="price">¥{{item.orgPrice}}</span>
                <img
                  class="lableImg"
                  :src="form.tagList[0].imgUrl"
                  v-if="form.tagList.length > 0"
                  alt
                />
              </div>
            </div>
          </div>
        </div>
        <div class="moduleTitle">{{form.moduleName}}</div>
        <div
          class="goodsItemBox"
          v-for="(item,index) in form.activityAreaList[0].activityGoodsList"
          :key="index"
        >
          <img class="goodsImg" :src="item.goodsImgUrl" alt />
          <div class="goodsNameBox">
            <div class="goodsName">{{item.goodsName}}</div>
            <div class="explainBox">
              <span
                class="explainItem"
                v-for="(remark,remarkIdx) in form.remarkList"
                :key="remarkIdx"
              >{{remark.title}}</span>
            </div>
            <div class="priceBox">
              <div class="priceArea">
                <span class="price">￥{{item.orgPrice}}</span>
                <img
                  class="labelImg"
                  :src="form.tagList[0].imgUrl"
                  v-if="form.tagList.length > 0"
                  alt
                />
              </div>
              <img class="btnImg" :src="form.buttonImageUrl" alt />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div>
        <div>大标题：</div>
        <el-input
          v-model="form.activityAreaList[0].title"
          style="width:340px;margin-top:10px;"
          :disabled="isDisabled"
          :maxlength="8"
        ></el-input>
      </div>
      <div style="margin-top:10px;">
        <div>小标题：</div>
        <el-input
          v-model="form.activityAreaList[0].subTitle"
          style="width:340px;margin-top:10px;"
          :disabled="isDisabled"
          :maxlength="8"
        ></el-input>
      </div>
      <div>
        <div style="margin:10px 0px;">标签：</div>
        <el-upload
          action="/opadmin/fileStore/uploadFile"
          list-type="picture-card"
          :headers="myHeaders"
          :on-success="handleAvatarSuccessLabelImg"
          :on-error="uploadImgErrorLabelImg"
          :on-remove="handleRemoveLabelImg"
          :on-exceed="imgLabelNumber"
          :limit="1"
          :file-list="tagImageList"
          :disabled="isDisabled"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="margin-top:10px;">
        <div>分块名称：</div>
        <el-input
          v-model="form.moduleName"
          style="width:340px;margin-top:10px;"
          :maxlength="8"
          :disabled="isDisabled"
        ></el-input>
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
      <div>
        <div style="margin:10px 0px;">按钮：</div>
        <el-upload
          action="/opadmin/fileStore/uploadFile"
          list-type="picture-card"
          :headers="myHeaders"
          :on-success="handleAvatarSuccessBtnImg"
          :on-error="uploadImgErrorBtnImg"
          :on-remove="handleRemoveBtnImg"
          :on-exceed="btnImgNumber"
          :limit="1"
          :disabled="isDisabled"
          :file-list="buttonImageUrl"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
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
      buttonImageUrl: [],
      tagImageList: []
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.form = JSON.parse(this.$route.query.form);
    if (this.form.buttonImageUrl) {
      this.buttonImageUrl.push({
        url: this.form.buttonImageUrl
      });
    }
    this.form.tagList.forEach(val => {
      this.tagImageList.push({
        url: val.imgUrl
      });
    });
    this.isDisabled = this.$route.query.type == 2 ? true : false;
    this.type = this.$route.query.type;
  },
  methods: {
    // 上传标签图片成功
    handleAvatarSuccessLabelImg(response, file, fileList) {
      this.form.tagList.push({
        subType: 2,
        title: response.content.key,
        imgUrl: response.content.url
      });
    },
    // 上传标签图片失败
    uploadImgErrorLabelImg(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 上传图片超出个数限制时的钩子
    imgLabelNumber() {
      this.$message.error("最多添加1张图片");
    },
    // 删除标签图片
    handleRemoveLabelImg(file, fileList) {
      let index = this.tagImageList.indexOf(file);
      this.form.tagList.splice(index, 1);
      this.tagImageList = fileList;
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
    // 上传按钮图片成功
    handleAvatarSuccessBtnImg(response, file, fileList) {
      this.form.buttonImageUrl = response.content.url;
      this.form.buttonImage = response.content.key;
    },
    // 上传按钮图片失败
    uploadImgErrorBtnImg(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 删除按钮图片
    handleRemoveBtnImg(file, fileList) {
      this.form.buttonImage = "";
      this.form.buttonImageUrl = "";
      this.buttonImageUrl = fileList;
    },
    // 上传按钮图片超出个数限制时的钩子
    btnImgNumber() {
      this.$message.error("最多添加1张图片");
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
    margin-left: 20px;
    margin-top: 20px;
    background-color: #ffeed3;
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
      .time {
        width: 100%;
        margin-top: 27px;
        display: flex;
        align-items: center;
        .desc {
          margin-left: 58px;
          color: #ff2644;
          font-size: 16px;
          font-weight: bold;
          margin-right: 10px;
        }
        .num {
          width: 28px;
          height: 18px;
          background-color: #ff2644;
          color: #fff;
          font-weight: bold;
          font-size: 14px;
          text-align: center;
          line-height: 18px;
          border-radius: 2px;
        }
        .symbol {
          color: #ff2644;
          font-size: 16px;
          font-weight: bold;
          margin: 0 6px;
        }
      }
      .goodsBox {
        width: 100%;
        box-shadow: 0px 0px 15px 0px rgba(216, 127, 168, 0.35);
        border-radius: 4px;
        background-color: #fff;
        padding: 0 13px;
        padding-top: 17px;
        padding-bottom: 22px;
        margin-top: 31px;
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
            margin-top: 20px;
            .goodsImg {
              width: 100px;
              height: 100px;
              border-radius: 2px;
            }
          }
          .priceBox {
            margin-top: 7px;
            font-size: 12px;
            font-weight: bold;
            color: #ff2644;
            display: flex;
            align-items: center;
            .lableImg {
              width: 40px;
              height: 14px;
              margin-left: 5px;
            }
          }
        }
      }
      .moduleTitle {
        width: 100%;
        margin-top: 21px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #ff2644;
        margin-bottom: 20px;
      }
      .goodsItemBox {
        width: 100%;
        margin-top: 10px;
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        .goodsImg {
          width: 110px;
          height: 110px;
          border-radius: 4px;
          margin-right: 15px;
        }
        .goodsNameBox {
          width: 190px;
          .goodsName {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            line-height: 20px;
          }
        }
        .explainBox {
          width: 133.5%;
          margin-top: 12px;
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
          width: 100%;
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .priceArea {
            display: flex;
            align-items: center;
            .price {
              font-size: 13px;
              font-weight: 800;
              color: #ff2644;
            }
            .labelImg {
              width: 40px;
              height: 14px;
              margin-left: 5px;
            }
          }
          .btnImg {
            width: 70px;
            height: 28px;
          }
        }
      }
    }
  }
  .right {
    width: 400px;
    margin-left: 60px;
    background-color: #f2f2f2;
    padding: 10px;
    margin-top: 20px;
    box-sizing: border-box;
  }
}
</style>