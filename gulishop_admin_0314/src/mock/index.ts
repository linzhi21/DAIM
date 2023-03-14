import echartsData from './echartsData.json'
import Mock from 'mockjs'

Mock.mock('/mock/getEchartsData',{code:200,data:echartsData})