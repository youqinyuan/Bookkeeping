<template>
  <div class="comment">
    <div style="font-size:20px;">评论管理</div>
    <div class="goodsNameBox">
      <span style="font-size:20px;">商品：{{goodsName}}</span>
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
        <el-table-column prop="score" label="评分" width="80" align="center"></el-table-column>
        <el-table-column prop="content" label="评论内容" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="评论图片" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="seeImageFiles(scope.row.imageFiles)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headImg" alt style="width:40px;height:40px;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" align="center"></el-table-column>
        <el-table-column prop="createTime" label="评论时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="序号" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeNumber(scope.row.id)">{{scope.row.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
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
    >
      <el-form label-position="right" label-width="100px" :model="evaluationForm">
        <el-form-item label="头像：">
          <el-upload
            ref="uploadHeadImg"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-remove="handleRemove_headImg"
            :on-exceed="imgNumber_headImg"
            :on-change="changeFile_headImg"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="evaluationForm.name" style="width:160px;" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="评分：">
          <el-select v-model="evaluationForm.score" style="width:120px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论内容：">
          <el-input type="textarea" :rows="2" v-model="evaluationForm.content" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="评论图片：">
          <el-upload
            ref="uploadImg"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-remove="handleRemove_imageFiles"
            :on-exceed="imgNumber_imageFiles"
            :on-change="changeFile_imageFiles"
            :limit="6"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="evaluationDialog = false">取 消</el-button>
        <el-button type="primary" @click="addEvaluation">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看评论图片弹窗 -->
    <el-dialog
      title
      :visible.sync="imgDialog"
      width="740px"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <img
        v-for="(item,index) in imgList"
        :src="item"
        :key="index"
        alt
        style="width:200px;height:200px;margin:10px;"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  evaluationList,
  addEvaluation,
  evaluationUpdateOrderNo,
  deleteEvaluation
} from "@/network/api";
export default {
  data() {
    return {
      goodsId: "",
      goodsName: "",
      totalSize: 0,
      currentPage: 1,
      tableData: [],
      evaluationDialog: false,
      evaluationForm: {
        name: "",
        headImg: {
          key: "",
          url: ""
        },
        score: 5,
        content: "",
        imageFiles: []
      },
      options: [
        {
          value: 1,
          label: "1分"
        },
        {
          value: 2,
          label: "2分"
        },
        {
          value: 3,
          label: "3分"
        },
        {
          value: 4,
          label: "4分"
        },
        {
          value: 5,
          label: "5分"
        }
      ],
      imgDialog: false,
      imgList: [], // 请求回来的评论图片，查看图片时使用
      imageFiles: [] // 上传的没有转为base64格式的评论图片
    };
  },
  created() {
    this.goodsId = this.$route.query.id;
    this.goodsName = this.$route.query.name;
    this.evaluationList();
  },
  methods: {
    // 获取评论列表
    evaluationList() {
      let parms = {
        pageNumber: this.currentPage,
        pageSize: 15,
        goodsId: this.goodsId
      };
      evaluationList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加虚拟评论
    addEvaluation() {
      let form = this.evaluationForm;
      form.goodsId = this.goodsId;
      console.log(form);
      if (!form.headImg.url) {
        this.$message.error("请上传头像");
        return;
      }
      if (!form.name) {
        this.$message.error("请添加用户名");
        return;
      }
      if (!form.content) {
        this.$message.error("请填写评论内容");
        return;
      }
      addEvaluation(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("添加成功");
          this.evaluationDialog = false;
          this.currentPage = 1;
          this.evaluationList();
          // 清空上传的缩略图文件
          this.$refs.uploadHeadImg.clearFiles();
          this.$refs.uploadImg.clearFiles();
          this.imageFiles = [];
          this.evaluationForm = {
            name: "",
            headImg: {
              key: "",
              url: ""
            },
            score: 5,
            content: "",
            imageFiles: []
          };
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传头像图片
    changeFile_headImg(file) {
      let that = this;
      let image = new Image();
      image.src = file.url;
      image.onload = function() {
        let base64 = that.getBase64Image(image);
        that.evaluationForm.headImg.url = base64.substring(
          base64.indexOf(",") + 1
        );
      };
    },
    // 删除已经上传的头像图片
    handleRemove_headImg(file, fileList) {
      this.evaluationForm.headImg.url = "";
    },
    // 上传头像图片超出个数限制时的钩子
    imgNumber_headImg() {
      this.$message.error("最多添加1张图片");
    },
    // 上传评论图片
    changeFile_imageFiles(file) {
      let that = this;
      let image = new Image();
      image.src = file.url;
      image.onload = function() {
        let base64 = that.getBase64Image(image);
        base64 = base64.substring(base64.indexOf(",") + 1);
        that.evaluationForm.imageFiles.push({
          key: "",
          url: base64
        });
        that.imageFiles.push(file);
      };
    },
    // 删除已经上传的评论图片
    handleRemove_imageFiles(file, fileList) {
      // 查找想要删除的图片的索引
      let index = this.imageFiles.indexOf(file);
      this.imageFiles.splice(index, 1);
      this.evaluationForm.imageFiles.splice(index, 1);
    },
    // 上传评论图片超出个数限制时的钩子
    imgNumber_imageFiles() {
      this.$message.error("最多添加6张图片");
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
    // 查看评论图片
    seeImageFiles(imageFiles) {
      if (imageFiles.length == 0) {
        this.$message.error("暂无评论图片");
        return;
      }
      this.imgList = imageFiles;
      this.imgDialog = true;
    },
    // 调整序号
    changeNumber(id) {
      this.$prompt("调整评论序号", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false,
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          let parms = {
            id: id,
            orderNo: value
          };
          evaluationUpdateOrderNo(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.evaluationList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    remove(id) {
      this.$confirm("确认删除该评论吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          deleteEvaluation(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.evaluationList();
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
      this.evaluationList();
    }
  }
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