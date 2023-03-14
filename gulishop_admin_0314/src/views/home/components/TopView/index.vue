<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" :offset="0">
        <TodaySale></TodaySale>
      </el-col>
      <el-col :span="6" :offset="0">
        <TodayOrder></TodayOrder>
      </el-col>
      <el-col :span="6" :offset="0">
        <TradeUser></TradeUser>
      </el-col>
      <el-col :span="6" :offset="0">
        <TotalUser></TotalUser>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TopView'
})
</script>
<script lang="ts" setup>
import TodaySale from './components/TodaySale/index.vue'
import TodayOrder from './components/TodayOrder/index.vue'
import TradeUser from './components/TradeUser/index.vue'
import TotalUser from './components/TotalUser/index.vue'
</script>

<style lang="scss" scoped>
:deep(.left) {
  margin-right: 20px;
}

:deep(.down) {
  border: 5px solid blue;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

:deep(.up){
  border: 5px solid red;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
}
</style>
