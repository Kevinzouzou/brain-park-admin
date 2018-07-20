'use strict';
// import publicURL from './urlConfig';
let publicURL = require('./urlConfig');
module.exports = {
  proxy: {
    '/api': {
      target: publicURL.URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}