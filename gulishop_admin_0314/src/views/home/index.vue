<template>
  <div class="home">
    <TopView />
    <MiddleView />
    <BottomView />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import {onMounted} from 'vue'
import {useEchartsStore} from '@/stores/echarts'
import TopView from './components/TopView/index.vue'
import MiddleView from './components/MiddleView/index.vue'
import BottomView from './components/BottomView/index.vue'


const echartsStore = useEchartsStore()
onMounted(() => {
  echartsStore.getEchartsData()
})


</script>

<style lang="scss" scoped>
  .home{
    padding:20px;
    background-color: #ccc;
  }
</style>
