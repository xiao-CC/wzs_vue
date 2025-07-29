//地图图标组件
<template>
    <div ref="chartEl" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import * as echarts from 'echarts';
  import { useMapStore } from '@/store/mapStore';
  
  const props = defineProps(['mapData']);
  const chartEl = ref(null);
  let chartInstance = null;
  const mapStore = useMapStore();
  
  // 初始化图表
  const initChart = () => {
    chartInstance = echarts.init(chartEl.value);
    updateChart();
  };
  
  // 更新图表配置
  const updateChart = () => {
    const option = {
      tooltip: { trigger: 'item' },
      visualMap: {
        min: 0,
        max: 10000,
        text: ['High', 'Low'],
        calculable: true
      },
      series: [{
        name: '数据',
        type: 'map',
        map: mapStore.currentRegion,
        roam: true,
        data: props.mapData,
        emphasis: { label: { show: true }},
        selectedMode: false
      }]
    };
    
    chartInstance.setOption(option);
    
    // 添加点击下钻事件
    chartInstance.on('click', params => {
      if (mapStore.currentLevel === 'country') {
        mapStore.drillDown(params.name, 'province');
      } else if (mapStore.currentLevel === 'province') {
        mapStore.drillDown(params.name, 'city');
      }
    });
  };
  
  watch(() => mapStore.geoJson, () => {
    if (!chartInstance) return;
    
    // 注销旧地图
    echarts.unregisterMap(mapStore.currentRegion);
    
    // 注册新地图
    echarts.registerMap(mapStore.currentRegion, mapStore.geoJson);
    updateChart();
  });
  
  onMounted(initChart);
  </script>