import {defineStore} from 'pinia'
import categoryApi from '@/api/category'
import { ElMessage } from 'element-plus'
import type {CategoryListData} from '@/api/category'

interface CategoryStoreStateData {
  category1Id:number | string,
  category2Id:number | string,
  category3Id:number | string,
  category1List:CategoryListData,
  category2List:CategoryListData,
  category3List:CategoryListData,
}

export const useCategoryStore = defineStore('category',{
  state():CategoryStoreStateData{
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      category1List:[],
      category2List:[],
      category3List:[],
    }
  },
  actions:{
    async getCategory1List(){
      try {
        const result = await categoryApi.getCategory1()
        this.category1List = result
      } catch (error) {
        ElMessage.error('获取一级分类列表失败')
      }
    },
    async getCategory2List(category1Id:number){
      // 选中1级清空23级
      this.category2Id = ''
      this.category3Id = ''
      this.category2List = []
      this.category3List = []

      try {
        const result = await categoryApi.getCategory2(category1Id)
        this.category2List = result
      } catch (error) {
        ElMessage.error('获取二级分类列表失败')
      }
    },
    async getCategory3List(category2Id:number){
      // 选中2级清空3级
      this.category3Id = ''
      this.category3List = []

      try {
        const result = await categoryApi.getCategory3(category2Id)
        this.category3List = result
      } catch (error) {
        ElMessage.error('获取三级分类列表失败')
      }
    },
  }
})