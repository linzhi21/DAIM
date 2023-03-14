<template>
  <div class="rightView">
    <div class="title">{{activeIndex==='1'?'销售排行':'访问排行'}}</div>
    <div class="item" v-for="(item, index) in activeIndex==='1'?orderRank:userRank" :key="item.no">
      <div class="no" :class="{active:index <= 2}">{{item.no}}</div>
      <div class="name">{{item.name}}</div>
      <div class="count">{{item.count}}</div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'RightView'
  })
</script>
<script lang="ts" setup>
  import {computed} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'

  const props = defineProps<{
    activeIndex:string
  }>()
  const echartsStore = useEchartsStore()
  
  const orderRank = computed(() => {
    return echartsStore.echartsData.orderRank
  })
  const userRank = computed(() => {
    return echartsStore.echartsData.userRank
  })


</script>

<style lang="scss" scoped>
  .title{
    font-size: 14px;
    margin-top: 50px;
  }
  .item{
    display:flex;
    font-size: 12px;
    align-items: center;
    margin: 5px 0;
    .no{
      width:20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      &.active{
        background-color: #000;
        color: #fff;
      }
    }
    .name{
      flex:1;
      margin-left:10px
    }
  }
</style>
