<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input placeholder="价格" type="number" v-model="skuForm.price"></el-input>
      </el-form-item>

      <el-form-item label="重量">
        <el-input placeholder="重量" type="number" v-model="skuForm.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuForm.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrList" :key="attr.id">
            <el-select v-model="attr.attrIdValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select v-model="saleAttr.saleAttrIdValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table @selection-change="handleSelectionChange" :data="spuImageList" border>
          <el-table-column type="selection" width="55" />
          <el-table-column label="图片">
            <template v-slot="{ row, $index }">
              <el-image :src="row.imgUrl" style="width:100px;height:80px"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-button @click="setDefaultImg(row,spuImageList)" v-if="row.isDefault === '0'" type="primary" size="small">设为默认</el-button>
              <el-tag v-else type="danger">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="emit('setState', 1)">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SkuForm'
})
</script>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { SpuImageData, SpuImageListData, SpuInfoData, SpuSaleAttrListData } from '@/api/spu';
import attrApi, { type AttrListData } from '@/api/attr'
import skuApi, { type SkuAttrValueListData, type SkuData, type SkuImageListData, type SkuSaleAttrValueListData } from '@/api/sku'
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { useCategoryStore } from '@/stores/category'


const emit = defineEmits(['setState'])
const props = defineProps<{
  spu: SpuInfoData
}>()
const categoryStore = useCategoryStore()
const { category1Id, category2Id, category3Id } = storeToRefs(categoryStore)
// 收集数据,这里是需要自己定义收集的位置
const skuForm = ref<SkuData>({
  // 一会可以直接通过vmodel收集到的
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  // 一会可以从传递过来的spu当中直接拿到
  spuId:'',
  tmId: '',
  category3Id: '',

  // 需要自己动手写代码收集的

  skuDefaultImg: '', //排它的时候收集到位了

  // 下面三个数据到时候都要从外部去整理完成，放进来
  skuAttrValueList: [],

  skuSaleAttrValueList: [],
  // isSale: 0,
  // createTime: '',
  skuImageList: []
})

const attrList = ref<AttrListData>([])
const spuSaleAttrList = ref<SpuSaleAttrListData>([])
const spuImageList = ref<SpuImageListData>([])//用来让表格展示的

const skuImageList = ref<SkuImageListData>([])//收集sku图片列表使用的



const getInitAddSkuData = async () => {
  // 获取平台属性列表
  let promise1 = attrApi.getList(
    category1Id.value as number,
    category2Id.value as number,
    category3Id.value as number
  )
  // 获取spu的销售属性列表
  let promise2 = skuApi.getSpuSaleAttrList(props.spu.id as number)
  // 获取spu的图片列表
  let promise3 = skuApi.getSpuImageList(props.spu.id as number)
  try {
    const result = await Promise.all([promise1, promise2, promise3])
    attrList.value = result[0]
    spuSaleAttrList.value = result[1]
    spuImageList.value = result[2]
    spuImageList.value.forEach(item => item.isDefault = '0')
  } catch (error) {
    ElMessage.error('获取添加sku初始化数据失败')
  }
}
// 挂载完成后，需要发请求获取页面的初始化动态数据
onMounted(() => {
  getInitAddSkuData()
})


// 选择spu图片列表的回调
const handleSelectionChange = (val:SkuImageListData) => {
  // 这个val就是我们用户选中的图片组成的数组
  // 也就是我们要收集的sku的图片列表
  // console.log(val);

  // 我们把选中的图片拿到收集到外边的一个新数组当中，不能收集到原本的spuImageList
  // 因为收集到原本的当中，spu的图片列表就找不到了，展示的图片就消失了
  // 我们要把选中的图片列表，收集到一个新的数组当中，也是没有直接收集到位
  // 因为后期保存的时候也要整理，整理之后再放到skuForm当中
  // spuImageList.value = val  这样写是不行的
  skuImageList.value = val
 }

//  点击设为默认设置默认图片

const setDefaultImg = (row:SpuImageData,spuImageList:SpuImageListData) => {
  spuImageList.forEach(item => item.isDefault = '0')
  row.isDefault = '1'
  // 排它的同时，就可以收集我们的默认图片路径
  skuForm.value.skuDefaultImg = row.imgUrl
}


// 点击保存按钮

const save = async () => {
  // 1、获取参数数据
  let skuInfo = skuForm.value
  // 2、整理参数
  // 1》整理spu当中传递过来的
  // spuId:'',
  // tmId: '',
  // category3Id: '',
  skuInfo.category3Id = props.spu.category3Id as number
  skuInfo.tmId = props.spu.tmId
  skuInfo.spuId = props.spu.id

  // 2》整理图片列表
  skuInfo.skuImageList = skuImageList.value.map(item => {
    return {
      imgName: item.imgName,
      imgUrl: item.imgUrl,
      spuImgId: item.id, 
      //item代表是一个图片，图片是从spu的图片列表选择来的，item
      // 其实就是spu的一个图片，图片的id就是现在这里要的spuImgId
      isDefault: item.isDefault
    }
  })

  // 3》整理平台属性值列表
  skuInfo.skuAttrValueList = attrList.value.reduce((prev:SkuAttrValueListData,item) => {
    if(item.attrIdValueId){
      // 代表当前这个平台属性身上有我当前选中的属性值 是一个属性id和属性值id拼的字符串
      let [attrId,valueId] = item.attrIdValueId.split(':')
      let obj = {attrId,valueId}
      prev.push(obj)
    }
    return prev
  },[] as SkuAttrValueListData)


  // 4》整理销售属性值列表
  skuInfo.skuSaleAttrValueList = spuSaleAttrList.value.reduce((prev,item) => {
    if(item.saleAttrIdValueId){
      let [saleAttrId,saleAttrValueId] = item.saleAttrIdValueId.split(':')
      let obj = {saleAttrId,saleAttrValueId}
      prev.push(obj)
    }
    return prev
  },[] as SkuSaleAttrValueListData)
  // 3、发请求
  try {
    // 4、成功干啥
    await skuApi.saveSkuInfo(skuInfo)
    ElMessage.success('保存添加sku成功')
    emit('setState',1)
  } catch (error) {
    // 5、失败干啥
    ElMessage.success('保存添加sku失败')
  }
}




</script>

<style lang="less" scoped>
</style>
