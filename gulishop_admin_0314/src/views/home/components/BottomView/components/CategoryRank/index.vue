<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="header">
        <span>分类销售排行</span>
        <el-radio-group v-model="radio">
          <el-radio-button label="品类" />
          <el-radio-button label="商品" />
        </el-radio-group>
      </div>
    </template>
    <!-- <div slot="header">已经废弃</div> -->
    <div class="main">
      <v-chart :option="getOption()" autoresize></v-chart>
    </div>
  </el-card>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'CategoryRank'
})
</script>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import {useEchartsStore} from '@/stores/echarts'
const echartsStore = useEchartsStore()

const radio = ref('品类')
// "saleRank": {
//   "category": {
//     "axisX": ["粉面粥店", "简餐便当", "汉堡披萨", "香锅冒菜", "小吃炸串", "地方菜系", "轻食简餐"],
//     "data1": [56, 52, 95, 41, 30, 69, 63]
//   },
//   "goods": {
//     "axisX": ["草莓", "甘蔗", "榴莲", "菠萝", "香蕉", "梨", "苹果"],
//     "data1": [68, 15, 41, 56, 70, 25, 31]
//   }
// }

const saleRank = computed(() => {
  return echartsStore.echartsData.saleRank
})

const useData = computed(() => {
  // 复合结构：   冒号有继续结构的意思，还有取别名的意思 
  let {category:{axisX:names1,data1:datas1},goods:{axisX:names2,data1:datas2}} = saleRank.value

  // 计算datas1数据的总合
  const allDatas1 = datas1.reduce((prev,item) => {
    prev += item
    return prev
  },0)

  // 整理的目标是一个数组
  // [{value:234,name:'店铺名字|占比'}]
  const categoryData = names1.map((item,index) => {
    return {
      name:item + '|' + (datas1[index] / allDatas1 * 100).toFixed(2) + '%',
      value:datas1[index]
    }
  })

  // 计算datas1数据的总合
  const allDatas2 = datas2.reduce((prev,item) => {
    prev += item
    return prev
  },0)

  // 整理的目标是一个数组
  // [{value:234,name:'店铺名字|占比'}]
  const goodsData = names2.map((item,index) => {
    return {
      name:item + '|' + (datas2[index] / allDatas2 * 100).toFixed(2) + '%',
      value:datas2[index]
    }
  })

  return {
    categoryData,
    goodsData,
    allDatas1,
    allDatas2
  }
})






const getOption = () => {
  return {
    title:[
      {
        text:radio.value+'分布',
        textStyle:{
          fontSize:14
        },
        left:'5%',
        top:'5%'
      },
      {
        text:'用户数量',
        textStyle:{
          fontSize:26
        },
        subtext:radio.value === '品类'?useData.value.allDatas1:useData.value.allDatas2,
        subtextStyle:{
          fontSize:20
        },
        left:'34%',
        top:'40%',
        textAlign:'center'
      }
    ],
    
    
    
    tooltip: {
      trigger: 'item',
      formatter(params:any){
        // console.log(params);
        return `${radio.value}分布 <br>
        ${params.marker}名称：${params.name.split('|')[0]}<br>
        ${params.marker}数量:${params.value}<br>
        ${params.marker}占比:${params.percent}`
      }
    },
    legend: {
      orient:'vertical',
      left:'70%',
      top:'30%'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center:['35%','50%'], //圆心的位置
        radius: ['40%', '60%'], //内外圆的半径
        avoidLabelOverlap: false, //每项的文本重叠不重叠
        label: { //是否显示每项的文本
          show: true,
          formatter(params:any){
            // console.log(params);
            return params.name.split('|')[0]
          },

        },
        // 是否显示高亮状态的样式
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: '40',
        //     fontWeight: 'bold'
        //   }
        // },
        // 文本辅助线
        labelLine: {
          show: true,
          length:10,
          length2:10
        },

        itemStyle:{
          borderColor:'#fff',
          borderWidth:10
        },

        // 
        data: radio.value === '品类'?useData.value.categoryData:useData.value.goodsData
      }
    ]
  };
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-card__header) {
  padding: 12.5px 20px;
}

.main {
  height: 382px;
}
</style>
