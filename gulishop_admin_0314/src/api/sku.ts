import request from '@/utils/request'
import type{SpuImageListData,SpuSaleAttrListData} from './spu'
 
// sku的销售属性值数据类型
interface SkuSaleAttrValueData {
  id?: number,
  skuId?: number,
  spuId?: number,
  saleAttrValueId?: number | string,
  saleAttrId?: number | string,
  saleAttrName?: string,
  saleAttrValueName?: string
}

export type SkuSaleAttrValueListData = SkuSaleAttrValueData[]



// sku的平台属性值数据类型
interface SkuAttrValueData {
  id?: number,
  attrId?: number | string,
  valueId?: number | string,
  skuId?: number,
  attrName?: string,
  valueName?: string
}
export type SkuAttrValueListData =  SkuAttrValueData[]



// sku的图片数据类型
interface SkuImageData {
  id?: number,
  skuId?: number,
  imgName: string,
  imgUrl: string,
  spuImgId?: number,
  isDefault: string
}
export type SkuImageListData = SkuImageData[]


// sku的数据类型
export interface SkuData {
  id?: number,
  spuId?: number | string,
  price: number,
  skuName: string,
  skuDesc: string,
  weight: string,
  tmId: number | string,
  category3Id: number | string,
  skuDefaultImg: string,
  isSale?: number,
  createTime?: string,
  skuImageList: SkuImageListData,
  skuAttrValueList: SkuAttrValueListData,
  skuSaleAttrValueList: SkuSaleAttrValueListData
}
export type SkuListData = SkuData[]



// sku的分页列表数据类型
type SkuPageListData = {
  records: SkuListData
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}




export default {
  // 下架商品
  // GET /admin/product/cancelSale/{skuId}
  // cancelSale
  cancelSale(skuId:number){
    return request.get<any,null>(`/admin/product/cancelSale/${skuId}`)
  },
  // 上架商品
  // GET /admin/product/onSale/{skuId}
  // onSale
  onSale(skuId:number){
    return request.get<any,null>(`/admin/product/onSale/${skuId}`)
  },

  // 删除sku
  // DELETE /admin/product/deleteSku/{skuId}
  // deleteSku
  deleteSku(skuId:number){
    return request.delete<any,null>(`/admin/product/deleteSku/${skuId}`)
  },
  // 根据指定的spu的id获取当前spu的所有sku列表
  // GET /admin/product/findBySpuId/{spuId}
  // findBySpuId
  findBySpuId(spuId:number){
    return request.get<any,SkuListData>(`/admin/product/findBySpuId/${spuId}`)
  },

  // 根据指定的sku的id获取sku的详情
  // GET /admin/product/getSkuById/{skuId}
  // getById
  getById(skuId:number){
    return request.get<any,SkuData>(`/admin/product/getSkuById/${skuId}`)
  },

  // 这个接口不用
  // GET /admin/product/inner/findSkuInfoByKeyword/{keyword}
  // findSkuInfoByKeyword

  // 这个接口也不用
  // POST /admin/product/inner/findSkuInfoBySkuIdList
  // findSkuInfoBySkuIdList


  // 获取sku的分页列表
  // GET /admin/product/list/{page}/{limit}
  // index
  getPageList(page:number,limit:number){
    return request.get<any,SkuPageListData>(`/admin/product/list/${page}/${limit}`) 
  },

  

  // POST /admin/product/saveSkuInfo
  // saveSkuInfo
  saveSkuInfo(skuInfo:SkuData){
    return request.post<any,null>('/admin/product/saveSkuInfo',skuInfo)
  },

  // 根据spu的id获取spu的图片列表，spu本身内部是没有图片列表，自己需要再发一个请求才能拿到
  // GET /admin/product/spuImageList/{spuId}
  // getSpuImageList
  getSpuImageList(spuId:number){
    return request.get<any,SpuImageListData>(`/admin/product/spuImageList/${spuId}`)
  },

  // 根据spu的id获取spu自己的销售属性
  // GET /admin/product/spuSaleAttrList/{spuId}
  // getSpuSaleAttrList
  getSpuSaleAttrList(spuId:number){
    return request.get<any,SpuSaleAttrListData>(`/admin/product/spuSaleAttrList/${spuId}`)
  }

  // 修改sku的接口正在开发中

}