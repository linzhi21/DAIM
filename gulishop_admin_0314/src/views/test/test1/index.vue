<template>
  <el-button v-has="'btn.Test1.add'" type="primary" size="default">添加</el-button>
  <el-button v-has="'btn.Test1.update'" type="warning" size="default">修改</el-button>
  <el-button v-has="'btn.Test1.delete'" type="danger" size="default">删除</el-button>
  
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name:'Test1'
  })
</script>
<script lang="ts" setup>
</script>

<style lang="less" scoped>
</style>
