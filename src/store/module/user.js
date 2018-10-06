import { login, logout, getUserInfo, getRouterByUser } from '@/api/user';
import { setToken, getToken, getRoutes, filterLocalRoute } from '@/libs/util';
import routersLocal, { constantRouterMap } from '@/router/routers';
import { PcLockr, enums, gbs } from '@/util/';

const state = {
  userName: '',
  userId: '',
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
  generateRoutes(state, routeList) {
    console.log('routeList', routeList);
    state.userPermission = routeList;

    // let routePermission = getRoutes(routeList);
    // console.log('routePermission: ', routePermission);
    // state.routePermission = routePermission;

    let actualRouter= filterLocalRoute(routeList, routersLocal);
    console.log('actualRouter: ', ...actualRouter);
    state.actualRouter = actualRouter;
    state.routers = constantRouterMap.concat(actualRouter);
  }
};

const actions = {
  // 登录
  handleLogin({ commit }, { userName, password }) {
    userName = userName.trim();
    return new Promise((resolve, reject) => {
      login({ userName, password }).then(res => {
        // step 1
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
      // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
      // commit('setToken', '')
      // commit('setAccess', [])
      // resolve()
    });
  },
  // 获取用户相关信息
  getUserInfo({ state, commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(res => {
        commit('setAvator', res.avator);
        commit('setUserName', res.name);
        commit('setUserId', res.user_id);
        commit('setAccess', res.access);
        commit('setHasGetInfo', true);
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  },
  getRouterByUser({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      getRouterByUser(id).then(res => {
        if (res && res.length > 0) {
          commit('generateRoutes', res[0].routeList);
        }
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
