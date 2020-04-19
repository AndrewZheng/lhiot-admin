import HttpRequest from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

const Axios = new HttpRequest(baseUrl);
const imsAxios = new HttpRequest(baseUrl, 'IMS_SERVICE', 'blob');
const delAxios = new HttpRequest("http://172.16.10.185:8082", 'DEL_HTTP',);

export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    });

    Object.defineProperty(Vue.prototype, '$imsService', {
      value: imsAxios
    });
    
    //删除图片
    Object.defineProperty(Vue.prototype, '$delHttp', {
      value: delAxios
    });
  }
};
