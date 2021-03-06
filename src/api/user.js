import Vue from 'vue';

export const login = ({ account, password }) => {
  const data = {
    account,
    password
  };

  return Vue.prototype.$http.request({
    url: '/admin/sessions', // login /admin/sessions
    data,
    method: 'post'
  });
};

export const getUserInfo = (token) => {
  // return Vue.prototype.$http.request({
  //   url: 'get_info',
  //   params: {
  //     token
  //   },
  //   method: 'get'
  // });
  return Vue.prototype.$http.request({
    url: '/admin/sessions',
    method: 'get'
  });
};

export const logout = (token) => {
  return Vue.prototype.$http.request({
    url: '/admin/sessions',
    method: 'delete'
  });
};
