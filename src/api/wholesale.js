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

/* -------------------------
 * 商品板块管理
 * -------------------------
 */
// 查询
export const getPlateGoodsDetail = ({
  id
}) => {
  return $http.request({
    url: '/wholesale-small/plate-goods/' + id,
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

// 批量创建板块和商品之间的关联
export const createProductSectionRelation = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-goods/creates',
    data,
    method: 'post'
  });
};

// 根据商品板块Ids删除板块和商品的关联
export const deleteProductSectionRelation = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/plate-goods/' + ids,
    method: 'delete'
  });
};

// 批量修改板块和商品的关联
export const editProductSectionRelation = (data) => {
  return $http.request({
    url: '/wholesale-small/plate-goods/updates',
    data,
    method: 'put'
  });
};
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

/* -------------------------
 * 商品区间价格管理
 * -------------------------
 */
// 根据条件分页查询商品规格信息列表
export const getGoodsPriceRegionPages = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-price-region/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据商品规格Ids删除商品规格
export const deleteGoodsPriceRegion = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/goods-price-region/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createGoodsPriceRegion = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-price-region/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editGoodsPriceRegion = (data) => {
  return $http.request({
    url: '/wholesale-small/goods-price-region/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 会员管理
 * -------------------------
 */
// 根据条件分页查询用户信息列表
export const getUserPages = (data) => {
  return $http.request({
    url: '/wholesale-small/user/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteUser = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/user/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createUser = (data) => {
  return $http.request({
    url: '/wholesale-small/user/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editUser = (data) => {
  return $http.request({
    url: '/wholesale-small/user/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 订单管理
 * -------------------------
 */
export const getOrderPages = (data) => {
  return $http.request({
    url: '/wholesale-small/order/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const getOrder = ({
  id
}) => {
  return $http.request({
    url: '/wholesale-small/order/' + id,
    method: 'get'
  });
};

/* -------------------------
 * 活动管理
 * -------------------------
 */
// 根据条件分页查询活动信息列表
export const getActivityPages = (data) => {
  return $http.request({
    url: '/wholesale-small/activity/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deletActivity = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/activity/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createActivity = (data) => {
  return $http.request({
    url: '/wholesale-small/activity/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editActivity = (data) => {
  return $http.request({
    url: '/wholesale-small/activity/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 优惠券模板管理
 * -------------------------
 */
export const getCouponTemplatePages = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-plate/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deletCouponTemplate = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/coupon-plate/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createCouponTemplate = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-plate/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editCouponTemplate = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-plate/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 优惠券管理
 * -------------------------
 */
export const getCouponPages = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-entity/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deletCoupon = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/coupon-entity/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createCoupon = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-entity/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editCoupon = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-entity/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 优惠券配置管理
 * -------------------------
 */
export const getCouponConfigPages = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-config/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteCouponConfig = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/coupon-config/' + ids,
    method: 'delete'
  });
};

export const createCouponConfig = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-config/create',
    data,
    method: 'post'
  });
};

export const editCouponConfig = (data) => {
  return $http.request({
    url: '/wholesale-small/coupon-config/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 注册送礼配置管理
 * -------------------------
 */
export const getRewardConfigPages = (data) => {
  return $http.request({
    url: '/wholesale-small/reward-config/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteRewardConfig = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/reward-config/' + ids,
    method: 'delete'
  });
};

export const createRewardConfig = (data) => {
  return $http.request({
    url: '/wholesale-small/reward-config/create',
    data,
    method: 'post'
  });
};

export const editRewardConfig = (data) => {
  return $http.request({
    url: '/wholesale-small/reward-config/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 限时抢购配置管理
 * -------------------------
 */
export const getFlashsaleGoodsPages = (data) => {
  return $http.request({
    url: '/wholesale-small/flashsale-goods/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteFlashsaleGoods = ({
  ids
}) => {
  return $http.request({
    url: '/wholesale-small/flashsale-goods/' + ids,
    method: 'delete'
  });
};

export const createFlashsaleGoods = (data) => {
  return $http.request({
    url: '/wholesale-small/flashsale-goods/create',
    data,
    method: 'post'
  });
};

export const editFlashsaleGoods = (data) => {
  return $http.request({
    url: '/wholesale-small/flashsale-goods/update/' + data.id,
    data,
    method: 'put'
  });
};
