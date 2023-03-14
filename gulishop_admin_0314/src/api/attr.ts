import request from '@/utils/request'

export interface AttrValueData {
  id?: number,
  valueName: string,
  attrId: number | undefined,
  isEdit?:boolean
}


export type AttrValueListData = AttrValueData[]


export type AttrData = {
  id?: number,
  attrName: string,
  categoryId: number,
  categoryLevel: number,
  attrValueList: AttrValueListData,
  attrIdValueId?:string
}

export type AttrListData = AttrData[]


export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrListData>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  remove(attrId: number) {
    return request.delete<any, null>(`/admin/product/deleteAttr/${attrId}`)
  },

  // 添加和修改  可以认为put其实就是特殊的post请求
  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr: AttrData) {
    return request.post<any, null>('/admin/product/saveAttrInfo', attr)
  }
}