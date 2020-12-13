<template>
  <div class="seed_management">
    <el-form :model="form" :rules="rules" ref="form">
      <div class="title">用户获取种子规则：</div>
      <div style="display: flex">
        <el-form-item
          prop="paramList.POST_SEND_SEED"
          :rules="rules.POST_SEND_SEED"
        >
          <span>1、发布帖子赠送用户</span>
          <el-input
            v-model="form.paramList.POST_SEND_SEED"
            style="width: 100px"
          ></el-input>
          <span>种子，单日最高上限</span>
        </el-form-item>
        <el-form-item
          prop="paramList.DAY_OF_POST_SEND_SEED"
          :rules="rules.DAY_OF_POST_SEND_SEED"
        >
          <el-input
            v-model="form.paramList.DAY_OF_POST_SEND_SEED"
            style="width: 100px"
          ></el-input>
          <span>种子</span>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item
          prop="paramList.SIGN_SEND_SEED"
          :rules="rules.SIGN_SEND_SEED"
        >
          <span>2、签到赠送用户</span>
          <el-input
            v-model="form.paramList.SIGN_SEND_SEED"
            style="width: 100px"
          ></el-input>
          <span>种子，</span>
        </el-form-item>
        <el-form-item
          prop="paramList.SIGN_SEND_SEED_MAX"
          :rules="rules.SIGN_SEND_SEED_MAX"
        >
          <span>最多赠送</span>
          <el-input
            v-model="form.paramList.SIGN_SEND_SEED_MAX"
            style="width: 100px"
          ></el-input>
          <span>种子</span>
        </el-form-item>
      </div>
      <el-form-item
        prop="paramList.BALANCE_SEND_SEED"
        :rules="rules.BALANCE_SEND_SEED"
      >
        <span>3、余额年化率送种子</span>
        <el-input
          v-model="form.paramList.BALANCE_SEND_SEED"
          style="width: 100px"
        ></el-input>
        <span>%</span>
      </el-form-item>
      <div style="display: flex">
        <el-form-item
          prop="paramList.TRANS_SEND_SEED"
          :rules="rules.TRANS_SEND_SEED"
        >
          <span>4、Freebuy待返合约转让成功赠送</span>
          <el-input
            v-model="form.paramList.TRANS_SEND_SEED"
            style="width: 100px"
          ></el-input>
          <span>种子，单日最高上限</span>
        </el-form-item>
        <el-form-item
          prop="paramList.DAY_OF_TRANS_SEND_SEED"
          :rules="rules.DAY_OF_TRANS_SEND_SEED"
        >
          <el-input
            v-model="form.paramList.DAY_OF_TRANS_SEND_SEED"
            style="width: 100px"
          ></el-input>
          <span>种子</span>
        </el-form-item>
      </div>
      <el-form-item
        prop="paramList.DEDUCTION_SEED"
        :rules="rules.DEDUCTION_SEED"
      >
        <span>5、正常购买时种子（积分）可抵扣金额的：</span>
        <el-input
          v-model="form.paramList.DEDUCTION_SEED"
          style="width: 100px"
        ></el-input>
        <span>%</span>
      </el-form-item>
      <el-form-item
        prop="paramList.FREE_BUY_DEDUCTION_SEED"
        :rules="rules.FREE_BUY_DEDUCTION_SEED"
      >
        <span>6、Freebuy购买时种子（积分）可抵扣金额的：</span>
        <el-input
          v-model="form.paramList.FREE_BUY_DEDUCTION_SEED"
          style="width: 100px"
        ></el-input>
        <span>%</span>
      </el-form-item>
      <div style="font-size: 14px; margin-bottom: 20px">
        7、一折购赠送种子（包括卖商品赚钱）：
        <el-button
          type="text"
          style="margin-left: 40px"
          @click="addRules_freeBuyDetailList"
          >增加规则</el-button
        >
      </div>
      <div
        style="display: flex"
        v-for="(item, index) in form.freeBuyDetailList"
        :key="index"
      >
        <el-form-item
          :prop="`freeBuyDetailList.${index}.periodMin`"
          :rules="rules.period"
        >
          <span>用户选择</span>
          <el-input v-model="item.periodMin" style="width: 100px"></el-input>-
        </el-form-item>
        <el-form-item
          :prop="`freeBuyDetailList.${index}.periodMax`"
          :rules="rules.period"
        >
          <el-input v-model="item.periodMax" style="width: 100px"></el-input>
          <span>期赠送原价</span>
        </el-form-item>
        <el-form-item
          :prop="`freeBuyDetailList.${index}.amountRate`"
          :rules="rules.amountRate"
        >
          <el-input v-model="item.amountRate" style="width: 100px"></el-input>
          <span>%的种子</span>
          <el-button
            type="text"
            style="margin-left: 40px"
            @click="del_freeBuyDetailList_items(index)"
            >删除</el-button
          >
        </el-form-item>
      </div>
      <el-form-item
        prop="paramList.SEED_PRODUCT_NEW_USER"
        :rules="rules.SEED_PRODUCT_NEW_USER"
      >
        <div>8、新人赠送种子</div>
        <span>新人注册赠送</span>
        <el-input
          v-model="form.paramList.SEED_PRODUCT_NEW_USER"
          style="width: 100px"
        ></el-input>
        <span>颗种子</span>
      </el-form-item>
      <el-form-item
        prop="paramList.SEED_PRODUCT_ADVANCE_PERIOD"
        :rules="rules.SEED_PRODUCT_ADVANCE_PERIOD"
      >
        <div>9、帮忙提期赠送种子</div>
        <span>提期支付金额的</span>
        <el-input
          v-model="form.paramList.SEED_PRODUCT_ADVANCE_PERIOD"
          style="width: 100px"
        ></el-input>
        <span>%</span>
      </el-form-item>
      <!-- 观看视频获得种子 -->
      <div
        style="
          font-size: 14px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        "
      >
        10、观看视频获得种子
        <el-upload
          action="/opadmin/fileStore/uploadFile"
          accept="video/*"
          :show-file-list="false"
          :headers="myHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadVideoSuccess"
          :on-error="uploadVideoError"
        >
          <el-button
            size="small"
            type="text"
            style="margin-left: 40px"
            v-if="!form.configVideo.videoUrl"
          >
            上传视频
          </el-button>
          <el-button size="small" type="text" style="margin-left: 40px" v-else
            >修改视频</el-button
          >
        </el-upload>
      </div>
      <div>
        <video
          controls
          :src="form.configVideo.videoUrl"
          accept="video/*"
          width="400px"
        >
          您的浏览器不支持 video 标签。
        </video>
      </div>
      <el-form-item prop="configVideo.seedQuantity" :rules="rules.seedQuantity">
        <span>观看视频获得</span>
        <el-input
          v-model="form.configVideo.seedQuantity"
          style="width: 100px; margin-top: 20px"
        ></el-input>
        <span>个种子</span>
      </el-form-item>
      <div style="font-size: 14px">
        <span>选择看视频获得种子用户：</span>
        <el-button
          type="text"
          style="margin-left: 20px"
          v-if="userList.length == 0"
          @click="dialogFormVisible = true"
        >
          添加人群
        </el-button>
        <el-button
          type="text"
          style="margin-left: 20px"
          v-else
          @click="changeUserList"
          >修改人群</el-button
        >
        <div class="userListBox" v-if="userList.length > 0">
          <div v-for="(ite, idx) in userList" :key="idx" style="margin: 10px">
            <span>{{ ite.nickname }}</span>
            <span>+</span>
            <span>{{ ite.mobileNumber }}</span>
          </div>
        </div>
      </div>
      <!-- 天天返购买赠送种子 -->
      <div style="font-size: 14px; margin-top: 6px; margin-bottom: 8px">
        11、天天返购买赠送种子
        <el-button
          type="text"
          style="margin-left: 40px"
          @click="addRules_everyDayDetailList"
          >增加规则</el-button
        >
      </div>
      <div
        style="display: flex; align-items: center"
        v-for="(item, index) in form.everyDayDetailList"
        :key="item.id"
      >
        <el-form-item
          :prop="`everyDayDetailList.${index}.periodMin`"
          :rules="rules.period13"
        >
          <span>用户选择</span>
          <el-input v-model="item.periodMin" style="width: 100px"></el-input>-
        </el-form-item>
        <el-form-item
          :prop="`everyDayDetailList.${index}.periodMax`"
          :rules="rules.period13"
        >
          <el-input v-model="item.periodMax" style="width: 100px"></el-input>
          <span>天，赠送原价</span>
        </el-form-item>
        <el-form-item
          :prop="`everyDayDetailList.${index}.amountRate`"
          :rules="rules.amountRate"
        >
          <el-input v-model="item.amountRate" style="width: 100px"></el-input>
          <span>%的种子</span>
          <el-button
            type="text"
            style="margin-left: 40px"
            @click="del_everyDayDetailList_items(index)"
            >删除</el-button
          >
        </el-form-item>
      </div>
      <!-- 首次某行为赠送种子 -->
      <div style="font-size: 14px; margin-top: 6px; margin-bottom: 8px">
        12、首次某行为赠送种子
      </div>
      <div style="display: flex">
        <el-form-item
          prop="configFirstAction.freeBuyOnline.periodMin"
          :rules="rules.periodMin"
        >
          <span>首次1折购购买</span>
          <el-input
            v-model="form.configFirstAction.freeBuyOnline.periodMin"
            style="width: 100px"
          ></el-input>
          <span>-</span>
        </el-form-item>
        <el-form-item
          prop="configFirstAction.freeBuyOnline.periodMax"
          :rules="rules.periodMin"
        >
          <el-input
            v-model="form.configFirstAction.freeBuyOnline.periodMax"
            style="width: 100px"
          ></el-input>
          <span>期的商品，赠送</span>
        </el-form-item>
        <el-form-item
          prop="configFirstAction.freeBuyOnline.seedQuantity"
          :rules="rules.installmentSeedQuantity"
        >
          <el-input
            v-model="form.configFirstAction.freeBuyOnline.seedQuantity"
            style="width: 100px"
          ></el-input>
          <span>个种子</span>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item
          prop="configFirstAction.advancePeriod.amount"
          :rules="rules.amount"
        >
          <span>首次帮助他人提期金额大于</span>
          <el-input
            v-model="form.configFirstAction.advancePeriod.amount"
            style="width: 100px"
          ></el-input>
          <span>元，赠送</span>
        </el-form-item>
        <el-form-item
          prop="configFirstAction.advancePeriod.seedQuantity"
          :rules="rules.installmentSeedQuantity"
        >
          <el-input
            v-model="form.configFirstAction.advancePeriod.seedQuantity"
            style="width: 100px"
          ></el-input>
          <span>个种子</span>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item
          prop="configFirstAction.freeBuyOnline.periodMin"
          :rules="rules.periodMin"
        >
          <span>首次购买线下1折购</span>
          <el-input
            v-model="form.configFirstAction.freeBuyOffline.periodMin"
            style="width: 100px"
          ></el-input>
          <span>-</span>
        </el-form-item>
        <el-form-item
          prop="configFirstAction.freeBuyOffline.periodMax"
          :rules="rules.periodMin"
        >
          <el-input
            v-model="form.configFirstAction.freeBuyOffline.periodMax"
            style="width: 100px"
          ></el-input>
          <span>期的商品，赠送</span>
        </el-form-item>
        <el-form-item
          prop="configFirstAction.freeBuyOffline.seedQuantity"
          :rules="rules.installmentSeedQuantity"
        >
          <el-input
            v-model="form.configFirstAction.freeBuyOffline.seedQuantity"
            style="width: 100px"
          ></el-input>
          <span>个种子</span>
        </el-form-item>
      </div>
      <el-form-item
        prop="configFirstAction.installmentSeedQuantity"
        :rules="rules.installmentSeedQuantity"
      >
        <span>首次使用1折购分期，赠送</span>
        <el-input
          v-model="form.configFirstAction.installmentSeedQuantity"
          style="width: 100px"
        ></el-input>
        <span>个种子</span>
      </el-form-item>
      <!-- 种子汇率 -->
      <div class="title">种子汇率：</div>
      <el-form-item prop="paramList.VALUE_OF_SEED" :rules="rules.VALUE_OF_SEED">
        <span>1、在抵扣时，一元与</span>
        <el-input
          v-model="form.paramList.VALUE_OF_SEED"
          style="width: 100px"
        ></el-input>
        <span>种子等值</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加享受种子红包的用户弹窗 -->
    <el-dialog
      title="自定义享受种子红包用户人群"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      width="500px"
    >
      <el-input
        type="textarea"
        placeholder="请输入用户手机号多个请用英文逗号隔开,"
        v-model="mobileNumber"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateDetail">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findProduct_seed,
  addOrUpdateProduct_seed,
  addOrUpdateVideoUser,
} from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    // form 表单自定义校验规则
    // 签到赠送种子上限
    const SIGN_SEND_SEED_MAX = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value) {
        if (value < 0 || value > 10000000) {
          return callback(new Error("值区间：0-10000000"));
        } else if (!a.test(value)) {
          return callback(new Error("不可为小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const SEED_PRODUCT_NEW_USER = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (!a.test(value)) {
        return callback(new Error("不可为小数"));
      } else if (value > 10000) {
        return callback(new Error("不可超过10000"));
      } else {
        callback();
      }
    };
    const SEED_PRODUCT_ADVANCE_PERIOD = (rule, value, callback) => {
      let a = /^(\d{1,2}(\.\d{1,2})?|100)$/;
      if (!a.test(value)) {
        return callback(new Error("请输入0-100之间的数值，最多两位小数"));
      } else {
        callback();
      }
    };
    const period = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      let b = /^[1-9]\d*$/;
      if (value < 0.5 || value > 10000) {
        return callback(new Error("值区间：0.5-10000"));
      } else {
        if (value < 1) {
          if (!a.test(value)) {
            return callback(new Error("最多保留1位小数"));
          } else {
            callback();
          }
        } else if (value >= 1) {
          if (!b.test(value)) {
            return callback(new Error("整数"));
          } else {
            callback();
          }
        } else {
          return callback(new Error("格式不正确"));
        }
      }
    };

    const amountRate = (rule, value, callback) => {
      let a = /^\d+(.\d{1,2})?$/;
      if (value <= 0 || value > 500) {
        return callback(new Error("值区间：0-500,不可为0"));
      } else if (!a.test(value)) {
        return callback(new Error("最多保留2位小数"));
      } else {
        callback();
      }
    };
    const countPreDay = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value < 1 || value > 100) {
        return callback(new Error("值区间：1-100"));
      } else if (!a.test(value)) {
        return callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const minuteInterval = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value < 1 || value > 60) {
        return callback(new Error("值区间：1-60"));
      } else if (!a.test(value)) {
        return callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const seed = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value < 0 || value > 10000) {
        return callback(new Error("值区间：0-10000"));
      } else if (!a.test(value)) {
        return callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const period13 = (rule, value, callback) => {
      let a = /^[1-9]\d*$/;
      if (value < 15 || value > 9999) {
        return callback(new Error("值区间：15-9999"));
      } else if (!a.test(value)) {
        return callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const installmentSeedQuantity = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value) {
        if (value < 1 || value > 1000) {
          return callback(new Error("值区间：1-1000"));
        } else if (!a.test(value)) {
          return callback(new Error("整数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const periodMin = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      let b = /^[1-9]\d*$/;
      if (value) {
        if (value < 0.5 || value > 1000000) {
          return callback(new Error("值区间：0.5-1000000"));
        } else {
          if (value < 1) {
            if (!a.test(value)) {
              return callback(new Error("最多保留1位小数"));
            } else {
              callback();
            }
          } else if (value >= 1) {
            if (!b.test(value)) {
              return callback(new Error("整数"));
            } else {
              callback();
            }
          } else {
            return callback(new Error("格式不正确"));
          }
        }
      } else {
        callback();
      }
    };

    const amount = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value) {
        if (value < 0 || value > 100000) {
          return callback(new Error("值区间：0-100000"));
        } else if (!a.test(value)) {
          return callback(new Error("最多保留1位小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const seedQuantity = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value < 0 || value > 1000000) {
        return callback(new Error("值区间：0-1000000"));
      } else if (!a.test(value)) {
        return callback(new Error("整数"));
      } else {
        callback();
      }
    };

    return {
      myHeaders: {
        token: "",
      },
      fullscreenLoading: false,
      dialogFormVisible: false,
      userList: [],
      mobileNumber: "",
      form: {
        paramList: {
          POST_SEND_SEED: "",
          DAY_OF_POST_SEND_SEED: "",
          SIGN_SEND_SEED: "",
          SIGN_SEND_SEED_MAX: "",
          BALANCE_SEND_SEED: "",
          TRANS_SEND_SEED: "",
          DAY_OF_TRANS_SEND_SEED: "",
          VALUE_OF_SEED: "",
          DEDUCTION_SEED: "",
          FREE_BUY_DEDUCTION_SEED: "",
          SEED_PRODUCT_NEW_USER: "",
          SEED_PRODUCT_ADVANCE_PERIOD: "",
        },
        freeBuyDetailList: [],
        everyDayDetailList: [],
        configVideo: {
          seedQuantity: "",
          videoKey: "",
          videoUrl: "",
        },
        configFirstAction: {
          installmentSeedQuantity: "",
          freeBuyOnline: {
            periodMin: "",
            periodMax: "",
            seedQuantity: "",
          },
          advancePeriod: {
            amount: "",
            seedQuantity: "",
          },
          freeBuyOffline: {
            periodMin: "",
            periodMax: "",
            seedQuantity: "",
          },
        },
      },
      rules: {
        POST_SEND_SEED: [
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        DAY_OF_POST_SEND_SEED: [
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        SIGN_SEND_SEED: [
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        SIGN_SEND_SEED_MAX: [
          {
            validator: SIGN_SEND_SEED_MAX,
            trigger: "blur",
          },
        ],
        DAY_OF_TRANS_SEND_SEED: [
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        TRANS_SEND_SEED: [
          {
            required: true,
            pattern: /^[0-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        VALUE_OF_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        BALANCE_SEND_SEED: [
          {
            required: true,
            pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
            message: "请输入0-100之间的数值",
            trigger: "blur",
          },
        ],
        DEDUCTION_SEED: [
          {
            required: true,
            pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
            message: "请输入0-100之间的数值，最多两位小数",
            trigger: "blur",
          },
        ],
        FREE_BUY_DEDUCTION_SEED: [
          {
            required: true,
            pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
            message: "请输入0-100之间的数值，最多两位小数",
            trigger: "blur",
          },
        ],
        SEED_PRODUCT_NEW_USER: [
          {
            validator: SEED_PRODUCT_NEW_USER,
            trigger: "blur",
          },
        ],
        SEED_PRODUCT_ADVANCE_PERIOD: [
          {
            validator: SEED_PRODUCT_ADVANCE_PERIOD,
            trigger: "blur",
          },
        ],
        period: {
          validator: period,
          trigger: "blur",
        },
        amountRate: {
          validator: amountRate,
          trigger: "blur",
        },
        countPreDay: {
          validator: countPreDay,
          trigger: "blur",
        },
        minuteInterval: {
          validator: minuteInterval,
          trigger: "blur",
        },
        seed: {
          validator: seed,
          trigger: "blur",
        },
        period13: {
          validator: period13,
          trigger: "blur",
        },
        installmentSeedQuantity: {
          validator: installmentSeedQuantity,
          trigger: "blur",
        },
        periodMin: {
          validator: periodMin,
          trigger: "blur",
        },
        seedQuantity: {
          validator: seedQuantity,
          trigger: "blur",
        },
      },
      freeBuyDetailList: [],
      everyDayDetailList: [],
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.getSeedParamConfig();
  },
  methods: {
    // 获取种子设置
    getSeedParamConfig() {
      findProduct_seed().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let content = res.data.content;
            let keyArr = Object.keys(this.form.paramList);
            this.form.freeBuyDetailList = content.freeBuyDetailList;
            this.form.everyDayDetailList = content.everyDayDetailList;
            if (content.configVideo) {
              this.form.configVideo = content.configVideo;
              this.userList = content.configVideo.userList;
            }
            for (let key in this.form.configFirstAction) {
              if (content.configFirstAction[key]) {
                this.form.configFirstAction[key] =
                  content.configFirstAction[key];
              }
            }
            let result = content.paramList;
            keyArr.forEach((item) => {
              result.forEach((ite) => {
                if (item == ite.key) {
                  this.form.paramList[item] = ite.value;
                }
              });
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 增加规则--一折购赠送种子
    addRules_freeBuyDetailList() {
      this.form.freeBuyDetailList.push({
        periodMin: "",
        periodMax: "",
        amountRate: "",
      });
    },

    // 删除规则--一折购赠送种子
    del_freeBuyDetailList_items(index) {
      this.form.freeBuyDetailList.splice(index, 1);
    },

    // 增加规则--天天返购买赠送种子
    addRules_everyDayDetailList() {
      this.form.everyDayDetailList.push({
        periodMin: "",
        periodMax: "",
        amountRate: "",
      });
    },

    // 删除规则--天天返购买赠送种子
    del_everyDayDetailList_items(index) {
      this.form.everyDayDetailList.splice(index, 1);
    },

    // 上传视频之前
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 50;
      const fileSuffix = ["video/mp4", "video/webm"];
      let extension = file.type;
      if (!isLt1M) {
        this.$message.error("上传视频大小不能超过50MB!");
        return false;
      }
      if (!fileSuffix.includes(extension)) {
        this.$message.error("视频格式仅支持mp4/webm");
        return false;
      }
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },

    // 上传视频成功
    uploadVideoSuccess(response, file, fileList) {
      this.form.configVideo.videoUrl = response.content.url;
      this.form.configVideo.videoKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传视频失败
    uploadVideoError(err, file, fileList) {
      this.$message.error("上传视频失败");
      this.fullscreenLoading.close();
    },

    // 修改享受种子红包的用户 -- 打开弹窗
    changeUserList() {
      let str = "";
      this.userList.forEach((val, index) => {
        str += val.mobileNumber;
        if (index != this.userList.length - 1) {
          str += ",";
        }
      });
      this.mobileNumber = str;
      this.dialogFormVisible = true;
      this.dialogFormVisible = true;
    },

    // 添加/修改看视频获得种子的用户
    addOrUpdateDetail() {
      let mobileNumber = this.mobileNumber;
      if (mobileNumber.indexOf("，") != -1) {
        this.$message.error("多个手机号之间请使用英文逗号隔开");
        return;
      }
      addOrUpdateVideoUser({
        mobileNumber: mobileNumber,
      }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.userList = res.data.content;
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 保存
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let paramList = JSON.parse(JSON.stringify(this.form.paramList));
          if (
            Number(paramList.DAY_OF_POST_SEND_SEED) <
            Number(paramList.POST_SEND_SEED)
          ) {
            this.$message.error("发帖赠送用户种子数不能大于单日最高上限");
            return;
          }
          if (
            Number(paramList.DAY_OF_TRANS_SEND_SEED) <
            Number(paramList.TRANS_SEND_SEED)
          ) {
            this.$message.error(
              "Freebuy待返合约转让赠送种子数不能大于单日最高上限"
            );
            return;
          }
          let arr = [];
          for (let key in paramList) {
            let json = {};
            json.key = key;
            json.value = paramList[key];
            json.enabled = 1;
            arr.push(json);
          }
          let parms = {
            paramList: arr,
            freeBuyDetailList: this.form.freeBuyDetailList,
            configVideo: this.form.configVideo,
            everyDayDetailList: this.form.everyDayDetailList,
            configFirstAction: this.form.configFirstAction,
          };
          addOrUpdateProduct_seed(parms).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.getSeedParamConfig();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          this.$message.error("请检查输入格式");
        }
      });
    },
  },
};
</script>
<style scoped>
.seed_management {
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 16px;
  font-weight: bolder;
  padding-top: 20px;
  padding-bottom: 10px;
}

.userListBox {
  width: 100%;
  background-color: #f0f0f0;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #666;
  padding: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.userListBox div {
  margin: 0 6px;
}
</style>
