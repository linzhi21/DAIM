<template>
  <div>
    <el-button :disabled="!category3Id" type="primary" icon="ele-Plus" @click="showAddSpuForm">添加SPU</el-button>
    <el-table :data="spuList" :style="{margin:'20px 0'}" border>
      <el-table-column label="序号" width="80" align="center" type="index">
      </el-table-column>
      <el-table-column label="SPU名称" prop="spuName">
      </el-table-column>
      <el-table-column label="SPU描述" prop="description">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button @click="showAddSkuForm(row)" type="success" size="small" icon="ele-Plus" title="添加sku"></el-button>
          <el-button @click="showUpdateSpuForm(row)" type="warning" size="small" icon="ele-Edit" title="修改spu">
          </el-button>
          <el-button @click="showSkuList(row)" type="info" size="small" icon="ele-InfoFilled" title="查看sku列表">
          </el-button>
          <el-button @click="deleteSpu(row)" type="danger" size="small" icon="ele-Delete" title="删除spu"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="getSpuList" v-model:currentPage="page"
      v-model:page-size="limit" :total="total" :pager-count="7" :page-sizes="[3, 5, 7, 10]"
      layout="prev, pager, next, jumper,->,sizes, total" />


    <!-- 查看sku列表对话框 -->
    <el-dialog :before-close="beforClose" v-model="dialogTableVisible" :title="`${spu.spuName}的sku列表`">
      <el-table v-loading="loading" :data="skuList">
        <!-- property对应的就是prop -->
        <el-table-column label="名称" prop="skuName" />
        <el-table-column label="价格" prop="price"/>
        <el-table-column label="重量" prop="weight"/>
        <el-table-column label="默认图片">
          <template v-slot="{row,$index}">
            <el-image :src="row.skuDefaultImg" ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'SpuList'
})
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/category'
import spuApi from '@/api/spu'
import type { SpuListData, SpuInfoData } from '@/api/spu'
import skuApi, { type SkuListData } from '@/api/sku'

const emit = defineEmits(['setState']) //拿到自定义事件

const categoryStore = useCategoryStore()
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const { category3Id } = storeToRefs(categoryStore)
const spuList = ref<SpuListData>([])

// 获取spu列表的函数
const getSpuList = async (num = 1) => {
  page.value = num
  try {
    const result = await spuApi.getPageList(page.value, limit.value, category3Id.value as number)
    total.value = result.total
    spuList.value = result.records
  } catch (error) {
    ElMessage.error('获取spu列表失败')
  }
}

// 监视3级id获取spu列表
watch(category3Id, (newVal, oldVal) => {
  if (!newVal) {
    // 清空spu列表数据
    spuList.value = []
  } else {
    // 发请求获取spu列表数据
    getSpuList()
  }
}, { immediate: true })

// 修改每页显示数量的回调
const handleSizeChange = (size: number) => {
  limit.value = size
  getSpuList()
}

// 点击添加spu按钮，切换到spuForm组件界面
const showAddSpuForm = () => {
  // 我们得让父组件当中showState变为2
  // 得和父组件进行通信，子向父通信
  emit('setState', 2)
}

// 点击修改spu的按钮，切换到spuForm
const showUpdateSpuForm = (row: SpuInfoData) => {
  emit('setState', 2, row)
}

// 点击添加sku的按钮，切换到skuForm
const showAddSkuForm = (row: SpuInfoData) => {
  emit('setState', 3, row)
}

// 点击删除spu按钮
const deleteSpu = async (row: SpuInfoData) => {
  try {
    await spuApi.deleteSpu(row.id as number)
    ElMessage.success('删除spu成功')
    getSpuList(spuList.value.length > 1 ? page.value : page.value - 1)
  } catch (error) {
    ElMessage.error('删除spu失败')
  }
}


// 点击查看sku列表按钮
const dialogTableVisible = ref(false) //dialog开关
// 下面这个数据是为了dialog使用spu的名称回显，保存点击spu
const spu = ref<SpuInfoData>({
  category3Id:'',
  description: '',
  spuImageList: [],
  spuName: '',
  spuSaleAttrList: [],
  tmId: ''
})
const skuList = ref<SkuListData>([])
const loading = ref(false) //loading加载的开关
// 通常情况下，请求前开启，请求后关闭


const showSkuList = async (row: SpuInfoData) => {
  // 让对话框的开关打开弹出对话框
  dialogTableVisible.value = true
  // 保存点击的spu，因为一会上面要用到这个spu的名字
  spu.value = row
  // 发请求获取当前spu的sku列表
  // 请求前开启加载，请求后关闭加载
  loading.value = true
  try {
    const result = await skuApi.findBySpuId(row.id as number)
    skuList.value = result
    loading.value = false
  } catch (error) {
    ElMessage.error('获取sku列表失败')
    loading.value = false
  }
}

// dialog对话框关闭之前，一般我们都在关闭之前的函数当中去初始化数据或者情况数据
const beforClose = () => {
  // 清空上一次的sku列表数据，下一次请求的时候，列表当中也是空的
  // 重置标志数据  loading  dialog开关
  skuList.value = []
  loading.value = false
  dialogTableVisible.value = false
}




</script>

<style lang="less" scoped>
</style>
