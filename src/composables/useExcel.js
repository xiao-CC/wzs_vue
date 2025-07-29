//excel解析逻辑
import * as XLSX from 'xlsx';
import { ref } from 'vue';
import { useDataStore } from '@/store/dataStore';

export default function useExcelParser() {
  const dataStore = useDataStore();
  
  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // 处理数据
        const processed = processExcelData(jsonData);
        dataStore.setRawData(processed);
        
        resolve(processed);
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // 数据清洗函数
  const processExcelData = (rawData) => {
    return rawData.map(item => ({
      province: item['省份'],
      city: item['城市'],
      value: Number(item['指标值'])
    }));
  };

  return { parseExcel };
}