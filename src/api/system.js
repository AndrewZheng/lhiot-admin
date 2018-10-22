import Vue from 'vue';

/**
 * 根据父级菜单Id获取对应的子菜单列表
 * @param {*} pid 
 */
export const getRouterById = (pid) => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/pid', // get_route_list
    params: {
      pid: pid
    },
    method: 'get'
  });
};

export const getSystemList = () => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/systems', // get_system_list
    method: 'get'
  });
};

export const getMenuList = () => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/all', // get_menu_list
    method: 'get'
  });
};
