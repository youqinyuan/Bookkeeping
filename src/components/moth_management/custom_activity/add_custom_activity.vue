<template>
  <div class="add_custom_activity">
    <div class="items">
      <div class="title">一、样式选择</div>
      <div class="content" style="display:flex;">
        <div style="display:flex;flex-direction:column;margin-right:40px;">
          <img
            src="../../../assets/template1.png"
            style="width:150px;height:350px;"
            preview="1"
            alt
          />
          <el-radio
            v-model="form.theme"
            label="1"
            style="margin-top:20px;margin-left:40px;"
            @change="selectTemplate"
            :disabled="isDisabled"
          >选择</el-radio>
        </div>
        <div style="display:flex;flex-direction:column;">
          <img
            src="../../../assets/template2.png"
            style="width:150px;height:350px;"
            preview="1"
            alt
          />
          <el-radio
            v-model="form.theme"
            label="2"
            style="margin-top:20px;margin-left:40px;"
            @change="selectTemplate"
            :disabled="isDisabled"
          >选择</el-radio>
        </div>
      </div>
    </div>
    <div class="items">
      <div class="title">二、文本配置</div>
      <div class="content">
        <div>
          <span>活动名称：</span>
          <el-input v-model="form.name" style="width:700px;" :maxlength="8" :disabled="isDisabled"></el-input>
        </div>
        <div style="margin-top:20px;display:flex;">
          <span>规则说明：</span>
          <div class="editorBox">
            <wang-editor
              @catchData="getContent"
              :content="form.ruleContent"
              :isDisabled="isDisabled"
              v-if="flag"
            ></wang-editor>
          </div>
        </div>
      </div>
    </div>
    <div class="items">
      <div class="title">三、规则配置</div>
      <div class="content">
        <div>1、参与用户</div>
        <el-radio-group v-model="form.fitUserGroup" style="margin-top:20px;" :disabled="isDisabled">
          <el-radio :label="4">根据身份选择</el-radio>
          <el-radio :label="2">自定义手机号</el-radio>
          <el-radio :label="1">全部用户</el-radio>
          <el-radio :label="3">新人用户（未下单用户）</el-radio>
        </el-radio-group>
        <div style="display:flex;align-items:center;margin-top:20px;" v-if="form.fitUserGroup == 4">
          <span style="font-size:15px;color:#555;margin-right:10px;">身份：</span>
          <el-checkbox-group v-model="form.userRole" :disabled="isDisabled">
            <el-checkbox label="2">普通用户</el-checkbox>
            <el-checkbox label="3">合伙人</el-checkbox>
            <el-checkbox label="6">钻石合伙人</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-input
          v-model="form.userMobiles"
          type="textarea"
          :disabled="isDisabled"
          v-if="form.fitUserGroup == 2"
          style="margin-top:20px;"
          placeholder="请输入自定义手机号（用英文逗号隔开）"
        ></el-input>
        <div style="width:100%;height:1px;background-color:#ccc;margin:20px 0px;"></div>
        <div>2、参与时间</div>
        <div style="margin-top:20px;">
          <span style="font-size:15px;color:#555;">活动时间：</span>
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="isDisabled"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <!-- 样式1的商品配置区域 -->
    <div class="items" v-if="form.theme == 1">
      <div class="title">
        四、商品配置
        <el-button
          type="primary"
          style="margin-left:40px;"
          @click="openAddGoodsDialog(0)"
          :disabled="isDisabled"
        >添加商品</el-button>
        <el-button type="primary" :disabled="isDisabled" @click="changeGoodsAll(0)">统一设定商品规格规则</el-button>
      </div>
      <div class="content">
        <el-table :data="form.activityAreaList[0].activityGoodsList" border style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="orgPrice" label="商品原价" align="center"></el-table-column>
          <el-table-column prop="stock" label="库存" align="center"></el-table-column>
          <el-table-column prop="orderNo" label="排序值" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="setSortNumber(0,scope.$index)"
                :disabled="isDisabled"
              >{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                :disabled="isDisabled"
                @click="changeGoodsOne(scope.row,0,scope.$index)"
              >修改</el-button>
              <el-button type="text" :disabled="isDisabled" @click="delGoods(0,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 样式2的商品配置区域 -->
    <div class="items" v-if="form.theme == 2">
      <div class="title">
        四、商品配置2
        <el-button
          type="primary"
          style="margin-left:40px;"
          :disabled="isDisabled"
          @click="addActivityArea"
        >添加展示区</el-button>
      </div>
      <div v-for="(item,index) in form.activityAreaList" :key="index">
        <div style="margin-top:10px;">
          <span>区域{{index+1}}</span>
          <el-button
            type="text"
            style="margin-left:40px;margin-right:20px;"
            :disabled="isDisabled"
            @click="openAddGoodsDialog(index)"
          >添加商品</el-button>
          <i class="el-icon-remove" v-if="index != 0" @click="delActivityArea(index)"></i>
        </div>
        <div>
          <span>区域大标题：</span>
          <el-input
            v-model="item.title"
            :disabled="isDisabled"
            style="margin-top:20px;width:300px;"
            :maxlength="8"
          ></el-input>
          <span style="margin-left:40px;">区域小标题：</span>
          <el-input
            v-model="item.subTitle"
            :disabled="isDisabled"
            style="margin-top:20px;width:300px;"
            :maxlength="8"
          ></el-input>
        </div>
        <div class="content">
          <el-table :data="item.activityGoodsList" border style="width: 100%">
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="orgPrice" label="商品原价" align="center"></el-table-column>
            <el-table-column prop="stock" label="库存" align="center"></el-table-column>
            <el-table-column prop="orderNo" label="排序值" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :disabled="isDisabled"
                  @click="setSortNumber(index,scope.$index)"
                >{{scope.row.orderNo}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :disabled="isDisabled"
                  @click="changeGoodsOne(scope.row,index,scope.$index)"
                >修改</el-button>
                <el-button
                  type="text"
                  :disabled="isDisabled"
                  @click="delGoods(index,scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="items">
      <div class="title">五、奖励配置</div>
      <div class="content">
        <el-checkbox v-model="form.rewardSeed" :disabled="isDisabled">送种子</el-checkbox>
        <el-checkbox v-model="form.rewardCashBack" :disabled="isDisabled">送返现</el-checkbox>
        <el-checkbox v-model="form.rewardGoods" :disabled="isDisabled">送商品</el-checkbox>
        <el-checkbox v-model="form.rewardMember" :disabled="isDisabled">送身份</el-checkbox>
        <el-checkbox v-model="form.rewardPaymentAmount" :disabled="isDisabled">减少支付金额</el-checkbox>
        <el-checkbox
          v-model="form.rewardExpressFee"
          :disabled="isDisabled"
          @change="isRewardExpressFee"
        >包邮</el-checkbox>
        <div style="margin-top:20px;" v-if="form.rewardSeed">
          <span style="font-size:15px;color:#555;margin-right:20px;">送种子：</span>
          <el-input v-model="form.rewardSeedDto.param1" style="width:140px;" :disabled="isDisabled"></el-input>
        </div>
        <div style="margin-top:20px;" v-if="form.rewardCashBack">
          <span style="font-size:15px;color:#555;margin-right:20px;">送返现：</span>
          <span style="font-size:15px;color:#555;">返现金额</span>
          <el-input
            v-model="form.rewardCashBackDto.param1"
            style="width:140px;"
            :disabled="isDisabled"
          ></el-input>
          <span style="font-size:15px;color:#555;">返现期数</span>
          <el-input
            v-model="form.rewardCashBackDto.param2"
            style="width:140px;"
            :disabled="isDisabled"
          ></el-input>
        </div>
        <div style="margin-top:20px;" v-if="form.rewardGoods">
          <span style="font-size:15px;color:#555;margin-right:20px;">送商品：</span>
          <el-button type="text" :disabled="isDisabled" @click="openGiveGoodsDialog">选择商品</el-button>
        </div>
        <el-table
          :data="form.rewardGoodsDtoList"
          border
          style="width: 100%"
          v-if="form.rewardGoods"
        >
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="specDesc" label="规格信息" align="center"></el-table-column>
          <el-table-column prop="orgPrice" label="原价" align="center"></el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                :disabled="isDisabled"
                @click="delGiveGoodsItem(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px;" v-if="form.rewardMember">
          <span style="font-size:15px;color:#555;">送身份特权：</span>
          <el-radio-group v-model="form.rewardMemberDto.param1" :disabled="isDisabled">
            <el-radio label="3">合伙人</el-radio>
            <el-radio label="6">
              钻石合伙人&nbsp;&nbsp;&nbsp;&nbsp;赠送时间
              <el-input
                v-model="form.rewardMemberDto.param2"
                style="width:100px;"
                :disabled="isDisabled"
              ></el-input>月
            </el-radio>
          </el-radio-group>
        </div>
        <div
          style="margin-top:20px;display:flex;align-items:center;"
          v-if="form.rewardPaymentAmount"
        >
          <span style="font-size:15px;color:#555;">减少支付金额：</span>
          支付金额打
          <el-input
            v-model="form.rewardPaymentAmountDto.param1"
            style="width:100px;"
            :disabled="isDisabled"
          ></el-input>折，
          支付金额减
          <el-input
            v-model="form.rewardPaymentAmountDto.param2"
            style="width:100px;"
            :disabled="isDisabled"
          ></el-input>元
        </div>
        <div
          style="margin-top:20px;font-size:15px;color:#555;"
          v-if="form.rewardExpressFee"
        >包邮：下单减免邮费</div>
      </div>
    </div>
    <el-button type="primary" style="width:180px;" @click="nextStep">下一步</el-button>
    <!-- 添加商品弹窗 -->
    <addGoodsDialog ref="addGoodsDialog" @func="getGoodsList"></addGoodsDialog>
    <!-- 修改商品弹窗 -->
    <changeGoodsDialog ref="changeGoodsDialog" @func="changeGoodsList"></changeGoodsDialog>
    <!-- 选择赠送商品弹窗 -->
    <giveGoodsDialog ref="giveGoodsDialog" @func="getGiveGoods"></giveGoodsDialog>
  </div>
</template>
<script>
import addGoodsDialog from "./addGoodsDialog";
import changeGoodsDialog from "./changeGoodsDialog";
import giveGoodsDialog from "./giveGoodsDialog";
import wangEditor from "../../genealogy_set/common/WangEditor";
import { findCustomizeActivityDetail } from "@/network/api";
export default {
  data() {
    return {
      flag: false, //是否显示wangeditor组件
      isDisabled: false,
      type: "",
      idx: "",
      form: {
        id: "",
        theme: "1",
        name: "",
        ruleContent: "",
        fitUserGroup: 1,
        userRole: [],
        userMobiles: "",
        beginTime: "",
        endTime: "",
        rewardSeed: false,
        rewardCashBack: false,
        rewardGoods: false,
        rewardMember: false,
        rewardPaymentAmount: false,
        rewardExpressFee: false,
        firstImage: "",
        buttonImage: "",
        moduleName: "",
        firstImageUrl: "",
        buttonImageUrl: "",
        activityAreaList: [
          {
            title: "",
            subTitle: "",
            activityGoodsList: []
          }
        ],
        tagList: [], //标签列表
        remarkList: [{ title: "" }],
        rewardSeedDto: { param1: "" },
        rewardCashBackDto: { param1: "", param2: "" },
        rewardGoodsDtoList: [], // 送商品列表
        rewardMemberDto: { param1: "" },
        rewardPaymentAmountDto: { param1: "" },
        rewardExpressFeeDto: { param1: "" }
      },
      time: ""
    };
  },
  components: {
    wangEditor,
    addGoodsDialog,
    changeGoodsDialog,
    giveGoodsDialog
  },
  created() {
    // type:1-添加，2-查看，3-修改
    let type = this.$route.query.type;
    // 判断是否从活动列表进入
    let fromActivityList = this.$route.query.fromActivityList;
    this.type = type;
    this.isDisabled = type == 2 ? true : false;
    if (fromActivityList) {
      // 从活动列表页进入
      if (type == 2 || type == 3) {
        let id = this.$route.query.id;
        this.findCustomizeActivityDetail(id);
      } else {
        this.flag = true;
      }
    } else {
      // 从前端模板页进入
      this.form = JSON.parse(this.$route.query.form);
      this.time = [this.form.beginTime, this.form.endTime];
      this.flag = true;
    }
  },
  methods: {
    // 获取活动详情
    findCustomizeActivityDetail(id) {
      let parms = {
        id: id
      };
      findCustomizeActivityDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let form = res.data.content;
          // 奖励配置转化
          if (form.rewardSeed == 1) {
            form.rewardSeed = true;
          } else {
            form.rewardSeed = false;
            form.rewardSeedDto = { param1: "" };
          }
          if (form.rewardCashBack == 1) {
            form.rewardCashBack = true;
          } else {
            form.rewardCashBack = false;
            form.rewardCashBackDto = { param1: "" };
          }
          form.rewardGoods = form.rewardGoods == 1 ? true : false;
          if (form.rewardMember == 1) {
            form.rewardMember = true;
          } else {
            form.rewardMember = false;
            form.rewardMemberDto = { param1: "" };
          }
          if (form.rewardPaymentAmount == 1) {
            form.rewardPaymentAmount = true;
          } else {
            form.rewardPaymentAmount = false;
            form.rewardPaymentAmountDto = { param1: "" };
          }
          if (form.rewardExpressFee == 1) {
            form.rewardExpressFee = true;
          } else {
            form.rewardExpressFee = false;
            form.rewardExpressFeeDto = { param1: "" };
          }
          form.userRole = form.userRole ? form.userRole.split(",") : [];
          this.form = form;
          this.time = [new Date(form.beginTime), new Date(form.endTime)];
          this.flag = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 选择模板样式
    selectTemplate(val) {
      this.form.tagList = [];
    },
    // 接收来自富文本的值
    getContent(data) {
      this.form.ruleContent = data;
    },
    // 添加展示区
    addActivityArea() {
      this.form.activityAreaList.push({
        title: "",
        subTitle: "",
        activityGoodsList: []
      });
    },
    // 删除展示区
    delActivityArea(index) {
      if (this.form.activityAreaList[index].activityGoodsList.length > 0) {
        this.$confirm("确定删除此区域吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
          closeOnClickModal: false
        })
          .then(() => {})
          .catch(() => {});
      } else {
        this.form.activityAreaList.splice(index, 1);
      }
    },
    // 打开添加商品弹窗
    openAddGoodsDialog(index) {
      // 收取整个活动选取的商品数据，传递到添加商品子组件中，子组件中默认选中这些商品
      let goodsArr = [];
      this.form.activityAreaList.forEach(val => {
        val.activityGoodsList.forEach(ite => {
          ite.id = ite.goodsId;
          goodsArr.push(ite);
        });
      });
      this.$refs.addGoodsDialog.open(index, goodsArr);
    },
    // 获取子组件传递过来的选择的商品列表
    getGoodsList(data, index) {
      data.forEach(item => {
        this.form.activityAreaList[index].activityGoodsList.push({
          goodsId: item.id,
          goodsName: item.name,
          goodsImgUrl: item.goodsImage,
          stock: item.stock,
          orgPrice: item.orgPrice,
          orderNo: 0,
          activityGoodsStockList: []
        });
      });
    },
    // 修改排序值
    setSortNumber(index, idx) {
      this.$prompt("排序值", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
        closeOnClickModal: false,
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          this.form.activityAreaList[index].activityGoodsList[
            idx
          ].orderNo = value;
        })
        .catch(() => {});
    },
    // 统一设定商品规格规则
    changeGoodsAll(index) {
      this.idx = -1;
      if (this.form.activityAreaList[0].activityGoodsList.length == 0) {
        this.$message.error("请先添加商品");
        return;
      }
      let goodsIds = [];
      let data = [];
      this.form.activityAreaList[index].activityGoodsList.forEach(ite => {
        // 已经修改过的规格自动带入,未修改过的传入goodsId进入下一步请求规格列表
        if (ite.activityGoodsStockList == 0) {
          goodsIds.push(ite.goodsId);
        } else {
          data = data.concat(ite.activityGoodsStockList);
        }
      });
      goodsIds = goodsIds.join(",");
      this.$refs.changeGoodsDialog.open(data, goodsIds, index);
    },
    // 修改商品
    changeGoodsOne(item, index, idx) {
      this.idx = idx;
      let goodsIds;
      let data = [];
      if (item.activityGoodsStockList.length == 0) {
        goodsIds = item.goodsId;
      } else {
        data = data.concat(item.activityGoodsStockList);
      }
      this.$refs.changeGoodsDialog.open(data, goodsIds, index);
    },
    // 获取修改商品组件传递的数据
    changeGoodsList(data, index) {
      let idx = this.idx;
      if (idx == -1) {
        // 统一修改规格
        this.form.activityAreaList[index].activityGoodsList.forEach(val => {
          val.activityGoodsStockList = [];
        });
        data.forEach(val => {
          this.form.activityAreaList[index].activityGoodsList.forEach(ite => {
            if (val.goodsId == ite.goodsId) {
              ite.activityGoodsStockList.push(val);
            }
          });
        });
      } else {
        // 修改单个规格
        this.form.activityAreaList[index].activityGoodsList[
          idx
        ].activityGoodsStockList = data;
      }
    },
    // 删除商品
    delGoods(index, idx) {
      this.form.activityAreaList[index].activityGoodsList.splice(idx, 1);
    },
    // 打开赠送商品弹窗
    openGiveGoodsDialog() {
      // 把已选中的商品数据传递到选择赠送商品子组件中，子组件中默认选中这些商品
      let goodsArr = [];
      this.form.rewardGoodsDtoList.forEach(val => {
        val.id = val.resourceId;
        goodsArr.push(val);
      });
      this.$refs.giveGoodsDialog.open(goodsArr);
    },
    // 赠送商品弹窗组件传递过来的数据
    getGiveGoods(data) {
      data.forEach(val => {
        let json = {
          resourceId: val.id,
          goodsName: val.goodsName,
          specDesc: val.specDesc,
          orgPrice: val.orgPrice
        };
        this.form.rewardGoodsDtoList.push(json);
      });
    },
    // 删除赠送商品
    delGiveGoodsItem(index) {
      this.form.rewardGoodsDtoList.splice(index, 1);
    },
    // 是否包邮
    isRewardExpressFee(val) {
      this.form.rewardExpressFeeDto.param1 = val ? "下单减免邮费" : "";
    },
    // 下一步
    nextStep() {
      let form = this.form;
      if (!form.name) {
        this.$message.error("请输入活动名称");
        return;
      }
      if (form.fitUserGroup == 4 && form.userRole.length == 0) {
        this.$message.error("请选择用户身份");
        return;
      }
      if (form.fitUserGroup == 2 && !form.userMobiles) {
        this.$message.error("请输入自定义手机号");
        return;
      }
      if (form.fitUserGroup == 2 && form.userMobiles.indexOf("，") != -1) {
        this.$message.error("自定义手机号之间请用英文逗号相隔");
        return;
      }
      if (!this.time) {
        this.$message.error("请选择活动时间");
        return;
      }
      if (form.rewardGoods && form.rewardGoodsDtoList.length == 0) {
        this.$message.error("请添加赠送的商品");
        return;
      }
      form.beginTime = this.time[0];
      form.endTime = this.time[1];
      if (form.theme == 1) {
        this.$router.replace({
          path: "/template1",
          query: {
            form: JSON.stringify(form),
            type: this.type
          }
        });
      } else if (form.theme == 2) {
        this.$router.replace({
          path: "/template2",
          query: {
            form: JSON.stringify(form),
            type: this.type
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.add_custom_activity {
  padding: 20px;
  box-sizing: border-box;
  .items {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .content {
      width: 100%;
      margin-top: 20px;
      .editorBox {
        width: 705px;
      }
    }
  }
}
</style>