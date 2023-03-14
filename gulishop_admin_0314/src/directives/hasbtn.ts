// 函数是作为插件使用的，函数内部就是给app自定义一个全局的指令
import type {App} from 'vue'
import {useUserInfoStore} from '@/stores/userInfo'
import pinia from '@/stores/index'
// 作用就是对所有的按钮，进行鉴权处理
// 按钮级别权限的控制
function hasBtnPermission(app:App){
  // 上面写的简写，但是它会在挂载完成及更新阶段都会执行
  // app.directive('has',(el,bindings) => {
  //   // console.log(el,bindings);
    // if(useUserInfoStore(pinia).userInfo.buttons.indexOf(bindings.value) === -1){
    //   el.parentNode.removeChild(el)
    // }
  // })

  // 只会在挂载完成后去执行
  app.directive('has',{
    mounted(el,bindings){
      if(useUserInfoStore(pinia).userInfo.buttons.indexOf(bindings.value) === -1){
        el.parentNode.removeChild(el)
      }
    }
  })
}

export default hasBtnPermission