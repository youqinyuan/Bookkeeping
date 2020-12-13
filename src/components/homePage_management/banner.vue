<template>
  <div class="contents">
    <div class="banner_content">
      <div v-for="(item,index) in bannerList" :key="index" class="banners">
        <div class="title">
          <i
            @click="forward(index)"
            class="el-icon-d-arrow-left"
            style="cursor: pointer"
            v-if="index !=0"
          ></i>
          <span v-if="index == 0">首图</span>
          <span
            @click="setFirst(index)"
            v-else
            style="color:#008000;cursor: pointer;margin:0 70px"
          >设为首图</span>
          <i
            @click="backward(index)"
            class="el-icon-d-arrow-right"
            style="cursor: pointer"
            v-if="index !=0 && index != bannerList.length-1"
          ></i>
        </div>
        <el-image
          class="imgs"
          style="width: 350px; height: 140px;cursor: pointer;"
          :src="item.iconUrl"
          fit="contain"
        ></el-image>
        <div class="bot_btn">
          <el-button type="primary" size="mini" @click="changeBanner(item)">更换链接</el-button>
          <div class="name" :title="item.pageName">{{item.pageName}}</div>
          <div
            class="name"
            style="cursor:pointer"
            v-if="item.visibleType == 1"
            @click="changeVisible(item.id,3)"
          >ios端隐藏</div>
          <div
            class="name"
            style="cursor:pointer"
            v-if="item.visibleType == 3"
            @click="changeVisible(item.id,1)"
          >取消ios端隐藏</div>
          <el-button type="danger" size="mini" @click="deleteBanner(item.id)">删除</el-button>
        </div>
      </div>
    </div>
    <el-button type="primary" @click="nav_addBanner" style="margin:50px 0">添加轮播图</el-button>
  </div>
</template>

<script>
import {
  removeNavigation,
  sortBySlideShowIds,
  findNavigation,
  updateVisibleType
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      bannerList: [],
      ids: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getBannerList();
  },
  methods: {
    // 获取轮播图列表
    getBannerList() {
      findNavigation({ navType: 9 }).then(res => {
        this.ids = [];
        if (res.data.messageCode == "MSG_1001") {
          this.bannerList = res.data.content.items;
          this.bannerList.forEach((item, index) => {
            this.ids.push(item.id);
          });
        }
      });
    },

    // 删除轮播图
    deleteBanner(id) {
      this.$confirm("", "确定删除此图片吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: id
          };
          removeNavigation(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.getBannerList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },

    // 向前排序
    forward(index) {
      this.swapArray(this.ids, index, index - 1);
      let parms = {
        navType: 9,
        ids: this.ids
      };
      sortBySlideShowIds(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.getBannerList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 向后排序
    backward(index) {
      this.swapArray(this.ids, index, index + 1);
      let parms = {
        navType: 9,
        ids: this.ids
      };
      sortBySlideShowIds(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.getBannerList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 设为首图
    setFirst(index) {
      let s = this.ids.splice(index, 1);
      this.ids.unshift(s[0]);
      let parms = {
        navType: 9,
        ids: this.ids
      };
      sortBySlideShowIds(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.getBannerList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 更改轮播图在ios端显示或者隐藏
    changeVisible(id, status) {
      let parms = {
        id: id,
        visibleType: status
      };
      updateVisibleType(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.getBannerList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加轮播图
    nav_addBanner() {
      this.$router.push({
        path: "/addBannerPage",
        query: {
          navType: 9
        }
      });
    },
    // 更换链接
    changeBanner(item) {
      this.$router.push({
        path: "/addBannerPage",
        query: {
          navType: 9,
          item: JSON.stringify(item)
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.contents {
  text-align: center;
}
.banner_content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .banners {
    margin-right: 50px;
    margin-top: 20px;
    background: LightGray;
    width: 350px;
    height: auto;
    padding: 10px 15px;
    box-sizing: content-box;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }
    .bot_btn {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .name {
        min-width:80px;
        background: rgba(0, 204, 153, 1);
        color: white;
        font-size: 13px;
        padding: 5px 5px;
        border-radius: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
