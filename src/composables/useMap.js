//地图下钻逻辑
import { ref, computed } from 'vue';
import { useMapStore } from '@/store/mapStore';
import { loadGeoJSON } from '@/utils/mapHelper';

export default function useMapDrilldown() {
  const mapStore = useMapStore();
  
  // 下钻到指定层级
  const drillDown = async (regionName, level) => {
    // 加载对应层级GeoJSON
    const geoJson = await loadGeoJSON(level, regionName);
    mapStore.updateMapConfig({
      level,
      currentRegion: regionName,
      geoJson
    });
    
    // 更新图表数据
    updateChartData(regionName, level);
  };

  // 返回上级
  const drillUp = () => {
    if (mapStore.currentLevel === 'city') {
      drillDown(mapStore.currentProvince, 'province');
    } else if (mapStore.currentLevel === 'province') {
      drillDown('china', 'country');
    }
  };

  return { drillDown, drillUp };
}