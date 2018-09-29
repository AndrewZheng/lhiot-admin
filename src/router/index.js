import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import iView from 'iview';

import { getToken, canTurnTo } from '@/libs/util';

Vue.use(Router);

const baseRoute = [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: (resolve) => require(['@/view/login/login.vue'], resolve)
}, {
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: (resolve) => require(['@/view/error-page/401.vue'], resolve)
}, {
  path: '/404',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: (resolve) => require(['@/view/error-page/404.vue'], resolve)
}, {
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: (resolve) => require(['@/view/error-page/500.vue'], resolve)
}];

const router = new Router({
  routes: baseRoute,
  mode: 'history'
});

const LOGIN_PAGE_NAME = 'login';
const whiteList= ['/login'];

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
      console.log('userName: ', store.getters.getUserName);
      if (!store.getters.getUserName) {
        store.dispatch('getUserInfo').then(user => {
          store.dispatch('getRouterByUser', user).then(res => {
            router.addRoutes(store.getters.getActualRouter); // 动态添加可访问路由表
            console.log('actualRouters: ', store.getters.getActualRouter);
            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          });
        });
      } else {
        console.log('to.path: ', to.path);
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;
        // if (store.state.user.routePermission[to.path]) next(); // 有权限，可访问
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
