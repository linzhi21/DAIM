<template>
  <PublicCard title="今日订单" :count="orderToday">
    <template #main>
      <div class="main" ref="divRef"></div>
    </template>

    <template #bottom>
      <span class="left">昨日订单量</span>
      <span>{{orderLastDay}}</span>
    </template>
  </PublicCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TodayOrder'
})
</script>
<script lang="ts" setup>
import { useEchartsStore } from '@/stores/echarts'
import { computed, onMounted, ref, watch,onBeforeUnmount } from 'vue'
import { $echarts } from '@/plugins/echarts'
import debounce from 'lodash/debounce'


const echartsStore = useEchartsStore()
// "orderToday": 2562061,
// "orderLastDay": 2100000,
// "orderTrend": [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530, 220],
// "orderTrendAxis": ["00:00", "
const orderToday = computed(() => {
  return echartsStore.echartsData.orderToday
})
const orderLastDay = computed(() => {
  return echartsStore.echartsData.orderLastDay
})
const orderTrend = computed(() => {
  return echartsStore.echartsData.orderTrend
})
const orderTrendAxis = computed(() => {
  return echartsStore.echartsData.orderTrendAxis
})

// vue3不能写响应式数据，写了tooltip会出问题，trigger:'axis'会有问题
// trigger:'item'没问题
let chart: $echarts.ECharts
const divRef = ref()
// 第一次挂载完成后，创建echarts实例
// 通过echarts实例去配置option

const chartResize = debounce(() => {
  chart.resize()
},100) 

onMounted(() => {
  chart = $echarts.init(divRef.value as HTMLDivElement)
  chart.setOption(getOption())

  // 当窗口发生改变，需要自适应
  window.addEventListener('resize', chartResize)
})

onBeforeUnmount(() => {
  // 解绑自适应的事件
  window.removeEventListener('resize', chartResize)
})


// 数据回来后，再次设置option
watch(orderToday, () => {
  chart.setOption(getOption())
})

const getOption = () => {
  return {
    tooltip: {
      trigger: 'axis'
    },

    // 网格
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },

    xAxis: {
      data: orderTrendAxis.value,
      // show:false, //是否隐藏x轴
      boundaryGap: false
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name: '今日订单',
        type: 'line',
        smooth: true,
        data: orderTrend.value,
        lineStyle: {
          opacity: 0
        },
        itemStyle: {
          opacity: 0
        },
        areaStyle: {
          color: 'hotpink'
        }
      }
    ]
  }
}




</script>

<style lang="scss" scoped>
.main {
  height: 50px
}
</style>
