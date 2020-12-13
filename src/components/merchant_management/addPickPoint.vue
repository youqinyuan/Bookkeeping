<template>
  <div class="addPickPoint">
    <h3>设置自提点</h3>
    <div style="margin-top:40px;">
      <span>所在区域：</span>
      <el-select
        v-model="province"
        placeholder="请选择"
        @change="select_province"
        style="width:160px;"
      >
        <el-option
          v-for="item in provinceList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="city" placeholder="请选择" @change="select_citys" style="width:160px;">
        <el-option v-for="item in cityList" :key="item.id" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="area" placeholder="请选择" @change="select_provinces" style="width:160px;">
        <el-option
          v-for="item in districtList"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div style="margin-top:40px;">
      <span>店铺地址：</span>
      <el-input v-model="form.storeAddress" style="width:500px;" readonly></el-input>
    </div>
    <!-- 高德地图组件 -->
    <amap
      @drag="dragMap"
      :lat="form.lat"
      :lng="form.lng"
      style="width:600px;height:600px;margin-top:20px;"
      v-if="flag"
    ></amap>
    <div style="margin-top:40px;">
      <span>详细地址：</span>
      <el-input v-model="form.addressDetail" style="width:500px;"></el-input>
    </div>
    <div style="margin-top:40px;">
      <span>联系方式：</span>
      <el-input v-model="form.phone" style="width:500px;" :maxlength="11"></el-input>
    </div>
    <div style="margin-top:40px;display:flex;align-items:center;">
      <span>营业时间：</span>
      <div v-for="(item,index) in week" :key="index">
        <span v-if="item == '1'">周一&nbsp;&nbsp;</span>
        <span v-if="item == '2'">周二&nbsp;&nbsp;</span>
        <span v-if="item == '3'">周三&nbsp;&nbsp;</span>
        <span v-if="item == '4'">周四&nbsp;&nbsp;</span>
        <span v-if="item == '5'">周五&nbsp;&nbsp;</span>
        <span v-if="item == '6'">周六&nbsp;&nbsp;</span>
        <span v-if="item == '7'">周日&nbsp;&nbsp;</span>
      </div>
      <el-button type="text" @click="dialog = true">编辑</el-button>
    </div>
    <el-button type="primary" style="margin-top:40px;width:100px;" @click="addPickupPoint">保存</el-button>
    <!-- 设置自提点营业时间 -->
    <el-dialog title="设置自提点营业时间" :visible.sync="dialog" center width="440px">
      <el-checkbox-group v-model="week" size="small" @change="selectWeek">
        <el-checkbox-button label="1">周一</el-checkbox-button>
        <el-checkbox-button label="2">周二</el-checkbox-button>
        <el-checkbox-button label="3">周三</el-checkbox-button>
        <el-checkbox-button label="4">周四</el-checkbox-button>
        <el-checkbox-button label="5">周五</el-checkbox-button>
        <el-checkbox-button label="6">周六</el-checkbox-button>
        <el-checkbox-button label="7">周日</el-checkbox-button>
      </el-checkbox-group>
      <el-divider></el-divider>
      <div
        v-for="(item,index) in form.hours"
        :key="index"
        style="width:100%;margin-top:20px;display:flex;justify-content:center;align-items:center;"
      >
        <span v-if="item.day == '1'">周一（0~24:00）</span>
        <span v-if="item.day == '2'">周二（0~24:00）</span>
        <span v-if="item.day == '3'">周三（0~24:00）</span>
        <span v-if="item.day == '4'">周四（0~24:00）</span>
        <span v-if="item.day == '5'">周五（0~24:00）</span>
        <span v-if="item.day == '6'">周六（0~24:00）</span>
        <span v-if="item.day == '7'">周日（0~24:00）</span>
        <el-time-picker
          v-model="item.openTime"
          size="small"
          style="width:120px;"
          format="HH:mm"
          :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
          placeholder="开始时间"
        ></el-time-picker>
        <span>&nbsp;&nbsp;~&nbsp;&nbsp;</span>
        <el-time-picker
          v-model="item.closeTime"
          size="small"
          style="width:120px;"
          format="HH:mm"
          :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
          placeholder="结束时间"
        ></el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="dialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialog = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addPickupPoint,
  getAllCityData,
  getMerchantPickPointById
} from "@/network/api";
import amap from "./common/amap";
export default {
  data() {
    return {
      flag: false, // 控制地图组件是否显示
      dialog: false,
      id: "", // 商户id
      storeId: "", //店铺id
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
      form: {
        storeId: "",
        areaId: "",
        storeAddress: "",
        addressDetail: "",
        lng: "",
        lat: "",
        phone: "",
        hours: []
      },
      week: [],
      name: ""
    };
  },
  components: {
    amap
  },
  created() {
    let type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.getAllCityList();
    if (type == 1) {
      // 新建
      this.form.storeId = this.$route.query.storeId;
      this.flag = true;
    } else {
      // 编辑查看
      this.getMerchantPickPointById();
    }
  },
  methods: {
    // 获取自提点详情
    getMerchantPickPointById() {
      let parms = {
        id: this.id
      };
      getMerchantPickPointById({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let form = res.data.content;
          let areaName = form.areaName.split("-");
          this.province = areaName[0];
          this.city = areaName[1];
          this.area = areaName[2];
          form.hours.forEach(val => {
            this.week.push(val.day);
            val.openTime = new Date(
              "",
              "",
              "",
              (val.openTime - (val.openTime % 60)) / 60,
              val.openTime % 60,
              ""
            );
            val.closeTime = new Date(
              "",
              "",
              "",
              (val.closeTime - (val.closeTime % 60)) / 60,
              val.closeTime % 60,
              ""
            );
          });
          this.form = form;
          this.flag = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
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
        //获取初始化城市列表
        let provinceId = data.provinceList.filter((val, index) => {
          return val.name == this.province;
        });
        if (provinceId.length > 0) {
          let city = data.cityList.filter(val => {
            return val.provinceId == provinceId[0].id;
          });
          this.cityList = city.map(val => {
            let json = {};
            json.value = val.id;
            json.label = val.name;
            return json;
          });
        }
        // 获取初始化区列表
        let cityId = data.cityList.filter((val, index) => {
          return val.name == this.city;
        });
        if (cityId.length > 0) {
          let area = data.districtList.filter(val => {
            return val.cityId == cityId[0].id;
          });
          this.districtList = area.map(val => {
            let json = {};
            json.value = val.id;
            json.label = val.name;
            return json;
          });
        }
      });
    },
    // 选择省份
    select_province(e) {
      this.provinceList.forEach(val => {
        if (val.value == e) {
          this.province = val.label;
        }
      });
      this.city = "";
      this.area = "";
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
        }
      });
      this.area = "";
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
      this.form.areaId = e;
    },
    // 地图选点
    dragMap(data) {
      console.log(data);
      let address = data.regeocode.aois[0];
      this.form.storeAddress = address.name;
      this.form.lng = address.location.lng;
      this.form.lat = address.location.lat;
    },
    // 选择星期
    selectWeek(val) {
      let temparr = JSON.parse(JSON.stringify(this.form.hours));
      let arr = [];
      temparr.forEach(val => {
        arr.push(val.day);
      });
      this.form.hours = [];
      val.forEach(item => {
        let index = arr.indexOf(item);
        if (index == -1) {
          this.form.hours.push({
            merchantId: this.id,
            day: item,
            openTime: "",
            businessType: 4,
            closeTime: ""
          });
        } else {
          this.form.hours.push(temparr[index]);
        }
      });
    },
    // 新增自提点保存
    addPickupPoint() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (!form.areaId) {
        this.$message.error("请选择所在区域");
        return;
      }
      form.hours.forEach(val => {
        val.openTime =
          new Date(val.openTime).getHours() * 60 +
          new Date(val.openTime).getMinutes();
        val.closeTime =
          new Date(val.closeTime).getHours() * 60 +
          new Date(val.closeTime).getMinutes();
      });
      addPickupPoint(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("添加成功");
          this.$router.go("-1");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.addPickPoint {
  padding: 40px;
  box-sizing: border-box;
}
</style>