// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Mixin from './mixins';
import filters from './filters';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import importDirective from '@/directive';
import axiosPlugin from '@/libs/api.request';
import { enums, PcEncrypt } from '@/util/';

import 'iview/dist/styles/iview.css';
import './index.less';
import 'assets/icons/iconfont.css';
import 'assets/styles/style.scss';
import moment from 'moment';

if (process.env.NODE_ENV !== 'production') require('@/mock');

Vue.mixin(Mixin);
Vue.use(axiosPlugin);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});

// 循环注册filters
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.config.productionTip = false;

Vue.prototype.$config = config;
Vue.prototype.$moment = moment;
Vue.prototype.$pcEnum = enums;
Vue.prototype.$pcEncrypt = PcEncrypt;

importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
});
