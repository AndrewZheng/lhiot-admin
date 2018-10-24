
let mixin = {
  data() {
    return {
      // 待翻译字典对象信息
      translateDicts: {}
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
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
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let result = window.location.search.substr(1).match(reg);
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
    // 获取所有要翻译字典信息
    getAllDicts() {
      // 只初始化一次
      if (JSON.stringify(this.translateDicts) == '{}') {
          console.log('加载字典:::'+JSON.stringify(this.translateDicts));
          this.translateDicts.status = {
            'INITIAL': '初始化',
            'AVAILABLE': '可用',
            'UNAVAILABLE': '不可用',
            'LOCK': '锁定，暂不可用',
            'DELETE': '删除，永不可用',
            'UNKNOWN': '未知'
          };
      }
    },
    // 翻译字典 fieldName 需要翻译的字段名称，value 需要翻译的字段值
    getDictByName(fieldName, value) {
        this.getAllDicts();
        var translateDictName = '';// 需要翻译字典名称
        // 判断字段名称存在字典对象  并且值也存在,则获取翻译名称
        if (this.translateDicts.hasOwnProperty(fieldName) && this.translateDicts[fieldName].hasOwnProperty(value)) {
            translateDictName = this.translateDicts[fieldName][value];
        }
        return translateDictName == '' ? value : translateDictName;
    }
  },
  mounted() {
  }
};

export default mixin;
