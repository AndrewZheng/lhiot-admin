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
    url: '/ims-menu/pages', // get_menu_data
    data: data,
    method: 'post'
  });
};

export const getRoleData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: '/ims-role/pages', // get_role_data
    data: data,
    method: 'post'
  });
};

export const getUserData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: '/admin/pages', // get_user_data
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
    url: '/ims-operation/pages', // get_operate_data
    data: data,
    method: 'post' // 'get'
  });
};
