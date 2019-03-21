import {
  customDeliverStatusEnum,
  customOrderStatusEnum,
  customPeriodEnum, deliveryAtTypeEnum, customPlanStatusEnum,
  deliveryTypeCustomEnum, doctorLevelEnum, doctorStatusEnum, hotEnum, onSaleStatusEnum,
  orderStatusEnum,
  orderTypeEnum, positionTypeEnum,
  receivingWayEnum, relationTypeEnum,
  settlementStatusEnum,
  thirdDelieverStatusEnum, updateWayEnum, storeStatusEnum, storeTypeEnum, coordinateTypeEnum,
  feedbackStatusEnum,
  // 小程序
  splitStatusEnum, productStatusEnum, imageStatusEnum, imageTypeEnum, teamBuyStatusEnum, teamBuyTypeEnum, rewardActivitySettingEnum
} from './enumerate';

const convertFunction = (value, list) => {
  const filterObj = list.find(item => {
    return item.value === value;
  });
  if (filterObj) {
    return filterObj;
  } else {
    return { label: value };
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
