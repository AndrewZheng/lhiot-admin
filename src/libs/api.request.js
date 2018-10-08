import HttpRequest from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

const Axios = new HttpRequest(baseUrl);
const dataAxios = new HttpRequest(baseUrl, 'BASIC_DATA_CENTER');
const contentAxios = new HttpRequest(baseUrl, 'CONTENT_CENTER');
const orderAxios = new HttpRequest(baseUrl, 'ORDER_CENTER');
const fruitDoctorAxios = new HttpRequest(baseUrl, 'FRUIT_DOCTOR_CENTER');
const baseUserAxios = new HttpRequest(baseUrl, 'BASE_USER_CENTER');
const imsAxios=new HttpRequest(baseUrl, 'IMS_SERVICE');

export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    });

    Object.defineProperty(Vue.prototype, '$dataCenter', {
      value: dataAxios
    });

    Object.defineProperty(Vue.prototype, '$contentCenter', {
      value: contentAxios
    });

    Object.defineProperty(Vue.prototype, '$orderCenter', {
      value: orderAxios
    });

    Object.defineProperty(Vue.prototype, '$fruitDoctorCenter', {
      value: fruitDoctorAxios
    });

    Object.defineProperty(Vue.prototype, '$baseUserCenter', {
      value: baseUserAxios
    });

    Object.defineProperty(Vue.prototype, '$imsService', {
      value: imsAxios
    });
  }
};
