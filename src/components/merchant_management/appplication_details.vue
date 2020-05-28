<template>
  <div class="contents">
    <div class="title">
      <strong>基本信息:</strong>
    </div>
    <div class="con">
      <ul>
        <li>申请编号：{{content.id}}</li>
        <li>姓名：{{content.name}}</li>
        <li>联系方式：{{content.mobileNumber}}</li>
        <li>店铺名称：{{content.storeName}}</li>
      </ul>
      <ul>
        <li>身份证：{{content.idNumber}}</li>
        <li>分类：{{content.businessName}}</li>
        <li>店铺所在位置：{{content.addressDetail}}</li>
        <li>店铺平均折扣：{{content.onlineRebate}}</li>
      </ul>
      <ul>
        <li>所属代理商：{{content.agentName}}</li>
        <li>来源：{{content.source}}</li>
      </ul>
    </div>
    <div class="title">
      <strong>营业执照:</strong>
    </div>
    <div>
      <el-image
        style="width: 200px; height: 100px;margin:20px 0"
        :src="content.businessLicenseKey"
        fit="contain"
      ></el-image>
    </div>
    <el-button type="primary" @click="pass">通 过</el-button>
    <el-button type="danger" @click="refuse">拒 绝</el-button>
    <el-button type="info" @click="$router.go(-1)">返 回</el-button>
  </div>
</template>

<script>
import { getMerchantDetails, changeAuditStatus } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      content: {}
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getMerchantDetails();
  },
  methods: {
    getMerchantDetails() {
      let parms = {
        id: this.$route.query.id
      };
      getMerchantDetails({ params: parms }).then(res => {
        if (res.data.content) {
          this.content = res.data.content;
        } else {
          this.content = {};
        }
      });
    },
    pass() {
      this.$confirm("生成默认登录密码88888888", "通过申请?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: this.$route.query.id,
            status: 2
          };
          changeAuditStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    refuse() {
      this.$prompt("", "确定拒绝此次申请？", {
        confirmButtonText: "确定",
        cancelButtonText: "点错了",
        confirmButtonClass: "confirmButton",
        cancelButtonClass: "cancelButton",
        inputPlaceholder: "输入拒绝原因：100字以内",
        inputType: "textarea",
        center: true,
        inputPattern: /\S/,
        inputErrorMessage: "原因不能为空"
      })
        .then(({ value }) => {
          let parms = {
            id: row.id,
            status: 3,
            reason: value
          };
          changeAuditStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="less">
.title {
  border-bottom: 1px solid #cccccc;
}
.con {
  display: flex;
  flex-wrap: wrap;
  ul {
    width: 350px;
    li {
      margin: 20px 0;
    }
  }
}
</style>
