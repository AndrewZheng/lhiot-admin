import Vue from 'vue';

export const getTableData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: 'get_table_data',
    params: data,
    method: 'get'
  });
};

export const getDragList = () => {
  return Vue.prototype.$http.request({
    url: 'get_drag_list',
    method: 'get'
  });
};

export const getSystemList = () => {
  return Vue.prototype.$http.request({
    url: 'get_system_list',
    method: 'get'
  });
};

export const getMenuList = () => {
  return Vue.prototype.$http.request({
    url: 'get_menu_list',
    method: 'get'
  });
};

export const getMenuData = ({ page, rows, parentid }) => {
  const data = {
    page,
    rows,
    parentid
  };
  
  return Vue.prototype.$http.request({
    url: 'get_menu_data',
    params: data,
    method: 'get'
  });
};

export const getRoleData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: 'get_role_data',
    params: data,
    method: 'get'
  });
};

export const getUserData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: 'get_user_data',
    params: data,
    method: 'get'
  });
};

export const getOperateData= ({ page, rows, menuId }) => {
  const data = {
    page,
    rows,
    menuId
  };
  
  return Vue.prototype.$http.request({
    url: 'get_operate_data',
    params: data,
    method: 'get'
  });
};
