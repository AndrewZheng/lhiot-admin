import { login, logout, getUserInfo } from '@/api/user';
import { getRouterById } from '@/api/system';
import { setToken, getToken, filterLocalRoute } from '@/libs/util';
import routersLocal, { constantRouterMap } from '@/router/routers';
import { PcLockr, enums, gbs } from 'util/';
import _ from 'lodash';

const state = {
  userName: '',
  userId: '',
  sessionId: '',
  avatorImgPath: '',
  token: getToken(),
  access: '',
  hasGetInfo: false,
  userPermission: [],
  routePermission: {},
  routers: constantRouterMap,
  actualRouter: []
};

const getters = {
  getUserName: (state) => {
    if (!state.userName) {
      state.userName= PcLockr.get(enums.USER.LOGIN_NAME);
    }
    return state.userName;
  },
  getUserPermission: (state) => {
    return state.userPermission;
  },
  getRoutePermission: (state) => {
    return state.routePermission;
  },
  getActualRouter: (state) => {
    return state.actualRouter;
  }
};

const mutations = {
  setRouters: (state, routers) => {
    state.actualRouter = routers;
    state.routers = constantRouterMap.concat(routers);
  },
  setAvator(state, avatorPath) {
    state.avatorImgPath = avatorPath;
  },
  setUserId(state, id) {
    state.userId = id;
    if (PcLockr.get(enums.USER.ID) != null) {
      PcLockr.delete(enums.USER.ID);
    }
    PcLockr.set(enums.USER.ID, id);
  },
  setHasGetInfo (state, status) {
    state.hasGetInfo = status;
  },
  setUserName(state, name) {
    state.userName = name;
    if (PcLockr.get(enums.USER.LOGIN_NAME) != null) {
      PcLockr.delete(enums.USER.LOGIN_NAME);
    }
    PcLockr.set(enums.USER.LOGIN_NAME, name);
  },
  setAccess(state, access) {
    state.access = access;
  },
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  setRoutePermission(state, routePermission) {
    state.routePermission=routePermission;
  },
  generateRoutes(state, routeList) {
    console.log('routeList', routeList);
    state.userPermission = routeList;
    let actualRouter= filterLocalRoute(routeList, routersLocal);
    console.log('actualRouter: ', actualRouter);
    // 清空上一次的数据
    if (state.actualRouter.length>0) {
      state.actualRouter =[];
    }
    state.actualRouter = actualRouter;
    state.routers = constantRouterMap.concat(actualRouter);
  }
};

const actions = {
  // 登录
  handleLogin({ commit, dispatch }, { account, password }) {
    account = account.trim();
    return new Promise((resolve, reject) => {
      login({ account, password }).then(res => {
        // console.log('res from backend: ', res.XSessionId);
        // commit('setToken', res.XSessionId);
        console.log('step 1');
        commit('setToken', res.token);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  // 退出登录
  handleLogOut({ state, commit }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('setToken', '');
        commit('setAccess', []);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  // 获取用户相关信息
  getUserInfo({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(res => {
        console.log('step 3');
        commit('setAvator', res.avatar);
        commit('setUserName', res.name);
        commit('setUserId', res.id);
        commit('setHasGetInfo', true);
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getRouteListById({ state, commit }, pid) {
    console.log('pid: ', pid);
    return new Promise((resolve, reject) => {
      getRouterById(pid).then(res => {
        if (res && res.array && res.array.length > 0) {
          console.log('res.array：', res.array);
          commit('generateRoutes', res.array);
        }
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  // 根据当前用户生成系统菜单（右上角系统菜单 + 左边栏非系统菜单）
  async generateAllMenus({ dispatch }) {
    console.log('step 2');
    await dispatch('getUserInfo');
    await dispatch('getSystemList');
    let pid=0;
    if (PcLockr.get(enums.SYSTEM)) {
      const system = JSON.parse(PcLockr.get(enums.SYSTEM));
      pid = system.id;
    }
    return dispatch('getRouteListById', pid);
  },
  // 动态修改权限
  async changePermission({ commit, dispatch }) {
    await dispatch('getUserInfo');
    let pid=0;
    if (PcLockr.get(enums.SYSTEM)) {
      const system = JSON.parse(PcLockr.get(enums.SYSTEM));
      pid = system.id;
    }
    // 不退出登录重新获取用户的信息-生成右上角系统菜单，生成左边菜单
    return dispatch('getRouteListById', pid);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
