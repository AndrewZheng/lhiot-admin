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

export const getMasterManager = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit_master_manager',
    data,
    method: 'get'
  });
};

export const getMasterSalary = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'admin_fruit_master_salary',
    data,
    method: 'get'
  });
};

export const getFruitMasterUserData = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_fruit_master_user_data',
    data,
    method: 'get'
  });
};

export const getFruitMastGoodsCategoryData = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_fruit_master_goods_category_data',
    data,
    method: 'get'
  });
};

export const getOnSaleData = ({page, rows}) => {
  const data = {
    page, rows
  };
  return Vue.prototype.$http.request({
    url: 'get_on_sale_data',
    data,
    method: 'get'
  });
};

// 查询商品分类树结构
export const getProductCategoriesTree = () => {
  return Vue.prototype.$http.request({
    url: '/product-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getProductCategoriesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-categories/pages',
    data,
    method: 'post'
  });
};

// 添加商品分类
export const addProductCategories = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-categories/',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品分类
export const deleteProductCategories = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-categories/' + ids,
    method: 'delete'
  });
};

// 修改商品分类
export const putProductCategories = ({parentId, id, groupName, rank}) => {
  const data = {
    parentId,
    groupName,
    rank
  };
  return Vue.prototype.$http.request({
    url: '/product-categories/' + id,
    data,
    method: 'put'
  });
};

// 查询所有基础规格单位列表
export const productSpecificationsUnits = () => {
  return Vue.prototype.$http.request({
    url: '/product-specifications/units',
    method: 'get'
  });
};

// 根据条件分页查询商品信息列表
export const getProductPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/products/pages',
    data,
    method: 'post'
  });
};

// 根据商品Ids删除商品
export const deleteProduct = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/products/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getProduct = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/products/' + id,
    method: 'get'
  });
};

// 修改商品
export const editProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/products/' + data.id,
    data,
    method: 'put'
  });
};

// 添加商品
export const createProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/products/',
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品规格信息列表(传值productId)
export const getProductSpecificationsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-specifications/pages',
    data,
    method: 'post'
  });
};

// 根据商品规格Ids删除商品规格
export const deleteProductSpecification = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-specifications/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createProductSpecification = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-specifications/',
    data,
    method: 'post'
  });
};

/// 修改商品规格
export const editProductSpecification = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-specifications/' + data.id,
    data,
    method: 'put'
  });
};

//根据条件分页查询商品上架信息列表
export const getProductShelvesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/pages',
    data,
    method: 'post'
  });
};

//根据商品上架Ids删除商品上架
export const deleteProductShelve = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/' + ids,
    method: 'delete'
  });
};

//添加商品上架
export const createProductShelve = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/',
    data,
    method: 'post'
  });
};

//修改商品上架
export const editProductShelve = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/' + data.id,
    data,
    method: 'put'
  });
};

//查询UI位置列表集合（可包括位置的子板块）
export const checkUiPosition = (data) => {
  return Vue.prototype.$http.request({
    url: '/ui-positions/',
    data,
    method: 'post'
  });
};

//根据Id查找商品上架
export const getProductShelve = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/'+id,
    method: 'get'
  });
};

// 根据条件分页查询UI位置信息列表
export const getuiPositionsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/ui-positions/pages',
    data,
    method: 'post'
  });
};

// 根据Id查找UI位置
export const getUiPosition = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/ui-positions/'+id,
    method: 'get'
  });
};

//根据条件分页查询广告信息列表
export const getAdvertisementsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/pages',
    data,
    method: 'post'
  });
};

//添加广告
export const createAdvertisement = (data) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/',
    data,
    method: 'post'
  });
};

//根据条件分页查询商品版块信息列表
export const getProductSectionsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/pages',
    data,
    method: 'post'
  });
};

//根据商品Ids删除商品版块
export const deleteProductSection = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/'+ids,
    method: 'delete'
  });
};


