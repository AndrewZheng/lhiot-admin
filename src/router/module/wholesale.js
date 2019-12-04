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
}]

export default wholesaleRouter;
