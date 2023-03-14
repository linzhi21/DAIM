<template>
  <PublicCard title="交易用户数" :count="orderUser">
    <template #main>
      <v-chart :option="getOption()" autoresize></v-chart>
    </template>

    <template #bottom>
      <span class="left">退货率</span>
      <span>{{returnRate}}</span>
    </template>
  </PublicCard>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'TradeUser'
  })
</script>
<script lang="ts" setup>
  import {computed} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  const orderUser = computed(() => {
    return echartsStore.echartsData.orderUser
  })
  const returnRate = computed(() => {
    return echartsStore.echartsData.returnRate
  })
  const orderUserTrend = computed(() => {
    return echartsStore.echartsData.orderUserTrend
  })
  const orderUserTrendAxis = computed(() => {
    return echartsStore.echartsData.orderUserTrendAxis
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
      data: orderUserTrendAxis.value,
      show:false, //是否隐藏x轴
      // boundaryGap: false
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name: '交易用户数',
        type: 'bar',
        data: orderUserTrend.value,
        barWidth:'60%'
      }
    ]
  }
}

</script>

<style lang="less" scoped>
</style>
