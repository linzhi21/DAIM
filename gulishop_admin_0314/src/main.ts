import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import CategorySelector from '@/components/CategorySelector/index.vue'
import HasBtn from './directives/hasbtn'
import {vueEcharts} from '@/plugins/echarts'
import '@/mock'
import PublicCard from '@/views/home/components/TopView/components/PublicCard/index.vue'




// import userApi from '@/api/userInfo'
// userApi.userLogin({username:'admin',password:'111111'})

const app = createApp(App)


app.component('CategorySelector',CategorySelector)
app.component('PublicCard',PublicCard)
// ElSvg(app)
// HasBtn(app)


app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(HasBtn)
app.use(ElSvg)
app.use(vueEcharts)
app.mount('#app')
