import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
// import {post,fetch,patch,put} from './utils/http'
import echarts from "echarts"
import {
    post,
    get,
    patch,
    put,
    del
} from './utils/http'

import '../static/ueditor/ueditor.config'
import '../static/ueditor/ueditor.all.min'
import '../static/ueditor/lang/zh-cn/zh-cn'
import '../static/ueditor/ueditor.parse.min'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;
Vue.prototype.$del = del;

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.use(VueQuillEditor)
const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        sessionStorage.removeItem('token');
    }
    let token = sessionStorage.getItem('token');
    if (!token && to.path != '/') {
        next({
            path: '/', //登录
        })
    } else {
        next()
    }
})

// router.afterEach(transition => {
// NProgress.done();
// });

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')