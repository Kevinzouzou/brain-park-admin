import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
// import Page4 from './views/nav2/Page4.vue'
// import Page5 from './views/nav2/Page5.vue'
// import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

import operaSitua from './views/operaSer/operaSitua.vue'
import circle from './views/operaSer/circle.vue'
import topic from './views/operaSer/topic.vue'
import adConfig from './views/operaSer/adConfig.vue'
import pushConfig from './views/operaSer/pushConfig.vue'
import financialSer from './views/operaSer/financialSer.vue'
import merchants from './views/operaSer/merchants.vue'
import information from './views/operaSer/information.vue'
import userFeedback from './views/operaSer/userFeedback.vue'

import serEffect from './views/employers/serEffect.vue'
import corporationHome from './views/employers/corporationHome.vue'
import businessProcess from './views/employers/businessProcess.vue'
import leaseContract from './views/employers/leaseContract.vue'

Vue.use(Router)
let routes = [
    // {
    //     path: '/login',
    //     component: Login,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '*',
        hidden: true,
        // redirect: { path: '/circle' }
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: Home,
        redirect:'/circle',
        name: '运营服务',
        iconCls: 'fa fa-id-card-o',
        children: [
            // { path: '/operaSitua', component: operaSitua, name: '运营概况' },
            { path: 'circle', component: circle, name: '圈子' },
            { path: '/topic', component: topic, name: '话题' },
            { path: '/adConfig', component: adConfig, name: '广告配置' },
            // { path: '/pushConfig', component: pushConfig, name: '推送配置' },
            { path: '/financialSer', component: financialSer, name: '金融服务' },
            // { path: '/merchants', component: merchants, name: '商家联盟' },
            { path: '/userFeedback', component: userFeedback, name: '用户反馈处理' },
            { path: '/information', component: information, name: '信息公告' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '企业服务',
        iconCls: 'fa fa-address-card',
        children: [
            // { path: '/serEffect', component: serEffect, name: '服务效能概况' },
            { path: '/corporationHome', component: corporationHome, name: '企业之家' },
            { path: '/businessProcess', component: businessProcess, name: '流程业务' },
            // { path: '/leaseContract', component: leaseContract, name: '租赁合同管理' }
        ]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    }

];

export default routes;