import request from '@/utils/request'


// 参数类型看接口文档
export interface TrademarkData {
  id?: number,
  tmName: string,
  logoUrl: string
}

// 返回的数据类型测接口看返回的数据
type TrademarkListInfoData =
  {
    records: TrademarkData[]
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }


export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  remove(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${id}`)
  },

  // 添加一个品牌和修改一个品牌都要使用请求体参数，给后台传递一个新的品牌对象
  // 但是接口上我们看到两个品牌对象是一样的，都有id，这样是不对的
  // id并不是前台给生成的，而是添加品牌的时候传递给后台，后台存储数据库的时候，id自动生成的
  // 所添加品牌的时候，品牌对象当中不应该有id，而修改品牌的时候，品牌对象当中应该有id
  // 修改的品牌是从数据库获取过来的品牌，那么一定有id
  // 添加的品牌是前端人员收集整理的一个新的品牌对象，还没添加到数据库，所以没有id

  // 一个接口完成添加和修改两个功能
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark: TrademarkData) {
    if (trademark.id) {
      return request.put<any, null>('/admin/product/baseTrademark/update', trademark)
    } else {
      return request.post<any, null>('/admin/product/baseTrademark/save', trademark)
    }
  },


  // GET /admin/product/baseTrademark/{page}/{limit}
  getPageListInfo(page: number, limit: number) {
    return request.get<any,TrademarkListInfoData>(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 获取所有的列表
  //GET /admin/product/baseTrademark/getTrademarkList
  getList(){
    return request.get<any,TrademarkData[]>('/admin/product/baseTrademark/getTrademarkList')
  }
}