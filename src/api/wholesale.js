import Vue from 'vue';
const $http = Vue.prototype.$http;

/* -------------------------
 * 商品分类管理
 * -------------------------
*/
// 查询商品分类树结构
export const getProductCategoriesTree = () => {
  return $http.request({
    url: '/wholesale-small/goods-category/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getProductCategoriesPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-category/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 添加商品分类
export const createProductCategories = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-category/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品分类
export const delProductCategories = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods-category/' + ids,
    method: 'delete'
  });
};

// 修改商品分类
export const editProductCategories = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-category/',
    data,
    method: 'put'
  });
};

/* -------------------------
 * 商品单位管理
 * -------------------------
*/
// 根据条件分页查询商品单位列表
export const getProductUnitsPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-unit/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询所有的商品单位列表
export const getProductUnits = () => {
  return $http.request({
    url: '/wholesale-small/goods-unit/getGoodsUnitAll',
    method: 'get'
  });
};

// 添加商品单位
export const createProductUnits = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-unit/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品单位
export const delProductUnits = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods-unit/' + ids,
    method: 'delete'
  });
};

// 修改商品单位
export const editProductUnits = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-unit/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 商品信息管理
 * -------------------------
*/
// 根据条件分页查询商品信息列表
export const getProductPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据商品Ids删除商品
export const deleteProduct = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getProduct = ({
  id
}) => {
  return $http.request({
    url: '/wholesale-small/goods/' + id,
    method: 'get'
  });
};

// 修改商品
export const editProduct = (data) => {
  return $http.request({
    url: '/wholesale-small/goods/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加商品
export const createProduct = (data) => {
  return $http.request({
    url: '/wholesale-small/goods/create',
    data,
    method: 'post'
  });
};

/* -------------------------
 * 商品关键字管理
 * -------------------------
*/
// 根据条件分页查询商品关键字列表
export const getKeywordsPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-keywords/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据商品Ids删除关键字
export const deleteKeywords = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods-keywords/' + ids,
    method: 'delete'
  });
};

// 根据Id查找关键字
export const getKeywords = ({
  id
}) => {
  return $http.request({
    url: '/wholesale-small/goods-keywords/' + id,
    method: 'get'
  });
};

// 修改关键字
export const editKeywords = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-keywords/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加关键字
export const createKeywords = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-keywords/create',
    data,
    method: 'post'
  });
};

/* -------------------------
 * 板块管理
 * -------------------------
*/
// 根据条件分页查询板块信息列表
export const getProductSectionPages = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-category/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// 根据板块Ids删除板块
export const deleteProductSection = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/plate-category/' + ids,
    method: 'delete'
  });
};

// 根据板块Ids判断当前分类信息是否可以删除
export const deleteProductSectionValidation = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/plate-category/whetherdelete/' + ids,
    method: 'get'
  });
};

// 添加板块
export const createProductSection = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-category/create',
    data,
    method: 'post'
  });
};

//  修改板块
export const editProductSection = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-category/update/' + data.id,
    data,
    method: 'put'
  });
};

// 查询商品分类树结构
export const getProductSectionTree = () => {
  return $http.request({
    url: '/wholesale-small/plate-category/tree',
    method: 'get'
  });
};

// 根据条件分页查询板块和商品关联信息列表
export const getProductSectionRelationPages = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-goods/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// 创建板块和商品之间的关联
export const createProductSectionRelation = (data) => {
  return $http.request({
    url: '/minapp/product-section-relations/',
    data,
    method: 'post'
  });
};

// 根据商品板块Ids删除板块和商品的关联
export const deleteProductSectionRelation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/product-section-relations/' + ids,
    method: 'delete'
  });
};

// 修改板块和商品的关联
export const editProductSectionRelation = (data) => {
  return $http.request({
    url: '/minapp/product-section-relations/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 商品板块管理
 * -------------------------
*/

/* -------------------------
 * 商品规格管理
 * -------------------------
*/
// 根据商品规格id查询扩展信息
export const getProStandardExpand = ({
  id
}) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/standard/' + id,
    method: 'get'
  });
};

// 根据code条码查询海鼎商品信息
export const getHdProductInfo = ({
  code
}) => {
  return $http.request({
    url: '/minapp/product-standards/hd-product/' + code,
    method: 'get'
  });
};

// 修改商品规格扩展信息
export const modifyProStandardExpand = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/update/' + data.id,
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品规格信息列表
export const getProductStandardsPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据商品规格Ids删除商品规格
export const deleteProductStandard = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createProductStandard = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editProductStandard = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-standard/update/' + data.id,
    data,
    method: 'put'
  });
};
