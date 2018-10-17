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

export const getMenuData = ({ page, rows, pid }) => {
  const data = {
    page,
    rows,
    pid
  };
  
  return Vue.prototype.$http.request({
    url: 'get_menu_data',
    params: data,
    method: 'get'
  });
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-menu/pages',
  //   params: data,
  //   method: 'get'
  // });
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
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-role/pages',
  //   params: data,
  //   method: 'get'
  // });
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
  // return Vue.prototype.$imsService.request({
  //   url: '/admin/pages',
  //   params: data,
  //   method: 'get'
  // });
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
  // return Vue.prototype.$imsService.request({
  //   url: '/ims-operation/pages',
  //   params: data,
  //   method: 'get'
  // });
};
