<template>
  <div class="map-container">
    <div class="map-label" v-if="label">{{ label }}</div>
    <div class="map-view">
      <div id="SelectMapPoint"></div>
      <div class="baiduMap-address" v-if="!immediately">
        <span>定位地址：{{address}}</span>
        <div>
          <a-button v-if="address" @click="onOk">确定</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../config/utils.js";
import { DEFAULT } from "../config/config.js";
export default {
  name: "Map",
  data() {
    return {
      map: null,
      geoc: new BMap.Geocoder(),
      province: "",
      city: "",
      district: "",
      address: "",
      lat: "",
      lng: "",
    };
  },
  props: {
    point: {
      type: Object,
      default: new Object(),
    },
    label: String,
    immediately: {
      default: false,
    },
  },
  methods: {
    renderMap() {
      const mapCenter = DEFAULT.MAP_CENTER;
      const map = new BMap.Map("SelectMapPoint", { enableMapClick: false });
      const lat = this.point.lat || mapCenter.lat;
      const lng = this.point.lng || mapCenter.lng;
      const point = new BMap.Point(lng, lat);
      // 创建点坐标
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom();
      map.addEventListener("click", (e) => {
        this.clickMap(e);
      });
      this.map = map;
    },
    clickMap(e) {
      console.log(e);
      const { map } = this;
      const { lng, lat } = e.point;
      map.clearOverlays();
      let clickPoint = new BMap.Point(lng, lat);
      let marker = new BMap.Marker(clickPoint);
      marker.id = "centerMarker";
      map.addOverlay(marker);
      this.geoc.getLocation(clickPoint, (rs) => {
        let addComp = rs.addressComponents;
        this.province = addComp.province || "";
        this.city = addComp.city || "";
        this.district = addComp.district || "";
        this.address = (addComp.street || "") + (addComp.streetNumber || "");
        this.lat = lat;
        this.lng = lng;

        //2021-07-30 点击地图立即更新页面状态
        if (!this.immediately) return;
        this.onOk();
      });
    },
    onOk() {
      let result = {
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.address,
        lng: this.lng,
        lat: this.lat,
      };
      this.$emit("update:result", result);
    },
    renderUpdateMarker() {
      if (!utils.isEmpty(this.point)) {
        this.map.clearOverlays();
        this.lng = this.point.lng;
        this.lat = this.point.lat;
        this.address = this.point.address;
        let editPoint = new BMap.Point(this.lng, this.lat);
        let editMarker = new BMap.Marker(editPoint);
        editMarker.id = "centerMarker";
        this.map.addOverlay(editMarker);
        this.map.setCenter(editPoint);
      }
    },
  },
  mounted() {
    this.renderMap();
  },
  watch: {
    point(newV) {
      if (newV.lat && newV.lng) {
        this.renderUpdateMarker();
      }
    },
  },
};
</script>

<style scoped>
#SelectMapPoint {
  width: 100%;
  height: calc(100% - 24px);
}
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.map-label {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  padding: 0 4px;
  background: white;
  color: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.map-view {
  position: relative;
  flex: 1;
}
.baiduMap-address {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
</style>