import Main from '@/components/main';

const miniMallRouter = [
  {
    path: '/',
    name: 'wechat-home',
    redirect: '/wechat-home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/wechat-home',
      name: 'wechat-home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true
      },
      component: () => import('@/view/single-page/home')
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
        icon: 'ios-albums',
        title: '商品分类管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-category.vue')
    },
    {
      path: '/small-goods-unit',
      name: 'small-goods-unit',
      meta: {
        icon: 'ios-barcode',
        title: '商品单位管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-unit.vue')
    },
    {
      path: '/small-goods-info',
      name: 'small-goods-info',
      meta: {
        icon: 'md-menu',
        title: '基础商品管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-message.vue')
    },
    {
      path: '/small-goods-standard',
      name: 'small-goods-standard',
      meta: {
        icon: 'md-podium',
        title: '商品规格管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-standard.vue')
    },
    {
      path: '/small-goods-section',
      name: 'small-goods-section',
      meta: {
        icon: 'ios-apps',
        title: '板块管理'
      },
      component: () => import('@/view/mini-program-manager/goods/section.vue')
    },
    {
      path: '/small-goods-section-relation',
      name: 'small-goods-section-relation',
      meta: {
        icon: 'md-keypad',
        title: '商品板块管理'
      },
      component: () => import('@/view/mini-program-manager/goods/goods-section.vue')
    },
    {
      path: '/small-store',
      name: 'small-store',
      meta: {
        icon: 'ios-home',
        title: '门店管理'
      },
      component: () => import('@/view/mini-program-manager/goods/store-message.vue')
    }
    ]
  },
  {
    path: '/small-goods-teambuy',
    name: 'small-goods-teambuy',
    meta: {
      icon: 'md-menu',
      title: '团购管理'
    },
    component: Main,
    children: [{
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
      title: '活动管理'
    },
    component: Main,
    children: [{
      path: '/small-activity',
      name: 'small-activity',
      meta: {
        icon: 'ios-book',
        title: '统一活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/activities.vue')
    },
    {
      path: '/small-activity-flashsale',
      name: 'small-activity-flashsale',
      meta: {
        icon: 'md-clock',
        title: '限时抢购管理'
      },
      component: () => import('@/view/mini-program-manager/activity/flashsale.vue')
    },
    {
      path: '/small-hand-coupon',
      name: 'small-hand-coupon',
      meta: {
        icon: 'md-hand',
        title: '统一发券管理'
      },
      component: () => import('@/view/mini-program-manager/activity/hand-coupon.vue')
    },
    {
      path: '/small-coupon-templates',
      name: 'small-coupon-templates',
      meta: {
        icon: 'md-map',
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
      path: '/integral-coupon',
      name: 'integral-coupon',
      meta: {
        icon: 'logo-xbox',
        title: '积分兑换券管理'
      },
      component: () => import('@/view/mini-program-manager/activity/integral-coupon.vue')
    },
    {
      path: '/integral-entity',
      name: 'integral-entity',
      meta: {
        icon: 'md-filing',
        title: '积分兑换实物管理'
      },
      component: () => import('@/view/mini-program-manager/activity/integral-entity.vue')
    },
    {
      path: '/small-activity-share-reward',
      name: 'small-activity-share-reward',
      meta: {
        icon: 'md-share',
        title: '分享红包活动'
      },
      component: () => import('@/view/mini-program-manager/activity/share-reward.vue')
    },
    {
      path: '/small-postage-rule-setting',
      name: 'small-postage-rule-setting',
      meta: {
        icon: 'md-bus',
        title: '邮费管理'
      },
      component: () => import('@/view/mini-program-manager/system/delivery-fee.vue')
    },
    {
      path: '/small-activity-register-reward',
      name: 'small-activity-register-reward',
      meta: {
        icon: 'md-basket',
        title: '注册送礼优惠券活动'
      },
      component: () => import('@/view/mini-program-manager/activity/register-reward.vue')
    },
    {
      path: '/small-activity-recharge',
      name: 'small-activity-recharge',
      meta: {
        icon: 'md-card',
        title: '充值活动管理'
      },
      component: () => import('@/view/mini-program-manager/activity/recharge.vue')
    },
    {
      path: '/small-activity-random-discount',
      name: 'small-activity-random-discount',
      meta: {
        icon: 'md-remove-circle',
        title: '随机立减活动'
      },
      component: () => import('@/view/mini-program-manager/activity/random-discount.vue')
    }]
  },
  {
    path: '/small-content',
    name: 'small-content',
    meta: {
      icon: 'md-menu',
      title: '内容管理'
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
    children: [{
      path: '/small-phones',
      name: 'small-phones',
      meta: {
        icon: 'md-phone-portrait',
        title: '换绑会员手机号'
      },
      component: () => import('@/view/mini-program-manager/member/phones.vue')
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
        icon: 'logo-usd',
        title: '邀请有礼用户汇总'
      },
      component: () => import('@/view/mini-program-manager/member/amount.vue')
    }]
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
      path: '/small-paymentlogs',
      name: 'small-paymentlogs',
      meta: {
        icon: 'logo-usd',
        title: '鲜果币流水管理'
      },
      component: () => import('@/view/mini-program-manager/order/paylog.vue')
    }]
  },
  {
    path: '/small-vip',
    name: 'small-vip',
    meta: {
      icon: 'md-menu',
      title: '付费会员管理'
    },
    component: Main,
    children: [{
      path: '/small-opensvip',
      name: 'small-opensvip',
      meta: {
        icon: 'logo-skype',
        title: 'svip套餐'
      },
      component: () => import('@/view/mini-program-manager/vip/opensvip.vue')
    },
    {
      path: '/small-souvenir',
      name: 'small-souvenir',
      meta: {
        icon: 'ios-basket',
        title: '开卡礼包'
      },
      component: () => import('@/view/mini-program-manager/vip/souvenir.vue')
    },
    {
      path: '/small-privilege',
      name: 'small-privilege',
      meta: {
        icon: 'logo-pinterest',
        title: '生日特权券活动'
      },
      component: () => import('@/view/mini-program-manager/vip/privilege.vue')
    },
    {
      path: '/small-distribution',
      name: 'small-distribution',
      meta: {
        icon: 'ios-car',
        title: '省心配送券活动'
      },
      component: () => import('@/view/mini-program-manager/vip/distribution.vue')
    }]
  },
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
