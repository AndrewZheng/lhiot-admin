import Vue from 'vue';
import Router from 'vue-router';
import iView from 'view-design';
import store from '@/store';
import { constantRouterMap } from './routers';
import { getToken, getNamesByRouters, getSystemHomeName } from '@/libs/util';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
});

const whiteList = ['/login', '/redirect', '/401', '/404', '/500'];
// 如果在静态路由列表中
const constantRouterNames = getNamesByRouters(constantRouterMap);

function hasPermission(userPermission, currentRoute) {
  if (!userPermission) return true;
  if (whiteList.indexOf(currentRoute.path) !== -1) return true;
  console.log('constantRouterNames: ', constantRouterNames);
  if (constantRouterNames.indexOf(currentRoute.name) !== -1) return true;
  return userPermission.some(role => role.code === currentRoute.name);
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  console.log('token:', token);
  if (token) {
    if (to.name === 'login') {
      // 已登录且要跳转的页面是登录页 每个子业务系统需要单独跳转到自身的首页
      const name = getSystemHomeName();
      next({
        name,
        replace: true
      });
    } else {
      console.log('hasGetInfo: ', store.getters.hasGetInfo);
      if (!store.getters.hasGetInfo) {
        store.dispatch('generateAllMenus').then(() => {
          console.log('getActualRouter: ', store.getters.getActualRouter);
          router.addRoutes(store.getters.getActualRouter);
          const sname = getSystemHomeName();
          if (sname.indexOf('-home') > 0) {
            next({
              name: sname,
              replace: true
            })
          } else {
            next({ ...to,
              replace: true
            });
          }
        });
      } else {
        console.log('userPermission: ', store.getters.getUserPermission);
        if (hasPermission(store.getters.getUserPermission, to)) {
          next();
          console.log('to.path: ', to.path);
        } else {
          next({ path: '/401', replace: true });
        }
      }
    }
  } else {
    // 未登录且要跳转的页面不是登录页
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({
        name: 'login'
      });
    }
  }
});

router.afterEach(to => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
