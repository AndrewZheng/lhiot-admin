import HttpRequest from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

const Axios = new HttpRequest(baseUrl);
const imsAxios = new HttpRequest(baseUrl, 'IMS_SERVICE', 'blob');

export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    });

    Object.defineProperty(Vue.prototype, '$imsService', {
      value: imsAxios
    });
  }
};
