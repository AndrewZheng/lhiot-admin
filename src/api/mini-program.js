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

//  修改板块
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

// ———————————— 活动管理 —————————————

// 根据条件分页查询拼团机器人列表
export const getRobotPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/robots/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据拼团机器人Ids删除拼团机器人
export const deleteRobot = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/robots/' + ids,
    method: 'delete'
  });
};

// 添加拼团机器人
export const createRobot = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/robots/',
    data,
    method: 'post'
  });
};

// 修改拼团机器人
export const editRobot = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/robots/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询图片管理列表
export const getImagePages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-images/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据图片管理Ids删除图片管理
export const deleteImage = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-images/' + ids,
    method: 'delete'
  });
};

// 添加图片管理
export const createImage = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-images/',
    data,
    method: 'post'
  });
};

// 修改图片管理
export const editImage = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-images/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询拼团活动管理列表
export const getTeamBuyPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-team-buys/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据拼团活动管理Ids删除拼团活动管理
export const deleteTeamBuy = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-team-buys/' + ids,
    method: 'delete'
  });
};

// 添加拼团活动管理
export const createTeamBuy = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-team-buys/',
    data,
    method: 'post'
  });
};

// 修改拼团活动管理
export const editTeamBuy = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-team-buys/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询拼团活动管理列表
export const getActivitiesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activities/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据拼团活动管理Ids删除拼团活动管理
export const deleteActivities = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activities/' + ids,
    method: 'delete'
  });
};

// 添加拼团活动管理
export const createActivities = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activities/',
    data,
    method: 'post'
  });
};

// 修改拼团活动管理
export const editActivities = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activities/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询限时抢购列表
export const getFlashsalePages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-flashsales/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据限时抢购Ids删除限时抢购
export const deleteFlashsale = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-flashsales/' + ids,
    method: 'delete'
  });
};

// 添加限时抢购
export const createFlashsale = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-flashsales/',
    data,
    method: 'post'
  });
};

// 修改限时抢购
export const editFlashsale = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-flashsales/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询优惠券列表
export const getCouponPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-coupons/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据优惠券Ids删除优惠券
export const deleteCoupon = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-coupons/' + ids,
    method: 'delete'
  });
};

// 添加优惠券
export const createCoupon = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-coupons/',
    data,
    method: 'post'
  });
};

// 修改优惠券
export const editCoupon = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-coupons/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询优惠券模板列表
export const getCouponTemplatePages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/coupon-templates/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据优惠券模板Ids删除优惠券模板
export const deleteCouponTemplate = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/coupon-templates/' + ids,
    method: 'delete'
  });
};

// 添加优惠券模板
export const createCouponTemplate = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/coupon-templates/',
    data,
    method: 'post'
  });
};

// 修改优惠券模板
export const editCouponTemplate = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/coupon-templates/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询分享红包列表
export const getShareRewardPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-share-rewards/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据分享红包Ids删除分享红包
export const deleteShareReward = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-share-rewards/' + ids,
    method: 'delete'
  });
};

// 添加分享红包
export const createShareReward = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-share-rewards/',
    data,
    method: 'post'
  });
};

// 修改分享红包
export const editShareReward = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-share-rewards/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询注册送礼列表
export const getRegisterRewardPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-register-rewards/pages',
    data,
    method: 'post',
    headers: { 'page': data.page, 'rows': data.rows }
  });
};

// 根据注册送礼Ids删除注册送礼
export const deleteRegisterReward = ({ ids }) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-register-rewards/' + ids,
    method: 'delete'
  });
};

// 添加注册送礼
export const createRegisterReward = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-register-rewards/',
    data,
    method: 'post'
  });
};

// 修改注册送礼
export const editRegisterReward = (data) => {
  return Vue.prototype.$http.request({
    url: '/minapp/activity-register-rewards/' + data.id,
    data,
    method: 'put'
  });
};
