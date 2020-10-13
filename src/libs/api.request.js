import HttpRequest from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
const imgUploadUrl = config.imgUploadUrl;
const exportUploadUrl = config.exportUploadUrl;

const Axios = new HttpRequest(baseUrl);
const imsAxios = new HttpRequest(baseUrl, 'IMS_SERVICE', 'blob');
const imgAxios = new HttpRequest(imgUploadUrl, 'IMG_SERVICE');
const exportAxios = new HttpRequest(exportUploadUrl, 'EXPORT_SERVICE');
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: Axios
    });

    Object.defineProperty(Vue.prototype, '$imsService', {
      value: imsAxios
    });

    Object.defineProperty(Vue.prototype, '$imgService', {
      value: imgAxios
    });

    Object.defineProperty(Vue.prototype, '$exporService', {
      value: exportAxios
    });
  }
};
