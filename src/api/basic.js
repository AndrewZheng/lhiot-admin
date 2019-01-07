import Vue from 'vue';

// 后台管理查询数据字典列表
export const getDictionaryPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/pages',
    data,
    method: 'post'
  });
};

// 查询数据字典详情
export const getDictionary = ({ code }) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + code + '?includeEntries=true',
    method: 'get'
  });
};

// 添加数据字典
export const createDictionary = (data) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/',
    data,
    method: 'post'
  });
};

// 根据数据字典code删除
export const deleteDictionary = ({ code }) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + code,
    method: 'delete'
  });
};

// 修改数据字典
export const editDictionary = (data) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + data.code,
    data,
    method: 'put'
  });
};

// 添加数据字典项
export const createDictionaryEntry = (data) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + data.dictCode + '/entries',
    data,
    method: 'post'
  });
};

// 根据数据字典code删除数据字典项
export const deleteDictionaryEntry = ({ dictCode, code }) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + dictCode + '/entries?code=' + code,
    method: 'delete'
  });
};

// 修改数据字典项
export const editDictionaryEntry = (data) => {
  return Vue.prototype.$http.request({
    url: '/dictionaries/' + data.dictCode + '/entries/' + data.code,
    data,
    method: 'put'
  });
};
