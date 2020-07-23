import Vue from 'vue';
const $http = Vue.prototype.$http;
const $imgService = Vue.prototype.$imgService;
const $imsService = Vue.prototype.$imsService;

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
 * 商品分类管理
 * -------------------------
 */
// 查询商品分类树结构
export const getProductCategoriesTree = () => {
  return $http.request({
    url: '/lhfarm-small/goods-category/tree',
    method: 'get'
  });
};

// 根据条件分页查询商品分类信息列表
export const getProductCategoriesPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-category/pages',
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
    url: '/lhfarm-small/goods-category/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品分类
export const delProductCategories = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/goods-category/' + ids,
    method: 'delete'
  });
};

// 修改商品分类
export const editProductCategories = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-category/update/' + data.id,
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
    url: '/lhfarm-small/goods-unit/pages',
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
    url: '/lhfarm-small/goods-unit/getGoodsUnitAll',
    method: 'get'
  });
};

// 添加商品单位
export const createProductUnits = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-unit/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除商品单位
export const delProductUnits = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/goods-unit/' + ids,
    method: 'delete'
  });
};

// 修改商品单位
export const editProductUnits = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-unit/update/' + data.id,
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
    url: '/lhfarm-small/goods/pages',
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
    url: '/lhfarm-small/goods/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getProduct = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/goods/' + id,
    method: 'get'
  });
};

// 修改商品
export const editProduct = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加商品
export const createProduct = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods/create',
    data,
    method: 'post'
  });
};

/* -------------------------
 * 新品需求管理
 * -------------------------
 */
// 根据条件分页查询商品信息列表
export const getDemandGoodsPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/demand-goods/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 根据商品Ids删除商品
export const deleteDemandGoods = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/demand-goods/' + ids,
    method: 'delete'
  });
};

// 根据Id查找商品
export const getDemandGoods = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/demand-goods/' + id,
    method: 'get'
  });
};

// 修改商品
export const editDemandGoods = (data) => {
  return $http.request({
    url: '/lhfarm-small/demand-goods/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加商品
export const createDemandGoods = (data) => {
  return $http.request({
    url: '/lhfarm-small/demand-goods/create',
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
    url: '/lhfarm-small/goods-keywords/pages',
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
    url: '/lhfarm-small/goods-keywords/' + ids,
    method: 'delete'
  });
};

// 根据Id查找关键字
export const getKeywords = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/goods-keywords/' + id,
    method: 'get'
  });
};

// 修改关键字
export const editKeywords = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-keywords/update/' + data.id,
    data,
    method: 'put'
  });
};

// 添加关键字
export const createKeywords = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-keywords/create',
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
    url: '/lhfarm-small/plate-category/pages',
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
    url: '/lhfarm-small/plate-category/' + ids,
    method: 'delete'
  });
};

// 根据板块Ids判断当前分类信息是否可以删除
export const deleteProductSectionValidation = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/plate-category/whetherdelete/' + ids,
    method: 'get'
  });
};

// 添加板块
export const createProductSection = (data) => {
  return $http.request({
    url: '/lhfarm-small/plate-category/create',
    data,
    method: 'post'
  });
};

//  修改板块
export const editProductSection = (data) => {
  return $http.request({
    url: '/lhfarm-small/plate-category/update/' + data.id,
    data,
    method: 'put'
  });
};

// 查询商品分类树结构
export const getProductSectionTree = () => {
  return $http.request({
    url: '/lhfarm-small/plate-category/tree',
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
    url: '/lhfarm-small/plate-goods/' + id,
    method: 'get'
  });
};

// 根据条件分页查询板块和商品关联信息列表
export const getProductSectionRelationPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/plate-goods/pages',
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
    url: '/lhfarm-small/plate-goods/creates',
    data,
    method: 'post'
  });
};

// 根据商品板块Ids删除板块和商品的关联
export const deleteProductSectionRelation = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/plate-goods/' + ids,
    method: 'delete'
  });
};

// 批量修改板块和商品的关联
export const editProductSectionRelation = (data) => {
  return $http.request({
    url: '/lhfarm-small/plate-goods/updates',
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
    url: '/lhfarm-small/goods-standard/standard/' + id,
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
    url: '/lhfarm-small/goods-standard/update/' + data.id,
    data,
    method: 'post'
  });
};

// 根据条件分页查询商品规格信息列表
export const getProductStandardsPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-standard/pages',
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
    url: '/lhfarm-small/goods-standard/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createProductStandard = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-standard/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editProductStandard = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-standard/update/' + data.id,
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
    url: '/lhfarm-small/goods-price-region/pages',
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
    url: '/lhfarm-small/goods-price-region/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createGoodsPriceRegion = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-price-region/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editGoodsPriceRegion = (data) => {
  return $http.request({
    url: '/lhfarm-small/goods-price-region/update/' + data.id,
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
    url: '/lhfarm-small/user/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const getUserAnalysisPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/user-analys',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const getPerformancePages = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/sales/performance',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
}

export const getPerformanceShopPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/sales/performance-shop',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
}

// 门店转让
export const storeAssign = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/sales/assgin/shop',
    data,
    method: 'post'
  });
}

// 查询所有业务员
export const getAllSalesman = () => {
  return $http.request({
    url: '/lhfarm-small/user/sales-users',
    method: 'get'
  });
}

export const deleteUser = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/user/' + ids,
    method: 'delete'
  });
};

export const createUser = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/create',
    data,
    method: 'post'
  });
};

export const editUser = (data) => {
  return $http.request({
    url: '/lhfarm-small/user/update/' + data.id,
    data,
    method: 'put'
  });
};

// 审核业务员
export const auditUser = (data) => {
  return $http.request({
    url: `/lhfarm-small/user/check/${data.id}?checkStatus=${data.checkStatus}`,
    method: 'post'
  });
};
// 会员类型切换
export const changeUser = (data) => {
  return $http.request({
    url: `/lhfarm-small/user/change/user-type/${data.id}?userType=${data.userType}`,
    method: 'put'
  });
};
/* -------------------------
 * 订单管理
 * -------------------------
 */
export const getOrderPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/order/pages',
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
// 售后订单
export const getAfterSalePages = (data) => {
  return $http.request({
    url: '/lhfarm-small/post-sale/pages',
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
// /lhfarm-small/post-sale/review/pages 财务审核列表
export const getFinanceAuditPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/post-sale/review/pages',
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
//确认收货
export const confirmReceipt = (data) => {
  return $http.request({
    url: '/lhfarm-small/order/received/' + data.orderCode,
    data,
    method: 'put'
  });
};
//添加快递单号
export const putCourierCode = (data) => {
  return $http.request({
    url: '/lhfarm-small/order/update/' + data.id,
    data,
    method: 'put'
  });
};

// id查看售后订单
export const getOrderDetail = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/post-sale/' + id,
    method: 'get'
  });
};

// 完成订单
export const getSaleFinish = (data) => {
  return $http.request({
    url: `/lhfarm-small/post-sale/audit/finish/${data.id}`,
    data,
    method: 'post'
  });
};

// 财务审核通过
export const getFinanceAudit = (data) => {
  return $http.request({
    url: `/lhfarm-small/post-sale/review/pass/${data.id}`,
    data,
    method: 'post'
  });
};
// 财务审核拒绝
export const getFinanceRefuse = (data) => {
  return $http.request({
    url: `/lhfarm-small/post-sale/review/reject/${data.id}`,
    data,
    method: 'post'
  });
};

// 导出售后商品
export const getOrderGoods = (data) => {
  return $imsService.request({
    url: `/lhfarm-small/post-sale/export/${data.name}`,
    method: 'post',
    data: data,
    headers: {
      'rows': -1,
    }
  });
};

// 通过审核
export const getPassAudit = (data) => {
  return $http.request({
    url: '/lhfarm-small/post-sale/audit/pass',
    data,
    method: 'post'
  });
};

// 审核拒绝
export const getRefuseAudit = (data) => {
  return $http.request({
    url: '/lhfarm-small/post-sale/audit/reject',
    data,
    method: 'post'
  });
};

export const getPaymentLogPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/payment-log/pages',
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

export const getrefundLogPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/refund-log/pages',
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
export const getOrderGoodsToday = (data) => {
  return $http.request({
    url: '/lhfarm-small/order/order-goods-today',
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
    url: '/lhfarm-small/order/' + id,
    method: 'get'
  });
};
// lhfarm-small/order/print/order
export const getPrintOrder = (data) => {
  return $http.request({
    url: '/lhfarm-small/order/print/order',
    data,
    method: 'post'
  });
};
// 无前端页面的通用后台导出API
export const exportOrder = (data) => {
  return $http.request({
    url: '/lhfarm-small/export/' + data.exportType,
    data: data.searchParam,
    method: 'post'
  });
};
// /lhfarm-small/export/cloumns/{exportType}
export const exporGoodsStandard = (data) => {
  return $http.request({
    url: '/lhfarm-small/export/cloumns/' + data.exportType,
    method: 'get'
  });
};
// 手动发送海鼎
export const sendHdManual = ({ orderCode }) => {
  return $http.request({
    url: '/lhfarm-small/order/send-to-sock?orderCode=' + orderCode,
    method: 'put'
  });
};

/* -------------------------
 * 活动管理
 * -------------------------
 */
// 根据条件分页查询活动信息列表
export const getActivityPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/activity/pages',
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

export const deletActivity = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/activity/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createActivity = (data) => {
  return $http.request({
    url: '/lhfarm-small/activity/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editActivity = (data) => {
  return $http.request({
    url: '/lhfarm-small/activity/update/' + data.id,
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
    url: '/lhfarm-small/coupon-plate/pages',
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
    url: '/lhfarm-small/coupon-plate/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createCouponTemplate = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-plate/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editCouponTemplate = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-plate/update/' + data.id,
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
    url: '/lhfarm-small/coupon-entity/pages',
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

// 手动发放优惠券
export const sendCouponByPhones = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-entity/coupon-config-manage/send',
    data,
    method: 'post'
  });
}

export const deletCoupon = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/coupon-entity/' + ids,
    method: 'delete'
  });
};

// 添加商品规格
export const createCoupon = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-entity/create',
    data,
    method: 'post'
  });
};

// 修改商品规格
export const editCoupon = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-entity/update/' + data.id,
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
    url: '/lhfarm-small/coupon-config/pages',
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
    url: '/lhfarm-small/coupon-config/' + ids,
    method: 'delete'
  });
};

export const createCouponConfig = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-config/create',
    data,
    method: 'post'
  });
};

export const editCouponConfig = (data) => {
  return $http.request({
    url: '/lhfarm-small/coupon-config/update/' + data.id,
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
    url: '/lhfarm-small/reward-config/pages',
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
    url: '/lhfarm-small/reward-config/' + ids,
    method: 'delete'
  });
};

export const createRewardConfig = (data) => {
  return $http.request({
    url: '/lhfarm-small/reward-config/create',
    data,
    method: 'post'
  });
};

export const editRewardConfig = (data) => {
  return $http.request({
    url: '/lhfarm-small/reward-config/update/' + data.id,
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
    url: '/lhfarm-small/flashsale-goods/pages',
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
    url: '/lhfarm-small/flashsale-goods/' + ids,
    method: 'delete'
  });
};

export const createFlashsaleGoods = (data) => {
  return $http.request({
    url: '/lhfarm-small/flashsale-goods/create',
    data,
    method: 'post'
  });
};

export const editFlashsaleGoods = (data) => {
  return $http.request({
    url: '/lhfarm-small/flashsale-goods/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 广告位管理
 * -------------------------
 */
export const getAdvertisementPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/advertisement/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

export const deleteAdvertisement = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/advertisement/' + ids,
    method: 'delete'
  });
};

export const createAdvertisement = (data) => {
  return $http.request({
    url: '/lhfarm-small/advertisement/create',
    data,
    method: 'post'
  });
};

export const editAdvertisement = (data) => {
  return $http.request({
    url: '/lhfarm-small/advertisement/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 常见问题分类管理
 * -------------------------
 */
// 查询FAQ分类树结构
export const getFaqCategoriesTree = () => {
  return $http.request({
    url: '/lhfarm-small/faq-category/tree',
    method: 'get'
  });
};

// 根据条件分页查询FAQ分类信息列表
export const getFaqCategoriesPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/faq-category/pages',
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
    url: '/lhfarm-small/faq-category/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除FAQ分类
export const deleteFaqCategories = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/faq-category/' + ids,
    method: 'delete'
  });
};

// 修改FAQ分类
export const editFaqCategories = (data) => {
  return $http.request({
    url: '/lhfarm-small/faq-category/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 常见问题管理
 * -------------------------
 */
// 根据条件分页查询FAQ信息列表
export const getFaqPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/faq/pages',
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
    url: '/lhfarm-small/faq/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除FAQ
export const deleteFaq = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/faq/' + ids,
    method: 'delete'
  });
};

// 修改FAQ
export const editFaq = (data) => {
  return $http.request({
    url: '/lhfarm-small/faq/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 文章管理
 * -------------------------
 */
export const getArticlesPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/article/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 添加FAQ
export const createArticle = (data) => {
  return $http.request({
    url: '/lhfarm-small/article/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除FAQ
export const deleteArticle = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/article/' + ids,
    method: 'delete'
  });
};

// 修改FAQ
export const editArticle = (data) => {
  return $http.request({
    url: '/lhfarm-small/article/update/' + data.id,
    data,
    method: 'put'
  });
};

export const getArticle = ({ id }) => {
  return $http.request({
    url: '/lhfarm-small/article/' + id,
    method: 'get'
  });
};

/* -------------------------
 * 邮费管理
 * -------------------------
 */
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
    url: '/minapp/delivery-fee-configs/update' + data.id,
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
    url: '/minapp/delivery-fee-config-rules/update' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 系统参数分类管理
 * -------------------------
 */
// 查询系统参数分类树结构
export const getSystemSettingCategoryTree = () => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/tree',
    method: 'get'
  });
};

// 根据条件分页查询系统参数分类列表
export const getSystemSettingCategoryPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/pages',
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
    url: '/lhfarm-small/system-setting-category/find-by/' + code,
    method: 'get'
  });
};

// 查询系统参数分类位详情
export const getSystemSettingCategory = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/' + id,
    method: 'get'
  });
};

// 添加系统参数分类
export const createSystemSettingCategory = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除系统参数分类
export const deleteSystemSettingCategory = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/' + ids,
    method: 'delete'
  });
};

// 修改系统参数分类
export const editSystemSettingCategory = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting-category/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 系统参数管理
 * -------------------------
 */
// 根据条件分页查询系统参数列表
export const getSystemSettingPages = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting/pages',
    data,
    method: 'post',
    headers: {
      'page': data.page,
      'rows': data.rows
    }
  });
};

// 查询系统参数位详情
export const getSystemSetting = ({
  id
}) => {
  return $http.request({
    url: '/lhfarm-small/system-setting/' + id,
    method: 'get'
  });
};

// 添加系统参数
export const createSystemSetting = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting/create',
    data,
    method: 'post'
  });
};

// 根据Ids删除系统参数
export const deleteSystemSetting = ({
  ids
}) => {
  return $http.request({
    url: '/lhfarm-small/system-setting/' + ids,
    method: 'delete'
  });
};

// 修改系统参数
export const editSystemSetting = (data) => {
  return $http.request({
    url: '/lhfarm-small/system-setting/update/' + data.id,
    data,
    method: 'put'
  });
};

/* -------------------------
 * 数据统计相关
 * -------------------------
 */
export const getAnalysisDatas = (data) => {
  return $http.request({
    url: '/lhfarm-small/data/statistics',
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

// 解锁业务员
export const unlockSalesman = (data) => {
  return $http.request({
    url: `/lhfarm-small/user/unlock-user/${data.id}?userStatus=${data.userStatus}`,
    data,
    method: 'put'
  });
};

