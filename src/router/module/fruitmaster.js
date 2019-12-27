import Main from '@/components/main';

const fruitMasterRouter = [
  {
    path: '/',
    name: 'fruitmaster-home',
    redirect: '/fruitmaster-home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/fruitmaster-home',
      name: 'fruitmaster-home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/fruit-master-manager/single-page/home')
    }]
  },
  {
    path: '/fruit-master-manager-user',
    name: 'fruit-master-manager-user',
    meta: {
      icon: 'md-contacts',
      title: '用户管理'
    },
    component: Main,
    children: [{
      path: 'fruit-master-user',
      name: 'fruit-master-user',
      meta: {
        icon: 'md-person',
        title: '用户管理'
      },
      component: () => import('@/view/fruit-master-manager/user/user.vue')
    }]
  },
  {
    path: '/fruit-master-manager',
    name: 'fruit-master-manager',
    meta: {
      icon: 'ios-contacts',
      title: '鲜果师管理'
    },
    component: Main,
    children: [{
      path: 'application',
      name: 'application',
      meta: {
        icon: 'md-clipboard',
        title: '鲜果师申请'
      },
      component: () => import('@/view/fruit-master-manager/master/application.vue')
    },
    {
      path: 'salary',
      name: 'salary',
      meta: {
        icon: 'logo-yen',
        title: '薪资管理'
      },
      component: () => import('@/view/fruit-master-manager/master/salary.vue')
    },
    {
      path: 'fruit-manager',
      name: 'fruit-manager',
      meta: {
        icon: 'ios-contacts',
        title: '鲜果师管理'
      },
      component: () => import('@/view/fruit-master-manager/master/manager.vue')
    }
    ]
  },
  {
    path: '/fruit-master-manager-goods',
    name: 'fruit-master-manager-goods',
    meta: {
      icon: 'md-nutrition',
      title: '商品管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-goods-category',
      name: 'fruit-master-goods-category',
      meta: {
        icon: 'md-pricetag',
        title: '商品分类管理'
      },
      component: () => import('@/view/fruit-master-manager/goods/goods-category.vue')
    },
    {
      path: '/fruit-master-goods-message',
      name: 'fruit-master-goods-message',
      meta: {
        icon: 'md-menu',
        title: '商品信息管理'
      },
      component: () => import('@/view/fruit-master-manager/goods/goods-message.vue')
    },
    {
      path: '/fruit-master-goods-on-sale',
      name: 'fruit-master-goods-on-sale',
      meta: {
        icon: 'ios-share',
        title: '商品上架管理'
      },
      component: () => import('@/view/fruit-master-manager/goods/goods-on-sale.vue')
    }
    ]
  }, {
    path: '/fruit-master-manager-content',
    name: 'fruit-master-manager-content',
    meta: {
      icon: 'ios-create',
      title: '内容管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-content-article',
      name: 'fruit-master-content-article',
      meta: {
        icon: 'ios-list-box',
        title: '文章管理'
      },
      component: () => import('@/view/fruit-master-manager/content/article.vue')
    },
    {
      path: '/fruit-master-content-feedback',
      name: 'fruit-master-content-feedback',
      meta: {
        icon: 'md-paper',
        title: '用户反馈'
      },
      component: () => import('@/view/fruit-master-manager/content/feedback.vue')
    }]
  }, {
    path: '/fruit-master-manager-page',
    name: 'fruit-master-manager-page',
    meta: {
      icon: 'md-grid',
      title: '页面板块管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-page-module-position',
      name: 'fruit-master-page-module-position',
      meta: {
        icon: 'md-flag',
        title: '板块位置管理'
      },
      component: () => import('@/view/fruit-master-manager/page/module-position.vue')
    },
    {
      path: '/fruit-master-page-advertisement',
      name: 'fruit-master-page-advertisement',
      meta: {
        icon: 'ios-megaphone',
        title: '广告管理'
      },
      component: () => import('@/view/fruit-master-manager/page/advertisement.vue')
    },
    {
      path: '/fruit-master-page-goods-module',
      name: 'fruit-master-page-goods-module',
      meta: {
        icon: 'ios-basket',
        title: '商品板块管理'
      },
      component: () => import('@/view/fruit-master-manager/page/goods-module.vue')
    },
    {
      path: '/fruit-master-page-articles-module',
      name: 'fruit-master-page-articles-module',
      meta: {
        icon: 'md-bookmarks',
        title: '文章板块管理'
      },
      component: () => import('@/view/fruit-master-manager/page/articles-module.vue')
    },
    {
      path: '/fruit-master-page-custom-module',
      name: 'fruit-master-page-custom-module',
      meta: {
        icon: 'md-basket',
        title: '定制板块管理'
      },
      component: () => import('@/view/fruit-master-manager/page/custom-module.vue')
    }
    ]
  }, {
    path: '/fruit-master-manager-custom',
    name: 'fruit-master-manager-custom',
    meta: {
      icon: 'md-basket',
      title: '定制管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-custom-plan',
      name: 'fruit-master-custom-plan',
      meta: {
        icon: 'md-albums',
        title: '定制计划管理'
      },
      component: () => import('@/view/fruit-master-manager/custom/custom-plan.vue')
    },
    {
      path: '/custom_plan_specification_standard',
      name: 'custom_plan_specification_standard',
      meta: {
        icon: 'md-albums',
        title: '定制套餐配图管理'
      },
      component: () => import('@/view/fruit-master-manager/custom/specification-standard.vue')
    }
    ]
  }, {
    path: '/fruit-master-manager-order',
    name: 'fruit-master-manager-order',
    meta: {
      icon: 'md-cart',
      title: '订单管理'
    },
    component: Main,
    children: [{
      path: 'fruit-master-normal-order',
      name: 'fruit-master-normal-order',
      meta: {
        icon: 'ios-cart',
        title: '普通订单管理'
      },
      component: () => import('@/view/fruit-master-manager/order/normal-order.vue')
    },
    {
      path: 'fruit-master-custom-order',
      name: 'fruit-master-custom-order',
      meta: {
        icon: 'ios-cart-outline',
        title: '定制订单管理'
      },
      component: () => import('@/view/fruit-master-manager/order/custom-order.vue')
    },
    {
      path: 'fruit-master-return-order',
      name: 'fruit-master-return-order',
      meta: {
        icon: 'ios-cart-outline',
        title: '退货订单管理'
      },
      component: () => import('@/view/fruit-master-manager/order/return-order.vue')
    }
    ]
  }, {
    path: '/fruit-master-manager-rule-parameters',
    name: 'fruit-master-manager-rule-parameters',
    meta: {
      icon: 'md-nuclear',
      title: '规则参数管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-postage-rule-settings',
      name: 'fruit-master-postage-rule-settings',
      meta: {
        icon: 'md-bicycle',
        title: '邮费规则配置'
      },
      component: () => import('@/view/fruit-master-manager/rule-parameters/postage-rule-settings.vue')
    }]
  }, {
    path: '/fruit-master-manager-activity',
    name: 'fruit-master-manager-activity',
    meta: {
      icon: 'ios-analytics',
      title: '活动管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-new-try-activity',
      name: 'fruit-master-new-try-activity',
      meta: {
        icon: 'md-beer',
        title: '新品尝鲜活动'
      },
      component: () => import('@/view/fruit-master-manager/activity/new-try-activity.vue')
    }]
  }, {
    path: '/fruit-master-manager-store',
    name: 'fruit-master-manager-store',
    meta: {
      icon: 'ios-analytics',
      title: '门店管理'
    },
    component: Main,
    children: [{
      path: '/fruit-master-store-message',
      name: 'fruit-master-store-message',
      meta: {
        icon: 'md-beer',
        title: '门店信息管理'
      },
      component: () => import('@/view/fruit-master-manager/store/store-message.vue')
    }]
  }];

export default fruitMasterRouter
