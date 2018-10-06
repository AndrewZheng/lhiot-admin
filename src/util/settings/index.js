const gbs = {
  host: 'https://health.food-see.com',
  lockr_prefix: 'FRUITDOCTOR_PAAS_',
  cookie_prefix: 'FRUITDOCTOR__PAAS_',
  secret_key: '^#rwd6Ffz$X5alRN',
  domain: '.food-see.com',
  secret: {
    key_str: 'om8q6fq#A0Yl@qJy',
    iv_str: '0#86gzOcsv1bXyIx'
  },
  ASSORTMENT: '/weixin/mall/detail/',
  ARTICLE: '/weixin/foodfresh/detail/'
};
const cbs = {};
const taxPercent = 0.0336;

if (process.env.NODE_ENV === 'production') {
  gbs.domain = 'health.food-see.com';
} else if (process.env.NODE_ENV === 'testing') {
  gbs.domain = 'testhealth.food-see.com';
  gbs.lockr_prefix += 'TEST_';
  gbs.cookie_prefix += 'TEST_';
} else {
  gbs.domain = 'testhealth.food-see.com';
  gbs.lockr_prefix += 'DEV_';
  gbs.cookie_prefix += 'DEV_';
}

const enums = {
  USER: {
    ID: 'ID',
    LOGIN_NAME: 'LOGIN_NAME',
    MENU_LIST: 'MENU_LIST',
    AUTH_TOKEN: 'AUTH_TOKEN',
    REMEMBER_ME: 'REMEMBER_ME',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    REDIRECT_URI: 'REDIRECT_URI',
    OPEN_ID: 'OPEN_ID',
    USER_INFO: 'USER_INFO'
  },
  SYSTEM: 'SYSTEM',
  BASIC_DATA_CENTER: {
    serviceID: 'basic-data-center',
    headers: {
      version: 'v1-1-0'
    }
  },
  CONTENT_CENTER: {
    serviceID: 'content-center',
    headers: {
      version: 'v1-0-0'
    }
  },
  ORDER_CENTER: {
    serviceID: 'order-center',
    headers: {
      version: 'v1-1-0'
    }
  },
  FRUIT_DOCTOR_CENTER: {
    serviceID: 'fruitdoctor-user-service',
    headers: {
      version: 'v1-0-0'
    }
  },
  BASE_USER_CENTER: {
    serviceID: 'base-user-service',
    headers: {
      version: 'v1-0-0'
    }
  },
  PAYTYPE: {
    RECHARGE: 'RECHARGE', // 充值
    ORDER: 'ORDER' // 订单
  }
};

export {
  gbs,
  cbs,
  enums,
  taxPercent
};
