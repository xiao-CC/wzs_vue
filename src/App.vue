<template>
  <MapChart />
</template>

<script>
import MapChart from './components/MapChart.vue';

export default {
  name: 'App',//app.vue的组件名
  components: { //注册叶子组件
    MapChart
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
