import mockRequest from '@/utils/mockRequest'

interface WordData {
  "word": string,
  "count": number,
  "user": number
}

interface RankData {
  "no": number,
  "name": string,
  "count": string
}

export type EchartsData = {
  "salesToday": number,
  "salesLastDay": number,
  "salesGrowthLastDay": number,
  "salesGrowthLastMonth": number,

  "orderToday": number,
  "orderLastDay": number,
  "orderTrend": number[],
  "orderTrendAxis": string[],

  "orderUser": number,
  "returnRate": number,
  "orderUserTrend": number[],
  "orderUserTrendAxis": string[],

  "usersTotal": number,
  "usersLastDay": number,
  "usersLastMonth": number,
  "userGrowthLastDay": string,
  "userGrowthLastMonth": string,


  "orderFullYearAxis": string[],
  "orderFullYear": number[],
  "userFullYearAxis": string[],
  "userFullYear": number[],

  "orderRank": RankData[],
  "userRank": RankData[],

  "searchWord":WordData[],

  "saleRank": {
    "category": {
      "axisX": string[],
      "data1":  number[]
    },
    "goods": {
      "axisX": string[],
      "data1":  number[]
    }
  }
}


export default () => {
  return mockRequest.get<any, EchartsData>('/getEchartsData')
}