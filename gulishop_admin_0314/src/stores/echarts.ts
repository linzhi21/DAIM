import {defineStore} from 'pinia'
import {default as getEchartsData} from '@/api/echarts'
import type {EchartsData} from '@/api/echarts'
// import  getEchartsData from '@/api/echarts'

type EchartsStateData = {
  echartsData:EchartsData
}


export const useEchartsStore = defineStore('echarts',{
  state():EchartsStateData{
    return {
      echartsData:{
        "salesToday": 0,
        "salesLastDay":   0,
        "salesGrowthLastDay": 0,
        "salesGrowthLastMonth": 0,
      
        "orderToday": 0,
        "orderLastDay": 0,
        "orderTrend": [],
        "orderTrendAxis": [],
        
        "orderUser": 0,
        "returnRate": 0,
        "orderUserTrend": [],
        "orderUserTrendAxis": [],
        
        "usersTotal": 0,
        "usersLastDay": 0,
        "usersLastMonth": 0,
        "userGrowthLastDay": "",
        "userGrowthLastMonth": "",
        
        
        "orderFullYearAxis": [],
        "orderFullYear": [],
        "userFullYearAxis": [],
        "userFullYear": [],
        
        "orderRank": [],
        "userRank": [],
      
        "searchWord": [],
      
        "saleRank": {
          "category": {
            "axisX": [],
            "data1": []
          },
          "goods": {
            "axisX": [],
            "data1": []
          }
        }
      }
    }
  },
  actions:{
    async getEchartsData(){
      try {
        const result = await getEchartsData()
        this.echartsData = result
      } catch (error) {
        alert('获取图表数据失败')
      }
      
    }
  }
})