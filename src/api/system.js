import Vue from 'vue';
import { enums } from 'util/';

/**
 * 根据父级菜单Id获取对应的子菜单列表
 * @param {*} pid 
 */
export const getRouterById = (pid) => {
  return Vue.prototype.$http.request({
    url: 'get_route_list',
    params: {
      pid: pid
    },
    method: 'get'
  });
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-menu/menus/'+pid,
  //   method: 'get'
  // });
};

export const getSystemList = () => {
  return Vue.prototype.$http.request({
    url: 'get_system_list',
    method: 'get'
  });
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-menu/systems',
  //   method: 'get'
  // });
};

export const getMenuList = () => {
  return Vue.prototype.$http.request({
    url: 'get_menu_list',
    method: 'get'
  });
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-menu/menus/list',
  //   method: 'get'
  // });
};
