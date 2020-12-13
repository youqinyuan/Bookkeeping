<template>
  <div class="seed_consume">
    <div class="title">
      <span style="font-size: 20px; font-weight: 600">种子扣除规则名称：</span>
      <el-input
        v-model="form.title"
        placeholder="请输入内容"
        :maxlength="20"
        style="width: 300px"
      ></el-input>
    </div>
    <el-form :model="form" :rules="rules" ref="form">
      <!-- 1、购买商品消耗种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">1、购买商品消耗种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="add_rules('freeBuyGoodsList', '11')"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in form.freeBuyGoodsList"
          :key="index"
        >
          <div style="margin-top: 10px">
            <span>商品限制</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="del_rules('freeBuyGoodsList', index)"
              v-if="index > 0"
              >删除</el-button
            >
          </div>
          <el-radio-group v-model="item.fitGoodsGroup" style="margin-top: 20px">
            <el-radio :label="1">全部商品</el-radio>
            <el-radio :label="2">自定义商品</el-radio>
          </el-radio-group>
          <el-form-item
            :prop="'freeBuyGoodsList.' + index + '.goodsIds'"
            :rules="rules.goodsIds"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="多个商品id之间用英文逗号隔开"
              v-model="item.goodsIds"
              style="margin-top: 20px"
              v-if="item.fitGoodsGroup == 2"
            ></el-input>
          </el-form-item>
          <div style="margin-top: 20px">以上所有商品购买最长期个数范围</div>
          <div style="width: 100%; display: flex; margin-top: 20px">
            <el-form-item
              :prop="'freeBuyGoodsList.' + index + '.timesMin'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="'freeBuyGoodsList.' + index + '.timesMax'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMax" style="width: 100px"></el-input
              >个
            </el-form-item>
          </div>
          <div>
            <span>扣除种子数量</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="add_rules_item('freeBuyGoodsList', '1', index)"
              >添加规则</el-button
            >
          </div>
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-for="(ite, idx) in form.freeBuyGoodsList[index].detailList"
            :key="idx"
          >
            <el-form-item
              :prop="`freeBuyGoodsList.${index}.detailList.${idx}.periodMin`"
              :rules="rules.detailList.period"
            >
              <span>待返期数在</span>
              <el-input v-model="ite.periodMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="`freeBuyGoodsList.${index}.detailList.${idx}.periodMax`"
              :rules="rules.detailList.period"
            >
              <el-input v-model="ite.periodMax" style="width: 100px"></el-input>
              <span>期，扣除原价</span>
            </el-form-item>
            <el-form-item
              :prop="`freeBuyGoodsList.${index}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`freeBuyGoodsList.${index}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules_item('freeBuyGoodsList', index, idx)"
                v-if="idx > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 2、待返发卖贴（转让）消耗种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">2、待返发卖贴（转让）消耗种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              :disabled="form.forumSaleList.length >= 10"
              @click="add_rules('forumSaleList', '1')"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in form.forumSaleList"
          :key="index"
        >
          <div style="margin-top: 10px">发帖+转让次数范围</div>
          <div style="width: 100%; display: flex; margin-top: 10px">
            <el-form-item
              :prop="'forumSaleList.' + index + '.timesMin'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="'forumSaleList.' + index + '.timesMax'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMax" style="width: 100px"></el-input
              >次
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules('forumSaleList', index)"
                v-if="index > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
          <div>
            <span>扣除种子数量</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="add_rules_item('forumSaleList', '1', index)"
              >添加规则</el-button
            >
          </div>
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-for="(ite, idx) in form.forumSaleList[index].detailList"
            :key="idx"
          >
            <el-form-item
              :prop="`forumSaleList.${index}.detailList.${idx}.periodMin`"
              :rules="rules.detailList.period"
            >
              <span>待返期数在</span>
              <el-input v-model="ite.periodMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="`forumSaleList.${index}.detailList.${idx}.periodMax`"
              :rules="rules.detailList.period"
            >
              <el-input v-model="ite.periodMax" style="width: 100px"></el-input>
              <span>期，扣除售价</span>
            </el-form-item>
            <el-form-item
              :prop="`forumSaleList.${index}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`forumSaleList.${index}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules_item('forumSaleList', index, idx)"
                v-if="idx > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 3、预售订单消耗种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">3、预售订单消耗种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              :disabled="form.forumAdvanceOrderList.length >= 10"
              @click="add_rules('forumAdvanceOrderList', '2')"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in form.forumAdvanceOrderList"
          :key="index"
        >
          <div style="margin-top: 10px">预售订单发帖次数范围</div>
          <div style="width: 100%; display: flex; margin-top: 10px">
            <el-form-item
              :prop="'forumAdvanceOrderList.' + index + '.timesMin'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="'forumAdvanceOrderList.' + index + '.timesMax'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMax" style="width: 100px"></el-input
              >次
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules('forumAdvanceOrderList', index)"
                v-if="index > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
          <div>
            <span>扣除种子数量</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="add_rules_item('forumAdvanceOrderList', '2', index)"
              >添加规则</el-button
            >
          </div>
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-for="(ite, idx) in form.forumAdvanceOrderList[index].detailList"
            :key="idx"
          >
            <el-form-item
              :prop="`forumAdvanceOrderList.${index}.detailList.${idx}.periodMin`"
              :rules="rules.detailList.period"
            >
              <span>预售期数在</span>
              <el-input v-model="ite.periodMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="`forumAdvanceOrderList.${index}.detailList.${idx}.periodMax`"
              :rules="rules.detailList.period"
            >
              <el-input v-model="ite.periodMax" style="width: 100px"></el-input>
              <span>期，扣除售价</span>
            </el-form-item>
            <el-form-item
              :prop="`forumAdvanceOrderList.${index}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`forumAdvanceOrderList.${index}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules_item('forumAdvanceOrderList', index, idx)"
                v-if="idx > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 4、发提期贴消耗种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">4、发提期贴消耗种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              :disabled="form.forumAdvancePeriodList.length >= 10"
              @click="add_rules('forumAdvancePeriodList', '3')"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in form.forumAdvancePeriodList"
          :key="index"
        >
          <div style="margin-top: 10px">提期发帖次数范围</div>
          <div style="width: 100%; display: flex; margin-top: 10px">
            <el-form-item
              :prop="'forumAdvancePeriodList.' + index + '.timesMin'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="'forumAdvancePeriodList.' + index + '.timesMax'"
              :rules="rules.times"
            >
              <el-input v-model="item.timesMax" style="width: 100px"></el-input
              >次
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules('forumAdvancePeriodList', index)"
                v-if="index > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
          <div>扣除种子数量</div>
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-for="(ite, idx) in form.forumAdvancePeriodList[index].detailList"
            :key="idx"
          >
            <el-form-item
              :prop="`forumAdvancePeriodList.${index}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <span>扣除待返金额</span>
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`forumAdvancePeriodList.${index}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 5、待返返还提现扣除种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">5、待返返还提现扣除种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              :disabled="form.noCashBackWithdrawList.length >= 10"
              @click="add_rules_item('noCashBackWithdrawList', '4', 0)"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          v-for="(ite, idx) in form.noCashBackWithdrawList[0].detailList"
          :key="idx"
        >
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-if="ite.subType == 4"
          >
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.periodMin`"
              :rules="rules.detailList.period4"
            >
              <span>待返期数为</span>
              <el-input v-model="ite.periodMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.periodMax`"
              :rules="rules.detailList.period4"
            >
              <el-input v-model="ite.periodMax" style="width: 100px"></el-input>
              <span>扣除提现金额</span>
            </el-form-item>
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules_item('noCashBackWithdrawList', 0, idx)"
                v-if="idx > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
        <div>
          <span>新用户</span>
          <el-button
            type="text"
            style="margin-left: 40px"
            :disabled="form.noCashBackWithdrawList.length >= 10"
            @click="add_rules_item2('noCashBackWithdrawList', '5', 0)"
            >添加规则</el-button
          >
        </div>
        <div
          v-for="(ite, idx) in form.noCashBackWithdrawList[0].detailList"
          :key="ite.id"
        >
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-if="ite.subType == 5"
          >
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <span
                >第{{ ite.periodMax }}个月待返提现时扣除上方规则计算结果</span
              >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`noCashBackWithdrawList.${0}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
              <el-button
                type="text"
                style="margin-left: 40px"
                v-if="ite.isCanDel"
                @click="del_rules_item4('noCashBackWithdrawList', 0, idx)"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 6、天天返提现扣除种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">6、天天返提现扣除种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              :disabled="form.everyDayOrderList.length >= 10"
              @click="add_rules('everyDayOrderList', '8')"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in form.everyDayOrderList"
          :key="index"
        >
          <div style="margin-top: 10px">待返天数为</div>
          <div style="width: 100%; display: flex; margin-top: 10px">
            <el-form-item
              :prop="'everyDayOrderList.' + index + '.timesMin'"
              :rules="rules.times5"
            >
              <el-input v-model="item.timesMin" style="width: 100px"></el-input
              >-
            </el-form-item>
            <el-form-item
              :prop="'everyDayOrderList.' + index + '.timesMax'"
              :rules="rules.times5"
            >
              <el-input v-model="item.timesMax" style="width: 100px"></el-input
              >天
              <el-button
                type="text"
                style="margin-left: 40px"
                @click="del_rules('everyDayOrderList', index)"
                v-if="index > 0"
                >删除</el-button
              >
            </el-form-item>
          </div>
          <div>扣除种子数量</div>
          <div
            style="width: 100%; display: flex; margin-top: 10px"
            v-for="(ite, idx) in form.everyDayOrderList[index].detailList"
            :key="idx"
          >
            <el-form-item
              :prop="`everyDayOrderList.${index}.detailList.${idx}.periodMax`"
              :rules="rules.detailList.period5"
            >
              <span>免种子提现金额占总待返的</span>
              <el-input v-model="ite.periodMax" style="width: 100px"></el-input>
              <span>%剩余提现金额扣除提现金额</span>
            </el-form-item>
            <el-form-item
              :prop="`everyDayOrderList.${index}.detailList.${idx}.amountRate`"
              :rules="rules.detailList.amountRate"
            >
              <el-input
                v-model="ite.amountRate"
                style="width: 100px"
              ></el-input>
              <span>%的种子+扣除固定种子</span>
            </el-form-item>
            <el-form-item
              :prop="`everyDayOrderList.${index}.detailList.${idx}.seedQuantity`"
              :rules="rules.detailList.seedQuantity"
            >
              <el-input
                v-model="ite.seedQuantity"
                style="width: 120px"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 7、撤销1折购扣除种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">7、撤销1折购扣除种子</span>
          </div>
        </div>
        <div class="item" style="margin-top: 20px">
          <el-form-item prop="freeBuyCancel" :rules="rules.freeBuyCancel">
            <span>撤销扣除终止返还金额的</span>
            <el-input
              v-model="form.freeBuyCancel"
              style="width: 120px"
            ></el-input>
            <span>%种子</span>
          </el-form-item>
        </div>
      </div>
      <!-- 8、套现扣除种子 -->
      <div class="itemBox">
        <div class="titleBox">
          <div class="left">
            <span class="title">8、套现扣除种子</span>
            <el-button
              type="text"
              style="margin-left: 40px"
              @click="add_rules_cashOutList"
              >添加规则</el-button
            >
          </div>
        </div>
        <div
          v-for="(item, index) in form.cashOutList"
          :key="index"
          style="width: 100; display: flex"
        >
          <el-form-item
            :prop="`cashOutList.${index}.amountRate`"
            :rules="rules.amountRate8"
          >
            <span>第{{ item.periodMax }}次套现扣除提现金额</span>
            <el-input v-model="item.amountRate" style="width: 100px"></el-input>
            <span>%的种子</span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="text"
              style="margin-left: 40px"
              v-if="index > 0"
              @click="del_rules_cashOutList(index)"
              >删除</el-button
            >
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="btnBox">
      <el-button type="success" @click="navBack">返回上一页</el-button>
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
    </div>
  </div>
</template>
<script>
import { addOrUpdateConsumeTopic, findConsume } from "@/network/api";
export default {
  data() {
    const goodsIds = (rule, value, callback) => {
      if (value && value.indexOf("，") != "-1") {
        callback(new Error("商品id之间请用英文逗号隔开"));
      } else {
        callback();
      }
    };
    const times = (rule, value, callback) => {
      let a = /^[1-9]\d*$/;
      if (value < 1 || value > 5000) {
        callback(new Error("值区间：1-5000"));
      } else if (!a.test(value)) {
        callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const times5 = (rule, value, callback) => {
      let b = /^[1-9]\d*$/;
      if (value < 15 || value > 9999) {
        callback(new Error("值区间：15-9999"));
      } else if (!b.test(value)) {
        callback(new Error("不可为小数"));
      } else {
        callback();
      }
    };
    const period = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value < 0.5 || value > 1000000) {
        callback(new Error("值区间：0.5-1000000"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else {
        callback();
      }
    };
    const period4 = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      let b = /^[1-9]\d*$/;
      if (value < 0 || value > 500) {
        callback(new Error("值区间：1-500"));
      } else if (value < 1 && !a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else if (value >= 1 && !b.test(value)) {
        callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const period5 = (rule, value, callback) => {
      let a = /^\d+(.\d{1,2})?$/;
      if (value < 1 || value > 100) {
        callback(new Error("值区间：1-100"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留2位小数"));
      } else {
        callback();
      }
    };
    const amountRate = (rule, value, callback) => {
      let a = /^\d+(.\d{1,2})?$/;
      if (value < 0 || value > 1000) {
        callback(new Error("值区间：0-1000"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留2位小数"));
      } else {
        callback();
      }
    };
    const seedQuantity = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value < 0 || value > 10000) {
        callback(new Error("值区间：0-10000"));
      } else if (!a.test(value)) {
        callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const freeBuyCancel = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value < 1 || value > 200) {
        callback(new Error("值区间：1-200"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else {
        callback();
      }
    };
    const amountRate8 = (rule, value, callback) => {
      let a = /^\d+(.\d{1,2})?$/;
      if (value) {
        if (value < 0 || value > 10000) {
          callback(new Error("值区间：0-10000"));
        } else if (!a.test(value)) {
          callback(new Error("最多保留2位小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      form: {
        title: "",
        freeBuyGoodsList: [
          {
            fitGoodsGroup: 1,
            goodsIds: "",
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "11",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        forumSaleList: [
          {
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "1",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        forumAdvanceOrderList: [
          {
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "2",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        forumAdvancePeriodList: [
          {
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "3",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        noCashBackWithdrawList: [
          {
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "4",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
              {
                subType: "5",
                periodMin: "",
                periodMax: "1",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        everyDayOrderList: [
          {
            timesMin: "",
            timesMax: "",
            detailList: [
              {
                subType: "8",
                periodMin: "",
                periodMax: "",
                amountRate: "",
                seedQuantity: "",
              },
            ],
          },
        ],
        freeBuyCancel: "",
        cashOutList: [
          {
            subType: "17",
            periodMax: "1",
            amountRate: "",
          },
        ],
      },
      rules: {
        goodsIds: { required: true, validator: goodsIds, trigger: "blur" },
        times: { required: true, validator: times, trigger: "blur" },
        times5: { required: true, validator: times5, trigger: "blur" },
        amountRate8: { validator: amountRate8, trigger: "blur" },
        detailList: {
          period: { required: true, validator: period, trigger: "blur" },
          period4: { required: true, validator: period4, trigger: "blur" },
          period5: { required: true, validator: period5, trigger: "blur" },
          amountRate: {
            required: true,
            validator: amountRate,
            trigger: "blur",
          },
          seedQuantity: {
            required: true,
            validator: seedQuantity,
            trigger: "blur",
          },
        },
        freeBuyCancel: {
          required: true,
          validator: freeBuyCancel,
          trigger: "blur",
        },
      },
    };
  },
  created() {
    // type:: 0--添加规则， 1--修改规则
    let type = this.$route.query.type;
    if (type == 1) {
      let id = this.$route.query.id;
      this.findConsume(id);
    }
  },
  methods: {
    // 查询规则
    findConsume(topicId) {
      let parms = {
        topicId: topicId,
      };
      findConsume({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          if (content.topicId) {
            this.form.topicId = content.topicId;
          }
          if (content.title) {
            this.form.title = content.title;
          }
          if (content.freeBuyGoodsList.length > 0) {
            this.form.freeBuyGoodsList = content.freeBuyGoodsList;
          }
          if (content.forumSaleList.length > 0) {
            this.form.forumSaleList = content.forumSaleList;
          }
          if (content.forumAdvanceOrderList.length > 0) {
            this.form.forumAdvanceOrderList = content.forumAdvanceOrderList;
          }
          if (content.forumAdvancePeriodList.length > 0) {
            this.form.forumAdvancePeriodList = content.forumAdvancePeriodList;
          }
          if (content.noCashBackWithdrawList.length > 0) {
            this.form.noCashBackWithdrawList = content.noCashBackWithdrawList;
            // 给新用户规则下最后一条 添加可删除按钮
            let newArr = this.form.noCashBackWithdrawList[0].detailList.filter(
              (val) => {
                return val.subType == "5";
              }
            );
            if (newArr.length > 1) {
              newArr[newArr.length - 1].isCanDel = true;
            }
          }
          if (content.everyDayOrderList.length > 0) {
            this.form.everyDayOrderList = content.everyDayOrderList;
          }
          if (content.freeBuyCancel) {
            this.form.freeBuyCancel = content.freeBuyCancel;
          }
          if (content.cashOutList.length > 0) {
            this.form.cashOutList = content.cashOutList;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加规则
    add_rules(type, subType) {
      this.form[type].push({
        timesMin: "",
        timesMax: "",
        detailList: [
          {
            subType: subType,
            periodMin: "",
            periodMax: "",
            amountRate: "",
            seedQuantity: "",
          },
        ],
      });
    },
    // 删除规则
    del_rules(type, index) {
      this.form[type].splice(index, 1);
    },
    // 添加规则列表
    add_rules_item(type, subType, index) {
      this.form[type][index].detailList.push({
        subType: subType,
        periodMin: "",
        periodMax: "",
        amountRate: "",
        seedQuantity: "",
      });
    },
    // 添加待返返还 新用户规则
    add_rules_item2(type, subType, index) {
      // 去除所有新用户规则 控制可删除按钮是否显示字段
      let arr = this.form[type][index].detailList;
      let newArr = arr.filter((val) => {
        return val.subType == "5";
      });
      newArr.forEach((val) => {
        delete val.isCanDel;
      });
      arr.push({
        subType: subType,
        periodMin: "",
        periodMax: newArr.length + 1,
        amountRate: "",
        seedQuantity: "",
        isCanDel: true,
      });
    },
    // 删除规则列表
    del_rules_item(type, index, idx) {
      this.form[type][index].detailList.splice(idx, 1);
    },

    // 删除规则列表--待返返还新用户列表
    del_rules_item4(type, index, idx) {
      this.form[type][index].detailList.splice(idx, 1);
      // 去除所有新用户规则 控制可删除按钮是否显示字段
      let arr = this.form[type][index].detailList;
      let newArr = arr.filter((val) => {
        return val.subType == "5";
      });
      newArr.forEach((val) => {
        delete val.isCanDel;
      });
      // 如果新用户规则>1，在最后一条规则上显示可删除
      if (newArr.length > 1) {
        newArr[newArr.length - 1].isCanDel = true;
      }
    },
    // 添加套现种子扣除规则
    add_rules_cashOutList() {
      this.form.cashOutList.push({
        subType: "17",
        periodMax: this.form.cashOutList.length + 1,
        amountRate: "",
      });
    },
    // 删除套现种子扣除规则
    del_rules_cashOutList(index) {
      this.form.cashOutList.splice(index, 1);
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.form;
          if (!form.title) {
            this.$message.error("种子扣除规则名称不能为空");
            return;
          }
          // 去除所有新用户规则 控制可删除按钮是否显示字段
          form.noCashBackWithdrawList[0].detailList.forEach((val) => {
            delete val.isCanDel;
          });
          addOrUpdateConsumeTopic(form)
            .then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("保存成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("请检查输入格式");
          return false;
        }
      });
    },
    // 返回上一页
    navBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.seed_consume {
  padding: 20px;
  box-sizing: border-box;
  .itemBox {
    width: 850px;
    border-bottom: 1px solid #9f9f9f;
    margin-top: 20px;
    .titleBox {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .btnBox {
    width: 100%;
    margin-top: 20px;
  }
}
</style>