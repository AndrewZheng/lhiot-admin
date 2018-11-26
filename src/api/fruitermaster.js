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
export const getFruitMasterUserData =({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_fruit_master_user_data',
    data,
    method: 'get'
  });
};
export const getFruitMastGoodsCategoryData =({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_fruit_master_goods_category_data',
    data,
    method: 'get'
  });
};
export const getOnSaleData =({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_on_sale_data',
    data,
    method: 'get'
  });
};
//查询商品分类树结构
export const getProductCategoriesTree = () => {
  return Vue.prototype.$http.request({
    url: '/product-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getProductCategoriesPages = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: '/product-categories/pages',
    data,
    method: 'post'
  });
};
