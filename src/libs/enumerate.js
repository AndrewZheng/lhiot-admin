export const YNEnum = {
  YES: 'YES',
  NO: 'NO'
};

// 提货方式
// TO_THE_STORE-门店自提,
// TO_THE_HOME-送货上门
export const receivingWay = {
  TO_THE_STORE: 'TO_THE_STORE',
  TO_THE_HOME: 'TO_THE_HOME'
};

export const receivingWayEnum = [
  {
    label: '门店自提',
    value: receivingWay.TO_THE_STORE
  },
  {
    label: '送货上门',
    value: receivingWay.TO_THE_HOME
  }
];

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

export const orderStatusEnum = [
  {
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
export const orderTypeEnum = [
  {
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
export const customOrderStatusEnum = [
  {
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

export const customDeliverStatusEnum = [
  {
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

export const thirdDelieverStatusEnum = [
  {
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
export const customPeriodEnum = [
  {
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

export const deliveryTypeCustomEnum = [
  {
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

export const settlementStatusEnum = [
  {
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

export const doctorLevelEnum = [
  {
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

export const doctorStatusEnum = [
  {
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

export const onSaleStatusEnum = [
  {
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

export const customPlanStatusEnum = [
  {
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

export const hotEnum = [
  {
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

export const deliveryAtTypeEnum = [
  {
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

export const updateWayEnum = [
  {
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

export const positionTypeEnum = [
  {
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

export const relationTypeEnum = [
  {
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

export const feedbackStatusEnum = [
  {
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

export const storeStatusEnum = [
  {
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
  FLAGSHIP_STORE: 'FLAGSHIP_STORE'
};

export const storeTypeEnum = [
  {
    label: '普通门店',
    value: storeType.ORDINARY_STORE
  },
  {
    label: '旗舰店',
    value: storeType.FLAGSHIP_STORE
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

export const coordinateTypeEnum = [
  {
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

export const splitStatusEnum = [
  {
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

export const productStatusEnum = [
  {
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

export const imageStatusEnum = [
  {
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

export const imageTypeEnum = [
  {
    label: '拼团保障图',
    value: imageType.TEAM_GUARANTEE
  }
]

// 小程序团购活动状态 off 未开启 on 开启  expire 过期
export const teamBuyStatus = {
  off: 'off',
  on: 'on',
  expire: 'expire'
}

export const teamBuyStatusEnum = [
  {
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

// 小程序团购活动活动类型 ORDINARY_TEAM("普通团"),OLD_AND_NEW("老带新团")
export const teamBuyType = {
  ORDINARY_TEAM: 'ORDINARY_TEAM',
  OLD_AND_NEW: 'OLD_AND_NEW'
}

export const teamBuyTypeEnum = [
  {
    label: '普通团',
    value: teamBuyType.ORDINARY_TEAM
  },
  {
    label: '老带新团',
    value: teamBuyType.OLD_AND_NEW
  }
]

//  小程序红包活动设置 DISABLE("关闭"),ALL_ENABLE("全部开启"),SINGLE_ENABLE("单人购买开启活动"),MULTIPLE_ENABLE("多人团开启活动")
export const rewardActivitySetting = {
  DISABLE: 'DISABLE',
  ALL_ENABLE: 'ALL_ENABLE',
  SINGLE_ENABLE: 'SINGLE_ENABLE',
  MULTIPLE_ENABLE: 'MULTIPLE_ENABLE'
}

export const rewardActivitySettingEnum = [
  {
    label: '关闭',
    value: rewardActivitySetting.DISABLE
  },
  {
    label: '全部开启',
    value: rewardActivitySetting.ALL_ENABLE
  },
  {
    label: '单人购买开启活动',
    value: rewardActivitySetting.SINGLE_ENABLE
  },
  {
    label: '多人团开启活动',
    value: rewardActivitySetting.MULTIPLE_ENABLE
  }
]

// 小程序关联门店 ALL(全部门店), PART(部分门店)
export const relationStoreType = {
  ALL: 'ALL',
  PART: 'PART'
}

export const relationStoreTypeEnum = [
  {
    label: '全部门店',
    value: relationStoreType.ALL
  },
  {
    label: '部分门店',
    value: relationStoreType.PART
  }
]

// 小程序优惠券状态 有效-VALID 无效-INVALID
export const couponStatus = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  EXPIRE: 'EXPIRE'
};

export const couponStatusEnum = [
  {
    label: '有效',
    value: couponStatus.VALID
  },
  {
    label: '无效',
    value: couponStatus.INVALID
  },
  {
    label: '过期',
    value: couponStatus.EXPIRE
  }
];

// 小程序优惠券类型(FULL_CUT_COUPON 满减券;DISCOUNT_COUPON 折扣券;CASH_COUPON 现金券)
export const couponType = {
  FULL_CUT_COUPON: 'FULL_CUT_COUPON',
  DISCOUNT_COUPON: 'DISCOUNT_COUPON',
  CASH_COUPON: 'CASH_COUPON'
};

export const couponTypeEnum = [
  {
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
];
