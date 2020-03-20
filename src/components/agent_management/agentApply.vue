<template>
  <div class="agentApply">
    <!-- 上方搜索条件区域 -->
    <div class="searchBox">
      <span>申请人电话：</span>
      <el-input v-model="form.mobileNumber" style="width:140px;margin-right:20px;"></el-input>
      <span>申请时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span style="margin-left:20px;">申请代理区域：</span>
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
        <span>申请状态：</span>
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
        <el-table-column prop="id" label="申请编号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="agentType" label="申请身份" align="center" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.agentType == 1">独家</span>
            <span v-if="scope.row.agentType == 2">非独家</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentApplyTime" label="申请时间" align="center" width="154">
          <template slot-scope="scope">
            <span>{{scope.row.agentApplyTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentArea" label="非独家所属区域" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.agentType == 2">{{scope.row.agentArea}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNumber" label="申请人电话" align="center" width="120"></el-table-column>
        <el-table-column prop="detailedAddress" label="所在地址" align="center"></el-table-column>
        <el-table-column prop="referrerMobileNumber" label="推荐人电话" align="center" width="120"></el-table-column>
        <el-table-column prop="agentArea" label="意向代理区域" align="center"></el-table-column>
        <el-table-column prop="roleName" label="意向代理角色" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:#409EFF">审核中</span>
            <span v-if="scope.row.status == 2" style="color:#409EFF">申请通过</span>
            <el-button
              v-if="scope.row.status == 3"
              type="text"
              style="color:#F56C6C"
              @click="viewRejectionReason(scope.row.refuseReason)"
            >审核拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status != 3"
              @click="openDialog(scope.row.id,scope.row.agentType,scope.row.referrerMobileNumber,scope.row.agentArea,scope.row.agentProvinceId,scope.row.agentCityId,scope.row.agentDistrictId)"
            >通过</el-button>
            <el-button type="text" v-if="scope.row.status != 3" @click="refuse(scope.row.id)">拒绝</el-button>
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
    <!-- 审核通过弹窗 -->
    <auditPassDialog ref="auditPassDialog" @func="getContent"></auditPassDialog>
  </div>
</template>
<script>
import {
  getAllCityData,
  agentApplyList,
  agentApprove,
  agentRefuse,
  exportApplyAgentExcel
} from "@/network/api";
import auditPassDialog from "./auditPassDialog";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 1,
      time: "",
      form: {
        mobileNumber: "",
        beginTime: "",
        endTime: "",
        agentProvinceId: "",
        agentCityId: "",
        agentDistrictId: "",
        agentStatus: ""
      },
      tableData: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "3",
          label: "申请拒绝"
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
      ]
    };
  },
  components: {
    auditPassDialog
  },
  created() {
    // 获取所有城市（省市区）数据
    this.getAllCityList();
    this.search(1);
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
      agentApplyList({ params: form }).then(res => {
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
      exportApplyAgentExcel(form).then(res => {
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
      a.setAttribute("download", "代理商申请列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 点击通过打开代理申请审核通过dialog弹窗
    openDialog(
      id,
      agentType,
      referrerMobileNumber,
      agentArea,
      agentProvinceId,
      agentCityId,
      agentDistrictId
    ) {
      this.$refs.auditPassDialog.open(
        this.cityData,
        this.provinceList,
        id,
        agentType,
        referrerMobileNumber,
        agentArea,
        agentProvinceId,
        agentCityId,
        agentDistrictId
      );
    },
    // 接收审核通过弹窗子组件传递过来的数据
    getContent(data) {
      // console.log("data", data);
      agentApprove(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.$refs.auditPassDialog.close();
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 拒绝
    refuse(id) {
      let that = this;
      this.$prompt("", "代理申请拒绝通过", {
        confirmButtonText: "拒绝",
        showCancelButton: false,
        inputType: "textarea",
        closeOnClickModal: false,
        center: true,
        beforeClose(action, instance, done) {
          if (action == "confirm") {
            let value = instance.inputValue;
            if (value == null || value.trim().length < 2) {
              this.$message.error("拒绝理由最少输入2个字符");
            } else if (value.trim().length > 50) {
              this.$message.error("拒绝理由最多输入50个字符");
            } else {
              console.log(value);
              let data = {
                id: id,
                refuseReason: value
              };
              agentRefuse(data).then(res => {
                if (res.data.messageCode == "MSG_1001") {
                  this.$message.success("操作成功");
                  done();
                  that.search(1);
                } else {
                  this.$message.error(res.data.message);
                }
              });
            }
          } else {
            done();
          }
        }
      })
        .then(() => {})
        .catch(() => {});
    },
    // 查看拒绝原因
    viewRejectionReason(refuseReason) {
      this.$alert(`拒绝理由：${refuseReason}`, "代理申请拒绝通过", {
        showConfirmButton: false,
        center: true,
        callback: action => {}
      });
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
.agentApply {
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