import axios from 'axios';
import {
    Message
} from 'element-ui';
import qs from 'qs'

axios.defaults.timeout = 10000;

// axios.defaults.baseURL ='https://shbeta.vpclub.cn/api10005';  //新阿里云
// axios.defaults.baseURL = 'http://218.17.39.178:2040'; //微品云（开发）
axios.defaults.baseURL = 'https://yqdndev.vpclub.cn/api10005/'; //阿里云(开发)
// axios.defaults.baseURL = 'http://192.168.2.214:2040/'; // other
// axios.defaults.baseURL ='http://39.107.252.186:10005';  //阿里云地址（正式）
// axios.defaults.baseURL ='http://192.168.7.109:2040';  //another
// axios.defaults.baseURL ='http://172.16.0.7:2040';  //本地

//http request 拦截器
axios.interceptors.request.use(
    config => {
        // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json'
            // 'Content-Type':'application/x-www-form-urlencoded'
        }
        // if(token){
        //   config.params = {'token':token}
        // }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: "/login",
                querry: {
                    redirect: router.currentRoute.fullPath
                } //从哪个页面跳转
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                resolve(response.data.responseList);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    // export function put(url,params = {}){
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            // axios.put(url,{
            //     params:params
            // })
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

// export function del(url,data = {}){
export function del(url, params = {}) {
    return new Promise((resolve, reject) => {
        // axios.delete(url,data)
        axios.delete(url, {
                params: params
            })
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}