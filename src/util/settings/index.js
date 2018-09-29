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
  MASTER: {
    MASTER_ID: 'MASTER_ID',
    MASTER_INFO: 'MASTER_INFO'
  },
  CART: {
    LOGIN_NAME: 'LOGIN_NAME',
    AUTH_TOKEN: 'AUTH_TOKEN',
    SHOPPING_CART: 'SHOPPING_CART'
  },
  BUY: {
    GOODS_BUY: 'GOODS_BUY'
  },
  BUYTYPE: 'BUYTYPE',
  ORDERTYPE: 'ORDERTYPE',
  SHOWADV: 'SHOWADV',
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
  },
  FRUIT_DOCTOR: 'FRUIT_DOCTOR', // 应用类型
  DELIVERYINFO: 'DELIVERYINFO', // 收货地址信息
  ADRSTOREINFO: 'ADRSTOREINFO', // 根据用户收货地址获取的最近门店信息
  STOREINFO: 'STOREINFO', // 根据用户当前定位位置获取的最近门店信息
  STOREID: 'STOREID', // 最近门店的标识
  INDEX_TOP_BANNER: 'INDEX_TOP_BANNER', // 首页轮播图
  INDEX_BOTTOM_ARTICLES: 'INDEX_BOTTOM_ARTICLES', // 首页果膳之味文章板块
  MALL_TOP_BANNER: 'MALL_TOP_BANNER', // 商城页轮播图
  MALL_MIDDLE_COMBO: 'MALL_MIDDLE_COMBO', // 商城页中间营养套餐板块
  MALL_BOTTOM_COMBO: 'MALL_BOTTOM_COMBO', // 商城页下面推荐套餐板块
  FOODFRESH_TOP_TAB: 'FOODFRESH_TOP_TAB', // 和色果膳页tab选项卡
  COMMISSION: 'COMMISSION',
  FRUIT_DOCTOR_USER: 'FRUIT_DOCTOR_USER', // 获取faq时区分鲜果师-用户
  FRUIT_DOCTOR_FAQ: 'FRUIT_DOCTOR_FAQ',
  WEIXIN: 'WEIXIN', // 支付平台枚举
  MIN_FREE_DISTRIBUTION: 'MIN_FREE_DISTRIBUTION' // 满多少免配送费
};

export {
  gbs,
  cbs,
  enums,
  taxPercent
};
