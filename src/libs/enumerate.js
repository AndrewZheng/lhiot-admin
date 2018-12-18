export const positionTypeEnum = {
  PRODUCT: 'PRODUCT',
  ADVERTISEMENT: 'ADVERTISEMENT',
  ARTICLE: 'ARTICLE'
};

export const YNEnum = {
  YES: 'YES',
  NO: 'NO'
};

// 提货方式
// TO_THE_STORE-门店自提,
// TO_THE_HOME-送货上门
export const receivingWay ={
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
export const orderStatus ={
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
    label: '待支付',
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
export const orderType ={
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
export const settlementStatus ={
  UNSETTLED: 'UNSETTLED',
  SUCCESS: 'SUCCESS',
  EXPIRED: 'EXPIRED'
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
