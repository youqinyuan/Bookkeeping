<template>
  <div class="comment">
    <el-button @click="goBack">返回上一页</el-button>
    <div style="font-size: 20px; margin-top: 20px">评论管理</div>
    <div class="goodsNameBox">
      <span style="font-size: 20px">标题：{{ title }}</span>
      <el-button plain @click="evaluationDialog = true">添加虚拟评论</el-button>
    </div>
    <div class="tableBox">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="discussContent"
          label="评论内容"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="用户头像" align="center" width="100px">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatarUrl"
              alt=""
              style="width: 40px; height: 40px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户名"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="评论时间"
          align="center"
          width="180px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.discussTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="remove(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :current-page.sync="currentPage"
        page-size.sync="15"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>

    <!-- 添加虚拟评论弹窗 -->
    <el-dialog
      title="添加虚拟评价"
      :visible.sync="evaluationDialog"
      width="500px"
      :close-on-click-modal="false"
      :show-close="false"
      center
      @close="closeEvaluationDialog"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="evaluationForm"
      >
        <el-form-item label="头像：">
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
        <el-form-item label="用户名：">
          <el-input
            v-model="evaluationForm.nickname"
            style="width: 160px"
            :maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="评论内容：">
          <el-input
            type="textarea"
            :rows="2"
            v-model="evaluationForm.discussContent"
            :maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="evaluationDialog = false">取 消</el-button>
        <el-button type="primary" @click="addEvaluation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGuessDiscussList,
  addGuessDiscuss,
  deleteGuessDiscuss,
} from "@/network/api";
export default {
  data() {
    return {
      id: "", // 竞猜id
      title: "", // 标题
      totalSize: 0,
      currentPage: 1,
      tableData: [],
      evaluationDialog: false,
      evaluationForm: {
        guessId: "",
        nickname: "",
        discussContent: "",
        imageFile: "",
      },
      imageUrl: [], // 头像
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.title = this.$route.query.title;
    this.getGuessDiscussList();
  },
  methods: {
    // 获取评论列表
    getGuessDiscussList(val) {
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 15,
        guessId: this.id,
      };
      getGuessDiscussList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭添加虚拟评论弹窗
    closeEvaluationDialog() {
      this.imageUrl = [];
      for (let key in this.evaluationForm) {
        this.evaluationForm[key] = "";
      }
    },
    // 添加虚拟评论
    addEvaluation() {
      let form = this.evaluationForm;
      form.guessId = this.id;
      if (!form.imageFile) {
        this.$message.error("请上传头像");
        return;
      }
      if (!form.nickname) {
        this.$message.error("请添加用户名");
        return;
      }
      if (!form.discussContent) {
        this.$message.error("请填写评论内容");
        return;
      }
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      addGuessDiscuss(formData).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("添加成功");
          this.evaluationDialog = false;
          this.getGuessDiscussList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传背景图片
    changeFile_headImg(file) {
      this.evaluationForm.imageFile = file.raw;
    },
    // 删除已经上传的背景图片
    handleRemove_headImg(file, fileList) {
      this.evaluationForm.imageFile = "";
    },
    // 上传背景图片超出个数限制时的钩子
    imgNumber_headImg() {
      this.$message.error("最多添加1张图片");
    },
    // 删除
    remove(id) {
      this.$confirm("确认删除该评论吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false,
      })
        .then(() => {
          let parms = {
            id: id,
          };
          deleteGuessDiscuss(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.getGuessDiscussList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.getGuessDiscussList(val);
    },
    // 返回上一页
    goBack() {
      this.$router.go("-1");
    },
  },
};
</script>
<style lang="less" scoped>
.comment {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .goodsNameBox {
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tableBox {
    margin-top: 40px;
  }
  .totalBox {
    width: 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>