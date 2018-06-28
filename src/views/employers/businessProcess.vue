<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="入驻申请" name="first">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="enterFilters">
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="enterFilters.timeValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="enterFilters.searchTitle" placeholder="公司名称搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryInApply">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="allDeal">全部</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="pending">待处理</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="processed">已处理</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="inApplyList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="inApplyLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.companyName" label="公司名称" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.industry" label="所属行业" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.contact" label="联系人" sortable>
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间" sortable>
                    </el-table-column>
                    <el-table-column prop="stage" label="状态" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.allocationName" label="管理人" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.propertyName" label="对接人" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="inApplyView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="highActSizeChange"
                                   @current-change="inApplyCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="inApplyTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog class="inView" title="入驻申请" :visible.sync="viewVisible" width="70%">
                    <span class="right">{{detailList.stage}}</span>
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.time}}
                        </el-form-item>
                        <el-form-item label="公司名称：">
                            {{detailList.addInfo.companyName}}
                        </el-form-item>
                        <el-form-item label="联系人：">
                            {{detailList.addInfo.contact}}
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            {{detailList.addInfo.phone}}
                        </el-form-item>
                        <el-form-item label="公司网址：">
                            {{detailList.addInfo.website}}
                        </el-form-item>
                        <el-form-item label="企业行业：">
                            {{detailList.addInfo.industry}}
                        </el-form-item>
                        <el-form-item label="入驻诉求：">
                            {{detailList.addInfo.remark}}
                        </el-form-item>
                    </el-form>
                    <span class="title">招商运营</span>
                    <el-form label-width="90px">
                        <el-form-item label="负责人：">
                            {{detailList.addInfo.allocationName}}
                        </el-form-item>
                        <el-form-item label="处理时间：">
                            {{detailList.addInfo.settlementTime}}
                        </el-form-item>
                        <el-form-item label="对接人：">
                            {{detailList.addInfo.propertyName}}
                        </el-form-item>
                        <el-form-item label="处理意见：">
                            {{detailList.settlement}}
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
            <el-tab-pane label="装修申请" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="decorateFilters">
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="decorateFilters.timeDecValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="decorateFilters.searchTitle" placeholder="公司名称搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryDecorate">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="allDealDec">全部</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="pendingDec">待处理</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="processedDec">已处理</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="decorateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="decorateLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.companyName" label="公司名称" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.location" label="位置房号" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.contact" label="联系人" sortable>
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间" sortable>
                    </el-table-column>
                    <el-table-column prop="stage" label="状态" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.allocationName" label="管理人" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.propertyName" label="负责人" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="decorateView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="highActSizeChange"
                                   @current-change="decorateCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="decorateTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog class="inView" title="装修申请" :visible.sync="decViewVisible" width="70%">
                    <span class="right">{{detailList.stage}}</span>
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.time}}
                        </el-form-item>
                        <el-form-item label="公司名称：">
                            {{detailList.addInfo.companyName}}
                        </el-form-item>
                        <el-form-item label="负责人：">
                            {{detailList.addInfo.contact}}
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            {{detailList.addInfo.phone}}
                        </el-form-item>
                        <el-form-item label="联系邮箱：">
                            {{detailList.addInfo.email}}
                        </el-form-item>
                    </el-form>
                    <span class="title">装修公司信息</span>
                    <el-form label-width="90px">
                        <el-form-item label="装修公司：">
                            {{detailList.addInfo.decorationCompanyName}}
                        </el-form-item>
                        <el-form-item label="公司座机：">
                            {{detailList.addInfo.decorationCompanyPhone}}
                        </el-form-item>
                        <el-form-item label="项目经理：">
                            {{detailList.addInfo.decorationCompanyContact}}
                        </el-form-item>
                        <el-form-item label="联系手机：">
                            {{detailList.addInfo.decorationCompanyContactPhone}}
                        </el-form-item>
                    </el-form>
                    <span class="title">物业管理</span>
                    <el-form label-width="90px">
                        <el-form-item label="负责人：">
                            {{detailList.addInfo.allocationName}}
                        </el-form-item>
                        <el-form-item label="处理时间：">
                            {{detailList.addInfo.settlementTime}}
                        </el-form-item>
                        <el-form-item label="对接人：">
                            {{detailList.addInfo.propertyName}}
                        </el-form-item>
                        <el-form-item label="处理意见：">
                            {{detailList.settlement}}
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import {findProperty,showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
        data(){
            return {
                page:1,
                pagesize:7,
                activeName:'first',
                enterFilters: {
                    searchTitle: '',
                    timeValue:[]
                },
                decorateFilters: {
                    searchTitle: '',
                    timeDecValue:[]
                },
                timeValue:[],
                timeDecValue:[],
                inApplyList:[
                    {
                        time:'',
                        addInfo:{
                            companyName:'',
                            industry:'',
                            allocationName:'',
                            propertyName:''
                        }
                    }
                ],
                decorateList:[
                    {
                        time:'',
                        addInfo:{
                            companyName:'',
                            location:'',
                            contact:'',
                            allocationName:'',
                            propertyName:''
                        }
                    }
                ],
                inApplyLoading:false,
                decorateLoading:false,
                viewVisible:false,
                decViewVisible:false,
                detailList:{
                    stage:'',
                    addInfo:{
                        companyName:'',
                        contact:'',
                        phone:'',
                        website:'',
                        industry:'',
                        email:'',
                        decorationCompanyName:'',
                        decorationCompanyPhone:'',
                        decorationCompanyContact:'',
                        decorationCompanyContactPhone:'',
                        allocationName:'',
                        propertyName:''
                    }
                },
                inApplyTotal:1,
                decorateTotal:1,

            }
        },
        methods:{
            handleClick(tab, event) {
                this.page=1;
            },
            getQueryInApply(){//入驻申请 条件查询
                let type='入驻申请';
                let url=findProperty+type;
                let startTime=this.enterFilters.timeValue[0];
                let endTime=this.enterFilters.timeValue[1];
                let companyName=this.enterFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=companyName===''?url+'':url+'&companyName='+companyName;
                this.getInApplylist(url);
                this.enterFilters={
                    timeValue:[],
                    searchTitle:''
                }
            },
            getInApply(){ //入驻申请数据
                let type='入驻申请';
                this.getInApplylist(findProperty+type);
            },
            getInApplylist(url){//入驻申请列表数据
                this.inApplyLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.inApplyList=res;
                        this.inApplyTotal=this.inApplyList.length>0?this.inApplyList.length:1;
                        this.inApplyLoading=false;
                    })
            },
            getQueryDecorate(){//装修申请 条件查询
                let type='装修申请';
                let url=findProperty+type;
                let startTime=this.decorateFilters.timeDecValue[0];
                let endTime=this.decorateFilters.timeDecValue[1];
                let companyName=this.decorateFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=companyName===''?url+'':url+'&companyName='+companyName;
                this.getDecorateList(url);
                this.decorateFilters={
                    timeDecValue:[],
                    searchTitle:''
                }
            },
            getDecorate(){ //装修申请数据
                let type='装修申请';
                this.getDecorateList(findProperty+type);
            },
            getDecorateList(url){//装修申请列表数据
                this.decorateLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.decorateList=res;
                        this.decorateTotal=this.decorateList.length>0?this.decorateList.length:1;
                        this.decorateLoading=false;
                    })
            },
            allDeal(){ //全部
                this.getInApply();
            },
            pending(){ //待处理
                let url=findProperty+'入驻申请'+'&stage=待处理';
                this.getInApplylist(url);
            },
            processed(){ //已处理
                let url=findProperty+'入驻申请'+'&stage=已处理';
                this.getInApplylist(url);
            },
            allDealDec(){ //全部
                this.getDecorate();
            },
            pendingDec(){ //待处理
                let url=findProperty+'装修申请'+'&stage=待处理';
                this.getInApplylist(url);
            },
            processedDec(){ //已处理
                let url=findProperty+'装修申请'+'&stage=已处理';
                this.getInApplylist(url);
            },
            inApplyView(index, row){
                this.viewVisible=true;
                this.detailList=row;
            },
            decorateView(index, row){
                this.decViewVisible=true;
                this.detailList=row;
            },
            highActSizeChange(val) {
                this.pagesize=val;
            },
            inApplyCurChange(val) {
                this.page = val;
                this.getInApply();
            },
            decorateCurChange(val) {
                this.page = val;
                this.getDecorate();
            },

        },
        mounted(){
            this.getInApply();
            this.getDecorate();
        }
    }
</script>

<style lang="scss" scoped>
    .right{
        position: absolute;
        right: 23px;
        top: 55px;
    }
    .inView{
        .el-form{
            .el-form-item{
                display: inline-block;
                width: 48%;
            }
        }
        .title{
            font-weight: bold;
        }
    }
</style>