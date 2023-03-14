import * as $echarts from 'echarts'
// 原生的我们引入完成就是一个对象，后期直接暴露出去去使用就可以创建图表
import type {App} from 'vue'
import VueEcharts from 'vue-echarts'
// 这个是vue的插件，引入之后，我们是需要把引入的组件全局注册

const vueEcharts = (app:App) => {
  app.component('v-chart',VueEcharts)
}

export {
  $echarts,
  vueEcharts
}



