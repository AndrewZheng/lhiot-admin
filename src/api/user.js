import Vue from 'vue';

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  };
  return Vue.prototype.$http.request({
    url: 'login',
    data,
    method: 'post'
  });
};

export const getUserInfo = (token) => {
  return Vue.prototype.$http.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  });
};

export const logout = (token) => {
  return Vue.prototype.$http.request({
    url: 'logout',
    method: 'post'
  });
};

export const getRouterByUser= (userid) => {
  return Vue.prototype.$http.request({
    url: 'get_menus_list',
    params: {
      userid: userid
    },
    method: 'get'
  });
};

export const getRouterById= (pid) => {
  return Vue.prototype.$http.request({
    url: 'get_route_list',
    params: {
      pid: pid
    },
    method: 'get'
  });
};
