import Vue from 'vue';
import axios from 'axios';
import store from '../store/';
import {
  gbs,
  enums
} from '@/util/';
import _ from 'lodash';

class HttpRequest {
  constructor(baseUrl = baseURL, centerType = '') {
    this.baseUrl = baseUrl;
    this.centerType = centerType;
    this.queue = {};
  }

  getInsideConfig() {
    let defaultOps = {
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true // 是否允许带cookie
    };

    switch (this.centerType) {
      case 'BASIC_DATA_CENTER':
        const dataCenterOps = _.merge({}, defaultOps, {
          baseURL: this.baseUrl + '/' + enums.BASIC_DATA_CENTER.serviceID,
          headers: enums.BASIC_DATA_CENTER.headers
        });
        return dataCenterOps;
      case 'CONTENT_CENTER':
        const contentCenterOps = _.merge({}, defaultOps, {
          baseURL: this.baseUrl + '/' + enums.CONTENT_CENTER.serviceID,
          headers: enums.CONTENT_CENTER.headers
        });
        return contentCenterOps;
      case 'ORDER_CENTER':
        const orderCenterOps = _.merge({}, defaultOps, {
          baseURL: this.baseURL + '/' + enums.ORDER_CENTER.serviceID,
          headers: enums.ORDER_CENTER.headers
        });
        return orderCenterOps;
      case 'BASE_USER_CENTER':
        const baseUserCenterOps = _.merge({}, defaultOps, {
          baseURL: this.baseURL + '/' + enums.BASE_USER_CENTER.serviceID,
          headers: enums.BASE_USER_CENTER.headers
        });
        return baseUserCenterOps;
      case 'FRUIT_DOCTOR_CENTER':
        const fruitDoctorCenterOps = _.merge({}, defaultOps, {
          baseURL: this.baseURL + '/' + enums.FRUIT_DOCTOR_CENTER.serviceID,
          headers: enums.FRUIT_DOCTOR_CENTER.headers
        });
        return fruitDoctorCenterOps;
      default:
        return defaultOps;
    }
  }

  destory(url) {
    delete this.queue[url];
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 全局追加openid
      config.params = (
        Object.assign((config.params ? config.params : {}), {
          'SESSION': store.state.openid
        })
      );
      // 解决axios post请求后台获取不到参数问题 如果支持json参数格式的介绍则不需要
      // if (config.method === 'post') {
      //   config.data = Vue.prototype.$qs.stringify(config.data);
      // };
      this.queue[url] = true;
      return config;
    }, error => {
      // 请求错误时
      console.log('request:', error);
      // 1. 判断请求超时
      if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        console.log('timeout请求超时');
        // return service.request(originalRequest);//再重复请求一次
      }
      // 2. 需要重定向到错误页面
      const errorInfo = error.response;
      console.log(errorInfo);
      // if (errorInfo) {
      //   const errorStatus = errorInfo.status; // 404 403 500 ...
      //   router.push({
      //     path: `/error/${errorStatus}`
      //   });
      // }
      Vue.prototype.$Message.error('请求失败或超时!');
      return Promise.reject(error);
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destory(url);
      const {
        data,
        status
      } = res;
      // 后续再做修改
      if (status < 400) {
        if (data == '' || data) {
          return data;
        }
      } else {
        // 与后端约定的code实现
        Vue.prototype.$Message.info(data.message);
        return Promise.reject(res);
      }
    }, error => {
      this.destory(url);

      if (error && error.response) {
        let errorMsg = '请求失败或超时！请刷新重试';
        if (error.response.status === 400) {
          console.log('Error 400', error.response.data);
          errorMsg = error.response.data;
        } else if (error.response.status === 401) {
          errorMsg = '您无访问权限';
        } else if (error.response.status === 403) {
          errorMsg = '拒绝访问';
        } else if (error.response.status === 405) {
          errorMsg = 'HTTP请求方式不一致';
        } else if (error.response.status === 408) {
          errorMsg = '请求超时';
        } else if (error.response.status === 501) {
          errorMsg = '服务未实现';
        } else if (error.response.status === 502) {
          errorMsg = '网关错误';
        } else if (error.response.status === 503) {
          errorMsg = '服务不可用';
        } else if (error.response.status === 504) {
          errorMsg = '网关超时';
        } else if (error.response.status === 505) {
          errorMsg = 'HTTP版本不受支持';
        } else if (error.response.status === 500) {
          // 上线后分发到500页
          console.log('Error 500', error.response.data.message);
          errorMsg = '服务器内部错误';
        } else {
          console.log('Other Error', error.message);
        }
        console.error('error object: ', error.response);
        Vue.prototype.$Message.error(errorMsg);
        return Promise.reject(error);
      } else {
        Vue.prototype.$Message.error('请求失败或超时！请刷新重试');
      }
    });
  }

  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
