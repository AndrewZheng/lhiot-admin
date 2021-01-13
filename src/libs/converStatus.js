import {
  customDeliverStatusEnum,
  customOrderStatusEnum,
  customPeriodEnum,
  deliveryAtTypeEnum,
  customPlanStatusEnum,
  deliveryTypeCustomEnum,
  doctorLevelEnum,
  doctorStatusEnum,
  hotEnum,
  onSaleStatusEnum,
  orderStatusEnum,
  orderTypeEnum,
  positionTypeEnum,
  receivingWayEnum,
  isAllRefundEnum,
  relationTypeEnum,
  settlementStatusEnum,
  thirdDelieverStatusEnum,
  updateWayEnum,
  storeStatusEnum,
  storeTypeEnum,
  coordinateTypeEnum,
  feedbackStatusEnum,
  // 小程序
  splitStatusEnum,
  productStatusEnum,
  imageStatusEnum,
  imageTypeEnum,
  teamBuyStatusEnum,
  teamBuyTypeEnum,
  rewardActivitySettingEnum,
  couponActivityTypeEnum,
  couponStatusEnum,
  vipStatusEnum,
  receiveTypeEnum,
  packageTypeEnum,
  packageStatusEnum,
  userScopeEnum,
  memberLimitEnum,
  couponTypeEnum,
  couponScopeEnum,
  couponUseLimitEnum,
  giftTypeEnum,
  expandTypeEnum,
  pfExpandTypeEnum,
  appTypeEnum,
  appTypesEnum,
  payTypeEnum,
  payStepEnum,
  sourceTypeEnum,
  bankTypeEnum,
  advertisementPositionTypeEnum,
  timeLimitedEnum,
  linkTypeEnum,
  miniOrderStatusEnum,
  miniHdStatusEnum,
  miniOrderTypeEnum,
  yesNoEnum,
  deliverStatusEnum,
  validDateTypeEnum,
  taskTypeEnum,
  rewardTypeEnum,
  deliveryTypeEnum,
  commentScoreTypeEnum,
  receiveStatusEnum,
  serviceModeEnum,
  serviceStatusEnum,
  whiteListEnum,
  // 批发商城小程序
  userStatusEnum,
  userTypeEnum,
  sexEnum,
  wholesalePayTypeEnum,
  wholesaleOrderStatusEnum,
  payStatusEnum,
  wholesaleHdStatusEnum,
  activityTypeEnum,
  activityStatusEnum,
  couponTemplateTypeEnum,
  couponUseStatusEnum,
  couponFromEnum,
  advPositionEnum,
  faqStatusEnum,
  articleTypeEnum,
  createTypeEnum,
  layoutEnum,
  showTypeEnum,
  paymentFromEnum
} from './enumerate';

const convertFunction = (value, list) => {
  const obj = list.find(item => item.value === value);
  if (obj) {
    return obj;
  } else {
    return {
      label: value || 'N/A'
    };
  }
};

export const receiveStatusConvert = (value) => {
  return convertFunction(value, receiveStatusEnum).label;
};

export const serviceModeConvert = (value) => {
  return convertFunction(value, serviceModeEnum).label;
};

export const serviceStatusConvert = (value) => {
  return convertFunction(value, serviceStatusEnum).label;
};

export const rewardTypeConvert = (value) => {
  return convertFunction(value, rewardTypeEnum).label;
};

export const deliveryTypeConvert = (value) => {
  return convertFunction(value, deliveryTypeEnum).label;
};

export const commentScoreConvert = (value) => {
  return convertFunction(value, commentScoreTypeEnum).label;
};

export const taskTypeConvert = (value) => {
  return convertFunction(value, taskTypeEnum).label;
};

export const paymentFromConvert = (value) => {
  return convertFunction(value, paymentFromEnum).label;
};

export const showTypeConvert = (value) => {
  return convertFunction(value, showTypeEnum).label;
};

export const layoutConvert = (value) => {
  return convertFunction(value, layoutEnum).label;
};

export const articleTypeConvert = (value) => {
  return convertFunction(value, articleTypeEnum).label;
};

export const createTypeConvert = (value) => {
  return convertFunction(value, createTypeEnum).label;
};

export const faqStatusConvert = (value) => {
  return convertFunction(value, faqStatusEnum).label;
};

export const advPositionConvert = (value) => {
  return convertFunction(value, advPositionEnum).label;
};

export const couponFromConvert = (value) => {
  return convertFunction(value, couponFromEnum).label;
};

export const couponUseStatusConvert = (value) => {
  return convertFunction(value, couponUseStatusEnum).label;
};

export const couponTemplateTypeConvert = (value) => {
  return convertFunction(value, couponTemplateTypeEnum).label;
};

export const activityStatusConvert = (value) => {
  return convertFunction(value, activityStatusEnum).label;
};

export const activityTypeConvert = (value) => {
  return convertFunction(value, activityTypeEnum).label;
};

export const payStatusConvert = (value) => {
  return convertFunction(value, payStatusEnum).label;
};

export const wholesaleHdStatusConvert = (value) => {
  return convertFunction(value, wholesaleHdStatusEnum).label;
};

export const wholesaleOrderStatusConvert = (value) => {
  return convertFunction(value, wholesaleOrderStatusEnum).label;
};

export const wholesalePayTypeConvert = (value) => {
  return convertFunction(value, wholesalePayTypeEnum).label;
};

export const sexConvert = (value) => {
  return convertFunction(value, sexEnum).label;
};

export const userTypeConvert = (value) => {
  return convertFunction(value, userTypeEnum).label;
};

export const userStatusConvert = (value) => {
  return convertFunction(value, userStatusEnum).label;
};

export const customOrderStatusConvert = (value) => {
  return convertFunction(value, customOrderStatusEnum).label;
};

export const customPeriodConvert = (value) => {
  return convertFunction(value, customPeriodEnum).label;
};

export const deliveryTypeCustomConvert = (value) => {
  return convertFunction(value, deliveryTypeCustomEnum).label;
};

export const customDeliverStatusConvert = (value) => {
  return convertFunction(value, customDeliverStatusEnum).label;
};

export const orderTypeConvert = (value) => {
  return convertFunction(value, orderTypeEnum).label;
};

export const thirdDeliverStatusConvert = (value) => {
  return convertFunction(value, thirdDelieverStatusEnum).label;
};

export const receivingWayConvert = (value) => {
  return convertFunction(value, receivingWayEnum).label;
};

export const isAllRefundConvert = (value) => {
  return convertFunction(value, isAllRefundEnum).label;
};

export const orderStatusConvert = (value) => {
  return convertFunction(value, orderStatusEnum).label;
};

export const settlementStatusConvert = (value) => {
  return convertFunction(value, settlementStatusEnum).label;
};

export const doctorLevelConvert = (value) => {
  return convertFunction(value, doctorLevelEnum).label;
};

export const doctorStatusConvert = (value) => {
  return convertFunction(value, doctorStatusEnum).label;
};

export const hotConvert = (value) => {
  return convertFunction(value, hotEnum).label;
};

export const deliveryAtTypeConvert = (value) => {
  return convertFunction(value, deliveryAtTypeEnum);
};

export const updateWayConvert = (value) => {
  return convertFunction(value, updateWayEnum);
};

export const onSaleStatusConvert = (value) => {
  return convertFunction(value, onSaleStatusEnum);
};

export const positionTypeConvert = (value) => {
  return convertFunction(value, positionTypeEnum);
};

export const relationTypeConvert = (value) => {
  return convertFunction(value, relationTypeEnum);
};

export const customPlanStatusConvert = (value) => {
  return convertFunction(value, customPlanStatusEnum);
};

export const feedbackStatusConvert = (value) => {
  return convertFunction(value, feedbackStatusEnum);
};

export const storeStatusConvert = (value) => {
  return convertFunction(value, storeStatusEnum);
};

export const storeTypeConvert = (value) => {
  return convertFunction(value, storeTypeEnum);
};

export const coordinateTypeConvert = (value) => {
  return convertFunction(value, coordinateTypeEnum);
};

export const splitConvert = (value) => {
  return convertFunction(value, splitStatusEnum);
};

export const productStatusConvert = (value) => {
  return convertFunction(value, productStatusEnum);
}

export const imageStatusConvert = (value) => {
  return convertFunction(value, imageStatusEnum);
}

export const imageTypeConvert = (value) => {
  return convertFunction(value, imageTypeEnum);
}

export const teamBuyStatusConvert = (value) => {
  return convertFunction(value, teamBuyStatusEnum);
}

export const teamBuyTypeConvert = (value) => {
  return convertFunction(value, teamBuyTypeEnum);
}

export const rewardActivitySettingConvert = (value) => {
  return convertFunction(value, rewardActivitySettingEnum);
}

export const couponActivityTypeConvert = (value) => {
  return convertFunction(value, couponActivityTypeEnum);
}

export const couponStatusConvert = (value) => {
  return convertFunction(value, couponStatusEnum);
}

export const couponScopeConvert = (value) => {
  return convertFunction(value, couponScopeEnum);
}

export const couponUseLimitConvert = (value) => {
  return convertFunction(value, couponUseLimitEnum);
}

export const giftTypeConvert = (value) => {
  return convertFunction(value, giftTypeEnum);
}

export const expandTypeConvert = (value) => {
  return convertFunction(value, expandTypeEnum);
}

export const pfExpandTypeConvert = (value) => {
  return convertFunction(value, pfExpandTypeEnum);
}

export const validDateTypeConvert = (value) => {
  return convertFunction(value, validDateTypeEnum);
}

export const couponTypeConvert = (value) => {
  return convertFunction(value, couponTypeEnum);
}

export const vipTypeConvert = (value) => {
  return convertFunction(value, vipStatusEnum);
}

export const receiveTypeConvert = (value) => {
  return convertFunction(value, receiveTypeEnum);
}

export const packageStatusConvert = (value) => {
  return convertFunction(value, packageStatusEnum);
}

export const packageTypeConvert = (value) => {
  return convertFunction(value, packageTypeEnum);
}

export const userScopeConvert = (value) => {
  return convertFunction(value, userScopeEnum);
}

export const memberLimitConvert = (value) => {
  return convertFunction(value, memberLimitEnum);
}

export const appTypeConvert = (value) => {
  return convertFunction(value, appTypeEnum);
}

export const appTypesConvert = (value) => {
  return convertFunction(value, appTypesEnum);
}

export const payTypeConvert = (value) => {
  return convertFunction(value, payTypeEnum);
}

export const payStepConvert = (value) => {
  return convertFunction(value, payStepEnum);
}

export const sourceTypeConvert = (value) => {
  return convertFunction(value, sourceTypeEnum);
}

export const bankTypeConvert = (value) => {
  return convertFunction(value, bankTypeEnum);
}

export const timeLimitedConvert = (value) => {
  return convertFunction(value, timeLimitedEnum);
}

export const advertisementPositionTypeConvert = (value) => {
  return convertFunction(value, advertisementPositionTypeEnum);
}

export const advertisementLinkTypeConvert = (value) => {
  return convertFunction(value, linkTypeEnum);
}

export const miniOrderStatusConvert = (value) => {
  return convertFunction(value, miniOrderStatusEnum);
}

export const miniHdStatusConvert = (value) => {
  return convertFunction(value, miniHdStatusEnum);
}

export const miniOrderTypeConvert = (value) => {
  return convertFunction(value, miniOrderTypeEnum);
}

export const yesNoConvert = (value) => {
  return convertFunction(value, yesNoEnum);
}

export const deliverStatusConvert = (value) => {
  return convertFunction(value, deliverStatusEnum).label;
}

export const whiteListConvert = (value) => {
  return convertFunction(value, whiteListEnum).label;
}
