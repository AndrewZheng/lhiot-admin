import config from '@/config';

const gbs = {
  host: 'https://wxsmall.food-see.com',
  lockr_prefix: 'LHIOTADMIN_PAAS_',
  cookie_prefix: 'LHIOTADMIN__PAAS_',
  secret_key: '^#rwd6Ffz$X5alRN',
  domain: '.food-see.com',
  secret: {
    key_str: 'om8q6fq#A0Yl@qJy',
    iv_str: '0#86gzOcsv1bXyIx'
  }
};

if (process.env.ENV === 'production') {
  switch (config.brandType) {
    case 'min_app':
      gbs.domain = '172.16.10.182';
      break;
    case 'qgg':
      gbs.domain = '172.16.10.204';
      break;
    case 'lv_hang':
      gbs.domain = '172.16.10.176';
      break;
    case 'lv_hang_farm':
      gbs.domain = '172.16.10.176';
      break;
  }
} else if (process.env.ENV === 'staging') {
  switch (config.brandType) {
    case 'min_app':
      gbs.domain = '172.16.10.203';
      break;
    case 'qgg':
      gbs.domain = '172.16.10.206';
      break;
    case 'lv_hang':
      gbs.domain = '172.16.10.189';
      break;
    case 'lv_hang_farm':
      gbs.domain = '172.16.10.189';
      break;
  }
  gbs.lockr_prefix += 'TEST_';
  gbs.cookie_prefix += 'TEST_';
} else {
  gbs.domain = '172.16.10.196';
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
  IMS_SERVICE: {
    serviceID: 'ims-service',
    headers: {
      version: 'v1-0'
    }
  },
  PAYTYPE: {
    RECHARGE: 'RECHARGE', // 充值
    ORDER: 'ORDER' // 订单
  },
  EDITOR_CACHE: 'EDITOR_CACHE'
};

export {
  gbs,
  enums
};
