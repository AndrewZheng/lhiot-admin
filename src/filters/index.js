import moment from 'moment';
import _ from 'lodash';

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
    type= '未支付';
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
  let src = require('assets/images/icon/img-error.png');
  if (!value) return src;
  return value;
};

filters.defaultBanner = (value) => {
  let src = require('assets/images/icon/default_banner.png');
  if (!value) return src;
  return value;
};

filters.defaultProduct = (value) => {
  let src = require('assets/images/icon/default_product.png');
  if (!value) return src;
  return value;
};

filters.defaultNews = (value) => {
  let src = require('assets/images/icon/default_news.png');
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

export default filters;
