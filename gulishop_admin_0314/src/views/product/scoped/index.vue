<template>
  <h2>我爱你赵丽颖</h2>
  <span>我爱你</span>
  <Child></Child>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ScopedTest'
})
</script>
<script lang="ts" setup>
import Child from './Child.vue'

</script>

<style scoped>
:deep(h2) {
  color: hotpink
}
</style>
