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
      <el-button style="margin-left:10px;" type="primary" @click="search(1)">搜索</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableBox">
      <el-table :data="formData" border ref="multipleTable" style="width: 100%">
        <el-table-column prop="orderNumber" label="城市合伙人" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="姓名" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="申请账号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="代理区域" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="商户数量" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="总计佣金" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="已提现金额" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="剩余佣金" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="color:#F56C6C" @click="freeze(scope.row.id)">冻结</el-button>
            <el-button type="text" style="color:#67C23A" @click="thaw(scope.row.id)">解冻</el-button>
            <el-button type="text" @click="seeDetail(scope.row.id)">查看详情</el-button>
            <el-button type="text" @click="loss(scope.row.id)">流失</el-button>
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

    // 冻结
    freeze(id) {
      console.log(id);
      this.$prompt(
        "请输入冻结原因",
        "冻结此城市合伙人后无法登陆城市合伙人系统！",
        {
          confirmButtonText: "确定",
          cancelButtonText: "点错了",
          showClose: false,
          center: true,
          inputPlaceholder: "最多输入100字",
          inputType: "textarea",
          inputPattern: /\S/,
          inputErrorMessage: "理由不能为空"
        }
      )
        .then(({ value }) => {})
        .catch(err => {});
    },

    // 解冻
    thaw(id) {
      this.$confirm("解冻后，城市合伙人账号恢复正常!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(id);
        })
        .catch(() => {});
    },

    // 查看详情
    seeDetail(id) {
      console.log(id);
      this.$router.push({
        path: "/cityPartner_detail",
        query: {
          id: id
        }
      });
    },

    // 流失
    loss(id) {
      console.log(id);
      this.$prompt("该账号不可再次申请成为城市合伙人！", "确认流失吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
        inputPlaceholder: "输入备注（最多输入100字符）",
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