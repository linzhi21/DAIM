// 三级分类的接口请求函数
import request from '@/utils/request'
// 1级分类列表和2级还有3级类型都有id都有name，2级和3级分别多了个id
// 合并定义返回数据的类型

interface CategoryData {
  id: number,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export type CategoryListData = CategoryData[]

export default {
  // GET /admin/product/getCategory1
  // getCategory1
  getCategory1() {
    return request.get<any, CategoryListData>('/admin/product/getCategory1')
  },

  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id: number) {
    return request.get<any, CategoryListData>(`/admin/product/getCategory2/${category1Id}`)
  },

  // GET /admin/product/getCategory3/{category2Id}
  getCategory3(category2Id: number) {
    return request.get<any, CategoryListData>(`/admin/product/getCategory3/${category2Id}`)
  }
}