<template>
  <div class="addAgent">
    <el-form ref="form" :model="form" :rules="rules" label-position="left">
      <el-form-item
        label="代理商角色名称："
        label-width="140px"
        prop="roleName"
      >
        <el-input
          v-model="form.roleName"
          style="width: 200px"
          :disabled="disabled"
          size="mini"
          :maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label label-width="5px">
        <el-radio-group v-model="form.category" :disabled="disabledAgencyMode">
          <el-radio :label="1">独家代理</el-radio>
          <el-radio :label="2">非独家代理</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收费金额：" label-width="100px" prop="price">
        <el-input
          v-model="form.price"
          style="width: 160px"
          :disabled="disabled"
          size="mini"
        ></el-input
        >&nbsp;万
      </el-form-item>
      <el-form-item label="期限：" label-width="80px" prop="term">
        <el-input
          v-model="form.term"
          style="width: 160px"
          :disabled="disabled"
          size="mini"
        ></el-input
        >&nbsp;年
      </el-form-item>
      <!-- =====发展C端提成设置 和 B端提成设置===== -->
      <div v-for="(item, index) in form.equities" :key="index">
        <div
          style="font-size: 14px; color: #409eff; margin: 20px 0px"
          v-if="index == 0"
        >
          发展C端提成设置
        </div>
        <div
          class="itemsContent"
          :style="
            item.level == 2
              ? 'border-top:none'
              : item.type == 8
              ? ''
              : 'border-bottom:none;margin-top:10px;'
          "
        >
          <span class="itemTitle title" v-if="item.type == 9 && item.level == 1"
            >一折购分期：</span
          >
          <span class="itemTitle title" v-if="item.type == 1 && item.level == 1"
            >0成本购：</span
          >
          <span class="itemTitle title" v-if="item.type == 2 && item.level == 1"
            >购买待返：</span
          >
          <span class="itemTitle title" v-if="item.type == 3 && item.level == 1"
            >正常购买：</span
          >
          <span class="itemTitle title" v-if="item.type == 4 && item.level == 1"
            >发展钻石合伙人：</span
          >
          <span class="itemTitle title" v-if="item.type == 5 && item.level == 1"
            >待返转让：</span
          >
          <span class="itemTitle title" v-if="item.type == 6 && item.level == 1"
            >购买待返：</span
          >
          <div style="display: flex; flex-direction: cloumn">
            <el-form-item
              label
              label-width="0px"
              :prop="'equities.' + index + '.royaltyRate'"
              :rules="rules.agentRoyalty8"
              v-if="item.type == 8"
            >
              <span class="itemTitle">邀请新用户首次1折购奖励</span>
              <el-input
                v-model="item.royaltyRate"
                style="width: 80px"
                :disabled="disabled"
                size="mini"
                placeholder="非必填"
              ></el-input
              >元
            </el-form-item>
            <el-form-item
              label
              label-width="0px"
              :prop="'equities.' + index + '.royaltyRate'"
              :rules="rules.agentRoyalty9"
              v-else-if="item.type == 9"
            >
              <span class="itemTitle"
                >{{
                  item.level == 1 ? "一" : "二"
                }}级：1折购分期获得商品原价（1折购原价）的</span
              >
              <el-input
                v-model="item.royaltyRate"
                style="width: 80px"
                :disabled="disabled"
                size="mini"
                placeholder="非必填"
              ></el-input
              >%
            </el-form-item>
            <el-form-item
              label
              label-width="0px"
              :prop="'equities.' + index + '.royaltyRate'"
              :rules="rules.agentRoyalty"
              v-else
            >
              <span
                class="itemTitle"
                v-if="item.type == 1 && item.category == 1"
                >{{ item.level == 1 ? "一" : "二" }}级：获得支付金额</span
              >
              <span
                class="itemTitle"
                v-if="item.type == 1 && item.category == 2"
                >{{ item.level == 1 ? "一" : "二" }}级：获得原实付价的</span
              >
              <span class="itemTitle" v-if="item.type == 2"
                >{{ item.level == 1 ? "一" : "二" }}级：获得支付金额</span
              >
              <span class="itemTitle" v-if="item.type == 3"
                >{{ item.level == 1 ? "一" : "二" }}级：获得原实付价的</span
              >
              <span class="itemTitle" v-if="item.type == 4"
                >{{ item.level == 1 ? "一" : "二" }}级：获得会员费的</span
              >
              <span class="itemTitle" v-if="item.type == 5 || item.type == 6"
                >{{ item.level == 1 ? "一" : "二" }}级：获得手续费的</span
              >
              <span class="itemTitle" v-if="item.type == 7"
                >{{ item.level == 1 ? "一" : "二" }}级：获得利润的</span
              >
              <el-input
                v-model="item.royaltyRate"
                style="width: 80px"
                :disabled="disabled"
                size="mini"
                placeholder="非必填"
              ></el-input>
              <span
                v-if="item.type == 3 || (item.type == 1 && item.category == 2)"
                >%+</span
              >
              <span v-else-if="item.type == 1 || item.type == 2"
                >%的年化收益</span
              >
              <span v-else>%</span>
            </el-form-item>
            <el-form-item
              label="利润的"
              label-width="55px"
              v-if="item.type == 3 || (item.type == 1 && item.category == 2)"
              :prop="'equities.' + index + '.profitRate'"
              :rules="rules.agentRoyalty"
            >
              <el-input
                v-model="item.profitRate"
                style="width: 80px"
                :disabled="disabled"
                size="mini"
                placeholder="非必填"
              ></el-input
              >%
            </el-form-item>
            <!-- 多选框内容 -->
            <div
              style="display: flex; flex-direction: column"
              v-if="item.type != 8 && item.type != 9"
            >
              <el-form-item label label-width="0px" style="margin-left: 20px">
                <div style="display: flex">
                  <el-checkbox
                    v-model="item.hasDuration"
                    :disabled="disabled"
                    @change="timeRadio(item.hasDuration, index)"
                    >选择持续时间</el-checkbox
                  >
                  <div style="display: flex; align-items: center">
                    <span v-if="item.hasDuration">&nbsp;&nbsp;持续时间：</span>
                    <el-form-item
                      label-width="0px"
                      :prop="'equities.' + index + '.duration'"
                      :rules="rules.duration"
                    >
                      <el-input
                        v-model="item.duration"
                        style="width: 80px"
                        :disabled="disabled"
                        size="mini"
                        v-if="item.hasDuration"
                      ></el-input>
                    </el-form-item>
                    <span v-if="item.hasDuration">
                      个月&nbsp;|&nbsp;持续时间后获得
                      <span v-if="item.type == 1 && item.category == 1"
                        >支付金额</span
                      >
                      <span v-if="item.type == 1 && item.category == 2"
                        >原实付价的</span
                      >
                      <span v-if="item.type == 2">支付金额</span>
                      <span v-if="item.type == 3">原实付价的</span>
                      <span v-if="item.type == 4">会员费的</span>
                      <span v-if="item.type == 5 || item.type == 6"
                        >手续费</span
                      >
                      <span v-if="item.type == 7 || item.type == 8"
                        >利润的</span
                      >
                    </span>
                    <el-form-item
                      label-width="0px"
                      :prop="'equities.' + index + '.durationRate'"
                      :rules="rules.agentRoyalty"
                    >
                      <el-input
                        v-model="item.durationRate"
                        style="width: 80px"
                        :disabled="disabled"
                        size="mini"
                        v-if="item.hasDuration"
                      ></el-input>
                    </el-form-item>
                    <span v-if="item.hasDuration && item.type == 3"
                      >%+利润的</span
                    >
                    <span
                      v-if="
                        item.hasDuration && item.type == 1 && item.category == 2
                      "
                      >%+利润的</span
                    >
                    <span
                      v-if="
                        item.hasDuration && item.type != 3 && item.category != 2
                      "
                      >%的年化收益</span
                    >
                    <el-input
                      v-model="item.durationProfitRate"
                      style="width: 80px"
                      :disabled="disabled"
                      size="mini"
                      v-if="
                        item.hasDuration &&
                        (item.type == 3 ||
                          (item.type == 1 && item.category == 2))
                      "
                    ></el-input>
                    <span
                      v-if="
                        item.hasDuration &&
                        (item.type == 3 ||
                          (item.type == 1 && item.category == 2))
                      "
                      >%</span
                    >
                  </div>
                </div>
              </el-form-item>
              <el-form-item label label-width="0px" style="margin-left: 20px">
                <div style="display: flex">
                  <el-checkbox
                    v-model="item.hasSupport"
                    :disabled="disabled"
                    @change="hasSupportRadio(item.hasSupport, index)"
                    >增加政策扶持</el-checkbox
                  >
                  <div style="display: flex; align-items: center">
                    <span v-if="item.hasSupport">
                      &nbsp;&nbsp;增加获得
                      <span v-if="item.type == 1 && item.category == 1"
                        >支付金额</span
                      >
                      <span v-if="item.type == 1 && item.category == 2"
                        >原实付价的</span
                      >
                      <span v-if="item.type == 2">支付金额</span>
                      <span v-if="item.type == 3">原实付价的</span>
                      <span v-if="item.type == 4">会员费的</span>
                      <span v-if="item.type == 5 || item.type == 6"
                        >手续费</span
                      >
                      <span v-if="item.type == 7 || item.type == 8"
                        >利润的</span
                      >
                    </span>
                    <el-form-item
                      label-width="0px"
                      :prop="'equities.' + index + '.supportRate'"
                      :rules="rules.agentRoyalty"
                    >
                      <el-input
                        v-model="item.supportRate"
                        style="width: 80px"
                        :disabled="disabled"
                        size="mini"
                        v-if="item.hasSupport"
                      ></el-input>
                    </el-form-item>
                    <span
                      v-if="
                        item.hasSupport && item.type != 3 && item.category != 2
                      "
                      >%的年化收益&nbsp;|&nbsp;持续时间：开通后</span
                    >
                    <span v-if="item.hasSupport && item.type == 3"
                      >%+利润的</span
                    >
                    <span
                      v-if="
                        item.hasSupport && item.type == 1 && item.category == 2
                      "
                      >%+利润的</span
                    >
                    <el-input
                      v-model="item.supportProfitRate"
                      style="width: 80px"
                      :disabled="disabled"
                      size="mini"
                      v-if="
                        item.hasSupport &&
                        (item.type == 3 ||
                          (item.type == 1 && item.category == 2))
                      "
                    ></el-input>
                    <span
                      v-if="
                        item.hasSupport &&
                        (item.type == 3 ||
                          (item.type == 1 && item.category == 2))
                      "
                      >%&nbsp;|&nbsp;持续时间：开通后</span
                    >
                    <el-form-item
                      label-width="0px"
                      :prop="'equities.' + index + '.supportDuration'"
                      :rules="rules.duration"
                    >
                      <el-input
                        v-model="item.supportDuration"
                        style="width: 80px"
                        :disabled="disabled"
                        size="mini"
                        v-if="item.hasSupport"
                      ></el-input>
                    </el-form-item>
                    <span v-if="item.hasSupport">个月</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                label
                label-width="0px"
                style="margin-left: 20px"
                v-if="
                  ((item.type == 1 && item.category == 1) || item.type == 2) &&
                  index < 4 &&
                  item.level == 1
                "
              >
                <div style="display: flex">
                  <el-checkbox
                    v-model="item.hasReward"
                    :disabled="disabled"
                    @change="hasRewardRadio(item.hasReward, index)"
                    >阶梯奖励政策</el-checkbox
                  >
                  <div
                    style="
                      display: flex;
                      flex-direction: cloumn;
                      align-items: center;
                    "
                  >
                    <div>
                      <div
                        v-for="(ite, idx) in item.rewards"
                        :key="idx"
                        style="
                          display: flex;
                          flex-direction: cloumn;
                          align-items: center;
                          margin-bottom: 10px;
                        "
                      >
                        <span v-if="item.hasReward">&nbsp;&nbsp;业绩达到</span>
                        <el-form-item
                          label-width="0px"
                          :prop="
                            'equities.' + index + '.rewards.' + idx + '.quota'
                          "
                          :rules="{
                            required: false,
                            pattern: /^[0-9]\d*$/,
                            message: '仅限正整数数字',
                            trigger: 'blur',
                          }"
                        >
                          <el-input
                            v-model="ite.quota"
                            style="width: 100px"
                            :disabled="disabled"
                            size="mini"
                            :maxlength="9"
                            v-if="item.hasReward"
                          ></el-input>
                        </el-form-item>
                        <span v-if="item.hasReward">元增加获得支付金额</span>
                        <el-form-item
                          label-width="0px"
                          :prop="
                            'equities.' + index + '.rewards.' + idx + '.reward'
                          "
                          :rules="rules.reward"
                        >
                          <el-input
                            v-model="ite.reward"
                            style="width: 80px"
                            :disabled="disabled"
                            size="mini"
                            v-if="item.hasReward"
                          ></el-input>
                        </el-form-item>
                        <span v-if="item.hasReward">%的年化收益</span>
                        <el-button
                          style="margin-left: 30px"
                          type="text"
                          v-if="item.hasReward"
                          @click="deletRewardItems(index, idx)"
                          :disabled="disabled"
                          >删除</el-button
                        >
                      </div>
                    </div>
                    <el-button
                      type="text"
                      style="margin-left: 40px; margin-bottom: 10px"
                      v-if="item.hasReward"
                      @click="addReward(index)"
                      :disabled="item.rewards.length >= 10 || disabled"
                      >添加</el-button
                    >
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
          <el-form-item
            label="独家专享：自己代理的省/市/区下所有的商家，均获得商家出售商品利润的"
            label-width="470px"
            prop="merchantRoyalty"
            v-if="index == 16"
          >
            <el-input
              v-model="form.merchantRoyalty"
              style="width: 100px"
              :disabled="disabled"
              size="mini"
              placeholder="非必填"
            ></el-input
            >%
          </el-form-item>
        </div>
        <div
          style="font-size: 14px; color: #409eff; margin: 20px 0px"
          v-if="index == 14"
        >
          发展B端提成设置
        </div>
      </div>
      <!-- =====发展代理商提成设置===== -->
      <div style="font-size: 14px; color: #409eff; margin: 20px 0px">
        发展代理商提成设置
      </div>
      <div class="itemsContent" style="border: 1px solid #333">
        <el-form-item
          label="自行发展自己代理省份/城市下面的代理，获得代理费的"
          label-width="360px"
          prop="agentRoyalty"
        >
          <el-input
            v-model="form.agentRoyalty"
            style="width: 80px"
            placeholder="非必填"
            :disabled="disabled"
            size="mini"
          ></el-input
          >%（仅独家代理有此提成）
        </el-form-item>
        <el-form-item
          label="他人发展自己代理省份/城市下面的代理，获得代理费的"
          label-width="360px"
          prop="otherAgentRoyalty"
        >
          <el-input
            v-model="form.otherAgentRoyalty"
            style="width: 80px"
            placeholder="非必填"
            :disabled="disabled"
            size="mini"
          ></el-input
          >%（仅独家代理有此提成，代理区域必须在市级以上）
        </el-form-item>
        <el-form-item
          label="发展非自己代理省份/城市下面的代理，获得代理费的"
          label-width="360px"
          prop="otherAreaRoyalty"
        >
          <el-input
            v-model="form.otherAreaRoyalty"
            style="width: 80px"
            placeholder="非必填"
            :disabled="disabled"
            size="mini"
          ></el-input
          >%
        </el-form-item>
        <el-form-item label="下级代理发展代理获得代理费的" label-width="210px">
          <el-input
            v-model="form.lowerAgentRoyalty"
            style="width: 80px"
            :disabled="disabled"
            size="mini"
          ></el-input
          >%
        </el-form-item>
      </div>
      <el-form-item style="margin-top: 20px">
        <el-button
          type="primary"
          style="width: 200px; margin-left: 160px"
          @click="goBack"
          >返回</el-button
        >
        <el-button
          type="primary"
          style="width: 200px; margin-left: 160px"
          @click="submitForm('form')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { findAgentRoleById, addOrUpdateAgentRole } from "@/network/api";
export default {
  data() {
    // form 表单自定义校验规则
    const price = (rule, value, callback) => {
      if (value < 0 || value >= 1000) {
        return callback(new Error("值区间：大于等于0小于1000"));
      } else {
        callback();
      }
    };
    const term = (rule, value, callback) => {
      if (value <= 0 || value >= 100) {
        return callback(new Error("值区间：大于0小于100"));
      } else {
        callback();
      }
    };
    const merchantRoyalty = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value <= 0.1 || value >= 100) {
          return callback(new Error("值区间：大于0.1小于100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const agentRoyalty = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value <= 0.1 || value >= 100) {
          return callback(new Error("值区间：大于0.1小于100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const agentRoyalty8 = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value < 1 || value > 100) {
          return callback(new Error("值区间：1-100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const agentRoyalty9 = (rule, value, callback) => {
      if (value) {
        let a = /^(\d+\.\d{1,1}|\d+)$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留1位小数"));
        } else if (value < 0.1 || value > 1000) {
          return callback(new Error("值区间：大于0.1小于1000"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const duration = (rule, value, callback) => {
      if (value) {
        let a = /^-?[0-9]\d*$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，不可输入小数"));
        } else if (value <= 1 || value >= 100) {
          return callback(new Error("值区间：大于1小于100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const reward = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value <= 0.1 || value > 50) {
          return callback(new Error("值区间：大于等于0.1小于等于50"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const otherAgentRoyalty = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value <= 0.1 || value >= 100) {
          return callback(new Error("值区间：大于0.1小于100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const otherAreaRoyalty = (rule, value, callback) => {
      if (value) {
        let a = /^-?\d+(\.\d{1,2})?$/;
        if (!a.test(value)) {
          return callback(new Error("仅限数字，且最多保留两位小数"));
        } else if (value <= 0.1 || value >= 100) {
          return callback(new Error("值区间：大于0.1小于100"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      disabled: false,
      disabledAgencyMode: true, // 独家代理和非独家代理radio是否设置为disabled
      form: {
        roleName: "", // 角色名称
        category: 1, // 角色类型
        price: "", // 收费金额
        term: "", // 期限
        merchantRoyalty: "", //独家代理商户收益提成
        otherAgentRoyalty: "", //他人发展代理提成
        agentRoyalty: "", //自行发展代理提成
        otherAreaRoyalty: "", //发展其他地区代理提成
        lowerAgentRoyalty: "", //下级发展代理提成
        equities: [
          {
            level: 1,
            type: 8,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [
              {
                quota: "",
                reward: "",
              },
            ],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 9,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [
              {
                quota: "",
                reward: "",
              },
            ],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 9,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [
              {
                quota: "",
                reward: "",
              },
            ],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 1,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [
              {
                quota: "",
                reward: "",
              },
            ],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 1,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 2,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [
              {
                quota: "",
                reward: "",
              },
            ],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 2,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 3,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 3,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 4,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 4,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 5,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 5,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 6,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 6,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 1,
            type: 7,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
          {
            level: 2,
            type: 7,
            category: 1,
            royaltyRate: "",
            profitRate: "",
            hasDuration: false,
            duration: "",
            durationProfitRate: "",
            durationRate: "",
            hasSupport: false,
            rewards: [],
            supportDuration: "",
            supportProfitRate: "",
            supportRate: "",
            hasReward: false,
          },
        ],
      },
      rules: {
        roleName: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "字符长度：2-10", trigger: "blur" },
        ],
        price: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: /^-?\d+(\.\d{1,2})?$/,
            message: "仅限数字，且最多保留两位小数",
            trigger: "blur",
          },
          { validator: price, trigger: "blur" },
        ],
        term: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^-?[0-9]\d*$/, message: "仅限整数数字", trigger: "blur" },
          { validator: term, trigger: "blur" },
        ],
        merchantRoyalty: [{ validator: merchantRoyalty, trigger: "blur" }],
        agentRoyalty: [{ validator: agentRoyalty, trigger: "blur" }],
        agentRoyalty8: [{ validator: agentRoyalty8, trigger: "blur" }],
        agentRoyalty9: [{ validator: agentRoyalty9, trigger: "blur" }],
        duration: [{ validator: duration, trigger: "blur" }],
        reward: [{ validator: reward, trigger: "blur" }],
        otherAgentRoyalty: [{ validator: otherAgentRoyalty, trigger: "blur" }],
        otherAreaRoyalty: [{ validator: otherAreaRoyalty, trigger: "blur" }],
      },
    };
  },
  created() {
    // index:页面跳转的类型 1-添加 2-查看 3-修改
    let index = this.$route.query.index;
    if (index == 1) {
      this.disabledAgencyMode = false;
    } else {
      this.findAgentRoleById(this.$route.query.id);
      if (index == 2) {
        this.disabled = true;
      }
    }
  },
  methods: {
    // 查询代理商角色详情
    findAgentRoleById(id) {
      findAgentRoleById(`?id=${id}`).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          for (let key in content) {
            if (key != "equities") {
              this.form[key] = content[key];
            }
          }
          this.form.equities.forEach((item, index) => {
            content.equities.forEach((val, idx) => {
              val.hasDuration = val.hasDuration == 1 ? true : false;
              val.hasSupport = val.hasSupport == 1 ? true : false;
              val.hasReward = val.hasReward == 1 ? true : false;
              if (item.type == val.type && item.level == val.level) {
                for (let key in val) {
                  item[key] = val[key];
                }
              }
            });
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加 阶梯奖励政策
    addReward(index) {
      this.form.equities[index].rewards.push({
        quota: "",
        reward: "",
      });
    },
    // 删除阶梯奖励政策
    deletRewardItems(index, idx) {
      this.form.equities[index].rewards.splice(idx, 1);
    },
    // 选择持续时间复选框改变事件
    timeRadio(val, index) {
      if (!val) {
        this.form.equities[index].duration = "";
        this.form.equities[index].durationRate = "";
        this.form.equities[index].durationProfitRate = "";
        // 移除该表单项的校验结果
        this.$refs["form"].clearValidate();
      }
    },
    // 选择增加政策扶持复选框改变事件
    hasSupportRadio(val, index) {
      if (!val) {
        this.form.equities[index].supportRate = "";
        this.form.equities[index].supportDuration = "";
        this.form.equities[index].supportProfitRate = "";
        // 移除该表单项的校验结果
        this.$refs["form"].clearValidate();
      }
    },
    // 选择阶梯奖励政策复选框改变事件
    hasRewardRadio(val, index) {
      if (!val) {
        this.form.equities[index].rewards.forEach((item) => {
          item.quota = "";
          item.reward = "";
        });
        // 移除该表单项的校验结果
        this.$refs["form"].clearValidate();
      }
    },
    // 返回
    goBack() {
      this.$router.go("-1");
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form));
          let a = true;
          let b = true;
          let c = true;
          form.equities.forEach((val) => {
            val.hasDuration = val.hasDuration ? 1 : 0;
            val.hasSupport = val.hasSupport ? 1 : 0;
            val.hasReward = val.hasReward ? 1 : 0;
            // 如果选择了持续时间 后面内容不能为空
            if (val.hasDuration == 1) {
              if (val.type != 3) {
                if (val.type == 1 && val.category == 2) {
                  if (
                    !val.duration ||
                    !val.durationRate ||
                    !val.durationProfitRate
                  ) {
                    a = false;
                  }
                } else {
                  if (!val.duration || !val.durationRate) {
                    a = false;
                  }
                }
              } else if (val.type == 3) {
                if (
                  !val.duration ||
                  !val.durationRate ||
                  !val.durationProfitRate
                ) {
                  a = false;
                }
              }
            }
            // 如果选择了增加政策扶持 后面内容不能为空
            if (val.hasSupport == 1) {
              if (val.type != 3) {
                if (val.type == 1 && val.category == 2) {
                  if (
                    !val.supportDuration ||
                    !val.supportRate ||
                    !val.supportProfitRate
                  ) {
                    b = false;
                  }
                } else {
                  if (!val.supportDuration || !val.supportRate) {
                    b = false;
                  }
                }
              } else if (val.type == 3) {
                if (
                  !val.supportDuration ||
                  !val.supportRate ||
                  !val.supportProfitRate
                ) {
                  b = false;
                }
              }
            }
            // 如果选择了阶梯奖励政策后面内容不能为空
            if (val.hasReward == 1) {
              val.rewards.forEach((ite) => {
                if (!ite.quota || !ite.reward) {
                  c = false;
                }
              });
            }
          });
          if (!a) {
            this.$message.error("选择持续时间后内容不能为空");
            return;
          }
          if (!b) {
            this.$message.error("增加政策扶持后内容不能为空");
            return;
          }
          if (!c) {
            this.$message.error("阶梯奖励政策后内容不能为空");
            return;
          }
          addOrUpdateAgentRole(form).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.$router.go("-1");
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          this.$message.error("请检查输入内容是否有误");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.addAgent {
  width: 1280px;
  padding: 20px;
  box-sizing: border-box;
  .itemsContent {
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid #333;
    .itemTitle {
      font-size: 14px;
      color: #606266;
    }
    .title {
      display: inline-block;
      padding-top: 10px;
    }
  }
}
</style>