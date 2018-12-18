import {
  customDeliverStatusEnum,
  customOrderStatusEnum,
  customPeriodEnum,
  deliveryTypeCustomEnum, doctorLevelEnum, doctorStatusEnum,
  orderStatusEnum,
  orderTypeEnum,
  receivingWayEnum,
  settlementStatusEnum,
  thirdDelieverStatusEnum
} from './enumerate';

const convertFunction = (value, list) => {
  let filterObj = list.find(item => {
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
  return convertFunction(value, orderStatusEnum)
}

export const settlementStatusConvert = (value) => {
  return convertFunction(value, settlementStatusEnum)
}

export const doctorLevelConvert = (value) => {
  return convertFunction(value, doctorLevelEnum)
}

export const doctorStatusConvert = (value) => {
  return convertFunction(value, doctorStatusEnum)
}
