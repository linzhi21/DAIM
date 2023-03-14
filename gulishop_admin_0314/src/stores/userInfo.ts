import { defineStore } from 'pinia';
import {ElMessage} from 'element-plus'
import {staticRoutes,allAsyncRoutes,anyRoute} from '@/router/routes'
import type{LoginParamsData,UserInfoData} from '@/api/userInfo'
import userApi from '@/api/userInfo'
import type {RouteRecordRaw} from 'vue-router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'


// 这个函数就是专门让用户登录后从配置的所有异步路由数组中过滤自己的异步路由
function filterAsyncRoutes(allAsyncRoutes:RouteRecordRaw[],routeNames:string[]){
  return allAsyncRoutes.filter(item => {
    // 只能过滤出一级路由，二级路由我们是没有过滤过，直接全部拿走，这样不对
    // 所以我们还要对二级路由再次进行过滤，要用递归
    if(routeNames.indexOf(item.name as string) !== -1){
      // 过滤出二级路由
      if(item.children && item.children.length){
        // 下面就过滤出用户想要的二级路由数组，把原本的覆盖掉
        // 这行代码会出现一个bug，它会把allAsyncRoutes路由数组里面的二级路由数组给换
        // 成过滤出来的新数组地址，导致整个二级路由发生变化
        // 所以后期我们在过滤的时候，要深拷贝一份，再去过滤
        item.children = filterAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
}


// 这个函数是专门往路由器内部去动态添加注册路由用的
function addRoutes(routes:RouteRecordRaw[]){
  // 下面这个方法是vue-router给我们的api,但是缺陷是每次只能添加一个路由对象
  // 所以我们封装方法，去一次添加一个数组所有路由
  routes.forEach(item => {
    router.addRoute(item) //每次只能添一个
  })
}

// 这个函数是专门用于重置路由的
function resetRoutes(staticRoutes:RouteRecordRaw[]){
  // 1、先删除路由器当中注册的所有路由
  let routes = router.getRoutes() //获取路由器当中的所有路由组成的数组
  routes.forEach(item => {
    if(item.name){
      router.removeRoute(item.name)
    }
  })
  // 2、再把路由器当中动态添加静态路由
  addRoutes(staticRoutes)
}


// 定义store仓库的state返回的对象数据类型

type UserStoreStateData = {
  token:string,
  userInfo:UserInfoData,
  menuRoutes:RouteRecordRaw[]
}

function initUserInfo():UserInfoData{
  return {
    routes: [],
    buttons: [],
    roles: [],
    name: '',
    avatar: ''
  }
}

export const useUserInfoStore = defineStore('userInfo', {
	state: ():UserStoreStateData => ({
    token: localStorage.getItem('token_key') || '',
    userInfo:initUserInfo(),
    menuRoutes: []  
    //和页面侧边栏每一项相关，侧边栏每一项都是根据配置的路由遍历动态生成的
  }),

	actions: {
    async login(loginParams:LoginParamsData){
      try {
        const result = await userApi.userLogin(loginParams)
        this.token = result.token
        localStorage.setItem('token_key',result.token)
        return 'ok'
      } catch (error) {
        return Promise.reject(new Error('failed'))
      }
    },
    async getInfo(){
      try {
        const result = await userApi.getUserInfo()
        this.userInfo = result  //存储用户信息
        // 1》用户获取信息成功，之后，我们需要根据用户的routes（它是字符串）
        // 从配置的所有的异步路由数组当中过滤出当前这个用户所需要的异步路由
        let userAsyncRoutes = filterAsyncRoutes(cloneDeep(allAsyncRoutes),result.routes)
        // 2》拿到了用户自己的异步路由之后，路由器内部目前只注册了常量路由，
        // 还要把过滤出来的动态路由，要动态添加到路由器当中，同时把任意路由添加注册到最后一位
        addRoutes(userAsyncRoutes.concat(anyRoute))
        // 路由器当中的路由注册完成，是为了后期点击菜单可以跳转，但是菜单也是需要遍历
        // 路由当中注册的路由来动态生成的，因此遍历生成菜单的路由数组也要发生变化

        // 3》修改我们的menuRoutes数据，让他是最新的路由器当中注册的路由数组，然后菜单就会变成我们最新的
        this.menuRoutes = staticRoutes.concat(userAsyncRoutes,anyRoute)
        
        return 'ok'
      } catch (error) {
        return Promise.reject(new Error('failed'))
      }
    },
    // 路由守卫当中获取用户信息失败，我们需要重置token和用户信息，重新跳转到登录页
    reset(){
      this.token = ''
      localStorage.removeItem('token_key')
      // this.userInfo = {}
      Object.assign(this.userInfo,initUserInfo()) //清空所有的用户信息
    },

    async logout(){
      try {
        await userApi.userLogout()
        this.reset() //退出登录成功后删除所有的token和用户信息

        // 重置路由器，把路由器当中注册的路由再换成staticRoutes
        resetRoutes(staticRoutes)
        return 'ok'
      } catch (error) {
        return Promise.reject(new Error('failed'))
      }
    }
	},
});
