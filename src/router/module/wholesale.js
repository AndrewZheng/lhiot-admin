import Main from '@/components/main';

const wholesaleRouter = [
  {
    path: '/wholesale-home',
    name: 'wholesale-home',
    component: Main,
    meta: {
      hideInBread: true,
      title: '批发小程序'
    },
    children: [{
      path: '/wholesale-home',
      name: 'wholesale-home',
      meta: {
        icon: 'md-home',
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/wholesale-mall-manager/single-page/home')
    }]
  },
  {
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
        icon: 'md-barcode',
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
      path: '/wholesale-goods-relation-standard',
      name: 'wholesale-goods-relation-standard',
      meta: {
        hideInMenu: true,
        icon: 'md-menu',
        title: '商品关联规格'
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
        icon: 'ios-key-outline',
        title: '关键字管理'
      },
      component: () => import('@/view/wholesale-mall-manager/goods/goods-keywords.vue')
    }
    // {
    //   path: '/wholesale-goods-demand',
    //   name: 'wholesale-goods-demand',
    //   meta: {
    //     icon: 'ios-list-box',
    //     title: '新品需求管理'
    //   },
    //   component: () => import('@/view/wholesale-mall-manager/goods/goods-demand.vue')
    // }
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
        icon: 'ios-eye',
        title: '会员查询'
      },
      component: () => import('@/view/wholesale-mall-manager/user/user-info.vue')
    },
    {
      path: '/wholesale-user-analysis',
      name: 'wholesale-user-analysis',
      meta: {
        icon: 'md-analytics',
        title: '会员分析'
      },
      component: () => import('@/view/wholesale-mall-manager/user/user-analysis.vue')
    },
    {
      path: '/wholesale-salesman-analysis',
      name: 'wholesale-salesman-analysis',
      meta: {
        icon: 'md-analytics',
        title: '业务员业绩分析'
      },
      component: () => import('@/view/wholesale-mall-manager/user/salesman-analysis.vue')
    },
    {
      path: '/wholesale-salesman-store-analysis',
      name: 'wholesale-salesman-store-analysis',
      meta: {
        hideInMenu: true,
        icon: 'md-analytics',
        title: '业务员门店业绩分析'
      },
      component: () => import('@/view/wholesale-mall-manager/user/salesman-store-analysis.vue')
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
        icon: 'ios-eye',
        title: '订单查询'
      },
      component: () => import('@/view/wholesale-mall-manager/order/orders.vue')
    },
    {
      path: '/wholesale-order-analysis',
      name: 'wholesale-order-analysis',
      meta: {
        icon: 'ios-eye',
        title: '订单商品查询'
      },
      component: () => import('@/view/wholesale-mall-manager/order/order-analysis.vue')
    },
    {
      path: '/wholesale-payment-log',
      name: 'wholesale-payment-log',
      meta: {
        icon: 'ios-eye',
        title: '支付流水查询'
      },
      component: () => import('@/view/wholesale-mall-manager/order/payment-log.vue')
    },
    {
      path: '/wholesale-refund-log',
      name: 'wholesale-refund-log',
      meta: {
        icon: 'ios-eye',
        title: '退款流水查询'
      },
      component: () => import('@/view/wholesale-mall-manager/order/refund-log.vue')
    },
    {
      path: '/wholesale-order-aftersale',
      name: 'wholesale-order-aftersale',
      meta: {
        icon: 'ios-albums',
        title: '售后订单'
      },
      component: () => import('@/view/wholesale-mall-manager/order/order-aftersale.vue')
    },
    {
      path: '/wholesale-finance-audit',
      name: 'wholesale-finance-audit',
      meta: {
        icon: 'ios-albums',
        title: '财务审核'
      },
      component: () => import('@/view/wholesale-mall-manager/order/finance-audit.vue')
    },
    {
      path: '/wholesale-report',
      name: 'wholesale-report',
      meta: {
        icon: 'ios-paper',
        title: '销售报表'
      },
      component: () => import('@/view/wholesale-mall-manager/order/report.vue')
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
        title: '充值活动',
        hideInMenu: true
      },
      component: () => import('@/view/wholesale-mall-manager/activity/recharge.vue')
    },
    {
      path: '/wholesale-register-reward',
      name: 'wholesale-register-reward',
      meta: {
        icon: 'md-basket',
        title: '注册送礼活动',
        hideInMenu: true
      },
      component: () => import('@/view/wholesale-mall-manager/activity/register-reward.vue')
    },
    {
      path: '/wholesale-flashsale',
      name: 'wholesale-flashsale',
      meta: {
        icon: 'md-basket',
        title: '限时抢购活动',
        hideInMenu: true
      },
      component: () => import('@/view/wholesale-mall-manager/activity/flashsale.vue')
    }
    ]
  },
  {
    path: '/wholesale-content-manage',
    name: 'wholesale-content-manage',
    meta: {
      icon: 'md-menu',
      title: '内容管理'
    },
    component: Main,
    children: [
      {
        path: '/wholesale-unifyExport',
        name: 'wholesale-unifyExport',
        meta: {
          icon: 'md-archive',
          title: '统一导出'
        },
        component: () => import('@/view/wholesale-mall-manager/content/unifyExport.vue')
      },
      {
        path: '/wholesale-advertisement',
        name: 'wholesale-advertisement',
        meta: {
          icon: 'ios-desktop',
          title: '广告位管理'
        },
        component: () => import('@/view/wholesale-mall-manager/content/advertisement.vue')
      },
      // {
      //   path: '/wholesale-service',
      //   name: 'wholesale-service',
      //   meta: {
      //     icon: 'ios-paper',
      //     title: '服务协议'
      //   },
      //   component: () => import('@/view/wholesale-mall-manager/content/feedback.vue')
      // },
      {
        path: '/wholesale-faq-category',
        name: 'wholesale-faq-category',
        meta: {
          icon: 'ios-albums',
          title: '常见问题分类'
        },
        component: () => import('@/view/wholesale-mall-manager/content/faq-category.vue')
      },
      {
        path: '/wholesale-faq',
        name: 'wholesale-faq',
        meta: {
          icon: 'md-help',
          title: '常见问题'
        },
        component: () => import('@/view/wholesale-mall-manager/content/faq.vue')
      },
      {
        path: '/wholesale-article',
        name: 'wholesale-article',
        meta: {
          icon: 'ios-list-box',
          title: '热点资讯'
        },
        component: () => import('@/view/wholesale-mall-manager/content/article.vue')
      },
      {
        path: '/wholesale-article-edit',
        name: 'wholesale-article-edit',
        meta: {
          hideInMenu: true,
          icon: 'md-basket',
          title: '文章编辑'
        },
        component: () => import('@/view/wholesale-mall-manager/content/article-edit.vue')
      }]
  },
  {
    path: '/wholesale-system-manager',
    name: 'wholesale-system-manager',
    meta: {
      icon: 'md-menu',
      title: '系统参数管理'
    },
    component: Main,
    children: [{
      path: '/wholesale-system',
      name: 'wholesale-system',
      meta: {
        icon: 'logo-buffer',
        title: '系统参数管理'
      },
      component: () => import('@/view/wholesale-mall-manager/system/system.vue')
    },
    {
      path: '/wholesale-system-category',
      name: 'wholesale-system-category',
      meta: {
        icon: 'md-list-box',
        title: '参数分类管理'
      },
      component: () => import('@/view/wholesale-mall-manager/system/system-category.vue')
    }]
  }]

export default wholesaleRouter;
