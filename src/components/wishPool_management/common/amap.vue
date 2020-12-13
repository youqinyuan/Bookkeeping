<!--
  描述：拖放地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  示例：
    <mapDrag lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
  <div class="m-map">
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>

<script>
import remoteLoad from "@/common/remoteLoad.js";
var MapKey = "51f95cc546d1a82f369f8d58642c96aa"; //高德地图秘钥
var MapCityName = "";
export default {
  props: ["lat", "lng"],
  data() {
    return {
      AMapUI: null,
      AMap: null
    };
  },
  watch: {},
  methods: {
    // 实例化地图
    initMap() {
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let mapConfig = {
          zoom: 16,
          cityName: MapCityName
        };
        if (this.lat && this.lng) {
          mapConfig.center = [this.lng, this.lat];
        }
        let map = new AMap.Map("js-container", mapConfig);
        // 创建一个 Marker 实例：
        let marker = new AMap.Marker({
          position: new AMap.LngLat(this.lng, this.lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        // 将创建的点标记添加到已有的地图实例：
        map.add(marker);
      });
    }
  },
  async created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`https://webapi.amap.com/maps?v=1.3&key=${MapKey}`);
      await remoteLoad("https://webapi.amap.com/ui/1.0/main.js");
      this.initMap();
    }
  }
};
</script>

<style lang="less" scoped>
.m-map {
  min-width: 500px;
  min-height: 200px;
  position: relative;
}
.m-map .map {
  width: 100%;
  height: 100%;
}
</style>

