'use strict';
const publicURL = require('./urlConfig');
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