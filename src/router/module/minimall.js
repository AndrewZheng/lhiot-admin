import Main from '@/components/main';

const miniMallRouter = [
  {
    path: '/wechat-home',
    name: 'wechat-home',
    component: Main,
    meta: {
      hideInBread: true,
      title: '商城小程序'
    },
    children: [{
      path: '/wechat-home',
      name: 'wechat-home',
      meta: {
        icon: 'md-home',
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/mini-program-manager/single-page/home')
    }]
  },
  {
    path: '/small-goods-manager',
    name: 'small-goods-manager',
    meta: {
      icon: 'md-menu',
      title: '商品管理'
    },
    component: Main,
    children: [{
      path: '/small-goods-category',
      name: 'small-goods-category',
      meta: {
        icon: 'ios-paper',
        title: '商品分类管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-category.vue')
    },
    {
      path: '/small-goods-unit',
      name: 'small-goods-unit',
      meta: {
        icon: 'ios-paper',
        title: '商品单位管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-unit.vue')
    },
    {
      path: '/small-goods-info',
      name: 'small-goods-info',
      meta: {
        icon: 'ios-paper',
        title: '基础商品管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-message.vue')
    },
    {
      path: '/small-goods-standard',
      name: 'small-goods-standard',
      meta: {
        icon: 'ios-paper',
        title: '商品规格管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-standard.vue')
    },
    {
      path: 'small-goods-relation-standard',
      name: 'small-goods-relation-standard',
      meta: {
        hideInMenu: true,
        icon: 'ios-paper',
        title: '商品关联规格'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-standard.vue')
    },

    {
      path: '/small-goods-section',
      name: 'small-goods-section',
      meta: {
        icon: 'ios-paper',
        title: '板块管理'
      },
      component: () => import('@/view/mini-program-manager/goods/section.vue')
    },
    {
      path: '/small-goods-section-relation',
      name: 'small-goods-section-relation',
      meta: {
        icon: 'ios-paper',
        title: '商品板块管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-section.vue')
    },
    {
      path: '/small-goods-keywords',
      name: 'small-goods-keywords',
      meta: {
        icon: 'ios-paper',
        title: '商品关键字管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-keywords.vue')
    },
    {
      path: '/small-store',
      name: 'small-store',
      meta: {
        icon: 'ios-home',
        title: '门店管理'
      },
      component: () => import('@/view/mini-program-manager/goods/store-message.vue')
    },
    {
      path: '/small-store-area',
      name: 'small-store-area',
      meta: {
        icon: 'ios-globe',
        title: '门店区域管理'
      },
      component: () => import('@/view/mini-program-manager/goods/store-area.vue')
    }
    ]
  },
  {
    path: '/small-goods-teambuy',
    name: 'small-goods-teambuy',
    meta: {
      icon: 'md-menu',
      title: '预售•团购管理'
    },
    component: Main,
    children: [{
      path: '/small-goods-presellActivity',
      name: 'small-goods-presellActivity',
      meta: {
        icon: 'ios-people',
        title: '预售活动'
      },
      component: () => import('@/view/mini-program-manager/presell/presellActivity.vue')
    },
    {
      path: '/small-goods-activity-teambuy',
      name: 'small-goods-activity-teambuy',
      meta: {
        icon: 'ios-people',
        title: '拼团活动'
      },
      component: () => import('@/view/mini-program-manager/activity/teambuy.vue')
    },
    {
      path: '/small-goods-robot',
      name: 'small-goods-robot',
      meta: {
        icon: 'logo-reddit',
        title: '拼团机器人'
      },
      component: () => import('@/view/mini-program-manager/activity/robot.vue')
    },
    {
      path: '/small-activity-title',
      name: 'small-activity-title',
      meta: {
        icon: 'ios-settings',
        title: '拼团标题设置'
      },
      component: () => import('@/view/mini-program-manager/activity/teambuy-title.vue')
    },
    {
      path: '/small-goods-images',
      name: 'small-goods-images',
      meta: {
        icon: 'md-images',
        title: '图片管理'
      },
      component: () => import('@/view/mini-program-manager/activity/images.vue')
    }]
  },
  {
    path: '/small-activities',
    name: 'small-activities',
    meta: {
      icon: 'md-menu',
      title: '活动配置管理'
    },
    component: Main,
    children: [{
      path: '/small-activity',
      name: 'small-activity',
      meta: {
        icon: 'ios-settings',
        title: '系统活动配置'
      },
      component: () => import('@/view/mini-program-manager/activity/activities.vue')
    },
    {
      path: '/small-coupon-templates',
      name: 'small-coupon-templates',
      meta: {
        icon: 'md-pricetags',
        title: '优惠券模板管理'
      },
      component: () => import('@/view/mini-program-manager/activity/couponTemplate.vue')
    },
    {
      path: '/small-activity-coupon',
      name: 'small-activity-coupon',
      meta: {
        icon: 'md-pricetags',
        title: '优惠券活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/coupon.vue')
    },
    {
      path: 'small-activity-relation-coupon',
      name: 'small-activity-relation-coupon',
      meta: {
        hideInMenu: true,
        icon: 'ios-nuclear',
        title: '活动关联优惠券模板'
      },
      component: () => import('@/view/mini-program-manager/activity/coupon-relation.vue')
    },
    {
      path: '/small-hand-coupon',
      name: 'small-hand-coupon',
      meta: {
        icon: 'ios-nuclear',
        title: '统一发券管理'
      },
      component: () => import('@/view/mini-program-manager/activity/hand-coupon.vue')
    },
    // {
    //   path: '/small-activity-recharge',
    //   name: 'small-activity-recharge',
    //   meta: {
    //     icon: 'md-card',
    //     title: '充值活动管理'
    //   },
    //   component: () => import('@/view/mini-program-manager/activity/recharge.vue')
    // },
    // {
    //   path: '/small-activity-random-discount',
    //   name: 'small-activity-random-discount',
    //   meta: {
    //     icon: 'md-remove-circle',
    //     title: '随机立减活动'
    //   },
    //   component: () => import('@/view/mini-program-manager/activity/random-discount.vue')
    // },
    {
      path: '/small-unifyActivity',
      name: 'small-unifyActivity',
      meta: {
        icon: 'ios-nuclear',
        title: '统一活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/unifyActivity.vue')
    },
    {
      path: '/small-handSendWord',
      name: 'small-handSendWord',
      meta: {
        icon: 'md-hand',
        title: '手动发字管理'
      },
      component: () => import('@/view/mini-program-manager/activity/handSendWord.vue')
    },
    {
      path: '/small-activity-register-reward',
      name: 'small-activity-register-reward',
      meta: {
        icon: 'ios-nuclear',
        title: '注册送礼活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/register-reward.vue')
    },
    {
      path: '/small-newGoods',
      name: 'small-newGoods',
      meta: {
        icon: 'ios-nuclear',
        title: '新品上市活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/newGoods.vue')
    },
    {
      path: '/small-activity-new-product',
      name: 'small-activity-new-product',
      meta: {
        icon: 'ios-nuclear',
        title: '新品尝鲜活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/new-product.vue')
    },
    {
      path: '/small-activity-seckill-product',
      name: 'small-activity-seckill-product',
      meta: {
        icon: 'ios-nuclear',
        title: '限时秒杀活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/seckill-product.vue')
    },
    {
      path: '/small-activity-assist-product',
      name: 'small-activity-assist-product',
      meta: {
        icon: 'ios-nuclear',
        title: '助力抢爆品活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/assist-product.vue')
    },
    // {
    //   path: '/small-activity-flashsale',
    //   name: 'small-activity-flashsale',
    //   meta: {
    //     icon: 'md-clock',
    //     title: '限时抢购管理'
    //   },
    //   component: () => import('@/view/mini-program-manager/activity/flashsale.vue')
    // },
    {
      path: 'small-vip-activities-associated',
      name: 'small-vip-activities-associated',
      meta: {
        hideInMenu: true,
        icon: 'md-menu',
        title: 'VIP活动关联优惠券模板'
      },
      component: () => import('@/view/mini-program-manager/vip/activities-associated.vue')
    },
    {
      path: '/integral-coupon',
      name: 'integral-coupon',
      meta: {
        icon: 'ios-nuclear',
        title: '积分兑换券活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/integral-coupon.vue')
    },
    {
      path: '/integral-entity',
      name: 'integral-entity',
      meta: {
        icon: 'ios-nuclear',
        title: '积分兑换实物活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/integral-entity.vue')
    },
    // {
    //   path: '/small-activity-share-reward',
    //   name: 'small-activity-share-reward',
    //   meta: {
    //     icon: 'md-share',
    //     title: '分享红包活动'
    //   },
    //   component: () => import('@/view/mini-program-manager/activity/share-reward.vue')
    // },
    {
      path: '/small-postage-rule-setting',
      name: 'small-postage-rule-setting',
      meta: {
        icon: 'md-bus',
        title: '邮费管理'
      },
      component: () => import('@/view/mini-program-manager/system/delivery-fee.vue')
    }]
  },
  {
    path: '/small-task',
    name: 'small-task',
    meta: {
      icon: 'md-menu',
      title: '任务配置管理'
    },
    component: Main,
    children: [{
      path: '/small-task-config',
      name: 'small-task-config',
      meta: {
        icon: 'ios-settings',
        title: '任务配置'
      },
      component: () => import('@/view/mini-program-manager/task/index.vue')
    },
    {
      path: '/small-task-record',
      name: 'small-task-record',
      meta: {
        icon: 'ios-paper',
        title: '任务操作记录'
      },
      component: () => import('@/view/mini-program-manager/task/record.vue')
    },
    {
      path: '/small-sign-reward',
      name: 'small-sign-reward',
      meta: {
        icon: 'ios-paper',
        title: '每日签到配置'
      },
      component: () => import('@/view/mini-program-manager/task/sign-reward.vue')
    }
    ]
  },
  {
    path: '/small-content',
    name: 'small-content',
    meta: {
      icon: 'md-menu',
      title: '内容配置管理'
    },
    component: Main,
    children: [
      // {
      //   path: '/small-article-category',
      //   name: 'small-article-category',
      //   meta: {
      //     icon: 'md-pricetag',
      //     title: '文章分类管理'
      //   },
      //   component: () => import('@/view/mini-program-manager/activity/activities.vue')
      // },
      // {
      //   path: '/small-article-section',
      //   name: 'small-article-section',
      //   meta: {
      //     icon: 'md-pricetag',
      //     title: '文章管理'
      //   },
      //   component: () => import('@/view/mini-program-manager/activity/flashsale.vue')
      // },
      {
        path: '/small-feedback',
        name: 'small-feedback',
        meta: {
          icon: 'md-chatboxes',
          title: '用户反馈'
        },
        component: () => import('@/view/mini-program-manager/content/feedback.vue')
      },
      {
        path: '/small-evaluate',
        name: 'small-evaluate',
        meta: {
          icon: 'ios-chatbubbles',
          title: '评价中心'
        },
        component: () => import('@/view/mini-program-manager/content/evaluate.vue')
      },
      {
        path: '/small-serveFeedback',
        name: 'small-serveFeedback',
        meta: {
          icon: 'ios-chatboxes',
          title: '满意度调研'
        },
        component: () => import('@/view/mini-program-manager/content/serveFeedback.vue')
      },
      {
        path: '/small-advertisement-position',
        name: 'small-advertisement-position',
        meta: {
          icon: 'ios-easel',
          title: '广告位管理'
        },
        component: () => import('@/view/mini-program-manager/content/advertisement-position.vue')
      },
      {
        path: '/small-advertisement',
        name: 'small-advertisement',
        meta: {
          icon: 'ios-images',
          title: '广告管理'
        },
        component: () => import('@/view/mini-program-manager/content/advertisement.vue')
      },
      {
        path: '/small-unifyExport',
        name: 'small-unifyExport',
        meta: {
          icon: 'md-archive',
          title: '统一后台导出'
        },
        component: () => import('@/view/mini-program-manager/content/unifyExport.vue')
      },
      {
        path: '/small-share-setting',
        name: 'small-share-setting',
        meta: {
          icon: 'md-analytics',
          title: '板块活动分享管理'
        },
        component: () => import('@/view/mini-program-manager/content/share-setting.vue')
      },
      {
        path: '/small-faq-category',
        name: 'small-faq-category',
        meta: {
          icon: 'md-analytics',
          title: 'FAQ分类管理'
        },
        component: () => import('@/view/mini-program-manager/content/faq-category.vue')
      },
      {
        path: '/small-faq',
        name: 'small-faq',
        meta: {
          icon: 'md-barcode',
          title: 'FAQ管理'
        },
        component: () => import('@/view/mini-program-manager/content/faq.vue')
      }
    ]
  },
  {
    path: '/small-member',
    name: 'small-member',
    meta: {
      icon: 'md-menu',
      title: '会员数据中心'
    },
    component: Main,
    children: [
      {
        path: '/small-member-management',
        name: 'small-member-management',
        meta: {
          icon: 'md-people',
          title: '会员管理'
        },
        component: () => import('@/view/mini-program-manager/member/member-management.vue')
      },
      {
        path: '/small-member-handCheck',
        name: 'small-member-handCheck',
        meta: {
          icon: 'md-checkmark-circle',
          title: '员工管理'
        },
        component: () => import('@/view/mini-program-manager/member/handCheck.vue')
      },
      {
        path: '/small-phones',
        name: 'small-phones',
        meta: {
          icon: 'md-phone-portrait',
          title: '换绑会员手机'
        },
        component: () => import('@/view/mini-program-manager/member/phones.vue')
      },
      {
        path: '/small-user-source-statistics',
        name: 'small-user-source-statistics',
        meta: {
          icon: 'ios-stats',
          title: '用户来源统计'
        },
        component: () => import('@/view/mini-program-manager/member/user-source-statistics.vue')
      },
      {
        path: '/small-system-data-statistics',
        name: 'small-system-data-statistics',
        meta: {
          icon: 'ios-stats',
          title: '系统数据统计'
        },
        component: () => import('@/view/mini-program-manager/member/system-data-statistics.vue')
      },
      {
        path: '/small-integral-statistics',
        name: 'small-integral-statistics',
        meta: {
          icon: 'ios-stats',
          title: '积分数据统计'
        },
        component: () => import('@/view/mini-program-manager/member/integral-statistics.vue')
      },
      {
        path: '/small-coupon-statistics',
        name: 'small-coupon-statistics',
        meta: {
          icon: 'ios-stats',
          title: '用券数据统计'
        },
        component: () => import('@/view/mini-program-manager/member/coupon-statistics.vue')
      },
      {
        path: '/small-share-statistics',
        name: 'small-share-statistics',
        meta: {
          icon: 'ios-stats',
          title: '分享赚数据统计'
        },
        component: () => import('@/view/mini-program-manager/member/share-statistics.vue')
      },
      {
        path: '/small-collectWordStatistics',
        name: 'small-collectWordStatistics',
        meta: {
          icon: 'ios-stats',
          title: '集字活动数据统计'
        },
        component: () => import('@/view/mini-program-manager/member/collectWordStatistics.vue')
      },
      {
        path: '/small-data-statistics',
        name: 'small-data-statistics',
        meta: {
          icon: 'ios-stats',
          title: '邀请有礼活动分析'
        },
        component: () => import('@/view/mini-program-manager/member/data-statistics.vue')
      },
      {
        path: '/small-amount',
        name: 'small-amount',
        meta: {
          icon: 'ios-stats',
          title: '邀请有礼用户汇总'
        },
        component: () => import('@/view/mini-program-manager/member/amount.vue')
      },
      {
        path: '/small-seckill-statistics',
        name: 'small-seckill-statistics',
        meta: {
          icon: 'ios-stats',
          title: '限时秒杀活动分析'
        },
        component: () => import('@/view/mini-program-manager/member/seckill-statistics.vue')
      },
      {
        path: '/small-seckill-amount',
        name: 'small-seckill-amount',
        meta: {
          icon: 'ios-stats',
          title: '限时秒杀活动数据汇总'
        },
        component: () => import('@/view/mini-program-manager/member/seckill-amount.vue')
      },
      {
        path: '/small-assist-statistics',
        name: 'small-assist-statistics',
        meta: {
          icon: 'ios-stats',
          title: '助力抢爆品活动分析'
        },
        component: () => import('@/view/mini-program-manager/member/assist-statistics.vue')
      },
      {
        path: '/small-assist-amount',
        name: 'small-assist-amount',
        meta: {
          icon: 'ios-stats',
          title: '助力抢爆品活动数据汇总'
        },
        component: () => import('@/view/mini-program-manager/member/assist-amount.vue')
      }
    ]
  },
  {
    path: '/small-orders',
    name: 'small-orders',
    meta: {
      icon: 'md-menu',
      title: '综合订单管理'
    },
    component: Main,
    children: [{
      path: '/small-order',
      name: 'small-order',
      meta: {
        icon: 'ios-paper',
        title: '订单管理'
      },
      component: () => import('@/view/mini-program-manager/order/order.vue')
    },
    {
      path: '/small-skip-order',
      name: 'small-skip-order',
      meta: {
        hideInMenu: true,
        icon: 'ios-paper',
        title: '订单管理'
      },
      component: () => import('@/view/mini-program-manager/order/order.vue')
    },
    {
      path: '/small-paymentlogs',
      name: 'small-paymentlogs',
      meta: {
        icon: 'logo-usd',
        title: '鲜果币流水管理'
      },
      component: () => import('@/view/mini-program-manager/order/paylog.vue')
    },
    {
      path: 'small-order-coupon-details',
      name: 'small-order-coupon-details',
      meta: {
        hideInMenu: true,
        icon: 'md-menu',
        title: '用券数据'
      },
      component: () => import('@/view/mini-program-manager/order/coupon-details.vue')
    },
    {
      path: 'small-order-month-orders',
      name: 'small-order-month-orders',
      meta: {
        hideInMenu: true,
        icon: 'md-menu',
        title: '跨月退款订单'
      },
      component: () => import('@/view/mini-program-manager/order/month-orders.vue')
    }]
  },
  // {
  //   path: '/small-vip',
  //   name: 'small-vip',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '付费会员管理'
  //   },
  //   component: Main,
  //   children: [{
  //     path: '/small-opensvip',
  //     name: 'small-opensvip',
  //     meta: {
  //       icon: 'logo-skype',
  //       title: 'svip套餐'
  //     },
  //     component: () => import('@/view/mini-program-manager/vip/opensvip.vue')
  //   },
  //   {
  //     path: '/small-souvenir',
  //     name: 'small-souvenir',
  //     meta: {
  //       icon: 'ios-basket',
  //       title: '开卡礼包'
  //     },
  //     component: () => import('@/view/mini-program-manager/vip/souvenir.vue')
  //   },
  //   {
  //     path: '/small-privilege',
  //     name: 'small-privilege',
  //     meta: {
  //       icon: 'logo-pinterest',
  //       title: '生日特权券活动'
  //     },
  //     component: () => import('@/view/mini-program-manager/vip/privilege.vue')
  //   },
  //   {
  //     path: '/small-distribution',
  //     name: 'small-distribution',
  //     meta: {
  //       icon: 'ios-car',
  //       title: '省心配送券活动'
  //     },
  //     component: () => import('@/view/mini-program-manager/vip/distribution.vue')
  //   }]
  // },
  {
    path: '/small-system-manager',
    name: 'small-system-manager',
    meta: {
      icon: 'md-menu',
      title: '系统参数管理'
    },
    component: Main,
    children: [{
      path: '/small-system',
      name: 'small-system',
      meta: {
        icon: 'logo-buffer',
        title: '系统参数管理'
      },
      component: () => import('@/view/mini-program-manager/system/system.vue')
    },
    {
      path: '/small-system-category',
      name: 'small-system-category',
      meta: {
        icon: 'md-list-box',
        title: '系统参数分类管理'
      },
      component: () => import('@/view/mini-program-manager/system/system-category.vue')
    }]
  }]

export default miniMallRouter
