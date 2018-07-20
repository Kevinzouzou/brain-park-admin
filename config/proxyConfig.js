'use strict';
module.exports = {
  proxy: {
    '/api': {
      // target: 'https://shbeta.vpclub.cn/api10005/',  //新阿里云
      target: 'https://yqdndev.vpclub.cn/api10005/', //阿里云(开发)
      // target: 'https://172.16.0.111:10005/', //本地
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}