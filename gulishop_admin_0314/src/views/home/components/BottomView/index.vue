<template>
  <el-row :gutter="20" style="margin-top:20px">
    <el-col :span="12" :offset="0">
      <SearchKeyword></SearchKeyword>
    </el-col>
    <el-col :span="12" :offset="0">
      <CategoryRank></CategoryRank>
    </el-col>
  </el-row>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'BottomView'
  })
</script>
<script lang="ts" setup>
  import SearchKeyword from './components/SearchKeyword/index.vue'
  import CategoryRank from './components/CategoryRank/index.vue'
</script>

<style lang="less" scoped>
</style>
