<template>
  <el-card style="margin-top:20px">
    <div class="header">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>

      <el-radio-group v-model="radio" class="radio">
        <el-radio-button label="今日" />
        <el-radio-button label="本周" />
        <el-radio-button label="本月" />
        <el-radio-button label="本年" />
      </el-radio-group>

      <el-date-picker v-model="value" type="daterange" unlink-panels range-separator="To" start-placeholder="开始日期"
        end-placeholder="结束日期" :shortcuts="shortcuts" :size="size" />
    </div>
    <div class="line"></div>
    <el-row :gutter="20">
      <el-col :span="18" :offset="0">
        <LeftView :activeIndex="activeIndex"></LeftView>
      </el-col>
      <el-col :span="6" :offset="0">
        <RightView :activeIndex="activeIndex"></RightView>
      </el-col>
    </el-row>
    

  </el-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'MiddleView'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import LeftView from './components/LeftView/index.vue'
import RightView from './components/RightView/index.vue'


const activeIndex = ref('1')
const handleSelect = (index: string) => {
  activeIndex.value = index
}

const radio = ref('今日')
const size = ref<'' | 'large' | 'small'>('')

const value = ref('')
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 0 20px;
}

.header {
  display: flex;
  align-items: center;

  .el-menu--horizontal {
    border: none;
    flex: 5
  }

  .radio {
    margin-right: 10px;
  }
}
.line{
  height:1px;
  background-color: #aaa;
}
</style>
