<template>
  <div id="map-container"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jilinGeoJSON from '@/assets/吉林省.json';

export default {
  data() {
    return {
      map: null,
      currentLayer: null,
      geoJSONData: null
    };
  },
  mounted() {
    this.initMap();
    this.loadJilinMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map-container').setView([43.88, 125.35], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    },
    loadJilinMap() {
      this.geoJSONData = jilinGeoJSON;
      this.currentLayer = L.geoJSON(this.geoJSONData, {
        style: {
          color: '#3388ff',
          weight: 2,
          fillOpacity: 0.2
        },
        onEachFeature: this.onEachFeature
      }).addTo(this.map);
    },
    onEachFeature(feature, layer) {
      if (feature.properties) {
        layer.bindPopup(feature.properties.name);
        layer.on('click', () => {
          this.drillDown(feature.properties.name);
        });
      }
    },
    async drillDown(cityName) {
      try {
        const cityGeoJSON = await import(`@/assets/${cityName}.json`);
        this.map.removeLayer(this.currentLayer);
        
        this.currentLayer = L.geoJSON(cityGeoJSON.default, {
          style: {
            color: '#ff7800',
            weight: 2,
            fillOpacity: 0.4
          },
          onEachFeature: this.onEachFeature
        }).addTo(this.map);
        
        this.map.fitBounds(this.currentLayer.getBounds());
      } catch (error) {
        console.error('Failed to load city data:', error);
      }
    }
  }
};
</script>

<style>
#map-container {
  height: 600px;
  width: 100%;
}
</style>
