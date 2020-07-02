import Vue from 'vue';
import Router from 'vue-router';
import iView from 'view-design';
import store from '@/store';
import { constantRouterMap } from './routers';
import { getToken, getNamesByRouters, getSystemHomeName, getSystemHomeNameNew } from '@/libs/util';
const IS_PROD = ['production'].includes(process.env.NODE_ENV);
const BASE_URL = IS_PROD ? '/lhiot-admin/' : '/';
Vue.use(Router);

const createRouter = () => new Router({
  mode: 'history',
  base: BASE_URL,
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

const LOGIN_PAGE_NAME = 'login';
const whiteList = ['/login', '/redirect', '/401', '/404', '/500'];

const constantRouterNames = getNamesByRouters(constantRouterMap);

function hasPermission(userPermission, currentRoute) {
  if (!userPermission) return true;
  if (whiteList.indexOf(currentRoute.path) !== -1) return true;
  console.log('constantRouterNames: ', constantRouterNames);
  if (constantRouterNames.indexOf(currentRoute.name) !== -1) return true;
  return userPermission.some(role => role.code === currentRoute.name);
}

function getCurrentMenuId(userPermission, currentRoute) {
  const menu = userPermission.find(menu => menu.code === currentRoute.name);
  const menuid = menu != null ? menu.id : 0
  return menuid;
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  console.log('token:', token);
  if (token) {
    if (to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页 每个子系统需要单独跳转到自身的首页
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
          const sname = getSystemHomeNameNew(to.path);
          if (sname.indexOf('-home') > 0) {
            next({
              name: sname,
              replace: true
            })
          } else {
            next({
              ...to,
              replace: true
            });
          }
        });
      } else {
        console.log('userPermission: ', store.getters.getUserPermission);
        if (hasPermission(store.getters.getUserPermission, to)) {
          console.log('to.path: ', to.path);
          // 如果跳转的菜单有权限，那么再去获取该菜单下的所有操作权限
          const menuid = getCurrentMenuId(store.getters.getUserPermission, to);
          if (menuid > 0) {
            store.dispatch('getBtnPermissionById', menuid).then(() => {
              next();
            })
          } else {
            next();
          }
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
