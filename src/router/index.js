import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMap } from './routers';
import store from '@/store';
import iView from 'iview';

import { getToken } from '@/libs/util';
import { PcLockr, enums } from 'util/';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});

const LOGIN_PAGE_NAME = 'login';
const whiteList= ['/login', '/redirect', '/401', '/404', '/500'];

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (token) {
    if (to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
        name: 'home' // 跳转到home页
      });
    } else {
      console.log('hasGetInfo: ', store.getters.hasGetInfo);
      if (!store.getters.hasGetInfo) {
        store.dispatch('getUserInfo').then(user => {
          // 当前的system已经缓存
          let pid= 0;
          if (PcLockr.get(enums.SYSTEM)) {
            const system= JSON.parse(PcLockr.get(enums.SYSTEM));
            pid= system.id;
          }
          store.dispatch('getRouteListById', pid).then(res => {
            console.log('getActualRouter: ', store.getters.getActualRouter);
            router.addRoutes(store.getters.getActualRouter);
            next({ ...to, replace: true });
          });
        });
      } else {
        console.log('to.path: ', to.path);
        next();
      }
    }
  } else {
    // 未登录且要跳转的页面不是登录页
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({
        name: LOGIN_PAGE_NAME
      });
    }
  }
});

router.afterEach(to => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
