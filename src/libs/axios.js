import Vue from 'vue';
import axios from 'axios';
import store from '../store/';
import router from '@/router';
import { setToken } from '@/libs/util';
import _ from 'lodash';

class HttpRequest {
  constructor(baseUrl = '', centerType = '', responseType = 'json') {
    this.baseUrl = baseUrl;
    this.centerType = centerType;
    this.responseType = responseType;
    this.queue = {};
  }

  getInsideConfig() {
    const defaultOps = {
      baseURL: this.baseUrl,
      responseType: 'json',
      timeout: 30000,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true // 是否允许带cookie
    };

    const imsServiceOps = _.merge({}, defaultOps, {
      baseURL: this.baseUrl,
      responseType: this.responseType
    });

    // 删除图片
    const imgServiceOps = _.merge({}, defaultOps, {
      baseURL: this.baseUrl,
      responseType: this.responseType
    });

    // 导出
    const exportAxiosOps = _.merge({}, defaultOps, {
      baseURL: this.baseUrl,
      responseType: this.responseType
    });

    // 后端微服务有需求再扩展
    switch (this.centerType) {
      case 'IMS_SERVICE':
        return imsServiceOps;
      case 'IMG_SERVICE':
        return imgServiceOps;
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
      if (errorInfo) {
        const errorStatus = errorInfo.status; // 404 403 500 ...
        switch (errorStatus) {
          case '404':
            router.push({
              name: '/404'
            });
            break;
          case '403': // 由401改为403
            router.push({
              name: '/401' // 由401改为403
            });
            break;
          case '500':
            router.push({
              name: '/500'
            });
            break;
        }
      }
      Vue.prototype.$Message.error('请求失败或超时!');
      return Promise.reject(error);
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destory(url);
      // 导出
      const { data, status, headers } = res;
      if (headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8') {
        return res.data;
      }
      // 后续再做修改
      if (status < 400) {
        // 204返回no centent 则data为null
        if (status === 204 || data === '') {
          return data;
        }
        if (data && typeof data.success === 'undefined') {
          return data;
        } else {
          if (data.success) {
            return data.datas;
          } else {
            Vue.prototype.$Message.info(data.msg);
            return Promise.reject(res);
          }
        }
      } else {
        Vue.prototype.$Message.info(data.message);
        return Promise.reject(res);
      }
    }, error => {
      this.destory(url);

      if (error && error.response) {
        console.log('error object: ', error.response);
        let errorMsg = '请求失败或超时！请刷新重试';
        switch (error.response.status) {
          case 400:
            errorMsg = error.response.data.message;
            break;
          case 401:
            errorMsg = '页面已过期，请重新登录';
            setToken('');
            router.push({
              name: 'login'
            });
            break;
          case 402:
            errorMsg = '页面已过期，请重新登录';
            setToken('');
            router.push({
              name: 'login'
            });
            break;
          case 403:
            errorMsg = '您无访问权限';
            break;
          case 405:
            errorMsg = 'HTTP请求方式不一致';
            break;
          case 408:
            errorMsg = '请求超时';
            break;
          case 500:
            errorMsg = '服务器内部错误';
            break;
          case 501:
            errorMsg = '服务未实现';
            break;
          case 502:
            errorMsg = '网关错误';
            break;
          case 503:
            errorMsg = '服务不可用';
            break;
          case 504:
            errorMsg = '网关超时';
            break;
          case 505:
            errorMsg = 'HTTP版本不受支持';
            break;
          default:
            console.log('Other Error', error.message);
        }
        Vue.prototype.$Message.error(errorMsg);
        return Promise.reject(error);
      } else {
        Vue.prototype.$Message.error('请求失败或超时！请刷新重试');
        return Promise.reject();
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
