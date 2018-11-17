import Vue from 'vue';

export const getMasterApplication = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit_master_application',
    data: data,
    method: 'get'
  });
};

export const getMasterManager =({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit_master_manager',
    data,
    method: 'get'
  });
};

export const getMasterSalary =({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit_master_salary',
    data,
    method: 'get'
  });
};
