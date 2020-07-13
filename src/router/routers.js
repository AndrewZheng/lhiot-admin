import Main from '@/components/main';

import commonSystemRouters from './module/common';
import miniMallRoters from './module/minimall';
import wholesaleRouters from './module/wholesale';
import fruitMasterRouters from './module/fruitmaster';

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export const constantRouterMap = [
  {
    path: '/redirect',
    name: 'redirect',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/view/redirect/index.vue')
    }]
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/basic-manager/single-page/home')
    }]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/404',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'md-add',
          title: '导入EXCEL'
        },
        component: () => import('@/view/basic-manager/excel/upload-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '导出EXCEL'
        },
        component: () => import('@/view/basic-manager/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/fruit-master-goods-manager-goods-standard',
    name: 'fruit-master-goods-manager-goods-standard',
    meta: {
      icon: 'md-menu',
      title: '商品规格管理'
    },
    component: Main,
    children: [
      {
        path: 'goods-standard',
        name: 'goods-standard',
        meta: {
          icon: 'md-menu',
          title: '商品规格管理'
        },
        component: () => import('@/view/fruit-master-manager/goods/goods-standard.vue')
      }
    ]
  },
  {
    path: '/fruit-master-goods-manager-goods-detail',
    name: 'fruit-master-goods-manager-goods-detail',
    meta: {
      icon: 'md-menu',
      title: '商品规格管理'
    },
    component: Main,
    children: [
      {
        path: 'goods-detail',
        name: 'goods-detail',
        meta: {
          icon: 'md-menu',
          title: '详情组合图片'
        },
        component: () => import('@/view/fruit-master-manager/goods/goods-detail.vue')
      }
    ]
  },
  {
    path: '/fruit-master-content-article-edit',
    name: 'fruit-master-content-article-edit',
    meta: {
      icon: 'md-menu',
      title: '文章新增/编辑'
    },
    component: Main,
    children: [      
      {
        path: 'article-edit',
        name: 'article-edit',
        meta: {
          icon: 'ios-list-box',
          title: '文章新增/编辑'
        },
        component: () => import('@/view/fruit-master-manager/content/edit-article.vue')
      }
    ]
  },
  {
    path: '/small-manager-detail',
    name: 'small-manager-detail',
    meta: {
      icon: 'md-menu',
      title: '小程序跳转页面集合'
    },
    component: Main,
    children: [
      {
        path: 'small-goods-relation-standard',
        name: 'small-goods-relation-standard',
        meta: {
          icon: 'md-menu',
          title: '商品关联规格'
        },
        component: () => import('@/view/mini-program-manager/goods/goods-standard.vue')
      },
      {
        path: 'small-relation-system',
        name: 'small-relation-system',
        meta: {
          icon: 'logo-buffer',
          title: '系统参数管理'
        },
        component: () => import('@/view/mini-program-manager/system/system.vue')
      },
      {
        path: 'small-activity-relation-coupon',
        name: 'small-activity-relation-coupon',
        meta: {
          icon: 'md-menu',
          title: '活动关联优惠券模板'
        },
        component: () => import('@/view/mini-program-manager/activity/coupon-relation.vue')
      },
      {
        path: 'small-vip-activities-associated',
        name: 'small-vip-activities-associated',
        meta: {
          icon: 'md-menu',
          title: '活动关联优惠券模板'
        },
        component: () => import('@/view/mini-program-manager/vip/activities-associated.vue')
      },{
        path: 'small-order-coupon-details',
        name: 'small-order-coupon-details',
        meta: {
          icon: 'md-menu',
          title: '用券数据'
        },
        component: () => import('@/view/mini-program-manager/order/coupon-details.vue')
      },{
        path: 'small-order-month-orders',
        name: 'small-order-month-orders',
        meta: {
          icon: 'md-menu',
          title: '跨月退款订单'
        },
        component: () => import('@/view/mini-program-manager/order/month-orders.vue')
      }
      
    ],
  },
  {
    path: '/wholesale-manager-detail',
    name: 'wholesale-manager-detail',
    meta: {
      icon: 'md-menu',
      title: '批发小程序跳转页面集合'
    },
    component: Main,
    children: [
      {
        path: 'wholesale-goods-relation-standard',
        name: 'wholesale-goods-relation-standard',
        meta: {
          icon: 'md-menu',
          title: '商品关联规格'
        },
        component: () => import('@/view/wholesale-mall-manager/goods/goods-standard.vue')
      },
      {
        path: '/wholesale-article-edit',
        name: 'wholesale-article-edit',
        meta: {
          icon: 'md-basket',
          title: '文章编辑'
        },
        component: () => import('@/view/wholesale-mall-manager/content/article-edit.vue')
      },
    ]
  }
];

export const asyncRouterMap = [
  ...miniMallRoters,
  ...wholesaleRouters,
  ...fruitMasterRouters,
  ...commonSystemRouters,
];

export default [
  ...constantRouterMap,
  ...asyncRouterMap
]
