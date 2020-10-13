const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = ['production'].includes(process.env.NODE_ENV);
const BASE_URL = IS_PROD ? '/lhiot-admin/' : '/';

module.exports = {
  publicPath: BASE_URL,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    //修复 HMR(热更新)失效
    config.resolve.symlinks(true);
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
      .set('assets', resolve('src/assets'))
      .set('views', resolve('src/views'))
      .set('store', resolve('src/store'))
      .set('mixins', resolve('src/mixins'))
      .set('util', resolve('src/util'))
      .set('filters', resolve('src/filters'));

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()

          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    port: 80, // 端口号
    // host: 'localhost', // 本地，打包选这个
    disableHostCheck: true,
    host: '192.168.1.169', // 本地ip，方便其他人通过ip访问 
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: {
      '/api': {
        target: 'http://172.16.10.194:1311/ims-service-v1-5-0', //194测试环境 196开发环境 203 pre环境 http://172.16.10.203:1311/ims-service-v1-5-0
        ws: true,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: 'app.[hash]'
        }
      },
      sass: {
        prependData: '@import "@/assets/styles/style.scss";'
      }
    },
    extract: process.env.NODE_ENV === 'production',
    sourceMap: false,
    extract: false
  }
};
