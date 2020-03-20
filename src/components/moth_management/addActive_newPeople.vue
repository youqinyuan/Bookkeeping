<template>
  <div class="newbornZone">
    <!-- 基础配置区 -->
    <div class="title">
      <span>基础配置区</span>
      <el-button type="primary" @click="submitForm" :disabled="disabled">保存</el-button>
    </div>
    <div class="formBox">
      <el-form ref="form" :model="form" style="display:flex;flex-wrap:wrap;">
        <el-form-item label="活动名称" style="width:350px;" required>
          <el-input
            v-model="form.name"
            placeholder="请添加活动名称"
            :maxlength="8"
            :disabled="disabled"
            show-word-limit
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动主题" style="width:350px;" required>
          <el-input
            v-model="form.theme"
            placeholder="请添加活动主题"
            style="width:200px;"
            :maxlength="8"
            :disabled="disabled"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="指定人群" style="width:350px;" required>
          <el-select v-model="form.crowd" placeholder="请添加指定人群" :disabled="disabled">
            <el-option label="首单新用户" :value="1"></el-option>
            <el-option label="钻石合伙人用户" :value="2"></el-option>
            <el-option label="所有用户" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" style="width:500px;" required>
          <el-date-picker
            v-model="time"
            :disabled="disabled"
            type="datetimerange"
            range-separator="至"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="返现类型" style="width:350px;" required>
          <el-radio-group v-model="form.cashBackType" :disabled="disabled">
            <el-radio :label="1">最终返现</el-radio>
            <el-radio :label="2">天天返现</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="购买按钮文案" style="width:350px;" required>
          <el-input
            v-model="form.buttonText"
            placeholder="请添加购买按钮文案"
            style="width:200px;"
            :maxlength="8"
            :disabled="disabled"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="活动头图" style="width:350px;" required>
          <el-upload
            class="upload-demo"
            action="/opadmin/fileStore/uploadFile"
            :limit="1"
            :show-file-list="false"
            :headers="myHeaders"
            :on-success="uploadSuccessFirstImage"
            :on-error="uploadFail"
            :disabled="disabled"
            :before-upload="beforeVideoUpload"
          >
            <div style="display:flex;align-items:center;">
              <img
                :src="firstImageUrl"
                style="width:80px;height:40px;margin-right:10px;"
                v-if="firstImageUrl"
              />
              <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
            </div>
            <div class="el-upload__tip" style="color:#ccc">建议尺寸375px *150px</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动标签图" style="width:350px;" required>
          <el-upload
            class="upload-demo"
            action="/opadmin/fileStore/uploadFile"
            :limit="1"
            :show-file-list="false"
            :disabled="disabled"
            :headers="myHeaders"
            :on-success="uploadSuccessLabelImage"
            :on-error="uploadFail"
            :before-upload="beforeVideoUpload"
          >
            <div style="display:flex;align-items:center;">
              <img
                :src="labelImageUrl"
                style="width:80px;height:40px;margin-right:10px;"
                v-if="labelImageUrl"
              />
              <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
            </div>
            <div class="el-upload__tip" style="color:#ccc">建议尺寸 355px *50px</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动规则" style="width:80%;" label-width="80px" required>
          <wang-editor @catchData="getContent" :content="content" v-if="flag"></wang-editor>
        </el-form-item>
      </el-form>
    </div>
    <!-- 1号配置区 -->
    <div class="title">1号配置区</div>
    <div class="configuratioN">
      <div class="topBox">
        <span>标签名称：</span>
        <el-input
          v-model="form.activityAreas[0].labelName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分类名称：</span>
        <el-input
          v-model="form.activityAreas[0].categoryName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分层图：</span>
        <el-upload
          class="upload-demo"
          action="/opadmin/fileStore/uploadFile"
          :limit="1"
          :disabled="disabled"
          :show-file-list="false"
          :headers="myHeaders"
          :on-success="uploadSuccessLayeredImage1"
          :on-error="uploadFail"
          :before-upload="beforeVideoUpload"
        >
          <img
            :src="layeredImageUrl1"
            style="width:80px;height:40px;margin-right:10px;"
            v-if="layeredImageUrl1"
          />
          <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#ccc">建议尺寸 355px * 65px</div>
        </el-upload>
        <span style="margin-left:20px">限购周期：</span>
        <el-input
          v-model="form.activityAreas[0].limitCycle"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">限购数量：</span>
        <el-input
          v-model="form.activityAreas[0].limitCount"
          style="width:100px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <el-button
          style="margin-left:20px;height:40px"
          type="success"
          @click="openAddGoods(1)"
          :disabled="disabled"
        >添加商品</el-button>
      </div>
      <div class="tabelBox">
        <el-table :data="form.activityAreas[0].goods" border style="width: 100%">
          <el-table-column prop="goodsId" label="编号" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="商品名" width="180"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="freeBuyPrice" label="FB支付价">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].freeBuyPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackAmount" label="返现金额">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackDays" label="返现天数">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletGoods(1,scope.$index)" :disabled="disabled">删除</el-button>
              <el-button
                type="text"
                :disabled="disabled"
                @click="openChangeParameterDialog(1,scope.row.goodsId,scope.$index,scope.row.stocks)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 2号配置区 -->
    <div class="title">2号配置区</div>
    <div class="configuratioN">
      <div class="topBox">
        <span>标签名称：</span>
        <el-input
          v-model="form.activityAreas[1].labelName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分类名称：</span>
        <el-input
          v-model="form.activityAreas[1].categoryName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分层图：</span>
        <el-upload
          class="upload-demo"
          action="/opadmin/fileStore/uploadFile"
          :limit="1"
          :show-file-list="false"
          :disabled="disabled"
          :headers="myHeaders"
          :on-success="uploadSuccessLayeredImage2"
          :on-error="uploadFail"
          :before-upload="beforeVideoUpload"
        >
          <img
            :src="layeredImageUrl2"
            style="width:80px;height:40px;margin-right:10px;"
            v-if="layeredImageUrl2"
          />
          <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#ccc">建议尺寸 355px * 65px</div>
        </el-upload>
        <span style="margin-left:20px">限购周期：</span>
        <el-input
          v-model="form.activityAreas[1].limitCycle"
          style="width:150px;"
          :disabled="disabled"
          :maxlength="8"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">限购数量：</span>
        <el-input
          v-model="form.activityAreas[1].limitCount"
          style="width:100px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <el-button
          style="margin-left:20px;height:40px"
          type="success"
          @click="openAddGoods(2)"
          :disabled="disabled"
        >添加商品</el-button>
      </div>
      <div class="tabelBox">
        <el-table :data="form.activityAreas[1].goods" border style="width: 100%">
          <el-table-column prop="goodsId" label="编号" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="商品名" width="180"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="freeBuyPrice" label="FB支付价">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].freeBuyPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackAmount" label="返现金额">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackDays" label="返现天数">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletGoods(2,scope.$index)" :disabled="disabled">删除</el-button>
              <el-button
                type="text"
                :disabled="disabled"
                @click="openChangeParameterDialog(2,scope.row.goodsId,scope.$index,scope.row.stocks)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 3号配置区 -->
    <div class="title">3号配置区</div>
    <div class="configuratioN">
      <div class="topBox">
        <span>标签名称：</span>
        <el-input
          v-model="form.activityAreas[2].labelName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分类名称：</span>
        <el-input
          v-model="form.activityAreas[2].categoryName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分层图：</span>
        <el-upload
          class="upload-demo"
          action="/opadmin/fileStore/uploadFile"
          :limit="1"
          :disabled="disabled"
          :show-file-list="false"
          :headers="myHeaders"
          :on-success="uploadSuccessLayeredImage3"
          :on-error="uploadFail"
          :before-upload="beforeVideoUpload"
        >
          <img
            :src="layeredImageUrl3"
            style="width:80px;height:40px;margin-right:10px;"
            v-if="layeredImageUrl3"
          />
          <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#ccc">建议尺寸 355px * 65px</div>
        </el-upload>
        <span style="margin-left:20px">限购周期：</span>
        <el-input
          v-model="form.activityAreas[2].limitCycle"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">限购数量：</span>
        <el-input
          v-model="form.activityAreas[2].limitCount"
          style="width:100px;"
          :disabled="disabled"
          :maxlength="8"
          show-word-limit
        ></el-input>
        <el-button
          style="margin-left:20px;height:40px"
          type="success"
          @click="openAddGoods(3)"
          :disabled="disabled"
        >添加商品</el-button>
      </div>
      <div class="tabelBox">
        <el-table :data="form.activityAreas[2].goods" border style="width: 100%">
          <el-table-column prop="goodsId" label="编号" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="商品名" width="180"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="freeBuyPrice" label="FB支付价">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].freeBuyPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackAmount" label="返现金额">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackDays" label="返现天数">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletGoods(3,scope.$index)" :disabled="disabled">删除</el-button>
              <el-button
                type="text"
                :disabled="disabled"
                @click="openChangeParameterDialog(3,scope.row.goodsId,scope.$index,scope.row.stocks)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 4号配置区 -->
    <div class="title">4号配置区</div>
    <div class="configuratioN">
      <div class="topBox">
        <span>标签名称：</span>
        <el-input
          v-model="form.activityAreas[3].labelName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分类名称：</span>
        <el-input
          v-model="form.activityAreas[3].categoryName"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">分层图：</span>
        <el-upload
          class="upload-demo"
          action="/opadmin/fileStore/uploadFile"
          :limit="1"
          :show-file-list="false"
          :disabled="disabled"
          :headers="myHeaders"
          :on-success="uploadSuccessLayeredImage4"
          :on-error="uploadFail"
          :before-upload="beforeVideoUpload"
        >
          <img
            :src="layeredImageUrl4"
            style="width:80px;height:40px;margin-right:10px;"
            v-if="layeredImageUrl4"
          />
          <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color:#ccc">建议尺寸 355px * 65px</div>
        </el-upload>
        <span style="margin-left:20px">限购周期：</span>
        <el-input
          v-model="form.activityAreas[3].limitCycle"
          style="width:150px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <span style="margin-left:20px">限购数量：</span>
        <el-input
          v-model="form.activityAreas[3].limitCount"
          style="width:100px;"
          :maxlength="8"
          :disabled="disabled"
          show-word-limit
        ></el-input>
        <el-button
          style="margin-left:20px;height:40px"
          type="success"
          @click="openAddGoods(4)"
          :disabled="disabled"
        >添加商品</el-button>
      </div>
      <div class="tabelBox">
        <el-table :data="form.activityAreas[3].goods" border style="width: 100%">
          <el-table-column prop="goodsId" label="编号" width="180"></el-table-column>
          <el-table-column prop="goodsName" label="商品名" width="180"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="freeBuyPrice" label="FB支付价">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].freeBuyPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackAmount" label="返现金额">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackDays" label="返现天数">
            <template slot-scope="scope">
              <span>{{scope.row.stocks[0].cashBackDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deletGoods(4,scope.$index)" :disabled="disabled">删除</el-button>
              <el-button
                type="text"
                :disabled="disabled"
                @click="openChangeParameterDialog(4,scope.row.goodsId,scope.$index,scope.row.stocks)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 选择商品弹窗 -->
    <addGoods ref="addGoods" @getgoods="getGoods"></addGoods>
    <!-- 修改参数弹窗 -->
    <changeParameter ref="changeParameter" @changeParameter="changeParameter"></changeParameter>
  </div>
</template>
<script>
import {
  addNewPeople,
  updateNewPeople,
  queryNewPeopleDetail
} from "@/network/api";
import wangEditor from "../genealogy_set/common/WangEditor";
import { getCookie } from "@/common/cookie.js";
import addGoods from "./common/addGoods";
import changeParameter from "./common/changeParameter";
export default {
  data() {
    return {
      myHeaders: { token: "" },
      fullscreenLoading: false, // elementui菊花图
      content: "",
      flag: false,
      disabled: false,
      form: {
        name: "",
        theme: "",
        crowd: "",
        beginTime: "",
        endTime: "",
        cashBackType: 1,
        buttonText: "",
        firstImage: "",
        labelImage: "",
        rule: "",
        activityAreas: [
          {
            labelName: "",
            categoryName: "",
            layeredImage: "",
            limitCycle: "",
            limitCount: "",
            goods: []
          },
          {
            labelName: "",
            categoryName: "",
            layeredImage: "",
            limitCycle: "",
            limitCount: "",
            goods: []
          },
          {
            labelName: "",
            categoryName: "",
            layeredImage: "",
            limitCycle: "",
            limitCount: "",
            goods: []
          },
          {
            labelName: "",
            categoryName: "",
            layeredImage: "",
            limitCycle: "",
            limitCount: "",
            goods: []
          }
        ]
      },
      firstImageUrl: "", //活动头图
      labelImageUrl: "", // 标签图
      layeredImageUrl1: "", //分层图配置1
      layeredImageUrl2: "", //分层图配置2
      layeredImageUrl3: "", //分层图配置3
      layeredImageUrl4: "", //分层图配置4
      time: ""
    };
  },
  components: {
    wangEditor,
    addGoods,
    changeParameter
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    let type = this.$route.query.type;
    let id = this.$route.query.id;
    // type: 1-添加活动 2-修改 3-查看
    if (type != 1) {
      if (type == 3) {
        this.disabled = true;
      }
      this.queryNewPeopleDetail(id);
    } else {
      this.flag = true;
    }
  },
  methods: {
    // 查询活动详情
    queryNewPeopleDetail(id) {
      let parms = {
        id: id
      };
      queryNewPeopleDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.form = data;
            this.content = data.rule;
            this.time = [new Date(data.beginTime), new Date(data.endTime)];
            this.firstImageUrl = data.firstImage;
            this.labelImageUrl = data.labelImage;
            this.layeredImageUrl1 = data.activityAreas[0]
              ? data.activityAreas[0].layeredImage
              : "";
            this.layeredImageUrl2 = data.activityAreas[1]
              ? data.activityAreas[1].layeredImage
              : "";
            this.layeredImageUrl3 = data.activityAreas[2]
              ? data.activityAreas[2].layeredImage
              : "";
            this.layeredImageUrl4 = data.activityAreas[3]
              ? data.activityAreas[3].layeredImage
              : "";
            this.form.firstImage = "";
            this.form.labelImage = "";
            for (let i = 0; i < 4; i++) {
              if (!this.form.activityAreas[i]) {
                this.form.activityAreas.splice(i, 0, {
                  labelName: "",
                  categoryName: "",
                  layeredImage: "",
                  limitCycle: "",
                  limitCount: "",
                  goods: []
                });
              } else {
                this.form.activityAreas[i].layeredImage = "";
              }
            }
          }
          // console.log(this.form);
          this.flag = true;
        } else {
          this.flag = true;
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传图片之前
    beforeVideoUpload() {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    uploadSuccess() {},
    // 活动头图 -- 图片上传成功
    uploadSuccessFirstImage(response, file, fileList) {
      this.firstImageUrl = response.content.url;
      this.form.firstImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 活动标签图 -- 图片上传成功
    uploadSuccessLabelImage(response, file, fileList) {
      this.labelImageUrl = response.content.url;
      this.form.labelImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 配置1分层图 -- 图片上传成功
    uploadSuccessLayeredImage1(response, file, fileList) {
      this.layeredImageUrl1 = response.content.url;
      this.form.activityAreas[0].layeredImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 配置2分层图 -- 图片上传成功
    uploadSuccessLayeredImage2(response, file, fileList) {
      this.layeredImageUrl2 = response.content.url;
      this.form.activityAreas[1].layeredImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 配置3分层图 -- 图片上传成功
    uploadSuccessLayeredImage3(response, file, fileList) {
      this.layeredImageUrl3 = response.content.url;
      this.form.activityAreas[2].layeredImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 配置4分层图 -- 图片上传成功
    uploadSuccessLayeredImage4(response, file, fileList) {
      this.layeredImageUrl4 = response.content.url;
      this.form.activityAreas[3].layeredImage = response.content.key;
      this.fullscreenLoading.close();
    },
    // 图片上传失败
    uploadFail() {
      this.fullscreenLoading.close();
      this.$message.error("图片上传失败");
    },
    // 富文本编辑器 -- 接收来自子组件的值
    getContent(data) {
      this.content = data;
      this.form.rule = data;
    },

    // 添加商品
    openAddGoods(number) {
      // 参数number：几号配置区
      // 收取整个活动选取的商品数据，传递到添加商品子组件中，子组件中默认选中这些商品
      let goodsArr = [];
      this.form.activityAreas.forEach(val => {
        val.goods.forEach(ite => {
          ite.id = ite.goodsId;
          goodsArr.push(ite);
        });
      });
      this.$refs.addGoods.open(number, goodsArr);
    },
    // 接收添加商品子组件传递过来的参数
    getGoods(data, number) {
      console.log(data, number);
      data.forEach(item => {
        this.form.activityAreas[number - 1].goods.push({
          goodsId: item.id,
          goodsName: item.name,
          stock: item.stock,
          stocks: [
            {
              freeBuyPrice: "",
              cashBackAmount: "",
              cashBackDays: ""
            }
          ]
        });
      });
      this.$message.success("添加成功");
    },
    // 删除商品
    deletGoods(number, index) {
      this.form.activityAreas[number - 1].goods.splice(index, 1);
    },
    // 打开修改参数弹窗
    openChangeParameterDialog(number, goodsId, index, stocks) {
      // 参数number代表几号配置区
      // index:tabel表格的下标
      this.$refs.changeParameter.open(number, goodsId, index, stocks);
    },
    // 接收修改参数子组件传递过来的参数
    changeParameter(number, data, index) {
      // console.log(number, data);
      this.form.activityAreas[number - 1].goods[index].stocks = data;
    },
    // 保存
    submitForm() {
      let form = JSON.parse(JSON.stringify(this.form));
      // 验证输入格式
      let number = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      let s = true;
      form.activityAreas.forEach(val => {
        if (
          (val.limitCycle && !number.test(val.limitCycle)) ||
          (val.limitCount && !number.test(val.limitCount))
        ) {
          s = false;
        }
      });
      if (!s) {
        this.$message.error("请检查输入内容是否有误");
        return;
      }
      if (this.time) {
        form.beginTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      }
      for (let i = 0; i < form.activityAreas.length; i++) {
        if (form.activityAreas[i].goods.length == 0) {
          form.activityAreas.splice(i, 1);
          i--;
        } else {
          form.activityAreas[i].goods.forEach(ele => {
            delete ele.goodsName;
            delete ele.stock;
          });
        }
      }
      if (this.$route.query.type == 1) {
        // 添加活动
        form.activityAreas = JSON.stringify(form.activityAreas);
        addNewPeople(this.qs.stringify(form)).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$router.go(-1);
            this.$message.success("活动创建成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        // 修改活动
        form.activityAreas.forEach(val => {
          val.goods.forEach(ite => {
            if (ite.id) {
              delete ite.cashBackDays;
              delete ite.cashBackAmount;
              delete ite.freeBuyPrice;
              delete ite.goodsName;
              delete ite.stock;
            }
          });
        });
        form.activityAreas = JSON.stringify(form.activityAreas);
        updateNewPeople(this.qs.stringify(form)).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$router.go(-1);
            this.$message.success("活动修改成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.newbornZone {
  padding: 20px;
  padding-top: 0px;
  box-sizing: border-box;
  .title {
    width: 100%;
    border-bottom: 1px solid #000;
    padding-bottom: 5px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  .formBox {
    margin-top: 10px;
  }
}
.topBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  font-size: 14px;
  span:before {
    content: "*";
    color: #f56c6c;
    font-size: 12px;
    margin-right: 4px;
  }
}
.tabelBox {
  margin-top: 20px;
}
</style>