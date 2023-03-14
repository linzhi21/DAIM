<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <span>关键词搜索</span>
    </template>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <div class="title">搜索用户数</div>
        <div class="count">{{allUserCount}}</div>
        <div class="main">
          <v-chart :option="getOption(true)" autoresize></v-chart>
        </div>
      </el-col>
      <el-col :span="12" :offset="0">
        <div class="title">搜索量</div>
        <div class="count">{{allSearchCount}}</div>
        <div class="main">
          <v-chart :option="getOption(false)" autoresize></v-chart>
        </div>
      </el-col>
    </el-row>
    <div style="height:250px">
      <el-table :data="currentTableData">
        <el-table-column label="排名" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="关键字" prop="word"></el-table-column>
        <el-table-column label="搜索数量" prop="count"></el-table-column>
        <el-table-column label="搜索用户数" prop="user"></el-table-column>
        <el-table-column label="搜索占比" prop="percent"></el-table-column>
      </el-table>
    </div>
    
    
    
    <el-pagination
      v-model:currentPage="page"
      v-model:page-size="limit"
      layout=" prev, pager, next"
      :total="allTableData.length"
    />
    
  </el-card>
  
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'SearchKeyword'
  })
</script>
<script lang="ts" setup>
  import {computed, ref} from 'vue'
  import {useEchartsStore} from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  const page = ref(1)
  const limit = ref(5)

  const searchWord = computed(() => {
    return echartsStore.echartsData.searchWord
  })
  // [
  //   {
  //   "word": "北京",
  //   "count": 3440,
  //   "user": 1626
  // }]
  // 1、根据上面的数据计算出一个word组成的数组，一会图标x使用
  // 2、根据上面的数据计算出一个用户数组成的数组，一会图标的系列使用
  // 3、根据上面的数据计算出一个搜索数组成的数组，一会图标的系列使用
  
  // 计算word组成的数组
  const wordList = computed(() => {
    return searchWord.value.map(item => item.word)
  })
  // 计算用户数组成的数组
  const userCountList = computed(() => {
    return searchWord.value.map(item => item.user)
  })
  // 计算搜索数组成的数组
  const searchCountList = computed(() => {
    return searchWord.value.map(item => item.count)
  })
  // 计算所有的用户数
  const allUserCount = computed(() => {
    return userCountList.value.reduce((prev,item) => {
      prev += item
      return prev
    },0)
  })

  // 计算所有的搜索数
  const allSearchCount = computed(() => {
    return searchCountList.value.reduce((prev,item) => {
      prev += item
      return prev
    },0)
  })

  const getOption = (flag:boolean) => {
    return {
      xAxis:{
        show:false,
        data:wordList.value
      },
      yAxis:{
        show:false
      },
      tooltip:{
        trigger:'axis'
      },
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0,
      },
      series:[{
        name:flag?'用户数':'搜索数',
        data:flag?userCountList.value:searchCountList.value,
        smooth:true,
        type:'line',
        itemStyle:{
          opacity:0
        },
        lineStyle:{
          color:'red'
        },
        areaStyle:{
          color:'blue'
        }
      }]
    }
  }
  // 计算所有的表格展示的数据格式
  const allTableData = computed(() => {
    return searchWord.value.map(item => {
      return {
        word:item.word,
        user:item.user,
        count:item.count,
        percent:(item.count / allSearchCount.value * 100).toFixed(2) + '%'
      }
    })
  })

  // 计算当前表格展示的数据（前端分页）
  const currentTableData = computed(() => {
    return allTableData.value.slice((page.value - 1)*limit.value,page.value * limit.value)
  })

  




</script>

<style lang="scss" scoped>
  .title{
    font-size: 14px;
    color: #ccc;
  }
  .count{
    font-size: 24px;
    letter-spacing: 1px;
  }
  .main{
    height: 50px;
  }
</style>
