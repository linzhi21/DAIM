<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuForm.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择">
          <!-- option身上至少要有一个value属性 -->
          <el-option :label="tm.tmName" :value="(tm.id as number)" v-for="(tm, index) in trademarkList" :key="tm.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuForm.description" type="textarea" placeholder="SPU描述" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload 
          v-model:file-list="(spuImageList as UploadUserFile[])"
          :action="`${baseUrl}/admin/product/upload`" 
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccess" 
          :on-remove="handleRemove">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <!-- 所有的除去spu自己的销售属性，剩余的在这展示 -->
        <el-select v-model="saleAttrIdName" :placeholder="`还有${unUsedSaleAttrList.length}未选择`">
          <el-option 
            :label="unUsedSaleAttr.name" 
            :value="`${unUsedSaleAttr.id}:${unUsedSaleAttr.name}`" 
            v-for="(unUsedSaleAttr, index) in unUsedSaleAttrList" :key="unUsedSaleAttr.id">
          </el-option>
        </el-select>
        <el-button :disabled="!saleAttrIdName" type="primary" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 表格展示的是spu自己的销售属性 -->
        <el-table :data="spuSaleAttrList" border>
          <el-table-column label="序号" align="center" type="index" width="80">
          </el-table-column>
          <el-table-column label="属性名" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <!-- @close="handleClose(tag)" -->
            <template v-slot="{ row, $index }">
              <el-tag  
                @close="row.spuSaleAttrValueList.splice(index,1)"
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList" :key="saleAttrValue.id"
                class="mx-1" 
                closable 
                :disable-transitions="false"
                >
                {{saleAttrValue.saleAttrValueName}}
              </el-tag>
              <!-- @keyup.enter="handleInputConfirm" 
                @blur="handleInputConfirm" -->

                <!-- v-model后面值如果是一个对象上不存在的属性 
                这个属性一开始不存在，当用户输入数据的时候，由于vmodel双向数据绑定
                那么会自动在对象身上创建这个属性，但是，如果用户根本没有输入，那么这个对象
                身上是一直没有这个属性点，所以一开始点击之后，变为input，用户又不输入数据
                属性是不存在的，因此拿到的就是undefined-->
              <el-input
                @keyup.enter="handleInputConfirm(row)" 
                @blur="handleInputConfirm(row)"
                v-if="row.isEdit"
                v-model="row.saleAttrValueName"
                style="width:100px" 
                ref="InputRef" 
                class="ml-1 w-20" 
                size="small"/>
              <!-- @click="showInput" -->
              <el-button 
                v-else
                @click="showInput(row)"
                class="button-new-tag ml-1" 
                size="small">
                添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row,$index}">
              <el-button @click="spuSaleAttrList.splice($index,1)" type="danger" size="small" icon="ele-Delete" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save" :disabled="!spuSaleAttrList.length">保存</el-button>
        <el-button @click="emit('setState', 1)">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SpuForm'
})
</script>
<script lang="ts" setup>
import { computed, onMounted, ref,nextTick } from 'vue'
import { ElMessage, type UploadFile, type UploadFiles, type UploadProps, type UploadUserFile } from 'element-plus'
import type { SpuImageListData, SpuInfoData, SpuSaleAttrListData,ImgResponseData } from '@/api/spu';
import { Plus } from '@element-plus/icons-vue'
import trademarkApi, { type TrademarkData } from '@/api/trademark'
import spuApi, { type BaseSaleAttrListData,type SpuSaleAttrData } from '@/api/spu'
import skuApi from '@/api/sku'
import {useCategoryStore} from '@/stores/category'
import cloneDeep from 'lodash/cloneDeep'
// import type {} from '@/api/spu'

const emit = defineEmits(['setState'])

// 跳转到spu列表的时候，无论是点击的添加还是点击的修改
// 过来以后都要先发请求获取初始化展示数据
// 添加的时候需要发两个请求，修改的时候需要发四个请求

const props = defineProps<{
  spu: SpuInfoData
}>()

const spuForm = ref<SpuInfoData>(cloneDeep(props.spu)) //接收传递的spu,进行操作，直接去操作props.spu可以但是麻烦
// 接收到这个数据后，就可以根据这个数据的id来判断到底是添加过来的还是修改过来的
// 如果是添加就是父组件传递的初始化的对象数据，为了添加的时候收集
// 如果是修改就是父组件传递的对象数据，把初始化数据给覆盖成了row，为了修改的时候收集
console.log(spuForm);

const trademarkList = ref<TrademarkData[]>([])
const baseSaleAttrList = ref<BaseSaleAttrListData>([])
const spuImageList = ref<SpuImageListData>([])
const spuSaleAttrList = ref<SpuSaleAttrListData>([])
// 挂载完成发请求获取添加或者修改界面的初始化动态数据
// 添加是2个请求 修改是4个请求
// 专门发送添加的时候请求
const getInitAddSpuData = async () => {
  //发2个
  try {
    // 1、获取所有的trademark列表
    const result = await trademarkApi.getList()
    trademarkList.value = result
    // 2、获取所有的销售属性列表
    const result1 = await spuApi.getBaseSaleAttrList()
    baseSaleAttrList.value = result1
  } catch (error) {
    ElMessage.error('请求获取添加spu的初始化数据失败')
  }
}
// 专门发送修改的时候请求
const getInitUpdateSpuData = async () => {
  // 发4个
  // 1、获取所有的trademark列表
  let promise1 = trademarkApi.getList()
  // 2、获取所有的销售属性列表
  let promise2 = spuApi.getBaseSaleAttrList()
  // 3、获取spu的图片列表
  let promise3 = skuApi.getSpuImageList(spuForm.value.id as number)
  // 4、获取spu的销售属性列表
  let promise4 = skuApi.getSpuSaleAttrList(spuForm.value.id as number)
  try {
    // 这是一个面试点
    const result = await Promise.all([promise1, promise2, promise3, promise4])
    trademarkList.value = result[0]
    baseSaleAttrList.value = result[1]
    spuImageList.value = result[2]
    spuImageList.value.forEach(item => {
      item.name = item.imgName
      item.url = item.imgUrl
    })
    spuSaleAttrList.value = result[3]
  } catch (error) {
    ElMessage.error('请求获取修改spu的初始化数据失败')
  }

}
// 计算未使用的销售属性列表
const unUsedSaleAttrList =  computed(() => {
  // 根据所有的销售属性列表和spu自己的销售属性列表去计算产生未使用的销售属性列表
  // 从所有的销售属性列表当中过滤，过滤不再spu自己的销售属性列表当中的所有人
  return baseSaleAttrList.value.filter(item => {
    // 拿一项，再去从spu自己的销售属性列表当中去判断，判断这一项的名字是不是和spu自己的里面
    // 每一项的名字不同，如果是，那么就拿走，不是就不要
    return spuSaleAttrList.value.every(item1 => {
      return item1.saleAttrName !== item.name
    })
  })
})

onMounted(() => {
  if (spuForm.value.id) {
    // 代表是修改
    getInitUpdateSpuData()
  } else {
    // 代表是添加
    getInitAddSpuData()
  }
})


// 收集数据
const baseUrl = import.meta.env.VITE_API_URL
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const saleAttrIdName = ref('')
const InputRef = ref<HTMLInputElement>()
// 一、收集图片列表
// 收集图片列表的时候，无论是添加图片还是删除图片，我们都要收集
// 只是现在我们收集的位置是在spuImageList里面，并没有收集到位
// 也就是说并没有收集到spuForm当中，后期需要整理完成，添加到spuForm里面
// 用户删除图片的回调，需要把删除后的数组给收集起来
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // console.log(uploadFile, uploadFiles)
  spuImageList.value = uploadFiles as any
}

// 用户添加图片的时候，添加成功之后也要把新数组给收集起来
const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  spuImageList.value = uploadFiles as any
}

// 点击哪张图片就让哪张图片在dialog对话框当中去展示，放大图片进行预览
// 这个函数不用动
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  // console.log(uploadFile);
  dialogImageUrl.value = uploadFile.url as string
  dialogVisible.value = true
}

// 二、收集添加销售属性 过程看文档
// 点击添加销售属性按钮
const addSaleAttr = () => {
  // 1、把刚才未选择的select收集到的id和name获取到，构造成一个销售属性的对象结构
  let [baseSaleAttrId,saleAttrName] = saleAttrIdName.value.split(':')
  let obj = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
  // 2、把这个对象添加到spuSaleAttrList当中
  spuSaleAttrList.value.push(obj)
  // 3、需要把原本收集的idname字符串给清空
  saleAttrIdName.value = ''
}

// 三、收集添加销售属性值 过程看文档
const showInput = (row:SpuSaleAttrData) => {
  row.isEdit = true //把按钮变为input

  row.saleAttrValueName = '' 
  //用户点击变为input的时候，就添加这个属性并且初始值为空串，保证后面vmodel
  // 双向数据绑定的时候，这个属性是一定存在的，并且是字符串
  // 自动获取焦点
  nextTick(() => {
    InputRef.value?.focus()
  })
}
// input失去焦点或者回车之后的回调
const handleInputConfirm = (row:SpuSaleAttrData) => {
  // 获取到刚才暂存在row身上的用户输入的数据（属性值名称）
  let attrValueName = row.saleAttrValueName as string
  if(attrValueName === '' || attrValueName.trim() === ''){
    row.saleAttrValueName = ''
    // 这里不需要删除，因为此时这个新的属性值还没添加到数组当中
    // 直接变为button
    row.isEdit = false
    return 
  }

  let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === attrValueName)
  if(isRepeat){
    // 已经有人名字和现在输入一样
    ElMessage.error('输入的属性值名称不能重复！！！')
    row.saleAttrValueName = ''
    // 这里不需要删除，因为此时这个新的属性值还没添加到数组当中
    // 直接变为button
    row.isEdit = false
    return 
  }

  // 把自己输入的属性值名称构造成这样的对象
  // {
  //   baseSaleAttrId?: number,  //需要 代表属性值所属属性的id，给哪个属性加属性值
  //   saleAttrValueName:string, //需要 代表属性值的名称
  // }
  let {saleAttrValueName,baseSaleAttrId} = row
  let obj =  {saleAttrValueName,baseSaleAttrId}
  // 把对象添加到指定的位置,然后再把input切换为按钮
  row.spuSaleAttrValueList.push(obj)
  row.saleAttrValueName = ''
  row.isEdit = false
}

const categoryStore = useCategoryStore()
// 保存逻辑
const save = async () => {
  // 1、获取请求参数
  let spu = spuForm.value
  // 2、整理参数
  // 1>整理category3Id，修改里面是有的，但是添加里面需要收集，因此不管是修改还是添加都给一个
  spu.category3Id = categoryStore.category3Id
  // 2>整理图片列表
  spu.spuImageList = spuImageList.value.map(item => {
    return {
      imgName:item.name,
      imgUrl:item.imgUrl || (item.response as ImgResponseData).data
    }
  })
  // 3>整理spu的销售属性列表
  // 删除每个销售属性身上的 isEdit和saleAttrValueName
  spuSaleAttrList.value.forEach(item => {
    delete item.isEdit
    delete item.saleAttrValueName
  })
  spu.spuSaleAttrList = spuSaleAttrList.value
  // 3、发请求
  try {
    // 4、成功干啥
    await spuApi.addOrUpdate(spu)
    ElMessage.success('保存spu成功')
    // 回到列表页
    emit('setState',1,)
    // 重新获取列表页数据（也要传递页码）
    // 如果是新添加就在第一页，如果是修改就在当前页
    // 由于回去之后我们需要带上当时跳转过来的时候页码，而页码已经销毁了
    // 所以我们如果要写就得在当时跳转的时候，就把列表当中的页码给传递过来
    // 回去之后再把页码带回去
  } catch (error) {
    // 5、失败干啥
    ElMessage.error('保存spu失败')
  }
}

</script>

<style lang="less" scoped>
</style>
