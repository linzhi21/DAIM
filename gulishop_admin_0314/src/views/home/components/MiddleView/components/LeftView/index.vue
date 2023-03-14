<template>
  <div class="leftView">
    <v-chart :option="getOption()" autoresize></v-chart>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'LeftView'
  })
</script>
<script lang="ts" setup>
  import {computed} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'

  const props = defineProps<{
    activeIndex:string
  }>()
  const echartsStore = useEchartsStore()
  // orderFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  // "orderFullYear": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
  // "userFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  // "userFullYear": [110,
  const orderFullYearAxis = computed(() => {
    return echartsStore.echartsData.orderFullYearAxis
  })
  const orderFullYear = computed(() => {
    return echartsStore.echartsData.orderFullYear
  })
  const userFullYearAxis = computed(() => {
    return echartsStore.echartsData.userFullYearAxis
  })
  const userFullYear = computed(() => {
    return echartsStore.echartsData.userFullYear
  })



  const getOption = () => {
    return {
      title:{
        text:props.activeIndex === '1'?'销售趋势':"访问趋势",
        textStyle:{
          fontSize:14
        },
        top:'5%'
      },

      tooltip:{
        trigger:'axis'
      },

      grid:{
        left:40,
        right:40
      },

      xAxis:{
        data:props.activeIndex === '1'?orderFullYearAxis.value:userFullYearAxis.value,
        // boundaryGap:false
        axisTick:{
          alignWithLabel:true
        }
      },

      yAxis:{
        splitLine:{
          lineStyle:{
            type:'dotted'
          }
        }
      },

      series:[
        {
          name:props.activeIndex === '1'?'销售量':"访问量",
          type:'bar',
          barWidth:'35%',
          data:props.activeIndex === '1'?orderFullYear.value:userFullYear.value
        }
      ]

    }
  }

</script>

<style lang="scss" scoped>
  .leftView{
    height: 300px;
  }
</style>
