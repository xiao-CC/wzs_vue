<template>
  <div id="map-container" ref="mapContainer"></div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // 响应式数据
  const mapContainer = ref(null);
  const map = ref(null);
  const currentLayer = ref(null);
  const geoJSONData = ref(null);

  // 初始化地图
  const initMap = () => {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([43.88, 125.35], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);
    }
  };

  // 加载吉林省地图
  const loadJilinMap = async () => {
    try {
      const jilinGeoJSON = await import('@/assets/吉林省.json');
      geoJSONData.value = jilinGeoJSON;
      
      currentLayer.value = L.geoJSON(geoJSONData.value, {
        style: {
          color: '#3388ff',
          weight: 2,
          fillOpacity: 0.2
        },
        onEachFeature: onEachFeature
      }).addTo(map.value);
    } catch (error) {
      console.error('Failed to load Jilin map:', error);
    }
  };

  // 每个要素的处理
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(feature.properties.name);
      layer.on('click', () => {
        drillDown(feature.properties.name);
      });
    }
  };

  // 下钻到市级地图
  const drillDown = async (cityName) => {
    try {
      const cityGeoJSON = await import(`@/assets/${cityName}.json`);
      if (currentLayer.value) {
        map.value.removeLayer(currentLayer.value);
      }
      
      currentLayer.value = L.geoJSON(cityGeoJSON.default, {
        style: {
          color: '#ff7800',
          weight: 2,
          fillOpacity: 0.4
        },
        onEachFeature: onEachFeature
      }).addTo(map.value);
      
      map.value.fitBounds(currentLayer.value.getBounds());
    } catch (error) {
      console.error('Failed to load city data:', error);
    }
  };

  // 生命周期钩子
  onMounted(() => {
    initMap();
    loadJilinMap();
  });
</script>

<style scoped>
#map-container {
  height: 600px;
  width: 100%;
}
</style>