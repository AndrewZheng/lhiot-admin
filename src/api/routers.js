import Vue from 'vue';

export const getRouterReq = (access) => {
  return Vue.prototype.$http.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
