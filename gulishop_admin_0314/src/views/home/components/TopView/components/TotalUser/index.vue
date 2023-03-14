<template>
  <PublicCard title="累积用户数" :count="usersTotal">
    <template #main>
      <v-chart :option="getOption()" autoresize></v-chart>
    </template>

    <template #bottom>
     <div class="bottom">
        <div class="item">
          <div>日同比</div>
          <div class="count">{{userGrowthLastDay}}</div>
          <div class="up"></div>
        </div>
        <div class="item">
          <div>月同比</div>
          <div class="count">{{userGrowthLastMonth}}</div>
          <div class="down"></div>
        </div>
     </div>
    </template>
  </PublicCard>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'TotalUser'
  })
</script>
<script lang="ts" setup>
  import {computed} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'
  const echartsStore = useEchartsStore()

  const usersTotal = computed(() => {
    return echartsStore.echartsData.usersTotal
  })
  const usersLastDay = computed(() => {
    return echartsStore.echartsData.usersLastDay
  })
  const usersLastMonth = computed(() => {
    return echartsStore.echartsData.usersLastMonth
  })
  const userGrowthLastDay = computed(() => {
    return echartsStore.echartsData.userGrowthLastDay
  })
  const userGrowthLastMonth = computed(() => {
    return echartsStore.echartsData.userGrowthLastMonth
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
      type:'value',
      show:false, //是否隐藏x轴
      min:0,
      max:usersTotal.value
    },
    yAxis: {
      type:'category',
      show: false
    },
    series: [
      {
        name: '当月增长量',
        type: 'bar',
        data: [usersTotal.value - usersLastMonth.value],
        barWidth:'30%',
        color:'red',
        showBackground:true,  //显示背景
        label:{
          // 配置显示的文字
          show:true,
          formatter(){
            return '|'
          },
          position:'right',
          color:'red',
          distance:100
        }
      }
    ]
  }
}

</script>

<style lang="scss" scoped>
  .bottom{
    display: flex;
    justify-content: space-between;
    .item{
      display: flex;
      align-items: center;
      .count{
        margin: 0 5px;
      }
    }
  }
</style>
