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

// 根据条件分页查询商品上架信息列表
export const getProductShelvesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/pages',
    data,
    method: 'post'
  });
};

// 根据商品上架Ids删除商品上架
export const deleteProductShelve = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/' + ids,
    method: 'delete'
  });
};

// 添加商品上架
export const createProductShelve = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/',
    data,
    method: 'post'
  });
};

// 修改商品上架
export const editProductShelve = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/' + data.id,
    data,
    method: 'put'
  });
};

// 根据Id查找商品上架
export const getProductShelve = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/product-shelves/' + id,
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
    url: '/ui-positions/' + id,
    method: 'get'
  });
};

// 根据条件分页查询广告信息列表
export const getAdvertisementsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/pages',
    data,
    method: 'post'
  });
};

// 添加广告
export const createAdvertisement = (data) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/',
    data,
    method: 'post'
  });
};

// 根据广告Ids删除广告
export const deleteAdvertisement = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/' + ids,
    method: 'delete'
  });
};

// 修改广告
export const editAdvertisement = (data) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/' + data.id,
    data,
    method: 'put'
  });
};

// 根据Id查找广告
export const getAdvertisement = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/advertisements/' + id,
    method: 'get'
  });
};

// 根据条件分页查询商品版块信息列表
export const getProductSectionsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/pages',
    data,
    method: 'post'
  });
};

// 根据商品Ids删除商品版块
export const deleteProductSection = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/' + ids,
    method: 'delete'
  });
};

// 添加商品版块(包括添加商品关联关系)
export const createProductSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/',
    data,
    method: 'post'
  });
};

// 修改商品版块
export const editProductSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/'+data.id,
    data,
    method: 'put'
  });
};

// 新增商品和板块的关联
export const addProductSectionRelationBatch = (data) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/relation',
    data,
    method: 'post'
  });
};

// 根据关联id删除商品和板块关联
export const deleteProductSectionRelationBatch = ({sectionId, shelfIds}) => {
  return Vue.prototype.$http.request({
    url: '/product-sections/relation/batches?sectionId='+sectionId+'&shelfIds='+shelfIds,
    method: 'delete'
  });
};

// 根据条件分页查询定制板块信息列表
export const getCustomPlanSectionsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections/pages',
    data,
    method: 'post'
  });
};

// 根据条件分页查询定制计划信息列表
export const getCustomPlanPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans/pages',
    data,
    method: 'post'
  });
};

// 添加定制板块
export const createCustomPlanSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections',
    data,
    method: 'post'
  });
};

// 修改定制板块
export const editCustomPlanSection = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections/'+data.id,
    data,
    method: 'put'
  });
};

// 根据ids删除定制板块
export const deletetCustomPlanSection = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections/'+ids,
    method: 'delete'
  });
};

// 添加定制版块与定制计划关系
export const addCustomPlanSectionRelationBatch = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections/relation',
    data,
    method: 'post'
  });
};

// 批量删除定制版块与定制计划架关系
export const deletetCustomPlanSectionRelationBatch = ({sectionId, planIds}) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-sections/relation/batches?sectionId='+sectionId+'&planIds='+planIds,
    method: 'delete'
  });
};

// 查询用户分页列表
export const getUserPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/users/pages',
    data,
    method: 'post'
  });
};

// 修改用户锁状态
export const editUser = (data) => {
  return Vue.prototype.$http.request({
    url: '/users/'+data.id+'/locked-status?lockStatus='+data.lockStatus,
    data,
    method: 'put'
  });
};

// 根据条件分页查询鲜果师申请记录列表
export const getFruitDoctorsQualificationsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/qualifications/pages',
    data,
    method: 'post'
  });
};

// 根据id更新鲜果师申请记录
export const editFruitDoctorsQualification = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/qualifications/'+data.id,
    data,
    method: 'put'
  });
};

// 查询鲜果师成员分页列表
export const getFruitDoctorsSettlementPagesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/settlement/pages',
    data,
    method: 'post'
  });
};

// 结算申请修改
export const editFruitDoctorsSettlement = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/settlement/'+data.id,
    data,
    method: 'put'
  });
};

// 查询鲜果师成员分页列表
export const getFruitDoctorsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/pages',
    data,
    method: 'post'
  });
};

// 修改鲜果师成员信息
export const editFruitDoctor = (data) => {
  return Vue.prototype.$http.request({
    url: '/fruit-doctors/'+data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询文章信息列表
export const getArticlesPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/articles/pages',
    data,
    method: 'post'
  });
};

// 添加文章
export const createArticle = (data) => {
  return Vue.prototype.$http.request({
    url: '/articles',
    data,
    method: 'post'
  });
};

// 根据Id删除文章
export const deleteArticle = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/articles/'+ids,
    method: 'delete'
  });
};

// 修改文章
export const editArticle = (data) => {
  return Vue.prototype.$http.request({
    url: '/articles/'+data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页获取订单列表
export const getOrdersPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/orders/pages/',
    data,
    method: 'post'
  });
};

// 根据订单code查询订单详情
export const getOrderDetail = ({code}) => {
  return Vue.prototype.$http.request({
    url: '/orders/'+code,
    method: 'get'
  });
};

// 海鼎订单调货
export const transferHdOrder = (data) => {
  return Vue.prototype.$http.request({
    url: '/orders/'+data.code+'/store?storeId='+data.storeId,
    method: 'put'
  });
};

// 根据位置查询门店所有列表根据距离排序
export const getStore = () => {
  return Vue.prototype.$http.request({
    url: '/stores/pages',
    data: {applicationType: 'HEALTH_GOOD'},
    method: 'post'
  });
};

// 根据条件分页查询定制订单信息列表
export const getCustomOrdersPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-orders/pages',
    data,
    method: 'post'
  });
};

// 查询定制计划规格基础数据分页列表
export const getcustomPlanSpecificationStandardsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-specification-standards/pages',
    data,
    method: 'post'
  });
};

// 根据orderCode查询定制订单信息
export const getcustomOrders = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/custom-orders/'+id,
    method: 'get'
  });
};

// 根据条件分页查询新品尝鲜活动商品信息列表
export const getActivityProductsPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/activity-products/pages',
    data,
    method: 'post'
  });
};

// 根据ids删除新品尝鲜活动商品
export const deleteActivityProduct = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/activity-products/'+ids,
    method: 'delete'
  });
};

// 添加新品尝鲜活动商品
export const addActivityProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/activity-products/',
    data,
    method: 'post'
  });
};

// 修改新品尝鲜活动商品
export const editActivityProduct = (data) => {
  return Vue.prototype.$http.request({
    url: '/activity-products/'+data.id,
    data,
    method: 'put'
  });
};

// 后台管理查询配送费规则列表
export const getDeliveryFeeRulePages = (data) => {
  return Vue.prototype.$http.request({
    url: '/delivery-fee-rule/pages/',
    data,
    method: 'post'
  });
};

// 添加配送费计算规则
export const createDeliveryFeeRule = (data) => {
  return Vue.prototype.$http.request({
    url: '/delivery-fee-rule',
    data,
    method: 'post'
  });
};

// 根据配送费规则模板Id删除
export const deleteDeliveryFeeRule = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/delivery-fee-rule/'+ids,
    method: 'delete'
  });
};

// 修改配送费计算规则
export const editDeliveryFeeRule = (data) => {
  return Vue.prototype.$http.request({
    url: '/delivery-fee-rule/'+data.id,
    data,
    method: 'put'
  });
};

// 根据条件分页查询定制计划信息列表
export const getCustomPlansPages = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans/pages/',
    data,
    method: 'post'
  });
};

// 根据ids删除定制计划
export const deleteCustomPlan = ({ids}) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans/'+ids,
    method: 'delete'
  });
};

// 添加定制计划
export const createCustomPlan = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans',
    data,
    method: 'post'
  });
};

// 定制计划详细信息
export const getCustomPlan = ({id}) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans/'+id,
    method: 'get'
  });
};

// 修改定制计划
export const editCustomPlan = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plans/'+data.id,
    data,
    method: 'put'
  });
};

// {id}修改定制计划商品
export const editCustomPlanProducts = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-products/'+data.id,
    data,
    method: 'put'
  });
};

// {id}修改定制计划规格
export const editCustomPlanSpecifications = (data) => {
  return Vue.prototype.$http.request({
    url: '/custom-plan-specification/'+data.id,
    data,
    method: 'put'
  });
};
