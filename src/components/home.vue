<template>
  <el-container class="home-container" v-cloak>
    <!-- 左侧导航 -->
    <el-aside class="nav" width="150px">
      <div class="logo">
        <div class="img">
          <img src="@/assets/logo.png" alt="logo" />
        </div>
      </div>

      <el-collapse accordion class="collapse" v-model="activeName">
        <div v-for="(item, index) in navList" :key="index">
          <div
            :name="index"
            v-if="index === 0"
            @click="switchNav(index)"
            :class="['el-collapse-item__header', item.active ? 'active' : '']"
          >{{ item.title }}</div>

          <el-collapse-item v-else :name="index" class="collapse-item" :title="item.title">
            <div
              :class="ite.active ? 'active' : ''"
              @click="switchNav(index, dex)"
              v-for="(ite, dex) in item.nav"
              :key="dex"
            >{{ ite.title }}</div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container>
      <!-- 头部 -->
      <el-header height="60px" class="header">
        <el-row type="flex" justify="space-between">
          <el-col :span="12" class="l-tle">{{ navText }}</el-col>
          <el-col :span="12" class="r-tle">
            <span>{{ name }}</span>
            <span class="quit" @click="quitLogin()">退出登录</span>
          </el-col>
        </el-row>
      </el-header>

      <!-- 内容 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
    <!-- 蒙版 -->
    <div class="mask" v-if="isMask"></div>
  </el-container>
</template>

<script>
import { clearCookie } from "@/common/cookie.js";

export default {
  data() {
    return {
      navText: "" || sessionStorage.getItem("navText"),
      activeName: 0,
      defaultNavList: [],
      navList: [
        {
          title: "首页",
          active: true,
          path: {
            path: "/index"
          }
        },
        // {
        //   title: "城市合伙人管理",
        //   nav: [
        //     {
        //       title: "城市合伙人申请",
        //       active: false,
        //       path: {
        //         path: "/cityPartner_apply"
        //       }
        //     },
        //     {
        //       title: "城市合伙人管理",
        //       active: false,
        //       path: {
        //         path: "/cityPartner_management"
        //       }
        //     },
        //     {
        //       title: "提现申请",
        //       active: false,
        //       path: {
        //         path: "/wishdraw_apply"
        //       }
        //     }
        //   ]
        // },
        {
          title: "商家管理",
          nav: [
            {
              title: "商家分类管理",
              active: false,
              path: {
                path: "/merchantBusinessList"
              }
            },
            {
              title: "申请管理",
              active: false,
              path: {
                path: "/appplicationManagement"
              }
            },
            {
              title: "商户管理",
              active: false,
              path: {
                path: "/businessManagement"
              }
            }
          ]
        },
        {
          title: "用户管理",
          nav: [
            {
              title: "普通会员管理",
              active: false,
              path: {
                path: "/ordinaryMember"
              }
            },
            {
              title: "合伙人管理",
              active: false,
              path: {
                path: "/plusMember"
              }
            },
            {
              title: "钻石合伙人管理",
              active: false,
              path: {
                path: "/diamondPartner"
              }
            },
            {
              title: "会员提现申请",
              active: false,
              path: {
                path: "/withDrawMethods"
              }
            }
          ]
        },
        {
          title: "商品管理",
          nav: [
            {
              title: "商品分类管理",
              active: false,
              path: {
                path: "/goodsClassManage"
              }
            },
            {
              title: "自营商品管理",
              active: false,
              path: {
                path: "/selfGoodsManage"
              }
            },
            {
              title: "商家商品管理",
              active: false,
              path: {
                path: "/businessGoodsManage"
              }
            },
            {
              title: "商家商品审核管理",
              active: false,
              path: {
                path: "/businessGoodsCheck"
              }
            }
          ]
        },
        {
          title: "订单管理",
          nav: [
            {
              title: "自营订单管理",
              active: false,
              path: {
                path: "/selfSupportOrder"
              }
            },
            {
              title: "商家订单管理",
              active: false,
              path: {
                path: "/businessOrder"
              }
            },
            {
              title: "退款订单管理",
              active: false,
              path: {
                path: "/refundOrder"
              }
            }
          ]
        },
        {
          title: "分期购管理",
          nav: [
            {
              title: "分期购申请",
              active: false,
              path: {
                path: "/stagesApply"
              }
            }
          ]
        },
        {
          title: "心愿池管理",
          nav: [
            {
              title: "心愿池管理",
              active: false,
              path: {
                path: "/wishPool_management"
              }
            }
          ]
        },
        {
          title: "奖励金管理",
          nav: [
            {
              title: "奖金管理",
              active: false,
              path: {
                path: "/reward"
              }
            }
          ]
        },
        {
          title: "规则管理",
          nav: [
            {
              title: "会员规则设置",
              active: false,
              path: {
                path: "/setMembershiprules"
              }
            },
            {
              title: "城市合伙人规则设置",
              active: false,
              path: {
                path: "/cityPartner"
              }
            },
            {
              title: "商家规则设置",
              active: false,
              path: {
                path: "/merchantrules"
              }
            },
            // {
            //   title: "利润分成设置",
            //   active: false,
            //   path: {
            //     path: "/profitrules"
            //   }
            // },
            {
              title: "快速分期购设置",
              active: false,
              path: {
                path: "/fastBuy"
              }
            },
            {
              title: "手续费设置",
              active: false,
              path: {
                path: "/cashWithdrawal"
              }
            }
          ]
        },
        {
          title: "充值管理"
          // nav: [
          //   {
          //     title: '用户充值管理',
          //     active: false,
          //     path: {
          //       path: '/userRecharge'
          //     }
          //   },
          //   {
          //     title: '充值设置',
          //     active: false,
          //     path: {
          //       path: '/rechargeSet'
          //     }
          //   }
          // ]
        },
        {
          title: "积分管理",
          nav: [
            {
              title: "种子管理",
              active: false,
              path: {
                path: "/seed_management"
              }
            }
          ]
        },
        {
          title: "营销管理",
          nav: [
            {
              title: "轮播图管理",
              active: false,
              path: {
                path: "/bannerManage"
              }
            },
            {
              title: "电商活动管理",
              active: false,
              path: {
                path: "/activitiesManage"
              }
            },
            {
              title: "FreeBuy活动页",
              active: false,
              path: {
                path: "/freeBuy"
              }
            },
            {
              title: "导航营销",
              active: false,
              path: {
                path: "/navigation"
              }
            },
            {
              title: "公告管理",
              active: false,
              path: {
                path: "/notice"
              }
            }
          ]
        },
        {
          title: "数据统计",
          nav: [
            {
              title: "订单数据统计",
              active: false,
              path: {
                path: "/orderData"
              }
            }
          ]
        },
        {
          title: "内容管理",
          nav: [
            {
              title: "论坛管理",
              active: false,
              path: {
                path: "/forum_management"
              }
            }
          ]
        },
        {
          title: "系统管理",
          nav: [
            // {
            //   title: '物流设置',
            //   active: false,
            //   path: {
            //     path: '/logisticsSet'
            //   }
            // },
            {
              title: "城市区域设置",
              active: false,
              path: {
                path: "/citySet"
              }
            },
            {
              title: "平台介绍页面设置",
              active: false,
              path: {
                path: "/setPlatformIntroduction"
              }
            },
            {
              title: "合伙人页面设置",
              active: false,
              path: {
                path: "/setPartnerPage"
              }
            },
            {
              title: "系统通知",
              active: false,
              path: {
                path: "/systemNotice"
              }
            }
          ]
        }
      ]
    };
  },

  created() {
    this.defaultNav();
    this.$store.commit("showMask", false);
  },

  mounted() {},

  computed: {
    name() {
      return this.$store.state.name;
    },
    isMask() {
      return this.$store.state.isMask;
    }
  },

  watch: {
    $route: "setNavInfo"
  },

  methods: {
    // 深度克隆
    cloneDeep(data) {
      let strData = JSON.stringify(data);

      return JSON.parse(strData);
    },

    // 储存原始导航栏数据
    defaultNav() {
      this.defaultNavList = this.cloneDeep(this.navList);
      this.defaultNavList[0].active = false;

      this.setNavInfo();
    },

    // 设置导航信息
    setNavInfo() {
      let nowPath = this.$route.path;
      let navList = this.cloneDeep(this.defaultNavList);

      if (nowPath === "/index") {
        this.navText = "首页";
        return true;
      } else {
        this.navList.map((item, index) => {
          item.nav &&
            item.nav.map((ite, dex) => {
              if (ite.path !== undefined && ite.path.path === nowPath) {
                this.activeName = index;
                navList[index].nav[dex].active = true;
                this.navText =
                  navList[index].title + "-" + navList[index].nav[dex].title;
                sessionStorage.setItem("navText", this.navText); //添加缓存
              }
            });
        });

        this.navList = navList;
      }
    },

    // 导航切换 (选中栏目)
    switchNav(index, dex = 0) {
      let defaultNavList = this.cloneDeep(this.defaultNavList);
      let href = null;

      if (index === 0) {
        defaultNavList[0].active = true;
        href = defaultNavList[0].path;
      } else {
        defaultNavList[index].nav[dex].active = true;
        href = defaultNavList[index].nav[dex].path;
      }

      this.activeName = index;
      this.navList = defaultNavList;

      this.jump(href);
    },

    // 页面跳转
    jump(path) {
      path && this.$router.push(path);
    },

    // 退出登录
    quitLogin() {
      clearCookie("opadminToken");
      this.$router.replace("/");
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  // 隐藏滚动条 - chrome浏览器
  .nav::-webkit-scrollbar {
    width: 0 !important;
  }
  .nav {
    height: 100vh;
    background: #333333;
    // 隐藏滚动条 - 兼容IE10+
    -ms-overflow-style: none;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 140px;
      background: #000000;

      .img {
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 50%;
        background: #ffffff;

        img {
          display: block;
          width: 100%;
          height: auto;
        }
      }
    }

    .collapse {
      width: 100%;
      height: calc(100% - 140px);
      border: 0;

      /deep/ .el-collapse-item__header {
        color: #ffffff;
        padding-left: 10px;
        border-bottom: 0;
        background: transparent;
      }

      /deep/ .el-collapse-item__wrap {
        border-bottom: 0;
        background: transparent;

        .el-collapse-item__content {
          padding-bottom: 10px;

          div {
            color: #ffffff;
            line-height: 30px;
            padding-left: 20px;
            cursor: pointer;
          }
        }
      }
    }

    .active {
      background: rgba(51, 204, 204, 1) !important;
    }
  }

  .header {
    background: rgba(51, 51, 51, 1);

    .l-tle {
      color: #ffffff;
      font-size: 20px;
      line-height: 60px;
      font-weight: bold;
    }

    .r-tle {
      color: #ffffff;
      font-size: 16px;
      line-height: 60px;
      text-align: right;

      .quit {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }

  .content {
    padding: 0;
  }

  .content::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.mask {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 99;
}
</style>
