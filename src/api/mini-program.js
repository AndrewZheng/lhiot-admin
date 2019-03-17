import Vue from 'vue';

// 查询商品分类树结构
export const getMiniProgramProductCategoriesTree = () => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getMiniProgramProductCategoriesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-categories/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 添加商品分类
export const addMiniProgramProductCategories = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-categories/',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品分类
export const deleteMiniProgramProductCategories = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-categories/' + ids,
    method: 'delete'
  });
};

// 修改商品分类
export const putMiniProgramProductCategories = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-categories/',
    data,
    method: 'put'
  });
};

// 根据条件分页查询商品单位列表
export const getMiniProgramProductUnitsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-units/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 添加商品单位
export const addMiniProgramProductUnits = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-units/',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品单位
export const deleteMiniProgramProductUnits = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-units/' + ids,
    method: 'delete'
  });
};

// 修改商品单位
export const putMiniProgramProductUnits = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-units/',
    data,
    method: 'put'
  });
};

// 根据位置查询门店所有列表根据距离排序
export const getStorePages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/stores/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};
// 根据id删除门店
export const deleteStore = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/stores/' + ids,
    method: 'delete'
  });
};

// 根据id查询门店
export const getStoreDetail = ({ id }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/stores/' + id,
    method: 'get'
  });
};

// 查询所有门店区域
export const getStoreAreas = () => {
  return Vue.prototype.$http.request({
    url: '/store-areas',
    method: 'get'
  });
};

// 根据id更新门店 /stores/{id}
export const editStore = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/stores/',
    data,
    method: 'put'
  });
};

// 添加门店
export const addStore = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/stores/',
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品信息列表
export const getProductPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/products/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据商品Ids删除商品
export const deleteProduct = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/products/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getProduct = ({ id }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/products/' + id,
    method: 'get'
  });
};

// 修改商品
export const editProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/products/',
    data,
    method: 'put'
  });
};

// 添加商品
export const createProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/products/',
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品规格信息列表(传值productId)
export const getProductStandardsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-standards/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据商品规格Ids删除商品规格
export const deleteProductStandard = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-standards/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createProductStandard = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-standards/',
    data,
    method: 'post'
  });
};

// / 修改商品规格
export const editProductStandard = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-standards/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询板块信息列表(传值productId)
export const getProductSectionPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-sections/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据板块Ids删除板块
export const deleteProductSection = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-sections/' + ids,
    method: 'delete'
  });
};

// 添加板块
export const createProductSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-sections/',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// / 修改板块
export const editProductSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-sections/' + data.id,
    data,
    method: 'put'
  });
};

// 查询商品分类树结构
export const getProductSectionTree = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-sections/tree',
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品板块信息列表(传值productId)
export const getProductSectionRelationPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-section-relations/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据商品板块Ids删除商品板块
export const deleteProductSectionRelation = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-section-relations/' + ids,
    method: 'delete'
  });
};

// 添加商品板块
export const createProductSectionRelation = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-section-relations/',
    data,
    method: 'post'
  });
};

// 修改商品板块
export const editProductSectionRelation = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/product-section-relations/' + data.id,
    data,
    method: 'put'
  });
};

