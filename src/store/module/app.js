import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, routeHasExist } from '@/libs/util';
import routers from '@/router/routers';

const state={
  breadCrumbList: [],
  tagNavList: [],
  homeRoute: getHomeRoute(routers),
  local: ''
};

const getters={
  menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
};

const mutations={
  setBreadCrumb (state, routeMetched) {
    state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute);
  },
  setTagNavList (state, list) {
    if (list) {
      state.tagNavList = [...list];
      setTagNavListInLocalstorage([...list]);
    } else state.tagNavList = getTagNavListFromLocalstorage();
  },
  addTag (state, { route, type = 'unshift' }) {
    if (!routeHasExist(state.tagNavList, route)) {
      if (type === 'push') state.tagNavList.push(route);
      else {
        if (route.name === 'home') state.tagNavList.unshift(route);
        else state.tagNavList.splice(1, 0, route);
      }
      setTagNavListInLocalstorage([...state.tagNavList]);
    }
  },
  setLocal (state, lang) {
    state.local = lang;
  }
};

const actions={

};

export default {
  state,
  getters,
  mutations,
  actions
};
