
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Mixin from './mixins';
import filters from './filters';
import iView from 'view-design';
import i18n from '@/locale';
import config from '@/config';
import importDirective from '@/directive';
import axiosPlugin from '@/libs/api.request';
import { enums, PcEncrypt, PcLockr, PcCookie } from '@/util/';

import 'view-design/dist/styles/iview.css';
import './index.less';
import 'assets/icons/iconfont.css';
import 'assets/iconfont/iconfont.css';
import 'assets/styles/style.scss';
import moment from 'moment';
import lodashLib from 'lodash';
// if (process.env.NODE_ENV !== 'production') require('@/mock');

Vue.mixin(Mixin);
Vue.use(axiosPlugin);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
window._ = lodashLib;

Object.defineProperty(Vue.prototype, '_', { value: lodashLib });
Object.defineProperty(Vue.prototype, '$config', { value: config });
Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, '$pcEnum', { value: enums });
Object.defineProperty(Vue.prototype, '$pcEncrypt', { value: PcEncrypt });
Object.defineProperty(Vue.prototype, '$pcLockr', { value: PcLockr });
Object.defineProperty(Vue.prototype, '$pcCookie', { value: PcCookie });


Vue.config.productionTip = false;
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
});
