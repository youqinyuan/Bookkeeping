<template>
  <div class="container" v-cloak>
    <el-form :model="form" :rules="rules" ref="form" class="form-box">
      <h3 class="tle">登录</h3>

      <el-form-item prop="userName">
        <el-input type="text" maxlength="8" v-model="form.userName" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="userPwd">
        <el-input type="password" maxlength="8" v-model="form.userPwd" placeholder="密码"></el-input>
      </el-form-item>

      <el-checkbox class="rmbPwd" v-model="checked">记住密码</el-checkbox>

      <el-form-item class="clear-margin-bot">
        <el-button class="btn" type="primary" @click="loginFunc" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { userLoginRequest } from "@/network/api";
import { getCookie, setCookie, clearCookie } from "@/common/cookie.js";

export default {
  data() {
    return {
      // 表单数据
      form: {
        userName: "", // 用户名
        userPwd: "" // 密码
      },
      // 表单验证
      rules: {
        // 用户名验证
        userName: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        // 登录密码验证
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      checked: true, // 是否记住密码
      loading: false
    };
  },

  created() {
    document.cookie.split("; ").map(item => {
      if (item.split("=")[0] === "userName") {
        let cookie = getCookie();

        this.form.userName = cookie.userName;
        this.form.userPwd = cookie.userPwd;
      }
    });
  },

  mounted() {
    clearCookie("opadminToken");
  },

  methods: {
    // 登录
    loginFunc() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          this.loginReq();
        }
      });
    },

    // 登录接口调用
    async loginReq() {
      let res = null;
      let loginName = this.form.userName;
      let password = this.form.userPwd;
      let param = {
        loginName,
        password
      };

      res = await userLoginRequest(param);

      if (res.data.messageCode === "MSG_1001") {
        if (this.checked) {
          setCookie("userName", loginName, 7);
          setCookie("userPwd", password, 7);
          this.$store.commit("changeName", res.data.content.name);
        } else {
          clearCookie("userName");
          clearCookie("userPwd");
        }

        this.$router.push({
          name: "Index",
          params: {
            name: res.data.content.name
          }
        });
      } else {
        this.alertTips(res.data.message);
      }

      this.loading = false;
    },

    // 错误提示弹窗
    alertTips(msg) {
      this.$alert(msg, "错误", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: auto;

  .form-box {
    width: 400px;
    height: auto;
    padding: 30px;
    margin: 100px auto 0;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

    .tle {
      display: block;
      width: 100%;
      height: auto;
      font-size: 30px;
      text-align: center;
      margin-bottom: 22px;
    }

    .rmbPwd {
      margin-bottom: 22px;
    }

    .btn {
      display: block;
      width: 100%;
      height: auto;
    }
  }
}

.clear-margin-bot {
  margin-bottom: 0;
}
</style>
