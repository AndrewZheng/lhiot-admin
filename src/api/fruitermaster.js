import Vue from 'vue';

export const getMasterApplication = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit-master_application',
    data: data,
    method: 'get'
  });
};
