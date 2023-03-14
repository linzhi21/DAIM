<template>
  <div>
    <el-card>
      <CategorySelector :disabled="showState !== 1"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 定义三个组件进行切换 -->
      <SpuList v-if="showState === ShowCom.showSpuList" @setState="setState"></SpuList>
      <SpuForm v-if="showState === 2" @setState="setState" :spu="spu"></SpuForm>
      <SkuForm v-if="showState === 3" @setState="setState" :spu="spu"></SkuForm> 
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Spu'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import type { SpuInfoData } from '@/api/spu';
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuForm/index.vue'
import SkuForm from './components/SkuForm/index.vue'


enum ShowCom {
  showSpuList = 1,
  showSpuForm = 2,
  showSkuForm = 3
}

// 1代表显式列表页spu
// 2代表显式添加和修改页面spu
// 3代表显式sku的添加页面
const showState = ref(1)

const spu = ref<SpuInfoData>({
  category3Id: '',
  description: '',
  spuImageList: [],
  spuName: '',
  spuSaleAttrList: [],
  tmId: ''
})
// 自定义事件的回调
const setState = (num: number, spuInfo: SpuInfoData) => {
  // 如果用户在列表页面点击的是添加，spu拿的是undefined
  // 如果用户在列表页面点击的是修改，spu拿的就是有东西的
  // spu如果传递是从spuList点击修改，传递的，这个spu是需要传递给
  // spuForm界面里面去使用的，所以需要props传递
  showState.value = num
  if (spuInfo) {
    // 代表是修改
    spu.value = spuInfo  
    //不用拷贝，因为组件已经被销毁了，下次重建
    //列表页会重新获取最新数据，不会保留之前的老数据
  } else {
    // 代表不是修改
    // 这里必须要初始化，如果不初始化，导致用户先修改再添加没有刷新页面
    // 添加的时候spu还是之前修改的row的数据
    spu.value = {
      category3Id: '',
      description: '',
      spuImageList: [],
      spuName: '',
      spuSaleAttrList: [],
      tmId: ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
