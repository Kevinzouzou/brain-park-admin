
'use strict';
module.exports = {
  proxy: {
    '/api': {
      // target: 'http://172.16.0.111:10005/',
      // target: 'http://39.107.252.186:10005/',
      target: 'http://218.17.39.178:2036/',    //测试
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
