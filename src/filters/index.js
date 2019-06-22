import moment from 'moment';
import { coordinateTypeConvert } from '../libs/converStatus';

const filters = {};

filters.formatMoney = (value) => {
  if (!value) {
    return '0.00';
  }
  return Number(parseFloat(value / 100)).toFixed(2);
};

filters.formatMoneyToOne = (value) => {
  if (!value) {
    return '0.00';
  }
  return Number(parseFloat(value / 100)).toFixed(1);
};

filters.parseMoney = (value) => {
  if (!value) return 0;
  return Number(parseInt(value).toFixed(0));
};

filters.formatDate = (value, formatString) => {
  if (!value) return 'N/A';
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return moment(value).format(formatString);
};

filters.switchStatus = (val) => {
  let statusName = '';
  switch (val) {
    case 'FAILURE':
    {
      statusName = '已失效';
      break;
    }
    case 'WAIT_PAYMENT':
    {
      statusName = '待付款';
      break;
    }
    case 'PAYMENTING':
    {
      statusName = '支付中';
      break;
    }
    case 'WAIT_SEND_OUT':
    {
      statusName = '待发货';
      break;
    }
    case 'SEND_OUT':
    {
      statusName = '已发货';
      break;
    }
    case 'DISPATCHING':
    {
      statusName = '配送中';
      break;
    }
    case 'RECEIVED':
    {
      statusName = '已收货';
      break;
    }
    case 'RETURNING':
    {
      statusName = '退货中';
      break;
    }
    case 'ALREADY_RETURN':
    {
      statusName = '退货完成';
      break;
    }
    case 'RETURN_FAILURE':
    {
      statusName = '退货失败';
      break;
    }
    case 'FINISHED':
    {
      statusName = '已完成';
      break;
    }
  }
  return statusName;
};

filters.switchPayType = (val) => {
  let type = '';
  switch (val) {
    case 'balance':
    {
      type = '鲜果币支付';
      break;
    }
    case 'weixin':
    {
      type = '微信支付';
      break;
    }
    default:
      type = '未支付';
  }
  return type;
};

filters.switchDeliveryType = (val) => {
  let type = '';
  switch (val) {
    case 'TO_THE_STORE':
    {
      type = '门店自提';
      break;
    }
    case 'TO_THE_HOME':
    {
      type = '送货上门';
      break;
    }
  }
  return type;
};

filters.switchAuditStatus = (val) => {
  let statusName = '';
  switch (val) {
    case 'unaudited':
    {
      statusName = '待审核';
      break;
    }
    case 'auditeding':
    {
      statusName = '审核中';
      break;
    }
    case 'agree':
    {
      statusName = '审核通过';
      break;
    }
    case 'reject':
    {
      statusName = '审核不通过';
      break;
    }
  }
  return statusName;
};

filters.defaultImg = (value) => {
  const src = require('assets/images/icon/img-error.png');
  if (!value) return src;
  return value;
};

filters.defaultBanner = (value) => {
  const src = require('assets/images/icon/default_banner.png');
  if (!value) return src;
  return value;
};

filters.defaultProduct = (value) => {
  const src = require('assets/images/icon/default_product.png');
  if (!value) return src;
  return value;
};

filters.defaultNews = (value) => {
  const src = require('assets/images/icon/default_news.png');
  if (!value) return src;
  return value;
};

filters.stripScript = (value) => {
  var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]');
  var rs = '';
  for (var i = 0; i < value.length; i++) {
    rs = rs + value.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

filters.timeAgo = (time) => {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
};

/* 数字 格式化 */
filters.numberFormatter = (num, digits) => {
  const si = [{
    value: 1E18,
    symbol: 'E'
  },
  {
    value: 1E15,
    symbol: 'P'
  },
  {
    value: 1E12,
    symbol: 'T'
  },
  {
    value: 1E9,
    symbol: 'G'
  },
  {
    value: 1E6,
    symbol: 'M'
  },
  {
    value: 1E3,
    symbol: 'k'
  }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
};

filters.toThousandFilter = (num) => {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
};

// 坐标系
filters.coordinateTypeFilter = (value) => {
  return coordinateTypeConvert(value).label
}

export default filters;
