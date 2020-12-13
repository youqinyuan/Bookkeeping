<template>
  <div class="guessingGameList">
    <div class="searchBox">
      <div class="searchItem">
        <span>竞猜标题：</span>
        <el-input v-model="form.head" style="width: 200px"></el-input>
      </div>
      <div class="searchItem">
        <span>开始时间：</span>
        <el-date-picker
          v-model="time1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="searchItem">
        <span>揭晓时间：</span>
        <el-date-picker
          v-model="time2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="searchItem">
        <span>状态：</span>
        <el-select v-model="form.status" style="width: 120px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="primary" @click="openAddGameDialog(null)"
        >新建竞猜</el-button
      >
      <el-button type="primary" @click="openRuleDialog">设置活动规则</el-button>
      <el-button type="primary" @click="openSetWagerDialog"
        >设置下注选项</el-button
      >
    </div>
    <div class="tableBox">
      <div style="margin-bottom: 10px; text-align: right; margin-right: 20px">
        所有入场总票（花瓣数）之和：{{ allFlower }}
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="head" label="竞猜标题" align="center">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.startTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="投票截止时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.endTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="revealTime"
          label="揭晓时间"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.revealTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="选项" align="center">
          <template slot-scope="scope">
            <span
              :style="
                scope.row.isReveal == '1' &&
                scope.row.answer == scope.row.optionOne
                  ? 'color:red;'
                  : ''
              "
              >{{ scope.row.optionOne }}</span
            >
            <span>/</span>
            <span
              :style="
                scope.row.isReveal == '1' &&
                scope.row.answer == scope.row.optionTwo
                  ? 'color:red;'
                  : ''
              "
              >{{ scope.row.optionTwo }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="flower"
          label="奖池花瓣"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="returnCost"
          label="获胜回报率"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="intoCost"
          label="入场票"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'">未开始</span>
            <span v-if="scope.row.status == '2'">投票中</span>
            <span v-if="scope.row.status == '3'">等待揭晓</span>
            <span v-if="scope.row.status == '4'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <router-link
              :to="{ path: '/guessingGameDetail', query: { id: scope.row.id } }"
            >
              <el-button type="text">查看详情</el-button>
            </router-link>
            <el-button
              type="text"
              @click="openAddGameDialog(scope.row)"
              v-if="scope.row.status == '1'"
              >修改
            </el-button>
            <el-button
              type="text"
              @click="del(scope.row.id)"
              v-if="scope.row.status != '4'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalSizeBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      >
      </el-pagination>
    </div>
    <!-- 创建竞猜游戏弹窗 -->
    <el-dialog
      :title="addGameDialogTitle"
      :visible.sync="addGameDialog"
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      center
      @close="closeAddGameDialog"
    >
      <el-form ref="gameForm" :model="gameForm" label-width="120px">
        <el-form-item label="竞猜大标题">
          <el-input
            v-model="gameForm.head"
            :maxlength="10"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="竞猜小标题">
          <el-input
            v-model="gameForm.subhead"
            :maxlength="30"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="选项1(按钮名)">
          <el-input
            v-model="gameForm.optionOne"
            :maxlength="5"
            style="width: 140px"
          ></el-input>
        </el-form-item>
        <el-form-item label="选项2(按钮名)">
          <el-input
            v-model="gameForm.optionTwo"
            :maxlength="5"
            style="width: 140px"
          ></el-input>
        </el-form-item>
        <el-form-item label="投票开始时间">
          <el-date-picker
            v-model="gameForm.startTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="投票截止至">
          <el-date-picker
            v-model="gameForm.endTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计揭晓时间">
          <el-date-picker
            v-model="gameForm.revealTime"
            value-format="timestamp"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入场费(花瓣数)">
          <el-input v-model="gameForm.intoCost" style="width: 100px"></el-input
          >%
        </el-form-item>
        <el-form-item label="背景图">
          <el-upload
            ref="uploadHeadImg"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            accept="image/*"
            :file-list="imageUrl"
            :on-remove="handleRemove_headImg"
            :on-exceed="imgNumber_headImg"
            :on-change="changeFile_headImg"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGameDialog = false">取 消</el-button>
        <el-button type="primary" v-if="!gameForm.id" @click="addGame"
          >确 定</el-button
        >
        <el-button type="primary" v-else @click="changeGame">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置活动规则 -->
    <el-dialog
      title="设置活动规则"
      :visible.sync="ruleDialog"
      width="800px"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div>
        <span style="margin-right: 20px">标题</span>
        <el-input
          v-model="ruleForm.title"
          style="width: 400px"
          :maxlength="10"
        ></el-input>
      </div>
      <div style="margin-top: 20px; display: flex">
        <span style="margin-right: 20px">内容</span>
        <div class="editorBox">
          <wang-editor
            @catchData="getContent"
            :content="ruleForm.content"
            v-if="flag"
          ></wang-editor>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ruleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateGuess">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 调整用户下注选项弹窗 -->
    <el-dialog
      title="调整用户下注选项"
      :visible.sync="setWagerDialog"
      width="420px"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="setWagerBox">
        <el-input
          v-model="item.costAmount"
          v-for="(item, index) in userForm"
          :key="index"
          style="width: 80px; margin: 5px"
          :maxlength="6"
        ></el-input>
      </div>
      <div style="width: 100%; text-align: center">单位：花瓣</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setWagerDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUserWager">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGuessList,
  addGuess,
  getGuessById,
  updateGuessById,
  deleteGuessById,
  addOrUpdateGuess,
  getRuleGuess,
  addOrUpdateGuessChoose,
  getGuessCostChoose,
} from "@/network/api";
import wangEditor from "../../genealogy_set/common/WangEditor";
import contentVue from "../newUser/content.vue";
export default {
  data() {
    return {
      addGameDialog: false,
      addGameDialogTitle: "",
      ruleDialog: false,
      flag: false, //是否显示wangeditor组件
      setWagerDialog: false,
      totalSize: 0,
      currentPage: 0,
      form: {
        pageSize: 10,
        head: "",
        minStartTime: "",
        maxStartTime: "",
        minRevealTime: "",
        maxRevealTime: "",
        status: "",
      },
      allFlower: "", //所有入场总票（花瓣数）之和
      imageUrl: [], // 查看竞猜背景图
      id: "", // 竞猜id
      time1: "",
      time2: "",
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "未开始",
        },
        {
          value: "2",
          label: "投票中",
        },
        {
          value: "3",
          label: "等待揭晓",
        },
        {
          value: "4",
          label: "已结束",
        },
      ],
      tableData: [],
      gameForm: {
        head: "",
        subhead: "",
        optionOne: "",
        optionTwo: "",
        startTime: "",
        endTime: "",
        revealTime: "",
        intoCost: "",
        imageFile: "",
      },
      ruleForm: {
        title: "",
        content: "",
      },
      textLength: "", // 富文本输入的字数
      userForm: [
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
        {
          costAmount: "",
        },
      ],
    };
  },
  components: {
    wangEditor,
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let form = this.form;
      if (this.time1) {
        form.minStartTime = this.time1[0].getTime();
        form.maxStartTime = this.time1[1].getTime();
      } else {
        form.minStartTime = "";
        form.maxStartTime = "";
      }
      if (this.time2) {
        form.minRevealTime = this.time2[0].getTime();
        form.maxRevealTime = this.time2[1].getTime();
      } else {
        form.minRevealTime = "";
        form.maxRevealTime = "";
      }
      form.pageNumber = val ? val : this.currentPage;
      getGuessList({
        params: form,
      }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          if (content.items.length > 0) {
            this.allFlower = content.items[0].allFlower;
          }
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开竞猜弹窗
    openAddGameDialog(data) {
      if (data) {
        for (let key in this.gameForm) {
          this.gameForm[key] = data[key];
        }
        this.gameForm.id = data.id;
        this.gameForm.imageFile = data.imageKey;
        this.imageUrl.push({
          url: data.imageUrl,
        });
        this.addGameDialogTitle = "修改竞猜游戏";
      } else {
        this.addGameDialogTitle = "创建竞猜游戏";
      }
      this.addGameDialog = true;
    },
    // 上传背景图片
    changeFile_headImg(file) {
      this.gameForm.imageFile = file.raw;
    },
    // 删除已经上传的背景图片
    handleRemove_headImg(file, fileList) {
      this.gameForm.imageFile = "";
    },
    // 上传背景图片超出个数限制时的钩子
    imgNumber_headImg() {
      this.$message.error("最多添加1张图片");
    },
    // 关闭创建竞猜游戏弹窗
    closeAddGameDialog() {
      this.imageUrl = [];
      for (let key in this.gameForm) {
        this.gameForm[key] = "";
      }
    },
    // 添加竞猜游戏
    async addGame() {
      // 验证表单
      let flag = await this.checkForm();
      if (!flag) {
        return;
      }
      let gameForm = this.gameForm;
      let formData = new FormData();
      for (let key in gameForm) {
        formData.append(key, gameForm[key]);
      }
      addGuess(formData).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.addGameDialog = false;
          this.search(1);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改竞猜游戏
    async changeGame() {
      // 验证表单
      let flag = await this.checkForm();
      if (!flag) {
        return;
      }
      let gameForm = this.gameForm;
      let formData = new FormData();
      for (let key in gameForm) {
        formData.append(key, gameForm[key]);
      }
      updateGuessById(formData).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.addGameDialog = false;
          this.search();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 验证新建或者修改竞猜表单是否有必填项为空
    checkForm() {
      let form = this.gameForm;
      if (!form.head) {
        this.$message.error("竞猜大标题不能为空");
        return false;
      }
      if (!form.subhead) {
        this.$message.error("竞猜小标题不能为空");
        return false;
      }
      if (!form.optionOne) {
        this.$message.error("选项1不能为空");
        return false;
      }
      if (!form.optionTwo) {
        this.$message.error("选项2不能为空");
        return false;
      }
      if (!form.startTime) {
        this.$message.error("投票开始时间不能为空");
        return false;
      }
      if (!form.endTime) {
        this.$message.error("投票截止时间不能为空");
        return false;
      }
      if (!form.revealTime) {
        this.$message.error("预计揭晓时间不能为空");
        return false;
      }
      if (form.intoCost != "0" && !form.intoCost) {
        this.$message.error("入场费率不能为空");
        return false;
      }
      if (!form.imageFile) {
        this.$message.error("背景图片不能为空");
        return false;
      }
      if (form.optionOne == form.optionTwo) {
        this.$message.error("选项1和选项2不能相同");
        return false;
      }
      return true;
    },
    // 打开设置活动规则弹窗
    openRuleDialog() {
      getRuleGuess().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.ruleForm = res.data.content;
          this.flag = true;
          this.ruleDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 接收来自富文本的值
    getContent(data, textLength) {
      this.ruleForm.content = data;
      this.textLength = textLength;
    },
    // 保存活动规则
    addOrUpdateGuess() {
      if (!this.ruleForm.title) {
        this.$message.error("请输入活动标题");
        return;
      }
      if (this.textLength == 0) {
        this.$message.error("请输入活动内容");
        return;
      }
      if (this.textLength > 5000) {
        this.$message.error("规则内容最大输入5000字");
        return;
      }
      addOrUpdateGuess(this.ruleForm).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.flag = false;
          this.ruleDialog = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开调整用户下注选项弹窗
    openSetWagerDialog() {
      getGuessCostChoose().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content.length > 0) {
            this.userForm = res.data.content;
          }
          this.setWagerDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存用户下注选项
    submitUserWager() {
      let a = /^[1-9]\d*$/;
      let flag = true;
      this.userForm.forEach((val) => {
        if (!a.test(val.costAmount)) {
          flag = false;
        }
      });
      if (!flag) {
        this.$message.error("输入格式不正确");
        return;
      }
      addOrUpdateGuessChoose(this.userForm).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.setWagerDialog = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除
    del(id) {
      this.$confirm("", "确认删除此次竞猜吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          let parms = {
            id: id,
          };
          deleteGuessById(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.addGameDialog = false;
              this.search();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },
  },
};
</script>
<style lang="less" scoped>
.guessingGameList {
  padding: 20px;
  box-sizing: border-box;
}

.searchBox {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .searchItem {
    margin: 10px;
  }
}

.tableBox {
  margin-top: 40px;
}

.totalSizeBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editorBox {
  width: 700px;
}
</style>
