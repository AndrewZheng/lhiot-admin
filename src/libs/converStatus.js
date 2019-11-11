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
  YesNoEnum,
  yesNoEnum,
  deliverStatusEnum,
  validDateTypeEnum
} from './enumerate';

const convertFunction = (value, list) => {
  const filterObj = list.find(item => {
    return item.value === value;
  });
  if (filterObj) {
    return filterObj;
  } else {
    return {
      label: value || 'N/A'
    };
  }
};

export const customOrderStatusConvert = (value) => {
  return convertFunction(value, customOrderStatusEnum);
};

export const customPeriodConvert = (value) => {
  return convertFunction(value, customPeriodEnum);
};

export const deliveryTypeCustomConvert = (value) => {
  return convertFunction(value, deliveryTypeCustomEnum);
};

export const customDeliverStatusConvert = (value) => {
  return convertFunction(value, customDeliverStatusEnum);
};

export const orderTypeConvert = (value) => {
  return convertFunction(value, orderTypeEnum);
};

export const thirdDeliverStatusConvert = (value) => {
  return convertFunction(value, thirdDelieverStatusEnum);
};

export const receivingWayConvert = (value) => {
  return convertFunction(value, receivingWayEnum);
};

export const isAllRefundConvert = (value) => {
  return convertFunction(value, isAllRefundEnum);
};

export const orderStatusConvert = (value) => {
  return convertFunction(value, orderStatusEnum);
};

export const settlementStatusConvert = (value) => {
  return convertFunction(value, settlementStatusEnum);
};

export const doctorLevelConvert = (value) => {
  return convertFunction(value, doctorLevelEnum);
};

export const doctorStatusConvert = (value) => {
  return convertFunction(value, doctorStatusEnum);
};

export const hotConvert = (value) => {
  return convertFunction(value, hotEnum);
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
  return convertFunction(value, deliverStatusEnum);
}
