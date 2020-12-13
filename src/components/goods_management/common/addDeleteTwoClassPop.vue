<template>
  <div>
    <el-dialog :title="title==1?'添加二级分类':'修改二级分类'" :visible.sync="DialogVisible" width="30%" center>
      <el-form ref="form" label-width="80px">
        <el-form-item label="分类名称:">
          <el-input v-model="vauleName" maxlength="6" placeholder="最多输入6个字符"></el-input>
        </el-form-item>

        <el-form-item label="分类图片:">
          <el-upload
            class="avatar-uploader"
            action
            :auto-upload="false"
            :show-file-list="false"
            drag
            :on-change="changeUpload"
          >
            <el-image v-if="imageUrl" :src="imageUrl" fit="contain" class="avatar"></el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <cropperPop @getImgUrl="getImgUrl(arguments)" ref="corppers"></cropperPop>       -->
  </div>
</template>

<script>
import { addClass, updateClass } from "@/network/api";
// import cropperPop from './cropperPop.vue'
export default {
  props: {},
  data() {
    return {
      title: "",
      imageUrl: "",
      vauleName: "",
      DialogVisible: false,
      id: "",
      file: {}
    };
  },
  components: {
    // cropperPop
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open(id, name, imgUrl, title) {
      this.id = id;
      this.vauleName = name;
      this.imageUrl = imgUrl;
      this.title = title;
      this.DialogVisible = true;
    },
    changeUpload(file, fileList) {
      this.file = file;
      this.imageUrl = window.URL.createObjectURL(file.raw);
      // let reader = new FileReader()
      //     reader.readAsDataURL(file.raw)
      //     reader.onloadend = function(){
      //     that.$refs.corppers.open(this.result,file)
      // }
    },
    getImgUrl(msg) {
      this.imageUrl = msg[0];
      this.fromDatas = msg[1].raw;
    },
    save() {
      if (this.vauleName.length < 1) {
        this.$message.error("名称不能为空");
        return;
      } else if (!this.imageUrl) {
        this.$message.error("图片不能为空");
        return;
      } else if (this.file.size / 1024 / 1024 > 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return;
      }
      let formData = new FormData();
      formData.append("icon", this.file.raw);
      if (this.title == 1) {
        let param = {
          parentId: this.id,
          name: this.vauleName
        };
        for (let key in param) {
          if (typeof param[key] === "object") {
            formData.append(key, JSON.stringify(param[key]));
          } else {
            formData.append(key, param[key]);
          }
        }
        addClass(formData).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.DialogVisible = false;
            this.$parent.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        let param = {
          id: this.id,
          name: this.vauleName
        };
        for (let key in param) {
          if (typeof param[key] === "object") {
            formData.append(key, JSON.stringify(param[key]));
          } else {
            formData.append(key, param[key]);
          }
        }
        updateClass(formData).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.DialogVisible = false;
            this.$parent.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
</style>
