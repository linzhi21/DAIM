import request from '@/utils/request'

// 所有的销售属性数据类型
export interface BaseSaleAttrData {
  id: number,
  name: string
}
export type BaseSaleAttrListData = BaseSaleAttrData[]



export interface ImgResponseData {
  code: number
  data: string
  message: string
  ok: boolean
}

// spu的图片数据类型
export interface SpuImageData {
  id?: number,
  imgName: string | undefined,
  imgUrl: string,
  spuId?: number,
  name?: string
  url?: string,
  response?:ImgResponseData,
  isDefault?:string
}


  // id?: number,
  // skuId?: number,
  // imgName: string,
  // imgUrl: string,
  // spuImgId?: number,
  // isDefault: string


export type SpuImageListData = SpuImageData[]



// spu的销售属性值的数据类型
interface SpuSaleAttrValueData {
  baseSaleAttrId?: number | string | undefined,
  id?: number | string,
  isChecked?: string,
  saleAttrName?: string,
  saleAttrValueName: string | undefined,
  spuId?: number
}

type SpuSaleAttrValueListData = SpuSaleAttrValueData[]


// spu的销售属性数据类型
export type SpuSaleAttrData = {
  baseSaleAttrId?: number | string,
  id?: number,
  saleAttrName: string,
  spuId?: number,
  spuSaleAttrValueList: SpuSaleAttrValueListData,
  isEdit?: boolean,
  saleAttrValueName?: string | undefined,
  saleAttrIdValueId?:string
}

export type SpuSaleAttrListData = SpuSaleAttrData[]


// spu数据类型
export type SpuInfoData = {
  category3Id?: number | string,
  description: string,
  id?: number,
  spuImageList: SpuImageListData,
  spuName: string,
  spuSaleAttrList: SpuSaleAttrListData,
  tmId: number | string
}

// 写完后发现和上面一个是相同的
// interface SpuData {
//   id?: number,
//   spuName: string,
//   description: string,
//   category3Id?: number,
//   tmId: number,
//   spuSaleAttrList: null,
//   spuImageList: null
// }

export type SpuListData = SpuInfoData[]


// spu的分页列表类型

type SpuPageListData = {
  records: SpuListData,
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}



export default {
  // 获取所有的销售属性列表
  // 后期还有一个spu的销售属性列表，spu销售属性列表是在添加这个spu的时候
  // 从所有的销售属性列表当中选择的某几项组成的，最多能和所有的销售属性列表一样
  // 但是不会超过所有的销售属性列表
  // GET /admin/product/baseSaleAttrList
  // getBaseSaleAttrList
  getBaseSaleAttrList() {
    return request.get<any, BaseSaleAttrListData>('/admin/product/baseSaleAttrList')
  },

  // DELETE /admin/product/deleteSpu/{spuId}
  // deleteSpu
  // 删除某个spu
  deleteSpu(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${spuId}`)
  },

  // GET /admin/product/findSpuInfoByKeyword/{keyword}
  // findSpuInfoByKeyword
  // 这个接口不用

  // 这个接口不需要，因为后期拿的列表当中存储的就是spu的基本信息对象
  // GET /admin/product/getSpuById/{spuId}
  // 获取spu基本信息

  // 这个接口也不需要
  // POST /admin/product/inner/findSpuInfoBySpuIdList
  // findSpuInfoBySpuIdList


  // 添加spu
  // POST /admin/product/saveSpuInfo
  // saveSpuInfo
  // 修改spu
  // POST /admin/product/updateSpuInfo
  // 更改spu信息
  addOrUpdate(spuInfo: SpuInfoData) {
    return request.post<any, null>(`/admin/product/${spuInfo.id ? 'updateSpuInfo' : 'saveSpuInfo'}`,spuInfo)
  },

  // 获取spu的分页列表
  // 参数，除了page和limit，还有query参数category3Id
  // GET /admin/product/{page}/{limit}?category3Id
  getPageList(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageListData>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  }
}