<template>
  <el-container
    class="container"
    v-loading.fullscreen.lock="requestLoading"
    :element-loading-text="requestLoadingTxt"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    v-cloak
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="选择上传商家:" v-if="goodsDetailJson.type === 1">
        <el-cascader
          :options="businessOptions"
          v-model="form.businessOptions"
          @change="businessChange"
        ></el-cascader>
      </el-form-item>

      <el-row style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav">基本信息</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('essentialInfo')"
            type="text"
          >{{ goodsDetailJson.essentialInfo.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名:" prop="goodsName">
            <el-input
              v-model="form.goodsName"
              maxlength="50"
              :disabled="goodsDetailJson.essentialInfo.disabled"
            ></el-input>
          </el-form-item>

          <el-form-item label="分享描述:">
            <el-input
              v-model="form.goodsDcb"
              maxlength="35"
              :disabled="goodsDetailJson.essentialInfo.disabled"
            ></el-input>
            <div class="col-999">微信分享给好友时会显示，建议35个字以内</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="商品图:" class="goods-img-fill">
            <div class="img-box">
              <!-- 商品图列表 -->
              <div
                class="img-list"
                style="width: 148px; height: 148px;"
                v-dragging="{ item: item, list: goodsImgList, group: 'item' }"
                v-for="(item, index) in goodsImgList"
                :key="item.key"
              >
                <div
                  class="del-img"
                  @click="deleteGoodsImg('goodsImgList', index)"
                  v-if="!goodsDetailJson.essentialInfo.disabled"
                >
                  <img src="@/assets/icon_del.png" alt />
                </div>
                <img :src="item.url" alt />
              </div>
              <!-- 添加商品图按钮 -->
              <div
                class="add-img"
                @click="nowAddImgAddr('goodsImgList')"
                v-show="this.goodsImgList.length < 15 && !goodsDetailJson.essentialInfo.disabled"
              >
                <label class="addImgCls">
                  <i class="el-icon-plus"></i>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    ref="adImgRef"
                    @change="handleSuccess($event, 'adImgRef', 750, 750)"
                  />
                </label>
              </div>
            </div>
            <div class="col-999">建议尺寸；750*750像素，你可以拖拽图片调整顺序，最多上传15张</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="视频:">
            <el-button type="primary" class="filevideo">
              上传视频
              <input
                :disabled="goodsDetailJson.essentialInfo.disabled"
                type="file"
                id="file"
                @change="videoChange($event)"
              />
            </el-button>
            <div class="videoContent">
              <img
                src="@/assets/icon_del.png"
                alt
                v-if="!goodsDetailJson.essentialInfo.disabled"
                @click="deleteVideo"
              />
              <video :src="videoSrc" accept="video/*" controls="controls" width="300" height="150">
                您的浏览器不支持 video
                标签。
              </video>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-form-item label="划线价:" prop="discount">
            <el-input v-model="form.discount" :disabled="goodsDetailJson.essentialInfo.disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="商品分类:" prop="goodsClass" class="goods-class">
            <el-cascader
              :options="goodsClassOptions"
              v-model="form.goodsClass"
              @change="handleChange"
              :disabled="goodsDetailJson.essentialInfo.disabled"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="已抢件数:" prop="robbed">
            <el-input
              v-model.number="form.robbed"
              maxlength="6"
              :disabled="goodsDetailJson.essentialInfo.disabled"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="快递费用:" prop="express">
            <el-input v-model="form.express" :disabled="goodsDetailJson.essentialInfo.disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 基本信息 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav">0成本购模式</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('freeBuyMode')"
            type="text"
          >{{ goodsDetailJson.freeBuyMode.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div style="padding:20px 30px;box-sizing:box-border;">
            <el-radio-group v-model="form.freeBuyMode">
              <el-radio :disabled="goodsDetailJson.freeBuyMode.disabled" :label="1">按月返还</el-radio>
              <el-radio :disabled="goodsDetailJson.freeBuyMode.disabled" :label="2">按天返还</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 0成本购模式 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav">价格库存</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('stock')"
            type="text"
          >{{ goodsDetailJson.stock.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>

      <div v-show="!goodsDetailJson.stock.disabled">
        <el-row class="cmmt-spec">
          <el-col class="tle-col">
            <div class="tle goods-fill">商品规格:</div>
          </el-col>
          <el-col class="cmmt-spec-detail">
            <div v-for="(item, index) in goodsSpec" :key="index">
              <el-row class="spec-name">
                <el-col :span="3">
                  <el-form-item label="规格名:">
                    <el-input v-model="goodsSpec[index].specName" maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <el-checkbox v-if="index === 0" v-model="addSpecImg">添加规格图片</el-checkbox>
                    <el-button
                      type="text"
                      @click="delSpecPro(index)"
                      v-show="goodsSpec.length > 1 && index > 0"
                    >
                      <i class="el-icon-remove-outline"></i>
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="spec-num" :span="4" v-for="(ite, dex) in item.specNum" :key="dex">
                  <div style="position:relative;">
                    <el-form-item :label="dex === 0 ? '规格值:' : ''">
                      <el-input v-model="item.specNum[dex]" maxlength="20"></el-input>
                    </el-form-item>
                    <el-button
                      style="position:absolute;top:-18px;right:-6px;"
                      type="text"
                      @click="delspecProDetail(index,dex)"
                    >
                      <i class="el-icon-remove-outline"></i>
                    </el-button>
                  </div>
                  <el-row style="padding-left: 10px;" v-show="index === 0 && addSpecImg">
                    <el-col class="hover-col" style="width: 100%; padding-bottom: 22px;">
                      <div class="img-box" v-show="specImg[dex] != undefined">
                        <div class="del-img" @click="deleteGoodsImg('specImg', dex)">
                          <img src="@/assets/icon_del.png" alt />
                        </div>
                        <img class="img-div" :src="specImg[dex] && specImg[dex].url" alt />
                      </div>

                      <div
                        v-show="specImg[dex] == undefined"
                        @click="nowAddImgAddr('specImg', dex)"
                        style="margin: 0 auto;"
                        class="addImgCls"
                      >
                        <i class="el-icon-plus"></i>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          :ref="'specFileRef' + dex"
                          @change="handleSuccess($event, 'specFileRef' + dex, 200, 200)"
                        />
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col>
                  <el-form-item>
                    <el-button
                      v-show="!(item.specNum.length > 19)"
                      type="text"
                      @click="addSpecNum(index)"
                    >添加</el-button>
                    <!-- <el-button
                      v-show="item.specNum.length > 1"
                      type="text"
                      @click="delSpecNum(index)"
                    >删除</el-button>-->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-row>
              <el-col :span="4">
                <el-form-item>
                  <el-button @click="addSpecPro()" :disabled="goodsSpec.length > 2">添加规格项目</el-button>
                  <el-button @click="handleGoodsSpec()" type="primary">确认规格</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" class="cmmt-spec-tips">如有颜色，尺码等多种规格，请添加商品规格</el-col>
        </el-row>
      </div>

      <el-row class="spec-detail" v-show="RenderGoodsSpec.length > 0">
        <el-col class="tle-col">
          <div class="tle">商品规格:</div>
        </el-col>
        <el-col class="spec-detail-detail">
          <div class="header">
            <div
              style="width:260px;"
              v-for="(item, index) in goodsSpecTle"
              :key="index"
            >{{item.specName}}</div>
            <div class="fill">原价</div>
            <div class="fill">库存</div>
            <div class="fill">成本价</div>
            <div class="fill">折扣</div>
            <div>成本调控比例(%)</div>
            <div>赠送种子(积分)</div>
            <div>赞助次数</div>
            <div>返现</div>
            <div>销量</div>
          </div>

          <div class="content">
            <div
              v-for="(item, index) in RenderGoodsSpec"
              :key="index"
              style="display: flex; flex-direction: column;"
            >
              <div
                style="flex-grow: 1;border-top: 1px solid #dddddd; border-left: 1px solid #dddddd;display: flex;align-items:center"
                v-for="(ite, dex) in item"
                :key="dex"
              >
                <div style="display: flex; align-items: center;width:260px;font-size:14px;">
                  <div style="margin:0 auto">{{ ite }}</div>
                </div>
              </div>
            </div>

            <div v-for="(item, index) in 9" :key="'item' + index">
              <div
                v-for="(ite, dex) in RenderGoodsSpec[RenderGoodsSpec.length - 1]"
                :key="'item' + dex"
              >
                <div v-if="index < 7" style="width:120px;">
                  <div class="hh">
                    <el-input
                      v-model="userInputSpecDetail[index][dex]"
                      :maxlength="index === 1 ? '6' : '11'"
                      :disabled="goodsDetailJson.stock.disabled"
                    ></el-input>
                  </div>
                </div>

                <div v-if="index === 7" style="width:120px;">
                  <div class="hh" style="width:100%;text-align: center;min-width:80px">
                    <el-button
                      type="text"
                      style="height:40px"
                      :disabled="cashback[dex].checkset"
                      @click="setCashback(dex)"
                    >{{ cashback[dex].cashbackList.length > 0 ? '查看' : '设置' }}</el-button>
                    <el-checkbox
                      v-model="cashback[dex].checkset"
                      :disabled="goodsDetailJson.stock.disabled"
                      @change="changeCheck(dex)"
                    ></el-checkbox>
                  </div>
                </div>

                <div v-if="index === 8" style="width:120px;border-right:1px solid #ddd;">
                  <div class="hh">
                    <div style="text-align: center;line-height: 40px;">{{ salesArr[dex] }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <el-row class="content">
            <el-col
              v-for="(item, index) in RenderGoodsSpec"
              :key="index"
              style="display: flex; flex-direction: column;"
            >
              <el-row
                type="flex"
                style="flex-grow: 1; border-top: 1px solid #dddddd; border-left: 1px solid #dddddd;"
                v-for="(ite, dex) in item"
                :key="dex"
              >
                <el-col style="display: flex; align-items: center;width:260px;font-size:14px;">
                  <div style="margin:0 auto">{{ ite }}</div>
                </el-col>
              </el-row>
            </el-col>

            <el-col v-for="(item, index) in 9" :key="'item' + index"> 
              <el-row
                v-for="(ite, dex) in RenderGoodsSpec[RenderGoodsSpec.length - 1]"
                :key="'item' + dex"
              >
                <el-col v-if="index < 7" style="width:120px;">
                  <div class="hh">
                    <el-input
                      v-model="userInputSpecDetail[index][dex]"
                      :maxlength="index === 1 ? '6' : '11'"
                      :disabled="goodsDetailJson.stock.disabled"
                    ></el-input>
                  </div>
                </el-col>

                <el-col v-if="index === 7" style="width:120px;">
                  <div class="hh" style="width:100%;text-align: center;min-width:80px">
                    <el-button
                      type="text"
                      style="height:40px"
                      :disabled="cashback[dex].checkset"
                      @click="setCashback(dex)"
                    >{{ cashback[dex].cashbackList.length > 0 ? '查看' : '设置' }}</el-button>
                    <el-checkbox
                      v-model="cashback[dex].checkset"
                      :disabled="goodsDetailJson.stock.disabled"
                      @change="changeCheck(dex)"
                    ></el-checkbox>
                  </div>
                </el-col>

                <el-col v-if="index === 8" style="width:120px;">
                  <div class="hh">
                    <div style="text-align: center;line-height: 40px;">{{ salesArr[dex] }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>-->

          <el-row class="modify" v-show="!goodsDetailJson.stock.disabled">
            <el-col style="font-size: 14px; padding-top: 10px; width: 70px !important;">批量设置:</el-col>
            <el-col style="width: 40px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('batchPrice')">价格</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="batchPrice.switch">
              <el-form-item>
                <el-input v-model="batchPrice.moneyNum" style="width:90px;"></el-input>
                <el-button
                  type="text"
                  @click="batchSave('batchPrice')"
                  style="margin-right: 10px;"
                >保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 40px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('batchStock')">库存</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="batchStock.switch">
              <el-form-item>
                <el-input v-model.number="batchStock.moneyNum" style="width:90px;"></el-input>
                <el-button
                  type="text"
                  @click="batchSave('batchStock')"
                  style="margin-right: 10px;"
                >保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 40px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('chengben')">成本</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="chengben.switch">
              <el-form-item>
                <el-input v-model="chengben.moneyNum" style="width:90px;"></el-input>
                <el-button type="text" @click="batchSave('chengben')" style="margin-right: 10px;">保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 40px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('zhekou')">折扣</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="zhekou.switch">
              <el-form-item>
                <el-input v-model="zhekou.moneyNum" style="width:60px;"></el-input>
                <el-button type="text" @click="batchSave('zhekou')" style="margin-right: 10px;">保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 90px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('bili')">成本调控比例</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="bili.switch">
              <el-form-item>
                <el-input v-model="bili.moneyNum" style="width:80px;"></el-input>
                <el-button type="text" @click="batchSave('bili')" style="margin-right: 10px;">保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 60px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('seed')">赠送种子</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="seed.switch">
              <el-form-item>
                <el-input v-model="seed.moneyNum" style="width:80px;"></el-input>
                <el-button type="text" @click="batchSave('seed')" style="margin-right: 10px;">保存</el-button>
              </el-form-item>
            </el-col>
            <el-col style="width: 90px !important;">
              <el-form-item>
                <el-button type="text" @click="batchOperation('supportNum')">赞助次数</el-button>
              </el-form-item>
            </el-col>
            <el-col v-show="supportNum.switch">
              <el-form-item>
                <el-input v-model="supportNum.moneyNum" style="width:80px;"></el-input>
                <el-button
                  type="text"
                  @click="batchSave('supportNum')"
                  style="margin-right: 10px;"
                >保存</el-button>
              </el-form-item>
            </el-col>

            <el-col style="width: 60px !important;">
              <el-form-item>
                <el-button type="text" @click="fanxianSet" :disabled="batchFx">返现设置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-dialog
        width="40%"
        title="返现设置"
        v-if="dialogTableVisible"
        :close-on-click-modal="false"
        @close="zeroSet = true"
        :visible.sync="dialogTableVisible"
      >
        <el-form-item label="选择返现分期:">
          <el-select v-model="form.optionVal">
            <el-option
              :key="item.txt"
              :label="item.txt"
              :value="item.txt"
              v-for="item in cashbackDetail.options"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            @click="addCashback()"
            v-show="!goodsDetailJson.stock.disabled"
          >添加</el-button>
          <el-button
            type="danger"
            v-show="!goodsDetailJson.stock.disabled"
            @click="zeroSet = false"
          >修改</el-button>
        </el-form-item>
        <el-form-item
          :label="item.tle + ':'"
          v-for="(item, index) in cashbackDetail.cashbackList"
          :key="index"
        >
          <span>付</span>
          <el-input style="width: 80px;" :disabled="true" :value="cashbackDetail.money"></el-input>
          <span>返</span>
          <el-input style="width: 80px;" v-model="item.cashbackMoney"></el-input>
          <i
            class="el-icon-close"
            @click="cashbackDelBtn(index)"
            v-show="!goodsDetailJson.stock.disabled"
          ></i>
        </el-form-item>
        <div
          style="font-size:16px;color:#303133;border-bottom:1px solid #eee;padding-bottom:10px;margin-bottom:20px;margin-top:60px"
        >快速0元购设置:</div>
        <el-form-item :label="form.freeBuyMode == 1? '0元购分期期数':'0元购分期天数'" label-width="130">
          <el-input
            style="width: 65px;"
            v-model="cashbackDetail.periodScope.minPeriod"
            :disabled="zeroSet"
            @change="setMinPeriod"
          ></el-input>
          <span>至</span>
          <el-input
            style="width: 65px;"
            v-model="cashbackDetail.periodScope.maxPeriod"
            :disabled="zeroSet"
            @change="setMaxPeriod"
          ></el-input>
        </el-form-item>
        <el-form-item :label="form.freeBuyMode == 1?'用户选择分期数':'用户选择天数'" label-width="130">
          <div
            style="position:relative;display:inline"
            v-for="(item,index) in cashbackDetail.periodScope.periodItems"
            :key="index"
          >
            <i
              class="el-icon-close"
              v-show="!goodsDetailJson.stock.disabled && !zeroSet && index!=0 && index!=1"
              style="position:absolute;top:-16px;right:-2px;z-index:99999"
              @click="deletedZeroUserNum(index)"
            ></i>
            <el-input
              style="width: 65px;margin-right:4px;"
              v-model="item.periods"
              :disabled="index == 0 || index == 1?true:zeroSet"
            ></el-input>
          </div>
          <el-button type="text" @click="addUserNum" v-if="!zeroSet">添加</el-button>
        </el-form-item>
        <div slot="footer">
          <el-button
            type="primary"
            @click="confirmCashback()"
            v-show="!goodsDetailJson.stock.disabled"
          >保存</el-button>
        </div>
      </el-dialog>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 价格库存 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav">可抵扣</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('seed')"
            type="text"
          >{{ goodsDetailJson.seed.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="正常购买时种子（积分）可抵扣金额的:" label-width="300px">
            <el-input
              v-model="form.seedDeduction"
              :disabled="goodsDetailJson.seed.disabled"
              style="width:80px;"
            ></el-input>%
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Freebuy购买时种子（积分）可抵扣金额的:" label-width="300px">
            <el-input
              v-model="form.freeBuySeedDeduction"
              :disabled="goodsDetailJson.seed.disabled"
              style="width:80px;"
            ></el-input>%
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 可抵扣 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav">比价信息</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('parityInfo')"
            type="text"
          >{{ goodsDetailJson.parityInfo.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="京东价:" prop="jinDong">
            <el-input
              v-model="form.jinDong"
              :disabled="goodsDetailJson.parityInfo.disabled"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="天猫价:" prop="tianMao">
            <el-input
              v-model="form.tianMao"
              :disabled="goodsDetailJson.parityInfo.disabled"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="严选考拉价:" prop="yxkl">
            <el-input
              v-model="form.yxkl"
              :disabled="goodsDetailJson.parityInfo.disabled"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 比价信息 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row class="banner" style="background: #f8f8f8; margin-top: 10px; margin-bottom: 22px;">
        <el-col :span="12" class="tle-nav banner-fill">广告图</el-col>
        <el-col :span="12" class="tle-change" v-if="goodsDetailJson.type === 2">
          <el-button
            @click="changeSave('bannerImg')"
            type="text"
          >{{ goodsDetailJson.bannerImg.disabled ? '修改' : '保存' }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="img-box">
            <!-- 广告图 -->
            <div class="img-list" v-for="(item, index) in bannerImgList" :key="item.key">
              <div
                class="del-img"
                @click="deleteGoodsImg('bannerImgList', index)"
                v-if="!goodsDetailJson.bannerImg.disabled"
              >
                <img src="@/assets/icon_del.png" alt />
              </div>
              <img :src="item.url" alt />
            </div>
            <!-- 添加广告图按钮 -->
            <div
              class="addImgCls"
              @click="nowAddImgAddr('bannerImgList')"
              v-show="this.bannerImgList.length < 1 && !goodsDetailJson.bannerImg.disabled"
            >
              <i class="el-icon-plus"></i>
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref="bannerImgFileRef"
                @change="handleSuccess($event, 'bannerImgFileRef', 750, 320)"
              />
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 广告图 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <!-- ----------------------------------- -->
      <el-row>
        <el-col>
          <el-row type="flex" justify="space-between" style="margin: 20px 0; padding: 0 20px;">
            <el-col style="font-size: 14px; line-height: 40px; color: #333333;">详细信息</el-col>
            <el-col>
              <div style="display: flex; justify-content: flex-end;">
                <el-form-item class="form-item-detail" v-if="!goodsDetailJson.detailInfo.disabled">
                  <el-button type="primary" @click="addBannerTxt = true">添加内容</el-button>
                  <div class="addImgClsBtn" @click="nowAddImgAddr('detailImg')">
                    <div type="primary">添加图片</div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref="detailInfoFileRef"
                      @change="handleSuccess($event, 'detailInfoFileRef', 750, 1000)"
                    />
                  </div>
                </el-form-item>
                <el-button
                  type="text"
                  v-if="goodsDetailJson.type === 2"
                  @click="changeSave('detailInfo')"
                >{{ goodsDetailJson.detailInfo.disabled ? '修改' : '保存' }}</el-button>
              </div>
            </el-col>
          </el-row>

          <div
            class="content-detail"
            style="position: relative;"
            v-for="(item, index) in bannerDetail"
            :key="index"
          >
            <p
              style="color: #333333; font-size: 14px; line-height: 22px; word-wrap: break-word; word-break: normal;"
              v-if="item.resourceType === 1"
            >{{ item.content }}</p>
            <img v-else style="display: block; width: 100%; height: auto;" :src="item.content" alt />
            <i
              class="el-icon-close banner-detail-close"
              @click="delBannerDetail(index)"
              v-show="!goodsDetailJson.detailInfo.disabled"
            ></i>
          </div>

          <el-dialog
            title="添加内容"
            :close-on-click-modal="false"
            :visible.sync="addBannerTxt"
            width="30%"
          >
            <el-input
              type="textarea"
              maxlength="1000"
              autofocus="true"
              :autosize="{ minRows: 1, maxRows: 12}"
              placeholder="请输入内容"
              v-model="textareaBanner"
            ></el-input>
            <span slot="footer">
              <el-button type="primary" @click="addBannerCtt()">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 详细信息 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑ -->

      <el-row style="padding-top: 30px;">
        <el-col style="display: flex; justify-content: center;">
          <div v-if="goodsDetailJson.type === 1">
            <el-button @click="checkMastFill(2)">保存不上架</el-button>
            <el-button type="primary" @click="checkMastFill(1)">保存并上架</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 图片截取弹层 -->
    <div class="hover" v-show="cropperShow">
      <div class="cropper">
        <div class="tle">
          <span>滑动鼠标滚轮，放大缩小图片</span>
          <i class="el-icon-close" @click="cropperCel()"></i>
        </div>
        <vueCropper
          ref="cropper"
          :img="example.editHeadurl"
          :autoCrop="example.autoCrop"
          :autoCropWidth="example.autoCropWidth"
          :autoCropHeight="example.autoCropHeight"
          :fixedBox="example.fixedBox"
        ></vueCropper>
        <div class="btn-div">
          <el-button type="success" plain @click="originalImg()">上传原图</el-button>
          <el-button type="success" @click="cropperSub()">确定</el-button>
        </div>
      </div>
    </div>

    <fanxianPop ref="fanxian"></fanxianPop>
  </el-container>
</template>

<script>
import { VueCropper } from "vue-cropper";
import fanxianPop from "./common/fanxianPop";
import {
  getBusinessOptionsRequest,
  getGoodsClassRequest,
  addGoodsRequest,
  queryGoodsDetailRequest,
  upDataGoodsRequest
} from "@/network/api";

export default {
  components: {
    VueCropper,
    fanxianPop
  },
  data() {
    // 检查金额格式
    const checkMoney = (rule, value, callback) => {
      if (/^([1-9]\d{0,4}|0)(\.\d{1,2})?$/.test(value)) {
        callback();
      } else {
        callback(new Error("金额范围为0.01~99999.99之间"));
      }
    };

    // 非必填验证(京东价, 天猫价, 严选考拉价)
    const notReq = (rule, value, callback) => {
      if (value === null || value === "") {
        callback();
      } else if (/^([1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(value)) {
        callback();
      } else {
        callback(new Error("金额范围为0.01~99999999.99之间"));
      }
    };

    // 检查已抢件数
    const robbedNum = (rule, value, callback) => {
      if (/^\d{1,6}$/.test(value)) {
        callback();
      } else {
        callback(new Error("只能输入正整数"));
      }
    };

    // 检查邮费格式
    const checkExpress = (rule, value, callback) => {
      if (/^([1-9]\d{0,3}|0)(\.\d{1,2})?$/.test(value)) {
        callback();
      } else {
        callback(new Error("金额范围为0.01~9999.99之间"));
      }
    };

    return {
      // 商品详情情况
      goodsDetailJson: {
        type: 1,
        // 基本信息
        essentialInfo: {
          disabled: false
        },
        // 价格库存
        stock: {
          disabled: false
        },
        // 可抵扣
        seed: {
          disabled: false
        },
        // 0成本购模式
        freeBuyMode: {
          disabled: false
        },
        // 比价信息
        parityInfo: {
          disabled: false
        },
        // 广告图
        bannerImg: {
          disabled: false
        },
        // 详细信息
        detailInfo: {
          disabled: false
        }
      },
      businessOptions: [], // 商家列表
      cropperShow: false, // 裁剪框（显示隐藏）
      addImgType: null, // 存储当前操作的添加图片位置
      goodsImgList: [], // 商品图片列表
      example: {
        raw: null, // 存储图片文件格式（转base64用）
        autoCrop: true,
        editHeadurl: "",
        autoCropWidth: 750,
        autoCropHeight: 750,
        fixedBox: true
      },
      videoSrc: "",
      videoFile: "",
      isDeleteVideo: 2, // 是否个更新视频 1、删除原有视频 2、不删除原有视频（默认值）
      form: {
        businessOptions: [null], // 商家id
        goodsName: "", // 商品名
        goodsDcb: "", // 分享描述
        discount: null, // 划线价
        goodsClass: null, // 商品分类
        robbed: 0, // 已抢件数
        express: null, // 快递费用
        optionVal: "", // 当前分期
        jinDong: null, // 京东价
        tianMao: null, // 天猫价
        yxkl: null, // 严选考拉价
        seedDeduction: "", //正常购买种子抵扣比例
        freeBuySeedDeduction: "", //freeBuy购买种子抵扣比例
        freeBuyMode: 1 // 0成本购模式
      },
      rules: {
        // 商品名
        goodsName: [
          {
            required: true,
            message: "请输入商品名",
            trigger: "blur"
          }
        ],
        // 商品分类
        goodsClass: [
          {
            required: true,
            message: "不能为空"
          }
        ],
        // 划线价
        discount: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            validator: checkMoney,
            trigger: "blur"
          }
        ],
        // 划线价
        robbed: [
          {
            validator: robbedNum,
            trigger: "blur"
          }
        ],
        // 快递费用
        express: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            validator: checkExpress,
            trigger: "blur"
          }
        ],
        // 京东价
        jinDong: [
          {
            validator: notReq,
            trigger: "blur"
          }
        ],
        // 天猫
        tianMao: [
          {
            validator: notReq,
            trigger: "blur"
          }
        ],
        // 严选考拉价
        yxkl: [
          {
            validator: notReq,
            trigger: "blur"
          }
        ]
      },
      goodsClassOptions: [], // 商品分类
      goodsClassValue: "", // 选中的商品分类
      // 商品规格
      goodsSpec: [
        {
          specName: "",
          specNum: [""]
        }
      ],
      goodsSpecTle: [], // 商品规格头部
      specImg: [], // 商品规格图片
      specImgParam: [], // 商品规格图片(上传参数)
      RenderGoodsSpec: [], // 数据渲染-(商品规格)
      addSpecImg: true, // 添加规格图片
      userInputSpecDetail: [], // 用户输入的商品规格信息（商品规格详情）
      stockDetailParam: {}, // 库存详细信息参数
      batchPrice: {
        // 批量价格
        moneyNum: "", // 价格
        switch: false // 显示隐藏
      },
      batchStock: {
        // 批量库存
        moneyNum: "", // 库存数量
        switch: false // 显示隐藏
      },
      chengben: {
        // 批量成本价
        moneyNum: "", // 成本价
        switch: false // 显示隐藏
      },
      zhekou: {
        // 批量折扣
        moneyNum: "", // 折扣
        switch: false // 显示隐藏
      },
      bili: {
        // 成本调控比例
        moneyNum: "", // 比例
        switch: false // 显示隐藏
      },
      seed: {
        // 赞助次数
        moneyNum: "", // 次数
        switch: false // 显示隐藏
      },
      supportNum: {
        // 赞助次数
        moneyNum: "", // 次数
        switch: false // 显示隐藏
      },
      batchFx: true, // 是否禁用批量设置返现
      cashback: [], // 返现数据
      salesArr: [], // 销量
      dialogTableVisible: false, // 分期弹层显示
      cashbackDetail: null, // 具体某一个返现数据（弹层用）
      bannerImgList: [], // 广告列表
      addBannerTxt: false, // 添加文字弹窗
      textareaBanner: "", // 添加文字内容
      bannerDetail: [], // 详细信息
      requestLoading: false, // 上传等待
      requestLoadingTxt: "", // 上传等待文字提示
      hh: [],
      zeroSet: true //是否修改0元购设置
    };
  },

  created() {
    let type = parseInt(this.$route.query.type);
    let id = parseInt(this.$route.query.id);
    let storeId = this.$route.query.storeId;
    // let type = 1

    this.goodsDetailJson.type = type;

    if (type === 2) {
      this.goodsDetailJson.essentialInfo.disabled = true;
      this.goodsDetailJson.stock.disabled = true;
      this.goodsDetailJson.parityInfo.disabled = true;
      this.goodsDetailJson.bannerImg.disabled = true;
      this.goodsDetailJson.detailInfo.disabled = true;
      this.goodsDetailJson.seed.disabled = true;
      this.goodsDetailJson.freeBuyMode.disabled = true;

      this.getGoodsDetail(id);
    } else {
      // 获取商品分类
      this.getGoodsClass();
      // 获取商家列表数据
      this.getBusinessOptions();
      if (storeId) {
        this.form.businessOptions[0] = storeId;
      }
    }
  },

  mounted() {
    // 商品图片拖拽
    this.$dragging.$on("dragged", ({ value }) => {});
  },

  methods: {
    // 深拷贝
    deepCopy(data) {
      let d = JSON.stringify(data);

      return JSON.parse(d);
    },

    // 选择视频
    videoChange(e) {
      console.log(e);
      let file = e.target.files[0];
      const fileSuffix = ["mp4", "rmvb", "avi", "flv", "wmv", "mkv", "mov"];
      let extension = file.name.split(".")[1];
      if (fileSuffix.includes(extension)) {
        if (file.size > 20 * 1024 * 1024) {
          this.$message.error("视频不能大于20M");
          return;
        } else {
          this.videoSrc = window.URL.createObjectURL(file); // 转blob
          this.videoFile = file;
          this.isDeleteVideo = 1;
          // let reader = new FileReader();  // 转base64
          // let rs = reader.readAsDataURL(file);
          //   reader.onload = (e) =>{
          //     // this.videoSrc= e.target.result;
          //     this.videoSrc= file

          //     // console.log(this.videoSrc)
          //   }
        }
      } else {
        this.videoSrc = "";
        this.videoFile = "";
        this.isDeleteVideo = 2;
        this.$message.error("请选择正确的视频格式");
        return;
      }
    },

    // 删除视频
    deleteVideo() {
      if (!this.videoSrc) {
        return;
      }
      this.$confirm("是否删除该视频", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.videoSrc = "";
          this.videoFile = "";
          this.isDeleteVideo = 1;
        })
        .catch(() => {});
    },

    // 设置返现check
    changeCheck(dex) {
      if (this.cashback.map(e => e.checkset).includes(true)) {
        this.batchFx = false;
      } else {
        this.batchFx = true;
      }
    },

    // 批量返现设置
    fanxianSet() {
      var cashback2 = [];
      for (var i = 0, len = this.cashback.length; i < len; i++) {
        if (this.cashback[i].checkset == true) {
          this.cashback[i].money =
            Math.floor(
              this.userInputSpecDetail[0][i] *
                this.userInputSpecDetail[3][i] *
                10
            ) / 100;
          cashback2.push(this.cashback[i]);
        }
      }
      console.log(cashback2);
      this.$refs.fanxian.open(cashback2);
    },

    // 0元购设置 - 设置最小分期期数
    setMinPeriod() {
      this.cashbackDetail.periodScope.periodItems.splice(0, 1);
      this.cashbackDetail.periodScope.periodItems.splice(0, 0, {
        periods: this.cashbackDetail.periodScope.minPeriod
      });
    },

    // 0元购设置 - 设置最大分期期数
    setMaxPeriod() {
      this.cashbackDetail.periodScope.periodItems.splice(1, 1);
      this.cashbackDetail.periodScope.periodItems.splice(1, 0, {
        periods: this.cashbackDetail.periodScope.maxPeriod
      });
    },

    // 0元购设置 - 添加用户选择分期数
    addUserNum() {
      let periodItems = this.cashbackDetail.periodScope.periodItems;
      let length = periodItems.length;
      let minPeriod = this.cashbackDetail.periodScope.minPeriod;
      let maxPeriod = this.cashbackDetail.periodScope.maxPeriod;

      if (Number(periodItems[length - 1].periods) < Number(minPeriod)) {
        this.$message.error("用户选择分期数不能小于最小0元购分期数");
        return;
      }

      if (Number(periodItems[length - 1].periods) > Number(maxPeriod)) {
        this.$message.error("用户选择分期数不能大于最大0元购分期数");
        return;
      }

      if (length > 10) {
        this.alertTips("添加数量最多为10个");
        return;
      }

      if (!periodItems) {
        this.cashbackDetail.periodScope.periodItems = [
          {
            periods: ""
          }
        ];
        return;
      } else {
        this.cashbackDetail.periodScope.periodItems.push({
          periods: ""
        });
      }
      console.log(this.cashbackDetail);
    },

    // 0元购设置 - 删除用户选择分期数
    deletedZeroUserNum(index) {
      this.cashbackDetail.periodScope.periodItems.splice(index, 1);
    },

    // 检查金额格式
    checkNum(num) {
      if (/^([1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(num)) {
        return true;
      } else {
        return false;
      }
    },

    // 弹层提示
    alertTips(msg) {
      this.$alert(msg, "错误", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },

    // 获取商品详情
    async getGoodsDetail(id) {
      await this.getGoodsClass();
      let res = await queryGoodsDetailRequest({
        params: {
          id
        }
      });

      if (res.data.messageCode === "MSG_1001") {
        let content = res.data.content;

        this.form.goodsName = content.name;
        this.form.goodsDcb = content.sharedDesc;
        this.form.seedDeduction = content.seedDeduction;
        this.form.freeBuySeedDeduction = content.freeBuySeedDeduction;
        this.form.freeBuyMode = content.freeBuyMode;
        this.videoSrc = content.videoUrl;
        this.goodsImgList = this.handleGoodsImg(content.imageUrls);
        this.bannerImgList.push(this.handleAdImage(content.adImage));
        this.handleCategory(content.categoryId);
        this.handleSpecs(content.specs);
        this.handleStockDetail(content.stockDetail);
        this.form.discount = content.markedPrice;
        this.form.robbed = content.grabbed;
        this.form.express = content.expressFee;
        this.bannerDetail = content.introductions;
        this.handleCompetitor(content.competitorPrices);
      }
    },

    // 处理接口返回商品图数据
    handleGoodsImg(imgArr) {
      let arr = [];
      let key = parseInt(new Date().valueOf() / 1000);

      imgArr.map((item, index) => {
        arr.push({
          key: key + index,
          url: item
        });
      });

      return arr;
    },

    // 处理接口返回广告图数据
    handleAdImage(img) {
      let key = parseInt(new Date().valueOf() / 1000);

      return {
        key,
        url: img
      };
    },

    // 处理接口返回的商品分类id
    handleCategory(id) {
      let defaultArr = [];
      let goodsClassOptions = this.goodsClassOptions;

      goodsClassOptions.map(item => {
        item.children &&
          item.children.map(ite => {
            if (ite.value === id) {
              defaultArr.push(item.value);
              return true;
            }
          });
      });

      defaultArr.push(id);
      this.form.goodsClass = defaultArr;
    },

    // 处理接口返回规格数据
    handleSpecs(specs) {
      let arr = [];
      let arrImg = [];

      specs.map((item, index) => {
        arr.push({
          specName: item.name,
          specNum: []
        });

        item.items.map((ite, dex) => {
          arr[index].specNum.push(ite.name);
          if (index === 0) {
            if (ite.iconUrl !== null) {
              arrImg.push({
                key: ite.id,
                url: ite.iconUrl
              });
            } else {
              arrImg.push(null);
            }
          }
        });
      });

      this.goodsSpec = arr;
      this.specImg = arrImg;

      this.handleGoodsSpec();
    },

    // 处理接口返回商品规格数据
    handleStockDetail(detail) {
      console.log(detail);
      let index = 0;
      let len = this.userInputSpecDetail[0].length;
      let keyArr = Object.keys(detail).sort();
      console.log(keyArr);

      this.setCashbackDefault(len);

      for (let i = 0; i < keyArr.length; i++) {
        let item = keyArr[i];

        this.userInputSpecDetail[0][i] = detail[item].orgPrice;
        this.userInputSpecDetail[1][i] = detail[item].stock;
        this.userInputSpecDetail[2][i] = detail[item].dctPrice;
        this.userInputSpecDetail[3][i] = detail[item].dctRate;
        this.userInputSpecDetail[4][i] = detail[item].costControlRatio
          ? detail[item].costControlRatio
          : null;
        this.userInputSpecDetail[5][i] = detail[item].sendSeed;
        this.userInputSpecDetail[6][i] = detail[item].supportCount;
        this.salesArr.push(detail[item].sales);
        this.cashback[i].money =
          Math.floor(detail[item].orgPrice * detail[item].dctRate * 10) / 100;
        this.cashback[i].specCashBacks = detail[item].specCashBacks;
        this.cashback[i].specId = detail[item].specId;
        this.cashback[i].periodScope =
          detail[item].specPeriodScope == null
            ? {
                minPeriod: "",
                maxPeriod: "",
                periodItems: [
                  {
                    periods: ""
                  }
                ]
              }
            : detail[item].specPeriodScope;
      }
      console.log(this.userInputSpecDetail);

      this.cashback.map((item, dex) => {
        if (item.specCashBacks.length > 0) {
          item.specCashBacks.map((ite, idx) => {
            item.cashbackList.push({
              cashbackMoney: ite.amount,
              tle: item.options[ite.month].txt
            });

            item.options[ite.month].disabled = true;
          });
        }
      });
      console.log(this.cashback, "this.cashback");
    },

    // 处理接口返回比价信息数据
    handleCompetitor(arr) {
      arr.map(item => {
        switch (item.mallKey) {
          case "jd":
            this.form.jinDong = item.price;
            break;
          case "tmall":
            this.form.tianMao = item.price;
            break;
          case "kaola":
            this.form.yxkl = item.price;
            break;
        }
      });
    },

    // 修改保存
    changeSave(key) {
      if (this.goodsDetailJson[key].disabled) {
        this.goodsDetailJson[key].disabled = false;
      } else {
        switch (key) {
          case "essentialInfo":
            this.saveEsInfo();
            break;
          case "stock":
            this.saveStockInfo();
            break;
          case "freeBuyMode":
            this.saveFreeBuyMode();
            break;
          case "seed":
            this.saveSeed();
            break;
          case "parityInfo":
            this.savePryInfo();
            break;
          case "bannerImg":
            this.saveBnrInfo();
            break;
          case "detailInfo":
            this.saveDtlInfo();
            break;
        }
      }
    },

    // 商品详情修改后保存基本信息数据
    saveEsInfo() {
      let goodsImageFiles = this.goodsImgList;

      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!(goodsImageFiles.length > 0)) {
            this.alertTips("未上传商品图");
            return false;
          } else {
            let param = {};
            let name = this.form.goodsName; // 商品名
            let sharedDesc = this.form.goodsDcb; // 分享描述
            let goodsImageFiles = []; // 商品图片
            let goodsVideoFiles = this.videoFile; // 商品视频
            let isDeleteVideo = this.isDeleteVideo; // 是否更新视频
            let markedPrice = Number(this.form.discount); // 划线价
            let categoryId = this.form.goodsClass[
              this.form.goodsClass.length - 1
            ]; // 分类ID
            let grabbed = this.form.robbed; // 已抢件数
            let expressFee = Number(this.form.express); // 快递费

            for (let i = 0; i < this.goodsImgList.length; i++) {
              let item = this.goodsImgList[i];

              goodsImageFiles.push({
                key: item.key,
                url: await this.cacheImage(item.url)
              });
            }

            param = {
              name,
              markedPrice,
              sharedDesc,
              goodsImageFiles,
              goodsVideoFiles,
              isDeleteVideo,
              categoryId,
              grabbed,
              expressFee
            };

            await this.upDataGoods(param, "essentialInfo");
          }
        } else {
          this.alertTips("必填项未填写完全");
        }
      });
    },

    // 可抵扣修改事件
    saveSeed() {
      if (
        this.form.seedDeduction >= 100 ||
        this.form.freeBuySeedDeduction >= 100
      ) {
        this.$message.error("输入值不可大于等于100");
        return;
      }
      let param = {
        id: this.$route.query.id,
        seedDeduction: this.form.seedDeduction,
        freeBuySeedDeduction: this.form.freeBuySeedDeduction
      };
      this.upDataGoods(param, "seed");
      this.goodsDetailJson.seed.disabled = true;
    },

    // 0成本购模式修改
    saveFreeBuyMode() {
      let param = {
        freeBuyMode: this.form.freeBuyMode
      };
      this.upDataGoods(param, "freeBuyMode");
      this.goodsDetailJson.freeBuyMode.disabled = true;
    },

    // 商品详情修改后保存价格库存数据
    async saveStockInfo() {
      let param = null;
      let specs = this.specParam(); // 规格信息
      let specsImageFiles = []; // 规格图片
      let stockDetail = null; // 库存详细信息

      // 图片转为base64
      for (let i = 0; i < this.specImgParam.length; i++) {
        let item = this.specImgParam[i];

        if (item !== null) {
          specsImageFiles.push({
            key: item.key,
            url: await this.cacheImage(item.url)
          });
        } else {
          specsImageFiles.push(null);
        }
      }
      this.cashback.forEach(item => {
        item.checkset = false;
      });

      if (this.cashback.map(e => e.checkset).includes(true)) {
        this.batchFx = false;
      } else {
        this.batchFx = true;
      }

      this.handleStockDetailParam(); // 处理商品规格详细信息参数
      stockDetail = this.stockDetailParam;

      // 校验商品规格输入内容
      for (let item in stockDetail) {
        if (
          !this.checkSpec(
            stockDetail[item].orgPrice,
            stockDetail[item].stock,
            stockDetail[item].dctPrice,
            stockDetail[item].dctRate,
            stockDetail[item].costControlRatio,
            stockDetail[item].sendSeed,
            stockDetail[item].supportCount
          )
        ) {
          return false;
        }
      }

      param = {
        specs,
        specsImageFiles,
        stockDetail
      };
      console.log(param, "param");
      await this.upDataGoods(param, "stock");
    },

    // 商品详情修改后保存比价信息数据
    async savePryInfo() {
      let competitorPrices = this.competitorParam(); // 比价信息
      let param = {
        competitorPrices
      };

      await this.upDataGoods(param, "parityInfo");
    },

    // 商品详情修改后保存广告图数据
    async saveBnrInfo() {
      let param = null;
      let adImageFile = []; // 广告图

      if (!(this.bannerImgList.length > 0)) {
        this.alertTips("未上传商品图");
        return false;
      }

      adImageFile.push({
        key: this.bannerImgList[0].key,
        url: await this.cacheImage(this.bannerImgList[0].url)
      });

      param = {
        adImageFile: adImageFile[0]
      };

      await this.upDataGoods(param, "bannerImg");
    },

    // 商品详情修改后保存详细信息数据
    async saveDtlInfo() {
      let param = null;
      let introductions = []; // 图文介绍信息
      let introductionsImageFiles = []; // 图文介绍图片信息

      for (let i = 0; i < this.bannerDetail.length; i++) {
        let item = this.bannerDetail[i];

        if (item.resourceType === 1) {
          introductions.push(item);
        } else {
          introductions.push({
            resourceType: 2,
            content: await this.cacheImage(item.content)
          });
        }
      }

      for (let i = 0; i < this.introductionsImageFilesParam().length; i++) {
        let item = this.introductionsImageFilesParam()[i];

        introductionsImageFiles.push({
          key: item.key,
          url: await this.cacheImage(item.url)
        });
      }

      param = {
        introductions,
        introductionsImageFiles
      };

      await this.upDataGoods(param, "detailInfo");
    },

    // 修改商品接口
    async upDataGoods(param, key) {
      let res = null;
      let _this = this;
      const formData = new FormData();
      let id = parseInt(this.$route.query.id);

      this.requestLoadingTxt = "修改保存中...";
      this.requestLoading = true;

      param.id = id;
      param.seedDeduction = this.form.seedDeduction
        ? this.form.seedDeduction
        : "";
      param.freeBuySeedDeduction = this.form.freeBuySeedDeduction
        ? this.form.freeBuySeedDeduction
        : "";

      console.log(param);

      for (let key in param) {
        if (typeof param[key] === "object") {
          if (key == "goodsVideoFiles") {
            formData.append(key, param[key]);
          } else {
            formData.append(key, JSON.stringify(param[key]));
          }
        } else {
          formData.append(key, param[key]);
        }
      }

      res = await upDataGoodsRequest(formData);

      this.requestLoading = false;

      if (res.data.messageCode === "MSG_1001") {
        this.$alert("修改成功！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            _this.goodsDetailJson[key].disabled = true;
          }
        });
      } else {
        this.alertTips(res.data.message);
      }
    },

    // 缓存图片
    async cacheImage(src) {
      var baseImg = null;
      console.log(src);

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

    // 获取商家列表数据
    async getBusinessOptions() {
      let businessOptions = [
        {
          label: "自营",
          value: null
        }
      ];
      let res = await getBusinessOptionsRequest();

      if (res.data.messageCode === "MSG_1001") {
        res.data.content.map(item => {
          businessOptions.push({
            label: item.storeName,
            value: item.id
          });
        });
      }

      this.businessOptions = businessOptions;
    },

    // 获取商品分类数据
    async getGoodsClass() {
      let res = await getGoodsClassRequest();
      let arr = res.data.content;
      let goodsClassOptions = [];

      if (res.data.messageCode === "MSG_1001") {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          let obj = {
            label: item.name,
            value: item.id
          };

          if (item.nextLevelData.length > 0) {
            obj = {
              ...obj,
              children: []
            };

            for (let j = 0; j < item.nextLevelData.length; j++) {
              let ite = item.nextLevelData[j];

              obj.children.push({
                label: ite.name,
                value: ite.id
              });
            }

            goodsClassOptions.push(obj);
          } else {
            goodsClassOptions.push(obj);
          }
        }
      }

      this.goodsClassOptions = goodsClassOptions;
    },

    // 当前添加图片位置
    nowAddImgAddr(...obj) {
      this.addImgType = {
        type: obj[0],
        index: obj[1]
      };
    },

    // 选取文件上传前
    beforeUploadPicture(size) {
      if (!size) return false;

      if (size > 2 * 1024 * 1024) {
        this.$message.error("上传图片不能大于2M");
        return true;
      } else {
        return false;
      }
    },

    // 文件选取图片上传成功->打开裁剪->开始裁剪
    handleSuccess(e, ref, width, height) {
      console.log("添加广告图");
      let file = e.target.files[0];
      let reader = new FileReader();

      if (this.beforeUploadPicture(file.size)) return false;

      reader.readAsDataURL(file);

      reader.onloadend = e => {
        // console.log(e.target.result)
        this.cropperShow = true;
        this.example.editHeadurl = e.target.result;
        this.example.raw = file;
        this.example.autoCropWidth = width;
        this.example.autoCropHeight = height;
        this.$refs[ref].value = null;
        // var image = new Image();
        // image.src = e.target.result
        // image.onload = () =>{
        //     var width = image.width;
        //     var height = image.height;
        //     alert(width+'======'+height);
        // };
      };
    },

    // 删除商品图
    deleteGoodsImg(type, index) {
      this.$confirm("是否确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type === "goodsImgList" || type === "bannerImgList") {
            this[type].splice(index, 1);
          } else if (type === "specImg") {
            this[type][index] = undefined;
            this[type] = this.deepCopy(this[type]);
          }
        })
        .catch(() => {});
    },

    // 确认裁剪完成
    cropperSub() {
      let _this = this;

      // 获取截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        _this.completeImg(data);
      });
    },

    // 上传原图
    originalImg() {
      let url = this.example.editHeadurl;

      this.completeImg(url);
    },

    // 上传图片完成
    async completeImg(url) {
      let key = parseInt(new Date().valueOf() / 1000);

      if (
        this.addImgType.type === "goodsImgList" ||
        this.addImgType.type === "bannerImgList"
      ) {
        this[this.addImgType.type].push({
          url: url,
          key
        });
      } else if (this.addImgType.type === "specImg") {
        this[this.addImgType.type][this.addImgType.index] = {
          url: url,
          key
        };
        this[this.addImgType.type] = this.deepCopy(this[this.addImgType.type]);
      } else if (this.addImgType.type === "detailImg") {
        if (this.checkBannerDetail("图片最多添加50张", 2)) return false;

        this.bannerDetail.push({
          resourceType: 2,
          content: url
        });
      }

      this.cropperCel();
    },

    // 关闭裁剪
    cropperCel() {
      this.cropperShow = false;
    },

    // 检查是否上传商品图
    checkGoodsImgList() {
      if (this.goodsImgList.length > 0) {
        return true;
      } else {
        return false;
      }
    },

    // 商家选择
    businessChange(value) {
      this.form.businessOptions = value;
    },

    // 商品分类二级联动选择
    handleChange(value) {
      let val = value.slice(-1);

      this.goodsClassValue = val[0];
    },

    // 添加规格值
    addSpecNum(index) {
      this.goodsSpec[index].specNum.push("");

      if (index === 0)
        this.specImg.length = this.goodsSpec[index].specNum.length;
    },

    // 删除规格值
    delSpecNum(index) {
      this.goodsSpec[index].specNum.pop();

      index === 0 && this.specImg.pop();
    },

    // 添加规格项目
    addSpecPro() {
      let obj = {
        specName: "",
        specNum: [""]
      };

      this.goodsSpec.push(obj);
    },

    // 删除规格项目
    delSpecPro(index) {
      this.goodsSpec.splice(index, 1);
    },

    // 删除规格项目中的规格值
    delspecProDetail(index, dex) {
      this.goodsSpec[index].specNum.splice(dex, 1);
      index === 0 && this.specImg.splice(dex, 1);
    },

    // 检查商品规格输入数据
    checkGoodsSpecIn(goodsSpec) {
      for (let i = 0; i < goodsSpec.length; i++) {
        let item = goodsSpec[i];

        if (item.specName === "") {
          this.alertTips("请完善规格名");
          return false;
        }

        for (let j = 0; j < item.specNum.length; j++) {
          let ite = item.specNum[j];

          if (ite === "") {
            this.alertTips("请完善规格值");
            return false;
          }
        }
      }

      return true;
    },

    // 处理商品规格数据-(确认规格)
    handleGoodsSpec() {
      let arr = [];
      let keyArr = [];
      let nowIndex = 0;
      let len = this.goodsSpec.length;
      console.log(len);

      this.goodsSpecTle = this.deepCopy(this.goodsSpec);
      this.specImgParam = this.deepCopy(this.specImg);

      if (len > 0) {
        if (this.checkGoodsSpecIn(this.goodsSpec) !== true) return false;

        arr.push(this.goodsSpec[0].specNum);

        for (let i = 0; i < arr[0].length; i++) {
          keyArr.push(i);
        }

        if (len === 1) {
          this.recGoodsSpecDetail(arr);
          this.setStockDetail(keyArr);
        }

        if (len > 1) {
          this.recGoodsSpec(nowIndex, arr, keyArr);
        }
      }
    },

    // 递归处理商品规格数据
    recGoodsSpec(now, array, keyArr) {
      let ar = [];
      let keyAr = [];
      let index = now;
      let arr = this.deepCopy(array);
      let nextIndex = index + 1;
      let goodsSpec = this.goodsSpec;

      if (nextIndex < goodsSpec.length) {
        let len = arr[index].length;
        let nextLen = goodsSpec[nextIndex].specNum.length;

        for (let i = 0; i < len; i++) {
          let item = goodsSpec[nextIndex];

          for (let j = 0; j < nextLen; j++) {
            let ite = item.specNum[j];
            let key = keyArr[i] + "," + j;

            ar.push(ite);
            keyAr.push(key);
          }
        }

        arr.push(ar);

        this.recGoodsSpec(nextIndex, arr, keyAr);

        return true;
      }
      this.recGoodsSpecDetail(arr);
      this.setStockDetail(keyArr);
    },

    // 处理商品规格详情输入数据格式
    recGoodsSpecDetail(array) {
      let ar = [];
      let arr = [];
      let len = array[array.length - 1].length;
      let val = "";
      for (let i = 0; i < 7; i++) {
        ar = [];
        for (let j = 0; j < len; j++) {
          ar.push(val);
        }
        arr.push(ar);
      }
      if (this.userInputSpecDetail.length > 0) {
        this.RenderGoodsSpec = this.deepCopy(array);
        // let len = array[array.length - 1].length
        this.setCashbackDefault(len);
        console.log(this.userInputSpecDetail);
        for (var i = 0; i < arr.length; i++) {
          var arrres = arr[i];
          for (var j = 0; j < arrres.length; j++) {
            arrres[j] =
              this.userInputSpecDetail[i][j] == undefined
                ? ""
                : this.userInputSpecDetail[i][j];
          }
        }
        console.log(arr);
        this.userInputSpecDetail = arr;
      } else {
        this.RenderGoodsSpec = this.deepCopy(array);
        this.setCashbackDefault(len);
        this.userInputSpecDetail = arr;
      }
    },

    // 设置规格明细上传参数基本结构
    setStockDetail(arr) {
      this.stockDetailParam = {};

      for (let i = 0; i < arr.length; i++) {
        let key = arr[i];

        this.stockDetailParam[key] = {
          orgPrice: null,
          dctPrice: null,
          stock: null,
          dctRate: null,
          // specId:null,
          costControlRatio: null,
          specCashBacks: [],
          periodScope: null
        };
      }
    },

    // 批量设置开关
    batchOperation(type) {
      this[type].switch = true;
    },

    // 批量设置保存
    batchSave(type) {
      let index = null;
      let arr = [];

      if (type === "batchPrice") {
        index = 0;
      } else if (type === "batchStock") {
        index = 1;
      } else if (type === "chengben") {
        index = 2;
      } else if (type === "zhekou") {
        index = 3;
      } else if (type === "bili") {
        index = 4;
      } else if (type === "seed") {
        index = 5;
      } else if (type === "supportNum") {
        index = 6;
      }

      if (this[type].moneyNum === "") {
        this.alertTips("批量更改不能为空");
        return false;
      } else if (type == "bili") {
        // 验证成本调控比例输入格式
        if (
          !/^-?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(this[type].moneyNum) ||
          this[type].moneyNum > 100 ||
          this[type].moneyNum < -100
        ) {
          this.alertTips("成本调控比例格式不正确");
          return false;
        }
      } else if (type === "seed") {
        // 验证赠送种子输入格式
        if (this[type].moneyNum > 999999) {
          this.alertTips("最大可输入999999");
          return false;
        }
        if (!/^[0-9]\d*$/.test(this[type].moneyNum)) {
          this.alertTips("格式不正确");
          return false;
        }
      } else if (this.checkNum(this[type].moneyNum) !== true) {
        this.alertTips("输入格式不正确");
        return false;
      }
      arr = this.userInputSpecDetail[index];

      for (let i = 0; i < arr.length; i++) {
        arr[i] = this[type].moneyNum;
      }

      this.userInputSpecDetail[index] = arr;
      this[type].moneyNum = "";
      this[type].switch = false;
    },

    // 设置返现默认数据
    setCashbackDefault(len) {
      let arr = [];
      let optArr = [
        {
          txt: "立返",
          disabled: false
        },
        {
          txt: "一期",
          disabled: false
        },
        {
          txt: "二期",
          disabled: false
        },
        {
          txt: "三期",
          disabled: false
        },
        {
          txt: "四期",
          disabled: false
        },
        {
          txt: "五期",
          disabled: false
        },
        {
          txt: "六期",
          disabled: false
        },
        {
          txt: "七期",
          disabled: false
        },
        {
          txt: "八期",
          disabled: false
        },
        {
          txt: "九期",
          disabled: false
        },
        {
          txt: "十期",
          disabled: false
        },
        {
          txt: "十一期",
          disabled: false
        },
        {
          txt: "十二期",
          disabled: false
        }
      ];

      this.salesArr = [];
      // console.log(len)

      for (let i = 0; i < len; i++) {
        this.salesArr.push(0);

        arr.push({
          dex: i,
          checkset: false,
          money: 0,
          options: this.deepCopy(optArr),
          cashbackList: [],
          specCashBacks: [],
          periodScope: {
            minPeriod: 0.5,
            maxPeriod: 48,
            periodItems: [
              {
                periods: 0.5
              },
              {
                periods: 48
              }
            ]
          }
        });
      }
      console.log(arr);
      if (this.cashback.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          arr[i] = this.cashback[i] == undefined ? arr[i] : this.cashback[i];
        }
        this.cashback = arr;
      } else {
        this.cashback = arr;
      }
    },

    // 点击设置返现
    setCashback(dex) {
      let price = this.userInputSpecDetail[0][dex]; // 原价
      let stock = this.userInputSpecDetail[1][dex]; // 库存
      let cost = this.userInputSpecDetail[2][dex]; // 成本价
      let discount = this.userInputSpecDetail[3][dex]; // 折扣
      let money = null;

      if (
        !(this.cashback[dex].cashbackList.length > 0) &&
        this.goodsDetailJson.stock.disabled
      )
        return false;
      if (!this.checkSpec(price, stock, cost, discount)) return false;

      money = Math.floor(price * discount * 10) / 100;
      console.log(this.cashback);
      this.cashbackDetail = this.deepCopy(this.cashback[dex]);
      this.cashbackDetail.money = money;
      console.log(this.cashbackDetail);
      this.dialogTableVisible = true;
    },

    // 添加返现
    addCashback() {
      let options = this.cashbackDetail.options;
      let value = this.form.optionVal;
      let obj = {
        tle: value,
        cashbackMoney: ""
      };

      if (value === "" || this.cashbackDetail.cashbackList.length > 3)
        return false;

      for (let i = 0; i < options.length; i++) {
        if (options[i].txt === value) {
          this.cashbackDetail.options[i].disabled = true;
          this.cashbackDetail.specCashBacks.push({
            month: i,
            amount: null
          });
        }
      }

      this.form.optionVal = "";
      this.cashbackDetail.cashbackList.push(obj);
    },

    // 返现删除
    cashbackDelBtn(index) {
      let options = this.cashbackDetail.options;
      let value = this.cashbackDetail.cashbackList[index].tle;

      for (let i = 0; i < options.length; i++) {
        if (options[i].txt === value) {
          this.cashbackDetail.options[i].disabled = false;
        }
      }

      this.cashbackDetail.cashbackList.splice(index, 1);
      this.cashbackDetail.specCashBacks.splice(index, 1);
    },

    // 确认添加返现
    confirmCashback() {
      let index = this.cashbackDetail.dex;
      let money = this.cashbackDetail.money;
      let list = this.cashbackDetail.cashbackList;
      let periodItems = this.cashbackDetail.periodScope.periodItems;
      let minPeriod = this.cashbackDetail.periodScope.minPeriod;
      let maxPeriod = this.cashbackDetail.periodScope.maxPeriod;

      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i];

          if (item.cashbackMoney === "") {
            this.alertTips("返现数值不能为空");
            return false;
          } else if (this.checkNum(item.cashbackMoney) !== true) {
            this.alertTips("返现数值只能数字");
            return false;
          } else if (item.cashbackMoney < 1 || item.cashbackMoney > money) {
            this.alertTips('"返" 输入数字不可大于付的金额，不可小于1');
            return false;
          } else {
            this.cashbackDetail.specCashBacks[i].amount = item.cashbackMoney;
          }
        }
      }
      if (!maxPeriod && minPeriod) {
        this.alertTips("请输入最大分期期数");
        return;
      } else if (!minPeriod && maxPeriod) {
        this.alertTips("请输入最小分期期数");
        return;
      }
      for (let item of periodItems) {
        if (Number(item.periods) < Number(minPeriod)) {
          this.$message.error("用户选择分期数不能小于最小0元购分期数");
          return;
        }
        if (Number(item.periods) > Number(maxPeriod)) {
          this.$message.error("用户选择分期数不能大于最大0元购分期数");
          return;
        }
      }

      this.cashback[index] = this.deepCopy(this.cashbackDetail);
      this.zeroSet = true;
      console.log(this.cashback[index]);
      this.dialogTableVisible = false;
    },

    // 确认添加文字
    addBannerCtt() {
      let textareaBanner = this.textareaBanner;

      if (textareaBanner === "") {
        this.alertTips("未添加文字");
        return false;
      }

      if (this.checkBannerDetail("文字最多添加50条", 1)) return false;

      let obj = {
        resourceType: 1,
        content: textareaBanner
      };

      this.bannerDetail.push(obj);
      this.addBannerTxt = false;
      this.textareaBanner = "";
    },

    // 检查bannerDetail（文字|图片）最多输入条数
    checkBannerDetail(msg, type) {
      let max = 1;

      this.bannerDetail.map(item => {
        if (item.resourceType === type) max++;
      });

      if (max >= 50) {
        this.alertTips(msg);
        return true;
      }

      return false;
    },

    // 删除内容详情
    delBannerDetail(index) {
      this.bannerDetail.splice(index, 1);
    },

    // 检查必填数据
    checkMastFill(type) {
      let _this = this;
      let goodsImageFiles = this.goodsImgList;

      this.$refs.form.validate(valid => {
        if (valid) {
          if (!(goodsImageFiles.length > 0)) {
            this.alertTips("未上传商品图");
            return false;
          }

          if (_this.checkAllSpec() && _this.checkBanner()) {
            _this.handleStockDetailParam();
            _this.upParam(type);
          }
        } else {
          this.alertTips("必填项未填写完全");
        }
      });
    },

    // 对所有商品规格输入进行验证
    checkAllSpec() {
      let len = this.RenderGoodsSpec.length;
      let lastIndex = null;
      let lastLength = null;
      let price = null; // 原价
      let stock = null; // 库存
      let cost = null; // 成本价
      let discount = null; // 折扣
      let costControlRatio = null; //成本调控比例
      let sendSeed = null; //赠送种子
      let supportCount = null; // 赞助次数

      if (!(len > 0)) return true;

      lastIndex = len - 1;
      lastLength = this.RenderGoodsSpec[lastIndex].length;

      for (let i = 0; i < lastLength; i++) {
        price = this.userInputSpecDetail[0][i]; // 原价
        stock = this.userInputSpecDetail[1][i]; // 库存
        cost = this.userInputSpecDetail[2][i]; // 成本价
        discount = this.userInputSpecDetail[3][i]; // 折扣
        costControlRatio = this.userInputSpecDetail[4][i]; // 成本调控比例
        sendSeed = this.userInputSpecDetail[5][i]; // 赠送种子
        supportCount = this.userInputSpecDetail[6][i]; // 赞助次数

        if (
          !this.checkSpec(
            price,
            stock,
            cost,
            discount,
            costControlRatio,
            sendSeed,
            supportCount
          )
        )
          return false;
      }

      return true;
    },

    // 对广告图进行检查
    checkBanner() {
      if (this.bannerImgList.length > 0) {
        return true;
      } else {
        this.alertTips("请上传广告图");
        return false;
      }
    },

    // 处理规格信息参数
    specParam() {
      let arr = [];

      this.goodsSpecTle.map((item, index) => {
        arr.push({
          id: index,
          name: item.specName,
          items: []
        });

        item.specNum.map((ite, dex) => {
          arr[index].items.push({
            id: dex,
            name: ite
          });
        });
      });

      return arr;
    },

    // 处理库存详细信息参数
    handleStockDetailParam() {
      let i = 0;
      console.log(this.stockDetailParam);
      for (let key in this.stockDetailParam) {
        this.stockDetailParam[key].orgPrice = this.userInputSpecDetail[0][i];
        this.stockDetailParam[key].stock = this.userInputSpecDetail[1][i];
        this.stockDetailParam[key].dctPrice = this.userInputSpecDetail[2][i];
        this.stockDetailParam[key].dctRate = this.userInputSpecDetail[3][i];
        this.stockDetailParam[key].specId = this.cashback[i].specId;
        this.stockDetailParam[
          key
        ].costControlRatio = this.userInputSpecDetail[4][i];
        this.stockDetailParam[key].sendSeed = this.userInputSpecDetail[5][i];
        this.stockDetailParam[key].supportCount = this.userInputSpecDetail[6][
          i
        ];
        this.stockDetailParam[key].specCashBacks = this.cashback[
          i
        ].specCashBacks;
        if (this.cashback[i].periodScope) {
          if (
            !this.cashback[i].periodScope.minPeriod &&
            !this.cashback[i].periodScope.minPeriod.maxPeriod
          ) {
            this.stockDetailParam[key].periodScope = null;
          } else {
            this.stockDetailParam[key].periodScope = this.cashback[
              i
            ].periodScope;
          }
        }

        i++;
      }
    },

    // 处理比价信息参数
    competitorParam() {
      let arr = [];
      let jD =
        this.form.jinDong === "" || this.form.jinDong == 0
          ? null
          : this.form.jinDong;
      let tM =
        this.form.tianMao === "" || this.form.tianMao == 0
          ? null
          : this.form.tianMao;
      let yk =
        this.form.yxkl === "" || this.form.yxkl == 0 ? null : this.form.yxkl;

      if (jD !== null) {
        arr.push({
          mallId: 1,
          price: jD
        });
      }
      if (tM !== null) {
        arr.push({
          mallId: 2,
          price: tM
        });
      }
      if (yk !== null) {
        arr.push({
          mallId: 3,
          price: yk
        });
      }

      return arr;
    },

    // 详细信息图片单独地址集合
    introductionsImageFilesParam() {
      let arr = [];
      let detail = this.bannerDetail;
      let key = parseInt(new Date().valueOf() / 1000);

      detail.map(item => {
        if (item.resourceType === 2) {
          arr.push({
            key,
            url: item.content
          });
        }
      });

      return arr;
    },

    // 整合上传参数
    upParam(type) {
      let merchantId =
        this.form.businessOptions[0] === null
          ? ""
          : this.form.businessOptions[0]; // 商家id
      let name = this.form.goodsName; // 商品名
      let sharedDesc = this.form.goodsDcb; // 分享描述
      let goodsImageFiles = this.goodsImgList; // 商品图片
      let goodsVideoFiles = this.videoFile; // 商品图片
      let markedPrice = Number(this.form.discount); // 划线价
      let categoryId = this.form.goodsClass[this.form.goodsClass.length - 1]; // 分类ID
      let grabbed = this.form.robbed; // 已抢件数
      let expressFee = this.form.express; // 快递费
      let specs = this.specParam(); // 规格信息
      let specsImageFiles = this.specImgParam; // 规格图片
      let stockDetail = this.stockDetailParam; // 库存详细信息
      let competitorPrices = this.competitorParam(); // 比价信息
      let adImageFile = this.bannerImgList[0]; // 广告图
      let introductions = this.bannerDetail; // 图文介绍信息
      let introductionsImageFiles = this.introductionsImageFilesParam(); // 图文介绍图片信息
      let goodsIssueStatus = type; // 商品发布状态
      let seedDeduction = this.form.seedDeduction;
      let freeBuySeedDeduction = this.form.freeBuySeedDeduction;
      let param = null;

      param = {
        merchantId,
        name,
        markedPrice,
        sharedDesc,
        goodsImageFiles,
        goodsVideoFiles,
        categoryId,
        grabbed,
        expressFee,
        specs,
        specsImageFiles,
        stockDetail,
        competitorPrices,
        adImageFile,
        introductions,
        introductionsImageFiles,
        goodsIssueStatus,
        seedDeduction,
        freeBuySeedDeduction
      };

      console.log(param);

      this.addGoodsReq(param);
    },

    // 调用接口
    async addGoodsReq(param) {
      let res = null;
      let _this = this;
      const formData = new FormData();

      this.requestLoadingTxt = "添加商品上传中...";
      this.requestLoading = true;

      for (let item in param.stockDetail) {
        console.log(item);
        if (!param.stockDetail[item].costControlRatio) {
          param.stockDetail[item].costControlRatio = null;
        }
      }

      console.log(param);
      for (let key in param) {
        if (typeof param[key] === "object") {
          if (key == "goodsVideoFiles") {
            formData.append(key, param[key]);
          } else {
            formData.append(key, JSON.stringify(param[key]));
          }
        } else {
          formData.append(key, param[key]);
        }
      }
      console.log(formData);

      res = await addGoodsRequest(formData);

      if (res.data.messageCode === "MSG_1001") {
        this.$alert("上传成功！", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            _this.$router.go(0);
          }
        });
      } else {
        this.alertTips(res.data.message);
      }

      this.requestLoading = false;
    },

    /**
     * 检查规格填写是否符合
     * @param {number} price 原价
     * @param {number} stock 库存
     * @param {number} cost 成本价
     * @param {number} discount 折扣
     * @param {number} costControlRatio 成本调控比例
     * @param {number} sendSeed 赠送种子
     * @param {number} supportCount 赞助次数
     *
     */
    checkSpec(
      price,
      stock,
      cost,
      discount,
      costControlRatio,
      sendSeed,
      supportCount
    ) {
      if (price === "" || stock === "" || cost === "" || discount === "") {
        this.alertTips("商品规格未填写完全");
        return false;
      } else if (/^[0-9]\d*$/.test(stock) !== true) {
        this.alertTips("库存只能输入大于等于0的正整数");
        return false;
      } else if (!(this.checkNum(price) && this.checkNum(cost))) {
        this.alertTips("原价和成本价金额范围为0.01~99999999.99之间");
        return false;
      } else if (/^([1-9]\d{0}|10)(\.\d{1})?$/.test(discount) !== true) {
        this.alertTips("折扣为1-10之间小数点后最多一位");
        return false;
      } else if (discount > 10) {
        this.alertTips("折扣为1-10之间小数点后最多一位");
        return false;
      } else if (
        costControlRatio &&
        (!/^-?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(costControlRatio) ||
          costControlRatio > 100 ||
          costControlRatio < -100)
      ) {
        this.alertTips("成本调控比例格式不正确");
        return false;
      } else if (sendSeed && !/^[0-9]\d*$/.test(sendSeed)) {
        this.alertTips("赠送种子格式不正确");
        return false;
      } else if (sendSeed && sendSeed > 999999) {
        this.alertTips("赠送种子格式不正确");
        return false;
      } else if (
        supportCount &&
        (!/^[0-9]\d*$/.test(supportCount) || supportCount > 100)
      ) {
        this.alertTips("赞助次数格式不正确");
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.videoContent {
  width: 300px;
  height: 150px;
  position: relative;

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }
}

.filevideo {
  margin-bottom: 15px;

  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
}

.container {
  flex-grow: 1;
  height: auto;
  overflow: hidden;
  padding: 30px;

  .addImgCls {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px;
    height: 148px;
    overflow: hidden;
    border: 1px dashed #c0ccda;
    position: relative;

    i {
      font-size: 28px;
      color: #8c939d;
    }

    input {
      opacity: 0;
      font-size: 106px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .addImgClsBtn {
    width: 98px;
    height: 40px;
    overflow: hidden;
    margin-left: 10px;
    position: relative;

    div {
      width: 98px;
      height: auto;
      color: #ffffff;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      background: #409eff;
    }

    input {
      opacity: 0;
      font-size: 26px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  /deep/ .el-form {
    width: 100%;
    height: auto;

    .tle-nav {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      line-height: 60px;
      padding-left: 20px;
    }

    .tle-change {
      font-size: 16px;
      color: #409eff;
      line-height: 60px;
      text-align: right;
      font-weight: normal;
      padding-right: 20px;
    }

    .goods-img-fill {
      position: relative;

      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        position: absolute;
        top: 13px;
        left: 43px;
      }
    }

    .goods-fill {
      position: relative;

      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        position: absolute;
        top: 0;
        left: 33px;
      }
    }

    .banner-fill {
      position: relative;

      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        position: absolute;
        top: 0;
        left: 10px;
      }
    }

    .img-box {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;

      .img-list {
        width: 750px;
        height: 320px;
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .del-img {
          display: none;
          width: 20px;
          height: 20px;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 9;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        &:hover {
          .del-img {
            display: block;
          }
        }
      }
    }

    .discount-tips {
      font-size: 14px;
      color: #ff0000;
      line-height: 40px;
      padding-left: 10px;
    }

    .col-999 {
      color: #999999;
    }

    .goods-class {
      .el-cascader {
        width: 100%;
      }
    }

    .cmmt-spec {
      .tle-col {
        width: 100px;
        height: auto;

        .tle {
          font-size: 14px;
          color: #333333;
          text-align: right;
        }
      }

      .cmmt-spec-detail {
        width: calc(100% - 110px);
        padding: 10px;
        margin-left: 10px;
        border: 1px solid #dddddd;

        .el-col {
          width: auto;

          &:first-child {
            .el-form-item {
              .el-form-item__label {
                width: 60px !important;
              }

              .el-form-item__content {
                margin-left: 60px !important;
              }
            }
          }

          .el-form-item {
            .el-form-item__label {
              width: 10px !important;
            }

            .el-form-item__content {
              margin-left: 10px !important;

              .el-input {
                width: 160px;
              }
            }
          }
        }

        .spec-name {
          margin-bottom: 22px;
          background: #f8f8f8;

          .el-form-item {
            margin-bottom: 0;
          }
        }

        .spec-num {
          &:first-child {
            .el-row {
              padding-left: 60px !important;
            }
          }

          .hover-col {
            &:hover {
              .img-box {
                .del-img {
                  display: block;
                }
              }
            }

            .img-box {
              width: 148px;
              height: 148px;
              margin: 0 auto;
              position: relative;

              .del-img {
                display: none;
                width: 20px;
                height: 20px;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 9;

                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }

              .img-div {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }

    .cmmt-spec-tips {
      font-size: 14px;
      color: #333333;
      line-height: 40px;
      padding-left: 110px;
    }

    .spec-detail {
      .tle-col {
        width: 100px;
        height: auto;

        .tle {
          font-size: 14px;
          color: #333333;
          text-align: right;
        }
      }

      .spec-detail-detail {
        width: calc(100% - 110px);
        margin-left: 10px;
        padding: 0 10px;
        border: 1px solid #dddddd;
        overflow-x: auto;
        .header {
          display: flex;
          div {
            width: 120px;
            // flex-grow: 1;
            flex-shrink: 0;
            padding: 10px 0;
            font-size: 14px;
            color: #333333;
            text-align: center;
            box-sizing: border-box;
            // border:1px solid green;
          }

          .fill {
            &::before {
              content: "*";
              color: #ff0000;
            }
          }
        }

        .content {
          width: 100%;
          display: flex;
          border-bottom: 1px solid #dddddd;

          .hh {
            margin-left: 0 !important;
            padding: 5px;
            border-top: 1px solid #dddddd;
          }

          .el-form-item {
            margin-bottom: 0;

            .el-form-item__content {
              margin-left: 0 !important;
              padding: 5px;
              border-top: 1px solid #dddddd;
            }
          }
        }

        .modify {
          display: flex;
          padding: 10px 0;

          .el-col {
            width: auto !important;

            .el-form-item {
              margin-bottom: 0;

              .el-form-item__content {
                display: flex;
                margin-left: 0 !important;

                .el-input {
                  width: auto;
                }

                .el-button {
                  width: 40px;
                }
              }
            }
          }
        }
      }
    }

    .form-item-detail {
      margin-bottom: 0;
      margin-right: 20px;

      .el-form-item__content {
        display: flex;

        .upload-detail {
          margin-left: 10px;

          .el-upload--picture-card {
            border: none;
            width: auto;
            height: auto;
            line-height: 40px;
          }
        }
      }
    }

    .content-detail {
      &:hover {
        .banner-detail-close {
          display: block;
        }
      }

      .banner-detail-close {
        display: none;
        width: 22px;
        height: auto;
        color: #ffffff;
        line-height: 22px;
        text-align: center;
        background: rgba(51, 51, 51, 0.4);
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
      }
    }
  }

  .hover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;

    .cropper {
      width: 100vh;
      height: 100vh;
      padding-top: 30px;
      position: relative;

      .tle {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: auto;
        padding: 0 10px;
        background: #ffffff;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;

        span,
        i {
          display: block;
          font-size: 14px;
          color: #333333;
          line-height: 30px;
        }
      }

      .btn-div {
        position: absolute;
        top: 30px;
        right: -120px;

        button {
          display: block;
          margin-left: 0;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
