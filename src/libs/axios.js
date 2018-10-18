import Vue from 'vue';
import axios from 'axios';
import store from '../store/';
import { gbs, enums } from '@/util/';
import _ from 'lodash';

class HttpRequest {
  constructor(baseUrl = '', centerType = '') {
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
    // 后端微服务有需求再扩展
    switch (this.centerType) {
      case 'IMS_SERVICE':
        const imsServiceOps = _.merge({}, defaultOps, {
          baseURL: this.baseUrl + '/' + enums.IMS_SERVICE.serviceID+'-'+ enums.IMS_SERVICE.headers.version
        });
        return imsServiceOps;
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
      // 全局追加X-SessionId
      config.headers = (
        Object.assign((config.headers ? config.headers : {}), {
          'X-SessionId': store.getters.token
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
      const { data, status } = res;
      // 后续再做修改
      if (status < 400) {
        if (data == '' || data) {
          return data;
        }
      } else {
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
