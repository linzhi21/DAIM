<template>
  <div>
    <el-form :inline="true" :disabled="disabled">
      <el-form-item label="一级分类">
        <el-select v-model="category1Id" placeholder="请选择" @change="handlerCategory1">
          <!-- select的v-model收集的就是选中的option的value值
          option的value值，就要看后期你要收集什么数据，后期我们是需要收集三种选中分类的id去发请求
          获取下面的属性列表的，所以最终option的value应该写的是分类的id -->
          <el-option v-for="(c1, index) in category1List" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="二级分类">
        <el-select v-model="category2Id" placeholder="请选择" @change="handlerCategory2">
          <!-- select的v-model收集的就是选中的option的value值
          option的value值，就要看后期你要收集什么数据，后期我们是需要收集三种选中分类的id去发请求
          获取下面的属性列表的，所以最终option的value应该写的是分类的id -->
          <el-option v-for="(c2, index) in category2List" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="三级分类">
        <el-select v-model="category3Id" placeholder="请选择">
          <!-- select的v-model收集的就是选中的option的value值
          option的value值，就要看后期你要收集什么数据，后期我们是需要收集三种选中分类的id去发请求
          获取下面的属性列表的，所以最终option的value应该写的是分类的id -->
          <el-option v-for="(c3, index) in category3List" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CategorySelector'
})
</script>
<script lang="ts" setup>
  import {onMounted} from 'vue'
  import {useCategoryStore} from '@/stores/category'
  import { storeToRefs } from 'pinia';

  defineProps<{
    disabled:boolean
  }>()

  const categoryStore = useCategoryStore()

  // 把请求获取到的1级分类列表数据从store捞到组件，去遍历
  let {category1List,category1Id,category2List,category2Id,category3List,category3Id} = storeToRefs(categoryStore)

  // 挂载完成后直接找store请求获取1级分类列表存储到store
  onMounted(() => {
    categoryStore.getCategory1List()
  })

  // 选中1级分类，1级分类发生变化的时候的事件回调,请求获取2级列表
  const handlerCategory1 = (category1Id:number) => {
    categoryStore.getCategory2List(category1Id)
  }

  // 选中2级分类，2级分类发生变化的时候的事件回调，请求获取3级列表
  const handlerCategory2 = (category2Id:number) => {
    categoryStore.getCategory3List(category2Id)
  }

</script>

<style lang="less" scoped>
</style>
