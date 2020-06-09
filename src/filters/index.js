import moment from 'moment';
import {
  customOrderStatusConvert,
  customPeriodConvert,
  customPlanStatusConvert,
  deliveryTypeCustomConvert,
  doctorLevelConvert,
  doctorStatusConvert,
  hotConvert,
  onSaleStatusConvert,
  orderStatusConvert,
  orderTypeConvert,
  receivingWayConvert,
  settlementStatusConvert,
  feedbackStatusConvert,
  productStatusConvert,
  imageStatusConvert,
  imageTypeConvert,
  teamBuyStatusConvert,
  teamBuyTypeConvert,
  rewardActivitySettingConvert,
  couponStatusConvert,
  couponTypeConvert,
  appTypeConvert,
  bankTypeConvert,
  timeLimitedConvert,
  advertisementPositionTypeConvert,
  couponScopeConvert,
  activityTypeConvert,
  advertisementLinkTypeConvert,
  miniOrderStatusConvert,
  wholesaleHdStatusConvert,
  miniOrderTypeConvert,
  yesNoConvert,
  deliverStatusConvert,
  couponUseLimitConvert,
  validDateTypeConvert,
  storeStatusConvert,
  vipTypeConvert,
  wholesaleOrderStatusConvert,
  payStatusConvert,
  wholesalePayTypeConvert,
  advPositionConvert,
  showTypeConvert,
  coordinateTypeConvert } from '@/libs/converStatus';

const filters = {};

filters.formatMoney = (value) => {
  if (!value) {
    return '0.00';
  }
  return Number(parseFloat(value / 100)).toFixed(2);
};

filters.formatMoneyToOne = (value) => {
  if (!value) {
    return '0.00';
  }
  return Number(parseFloat(value / 100)).toFixed(1);
};

filters.parseMoney = (value) => {
  if (!value) return 0;
  return Number(parseInt(value).toFixed(0));
};

filters.formatDate = (value, formatString) => {
  if (!value) return 'N/A';
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return moment(value).format(formatString);
};

filters.switchStatus = (val) => {
  let statusName = '';
  switch (val) {
    case 'FAILURE':
    {
      statusName = '已失效';
      break;
    }
    case 'WAIT_PAYMENT':
    {
      statusName = '待付款';
      break;
    }
    case 'PAYMENTING':
    {
      statusName = '支付中';
      break;
    }
    case 'WAIT_SEND_OUT':
    {
      statusName = '待发货';
      break;
    }
    case 'SEND_OUT':
    {
      statusName = '已发货';
      break;
    }
    case 'DISPATCHING':
    {
      statusName = '配送中';
      break;
    }
    case 'RECEIVED':
    {
      statusName = '已收货';
      break;
    }
    case 'RETURNING':
    {
      statusName = '退货中';
      break;
    }
    case 'ALREADY_RETURN':
    {
      statusName = '退货完成';
      break;
    }
    case 'RETURN_FAILURE':
    {
      statusName = '退货失败';
      break;
    }
    case 'FINISHED':
    {
      statusName = '已完成';
      break;
    }
  }
  return statusName;
};

filters.switchPayType = (val) => {
  let type = '';
  switch (val) {
    case 'balance':
    {
      type = '鲜果币支付';
      break;
    }
    case 'weixin':
    {
      type = '微信支付';
      break;
    }
    default:
      type = '未支付';
  }
  return type;
};

filters.switchDeliveryType = (val) => {
  let type = '';
  switch (val) {
    case 'TO_THE_STORE':
    {
      type = '门店自提';
      break;
    }
    case 'TO_THE_HOME':
    {
      type = '送货上门';
      break;
    }
  }
  return type;
};

filters.switchAuditStatus = (val) => {
  let statusName = '';
  switch (val) {
    case 'unaudited':
    {
      statusName = '待审核';
      break;
    }
    case 'auditeding':
    {
      statusName = '审核中';
      break;
    }
    case 'agree':
    {
      statusName = '审核通过';
      break;
    }
    case 'reject':
    {
      statusName = '审核不通过';
      break;
    }
  }
  return statusName;
};

filters.defaultImg = (value) => {
  const src = require('assets/images/icon/img-error.png');
  if (!value) return src;
  return value;
};

filters.defaultBanner = (value) => {
  const src = require('assets/images/icon/default_banner.png');
  if (!value) return src;
  return value;
};

filters.defaultProduct = (value) => {
  const src = require('assets/images/icon/default_product.png');
  if (!value) return src;
  return value;
};

filters.defaultNews = (value) => {
  const src = require('assets/images/icon/default_news.png');
  if (!value) return src;
  return value;
};

filters.stripScript = (value) => {
  var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]');
  var rs = '';
  for (var i = 0; i < value.length; i++) {
    rs = rs + value.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

filters.timeAgo = (time) => {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
};

filters.numberFormatter = (num, digits) => {
  const si = [{
    value: 1E18,
    symbol: 'E'
  },
  {
    value: 1E15,
    symbol: 'P'
  },
  {
    value: 1E12,
    symbol: 'T'
  },
  {
    value: 1E9,
    symbol: 'G'
  },
  {
    value: 1E6,
    symbol: 'M'
  },
  {
    value: 1E3,
    symbol: 'k'
  }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
};

filters.toThousandFilter = (num) => {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
};

// 坐标系
filters.coordinateTypeFilter = (value) => {
  return coordinateTypeConvert(value).label
}

// 结算状态
filters.settlementStatusFilters = (name) => {
  return settlementStatusConvert(name).label;
}
// 鲜果师等级
filters.doctorLevelFilters = (name) => {
  return doctorLevelConvert(name).label;
}

// 鲜果师状态
filters.doctorStatusFilters = (name) => {
  return doctorStatusConvert(name).label;
}

// 明星鲜果师
filters.hotFilters = (name) => {
  return hotConvert(name).label;
}

// 订单状态
filters.orderStatusFilters = (status) => {
  return orderStatusConvert(status).label;
}

// 门店管理状态
filters.storeStatusFilters = (status) => {
  return storeStatusConvert(status).label;
}

// 提货方式
filters.receivingWayFilters = (status) => {
  return receivingWayConvert(status).label;
}

// 订单类型
filters.orderTypeFilters = (status) => {
  return orderTypeConvert(status).label;
}

// 定制周期
filters.customPeriodFilters = (status) => {
  return customPeriodConvert(status).label;
}

// 定制状态
filters.customOrderStatusFilters = (status) => {
  return customOrderStatusConvert(status).label;
}

// 定制配送方式
filters.deliveryTypeCustomFilters = (status) => {
  return deliveryTypeCustomConvert(status).label;
}

// 商品上架
filters.onSaleStatusFilters = (status) => {
  return onSaleStatusConvert(status).label;
}

// 定制计划商品上架
filters.customPlanStatusFilters = (status) => {
  return customPlanStatusConvert(status).label;
}

// 反馈状态
filters.feedbackStatusFilters = (status) => {
  return feedbackStatusConvert(status).label;
}

// 小程序商品状态
filters.productStatusFilter = (status) => {
  return productStatusConvert(status).label;
}

// 小程序图片状态
filters.imageStatusFilter = (status) => {
  return imageStatusConvert(status).label;
}

// 小程序图片类型
filters.imageTypeFilter = (type) => {
  return imageTypeConvert(type).label;
}

// 小程序团购活动状态
filters.teamBuyStatusFilter = (status) => {
  return teamBuyStatusConvert(status).label;
}

// 小程序团购类型
filters.teamBuyTypeFilter = (type) => {
  return teamBuyTypeConvert(type).label;
}

// 小程序红包活动设置
filters.rewardActivitySettingFilter = (type) => {
  return rewardActivitySettingConvert(type).label;
}

// 小程序优惠券状态
filters.couponStatusFilter = (status) => {
  return couponStatusConvert(status).label;
}

// 小程序优惠券使用范围
filters.couponScopeFilter = (status) => {
  return couponScopeConvert(status).label;
}

// 批发商城活动类型
filters.pfActivityTypeFilter = (status) => {
  return activityTypeConvert(status).label;
}

// 小程序优惠券有效期类型
filters.validDateTypeFilter = (status) => {
  return validDateTypeConvert(status).label;
}

// 小程序优惠券使用限制
filters.couponUseLimitFilter = (status) => {
  return couponUseLimitConvert(status).label;
}

// 小程序优惠券状态
filters.couponTypeFilter = (type) => {
  return couponTypeConvert(type).label;
}

// 小程序会员状态
filters.vipStatusFilter = (type) => {
  return vipTypeConvert(type).label;
}

// 小程序应用类型
filters.appTypeFilter = (type) => {
  return appTypeConvert(type).label;
}

// 小程序银行类型
filters.bankTypeFilter = (type) => {
  return bankTypeConvert(type).label;
}

// 小程序广告位时间限制
filters.timeLimitedFilter = (type) => {
  return timeLimitedConvert(type).label;
}

// 小程序广告位类型
filters.advertisementPositionTypeFilter = (type) => {
  return advertisementPositionTypeConvert(type).label;
}

// 小程序广告位链接类型
filters.advertisementLinkTypeFilter = (type) => {
  return advertisementLinkTypeConvert(type).label;
}

// 小程序订单状态
filters.miniOrderStatusFilter = (status) => {
  return miniOrderStatusConvert(status).label;
}

// 小程序海鼎状态
filters.miniHdStatusFilter = (status) => {
  return wholesaleHdStatusConvert(status).label;
}

// 小程序订单类型
filters.miniOrderTypeFilter = (type) => {
  return miniOrderTypeConvert(type).label;
}

filters.yesNoFilter = (type) => {
  return yesNoConvert(type).label;
}

// 小程序订单配送状态
filters.deliverStatusFilter = (status) => {
  return deliverStatusConvert(status).label;
}

// 批发小程序订单状态
filters.wholesaleOrderStatusFilter = (status) => {
  return wholesaleOrderStatusConvert(status).label;
}

// 批发小程序海鼎状态
filters.wholesaleHdStatusFilter = (status) => {
  return wholesaleHdStatusConvert(status).label;
}

filters.wholeslaePayTypeFilter = (type) => {
  return wholesalePayTypeConvert(type).label;
}

filters.payStatusFilter = (status) => {
  return payStatusConvert(status).label;
}

filters.advPositionFilter = (value) => {
  return advPositionConvert(value).label;
}

filters.showTypeFilter = (value) => {
  return showTypeConvert(value).label;
}

export default filters;
