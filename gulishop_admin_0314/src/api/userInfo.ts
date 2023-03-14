import request from '@/utils/request'

// 每个接口函数文件当中都要考虑定义两种类型：1、参数的类型 2、返回数据的类型

export interface LoginParamsData {
  username: string,
  password: string
}


interface TokenData {
  token:string
}

export interface UserInfoData {
  routes: string[]
  buttons: string[],
  roles: string[]
  name: string,
  avatar: string
}

export default {
  //   GET /admin/acl/index/info
  //   info
  getUserInfo() {
    return request.get<any,UserInfoData>('/admin/acl/index/info')
  },
  //   POST /admin/acl/index/login
  //   login
  userLogin(loginParams: LoginParamsData) {
    // post或者get等等，都定义了泛型，三个泛型当中的第二个决定返回的promise成功的结果
    // 言外之意，我们给第二个泛型传递什么，返回的promise，成功的结果就是什么
    return request.post<any,TokenData>('/admin/acl/index/login', loginParams)
  },
  //   POST /admin/acl/index/logout
  userLogout(){
    return request.post<any,null>('/admin/acl/index/logout')
  }
}


