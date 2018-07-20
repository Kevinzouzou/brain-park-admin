'use strict';
import publicURL from './urlConfig';
module.exports = {
  proxy: {
    '/api': {
      // target: 'http://172.16.0.111:10005/',
      // target: 'http://39.107.252.186:10005/',  //阿里云地址（正式） 
      // target: 'https://shbeta.vpclub.cn/api10005/',  //新阿里云
      target: publicURL.target, //阿里云(开发)
      // target: 'http://192.168.2.214:2040/', // other
      // target: 'http://218.17.39.178:2040/', //微品云（开发）
      // target: 'http://192.168.7.109:2040/',       //another
      // target: 'http://172.16.0.7:2040/',       //本地
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}