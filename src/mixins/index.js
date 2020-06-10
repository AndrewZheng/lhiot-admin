import defaultImg from '@/assets/images/default_img.png';

const mixin = {
  data() {
    return {
      defaultImg,
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
    fenToYuanDot2Filterss(number) {
      if (typeof number === 'number') {
        return (number / 100.00).toFixed(2);
      }
      return number;
    },
    fenToDiscountFilters(number) {
      if (typeof number === 'number') {
        return (number / 10.0).toFixed(1) + '折';
      }
      return number;
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    applicationType() {
      return this.$store.getters.systemCurrent.applicationType;
    },
    btnPermissions() {
      return this.$store.getters.getButtonPermission;
    }
  },
  methods: {
    turnToPage(route) {
      let {
        name,
        params,
        query
      } = {};
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
    getDictValueByKey(list, key) {
      if (list.length !== 0) {
        const column = list.filter(item => item.key === key);
        return column.length > 0 ? column[0].value : '';
      }
      return '';
    }
  },
  mounted() {}
};

export default mixin;
