const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/lhiot-admin' :
  '/';

module.exports = {
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
      .set('assets', resolve('src/assets'))
      .set('views', resolve('src/views'))
      .set('store', resolve('src/store'))
      .set('mixins', resolve('src/mixins'))
      .set('util', resolve('src/util'))
      .set('filters', resolve('src/filters'));   
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // port: 80, // 端口号
    // host: '192.168.1.154',
    // https: false, // https:{type:Boolean}
    // open: true, // 配置自动启动浏览器
    // proxy: {
    //   '/api': {
    //     target: 'https://testhealth.food-see.com',
    //     ws: true,
    //     logLevel: 'debug',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  css: {
    modules: false,
    loaderOptions: {
      css: {
        localIdentName: 'app.[hash]',
        camelCase: false
      },
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: '@import "@/assets/styles/style.scss";'
      }
    },
    extract: process.env.NODE_ENV === 'production',
    sourceMap: false
  }
};
