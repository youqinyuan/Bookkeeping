<template>
  <div class="cityPartner_apply">
    <!-- 上方搜索条件区域 -->
    <div class="conditionBox">
      <span>申请账号：</span>
      <el-input v-model="mobile" style="width:140px;"></el-input>
      <span style="margin-left:10px;">状态：</span>
      <el-select v-model="status" style="width:100px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:10px;">代理区域：</span>
      <el-select v-model="province" @change="select_province" style="width:100px;">
        <el-option
          v-for="item in provinceList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="city" @change="select_citys" style="width:130px;">
        <el-option v-for="item in cityList" :key="item.id" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="area" @change="select_provinces" style="width:130px;">
        <el-option
          v-for="item in districtList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:10px;">申请时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        start-placeholder="起始时间"
        end-placeholder="截止时间"
        @change="dateChange"
      ></el-date-picker>
      <el-button style="margin-left:10px;" type="primary" @click="search(1)">搜索</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableBox">
      <el-table :data="formData" border ref="multipleTable" style="width: 100%">
        <el-table-column prop="orderNumber" label="申请编号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="姓名" align="center"></el-table-column>
        <el-table-column label="申请时间" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row" :key="index">
              <span>{{item.orderNumber}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="注册账号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="申请账号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="代理区域" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="开户行" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="银行卡号" align="center"></el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderNumber==1">审核中</span>
            <span v-if="scope.row.orderNumber==2">拒绝</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="color:#67C23A" @click="pass(scope.row.id)">通过</el-button>
            <el-button type="text" style="color:#F56C6C" @click="reject(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页和总计 -->
    <div class="totalBox">
      <div class="totalNum">总计：{{pageTotal}}条</div>
      <div class="order-bottom" v-if="formData.length>0">
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="pageTotal"
          :page-size="10"
          :current-page.sync="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllCityData } from "@/network/api";
export default {
  data() {
    return {
      mobile: "",
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
          value: "2",
          label: "拒绝"
        }
      ],
      status: "", // 状态
      cityData: "", // 所有城市数据
      province: "省",
      city: "市",
      area: "区",
      provinceList: [
        // 省份列表
        {
          value: "",
          label: "请选择"
        }
      ],
      cityList: [
        // 城市列表
        {
          value: "",
          label: "请选择"
        }
      ],
      districtList: [
        // 区列表
        {
          value: "",
          label: "请选择"
        }
      ],
      districtId: "",
      time: "",
      startTime: "",
      endTime: "",
      formData: [
        {
          orderNumber: 1
        }
      ],
      pageTotal: 100,
      currentPage: 1
    };
  },
  mounted() {
    this.getAllCityList(); //获取所有城市数据
  },
  methods: {
    search(val) {
      console.log(val);
      console.log(this.mobile);
      console.log(this.status);
      console.log(this.districtId);
      console.log(this.startTime);
      console.log(this.endTime);
    },
    // 获取所有的城市数据
    getAllCityList() {
      getAllCityData().then(res => {
        let data = res.data.content;
        this.cityData = data;
        //获取初始化省份列表
        this.provinceList = data.provinceList.map((val, index) => {
          let json = {};
          json.value = val.id;
          json.label = val.name;
          return json;
        });
      });
    },
    // 选择省份
    select_province(e) {
      this.province = this.cityData.provinceList[e - 1].name;
      this.city = "市";
      this.area = "区";
      this.districtList = "";
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
      this.city = this.cityData.cityList[e - 1].name;
      this.area = "区";
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
      this.districtId = e;
    },

    // 搜索时间改变事件
    dateChange(val) {
      this.startTime = this.getDateShow(val[0]);
      this.endTime = this.getDateShow(val[1]);
    },

    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
    },

    // 通过
    pass(id) {
      console.log(id);
      this.$prompt("", "通过后，该用户成为城市合伙人!", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputPlaceholder: "请输入缴纳押金（元）（必填）",
        inputErrorMessage:
          "仅限数字，不可输入小数，不可小于0，不可大于10000000元"
      })
        .then(({ value }) => {
          if (value > 10000000) {
            this.$message.error("缴纳押金不可大于10000000元");
            return;
          }
        })
        .catch(() => {});
    },

    // 拒绝
    reject(id) {
      console.log(id);
      this.$prompt("", "请输入拒绝原因", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
        inputPlaceholder: "最多输入100字（必填）",
        inputType: "textarea",
        inputPattern: /\S/,
        inputErrorMessage: "理由不能为空"
      })
        .then(({ value }) => {})
        .catch(err => {});
    },

    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.cityPartner_apply {
  padding: 20px;
  box-sizing: border-box;
}
.tableBox {
  margin-top: 40px;
}
.totalBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>