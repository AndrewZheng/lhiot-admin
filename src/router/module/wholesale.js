import Main from '@/components/main';

const wholesaleRouter = [{
  path: '/wholesale-goods-manager',
  name: 'wholesale-goods-manager',
  meta: {
    icon: 'md-menu',
    title: '商品管理'
  },
  component: Main,
  children: [{
    path: '/wholesale-goods-category',
    name: 'wholesale-goods-category',
    meta: {
      icon: 'ios-albums',
      title: '商品分类管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-category.vue')
  },
  {
    path: '/wholesale-goods-unit',
    name: 'wholesale-goods-unit',
    meta: {
      icon: 'ios-barcode',
      title: '商品单位管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-unit.vue')
  },
  {
    path: '/wholesale-goods-info',
    name: 'wholesale-goods-info',
    meta: {
      icon: 'md-menu',
      title: '基础商品管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-message.vue')
  },
  {
    path: '/wholesale-goods-standard',
    name: 'wholesale-goods-standard',
    meta: {
      icon: 'md-podium',
      title: '商品规格管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-standard.vue')
  },
  {
    path: '/wholesale-goods-section',
    name: 'wholesale-goods-section',
    meta: {
      icon: 'ios-apps',
      title: '板块管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/section.vue')
  },
  {
    path: '/wholesale-goods-section-relation',
    name: 'wholesale-goods-section-relation',
    meta: {
      icon: 'md-keypad',
      title: '商品板块管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-section.vue')
  },
  {
    path: '/wholesale-goods-keywords',
    name: 'wholesale-goods-keywords',
    meta: {
      icon: 'ios-home',
      title: '关键字管理'
    },
    component: () => import('@/view/wholesale-mall-manager/goods/goods-keywords.vue')
  }
  ]
},
{
  path: '/wholesale-user-manage',
  name: 'wholesale-user-manage',
  meta: {
    icon: 'md-menu',
    title: '会员管理'
  },
  component: Main,
  children: [{
    path: '/wholesale-user-info',
    name: 'wholesale-user-info',
    meta: {
      icon: 'ios-albums',
      title: '会员查询'
    },
    component: () => import('@/view/wholesale-mall-manager/user/user-info.vue')
  },
  {
    path: '/wholesale-user-analysis',
    name: 'wholesale-user-analysis',
    meta: {
      icon: 'ios-albums',
      title: '会员分析'
    },
    component: () => import('@/view/wholesale-mall-manager/user/user-analysis.vue')
  }
  ]
},
{
  path: '/wholesale-order-manage',
  name: 'wholesale-order-manage',
  meta: {
    icon: 'md-menu',
    title: '订单管理'
  },
  component: Main,
  children: [{
    path: '/wholesale-order',
    name: 'wholesale-order',
    meta: {
      icon: 'ios-albums',
      title: '订单查询'
    },
    component: () => import('@/view/wholesale-mall-manager/order/orders.vue')
  },
  {
    path: '/wholesale-order-analysis',
    name: 'wholesale-order-analysis',
    meta: {
      icon: 'ios-albums',
      title: '今日订单商品查询'
    },
    component: () => import('@/view/wholesale-mall-manager/order/order-analysis.vue')
  },
  {
    path: '/wholesale-order-aftersale',
    name: 'wholesale-order-aftersale',
    meta: {
      icon: 'ios-albums',
      title: '售后订单'
    },
    component: () => import('@/view/wholesale-mall-manager/order/order-aftersale.vue')
  }
  ]
},
{
  path: '/wholesale-activity-manage',
  name: 'wholesale-activity-manage',
  meta: {
    icon: 'md-menu',
    title: '活动管理'
  },
  component: Main,
  children: [{
    path: '/wholesale-activity',
    name: 'wholesale-activity',
    meta: {
      icon: 'ios-book',
      title: '统一活动管理'
    },
    component: () => import('@/view/wholesale-mall-manager/activity/activities.vue')
  },
  {
    path: '/wholesale-coupon-template',
    name: 'wholesale-coupon-template',
    meta: {
      icon: 'md-map',
      title: '优惠券模板管理'
    },
    component: () => import('@/view/wholesale-mall-manager/activity/coupon-template.vue')
  },
  {
    path: '/wholesale-coupon-config',
    name: 'wholesale-coupon-config',
    meta: {
      icon: 'md-pricetags',
      title: '优惠券配置管理'
    },
    component: () => import('@/view/wholesale-mall-manager/activity/coupon-config.vue')
  },
  {
    path: '/wholesale-coupon',
    name: 'wholesale-coupon',
    meta: {
      icon: 'md-pricetags',
      title: '优惠券查询'
    },
    component: () => import('@/view/wholesale-mall-manager/activity/coupon.vue')
  },
  {
    path: '/wholesale-recharge',
    name: 'wholesale-recharge',
    meta: {
      icon: 'md-card',
      title: '充值活动'
    },
    component: () => import('@/view/wholesale-mall-manager/activity/recharge.vue')
  }
  ]
}
]

export default wholesaleRouter;
