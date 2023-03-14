<template>
  <PublicCard title="今日销售额" :count="salesToday">
    <template #main>
      <div class="main">
        <div class="item">
          <div>日同比</div>
          <div class="count">{{salesGrowthLastDay}}</div>
          <div class="down"></div>
        </div>
        <div class="item">
          <div>月同比</div>
          <div class="count">{{salesGrowthLastMonth}}</div>
          <div class="up"></div>
        </div>
      </div>
    </template>
    <template #bottom>
      <span class="left">昨日销售额</span>
      <span>{{salesLastDay}}</span>
    </template>
  </PublicCard>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'TodaySale'
  })
</script>
<script lang="ts" setup>
  import {computed} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  // "salesToday": 30346799,
  // "salesLastDay":   36000000,
  // "salesGrowthLastDay": -19.16,
  // "salesGrowthLastMonth": 56.67,
  const salesToday = computed(() => {
    return echartsStore.echartsData.salesToday
  })
  const salesLastDay = computed(() => {
    return echartsStore.echartsData.salesLastDay
  })
  const salesGrowthLastDay = computed(() => {
    return echartsStore.echartsData.salesGrowthLastDay
  })
  const salesGrowthLastMonth = computed(() => {
    return echartsStore.echartsData.salesGrowthLastMonth
  })

</script>

<style lang="scss" scoped>
  .main{
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .item{
      display: flex;
      font-size: 12px;
      color: #aaa;
      font-weight: bold;
      align-items: center;
      .count{
        margin: 0 5px;
      }
    }
  }
</style>
