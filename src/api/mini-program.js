import Vue from 'vue';
const $http = Vue.prototype.$http;
const $imgService = Vue.prototype.$imgService;

//获取首页头部订单数据
export const getWaitOrder = () => {
  return $http.request({
    url: '/minapp/index/statistics/wait-order',
    method: 'get',
  });
};

//获取门店排行 
export const storeRanking = (rankingType) => {
  return $http.request({
    url: `/minapp/index/statistics/store-ranking-total?rankingType=${rankingType}`,
    method: 'get',
  });
};

//获取订单list 
export const getOrderTotal = () => {
  return $http.request({
    url: '/minapp/index/statistics/select-order-total',
    method: 'get',
  });
};

//获取点赞排行 
export const productRanking = (data) => {
  return $http.request({
    url: `/minapp/index/statistics/product-ranking-total?rankingType=${data.rankingType}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
    }
  });
};

//规格商品排行 
export const productStanardRanking = (data) => {
  return $http.request({
    url: `/minapp/index/statistics/product-stanard/sale-ranking?rankingType=${data.rankingType}&beginDate=${data.beginDate}&endDate=${data.endDate}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
    }
  });
};

// 删除图片
export const deletePicture = ({
  urls
}) => {
  return $imgService.request({
    url: '/v2/upload',
    data: urls,
    method: 'delete'
  });
};
/* -------------------------
 * 评价中心
 * -------------------------
 */
export const getEvaluatePages = (data) => {
  return $http.request({
    url: '/minapp/comment-info/pages',
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
export const replyEvaluate = (data) => {
  return $http.request({
    url: 'minapp/comment-info/update/' + data.id,
    data,
    method: 'put'
  });
};
// 查询商品分类树结构
export const getProductCategoriesTree = () => {
  return $http.request({
    url: '/minapp/product-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getProductCategoriesPages = (data) => {
  return $http.request({
    url: '/minapp/product-categories/pages',
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
    url: '/minapp/product-categories/',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品分类
export const delProductCategories = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/product-categories/' + ids,
    method: 'delete'
  });
};

// 修改商品分类
export const editProductCategories = (data) => {
  return $http.request({
    url: '/minapp/product-categories/',
    data,
    method: 'put'
  });
};

// 根据条件分页查询商品单位列表
export const getProductUnitsPages = (data) => {
  return $http.request({
    url: '/minapp/product-units/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据条件分页查询商品单位列表
export const getProductUnits = () => {
  return $http.request({
    url: '/minapp/product-units/',
    method: 'get'
  });
};

// 添加商品单位
export const createProductUnits = (data) => {
  return $http.request({
    url: '/minapp/product-units/',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品单位
export const delProductUnits = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/product-units/' + ids,
    method: 'delete'
  });
};

// 修改商品单位
export const editProductUnits = (data) => {
  return $http.request({
    url: '/minapp/product-units/',
    data,
    method: 'put'
  });
};

// 根据位置查询门店所有列表根据距离排序
export const getStorePages = (data) => {
  return $http.request({
    url: '/minapp/stores/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据id删除门店
export const deleteStore = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/stores/' + ids,
    method: 'delete'
  });
};

// 根据id查询门店
export const getStoreDetail = ({
  id
}) => {
  return $http.request({
    url: '/minapp/stores/' + id,
    method: 'get'
  });
};

// 查询所有门店区域
export const getStoreAreas = () => {
  return $http.request({
    url: '/minapp/stores/store-areas',
    method: 'get'
  });
};

// 根据id更新门店 /stores/{id}
export const editStore = (data) => {
  return $http.request({
    url: '/minapp/stores/',
    data,
    method: 'put'
  });
};

// 添加门店
export const createStore = (data) => {
  return $http.request({
    url: '/minapp/stores/',
    data,
    method: 'post'
  });
};

/* -------------------------
 * 门店区域管理
 * -------------------------
 */
// 分页查询所有门店区域
export const getStoreAreaPages = (data) => {
  return $http.request({
    url: '/minapp/area-store/pages',
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

// 根据id更新门店区域
export const editStoreArea = (data) => {
  return $http.request({
    url: '/minapp/area-store/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加门店区域
export const createStoreArea = (data) => {
  return $http.request({
    url: '/minapp/area-store/create',
    data,
    method: 'post'
  });
};

// 根据id查询门店区域
export const getStoreArea = ({
  id
}) => {
  return $http.request({
    url: '/minapp/area-store/' + id,
    method: 'get'
  });
};

// 根据id删除门店区域
export const deleteStoreArea = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/area-store/' + ids,
    method: 'delete'
  });
};

/* -------------------------
 * 商品管理
 * -------------------------
 */
// 根据条件分页查询商品信息列表
export const getProductPages = (data) => {
  return $http.request({
    url: '/minapp/products/pages',
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
    url: '/minapp/products/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getProduct = ({
  id
}) => {
  return $http.request({
    url: '/minapp/products/' + id,
    method: 'get'
  });
};

// 修改商品
export const editProduct = (data) => {
  return $http.request({
    url: '/minapp/products/',
    data,
    method: 'put'
  });
};

// 添加商品
export const createProduct = (data) => {
  return $http.request({
    url: '/minapp/products/',
    data,
    method: 'post'
  });
};

// 根据商品规格id查询扩展信息(传值stadardId)
export const getProStandardExpand = ({
  id
}) => {
  return $http.request({
    url: '/minapp/product-standard-expand/standard/' + id,
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
export const modifyProStandardExpand = (data) => {
  return $http.request({
    url: '/minapp/product-standard-expand/modify',
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品规格信息列表(传值productId)
export const getProductStandardsPages = (data) => {
  return $http.request({
    url: '/minapp/product-standards/pages',
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
    url: '/minapp/product-standards/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createProductStandard = (data) => {
  return $http.request({
    url: '/minapp/product-standards/',
    data,
    method: 'post'
  });
};

// / 修改商品规格
export const editProductStandard = (data) => {
  return $http.request({
    url: '/minapp/product-standards/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 商品板块管理
 * -------------------------
 */
// 根据条件分页查询板块信息列表(传值productId)
export const getProductSectionPages = (data) => {
  return $http.request({
    url: '/minapp/product-sections/pages',
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
    url: '/minapp/product-sections/' + ids,
    method: 'delete'
  });
};

// 根据板块Ids判断当前分类信息是否可以删除
export const deleteProductSectionValidation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/product-sections/whetherdelete/' + ids,
    method: 'get'
  });
};

// 添加板块
export const createProductSection = (data) => {
  return $http.request({
    url: '/minapp/product-sections/',
    data,
    method: 'post'
  });
};

//  修改板块
export const editProductSection = (data) => {
  return $http.request({
    url: '/minapp/product-sections/' + data.id,
    data,
    method: 'put'
  });
};

// 查询商品分类树结构
export const getProductSectionTree = (data) => {
  return $http.request({
    url: '/minapp/product-sections/tree',
    data,
    method: 'post'
  });
};

// 根据条件分页查询板块和商品关联信息列表
export const getProductSectionRelationPages = (data) => {
  return $http.request({
    url: '/minapp/product-section-relations/pages',
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

// 根据条件分页查询优惠券活动和优惠券模板关联信息列表
export const getCouponTemplateRelationPages = (data) => {
  return $http.request({
    url: '/minapp/coupon-template-relations/pages',
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

// 创建优惠券活动和优惠券模板之间的关联
export const createCouponTemplateRelation = (data) => {
  return $http.request({
    url: '/minapp/coupon-template-relations/',
    data,
    method: 'post'
  });
};

// 根据商品板块Ids删除优惠券活动和优惠券模板的关联
export const deleteCouponTemplateRelation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/coupon-template-relations/' + ids,
    method: 'delete'
  });
};

// 修改优惠券活动和优惠券模板的关联
export const editCouponTemplateRelation = (data) => {
  return $http.request({
    url: '/minapp/coupon-template-relations/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询优惠券活动和海鼎优惠券活动关联信息列表
export const getHdCouponActivitiesPages = (data) => {
  return $http.request({
    url: '/minapp/hd-coupon-activities',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

/* -------------------------
 * 活动管理
 * -------------------------
 */
// 根据条件分页查询拼团机器人列表
export const getRobotPages = (data) => {
  return $http.request({
    url: '/minapp/robots/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据拼团机器人Ids删除拼团机器人
export const deleteRobot = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/robots/' + ids,
    method: 'delete'
  });
};

// 添加拼团机器人
export const createRobot = (data) => {
  return $http.request({
    url: '/minapp/robots/',
    data,
    method: 'post'
  });
};

// 修改拼团机器人
export const editRobot = (data) => {
  return $http.request({
    url: '/minapp/robots/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询图片管理列表
export const getImagePages = (data) => {
  return $http.request({
    url: '/minapp/activity-images/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据图片管理Ids删除图片管理
export const deleteImage = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-images/' + ids,
    method: 'delete'
  });
};

// 添加图片管理
export const createImage = (data) => {
  return $http.request({
    url: '/minapp/activity-images/',
    data,
    method: 'post'
  });
};

// 修改图片管理
export const editImage = (data) => {
  return $http.request({
    url: '/minapp/activity-images/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询拼团活动管理列表
export const getTeamBuyPages = (data) => {
  return $http.request({
    url: '/minapp/activity-team-buys/pages',
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

// 根据拼团活动管理Ids删除拼团活动管理
export const deleteTeamBuy = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-team-buys/' + ids,
    method: 'delete'
  });
};

// 添加拼团活动管理
export const createTeamBuy = (data) => {
  return $http.request({
    url: '/minapp/activity-team-buys/',
    data,
    method: 'post'
  });
};

// 修改拼团活动管理
export const editTeamBuy = (data) => {
  return $http.request({
    url: '/minapp/activity-team-buys/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询拼团活动管理列表
export const getActivitiesPages = (data) => {
  return $http.request({
    url: '/minapp/activities/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据拼团活动管理Ids删除拼团活动管理
export const deleteActivities = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activities/' + ids,
    method: 'delete'
  });
};

// 添加拼团活动管理
export const createActivities = (data) => {
  return $http.request({
    url: '/minapp/activities/',
    data,
    method: 'post'
  });
};

// 修改拼团活动管理
export const editActivities = (data) => {
  return $http.request({
    url: '/minapp/activities/' + data.id,
    data,
    method: 'put'
  });
};
//===================预售活动
// 根据条件分页查询拼团活动管理列表
export const getPresellPages = (data) => {
  return $http.request({
    url: '/minapp/activity-pre-sale/pages',
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

// 添加预售活动管理
export const createPresell = (data) => {
  return $http.request({
    url: '/minapp/activity-pre-sale/create',
    data,
    method: 'post'
  });
};
// 修改拼团活动管理
export const editPresell = (data) => {
  return $http.request({
    url: '/minapp/activity-pre-sale/update/' + data.id,
    data,
    method: 'put'
  });
};
//根据id查询商品规格
export const getGoodsStandard = (data) => {
  return $http.request({
    url: '/minapp/product-standards/' + data.standardId,
    data,
    method: 'get'
  });
};
// ================================老限时抢购
// 根据条件分页查询限时抢购列表
export const getFlashsalePages = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsales/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据限时抢购Ids删除限时抢购
export const deleteFlashsale = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-flashsales/' + ids,
    method: 'delete'
  });
};

// 添加限时抢购
export const createFlashsale = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsales/',
    data,
    method: 'post'
  });
};

// 修改限时抢购
export const editFlashsale = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsales/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询限时抢购商品关联列表
export const getFlashsaleProductRelationPages = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsale-product-relations/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据限时抢购商品关联Ids删除限时抢购商品关联
export const deleteFlashsaleProductRelation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-flashsale-product-relations/' + ids,
    method: 'delete'
  });
};

// 添加限时抢购商品关联
export const createFlashsaleProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsale-product-relations/',
    data,
    method: 'post'
  });
};

// 修改限时抢购商品关联
export const editFlashsaleProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-flashsale-product-relations/' + data.id,
    data,
    method: 'put'
  });
};

// =========================新限时秒杀
// 根据条件分页查询限时秒杀列表
export const getSeckillPages = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill/pages',
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

// 根据限时抢购Ids删除限时秒杀
export const deleteSeckill = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-seckill/' + ids,
    method: 'delete'
  });
};

// 添加限时秒杀
export const createSeckill = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill/create',
    data,
    method: 'post'
  });
};

// 修改限时秒杀
export const editSeckill = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询限时抢购商品关联列表
export const getSeckillProductRelationPages = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill-product-relation/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据限时抢购商品关联Ids删除限时抢购商品关联
export const deleteSeckillProductRelation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-seckill-product-relation/' + ids,
    method: 'delete'
  });
};

// 添加限时抢购商品关联
export const createSeckillProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill-product-relation/create',
    data,
    method: 'post'
  });
};

// 修改限时抢购商品关联
export const editSeckillProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-seckill-product-relation/update/' + data.id,
    data,
    method: 'put'
  });
};

// 限时抢购数据统计
// 会员中心限时秒杀数据埋点统计 /minapp/activity-seckill/data-total 数据埋点统计
export const seckillStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-seckill/data-total?beginDate=${data.beginDate}&endDate=${data.endDate}&dateGroup=${data.dateGroup}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// /minapp/activity-seckill/user/seckill-total 限时抢购秒杀单品数据统计 ?standardId=17
export const singleSeckillStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-seckill/prod/seckill-total?standardId=${data.standardId}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// /minapp/activity-seckill/user/seckill-total 限时抢购用户数据统计
export const userSeckillStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-seckill/user/seckill-total?nickName=${data.nickName}&phone=${data.phone}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// coupon/statistics/statistics  积分统计 
export const integralStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `coupon/statistics/statistics?beginDate=${data.beginDate}&endDate=${data.endDate}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
    }
  });
};

//发券数据统计
export const getSendCouponPages = (data) => {
  return $http.request({
    url: 'coupon/statistics/send-coupon',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

//用券数据统计 /coupon/statistics/use-coupon
export const getUseCouponPages = (data) => {
  return $http.request({
    url: '/coupon/statistics/use-coupon',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

//发券数据列表/coupon/statistics/get/comboBoxs
export const getComboBoxs = () => {
  return Vue.prototype.$http.request({
    url: `/coupon/statistics/get/comboBoxs`,
    method: 'get',
    // headers: {
    //   'page': data.page,
    //   'rows': data.rows,
    // }
  });
};

//分享赚商品数据统计 /minapp/share/prod/share-total
export const shareProdStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/share/prod/share-total?productName=${data.productName}&beginDate=${data.beginDate}&endDate=${data.endDate}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

//分享赚用户数据统计 /minapp/share/user/share-total
export const shareUserStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/share/user/share-total?nickName=${data.nickName}&phone=${data.phone}&beginDate=${data.beginDate}&endDate=${data.endDate}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};
//分佣金数据统计 /minapp/share/user/share-total
export const commissionStatistics = () => {
  return Vue.prototype.$http.request({
    url: '/minapp/commission-data/total',
    method: 'get',
  });
};
// =========================助力抢爆品
// 根据条件分页查询助力抢爆品列表
export const getAssistPages = (data) => {
  return $http.request({
    url: '/minapp/activity-assist/pages',
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

// 根据助力抢爆品Ids删除限时秒杀 /minapp/activity-assist/{ids}
export const deleteAssist = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-assist/' + ids,
    method: 'delete'
  });
};

// 添加助力抢爆品
export const createAssist = (data) => {
  return $http.request({
    url: '/minapp/activity-assist/create',
    data,
    method: 'post'
  });
};

// 修改助力抢爆品 /minapp/activity-assist/update/{id}
export const editAssist = (data) => {
  return $http.request({
    url: '/minapp/activity-assist/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询助力抢爆品商品关联列表
export const getAssistProductRelationPages = (data) => {
  return $http.request({
    url: '/minapp/activity-assist-relation/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据助力抢爆品商品关联Ids删除限时抢购商品关联 /minapp/activity-assist-relation/{ids}
export const deleteAssistProductRelation = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-assist-relation/' + ids,
    method: 'delete'
  });
};

// 添加助力抢爆品商品关联
export const createAssistProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-assist-relation/create',
    data,
    method: 'post'
  });
};

// 修改助力抢爆品商品关联/minapp/activity-assist-relation/update/{id}
export const editAssistProductRelation = (data) => {
  return $http.request({
    url: '/minapp/activity-assist-relation/update/' + data.id,
    data,
    method: 'put'
  });
};

// 助力抢爆品数据统计
// 会员中心助力抢爆品数据埋点统计 /minapp/activity-assist/data-total 助力抢爆品埋点数据统计
export const assistStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-assist/data-total?beginDate=${data.beginDate}&endDate=${data.endDate}&dateGroup=${data.dateGroup}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// /minapp/activity-assist/prod/assist-total   助力抢爆品单品数据统计
export const singleAssistStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-assist/prod/assist-total?standardId=${data.standardId}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// /minapp/activity-assist/user/assist-total  助力抢爆品用户数据统计
export const userAssistStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-assist/user/assist-total?nickName=${data.nickName}&phone=${data.phone}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// /minapp/activity-assist/user/assist-total  助力抢爆品基础数据统计
export const assistDataStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/activity-assist/base-total?beginDate=${data.beginDate}&endDate=${data.endDate}`,
    // url: `/minapp/invite/data-total?beginDate=${data.beginDate}&endDate=${data.endDate}&dateGroup=${data.dateGroup}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 基础数据统计 系统数据统计 minapp/system/data-total/main
export const systemDataStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/system/data-total/main?beginDate=${data.beginDate}&endDate=${data.endDate}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

//会员管理 /minapp/user/users-info
export const getUsersInfo = (data) => {
  return $http.request({
    url: '/minapp/user/users-info',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows,
    }
  });
};

// 根据条件分页查询优惠券列表
export const getCouponPages = (data) => {
  return $http.request({
    url: '/minapp/activity-coupons/pages',
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

// 根据优惠券Ids删除优惠券
export const deleteCoupon = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-coupons/' + ids,
    method: 'delete'
  });
};

// 添加优惠券
export const createCoupon = (data) => {
  return $http.request({
    url: '/minapp/activity-coupons/',
    data,
    method: 'post'
  });
};

// 修改优惠券
export const editCoupon = (data) => {
  return $http.request({
    url: '/minapp/activity-coupons/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询优惠券模板列表
export const getCouponTemplatePages = (data) => {
  return $http.request({
    url: '/minapp/coupon-templates/pages',
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

// 根据优惠券模板Ids删除优惠券模板
export const deleteCouponTemplate = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/coupon-templates/' + ids,
    method: 'delete'
  });
};

// 添加优惠券模板
export const createCouponTemplate = (data) => {
  return $http.request({
    url: '/minapp/coupon-templates/',
    data,
    method: 'post'
  });
};

// 修改优惠券模板
export const editCouponTemplate = (data) => {
  return $http.request({
    url: '/minapp/coupon-templates/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询分享红包列表
export const getShareRewardPages = (data) => {
  return $http.request({
    url: '/minapp/activity-share-rewards/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据分享红包Ids删除分享红包
export const deleteShareReward = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-share-rewards/' + ids,
    method: 'delete'
  });
};

// 添加分享红包
export const createShareReward = (data) => {
  return $http.request({
    url: '/minapp/activity-share-rewards/',
    data,
    method: 'post'
  });
};

// 修改分享红包
export const editShareReward = (data) => {
  return $http.request({
    url: '/minapp/activity-share-rewards/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询分享红包配置列表
export const getShareRewardSettingPages = (data) => {
  return $http.request({
    url: '/minapp/activity-share-reward-settings/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据分享红包配置Ids删除分享红包配置
export const deleteShareRewardSetting = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-share-reward-settings/' + ids,
    method: 'delete'
  });
};

// 添加分享红包配置
export const createShareRewardSetting = (data) => {
  return $http.request({
    url: '/minapp/activity-share-reward-settings/',
    data,
    method: 'post'
  });
};

// 修改分享红包配置
export const editShareRewardSetting = (data) => {
  return $http.request({
    url: '/minapp/activity-share-reward-settings/' + data.id,
    data,
    method: 'put'
  });
};

// 原先注册送礼后台接口
// 根据条件分页查询注册送礼活动列表
export const getRegisterPages = (data) => {
  return $http.request({
    url: '/minapp/activity-registers/pages',
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

// 根据注册送礼活动Ids删除注册送礼活动
export const deleteRegister = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-registers/' + ids,
    method: 'delete'
  });
};

// 添加注册送礼活动
export const createRegister = (data) => {
  return $http.request({
    url: '/minapp/activity-registers/',
    data,
    method: 'post'
  });
};

// 修改注册送礼活动
export const editRegister = (data) => {
  return $http.request({
    url: '/minapp/activity-registers/' + data.id,
    data,
    method: 'put'
  });
};

// ———————————— 1.6版本注册送礼活动配置 —————————————
// 根据id查询注册送礼活动配置
export const getRegisteredGiftPage = (data) => {
  return $http.request({
    url: '/minapp/activity-register-setting/' + data.id,
    data,
    method: 'get'
  });
};

// 添加注册送礼活动配置 /minapp/activity-register-setting/create
export const createRegisterGift = (data) => {
  return $http.request({
    url: '/minapp/activity-register-setting/create',
    data,
    method: 'post'
  });
};

// 查询注册送礼活动配置分页列表 minapp/activity-register-setting/create
export const getRegisteredGiftPages = (data) => {
  return $http.request({
    url: '/minapp/activity-register-setting/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据id更新注册送礼活动配置 /minapp/activity-register-setting/update/{id}
export const editRegisterGift = (data) => {
  return $http.request({
    url: '/minapp/activity-register-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据ids删除注册送礼活动配置  /minapp/activity-register-setting/{ids}
export const deleteRegisterGift = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-register-setting/' + ids,
    method: 'delete'
  });
};

// 会员中心数据埋点统计 /minapp/data-total 邀请有礼数据统计
export const dataStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/invite/data-total?beginDate=${data.beginDate}&endDate=${data.endDate}&dateGroup=${data.dateGroup}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// minapp/invite/base-total邀请有礼基础数据统计
export const basicsDataStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `/minapp/invite/base-total?beginDate=${data.beginDate}&endDate=${data.endDate}`,
    // url: `/minapp/invite/data-total?beginDate=${data.beginDate}&endDate=${data.endDate}&dateGroup=${data.dateGroup}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// /minapp/invite/user/invite-total 邀请有礼用户数据统计
export const userDataStatistics = (data) => {
  return Vue.prototype.$http.request({
    url: `minapp/invite/user/invite-total?nickName=${data.nickName}&phone=${data.phone}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows,
      'sidx': data.sidx,
      'sort': data.sort
    }
  });
};

// /手动修改手机号绑定海鼎会员ID
export const handPhones = (data) => {
  return $http.request({
    url: `/minapp/user/phone/member-number?oldPhone=${data.oldPhone}&newPhone=${data.newPhone}`,
    method: 'post'
  });
};

// ———————————— 1.7付费会员 —————————————
// 根据id查询付费会员礼包券配置
export const getSvipGift = (data) => {
  return $http.request({
    url: '/minapp/svip-gift-coupon-setting/' + data.id,
    method: 'get'
  });
};
// 添加付费会员礼包券配置
export const createSvipGift = (data) => {
  return $http.request({
    url: '/minapp/svip-gift-coupon-setting/create',
    data,
    method: 'post'
  });
};

// 查询付费会员礼包券配置分页列表
export const getSvipGiftPages = (data) => {
  return $http.request({
    url: '/minapp/svip-gift-coupon-setting/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// {id}根据id更新付费会员礼包券配置
export const editSvipGift = (data) => {
  return $http.request({
    url: '/minapp/svip-gift-coupon-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据ids删除付费会员礼包券配置
export const deleteSvipGift = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/svip-gift-coupon-setting/' + ids,
    method: 'delete'
  });
};

// ———————————— 1.7SVIP套餐 —————————————
// 根据id查询SVIP套餐
export const getSvipPackage = (data) => {
  return $http.request({
    url: '/minapp/svip-package/' + data.id,
    data,
    method: 'get'
  });
};

// 添加SVIP套餐
export const createSvipPackage = (data) => {
  return $http.request({
    url: '/minapp/svip-package/create',
    data,
    method: 'post'
  });
};

// 查询SVIP套餐分页列表
export const getSvipPackagePages = (data) => {
  return $http.request({
    url: '/minapp/svip-package/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据id更新SVIP套餐
export const editSvipPackage = (data) => {
  return $http.request({
    url: '/minapp/svip-package/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据ids删除SVIP套餐
export const deleteSvipPackage = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/svip-package/' + ids,
    method: 'delete'
  });
};

// ————————————   1.7版本 手动发券   —————————————

// 通过phones发放优惠券给对应用户
export const handGrandCoupon = (data) => {
  return $http.request({
    url: `/minapp/coupon-config-manage/send?phones=${data.phones}&id=${data.id}`,
    method: 'post'
  });
};

// 根据id查询优惠券配置管理
export const gitCouponPage = (data) => {
  return $http.request({
    url: '/minapp/coupon-config-manage/' + data.id,
    data,
    method: 'get'
  });
};

// 添添加优惠券配置管理
export const createCouponPage = (data) => {
  return $http.request({
    url: '/minapp/coupon-config-manage/create',
    data,
    method: 'post'
  });
};

// 查询优惠券配置管理分页列表
export const getCouponPagess = (data) => {
  return $http.request({
    url: '/minapp/coupon-config-manage/pages',
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

// 根据id更新优惠券配置管理
export const editCouponPage = (data) => {
  return $http.request({
    url: '/minapp/coupon-config-manage/update/' + data.id,
    data,
    method: 'put'
  });
};

// /minapp/coupon-config-manage/{ids}
// 根据ids删除优惠券配置管理
export const deleteCouponPage = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/coupon-config-manage/' + ids,
    method: 'delete'
  });
};

// 根据条件分页查询注册送礼活动与优惠券关联列表
export const getRegisterRewardPages = (data) => {
  return $http.request({
    url: '/minapp/activity-register-rewards/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据注册送礼活动与优惠券关联Ids删除注册送礼活动与优惠券关联
export const deleteRegisterReward = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-register-rewards/' + ids,
    method: 'delete'
  });
};

// 添加注册送礼活动与优惠券关联
export const createRegisterReward = (data) => {
  return $http.request({
    url: '/minapp/activity-register-rewards/',
    data,
    method: 'post'
  });
};

// 修改注册送礼活动与优惠券关联
export const editRegisterReward = (data) => {
  return $http.request({
    url: '/minapp/activity-register-rewards/' + data.id,
    data,
    method: 'put'
  });
};
// ------------------------------------
// 根据条件分页查询商城小程序订单列表
export const getOrderPages = (data) => {
  return $http.request({
    url: '/minapp/orders/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询跨月订单退款数据 startTime=2019-09-01&endTime=2019-10-01
export const monthOrderPages = (data) => {
  return $http.request({
    url: `/minapp/orders/cross-month-refund/query?startTime=${data.startTime}&endTime=${data.endTime}`,
    method: 'get',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询订单用券信息
export const getOrderCouponDetails = (data) => {
  return $http.request({
    url: '/minapp/orders/coupon-use-info',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据条件分页查询商城小程序详情
export const getOrder = ({
  orderCode
}) => {
  return $http.request({
    url: '/minapp/orders/' + orderCode,
    method: 'get'
  });
};

// 海鼎订单调货  /minapp/orders/{id}/store
export const modifyStoreInOrder = (data) => {
  return $http.request({
    url: '/minapp/orders/' + data.id + '/store' + '?storeId=' + data.newStoreId,
    method: 'put'
  });
};

// 手动发送海鼎
export const resendToHd = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/orders/hd?ids=' + ids,
    method: 'put'
  });
};

// 微商城小程序--订单退货简化版 /minapp/orders/orders/specialRefund/simpe
export const refundWx = ({
  orderCode
}) => {
  return $http.request({
    url: `/minapp/orders/orders/specialRefund/simpe?orderCode=${orderCode}`,
    method: 'post'
  });
};
// 拼团小程序--订单退货简化版 /minapp/orders/orders/refund/simpe
export const refundPt = ({
  orderCode
}) => {
  return $http.request({
    url: `/minapp/orders/orders/refund/simpe?orderCode=${orderCode}`,
    method: 'post'
  });
};
// 根据条件分页查询支付列表
export const getPaymentLogPages = (data) => {
  return $http.request({
    url: '/minapp/payment-logs/pages',
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

// 根据条件分页查询支付日志金额总计
export const getPaymentLogSum = (data) => {
  return $http.request({
    url: '/minapp/payment-logs/fee/sum',
    data,
    method: 'post',
    headers: {
      'data': data.sum
    }
  });
};

// 根据条件分页查询用户反馈列表
export const getFeedbackPages = (data) => {
  return $http.request({
    url: '/minapp/feedbacks/pages',
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

// 修改用户反馈
export const editFeedback = (data) => {
  return $http.request({
    url: '/minapp/feedbacks/' + data.id,
    data,
    method: 'put'
  });
};

// 查询FAQ分类树结构
export const getFaqCategoriesTree = () => {
  return $http.request({
    url: '/minapp/faq-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询FAQ分类信息列表
export const getFaqCategoriesPages = (data) => {
  return $http.request({
    url: '/minapp/faq-categories/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 添加FAQ分类
export const createFaqCategories = (data) => {
  return $http.request({
    url: '/minapp/faq-categories/',
    data,
    method: 'post'
  });
};

// 根据Ids删除FAQ分类
export const deleteFaqCategories = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/faq-categories/' + ids,
    method: 'delete'
  });
};

// 修改FAQ分类
export const editFaqCategories = (data) => {
  return $http.request({
    url: '/minapp/faq-categories/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询FAQ信息列表
export const getFaqPages = (data) => {
  return $http.request({
    url: '/minapp/faqs/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 添加FAQ
export const createFaq = (data) => {
  return $http.request({
    url: '/minapp/faqs/',
    data,
    method: 'post'
  });
};

// 根据Ids删除FAQ
export const deleteFaq = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/faqs/' + ids,
    method: 'delete'
  });
};

// 修改FAQ
export const editFaq = (data) => {
  return $http.request({
    url: '/minapp/faqs/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询广告位列表
export const getAdvertisementPositionPages = (data) => {
  return $http.request({
    url: '/minapp/advertisement-positions/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询广告位详情
export const getAdvertisementPosition = ({
  id
}) => {
  return $http.request({
    url: '/minapp/advertisement-positions/' + id,
    method: 'get'
  });
};

// 添加广告位
export const createAdvertisementPosition = (data) => {
  return $http.request({
    url: '/minapp/advertisement-positions/',
    data,
    method: 'post'
  });
};

// 根据Ids删除广告位
export const deleteAdvertisementPosition = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/advertisement-positions/' + ids,
    method: 'delete'
  });
};

// 修改广告位
export const editAdvertisementPosition = (data) => {
  return $http.request({
    url: '/minapp/advertisement-positions/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询广告列表
export const getAdvertisementPages = (data) => {
  return $http.request({
    url: '/minapp/advertisements/pages',
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

// 查询广告位详情
export const getAdvertisement = (data) => {
  return $http.request({
    url: '/minapp/advertisements/' + data.id + '?flag=' + data.flag,
    method: 'get'
  });
};

// 添加广告
export const createAdvertisement = (data) => {
  return $http.request({
    url: '/minapp/advertisements/',
    data,
    method: 'post'
  });
};

// 根据Ids删除广告
export const deleteAdvertisement = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/advertisements/' + ids,
    method: 'delete'
  });
};

// 修改广告
export const editAdvertisement = (data) => {
  return $http.request({
    url: '/minapp/advertisements/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询邮费模板列表
export const getDeliveryFeeConfigPages = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-configs/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询邮费模板位详情
export const getDeliveryFeeConfig = ({
  id
}) => {
  return $http.request({
    url: '/minapp/delivery-fee-configs/' + id,
    method: 'get'
  });
};

// 添加邮费模板
export const createDeliveryFeeConfig = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-configs/',
    data,
    method: 'post'
  });
};

// 根据Ids删除邮费模板
export const deleteDeliveryFeeConfig = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/delivery-fee-configs/' + ids,
    method: 'delete'
  });
};

// 修改邮费模板
export const editDeliveryFeeConfig = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-configs/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询邮费规则列表
export const getDeliveryFeeConfigRulePages = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-config-rules/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询邮费规则位详情
export const getDeliveryFeeConfigRule = ({
  id
}) => {
  return $http.request({
    url: '/minapp/delivery-fee-config-rules/' + id,
    method: 'get'
  });
};

// 添加邮费规则
export const createDeliveryFeeConfigRule = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-config-rules/',
    data,
    method: 'post'
  });
};

// 根据Ids删除邮费规则
export const deleteDeliveryFeeConfigRule = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/delivery-fee-config-rules/' + ids,
    method: 'delete'
  });
};

// 修改邮费规则
export const editDeliveryFeeConfigRule = (data) => {
  return $http.request({
    url: '/minapp/delivery-fee-config-rules/' + data.id,
    data,
    method: 'put'
  });
};

// 查询系统参数分类树结构
export const getSystemSettingCategoryTree = () => {
  return $http.request({
    url: '/minapp/system-setting-categories/tree',
    method: 'get'
  });
};

// 根据条件分页查询系统参数分类列表
export const getSystemSettingCategoryPages = (data) => {
  return $http.request({
    url: '/minapp/system-setting-categories/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据系统分类code查询系统设置参数
export const getSystemParameter = (code) => {
  return $http.request({
    url: '/minapp/system-setting-categories/find-by/' + code,
    method: 'get'
  });
};

// 查询系统参数分类位详情
export const getSystemSettingCategory = ({
  id
}) => {
  return $http.request({
    url: '/minapp/system-setting-categories/' + id,
    method: 'get'
  });
};

// 添加系统参数分类
export const createSystemSettingCategory = (data) => {
  return $http.request({
    url: '/minapp/system-setting-categories/',
    data,
    method: 'post'
  });
};

// 根据Ids删除系统参数分类
export const deleteSystemSettingCategory = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/system-setting-categories/' + ids,
    method: 'delete'
  });
};

// 修改系统参数分类
export const editSystemSettingCategory = (data) => {
  return $http.request({
    url: '/minapp/system-setting-categories/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询系统参数列表
export const getSystemSettingPages = (data) => {
  return $http.request({
    url: '/minapp/system-settings/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询父级分类 
export const getParentInfos = () => {
  return $http.request({
    url: 'minapp/system-setting-categories/get-parent/infos',
    method: 'get'
  });
};


// 查询系统参数位详情
export const getSystemSetting = ({
  id
}) => {
  return $http.request({
    url: '/minapp/system-settings/' + id,
    method: 'get'
  });
};

// 添加系统参数
export const createSystemSetting = (data) => {
  return $http.request({
    url: '/minapp/system-settings/',
    data,
    method: 'post'
  });
};

// 根据Ids删除系统参数
export const deleteSystemSetting = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/system-settings/' + ids,
    method: 'delete'
  });
};

// 修改系统参数
export const editSystemSetting = (data) => {
  return $http.request({
    url: '/minapp/system-settings/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询充值返利活动列表
export const getRechargePages = (data) => {
  return $http.request({
    url: '/minapp/activity-recharges/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询充值返利活动位详情
export const getRecharge = ({
  id
}) => {
  return $http.request({
    url: '/minapp/activity-recharges/' + id,
    method: 'get'
  });
};

// 添加充值返利活动
export const createRecharge = (data) => {
  return $http.request({
    url: '/minapp/activity-recharges/',
    data,
    method: 'post'
  });
};

// 根据Ids删除充值返利活动
export const deleteRecharge = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-recharges/' + ids,
    method: 'delete'
  });
};

// 修改充值返利活动
export const editRecharge = (data) => {
  return $http.request({
    url: '/minapp/activity-recharges/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询充值返利规则列表
export const getRechargeRulePages = (data) => {
  return $http.request({
    url: '/minapp/activity-recharge-rules/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询充值返利规则位详情
export const getRechargeRule = ({
  id
}) => {
  return $http.request({
    url: '/minapp/activity-recharge-rules/' + id,
    method: 'get'
  });
};

// 添加充值返利规则
export const createRechargeRule = (data) => {
  return $http.request({
    url: '/minapp/activity-recharge-rules/',
    data,
    method: 'post'
  });
};

// 根据Ids删除充值返利规则
export const deleteRechargeRule = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-recharge-rules/' + ids,
    method: 'delete'
  });
};

// 修改充值返利规则
export const editRechargeRule = (data) => {
  return $http.request({
    url: '/minapp/activity-recharge-rules/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询随机立减活动列表
export const getRandomDiscountPages = (data) => {
  return $http.request({
    url: '/minapp/activity-random-discounts/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询随机立减活动位详情
export const getRandomDiscount = ({
  id
}) => {
  return $http.request({
    url: '/minapp/activity-random-discounts/' + id,
    method: 'get'
  });
};

// 添加随机立减活动
export const createRandomDiscount = (data) => {
  return $http.request({
    url: '/minapp/activity-random-discounts/',
    data,
    method: 'post'
  });
};

// 根据Ids删除随机立减活动
export const deleteRandomDiscount = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-random-discounts/' + ids,
    method: 'delete'
  });
};

// 修改随机立减活动
export const editRandomDiscount = (data) => {
  return $http.request({
    url: '/minapp/activity-random-discounts/' + data.id,
    data,
    method: 'put'
  });
};

// 积分兑换优惠券相关接口 CRUD
export const getCouponExchange = ({
  id
}) => {
  return $http.request({
    url: '/minapp/points-exchange-coupon-setting/' + id,
    method: 'get'
  });
};

export const deleteCouponExchange = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/points-exchange-coupon-setting/' + ids,
    method: 'delete'
  });
};

export const createCouponExchange = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-coupon-setting/create',
    data,
    method: 'post'
  });
};

export const editCouponExchange = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-coupon-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询积分兑换优惠券列表
export const getCouponExchangePages = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-coupon-setting/pages',
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

// 积分兑换实物相关接口 CRUD
export const getEntityExchange = ({
  id
}) => {
  return $http.request({
    url: '/minapp/points-exchange-entity-setting/' + id,
    method: 'get'
  });
};

export const deleteEntityExchange = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/points-exchange-entity-setting/' + ids,
    method: 'delete'
  });
};

export const createEntityExchange = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-entity-setting/create',
    data,
    method: 'post'
  });
};

export const editEntityExchange = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-entity-setting/update/' + data.id,
    data,
    method: 'PUT'
  });
};

// 根据条件分页查询积分兑换优惠券列表
export const getEntityExchangePages = (data) => {
  return $http.request({
    url: '/minapp/points-exchange-entity-setting/pages',
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

// 未成团、未发送海鼎、未退款的订单手动退款
export const ordersRefund = ({
  endTime
}) => {
  return $http.request({
    url: '/minapp/order-center/wxsmall/failure/orders/refund/' + endTime,
    method: 'get'
  })
};
// 根据订单id收货 /minapp/orders/receive/{orderId}
export const sureReceive = ({
  orderId
}) => {
  return $http.request({
    url: '/minapp/orders/receive/' + orderId,
    method: 'get'
  });
};
export const sureMaituan = ({
  orderCode
}) => {
  return $http.request({
    url: '/minapp/orders/meituan/send/' + orderCode,
    method: 'post'
  });
};

/* -------------------------
 * 任务管理
 * -------------------------
 */
export const getTaskPages = (data) => {
  return $http.request({
    url: '/minapp/task-center/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const getTaskRecordPages = (data) => {
  return $http.request({
    url: '/minapp/task-operation-record/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteTask = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/task-center/' + ids,
    method: 'delete'
  });
};

export const createTask = (data) => {
  return $http.request({
    url: '/minapp/task-center/create',
    data,
    method: 'post'
  });
};

export const editTask = (data) => {
  return $http.request({
    url: '/minapp/task-center/update/' + data.id,
    data,
    method: 'PUT'
  });
};

/* -------------------------
 * 每日签到奖励配置
 * -------------------------
 */
export const getSignRewardPages = (data) => {
  return $http.request({
    url: '/minapp/everyday-sign-reward/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteSignReward = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/everyday-sign-reward/' + ids,
    method: 'delete'
  });
};

export const createSignReward = (data) => {
  return $http.request({
    url: '/minapp/everyday-sign-reward/create',
    data,
    method: 'post'
  });
};

export const editSignReward = (data) => {
  return $http.request({
    url: '/minapp/everyday-sign-reward/update/' + data.id,
    data,
    method: 'PUT'
  });
};

//获取关键字列表 /minapp/product-keywords/pages
export const getKeywordsPages = (data) => {
  return $http.request({
    url: '/minapp/product-keywords/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

//添加关键词 /minapp/product-keywords/create
export const createKeywords = (data) => {
  return $http.request({
    url: '/minapp/product-keywords/create',
    data,
    method: 'post',
  });
};

//删除关键词 deleteProduct
export const deleteKeywords = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/product-keywords/' + ids,
    method: 'delete'
  });
};

//更新关键词 /minapp/product-keywords/update/{id}
export const updateKeywords = (data) => {
  return $http.request({
    url: '/minapp/product-keywords/update/' + data.id,
    data,
    method: 'put'
  });
};

//板块活动分享设置 /minapp/plate-activity-share-setting/pages
export const getShareSettingPages = (data) => {
  return $http.request({
    url: '/minapp/plate-activity-share-setting/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};
//添加板块活动分享设置 /minapp/plate-activity-share-setting/create
export const createShareSettingPages = (data) => {
  return $http.request({
    url: '/minapp/plate-activity-share-setting/create',
    data,
    method: 'post',
  });
};

//更新板块活动分享设置 /minapp/plate-activity-share-setting/update/
export const updateShareSetting = (data) => {
  return $http.request({
    url: '/minapp/plate-activity-share-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

//删除板块活动分享设置 /minapp/plate-activity-share-setting/
export const deleteShareSetting = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/plate-activity-share-setting/' + ids,
    method: 'delete'
  });
};

//查询新品上市活动列表 /minapp/activity-new-products/pages
export const getNewProductsPages = (data) => {
  return $http.request({
    url: '/minapp/activity-new-products/pages',
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
//添加新品上市活动 /minapp/activity-new-products/create
export const createNewProducts = (data) => {
  return $http.request({
    url: '/minapp/activity-new-products/create',
    data,
    method: 'post',
  });
};

//根据ID 修改新品上市活动 /minapp/activity-new-products/update/{id}
export const updateNewProducts = (data) => {
  return $http.request({
    url: '/minapp/activity-new-products/update/' + data.id,
    data,
    method: 'put'
  });
};
//根据id 删除新品上市活动
export const deleteNewProducts = ({
  ids
}) => {
  return $http.request({
    url: '/minapp/activity-new-products/' + ids,
    method: 'delete'
  });
};

//根据id查询新品上市活动关联 /minapp/activity-new-products/{id}/relation
export const getNewProductsRelevance = (id) => {
  return $http.request({
    url: `/minapp/activity-new-products/${id}/relation`,
    method: 'get'
  });
};

//添加新品上市活动关联 /minapp/activity-new-products/create/relation
export const createNewProductsRelevance = (data) => {
  return $http.request({
    url: '/minapp/activity-new-products/create/relation',
    data,
    method: 'post',
  });
};
//更新新品上市活动关联 /minapp/activity-new-products/update/relation/{id}
export const updateNewProductsRelevance = (data) => {
  return $http.request({
    url: '/minapp/activity-new-products/update/relation/' + data.id,
    data,
    method: 'put'
  });
};

//查询统一活动列表 
export const getUnifyActivityPages = (data) => {
  return $http.request({
    url: '/minapp/activity-setting/pages',
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

//添加统一活动 
export const createUnifyActivity = (data) => {
  return $http.request({
    url: '/minapp/activity-setting/create',
    data,
    method: 'post',
  });
};

//根据ID 修改活动 /minapp/activity-new-products/update/{id}
export const updateUnifyActivity = (data) => {
  return $http.request({
    url: '/minapp/activity-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

//根据id查询统一活动关联 
export const getUnifyActivity = (id) => {
  return $http.request({
    url: `/minapp/activity-setting/${id}/relation`,
    method: 'get'
  });
};

//更新统一活动关联 
export const deleteUnifyActivityRelevance = (data) => {
  return $http.request({
    url: '/minapp/activity-setting-relation/update-status/' + data.id,
    data,
    method: 'put'
  });
};

//添加统一活动关联券
export const createUnifyActivityRelevance = (data) => {
  return $http.request({
    url: '/minapp/activity-setting-relation/create',
    data,
    method: 'post',
  });
};

//添加集字名称 /minapp/collect-word-setting/create
export const createWollectWordRelevance = (data) => {
  return $http.request({
    url: '/minapp/collect-word-setting/create',
    data,
    method: 'post',
  });
};

//更删除统一活动字配置
export const deleteWollectWordRelevance = (data) => {
  return $http.request({
    url: '/minapp/collect-word-setting/' + data.id,
    data,
    method: 'delete'
  });
};
// /minapp/collect-word-setting/update/{id}
export const updateWollectWordRelevance = (data) => {
  return $http.request({
    url: '/minapp/collect-word-setting/update/' + data.id,
    data,
    method: 'put'
  });
};