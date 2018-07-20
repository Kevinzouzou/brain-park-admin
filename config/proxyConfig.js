'use strict';
import publicURL from './urlConfig';
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