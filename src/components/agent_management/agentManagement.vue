<template>
  <div class="agentManagement">
    <!-- 上方搜索条件区域 -->
    <div class="searchBox">
      <span>代理商电话：</span>
      <el-input v-model="form.mobileNumber" style="width:140px;margin-right:20px;"></el-input>
      <span>成为代理商时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span style="margin-left:20px;">代理区域：</span>
      <el-select
        v-model="province"
        placeholder="请选择"
        @change="select_province"
        style="width:120px;"
        size="small"
      >
        <el-option
          v-for="item in provinceList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="city"
        placeholder="请选择"
        @change="select_citys"
        style="width:120px;"
        size="small"
      >
        <el-option v-for="item in cityList" :key="item.id" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select
        v-model="area"
        placeholder="请选择"
        @change="select_provinces"
        style="width:120px;"
        size="small"
      >
        <el-option
          v-for="item in districtList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div style="margin-top:20px;">
        <span>代理商角色：</span>
        <el-select v-model="form.agentRoleId" style="width:160px;">
          <el-option
            v-for="item in agentRoles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span style="margin-left:20px;">状态：</span>
        <el-select v-model="form.agentStatus" style="width:130px;margin-right:20px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="search(1)">搜索</el-button>
        <el-button type="primary" @click="exportSearchContent">导出查询内容</el-button>
      </div>
    </div>
    <!-- 下方表格区域 -->
    <div class="tableBox">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="代理商编号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="roleName" label="代理商角色" align="center"></el-table-column>
        <el-table-column prop="agentType" label="代理商身份" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.agentType == 1">独家</span>
            <span v-if="scope.row.agentType == 2">非独家</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNumber" label="代理商电话" align="center" width="120"></el-table-column>
        <el-table-column prop="agentBeginTime" label="成为代理商时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.agentBeginTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentEndTime" label="到期时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.agentEndTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentArea" label="代理区域" align="center"></el-table-column>
        <el-table-column prop="referrerMobileNumber" label="推荐人电话" align="center" width="120"></el-table-column>
        <el-table-column prop="balance" label="余额（元）" align="center"></el-table-column>
        <el-table-column prop="merchantCount" label="发展商家数量" align="center"></el-table-column>
        <el-table-column prop="agentUserCount" label="发展代理数量" align="center"></el-table-column>
        <el-table-column prop="diamondCount" label="发展钻石合伙人数量" align="center"></el-table-column>
        <el-table-column prop="userCount" label="发展用户数量" align="center"></el-table-column>
        <el-table-column prop="userProfitCount" label="C端收益总和（元）" align="center"></el-table-column>
        <el-table-column prop="merchantProfitCount" label="B端收益总和（元）" align="center"></el-table-column>
        <el-table-column prop="agentProfitCount" label="发展代理商收益总和（元）" align="center"></el-table-column>
        <el-table-column prop="totalWithdrawCount" label="总计提现金额（元）" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 5" style="color:#F56C6C">冻结</span>
            <span v-if="scope.row.status == 4" style="color:#67C23A">到期</span>
            <span v-if="scope.row.status == 2" style="color:#409EFF">正常状态</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status != 5" @click="frozen(scope.row.id)">冻结</el-button>
            <el-button type="text" v-if="scope.row.status == 5" @click="thaw(scope.row.id)">解冻</el-button>
            <el-button
              type="text"
              v-if="scope.row.status != 5"
              @click="openDialogRenew(scope.row.agentRoleId,scope.row.id)"
            >续费</el-button>
            <el-button
              type="text"
              v-if="scope.row.status != 5"
              @click="rechargePassword(scope.row.id)"
            >重置密码</el-button>
            <el-button
              type="text"
              v-if="scope.row.status != 5"
              @click="openDialogBalance(scope.row.id,scope.row.balance)"
            >增减余额</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="totalSizeBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 续费弹窗 -->
    <el-dialog title :visible.sync="dialogRenew" width="450px" center :close-on-click-modal="false">
      <el-form :model="renewData" label-position="left">
        <el-form-item label="代理商角色名称：" label-width="130px">
          <el-input v-model="renewData.roleName" style="width:240px;" :maxlength="10" disabled></el-input>
        </el-form-item>
        <el-form-item label="代理身份：" label-width="90px">
          <span v-if="renewData.category == 1">独家</span>
          <span v-if="renewData.category == 2">非独家</span>
        </el-form-item>
        <el-form-item label="收费金额：" label-width="90px">
          <el-input v-model="renewData.price" style="width:120px;" disabled></el-input>&nbsp;&nbsp;万
        </el-form-item>
        <el-form-item label="期限：" label-width="60px">
          <el-input v-model="renewData.term" style="width:120px;" disabled></el-input>&nbsp;&nbsp;年
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="renew">确认续费</el-button>
      </div>
    </el-dialog>
    <!-- 增减余额弹窗 -->
    <el-dialog
      title
      :visible.sync="dialogBalance"
      width="440px"
      center
      :close-on-click-modal="false"
    >
      <el-form :model="balanceData">
        <el-form-item label-width="6px">
          <el-radio-group v-model="balanceData.adjustmentType">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="2">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="输入金额：" label-width="90px">
          <el-input v-model="balanceData.amount" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="输入备注：" label-width="90px">
          <el-input type="textarea" v-model="balanceData.desc" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrReduceBalance">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllCityData,
  agentAgents,
  exportAgentExcel,
  agentFreeze,
  agentUnfreeze,
  agentResetPassword,
  agentBalance,
  agentRoleById,
  agentRenew,
  agentRole
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 1,
      time: "",
      id: "",
      form: {
        mobileNumber: "",
        agentRoleId: "",
        beginTime: "",
        endTime: "",
        agentProvinceId: "",
        agentCityId: "",
        agentDistrictId: "",
        agentStatus: ""
      },
      tableData: [],
      agentRoles: [
        {
          value: "",
          label: "全部"
        }
      ],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "正常"
        },
        {
          value: "5",
          label: "冻结"
        },
        {
          value: "4",
          label: "到期"
        }
      ],
      cityData: "", // 所有的省市区
      province: "省",
      city: "市",
      area: "区",
      provinceList: [
        // 省份列表
        {
          value: "",
          label: ""
        }
      ],
      cityList: [
        // 城市列表
        {
          value: "",
          label: ""
        }
      ],
      districtList: [
        // 区列表
        {
          value: "",
          label: ""
        }
      ],
      dialogBalance: false, // 是否显示增减余额弹窗
      balanceData: { id: "", adjustmentType: 1, amount: "", desc: "" }, // 增减余额表单数据
      dialogRenew: false, // 是否显示续费弹窗
      renewData: {
        // 续费表单数据
        roleName: "",
        price: "",
        category: "",
        term: ""
      },
      balance: "" //代理商余额
    };
  },
  created() {
    // 获取所有城市（省市区）数据
    this.getAllCityList();
    this.search(1);
    this.agentRole();
  },
  methods: {
    // 搜索
    search(val) {
      let form = JSON.parse(JSON.stringify(this.form));
      form.pageNumber = val;
      form.pageSize = 10;
      if (this.time) {
        form.beginTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.beginTime = "";
        form.endTime = "";
      }
      agentAgents({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.tableData = data.items;
          this.totalSize = data.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取代理商角色
    agentRole() {
      let parms = {
        category: ""
      };
      agentRole({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          data.forEach(val => {
            let json = {};
            json.value = val.id;
            json.label = val.roleName;
            this.agentRoles.push(json);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出查询内容
    exportSearchContent() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (this.time) {
        form.beginTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.beginTime = "";
        form.endTime = "";
      }
      exportAgentExcel(form).then(res => {
        console.log(res);
        this.download(res);
      });
    },
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "代理商管理列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 冻结
    frozen(id) {
      this.$confirm("确认冻结吗？冻结后该代理商不可登录后台", "", {
        confirmButtonText: "确认",
        center: true,
        showCancelButton: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          agentFreeze(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("冻结成功");
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 解冻
    thaw(id) {
      let parms = {
        id: id
      };
      agentUnfreeze(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("解冻成功");
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开续费弹窗
    openDialogRenew(agentRoleId, id) {
      let data = {
        id: agentRoleId
      };
      this.id = id;
      agentRoleById({ params: data }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          console.log(res.data.content);
          this.renewData = res.data.content;
          this.dialogRenew = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确认续费
    renew() {
      let data = {
        id: this.id
      };
      agentRenew(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.dialogRenew = false;
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 重置密码
    rechargePassword(id) {
      this.$confirm("重置后代理商登录后台密码变为88888888", "", {
        confirmButtonText: "确认",
        center: true,
        showCancelButton: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          agentResetPassword(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 打开增减余额弹窗
    openDialogBalance(id, balance) {
      this.dialogBalance = true;
      this.balanceData.id = id;
      this.balance = balance;
      this.balanceData.amount = "";
      this.balanceData.desc = "";
    },
    // 增加或者减少余额
    addOrReduceBalance() {
      let data = this.balanceData;
      let a = /^-?\d+(\.\d{1,2})?$/;
      if (!data.amount) {
        this.$message.error("请输入金额");
      } else if (!data.desc) {
        this.$message.error("请输入备注");
      } else if (
        data.amount < 0 ||
        data.amount > 100000000 ||
        !a.test(data.amount)
      ) {
        this.$message.error(
          "金额仅限数字，可输入小数（2位），不可小于0不可大于100000000"
        );
      } else if (data.adjustmentType == 2 && this.balance < data.amount) {
        this.$message.error("代理商余额不足！");
      } else if (data.desc.length > 50) {
        this.$message.error("备注字符数量不可大于50");
      } else {
        agentBalance(data).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message.success("操作成功");
            this.dialogBalance = false;
            this.search(1);
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },
    // 获取所有的城市数据
    getAllCityList() {
      getAllCityData().then(res => {
        let data = res.data.content;
        this.cityData = data;
        // 获取初始化省份列表
        this.provinceList = data.provinceList.map((val, index) => {
          let json = {};
          json.value = val.id;
          json.label = val.name;
          return json;
        });
        this.provinceList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    // 选择省份
    select_province(e) {
      this.city = "市";
      this.area = "区";
      this.form.agentCityId = "";
      this.form.agentDistrictId = "";
      if (!e) {
        this.form.agentProvinceId = "";
        this.cityList = "";
        this.districtList = "";
        return;
      }
      this.provinceList.forEach(val => {
        if (val.value == e) {
          this.province = val.label;
          this.form.agentProvinceId = e;
        }
      });
      let city = this.cityData.cityList.filter(val => {
        return val.provinceId == e;
      });
      this.cityList = city.map(val => {
        let json = {};
        json.value = val.id;
        json.label = val.name;
        return json;
      });
    },
    // 选择城市
    select_citys(e) {
      this.cityList.forEach(val => {
        if (val.value == e) {
          this.city = val.label;
          this.form.agentCityId = e;
        }
      });
      this.area = "区";
      this.form.agentDistrictId = "";
      let districtList = this.cityData.districtList.filter(val => {
        return val.cityId == e;
      });
      this.districtList = districtList.map(val => {
        let json = {};
        json.value = val.id;
        json.label = val.name;
        return json;
      });
    },
    // 选择区
    select_provinces(e) {
      for (let item of this.districtList) {
        if (item.value == e) {
          this.area = item.label;
        }
      }
      this.form.agentDistrictId = e;
    }
  }
};
</script>
<style lang="less" scoped>
.agentManagement {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 20px;
  }
  .totalSizeBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
}
</style>