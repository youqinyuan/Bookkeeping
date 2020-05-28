<template>
  <div class="auditPassDialog">
    <el-dialog
      title="代理申请审核通过"
      :visible.sync="centerDialogVisible"
      width="520px"
      center
      :close-on-click-modal="false"
    >
      <div>
        <span>选择角色：</span>
        <el-select v-model="form.roleId" style="width:250px;" size="small">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;">
        <span>选择代理区域：</span>
        <el-select
          v-model="province"
          placeholder="请选择"
          @change="select_province"
          style="width:120px;"
          size="small"
          :disabled="form.agentType == 2"
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
          :disabled="form.agentType == 2"
        >
          <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="area"
          placeholder="请选择"
          @change="select_provinces"
          style="width:120px;"
          size="small"
          :disabled="form.agentType == 2"
        >
          <el-option
            v-for="item in districtList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px">
        <span>推荐人：</span>
        <el-input v-model="recommender" style="width:240px;" size="small" :disabled="true"></el-input>
      </div>
      <div
        style="margin-top:30px;font-size:12px;color:#F56C6C"
      >注意：通过后代理商所留电话将成为登录账号，所有代理商初始密码为88888888</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { agentRole } from "@/network/api";
export default {
  data() {
    return {
      centerDialogVisible: false,
      form: {
        id: "",
        agentType: "",
        agentProvinceId: "",
        agentCityId: "",
        agentDistrictId: "",
        roleId: "" //角色
      },
      recommender: "", //推荐人
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
      options1: []
    };
  },
  methods: {
    // 获取代理角色
    agentRole(category) {
      let parms = {
        category: category
      };
      agentRole({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.options1 = [];
          data.forEach(val => {
            let json = {};
            json.value = val.id;
            json.label = val.roleName;
            this.options1.push(json);
          });
          this.centerDialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开弹窗
    open(
      cityData,
      provinceList,
      id,
      agentType,
      referrerMobileNumber,
      agentArea,
      agentProvinceId,
      agentCityId,
      agentDistrictId
    ) {
      // cityData:通过父组件传递过来的所有的城市数据
      // provinceList:通过父组件传递过来的所有的省份数据
      // id:代理商ID
      // agentType:代理类型 1-独家代理 2-非独家代理
      // referrerMobileNumber：推荐人电话
      // agentArea:意向代理区域
      // agentProvinceId：省id
      // agentCityId：市id
      // agentDistrictId:区id
      this.cityData = cityData;
      let data = JSON.parse(JSON.stringify(provinceList));
      data.shift(); // 去掉省份数据的第一项（全部）
      this.provinceList = data;
      this.form.id = id;
      this.form.agentType = agentType;
      this.form.agentProvinceId = agentProvinceId;
      this.form.agentCityId = agentCityId;
      this.form.agentDistrictId = agentDistrictId;
      this.recommender = referrerMobileNumber;
      let a = agentArea.split("-");
      this.province = a[0];
      this.city = a[1];
      this.area = a[2];
      this.agentRole(agentType);
    },
    // 关闭弹窗
    close() {
      this.centerDialogVisible = false;
    },
    // 点击通过按钮 传递数据给父组件
    pass() {
      this.$emit("func", this.form);
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
</style>