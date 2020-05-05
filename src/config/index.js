export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径 /api
   */
  baseUrl: {
    dev: '/api',
    pro: process.env.VUE_APP_BASE_API
  },
  /**
   * @description 图片资源请求基础路径
   */
    /**
   * @description 图片资源请求基础路径  正式http://172.16.10.185:8082 测试 http://test-resource.food-see.com  
   */

  imgUploadUrl: 'http://172.16.10.185:8082',
  /**
   * @description 绿航集团旗下品牌 水果熟了 / 万翼果联-min_app 恰果果-qgg 绿航果业-lv_hang 跟图片资源请求配套使用
   */
  brandType: 'min_app'
};
