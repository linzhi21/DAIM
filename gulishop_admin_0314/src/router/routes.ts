import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（常量路由）
 */
// 这里面放的是所有用户都能无条件看到的菜单路由
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',   //为了在侧边栏每一项显示
        icon: 'ele-HomeFilled',
        //为了侧边栏每一项的图标，这个图标按道理来讲每个一级路由才会出现图标
        // 但是如果这个一级路由的子路由只有一个，那么当前这个一级路由不应该出现菜单
        // 二级路由直接升级成为一级路由的菜单，图标也应该在二级路由身上
      }
    }]
  },
];

// 异步路由（动态路由）
// 这里面放的是所有的需要根据用户菜单权限信息数据过滤的动态路由
export const allAsyncRoutes: RouteRecordRaw[] = [
  // 商品管理 也是一个一级路由，包含了4个二级路由
  {
    path: '/product',
    name: 'Product', //这个名字代表命名路由，后期是要在权限控制当中去使用的，必须配而且名字必须固定，不能变
    component: () => import('@/layout/index.vue'),
    // redirect:'', //不需要重定向，因为它跳转不了，变为箭头，进行展开和合并二级路由菜单了

    // 如果一级路由里面有多个二级路由，那么一级路由的meta需要配置，并且要带标题和图标
    // 如果一级路由里面只有一个二级路由，那么一级路由后面就会被唯一的二级路由替代，直接
    // 让二级路由称为一级路由的菜单，带图标和标题
    meta: {
      title: '商品管理',
      icon: 'ele-Goods'
    },
    children: [
      {
        path: 'trademark/list',
        component: () => import('@/views/product/trademark/index.vue'),
        // 如果一级路由有菜单并且有图标和标题，那么二级路由只需要配置标题就可以了
        // 不需要配置图标
        meta: {
          title: '品牌管理'
        },
        name: 'Trademark'
      },
      {
        path: 'attr/list',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '平台属性管理'
        },
        name: 'Attr'
      },
      {
        path: 'sku/list',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'Sku管理'
        },
        name: 'Sku'
      },
      {
        path: 'spu/list',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'Spu管理'
        },
        name: 'Spu'
      },
      {
        path: 'scoped/list',
        component: () => import('@/views/product/scoped/index.vue'),
        meta: {
          title: 'Scoped测试'
        },
        name: 'Scoped'
      },
    ]
  },
  {
    path: "/acl",
    name: "Acl",
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "ele-Setting",
    },
    children: [
      {
        name: "User",
        path: "/acl/user/list",
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "/acl/role/list",
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "/acl/role/auth",
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: "角色管理",
          hidden: true,
          activeMenu: "/acl/role/list",
        },
      },
      {
        name: "Permission",
        path: "/acl/permission/list",
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  {
    path:'/test',
    component:() => import('@/layout/index.vue'),
    name:'Test',
    meta:{
      title:'测试管理',
      icon:'ele-Star'
    },
    children:[
      {
        path:'test1/list',
        component:() => import('@/views/test/test1/index.vue'),
        name:'Test1',
        meta:{
          title:'测试111'
        }
      },
      {
        path:'test2/list',
        component:() => import('@/views/test/test2/index.vue'),
        name:'Test2',
        meta:{
          title:'测试222'
        }
      },
    ]
  }
]

// 任意路由（一定要注册在路由器的最后一位，重定向到404）
export const anyRoute: RouteRecordRaw = /* 匹配任意的路由 必须最后注册 */
{
  path: '/:pathMatch(.*)',
  name: 'Any',
  redirect: '/404',
  meta: {
    hidden: true
  }
}


