
'use strict';
module.exports = {
  proxy: {
    '/api': {
      // target: 'http://172.16.0.111:10005/',
      target: 'http://39.107.252.186:10005/',  //阿里云地址（正式）
      // target: 'http://218.17.39.178:2036/',       //微品云（开发）
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
