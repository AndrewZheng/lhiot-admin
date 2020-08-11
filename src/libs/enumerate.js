export const YNEnum = {
  YES: 'YES',
  NO: 'NO'
};

export const yesNoEnum = [{
  label: '是',
  value: YNEnum.YES
},
{
  label: '否',
  value: YNEnum.NO
}
]

// 提货方式
// TO_THE_STORE-门店自提,
// TO_THE_HOME-送货上门
export const receivingWay = {
  TO_THE_STORE: 'TO_THE_STORE',
  TO_THE_HOME: 'TO_THE_HOME'
};

export const receivingWayEnum = [{
  label: '门店自提',
  value: receivingWay.TO_THE_STORE
},
{
  label: '送货上门',
  value: receivingWay.TO_THE_HOME
}
];
// 是否退款
export const isAllRefund = {
  NO: 'NO'
};
export const isAllRefundEnum = [{
  label: '部分退款',
  value: isAllRefund.NO
}];

// 订单状态
// WAIT_PAYMENT-待支付
// WAIT_SEND_OUT-待出库
// SEND_OUTING,出库中
// WAIT_DISPATCHING-待配送,
// DISPATCHING-配送中,
// RECEIVED-已收货,
// RETURNING-退货中,
// RETURN_FAILURE-退款失败,
// ALREADY_RETURN-退货完成
// FAILURE-已失效,
// FINISHED-完成
export const orderStatus = {
  WAIT_PAYMENT: 'WAIT_PAYMENT',
  WAIT_SEND_OUT: 'WAIT_SEND_OUT',
  SEND_OUTING: 'SEND_OUTING',
  WAIT_DISPATCHING: 'WAIT_DISPATCHING',
  DISPATCHING: 'DISPATCHING',
  RECEIVED: 'RECEIVED',
  RETURNING: 'RETURNING',
  RETURN_FAILURE: 'RETURN_FAILURE',
  ALREADY_RETURN: 'ALREADY_RETURN',
  FAILURE: 'FAILURE',
  FINISHED: 'FINISHED'
};

export const orderStatusEnum = [{
  label: '待支付',
  value: orderStatus.WAIT_PAYMENT
},
{
  label: '待出库',
  value: orderStatus.WAIT_SEND_OUT
},
{
  label: '出库中',
  value: orderStatus.SEND_OUTING
},
{
  label: '待配送',
  value: orderStatus.WAIT_DISPATCHING
},
{
  label: '配送中',
  value: orderStatus.DISPATCHING
},
{
  label: '已收货',
  value: orderStatus.RECEIVED
},
{
  label: '退货中',
  value: orderStatus.RETURNING
},
{
  label: '退款失败',
  value: orderStatus.RETURN_FAILURE
},
{
  label: '退货完成',
  value: orderStatus.ALREADY_RETURN
},
{
  label: '已失效',
  value: orderStatus.FAILURE
},
{
  label: '完成',
  value: orderStatus.FINISHED
}
];

// 订单类型：
// NORMAL-普通订单,
// CUSTOM-定制订单,
// TEAM_BUY-团购订单,
// FREEGO-孚力购订单
export const orderType = {
  NORMAL: 'NORMAL',
  CUSTOM: 'CUSTOM',
  TEAM_BUY: 'TEAM_BUY',
  FREEGO: 'FREEGO'
};

export const orderTypeEnum = [{
  label: '普通订单',
  value: orderType.NORMAL
},
{
  label: '定制订单',
  value: orderType.CUSTOM
},
{
  label: '团购订单',
  value: orderType.TEAM_BUY
},
{
  label: '孚力购订单',
  value: orderType.FREEGO
}
];

// 定制状态
// WAIT_PAYMENT-待付款、
// INVALID-已失效、
// PAUSE_DELIVERY-暂停配送、
// CUSTOMING-定制中、
// FINISHED-已结束"
export const customOrderStatus = {
  WAIT_PAYMENT: 'WAIT_PAYMENT',
  INVALID: 'INVALID',
  PAUSE_DELIVERY: 'PAUSE_DELIVERY',
  CUSTOMING: 'CUSTOMING',
  FINISHED: 'FINISHED'
};

export const customOrderStatusEnum = [{
  label: '待付款',
  value: customOrderStatus.WAIT_PAYMENT
},
{
  label: '已失效',
  value: customOrderStatus.INVALID
},
{
  label: '暂停配送',
  value: customOrderStatus.PAUSE_DELIVERY
},
{
  label: '定制中',
  value: customOrderStatus.CUSTOMING
},
{
  label: '已结束',
  value: customOrderStatus.FINISHED
}
];

// 定制订单配送状态：deliveryStatus ：
// DISPATCHING("配送中"),
// RECEIVED("已收货"),
// RETURNING("退货中"),
// ALREADY_RETURN("退货完成"),
// FINISHED("完成");
export const customDeliverStatus = {
  DISPATCHING: 'DISPATCHING',
  RECEIVED: 'RECEIVED',
  RETURNING: 'RETURNING',
  ALREADY_RETURN: 'ALREADY_RETURN',
  FINISHED: 'FINISHED'
};

export const customDeliverStatusEnum = [{
  label: '配送中',
  value: customDeliverStatus.DISPATCHING
},
{
  label: '已收货',
  value: customDeliverStatus.RECEIVED
},
{
  label: '退货中',
  value: customDeliverStatus.RETURNING
},
{
  label: '退货完成',
  value: customDeliverStatus.ALREADY_RETURN
},
{
  label: '完成',
  value: customDeliverStatus.FINISHED
}
];

// 第三方配送状态
// UNRECEIVED-未接单
// WAIT_GET-待取货
// DELIVERING-配送中
// DONE-配送完成
// FAILURE-配送失败
export const thirdDeliverStatus = {
  UNRECEIVED: 'UNRECEIVED',
  WAIT_GET: 'WAIT_GET',
  DELIVERING: 'DELIVERING',
  DONE: 'DONE',
  FAILURE: 'FAILURE'
};

export const thirdDelieverStatusEnum = [{
  label: '未接单',
  value: thirdDeliverStatus.UNRECEIVED
},
{
  label: '待取货',
  value: thirdDeliverStatus.WAIT_GET
},
{
  label: '配送中',
  value: thirdDeliverStatus.DELIVERING
},
{
  label: '配送完成',
  value: thirdDeliverStatus.DONE
},
{
  label: '配送失败',
  value: thirdDeliverStatus.FAILURE
}
];

// 定制周期
// 周-7、
// 月-30
export const customPeriodEnum = [{
  label: '周',
  value: 7
},
{
  label: '月',
  value: 30
}
];

// 定制订单配送方式
// MANUAL-手动，
// AUTO-自动
export const deliveryTypeCustom = {
  MANUAL: 'MANUAL',
  AUTO: 'AUTO'
};

export const deliveryTypeCustomEnum = [{
  label: '手动',
  value: deliveryTypeCustom.MANUAL
},
{
  label: '自动',
  value: deliveryTypeCustom.AUTO
}
];

// 结算状态
// UNSETTLED-未处理
// SUCCESS-已成功
// EXPIRED-已过期
export const settlementStatus = {
  UNSETTLED: 'UNSETTLED',
  SUCCESS: 'SUCCESS',
  EXPIRED: 'EXPIRED',
  REFUND: 'REFUND'
};

export const settlementStatusEnum = [{
  label: '未处理',
  value: settlementStatus.UNSETTLED
},
{
  label: '已成功',
  value: settlementStatus.SUCCESS
},
{
  label: '已过期',
  value: settlementStatus.EXPIRED
},
{
  label: '已退款',
  value: settlementStatus.REFUND
}
];

// 鲜果师等级
// 培训中:TRAINING、
// 初级:PRIMARY、
// 中高级:SENIOR
export const doctorLevel = {
  TRAINING: 'TRAINING',
  PRIMARY: 'PRIMARY',
  SENIOR: 'SENIOR'
};

export const doctorLevelEnum = [{
  label: '培训中',
  value: doctorLevel.TRAINING
},
{
  label: '初级',
  value: doctorLevel.PRIMARY
},
{
  label: '中高级',
  value: doctorLevel.SENIOR
}
];

// 鲜果师状态
// VALID:正常
// INVALID:已停用
export const doctorStatus = {
  VALID: 'VALID',
  INVALID: 'INVALID'
};

export const doctorStatusEnum = [{
  label: '正常',
  value: doctorStatus.VALID
},
{
  label: '已停用',
  value: doctorStatus.INVALID
}
];

// 上架商品 上架-ON 下架-OFF
export const onSaleStatus = {
  ON: 'ON',
  OFF: 'OFF'
};

export const onSaleStatusEnum = [{
  label: '上架',
  value: onSaleStatus.ON
},
{
  label: '下架',
  value: onSaleStatus.OFF
}
];

// 定制计划状态 有效-VALID 无效-INVALID
export const customPlanStatus = {
  VALID: 'VALID',
  INVALID: 'INVALID'
};

export const customPlanStatusEnum = [{
  label: '上架',
  value: customPlanStatus.VALID
},
{
  label: '下架',
  value: customPlanStatus.INVALID
}
];

// 是否明星鲜果师
// YES:明星鲜果师
// NO:普通鲜果师
export const hotStatus = {
  YES: 'YES',
  NO: 'NO'
};

export const hotEnum = [{
  label: '明星鲜果师',
  value: hotStatus.YES
},
{
  label: '普通鲜果师',
  value: hotStatus.NO
}
];

// 配送时间段类型
// DAYTIME(8:00,18:00),
// EVENING(18:00,22:00),
// ALL_DAY(8:00,22:00)
export const deliveryAtType = {
  DAYTIME: 'DAYTIME',
  EVENING: 'EVENING',
  ALL_DAY: 'ALL_DAY'
};

export const deliveryAtTypeEnum = [{
  label: '白天8:00-18:00',
  value: deliveryAtType.DAYTIME
},
{
  label: '晚上18:00-22:00',
  value: deliveryAtType.EVENING
},
{
  label: '全天8:00-22:00',
  value: deliveryAtType.ALL_DAY
}
];

// 操作方式 INSERT(新增),UPDATE(修改)
export const updateWay = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE'
};

export const updateWayEnum = [{
  label: '新增',
  value: updateWay.INSERT
},
{
  label: '修改',
  value: updateWay.UPDATE
}
];

// 位置类别
// PRODUCT-商品，
// ADVERTISEMENT-广告，
// ARTICLE-文章
export const positionType = {
  PRODUCT: 'PRODUCT',
  ADVERTISEMENT: 'ADVERTISEMENT',
  ARTICLE: 'ARTICLE'
};

export const positionTypeEnum = [{
  label: '商品',
  value: positionType.PRODUCT
},
{
  label: '广告',
  value: positionType.ADVERTISEMENT
},
{
  label: '文章',
  value: positionType.ARTICLE
}
];

// 广告关联类别
// （PRODUCT_DETAILS- 商品详情
// PRODUCT_SECTION-商品版块
// CUSTOM_PLAN-定制计划
// CUSTOM_PLAN_SECTION-定制版块
// ARTICLE_DETAILS-文章详情
// STORE_LIVE_TELECAST- 门店直播
//  MORE_AMUSEMENT- 多娱
// EXTERNAL_LINKS- 外部链接）
export const relationType = {
  PRODUCT_DETAILS: 'PRODUCT_DETAILS',
  PRODUCT_SECTION: 'PRODUCT_SECTION',
  CUSTOM_PLAN: 'CUSTOM_PLAN',
  CUSTOM_PLAN_SECTION: 'CUSTOM_PLAN_SECTION',
  ARTICLE_DETAILS: 'ARTICLE_DETAILS',
  STORE_LIVE_TELECAST: 'STORE_LIVE_TELECAST',
  MORE_AMUSEMENT: 'MORE_AMUSEMENT',
  EXTERNAL_LINKS: 'EXTERNAL_LINKS'
};

export const relationTypeEnum = [{
  label: '商品详情',
  value: relationType.PRODUCT_DETAILS
},
{
  label: '商品版块',
  value: relationType.PRODUCT_SECTION
},
{
  label: '定制计划',
  value: relationType.CUSTOM_PLAN
},
{
  label: '定制版块',
  value: relationType.CUSTOM_PLAN_SECTION
},
{
  label: '文章详情',
  value: relationType.ARTICLE_DETAILS
},
{
  label: '门店直播',
  value: relationType.STORE_LIVE_TELECAST
},
{
  label: '多娱',
  value: relationType.MORE_AMUSEMENT
},
{
  label: '外部链接',
  value: relationType.EXTERNAL_LINKS
}
];

// 反馈状态
// (UNREPLY-未回复，
// REPLY-已回复且用户未读，
// READED-已读’)

export const feedbackStatus = {
  UNREPLY: 'UNREPLY',
  REPLY: 'REPLY',
  READED: 'READED'
}

export const feedbackStatusEnum = [{
  label: '未回复',
  value: feedbackStatus.UNREPLY
},
{
  label: '已回复',
  value: feedbackStatus.REPLY
},
{
  label: '已读',
  value: feedbackStatus.READED
}
];

// 门店状态 ENABLED(营业),DISABLED(未营业);
export const storeStatus = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED'
};

export const storeStatusEnum = [{
  label: '营业',
  value: storeStatus.ENABLED
},
{
  label: '未营业',
  value: storeStatus.DISABLED
}
];

// 门店类型：ORDINARY_STORE(普通门店),FLAGSHIP_STORE (旗舰店)
export const storeType = {
  ORDINARY_STORE: 'ORDINARY_STORE',
  FLAGSHIP_STORE: 'FLAGSHIP_STORE',
  JOIN_STORE: 'JOIN_STORE'
};

export const storeTypeEnum = [{
  label: '普通门店',
  value: storeType.ORDINARY_STORE
},
{
  label: '旗舰店',
  value: storeType.FLAGSHIP_STORE
},
{
  label: '加盟店',
  value: storeType.JOIN_STORE
}

];

// GCJ02("高德坐标系/火星坐标系"),
//   BD09("百度坐标系"),
//   WGS84("GPS坐标系")
export const coordinateType = {
  GCJ02: 'GCJ02',
  BD09: 'BD09',
  WGS84: 'WGS84'
};

export const coordinateTypeEnum = [{
  label: '高德坐标系/火星坐标系',
  value: coordinateType.GCJ02
},
{
  label: '百度坐标系',
  value: coordinateType.BD09
},
{
  label: 'GPS坐标系',
  value: coordinateType.WGS84
}
];

// 是否可拆分 SEPARABLE("可拆分"),NO_SEPARABLE("不可拆分");
export const splitStatus = {
  SEPARABLE: 'SEPARABLE',
  NO_SEPARABLE: 'NO_SEPARABLE'
};

export const splitStatusEnum = [{
  label: '是',
  value: splitStatus.SEPARABLE
},
{
  label: '否',
  value: splitStatus.NO_SEPARABLE
}
];

// 小程序商品状态 NORMAL-正常 STOP_MINING	停采
export const productStatus = {
  NORMAL: 'NORMAL',
  STOP_MINING: 'STOP_MINING'
}

export const productStatusEnum = [{
  label: '正常',
  value: productStatus.NORMAL
},
{
  label: '停采',
  value: productStatus.STOP_MINING
}
]

// 小程序图片状态 OFF 关闭 ， ON 开启
export const imageStatus = {
  OFF: 'OFF',
  ON: 'ON'
}

export const imageStatusEnum = [{
  label: '关闭',
  value: imageStatus.OFF
},
{
  label: '开启',
  value: imageStatus.ON
}
]

// 小程序图片类型 TEAM_GUARANTEE 拼团保障图

export const imageType = {
  TEAM_GUARANTEE: 'TEAM_GUARANTEE'
}

export const imageTypeEnum = [{
  label: '拼团保障图',
  value: imageType.TEAM_GUARANTEE
}]

// 小程序团购活动状态 off 未开启 on 开启  expire 过期
export const teamBuyStatus = {
  off: 'off',
  on: 'on',
  expire: 'expire'
}

export const teamBuyStatusEnum = [{
  label: '关闭',
  value: teamBuyStatus.off
},
{
  label: '开启',
  value: teamBuyStatus.on
},
{
  label: '过期',
  value: teamBuyStatus.expire
}
]

// 小程序团购活动类型
export const teamBuyTypeEnum = [{
  label: '普通团',
  value: 'ORDINARY_TEAM'
},
{
  label: '老带新团',
  value: 'OLD_AND_NEW'
}
]

// 小程序红包活动设置
export const rewardActivitySettingEnum = [{
  label: '关闭',
  value: 'DISABLE'
},
{
  label: '全部开启',
  value: 'ALL_ENABLE'
},
{
  label: '单人购买开启活动',
  value: 'SINGLE_ENABLE'
},
{
  label: '多人团开启活动',
  value: 'MULTIPLE_ENABLE'
}
]

// 实物类型: COMMON_GOODS(普通商品),PERIPHERY_GOODS(周边商品)
export const entityTypeEnum = [{
  label: '普通商品',
  value: 'COMMON_GOODS'
},
{
  label: '周边商品',
  value: 'PERIPHERY_GOODS'
}
]

export const relationStoreTypeEnum = [{
  label: '全部门店',
  value: 'ALL'
},
{
  label: '部分门店',
  value: 'PART'
}
]

export const couponStatusEnum = [{
  label: '有效',
  value: 'VALID'
},
{
  label: '无效',
  value: 'INVALID'
}
];
// {
//   label: '过期',
//   value: 'EXPIRE'
// }
export const vipStatusEnum = [{
  label: 'SVIP会员',
  value: 'SVIP'
},
{
  label: '试用会员',
  value: 'TRY_SVIP'
}
];
export const receiveTypeEnum = [{
  label: '自动领取',
  value: 'AUTO'
},
{
  label: '手动领取',
  value: 'MANUAL'
}
];
// svip套餐状态 (开启 ON,关闭 OFF,未开启 NOTOPEN,已结束 OVER))
export const packageStatus = {
  OFF: 'OFF',
  ON: 'ON'
  // OVER:'OVER',
  // NOTOPEN:'NOTOPEN'
}

export const packageStatusEnum = [{
  label: '关闭',
  value: packageStatus.OFF
},
{
  label: '开启',
  value: packageStatus.ON
}
  // {
  //   label: '已结束',
  //   value: packageStatus.OVER
  // },
  // {
  //   label: '未开启',
  //   value: packageStatus.NOTOPEN
  // }
]
// export const packageStatusEnum = [
//   {
//     label: '关闭',
//     value: "OFF"
//   },
//   {
//     label: '开启',
//     value: "ON"
//   },
//   // {
//   //   label: '已结束',
//   //   value: "OVER"
//   // },
//   // {
//   //   label: '未开启',
//   //   value: "NOTOPEN"
//   // }
// ]

// SVIP套餐类型对应枚举：套餐类型(月卡、MONTH_CARD 季卡、SEASON 年卡、YEAR_CARD)
export const packageTypeEnum = [{
  label: '月卡',
  value: 'MONTH_CARD'
},
{
  label: '季卡',
  value: 'SEASON'
},
{
  label: '年卡',
  value: 'YEAR_CARD'
}
];

export const userScopeEnum = [{
  label: '所有用户',
  value: 'ALL'
},
{
  label: '付费会员',
  value: 'SVIP'
}
];

export const memberLimitEnum = [{
  label: '所有用户',
  value: 'ALL'
},
{
  label: '付费会员',
  value: 'SVIP'
}
];

export const couponActivityTypeEnum = [{
  label: '领券中心',
  value: 'COUPON_CENTER_ACTIVITY'
},
{
  label: '积分商城兑换',
  value: 'COUPON_CENTER_POINT'
}
];

// giftType礼包类型： BIRTHDAY_COUPON 生日券 FREIGHT_COUPON 运费券 OPEN_CARD_COUPON 开卡券
export const giftTypeEnum = [{
  label: '生日券',
  value: 'BIRTHDAY_COUPON'
},
{
  label: '运费券',
  value: 'FREIGHT_COUPON'
},
{
  label: '开卡券',
  value: 'OPEN_CARD_COUPON'
}
];

// 折扣商品类型 DISCOUNT_PRODUCT(“折扣商品”), PULL_NEW_PRODUCT(“老拉新商品”)
export const expandTypeEnum = [
  {
    label: '折扣商品',
    value: 'DISCOUNT_PRODUCT'
  },
  {
    label: '老拉新商品',
    value: 'PULL_NEW_PRODUCT'
  },
  {
    label: '限时秒杀商品',
    value: 'SECKILL_PRODUCT'
  },
  {
    label: '新品尝鲜商品',
    value: 'NEW_TRY_PRODUCT'
  },
  {
    label: '分享赚商品',
    value: 'SHARE_PRODUCT'
  },
  {
    label: '助力商品',
    value: 'ASSIST_PRODUCT'
  },
  {
    label: '普通商品',
    value: 'ORDINARY_PRODUCT'
  }
];

export const pfExpandTypeEnum = [
  {
    label: '普通商品',
    value: 'NORMAL'
  },
  {
    label: 'vip商品',
    value: 'VIP'
  },
  {
    label: '限时抢购商品',
    value: 'FLASHSALE'
  }
];

// 小程序优惠券使用限制 SMALL_ALL("小程序全场券"),PART_GOODS("部分商品券"),PART_STORES("部分门店券")，HD_ALL("海鼎全场券");
export const couponUseLimitEnum = [{
  label: '小程序全场券',
  value: 'SMALL_ALL'
},
{
  label: '部分商品券',
  value: 'PART_GOODS'
},
{
  label: '部分门店券',
  value: 'PART_STORES'
},
{
  label: '海鼎全场券',
  value: 'HD_ALL'
}
];

// 券有效期类型: FIXED_DATE(固定日期),UN_FIXED_DATE(相对发券日期)
export const validDateTypeEnum = [{
  label: '固定日期',
  value: 'FIXED_DATE'
},
{
  label: '相对发券日期',
  value: 'UN_FIXED_DATE'
}
];

// 小程序优惠券使用范围 STORE("门店"),STORE_AND_SMALL("门店和商城"),SMALL("商城");
export const couponScope = {
  STORE: 'STORE',
  STORE_AND_SMALL: 'STORE_AND_SMALL',
  SMALL: 'SMALL'
};

export const couponScopeEnum = [{
  label: '门店',
  value: couponScope.STORE
},
{
  label: '全场通用',
  value: couponScope.STORE_AND_SMALL
},
{
  label: '商城',
  value: couponScope.SMALL
}
];
export const vipCouponType = {
  FREE_SHIPPING_COUPON: 'FREE_SHIPPING_COUPON'
};

// 小程序优惠券类型(FULL_CUT_COUPON 满减券;DISCOUNT_COUPON 折扣券;CASH_COUPON 现金券;FREIGHT_COUPON运费券)
export const couponType = {
  FULL_CUT_COUPON: 'FULL_CUT_COUPON',
  DISCOUNT_COUPON: 'DISCOUNT_COUPON',
  CASH_COUPON: 'CASH_COUPON',
  FREIGHT_COUPON: 'FREIGHT_COUPON'
};

export const couponTypeEnum = [{
  label: '满减券',
  value: couponType.FULL_CUT_COUPON
},
{
  label: '折扣券',
  value: couponType.DISCOUNT_COUPON
},
{
  label: '现金券',
  value: couponType.CASH_COUPON
}
  // {
  //   label: '运费券',
  //   value: couponType.FREIGHT_COUPON
  // }
];

// 小程序SVIP身份识别(SUPER_VIP svip   PROBATION_VIP  试用vip)
export const svipType = {
  SUPER_VIP: 'SUPER_VIP',
  PROBATION_VIP: 'PROBATION_VIP'
};

export const svipTypeEnum = [{
  label: 'SVIP会员',
  value: svipType.SUPER_VIP
},
{
  label: '试用会员',
  value: svipType.PROBATION_VIP
}
];

// 小程序应用类型 appType WXSMALL_SHOP 微信小程序; S_MALL 拼团小程序;
export const appType = {
  WXSMALL_SHOP: 'WXSMALL_SHOP',
  S_MALL: 'S_MALL'
};

export const appTypeEnum = [{
  label: '微信小程序',
  value: appType.WXSMALL_SHOP
},
{
  label: '拼团小程序',
  value: appType.S_MALL
}
];

export const appTypes = {
  S_MALL: 'S_MALL'
};

export const appTypesEnum = [{
  label: '小程序',
  value: appType.S_MALL
}];

// 小程序支付类型 payType weixin 微信支付; balance 余额支付;

export const payType = {
  weixin: 'weixin',
  balance: 'balance',
  points: 'points',
  haiding: 'haiding'
};

export const payTypeEnum = [{
  label: '微信支付',
  value: payType.weixin
},
{
  label: '余额支付',
  value: payType.balance
},
{
  label: '积分兑换',
  value: payType.points
},
{
  label: '鼎付通',
  value: payType.haiding
}
];

// 小程序支付步骤 payStep sign 签名; paid 已支付;
export const payStep = {
  sign: 'sign',
  paid: 'paid'
};

export const payStepEnum = [{
  label: '签名',
  value: payStep.sign
},
{
  label: '已支付',
  value: payStep.paid
}
];

// 小程序来源类型 sourceType recharge: 充值;order: 订单
export const sourceType = {
  recharge: 'recharge',
  order: 'order'
};

export const sourceTypeEnum = [{
  label: '充值',
  value: sourceType.recharge
},
{
  label: '订单',
  value: sourceType.order
}
];

// 小程序银行类型 bankType CFT: 充值;HUNNX_DEBIT: 订单;BOC_DEBIT: 充值;ICBC_DEBIT: 订单;CSCB_DEBIT: 充值;CCB_DEBIT: 订单;ICBC_DEBIT: 订单;CSCB_DEBIT: 充值;CCB_DEBIT: 订单;
export const bankType = {
  ICBC_DEBIT: 'ICBC_DEBIT',
  ICBC_CREDIT: 'ICBC_CREDIT',
  ABC_DEBIT: 'ABC_DEBIT',
  ABC_CREDIT: 'ABC_CREDIT',
  PSBC_DEBIT: 'PSBC_DEBIT',
  PSBC_CREDIT: 'PSBC_CREDIT',
  CCB_DEBIT: 'CCB_DEBIT',
  CCB_CREDIT: 'CCB_CREDIT',
  CMB_DEBIT: 'CMB_DEBIT',
  CMB_CREDIT: 'CMB_CREDIT',
  BOC_DEBIT: 'BOC_DEBIT',
  BOC_CREDIT: 'BOC_CREDIT',
  COMM_DEBIT: 'COMM_DEBIT',
  COMM_CREDIT: 'COMM_CREDIT',
  SPDB_DEBIT: 'SPDB_DEBIT',
  SPDB_CREDIT: 'SPDB_CREDIT',
  GDB_DEBIT: 'GDB_DEBIT',
  GDB_CREDIT: 'GDB_CREDIT',
  CMBC_DEBIT: 'CMBC_DEBIT',
  CMBC_CREDIT: 'CMBC_CREDIT',
  PAB_DEBIT: 'PAB_DEBIT',
  PAB_CREDIT: 'PAB_CREDIT',
  CEB_DEBIT: 'CEB_DEBIT',
  CEB_CREDIT: 'CEB_CREDIT',
  CIB_DEBIT: 'CIB_DEBIT',
  CIB_CREDIT: 'CIB_CREDIT',
  CITIC_DEBIT: 'CITIC_DEBIT',
  CITIC_CREDIT: 'CITIC_CREDIT',
  BOSH_DEBIT: 'BOSH_DEBIT',
  BOSH_CREDIT: 'BOSH_CREDIT',
  CRB_DEBIT: 'CRB_DEBIT',
  HZB_DEBIT: 'HZB_DEBIT',
  HZB_CREDIT: 'HZB_CREDIT',
  BSB_DEBIT: 'BSB_DEBIT',
  BSB_CREDIT: 'BSB_CREDIT',
  CQB_DEBIT: 'CQB_DEBIT',
  SDEB_DEBIT: 'SDEB_DEBIT',
  SZRCB_DEBIT: 'SZRCB_DEBIT',
  SZRCB_CREDIT: 'SZRCB_CREDIT',
  HRBB_DEBIT: 'HRBB_DEBIT',
  BOCD_DEBIT: 'BOCD_DEBIT',
  GDNYB_DEBIT: 'GDNYB_DEBIT',
  GDNYB_CREDIT: 'GDNYB_CREDIT',
  GZCB_DEBIT: 'GZCB_DEBIT',
  GZCB_CREDIT: 'GZCB_CREDIT',
  JSB_DEBIT: 'JSB_DEBIT',
  JSB_CREDIT: 'JSB_CREDIT',
  NBCB_DEBIT: 'NBCB_DEBIT',
  NBCB_CREDIT: 'NBCB_CREDIT',
  NJCB_DEBIT: 'NJCB_DEBIT',
  QHNX_DEBIT: 'QHNX_DEBIT',
  ORDOSB_CREDIT: 'ORDOSB_CREDIT',
  ORDOSB_DEBIT: 'ORDOSB_DEBIT',
  BJRCB_CREDIT: 'BJRCB_CREDIT',
  BHB_DEBIT: 'BHB_DEBIT',
  BGZB_DEBIT: 'BGZB_DEBIT',
  BEEB_DEBIT: 'BEEB_DEBIT',
  PZHCCB_DEBIT: 'PZHCCB_DEBIT',
  QDCCB_CREDIT: 'QDCCB_CREDIT',
  QDCCB_DEBIT: 'QDCCB_DEBIT',
  SHINHAN_DEBIT: 'SHINHAN_DEBIT',
  QLB_DEBIT: 'QLB_DEBIT',
  QSB_DEBIT: 'QSB_DEBIT',
  ZZB_DEBIT: 'ZZB_DEBIT',
  CCAB_DEBIT: 'CCAB_DEBIT',
  RZB_DEBIT: 'RZB_DEBIT',
  SCNX_DEBIT: 'SCNX_DEBIT',
  BEEB_CREDIT: 'BEEB_CREDIT',
  SDRCU_DEBIT: 'SDRCU_DEBIT',
  BCZ_DEBIT: 'BCZ_DEBIT',
  SJB_DEBIT: 'SJB_DEBIT',
  LNNX_DEBIT: 'LNNX_DEBIT',
  JUFENGB_DEBIT: 'JUFENGB_DEBIT',
  ZZB_CREDIT: 'ZZB_CREDIT',
  JXNXB_DEBIT: 'JXNXB_DEBIT',
  JZB_DEBIT: 'JZB_DEBIT',
  JZCB_CREDIT: 'JZCB_CREDIT',
  JZCB_DEBIT: 'JZCB_DEBIT',
  KLB_DEBIT: 'KLB_DEBIT',
  KRCB_DEBIT: 'KRCB_DEBIT',
  KUERLECB_DEBIT: 'KUERLECB_DEBIT',
  LJB_DEBIT: 'LJB_DEBIT',
  NYCCB_DEBIT: 'NYCCB_DEBIT',
  LSCCB_DEBIT: 'LSCCB_DEBIT',
  LUZB_DEBIT: 'LUZB_DEBIT',
  LWB_DEBIT: 'LWB_DEBIT',
  LYYHB_DEBIT: 'LYYHB_DEBIT',
  LZB_DEBIT: 'LZB_DEBIT',
  MINTAIB_CREDIT: 'MINTAIB_CREDIT',
  MINTAIB_DEBIT: 'MINTAIB_DEBIT',
  NCB_DEBIT: 'NCB_DEBIT',
  NMGNX_DEBIT: 'NMGNX_DEBIT',
  XAB_DEBIT: 'XAB_DEBIT',
  WFB_CREDIT: 'WFB_CREDIT',
  WFB_DEBIT: 'WFB_DEBIT',
  WHB_CREDIT: 'WHB_CREDIT',
  WHB_DEBIT: 'WHB_DEBIT',
  WHRC_CREDIT: 'WHRC_CREDIT',
  WHRC_DEBIT: 'WHRC_DEBIT',
  WJRCB_DEBIT: 'WJRCB_DEBIT',
  WLMQB_DEBIT: 'WLMQB_DEBIT',
  WRCB_DEBIT: 'WRCB_DEBIT',
  WZB_DEBIT: 'WZB_DEBIT',
  XAB_CREDIT: 'XAB_CREDIT',
  WEB_DEBIT: 'WEB_DEBIT',
  XIB_DEBIT: 'XIB_DEBIT',
  XJRCCB_DEBIT: 'XJRCCB_DEBIT',
  XMCCB_DEBIT: 'XMCCB_DEBIT',
  YNRCCB_DEBIT: 'YNRCCB_DEBIT',
  YRRCB_CREDIT: 'YRRCB_CREDIT',
  YRRCB_DEBIT: 'YRRCB_DEBIT',
  YTB_DEBIT: 'YTB_DEBIT',
  ZJB_DEBIT: 'ZJB_DEBIT',
  ZJLXRB_DEBIT: 'ZJLXRB_DEBIT',
  ZJRCUB_CREDIT: 'ZJRCUB_CREDIT',
  AHRCUB_DEBIT: 'AHRCUB_DEBIT',
  BCZ_CREDIT: 'BCZ_CREDIT',
  SRB_DEBIT: 'SRB_DEBIT',
  ZYB_DEBIT: 'ZYB_DEBIT',
  ZRCB_DEBIT: 'ZRCB_DEBIT',
  SRCB_CREDIT: 'SRCB_CREDIT',
  SRCB_DEBIT: 'SRCB_DEBIT',
  ZJTLCB_DEBIT: 'ZJTLCB_DEBIT',
  SUZB_DEBIT: 'SUZB_DEBIT',
  SXNX_DEBIT: 'SXNX_DEBIT',
  SXXH_DEBIT: 'SXXH_DEBIT',
  ZJRCUB_DEBIT: 'ZJRCUB_DEBIT',
  AE_CREDIT: 'AE_CREDIT',
  TACCB_CREDIT: 'TACCB_CREDIT',
  TACCB_DEBIT: 'TACCB_DEBIT',
  TCRCB_DEBIT: 'TCRCB_DEBIT',
  TJBHB_CREDIT: 'TJBHB_CREDIT',
  TJBHB_DEBIT: 'TJBHB_DEBIT',
  TJB_DEBIT: 'TJB_DEBIT',
  TRCB_DEBIT: 'TRCB_DEBIT',
  TZB_DEBIT: 'TZB_DEBIT',
  URB_DEBIT: 'URB_DEBIT',
  DYB_CREDIT: 'DYB_CREDIT',
  CSRCB_DEBIT: 'CSRCB_DEBIT',
  CZB_CREDIT: 'CZB_CREDIT',
  CZB_DEBIT: 'CZB_DEBIT',
  CZCB_CREDIT: 'CZCB_CREDIT',
  CZCB_DEBIT: 'CZCB_DEBIT',
  DANDONGB_CREDIT: 'DANDONGB_CREDIT',
  DANDONGB_DEBIT: 'DANDONGB_DEBIT',
  DLB_CREDIT: 'DLB_CREDIT',
  DLB_DEBIT: 'DLB_DEBIT',
  DRCB_CREDIT: 'DRCB_CREDIT',
  DRCB_DEBIT: 'DRCB_DEBIT',
  CSRCB_CREDIT: 'CSRCB_CREDIT',
  DYB_DEBIT: 'DYB_DEBIT',
  DYCCB_DEBIT: 'DYCCB_DEBIT',
  FBB_DEBIT: 'FBB_DEBIT',
  FDB_DEBIT: 'FDB_DEBIT',
  FJHXB_CREDIT: 'FJHXB_CREDIT',
  FJHXB_DEBIT: 'FJHXB_DEBIT',
  FJNX_DEBIT: 'FJNX_DEBIT',
  FUXINB_DEBIT: 'FUXINB_DEBIT',
  BOCDB_DEBIT: 'BOCDB_DEBIT',
  JSNX_DEBIT: 'JSNX_DEBIT',
  BOLFB_DEBIT: 'BOLFB_DEBIT',
  CCAB_CREDIT: 'CCAB_CREDIT',
  CBHB_DEBIT: 'CBHB_DEBIT',
  CDRCB_DEBIT: 'CDRCB_DEBIT',
  BYK_DEBIT: 'BYK_DEBIT',
  BOZ_DEBIT: 'BOZ_DEBIT',
  CFT: 'CFT',
  BOTSB_DEBIT: 'BOTSB_DEBIT',
  BOSZS_DEBIT: 'BOSZS_DEBIT',
  BOSXB_DEBIT: 'BOSXB_DEBIT',
  BONX_DEBIT: 'BONX_DEBIT',
  BONX_CREDIT: 'BONX_CREDIT',
  GDHX_DEBIT: 'GDHX_DEBIT',
  BOLB_DEBIT: 'BOLB_DEBIT',
  BOJX_DEBIT: 'BOJX_DEBIT',
  BOIMCB_DEBIT: 'BOIMCB_DEBIT',
  BOHN_DEBIT: 'BOHN_DEBIT',
  BOD_DEBIT: 'BOD_DEBIT',
  CQRCB_CREDIT: 'CQRCB_CREDIT',
  CQRCB_DEBIT: 'CQRCB_DEBIT',
  CQTGB_DEBIT: 'CQTGB_DEBIT',
  BOD_CREDIT: 'BOD_CREDIT',
  CSCB_DEBIT: 'CSCB_DEBIT',
  BOB_CREDIT: 'BOB_CREDIT',
  GDRCU_DEBIT: 'GDRCU_DEBIT',
  BOB_DEBIT: 'BOB_DEBIT',
  HRXJB_DEBIT: 'HRXJB_DEBIT',
  HSBC_DEBIT: 'HSBC_DEBIT',
  HSB_CREDIT: 'HSB_CREDIT',
  HSB_DEBIT: 'HSB_DEBIT',
  HUNNX_DEBIT: 'HUNNX_DEBIT',
  HUSRB_DEBIT: 'HUSRB_DEBIT',
  HXB_CREDIT: 'HXB_CREDIT',
  HXB_DEBIT: 'HXB_DEBIT',
  HNNX_DEBIT: 'HNNX_DEBIT',
  BNC_DEBIT: 'BNC_DEBIT',
  BNC_CREDIT: 'BNC_CREDIT',
  BJRCB_DEBIT: 'BJRCB_DEBIT',
  JCB_DEBIT: 'JCB_DEBIT',
  JJCCB_DEBIT: 'JJCCB_DEBIT',
  JLB_DEBIT: 'JLB_DEBIT',
  JLNX_DEBIT: 'JLNX_DEBIT',
  JNRCB_DEBIT: 'JNRCB_DEBIT',
  JRCB_DEBIT: 'JRCB_DEBIT',
  JSHB_DEBIT: 'JSHB_DEBIT',
  HAINNX_DEBIT: 'HAINNX_DEBIT',
  GLB_DEBIT: 'GLB_DEBIT',
  GRCB_CREDIT: 'GRCB_CREDIT',
  GRCB_DEBIT: 'GRCB_DEBIT',
  GSB_DEBIT: 'GSB_DEBIT',
  GSNX_DEBIT: 'GSNX_DEBIT',
  GXNX_DEBIT: 'GXNX_DEBIT',
  GYCB_CREDIT: 'GYCB_CREDIT',
  GYCB_DEBIT: 'GYCB_DEBIT',
  GZNX_DEBIT: 'GZNX_DEBIT',
  HAINNX_CREDIT: 'HAINNX_CREDIT',
  HKB_DEBIT: 'HKB_DEBIT',
  HANAB_DEBIT: 'HANAB_DEBIT',
  HBCB_CREDIT: 'HBCB_CREDIT',
  HBCB_DEBIT: 'HBCB_DEBIT',
  HBNX_CREDIT: 'HBNX_CREDIT',
  HBNX_DEBIT: 'HBNX_DEBIT',
  HDCB_DEBIT: 'HDCB_DEBIT',
  HEBNX_DEBIT: 'HEBNX_DEBIT',
  HFB_DEBIT: 'HFB_DEBIT',
  HKBEA_DEBIT: 'HKBEA_DEBIT',
  JCB_CREDIT: 'JCB_CREDIT',
  MASTERCARD_CREDIT: 'MASTERCARD_CREDIT',
  VISA_CREDIT: 'VISA_CREDIT'
};

export const bankTypeEnum = [{
  label: '工商银行借记卡',
  value: bankType.ICBC_DEBIT
},
{
  label: '工商银行信用卡',
  value: bankType.ICBC_CREDIT
},
{
  label: '农业银行借记卡',
  value: bankType.ABC_DEBIT
},
{
  label: '农业银行信用卡',
  value: bankType.ABC_CREDIT
},
{
  label: '邮政储蓄银行借记卡',
  value: bankType.PSBC_DEBIT
},
{
  label: '邮政储蓄银行信用卡',
  value: bankType.PSBC_CREDIT
},
{
  label: '建设银行借记卡',
  value: bankType.CCB_DEBIT
},
{
  label: '建设银行信用卡',
  value: bankType.CCB_CREDIT
},
{
  label: '招商银行借记卡',
  value: bankType.CMB_DEBIT
},
{
  label: '招商银行信用卡',
  value: bankType.CMB_CREDIT
},
{
  label: '中国银行借记卡',
  value: bankType.BOC_DEBIT
},
{
  label: '中国银行信用卡',
  value: bankType.BOC_CREDIT
},
{
  label: '交通银行借记卡',
  value: bankType.COMM_DEBIT
},
{
  label: '交通银行信用卡',
  value: bankType.COMM_CREDIT
},
{
  label: '浦发银行借记卡',
  value: bankType.SPDB_DEBIT
},
{
  label: '浦发银行信用卡',
  value: bankType.SPDB_CREDIT
},
{
  label: '广发银行借记卡',
  value: bankType.GDB_DEBIT
},
{
  label: '广发银行信用卡',
  value: bankType.GDB_CREDIT
},
{
  label: '民生银行借记卡',
  value: bankType.CMBC_DEBIT
},
{
  label: '民生银行信用卡',
  value: bankType.CMBC_CREDIT
},
{
  label: '平安银行借记卡',
  value: bankType.PAB_DEBIT
},
{
  label: '平安银行信用卡',
  value: bankType.PAB_CREDIT
},
{
  label: '光大银行借记卡',
  value: bankType.CEB_DEBIT
},
{
  label: '光大银行信用卡',
  value: bankType.CEB_CREDIT
},
{
  label: '兴业银行借记卡',
  value: bankType.CIB_DEBIT
},
{
  label: '兴业银行信用卡',
  value: bankType.CIB_CREDIT
},
{
  label: '中信银行借记卡',
  value: bankType.CITIC_DEBIT
},
{
  label: '中信银行信用卡',
  value: bankType.CITIC_CREDIT
},
{
  label: '上海银行借记卡',
  value: bankType.BOSH_DEBIT
},
{
  label: '上海银行信用卡',
  value: bankType.BOSH_CREDIT
},
{
  label: '华润银行借记卡',
  value: bankType.CRB_DEBIT
},
{
  label: '杭州银行借记卡',
  value: bankType.HZB_DEBIT
},
{
  label: '杭州银行信用卡',
  value: bankType.HZB_CREDIT
},
{
  label: '包商银行借记卡',
  value: bankType.BSB_DEBIT
},
{
  label: '包商银行信用卡',
  value: bankType.BSB_CREDIT
},
{
  label: '重庆银行借记卡',
  value: bankType.CQB_DEBIT
},
{
  label: '顺德农商行借记卡',
  value: bankType.SDEB_DEBIT
},
{
  label: '深圳农商银行借记卡',
  value: bankType.SZRCB_DEBIT
},
{
  label: '深圳农商银行信用卡',
  value: bankType.SZRCB_CREDIT
},
{
  label: '哈尔滨银行借记卡',
  value: bankType.HRBB_DEBIT
},
{
  label: '成都银行借记卡',
  value: bankType.BOCD_DEBIT
},
{
  label: '南粤银行借记卡',
  value: bankType.GDNYB_DEBIT
},
{
  label: '南粤银行信用卡',
  value: bankType.GDNYB_CREDIT
},
{
  label: '广州银行借记卡',
  value: bankType.GZCB_DEBIT
},
{
  label: '广州银行信用卡',
  value: bankType.GZCB_CREDIT
},
{
  label: '江苏银行借记卡',
  value: bankType.JSB_DEBIT
},
{
  label: '江苏银行信用卡',
  value: bankType.JSB_CREDIT
},
{
  label: '宁波银行借记卡',
  value: bankType.NBCB_DEBIT
},
{
  label: '宁波银行信用卡',
  value: bankType.NBCB_CREDIT
},
{
  label: '南京银行借记卡',
  value: bankType.NJCB_DEBIT
},
{
  label: '青海农信借记卡',
  value: bankType.QHNX_DEBIT
},
{
  label: '鄂尔多斯银行信用卡',
  value: bankType.ORDOSB_CREDIT
},
{
  label: '鄂尔多斯银行借记卡',
  value: bankType.ORDOSB_DEBIT
},
{
  label: '北京农商信用卡',
  value: bankType.BJRCB_CREDIT
},
{
  label: '河北银行借记卡',
  value: bankType.BHB_DEBIT
},
{
  label: '贵州银行借记卡',
  value: bankType.BGZB_DEBIT
},
{
  label: '鄞州银行借记卡',
  value: bankType.BEEB_DEBIT
},
{
  label: '攀枝花银行借记卡',
  value: bankType.PZHCCB_DEBIT
},
{
  label: '青岛银行信用卡',
  value: bankType.QDCCB_CREDIT
},
{
  label: '青岛银行借记卡',
  value: bankType.QDCCB_DEBIT
},
{
  label: '新韩银行借记卡',
  value: bankType.SHINHAN_DEBIT
},
{
  label: '齐鲁银行借记卡',
  value: bankType.QLB_DEBIT
},
{
  label: '齐商银行借记卡',
  value: bankType.QSB_DEBIT
},
{
  label: '郑州银行借记卡',
  value: bankType.ZZB_DEBIT
},
{
  label: '长安银行借记卡',
  value: bankType.CCAB_DEBIT
},
{
  label: '日照银行借记卡',
  value: bankType.RZB_DEBIT
},
{
  label: '四川农信借记卡',
  value: bankType.SCNX_DEBIT
},
{
  label: '鄞州银行信用卡',
  value: bankType.BEEB_CREDIT
},
{
  label: '山东农信借记卡',
  value: bankType.SDRCU_DEBIT
},
{
  label: '沧州银行借记卡',
  value: bankType.BCZ_DEBIT
},
{
  label: '盛京银行借记卡',
  value: bankType.SJB_DEBIT
},
{
  label: '辽宁农信借记卡',
  value: bankType.LNNX_DEBIT
},
{
  label: '临朐聚丰村镇银行借记卡',
  value: bankType.JUFENGB_DEBIT
},
{
  label: '郑州银行信用卡',
  value: bankType.ZZB_CREDIT
},
{
  label: '江西农信借记卡',
  value: bankType.JXNXB_DEBIT
},
{
  label: '晋中银行借记卡',
  value: bankType.JZB_DEBIT
},
{
  label: '锦州银行信用卡',
  value: bankType.JZCB_CREDIT
},
{
  label: '锦州银行借记卡',
  value: bankType.JZCB_DEBIT
},
{
  label: '昆仑银行借记卡',
  value: bankType.KLB_DEBIT
},
{
  label: '昆山农商借记卡',
  value: bankType.KRCB_DEBIT
},
{
  label: '库尔勒市商业银行借记卡',
  value: bankType.KUERLECB_DEBIT
},
{
  label: '龙江银行借记卡',
  value: bankType.LJB_DEBIT
},
{
  label: '南阳村镇银行借记卡',
  value: bankType.NYCCB_DEBIT
},
{
  label: '乐山市商业银行借记卡',
  value: bankType.LSCCB_DEBIT
},
{
  label: '柳州银行借记卡',
  value: bankType.LUZB_DEBIT
},
{
  label: '莱商银行借记卡',
  value: bankType.LWB_DEBIT
},
{
  label: '辽阳银行借记卡',
  value: bankType.LYYHB_DEBIT
},
{
  label: '兰州银行借记卡',
  value: bankType.LZB_DEBIT
},
{
  label: '民泰银行信用卡',
  value: bankType.MINTAIB_CREDIT
},
{
  label: '民泰银行借记卡',
  value: bankType.MINTAIB_DEBIT
},
{
  label: '宁波通商银行借记卡',
  value: bankType.NCB_DEBIT
},
{
  label: '内蒙古农信借记卡',
  value: bankType.NMGNX_DEBIT
},
{
  label: '西安银行借记卡',
  value: bankType.XAB_DEBIT
},
{
  label: '潍坊银行信用卡',
  value: bankType.WFB_CREDIT
},
{
  label: '潍坊银行借记卡',
  value: bankType.WFB_DEBIT
},
{
  label: '威海商业银行信用卡',
  value: bankType.WHB_CREDIT
},
{
  label: '威海市商业银行借记卡',
  value: bankType.WHB_DEBIT
},
{
  label: '武汉农商信用卡',
  value: bankType.WHRC_CREDIT
},
{
  label: '武汉农商行借记卡',
  value: bankType.WHRC_DEBIT
},
{
  label: '吴江农商行借记卡',
  value: bankType.WJRCB_DEBIT
},
{
  label: '乌鲁木齐银行借记卡',
  value: bankType.WLMQB_DEBIT
},
{
  label: '无锡农商借记卡',
  value: bankType.WRCB_DEBIT
},
{
  label: '温州银行借记卡',
  value: bankType.WZB_DEBIT
},
{
  label: '西安银行信用卡',
  value: bankType.XAB_CREDIT
},
{
  label: '微众银行借记卡',
  value: bankType.WEB_DEBIT
},
{
  label: '厦门国际银行借记卡',
  value: bankType.XIB_DEBIT
},
{
  label: '新疆农信银行借记卡',
  value: bankType.XJRCCB_DEBIT
},
{
  label: '厦门银行借记卡',
  value: bankType.XMCCB_DEBIT
},
{
  label: '云南农信借记卡',
  value: bankType.YNRCCB_DEBIT
},
{
  label: '黄河农商银行信用卡',
  value: bankType.YRRCB_CREDIT
},
{
  label: '黄河农商银行借记卡',
  value: bankType.YRRCB_DEBIT
},
{
  label: '烟台银行借记卡',
  value: bankType.YTB_DEBIT
},
{
  label: '紫金农商银行借记卡',
  value: bankType.ZJB_DEBIT
},
{
  label: '兰溪越商银行借记卡',
  value: bankType.ZJLXRB_DEBIT
},
{
  label: '浙江农信信用卡',
  value: bankType.ZJRCUB_CREDIT
},
{
  label: '安徽省农村信用社联合社借记卡',
  value: bankType.AHRCUB_DEBIT
},
{
  label: '沧州银行信用卡',
  value: bankType.BCZ_CREDIT
},
{
  label: '上饶银行借记卡',
  value: bankType.SRB_DEBIT
},
{
  label: '中原银行借记卡',
  value: bankType.ZYB_DEBIT
},
{
  label: '张家港农商行借记卡',
  value: bankType.ZRCB_DEBIT
},
{
  label: '上海农商银行信用卡',
  value: bankType.SRCB_CREDIT
},
{
  label: '上海农商银行借记卡',
  value: bankType.SRCB_DEBIT
},
{
  label: '浙江泰隆银行借记卡',
  value: bankType.ZJTLCB_DEBIT
},
{
  label: '苏州银行借记卡',
  value: bankType.SUZB_DEBIT
},
{
  label: '山西农信借记卡',
  value: bankType.SXNX_DEBIT
},
{
  label: '陕西信合借记卡',
  value: bankType.SXXH_DEBIT
},
{
  label: '浙江农信借记卡',
  value: bankType.ZJRCUB_DEBIT
},
{
  label: 'AE信用卡',
  value: bankType.AE_CREDIT
},
{
  label: '泰安银行信用卡',
  value: bankType.TACCB_CREDIT
},
{
  label: '泰安银行借记卡',
  value: bankType.TACCB_DEBIT
},
{
  label: '太仓农商行借记卡',
  value: bankType.TCRCB_DEBIT
},
{
  label: '天津滨海农商行信用卡',
  value: bankType.TJBHB_CREDIT
},
{
  label: '天津滨海农商行借记卡',
  value: bankType.TJBHB_DEBIT
},
{
  label: '天津银行借记卡',
  value: bankType.TJB_DEBIT
},
{
  label: '天津农商借记卡',
  value: bankType.TRCB_DEBIT
},
{
  label: '台州银行借记卡',
  value: bankType.TZB_DEBIT
},
{
  label: '联合村镇银行借记卡',
  value: bankType.URB_DEBIT
},
{
  label: '东营银行信用卡',
  value: bankType.DYB_CREDIT
},
{
  label: '常熟农商银行借记卡',
  value: bankType.CSRCB_DEBIT
},
{
  label: '浙商银行信用卡',
  value: bankType.CZB_CREDIT
},
{
  label: '浙商银行借记卡',
  value: bankType.CZB_DEBIT
},
{
  label: '稠州银行信用卡',
  value: bankType.CZCB_CREDIT
},
{
  label: '稠州银行借记卡',
  value: bankType.CZCB_DEBIT
},
{
  label: '丹东银行信用卡',
  value: bankType.DANDONGB_CREDIT
},
{
  label: '丹东银行借记卡',
  value: bankType.DANDONGB_DEBIT
},
{
  label: '大连银行信用卡',
  value: bankType.DLB_CREDIT
},
{
  label: '大连银行借记卡',
  value: bankType.DLB_DEBIT
},
{
  label: '东莞农商银行信用卡',
  value: bankType.DRCB_CREDIT
},
{
  label: '东莞农商银行借记卡',
  value: bankType.DRCB_DEBIT
},
{
  label: '常熟农商银行信用卡',
  value: bankType.CSRCB_CREDIT
},
{
  label: '东营银行借记卡',
  value: bankType.DYB_DEBIT
},
{
  label: '德阳银行借记卡',
  value: bankType.DYCCB_DEBIT
},
{
  label: '富邦华一银行借记卡',
  value: bankType.FBB_DEBIT
},
{
  label: '富滇银行借记卡',
  value: bankType.FDB_DEBIT
},
{
  label: '福建海峡银行信用卡',
  value: bankType.FJHXB_CREDIT
},
{
  label: '福建海峡银行借记卡',
  value: bankType.FJHXB_DEBIT
},
{
  label: '福建农信银行借记卡',
  value: bankType.FJNX_DEBIT
},
{
  label: '阜新银行借记卡',
  value: bankType.FUXINB_DEBIT
},
{
  label: '承德银行借记卡',
  value: bankType.BOCDB_DEBIT
},
{
  label: '江苏农商行借记卡',
  value: bankType.JSNX_DEBIT
},
{
  label: '廊坊银行借记卡',
  value: bankType.BOLFB_DEBIT
},
{
  label: '长安银行信用卡',
  value: bankType.CCAB_CREDIT
},
{
  label: '渤海银行借记卡',
  value: bankType.CBHB_DEBIT
},
{
  label: '成都农商银行借记卡',
  value: bankType.CDRCB_DEBIT
},
{
  label: '营口银行借记卡',
  value: bankType.BYK_DEBIT
},
{
  label: '张家口市商业银行借记卡',
  value: bankType.BOZ_DEBIT
},
{
  label: '零钱',
  value: bankType.CFT
},
{
  label: '唐山银行借记卡',
  value: bankType.BOTSB_DEBIT
},
{
  label: '石嘴山银行借记卡',
  value: bankType.BOSZS_DEBIT
},
{
  label: '绍兴银行借记卡',
  value: bankType.BOSXB_DEBIT
},
{
  label: '宁夏银行借记卡',
  value: bankType.BONX_DEBIT
},
{
  label: '宁夏银行信用卡',
  value: bankType.BONX_CREDIT
},
{
  label: '广东华兴银行借记卡',
  value: bankType.GDHX_DEBIT
},
{
  label: '洛阳银行借记卡',
  value: bankType.BOLB_DEBIT
},
{
  label: '嘉兴银行借记卡',
  value: bankType.BOJX_DEBIT
},
{
  label: '内蒙古银行借记卡',
  value: bankType.BOIMCB_DEBIT
},
{
  label: '海南银行借记卡',
  value: bankType.BOHN_DEBIT
},
{
  label: '东莞银行借记卡',
  value: bankType.BOD_DEBIT
},
{
  label: '重庆农商银行信用卡',
  value: bankType.CQRCB_CREDIT
},
{
  label: '重庆农商银行借记卡',
  value: bankType.CQRCB_DEBIT
},
{
  label: '重庆三峡银行借记卡',
  value: bankType.CQTGB_DEBIT
},
{
  label: '东莞银行信用卡',
  value: bankType.BOD_CREDIT
},
{
  label: '长沙银行借记卡',
  value: bankType.CSCB_DEBIT
},
{
  label: '北京银行信用卡',
  value: bankType.BOB_CREDIT
},
{
  label: '广东农信银行借记卡',
  value: bankType.GDRCU_DEBIT
},
{
  label: '北京银行借记卡',
  value: bankType.BOB_DEBIT
},
{
  label: '华融湘江银行借记卡',
  value: bankType.HRXJB_DEBIT
},
{
  label: '恒生银行借记卡',
  value: bankType.HSBC_DEBIT
},
{
  label: '徽商银行信用卡',
  value: bankType.HSB_CREDIT
},
{
  label: '徽商银行借记卡',
  value: bankType.HSB_DEBIT
},
{
  label: '湖南农信借记卡',
  value: bankType.HUNNX_DEBIT
},
{
  label: '湖商村镇银行借记卡',
  value: bankType.HUSRB_DEBIT
},
{
  label: '华夏银行信用卡',
  value: bankType.HXB_CREDIT
},
{
  label: '华夏银行借记卡',
  value: bankType.HXB_DEBIT
},
{
  label: '河南农信借记卡',
  value: bankType.HNNX_DEBIT
},
{
  label: '江西银行借记卡',
  value: bankType.BNC_DEBIT
},
{
  label: '江西银行信用卡',
  value: bankType.BNC_CREDIT
},
{
  label: '北京农商行借记卡',
  value: bankType.BJRCB_DEBIT
},
{
  label: '晋城银行借记卡',
  value: bankType.JCB_DEBIT
},
{
  label: '九江银行借记卡',
  value: bankType.JJCCB_DEBIT
},
{
  label: '吉林银行借记卡',
  value: bankType.JLB_DEBIT
},
{
  label: '吉林农信借记卡',
  value: bankType.JLNX_DEBIT
},
{
  label: '江南农商借记卡',
  value: bankType.JNRCB_DEBIT
},
{
  label: '江阴农商行借记卡',
  value: bankType.JRCB_DEBIT
},
{
  label: '晋商银行借记卡',
  value: bankType.JSHB_DEBIT
},
{
  label: '海南农信借记卡',
  value: bankType.HAINNX_DEBIT
},
{
  label: '桂林银行借记卡',
  value: bankType.GLB_DEBIT
},
{
  label: '广州农商银行信用卡',
  value: bankType.GRCB_CREDIT
},
{
  label: '广州农商银行借记卡',
  value: bankType.GRCB_DEBIT
},
{
  label: '甘肃银行借记卡',
  value: bankType.GSB_DEBIT
},
{
  label: '甘肃农信借记卡',
  value: bankType.GSNX_DEBIT
},
{
  label: '广西农信借记卡',
  value: bankType.GXNX_DEBIT
},
{
  label: '贵阳银行信用卡',
  value: bankType.GYCB_CREDIT
},
{
  label: '贵阳银行借记卡',
  value: bankType.GYCB_DEBIT
},
{
  label: '贵州农信借记卡',
  value: bankType.GZNX_DEBIT
},
{
  label: '海南农信信用卡',
  value: bankType.HAINNX_CREDIT
},
{
  label: '汉口银行借记卡',
  value: bankType.HKB_DEBIT
},
{
  label: '韩亚银行借记卡',
  value: bankType.HANAB_DEBIT
},
{
  label: '湖北银行信用卡',
  value: bankType.HBCB_CREDIT
},
{
  label: '湖北银行借记卡',
  value: bankType.HBCB_DEBIT
},
{
  label: '湖北农信信用卡',
  value: bankType.HBNX_CREDIT
},
{
  label: '湖北农信借记卡',
  value: bankType.HBNX_DEBIT
},
{
  label: '邯郸银行借记卡',
  value: bankType.HDCB_DEBIT
},
{
  label: '河北农信借记卡',
  value: bankType.HEBNX_DEBIT
},
{
  label: '恒丰银行借记卡',
  value: bankType.HFB_DEBIT
},
{
  label: '东亚银行借记卡',
  value: bankType.HKBEA_DEBIT
},
{
  label: 'JCB信用卡',
  value: bankType.JCB_CREDIT
},
{
  label: 'MASTERCARD信用卡',
  value: bankType.MASTERCARD_CREDIT
},
{
  label: 'VISA信用卡',
  value: bankType.VISA_CREDIT
}
];

// 小程序广告位时间限制 时间限制(LIMITED 限时   UNLIMITED 不限时)
export const timeLimited = {
  LIMITED: 'LIMITED',
  UNLIMITED: 'UNLIMITED'
};

export const timeLimitedEnum = [{
  label: '限时',
  value: timeLimited.LIMITED
},
{
  label: '不限时',
  value: timeLimited.UNLIMITED
}
];

// 小程序广告位类型(WORD 文字 IMAGE 图片 CAROUSEL 轮播)
export const advertisementPositionType = {
  WORD: 'WORD',
  IMAGE: 'IMAGE',
  CAROUSEL: 'CAROUSEL'
};

export const advertisementPositionTypeEnum = [{
  label: '文字',
  value: advertisementPositionType.WORD
},
{
  label: '图片',
  value: advertisementPositionType.IMAGE
},
{
  label: '轮播图',
  value: advertisementPositionType.CAROUSEL
}
];

// 小程序广告关联类别
// GOODSINFO("商品详情"),STORELIVE("门店直播"),
// AMUSEMENT("多娱"),EXTERNALLINK("外部链接"), INTERNALLINK('内部链接') TABLINK('底部导航')
// GAME("游戏"),INVITEACTIVE("邀请有礼"),FLASHACTIVE("抢购商品"),RECHARGE("充值页面"),STOCK("仓库")
export const linkType = {
  GOODSINFO: 'GOODSINFO',
  STORELIVE: 'STORELIVE',
  AMUSEMENT: 'AMUSEMENT',
  EXTERNALLINK: 'EXTERNALLINK',
  GAME: 'GAME',
  INVITEACTIVE: 'INVITEACTIVE',
  FLASHACTIVE: 'FLASHACTIVE',
  RECHARGE: 'RECHARGE',
  STOCK: 'STOCK',
  TABLINK: 'TABLINK',
  INTERNALLINK: 'INTERNALLINK'
};

export const linkTypeEnum = [{
  label: '商品详情',
  value: linkType.GOODSINFO
},
{
  label: '门店直播',
  value: linkType.STORELIVE
},
{
  label: '多娱',
  value: linkType.AMUSEMENT
},
{
  label: '底部导航',
  value: linkType.TABLINK
},
{
  label: '内部链接',
  value: linkType.INTERNALLINK
},
{
  label: '外部链接',
  value: linkType.EXTERNALLINK
},
{
  label: '游戏',
  value: linkType.GAME
},
{
  label: '邀请有礼',
  value: linkType.INVITEACTIVE
},
{
  label: '抢购商品',
  value: linkType.FLASHACTIVE
},
{
  label: '充值页面',
  value: linkType.RECHARGE
},
{
  label: '仓库',
  value: linkType.STOCK
}
];

// 小程序订单状态
// WAIT_PAYMENT("待支付"),PAYMENTING("支付中"),WAIT_SEND_OUT("待发货"),SEND_OUT("已发货"),
// DISPATCHING("配送中"),RECEIVED("已收货"),RETURNING("退货中"),
// ALREADY_RETURN("退货完成"),FAILURE("已失效"),FINISHED("已完成");

export const miniOrderStatus = {
  WAIT_PAYMENT: 'WAIT_PAYMENT',
  PAYMENTING: 'PAYMENTING',
  WAIT_SEND_OUT: 'WAIT_SEND_OUT',
  SEND_OUT: 'SEND_OUT',
  DISPATCHING: 'DISPATCHING',
  RECEIVED: 'RECEIVED',
  RETURNING: 'RETURNING',
  ALREADY_RETURN: 'ALREADY_RETURN',
  FAILURE: 'FAILURE',
  FINISHED: 'FINISHED'
};

export const miniOrderStatusEnum = [{
  label: '待支付',
  value: miniOrderStatus.WAIT_PAYMENT
},
{
  label: '支付中',
  value: miniOrderStatus.PAYMENTING
},
{
  label: '待发货',
  value: miniOrderStatus.WAIT_SEND_OUT
},
{
  label: '已发货',
  value: miniOrderStatus.SEND_OUT
},
{
  label: '配送中',
  value: miniOrderStatus.DISPATCHING
},
{
  label: '已收货',
  value: miniOrderStatus.RECEIVED
},
{
  label: '退货中',
  value: miniOrderStatus.RETURNING
},
{
  label: '退货完成',
  value: miniOrderStatus.ALREADY_RETURN
},
{
  label: '已失效',
  value: miniOrderStatus.FAILURE
},
{
  label: '已完成',
  value: miniOrderStatus.FINISHED
}
];

// 小程序海鼎状态 NOT_SEND("未发送"),SEND_OUT("成功")

export const miniHdStatus = {
  NOT_SEND: 'NOT_SEND',
  SEND_OUT: 'SEND_OUT',
  SEND_FAILURE: 'SEND_FAILURE'
};

export const miniHdStatusEnum = [{
  label: '未发送',
  value: miniHdStatus.NOT_SEND
},
{
  label: '成功',
  value: miniHdStatus.SEND_OUT
},
{
  label: '失败',
  value: miniHdStatus.SEND_FAILURE
}
];

// 小程序订单类型 SHOPPING("导购订单"),SELF_BUYING("自购订单"),TEAM_BUYING("团购订单"),PICKING("提货订单");
//              TEAM_BUYING-团购订单 SELF_BUYING-微商城小程序订单 POINTS_BUYING-积分兑换订单 PRESAL_ORDER-预售订单
export const miniOrderType = {
  SELF_BUYING: 'SELF_BUYING',
  TEAM_BUYING: 'TEAM_BUYING',
  PRESAL_ORDER: 'PRESAL_ORDER',
  POINTS_BUYING: 'POINTS_BUYING'
};

export const miniOrderTypeEnum = [{
  label: '自购订单',
  value: miniOrderType.SELF_BUYING
},
{
  label: '团购订单',
  value: miniOrderType.TEAM_BUYING
},
{
  label: '预售订单',
  value: miniOrderType.PRESAL_ORDER
},
{
  label: '积分兑换订单',
  value: miniOrderType.POINTS_BUYING
}
];

// 配送状态 UNRECEIVE-未接单 WAIT_GET-待取货 TRANSFERING-配送中 DONE-配送完成 FAILURE-配送失败
export const deliverStatus = {
  UNRECEIVE: 'UNRECEIVE',
  WAIT_GET: 'WAIT_GET',
  TRANSFERING: 'TRANSFERING',
  DONE: 'DONE',
  FAILURE: 'FAILURE'
}

export const deliverStatusEnum = [{
  label: '未接单',
  value: deliverStatus.UNRECEIVE
},
{
  label: '待取货',
  value: deliverStatus.WAIT_GET
},
{
  label: '配送中',
  value: deliverStatus.TRANSFERING
},
{
  label: '配送完成',
  value: deliverStatus.DONE
},
{
  label: '配送失败',
  value: deliverStatus.FAILURE
}
]

// uncertified-未认证(审核拒绝) unaudited-待审核 certified-已认证 locking-锁定
export const userStatusEnum = [{
  label: '未认证',
  value: 'uncertified'
},
{
  label: '待审核',
  value: 'unaudited'
},
{
  label: '锁定',
  value: 'locking'
},
{
  label: '已认证',
  value: 'certified'
}
]

export const userTypeEnum = [{
  label: '普通用户',
  value: 'consumer'
},
{
  label: '业务员',
  value: 'sale'
}
]

export const sexEnum = [{
  label: '男',
  value: 'male'
},
{
  label: '女',
  value: 'female'
},
{
  label: '未知',
  value: 'unknown'
}
]

export const wholesalePayTypeEnum = [{
  label: '微信支付',
  value: 'wechat'
},
{
  label: '余额支付',
  value: 'balance'
},
{
  label: '线下支付',
  value: 'offline'
},
{
  label: '鼎付通',
  value: 'haiding'
},
{
  label: '组合支付(余额微信)',
  value: 'balance_wechat'
},
{
  label: '组合支付(余额海鼎)',
  value: 'balance_haiding'
}
]

export const wholesaleOrderStatusEnum = [{
  label: '待付款',
  value: 'unpaid'
},
{
  label: '支付中',
  value: 'paying'
},
{
  label: '待发货',
  value: 'undelivery'
},
{
  label: '配送中',
  value: 'delivery'
},
{
  label: '退货中',
  value: 'unrefunded'
},
{
  label: '退款失败',
  value: 'refundfailed'
},
{
  label: '退货完成',
  value: 'refunded'
},
{
  label: '已失效',
  value: 'failed'
},
{
  label: '已收货',
  value: 'received'
}
];

export const payStatusEnum = [{
  label: '已支付',
  value: 'paid'
},
{
  label: '未支付',
  value: 'unpaid'
}
]

export const wholesaleHdStatusEnum = [{
  label: '成功',
  value: 'success'
},
{
  label: '失败',
  value: 'failed'
}
];

export const activityTypeEnum = [{
  label: '限时抢购',
  value: 'flashsale'
},
{
  label: '注册送礼',
  value: 'registration'
},
{
  label: '充值活动',
  value: 'recharge'
}
];

export const activityStatusEnum = [{
  label: '有效',
  value: 'yes'
},
{
  label: '无效',
  value: 'no'
}
];

export const couponTemplateTypeEnum = [{
  label: '全品类',
  value: 'allgoods'
},
{
  label: '单品',
  value: 'singlegoods'
}
];

// unused-未使用 used-已使用 expired-已过期
export const couponUseStatusEnum = [{
  label: '未使用',
  value: 'unused'
},
{
  label: '已使用',
  value: 'used'
},
{
  label: '已过期',
  value: 'expired'
}
];

// artificial-手动发券，registration-注册送礼,recharge-充值活动 flashsale-限时抢购
export const couponFromEnum = [{
  label: '手动发券',
  value: 'artificial'
},
{
  label: '注册送礼',
  value: 'registration'
},
{
  label: '充值活动',
  value: 'recharge'
},
{
  label: '限时抢购',
  value: 'flashsale'
},
{
  label: '活动送券',
  value: 'activity'
},
];

export const layoutEnum = [{
  label: '横向布局',
  value: 'xlayout'
},
{
  label: '纵向布局',
  value: 'ylayout'
},
{
  label: '滚动布局',
  value: 'roll'
},
{
  label: '推荐列表',
  value: 'list'
}
]

export const advPositionEnum = [{
  label: '首页弹窗',
  value: 'poppup'
},
{
  label: '顶部轮播图',
  value: 'top'
},
{
  label: '限时抢购',
  value: 'flashsale'
},
{
  label: '底部banner图',
  value: 'bottom'
}
]

export const faqStatusEnum = [{
  label: '未发布',
  value: 'unpublished'
},
{
  label: '已发布',
  value: 'published'
}
]

export const articleTypeEnum = [{
  label: '每日精选',
  value: 'perday'
},
{
  label: '行业趋势',
  value: 'industry'
}
]

export const createTypeEnum = [{
  label: '原创文章',
  value: 'original'
},
{
  label: '转载文章',
  value: 'reprint'
}
]

export const showTypeEnum = [{
  label: '常态',
  value: 'normal'
},
{
  label: '列表',
  value: 'list'
},
{
  label: '对象',
  value: 'map'
},
{
  label: '时间',
  value: 'time'
}
]

export const paymentFromEnum = [{
  label: '充值',
  value: 'recharge'
},
{
  label: '订单',
  value: 'order'
},
{
  label: '发票',
  value: 'invoice'
},
{
  label: '账款',
  value: 'debt'
}
];

// MRQD-每日签到、WSGRZL-完善个人资料、XRXSSDXF-新人线上首单消费、XSSCCZ-线上首次充值、XSYDCZ-线上月度充值、XSYDXF-线上月度消费
export const taskTypeEnum = [{
  label: '每日签到',
  value: 'MRQD'
},
{
  label: '完善个人资料',
  value: 'WSGRZL'
},
{
  label: '新人线上首单消费',
  value: 'XRXSSDXF'
},
{
  label: '线上首次充值',
  value: 'XSSCCZ'
},
{
  label: '线上月度充值',
  value: 'XSYDCZ'
},
{
  label: '线上月度消费',
  value: 'XSYDXF'
}
]

// 奖励类型（INTEGRAL-积分、GIFTPACK-礼包）
export const rewardTypeEnum = [{
  label: '积分',
  value: 'INTEGRAL'
},
{
  label: '礼包',
  value: 'GIFTPACK'
}]

// 骑手评价(很差:NEGATIVE;一般:GENERAL;超赞:GOOD)
export const deliveryTypeEnum = [{
  label: '很差',
  value: 'NEGATIVE'
},
{
  label: '一般',
  value: 'GENERAL'
},
{
  label: '超赞',
  value: 'GOOD'
}]

export const commentScoreTypeEnum = [{
  label: '1星',
  value: '1'
},
{
  label: '2星',
  value: '2'
},
{
  label: '3星',
  value: '3'
},
{
  label: '4星',
  value: '4'
},
{
  label: '5星',
  value: '5'
}]

// 领取状态（YES-已领取、NO-未领取）
export const receiveStatusEnum = [{
  label: '已领取',
  value: 'YES'
},
{
  label: '未领取',
  value: 'NO'
}]

// 售后方式
export const serviceModeEnum = [{
  label: '补货',
  value: 'REPLENISH'
},
{
  label: '补款',
  value: 'SUPPLEMENT'
},
{
  label: '返仓',
  value: 'REVERT'
}, {
  label: '退运费',
  value: 'ABNORMAL'
}]
// 售后状态
export const serviceStatusEnum = [{
  label: '待审核',
  value: 'WAIT'
},
{
  label: '审核拒绝',
  value: 'AUDIT_REJECT'
}, {
  label: '客户取消',
  value: 'CANCEL'
},
{
  label: '待财务确认',
  value: 'WAIT_REVIEW'
},
{
  label: '财务拒绝',
  value: 'REVIEW_REJECT'
},
{
  label: '售后中',
  value: 'SERVICEING'
},
{
  label: '售后完成',
  value: 'FINISH'
}]

