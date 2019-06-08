import {
  customOrderStatusConvert,
  customPeriodConvert, customPlanStatusConvert,
  deliveryTypeCustomConvert, doctorLevelConvert, doctorStatusConvert, hotConvert, onSaleStatusConvert,
  orderStatusConvert, orderTypeConvert, receivingWayConvert, settlementStatusConvert, feedbackStatusConvert,
  productStatusConvert, imageStatusConvert, imageTypeConvert, teamBuyStatusConvert, teamBuyTypeConvert,
  rewardActivitySettingConvert, couponStatusConvert, couponTypeConvert, appTypeConvert, bankTypeConvert,
  timeLimitedConvert, advertisementPositionTypeConvert, couponScopeConvert, advertisementLinkTypeConvert,
  miniOrderStatusConvert, miniHdStatusConvert, miniOrderTypeConvert, yesNoConvert, deliverStatusConvert,
  couponUseLimitConvert, validDateTypeConvert
} from '../libs/converStatus';

const mixin = {
  data() {
    return {
      // 待翻译字典对象信息
      userStatus: [{
        key: 'INITIAL',
        value: '初始化'
      },
      {
        key: 'AVAILABLE',
        value: '可用'
      },
      {
        key: 'UNAVAILABLE',
        value: '不可用'
      },
      {
        key: 'LOCK',
        value: '锁定，暂不可用'
      },
      {
        key: 'DELETE',
        value: '删除，永不可用'
      },
      {
        key: 'UNKNOWN',
        value: '未知'
      }
      ]
    };
  },
  filters: {
    // 计算分转元 保留两位小数
    fenToYuanDot2Filters(number) {
      if (typeof number === 'number') {
        return '¥' + (number / 100.00).toFixed(2);
      }
      return number;
    },
    fenToDiscountFilters(number) {
      if (typeof number === 'number') {
        return (number / 10.0).toFixed(1) + '折';
      }
      return number;
    },
    // 结算状态
    settlementStatusFilters(name) {
      return settlementStatusConvert(name).label;
    },
    // 鲜果师等级
    doctorLevelFilters(name) {
      return doctorLevelConvert(name).label;
    },
    // 鲜果师状态
    doctorStatusFilters(name) {
      return doctorStatusConvert(name).label;
    },
    // 明星鲜果师
    hotFilters(name) {
      return hotConvert(name).label;
    },
    // 订单状态
    orderStatusFilters(status) {
      return orderStatusConvert(status).label;
    },
    // 提货方式
    receivingWayFilters(status) {
      return receivingWayConvert(status).label;
    },
    // 订单类型
    orderTypeFilters(status) {
      return orderTypeConvert(status).label;
    },
    // 定制周期
    customPeriodFilters(status) {
      return customPeriodConvert(status).label;
    },
    // 定制状态
    customOrderStatusFilters(status) {
      return customOrderStatusConvert(status).label;
    },
    // 定制配送方式
    deliveryTypeCustomFilters(status) {
      return deliveryTypeCustomConvert(status).label;
    },
    // 商品上架
    onSaleStatusFilters(status) {
      return onSaleStatusConvert(status).label;
    },
    // 定制计划商品上架
    customPlanStatusFilters(status) {
      return customPlanStatusConvert(status).label;
    },
    // 反馈状态
    feedbackStatusFilters(status) {
      return feedbackStatusConvert(status).label;
    },
    // 小程序商品状态
    productStatusFilter(status) {
      return productStatusConvert(status).label;
    },
    // 小程序图片状态
    imageStatusFilter(status) {
      return imageStatusConvert(status).label;
    },
    // 小程序图片类型
    imageTypeFilter(type) {
      return imageTypeConvert(type).label;
    },
    // 小程序团购活动状态
    teamBuyStatusFilter(status) {
      return teamBuyStatusConvert(status).label;
    },
    // 小程序团购类型
    teamBuyTypeFilter(type) {
      return teamBuyTypeConvert(type).label;
    },
    // 小程序红包活动设置
    rewardActivitySettingFilter(type) {
      return rewardActivitySettingConvert(type).label;
    },
    // 小程序优惠券状态
    couponStatusFilter(status) {
      return couponStatusConvert(status).label;
    },
    // 小程序优惠券使用范围
    couponScopeFilter(status) {
      return couponScopeConvert(status).label;
    },
    // 小程序优惠券有效期类型
    validDateTypeFilter(status) {
      return validDateTypeConvert(status).label;
    },
    // 小程序优惠券使用限制
    couponUseLimitFilter(status) {
      return couponUseLimitConvert(status).label;
    },
    // 小程序优惠券状态
    couponTypeFilter(type) {
      return couponTypeConvert(type).label;
    },
    // 小程序应用类型
    appTypeFilter(type) {
      return appTypeConvert(type).label;
    },
    // 小程序银行类型
    bankTypeFilter(type) {
      return bankTypeConvert(type).label;
    },
    // 小程序广告位时间限制
    timeLimitedFilter(type) {
      return timeLimitedConvert(type).label;
    },
    // 小程序广告位类型
    advertisementPositionTypeFilter(type) {
      return advertisementPositionTypeConvert(type).label;
    },
    // 小程序广告位链接类型
    advertisementLinkTypeFilter(type) {
      return advertisementLinkTypeConvert(type).label;
    },
    // 小程序订单状态
    miniOrderStatusFilter(status) {
      return miniOrderStatusConvert(status).label;
    },
    // 小程序海鼎状态
    miniHdStatusFilter(status) {
      return miniHdStatusConvert(status).label;
    },
    // 小程序订单类型
    miniOrderTypeFilter(type) {
      return miniOrderTypeConvert(type).label;
    },
    yesNoFilter(type) {
      return yesNoConvert(type).label;
    },
    // 小程序订单配送状态
    deliverStatusFilter(status) {
      return deliverStatusConvert(status).label;
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    applicationType() {
      return this.$store.getters.systemCurrent.applicationType;
    }
  },
  methods: {
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    loadPage(routerName, param) {
      if (param) {
        this.$router.push({
          name: routerName,
          params: param
        });
      } else {
        this.$router.push({
          name: routerName
        });
      }
    },
    stripScript(value) {
      var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]');
      var rs = '';
      for (var i = 0; i < value.length; i++) {
        rs = rs + value.substr(i, 1).replace(pattern, '');
      }
      return rs;
    },
    identityCodeValid(code) {
      var city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外 '
      };

      var tip = '';
      var pass = true;

      if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = '身份证号格式错误';
        pass = false;
      } else if (!city[code.substr(0, 2)]) {
        tip = '身份证地址编码错误';
        pass = false;
      } else {
        // 18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split('');
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          // 校验位
          var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (last != code[17]) {
            tip = '身份证校验位错误';
            pass = false;
          }
        }
      }
      if (!pass) console.log(`tip:${tip}`);
      return pass;
    },
    getDateFormat(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = date.getDay();
      let weekdayStr = '';
      switch (weekday) {
        case 1:
          weekdayStr = '周一';
          break;
        case 2:
          weekdayStr = '周二';
          break;
        case 3:
          weekdayStr = '周三';
          break;
        case 4:
          weekdayStr = '周四';
          break;
        case 5:
          weekdayStr = '周五';
          break;
        case 6:
          weekdayStr = '周六';
          break;
        case 0:
          weekdayStr = '周天';
          break;
      }
      return month + '-' + day + ' ' + weekdayStr + ' ';
    },
    getUrlParam(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      const result = window.location.search.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    logout() {
      this.$http({
        url: '/uac/user/logout',
        method: 'post',
        params: {
          accessToken: this.$store.getters.getAccessToken
        }
      }).then(() => {
        this.$store.dispatch('delete_user_info');
        this.$store.dispatch('clear_cart');
        this.goHome();
      }).catch(() => {
        this.$store.dispatch('delete_user_info');
        this.$store.dispatch('clear_cart');
        this.goHome();
      });
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate(value, type) {
      // 非空验证
      if (type === 'require') {
        return !!value;
      }
      // 手机号验证
      if (type === 'phone') {
        return /^1\d{10}$/.test(value);
      }
      // 邮箱格式验证
      if (type === 'email') {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
      }
    },
    // 根据需要翻译的字段名称，返回翻译字典集合
    getDictListByName(name) {
      console.log('getDictListByName：' + name);
      let dictList = [];
      switch (name) {
        case 'userStatus':
          dictList = this.userStatus;
          break;
      }
      return dictList;
    },
    // 翻译字典 list 需要翻译集合，key 需要翻译的字段
    getDictValueByKey(list, key) {
      // console.log('getDictValueByKey:key：' + key);
      if (list.length !== 0) {
        const column = list.filter(item => item.key == key);
        return column.length > 0 ? column[0].value : '';
      }
      return '';
    }
  },
  mounted() {}
};

export default mixin;
