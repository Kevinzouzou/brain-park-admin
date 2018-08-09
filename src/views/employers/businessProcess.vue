<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="入驻申请" name="first">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="enterFilters">
                        <el-form-item>
                            <div class="block">
                                <el-date-picker v-model="enterFilters.timeValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd HH:mm:ss"
                                    :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="enterFilters.searchTitle" placeholder="公司名称搜索" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getQueryInApply">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="getInApply">全部</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="processed">已完结</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" @click="pending">未完结</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="inApplyList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="Loading" style="width: 100%;">
                    <el-table-column type="index" width="60" label="序号">
                    </el-table-column>
                    <el-table-column prop="addInfo.companyName" label="公司名称">
                    </el-table-column>
                    <el-table-column prop="addInfo.industry" label="所属行业">
                    </el-table-column>
                    <el-table-column prop="addInfo.contact" label="联系人">
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间">
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.stage === '未完结'" class="unfinished">未完结</span>
                            <span v-else-if="scope.row.stage === '已完结'" class="finished">已完结</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="addInfo.flows[0].name" label="管理人">
                    </el-table-column>
                    <el-table-column prop="addInfo.flows[1].name" label="对接人">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="inApplyView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="highActSizeChange" @current-change="inApplyCurChange" :page-sizes="[8,10,20,50]"
                        :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="inApplyList.length" :current-page="page"
                        style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog title="入驻申请" :visible.sync="viewVisible">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="申请时间：">
                                    {{detailList.time || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="状态：">
                                    <span v-if="detailList.stage === '未完结'" class="unfinished" style="padding: 0px 15px;line-height: 30px;">未完结</span>
                                    <span v-else-if="detailList.stage === '已完结'" class="finished" style="padding: 0px 15px;line-height: 30px;">已完结</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="企业名称：">
                                    {{detailList.addInfo.companyName || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业行业：">
                                    {{detailList.addInfo.industry || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="联系人：">
                                    {{detailList.addInfo.contact || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式：">
                                    {{detailList.addInfo.phone || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="入驻诉求：">
                                    {{detailList.addInfo.remark || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row>
                        <el-col :span="12" :offset="1">
                            <span class="title" style="font-weight:bolder;font-size: 15px;">招商运营</span>
                        </el-col>
                    </el-row>
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="负责人：">
                                    {{detailList.addInfo.flows[0].name || '-'}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理时间：">
                                    {{detailList.addInfo.flows[0].handleTime || '-'}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="对接人：">
                                    {{detailList.addInfo.flows[1].name || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理时间：">
                                    {{detailList.addInfo.flows[1].handleTime || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="处理意见：">
                                    {{detailList.settlement || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="装修申请" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="decorateFilters">
                        <el-form-item>
                            <div class="block">
                                <el-date-picker v-model="decorateFilters.timeDecValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd HH:mm:ss"
                                    :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="decorateFilters.searchTitle" placeholder="公司名称搜索" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getQueryDecorate">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="getDecorate">全部</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="processedDec">已完结</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" @click="pendingDec">未完结</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="decorateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="Loading" style="width: 100%;">
                    <el-table-column type="index" width="60" label="序号">
                    </el-table-column>
                    <el-table-column prop="addInfo.companyName" label="公司名称">
                    </el-table-column>
                    <el-table-column prop="addInfo.location" label="位置房号">
                    </el-table-column>
                    <el-table-column prop="addInfo.contact" label="联系人">
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间">
                    </el-table-column>
                    <el-table-column prop="stage" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.stage ==='未完结'" class="unfinished">未完结</span>
                            <span v-else-if="scope.row.stage ==='已完结'" class="finished">已完结</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="decorateView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="highActSizeChange" @current-change="decorateCurChange" :page-sizes="[8,10,20,50]"
                        :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="decorateList.length" :current-page="page"
                        style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog title="装修申请" :visible.sync="decViewVisible">
                    <el-form label-width="150px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="申请时间：">
                                    {{detailList.time || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="状态：">
                                    <span v-if="detailList.stage === '未完结'" class="unfinished" style="padding: 0px 15px;line-height: 30px;">未完结</span>
                                    <span v-else-if="detailList.stage === '已完结'" class="finished" style="padding: 0px 15px;line-height: 30px;">已完结</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="公司名称：">
                                    {{detailList.addInfo.companyName || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系邮箱：">
                                    {{detailList.addInfo.email || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="负责人：">
                                    {{detailList.addInfo.contact || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式：">
                                    {{detailList.addInfo.phone || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" :offset="1">
                                <span class="title" style="font-weight:bolder;font-size: 15px;">装修公司信息</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="装修公司：">
                                    {{detailList.addInfo.decorationCompanyName || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="公司座机：">
                                    {{detailList.addInfo.decorationCompanyPhone || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="项目经理：">
                                    {{detailList.addInfo.decorationCompanyContact || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系手机：">
                                    {{detailList.addInfo.decorationCompanyContactPhone || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" :offset="1">
                                <span class="title" style="font-weight:bolder;font-size: 15px;">物业管理</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="负责人：">
                                    {{detailList.addInfo.flows[0].name || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理时间：">
                                    {{detailList.addInfo.flows[0].handleTime || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="对接人：">
                                    {{detailList.addInfo.flows[1].name || ' - '}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理时间：">
                                    {{detailList.addInfo.flows[1].handleTime || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="处理意见：">
                                    {{detailList.settlement || ' - '}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import {
        findProperty,
    } from '../../api/api'
    import publicFunction from '../../api/publicFunction';

    export default {
        data() {
            return {
                page: 1,
                pagesize: 8,
                activeName: 'first',
                enterFilters: {
                    searchTitle: '',
                    timeValue: []
                },
                decorateFilters: {
                    searchTitle: '',
                    timeDecValue: []
                },
                inApplyList: [],
                decorateList: [],
                Loading: false,
                viewVisible: false,
                decViewVisible: false,
                detailList: {
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    parkId: "",
                    settlement: "",
                    stage: "已完结",
                    time: "",
                    type: "",
                    userId: "",
                    userName: "",
                    addInfo: {
                        companyName: "",
                        contact: "",
                        decorationCompanyContact: "",
                        decorationCompanyContactPhone: "",
                        decorationCompanyName: "",
                        decorationCompanyPhone: "",
                        email: "",
                        next: 0,
                        phone: "",
                        industry: "",
                        remark: "",
                        flows: [{
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 1,
                        }, {
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 2,
                        }]
                    }
                },

            }
        },
        methods: {
            handleClick(tab, event) {
                this.page = 1;
            },
            getQueryInApply() { //入驻申请 条件查询
                let type = '入驻申请';
                let url = findProperty + type;
                let startTime = this.enterFilters.timeValue === null ? undefined : this.enterFilters.timeValue[0];
                let endTime = this.enterFilters.timeValue === null ? undefined : this.enterFilters.timeValue[1];
                let companyName = this.enterFilters.searchTitle;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime;
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime;
                url = companyName === '' ? url + '' : url + '&companyName=' + companyName;
                this.getInApplylist(url);
            },
            getInApply() { // 入驻申请数据
                let type = '入驻申请';
                this.getInApplylist(findProperty + type);
            },
            getInApplylist(url) { // 入驻申请列表数据
                this.Loading = true;
                this.$get(url)
                    .then((res) => {
                        this.inApplyList = res;
                        this.Loading = false;
                    })
            },
            getQueryDecorate() { // 装修申请 条件查询
                let type = '装修申请';
                let url = findProperty + type;
                let startTime = this.decorateFilters.timeValue === null ? undefined : this.decorateFilters.timeValue[0];
                let endTime = this.decorateFilters.timeValue === null ? undefined : this.decorateFilters.timeValue[1];
                let companyName = this.decorateFilters.searchTitle;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime;
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime;
                url = companyName === '' ? url + '' : url + '&companyName=' + companyName;
                this.getDecorateList(url);
            },
            getDecorate() { //装修申请数据
                let type = '装修申请';
                this.getDecorateList(findProperty + type);
            },
            getDecorateList(url) { //装修申请列表数据
                this.Loading = true;
                this.$get(url)
                    .then((res) => {
                        this.decorateList = res;
                        this.Loading = false;
                    })
            },
            pending() { //待处理
                let url = findProperty + '入驻申请' + '&stage=未完结';
                this.getInApplylist(url);
            },
            processed() { //已处理
                let url = findProperty + '入驻申请' + '&stage=已完结';
                this.getInApplylist(url);
            },
            pendingDec() { //待处理
                let url = findProperty + '装修申请' + '&stage=未完结';
                this.getDecorateList(url);
            },
            processedDec() { //已处理
                let url = findProperty + '装修申请' + '&stage=已完结';
                this.getDecorateList(url);
            },
            inApplyView(index, row) {
                this.detailList = {
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    parkId: "",
                    settlement: "",
                    stage: "",
                    time: "",
                    type: "",
                    userId: "",
                    userName: "",
                    addInfo: {
                        companyName: "",
                        contact: "",
                        decorationCompanyContact: "",
                        decorationCompanyContactPhone: "",
                        decorationCompanyName: "",
                        decorationCompanyPhone: "",
                        email: "",
                        next: 0,
                        phone: "",
                        industry: "",
                        remark: "",
                        flows: [{
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 1,
                        }, {
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 2,
                        }]
                    }
                };
                this.viewVisible = true;
                this.detailList = publicFunction.deepCopy(this.detailList, row);
            },
            decorateView(index, row) {
                this.detailList = {
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    parkId: "",
                    settlement: "",
                    stage: "",
                    time: "",
                    type: "",
                    userId: "",
                    userName: "",
                    addInfo: {
                        companyName: "",
                        contact: "",
                        decorationCompanyContact: "",
                        decorationCompanyContactPhone: "",
                        decorationCompanyName: "",
                        decorationCompanyPhone: "",
                        email: "",
                        next: 0,
                        phone: "",
                        industry: "",
                        remark: "",
                        flows: [{
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 1,
                        }, {
                            handleTime: "",
                            handlerId: "",
                            name: "",
                            phone: "",
                            step: 2,
                        }]
                    }
                };
                this.decViewVisible = true;
                this.detailList = publicFunction.deepCopy(this.detailList, row);
            },
            highActSizeChange(val) {
                this.pagesize = val;
            },
            inApplyCurChange(val) {
                this.page = val;
            },
            decorateCurChange(val) {
                this.page = val;
            },
        },
        mounted() {
            this.getInApply();
            this.getDecorate();
        }
    }
</script>

<style lang="scss" scoped>
    .finished {
        background-color: #67c23a;
        border-radius: 22px;
        padding: 3px 15px;
        color: rgb(255, 255, 255);
        display: inline-block;
    }

    .unfinished {
        background-color: #e6a23c;
        border-radius: 22px;
        padding: 3px 15px;
        color: rgb(255, 255, 255);
        display: inline-block;
    }
</style>