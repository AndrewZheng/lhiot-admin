import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMap } from './routers';
import store from '@/store';
import iView from 'iview';

import { getToken } from '@/libs/util';

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
      if (!store.getters.hasGetInfo) {
        store.dispatch('getUserInfo').then(user => {
          store.dispatch('getRouterByUser', user.user_id).then(res => {
            console.log('getActualRouter: ', store.getters.getActualRouter);
            router.addRoutes(store.getters.getActualRouter); // 动态添加可访问路由表
            next({ ...to, replace: true });
          });
        });
      } else {
        console.log('to.path: ', to.path);
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;
        // if (store.getters.getRoutePermission[to.path]) next(); // 有权限，可访问
        // else {
        //   next({
        //     replace: true,
        //     name: 'error_401'
        //   });
        // } // 无权限，重定向到401页面
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
        name: LOGIN_PAGE_NAME // 否则全部定向登录页
      });
    }
  }
});

router.afterEach(to => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
