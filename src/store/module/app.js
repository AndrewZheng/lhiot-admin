import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getTagNavListFromLocalstorage,
  getSystemHomeName,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled
} from '@/libs/util';
import beforeClose from '@/router/before-close';
import router from '@/router';
import routers from '@/router/routers';
import { getSystemList } from '@/api/system';
import { PcLockr, enums } from 'util/';

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

const state = {
  breadCrumbList: [],
  tagNavList: [],
  homeRoute: getHomeRoute(routers),
  local: '',
  systemList: [],
  systemCurrent: null
};

const getters = {
  systemCurrent: (state) => {
    if (!state.systemCurrent) {
      state.systemCurrent = PcLockr.get(enums.SYSTEM) ? JSON.parse(PcLockr.get(enums.SYSTEM)) : {};
    }
    return state.systemCurrent;
  }
};

const mutations = {
  setBreadCrumb(state, route) {
    state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
  },
  setTagNavList(state, list) {
    if (list) {
      state.tagNavList = [...list];
      setTagNavListInLocalstorage([...list]);
    } else state.tagNavList = getTagNavListFromLocalstorage();
  },
  setSystemList(state, list) {
    if (list.length > 0) {
      state.systemList = [...list];
    }
  },
  setCurrentSystem(state, list) {
    // 如果不是第一次登录则从Pclockr里取
    if (!PcLockr.get(enums.SYSTEM)) {
      const obj = list[0] || {};
      state.systemCurrent = obj;
      PcLockr.set(enums.SYSTEM, JSON.stringify(obj));
    } else {
      state.systemCurrent = PcLockr.get(enums.SYSTEM) ? JSON.parse(PcLockr.get(enums.SYSTEM)) : {};
    }
  },
  closeTag(state, route) {
    const tag = state.tagNavList.filter(item => routeEqual(item, route));
    route = tag[0] ? tag[0] : null;
    if (!route) return;
    if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
      new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
        if (close) {
          closePage(state, route);
        }
      });
    } else {
      closePage(state, route);
    }
  },
  addTag(state, { route, type = 'unshift' }) {
    const router = getRouteTitleHandled(route);
    if (!routeHasExist(state.tagNavList, router)) {
      if (type === 'push') state.tagNavList.push(router);
      else {
        if (router.name === getSystemHomeName()) state.tagNavList.unshift(router);
        else state.tagNavList.splice(1, 0, router);
      }
      setTagNavListInLocalstorage([...state.tagNavList]);
    }
    setTagNavListInLocalstorage([...state.tagNavList]);
  },
  setLocal(state, lang) {
    state.local = lang;
  }
};

const actions = {
  getSystemList({ commit }) {
    return new Promise((resolve, reject) => {
      getSystemList().then(res => {
        if (res && res.array.length > 0) {
          commit('setSystemList', res.array);
          commit('setCurrentSystem', res.array);
        }
        resolve();
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
