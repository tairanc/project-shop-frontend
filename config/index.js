'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/trmall":{
        target: 'http://shop.tairanmall.com/trmall/', // /api/users 现在会被代理到请求 http://localhost:3000/api/users
        pathRewrite: { '^/trmall' : '' }, // 如果你不想始终传递 /api ，则需要重写路径 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
        changeOrigin: true, //是否需要改变原始主机头为目标URL
        secure: false//默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器
      },
      "/installment":{
        target: 'http://shop.tairanmall.com/installment/', // /api/users 现在会被代理到请求 http://localhost:3000/api/users
        pathRewrite: { '^/installment' : '' }, // 如果你不想始终传递 /api ，则需要重写路径 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
        changeOrigin: true, //是否需要改变原始主机头为目标URL
        secure: false//默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8899, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
