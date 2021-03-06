import Vue from 'vue';

/**
 * 根据父级菜单Id获取对应的子菜单列表
 * @param {*} pid
 */
export const getRouterById = (pid) => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/pid',
    params: {
      pid: pid
    },
    method: 'get'
  });
};

export const getSystemList = () => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/systems',
    method: 'get'
  });
};

/**
 *  菜单管理 CRUD
 */
export const getMenuList = () => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/list/all',
    method: 'get'
  });
};

export const deleteMenu = (id) => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/' + id,
    method: 'delete'
  });
}

export const deleteOperate = (id) => {
  return Vue.prototype.$http.request({
    url: '/ims-operation/' + id,
    method: 'delete'
  });
}

export const createMenu = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/',
    data,
    method: 'post'
  })
}

export const editMenu = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-menu/' + data.id,
    data,
    method: 'put'
  })
}

export const getRelationMenu = (id) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/relation/menus/' + id,
    method: 'post'
  });
};

/**
 *  角色管理 CRUD
 */
export const getRoleData = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/pages',
    data,
    method: 'post'
  });
};

export const getRoleList = () => {
  return Vue.prototype.$http.request({
    url: '/ims-role/list/all',
    method: 'get'
  });
};

export const getRelationRoles = (id) => {
  return Vue.prototype.$http.request({
    url: '/admin/relation/roles/' + id,
    method: 'post'
  });
};

export const createRole = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/',
    data,
    method: 'post'
  })
}

export const editRole = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/' + data.id,
    data,
    method: 'put'
  })
}

export const deleteRole = (ids) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/' + ids,
    method: 'delete'
  });
}
/**
 * 根据菜单ids查询操作权限列表
 * @param {*} id
 */
export const getOperateByMenuId = (id) => {
  return Vue.prototype.$http.request({
    url: '/ims-operation/user/list/' + id,
    method: 'get'
  });
}

/**
 * 根据roleId查询菜单及操作列表
 * @param {*} id
 */
export const getMenuOperatesByRoleId = (id) => {
  let url = '/ims-role/relation/menu-operations';
  if (id) { url = url + '?roleId=' + id }
  return Vue.prototype.$http.request({
    url,
    method: 'get'
  });
}

/**
 * 根据ids更新角色与菜单、操作的关联关系
 * @param {*} id
 */
export const createRoleRelation = (data) => {
  return Vue.prototype.$http.request({
    url: '/ims-role/relation/' + data.id,
    data,
    method: 'put'
  })
}

export const getUserData = ({ page, rows }) => {
  const data = {
    page,
    rows
  };

  return Vue.prototype.$http.request({
    url: '/admin/pages',
    data: data,
    method: 'post'
  });
};

export const uploadFile = (data) => {
  return Vue.prototype.$http.request({
    url: 'https://resource.food-see.com/v1/upload/product_image',
    data: data,
    method: 'post'
  });
};
