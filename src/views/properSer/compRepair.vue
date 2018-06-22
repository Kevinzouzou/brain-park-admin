<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="投诉建议" name="first">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="complaintFilters">
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="complaintFilters.timeValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="complaintFilters.searchTitle" placeholder="问题搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryComplaint">查询</el-button>
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
                <el-table :data="compList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="complicantLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="time" label="投诉时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.remark" label="问题描述" sortable show-overflow-tooltip="">
                    </el-table-column>
                    <el-table-column prop="addInfo.nickname" label="投诉人" sortable>
                    </el-table-column>
                    <el-table-column prop="stage" label="状态" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.allocationName" label="管理人" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.propertyName" label="负责人" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="complicantView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="compCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="compTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog class="inView" title="投诉建议" :visible.sync="viewVisible" width="70%">
                    <span class="right">{{detailList.stage}}</span>
                    <el-form label-width="90px">
                        <el-form-item label="投诉时间：">
                            {{detailList.time}}
                        </el-form-item>
                        <el-form-item label="投诉人：">
                            {{detailList.addInfo.contact}}
                        </el-form-item>
                        <el-form-item label="租赁位置：">
                            {{detailList.addInfo.location}}
                        </el-form-item>
                        <el-form-item label="问题描述：" class="allWid">
                            {{detailList.addInfo.remark}}
                            <div v-if="detailList.addInfo.imageUrls && detailList.addInfo.imageUrls.length>0">
                                <img v-for="item in detailList.addInfo.imageUrls.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-form>
                    <span class="title">管理人员</span>
                    <el-form label-width="90px">
                        <el-form-item label="管理人：">
                            {{detailList.addInfo.allocationName}}
                        </el-form-item>
                        <el-form-item label="处理时间：">
                            {{detailList.addInfo.allocationTime}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.propertyName" label="负责人：">
                            {{detailList.addInfo.propertyName}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.propertyName" label="处理时间：">
                            {{detailList.addInfo.settlementTime}}
                        </el-form-item>
                        <el-form-item label="处理意见：">
                            {{detailList.settlement}}
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
            <el-tab-pane label="报修处理" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="reparisFilters">
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="reparisFilters.timeRepValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="reparisFilters.searchTitle" placeholder="问题搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryRepairs">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="allDealRep">全部</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="pendingRep">待处理</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="processedRep">已处理</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="evaluation">已评价</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="reparisList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="repairLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.location" label="报修位置" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.remark" label="问题描述" sortable show-overflow-tooltip="">
                    </el-table-column>
                    <el-table-column prop="stage" label="状态" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.allocationName" label="管理人" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.propertyName" label="维修人" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="repairView(scope.$index, scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="repairCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="repairTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog class="inView" title="报修管理" :visible.sync="decViewVisible" width="70%">
                    <span class="right">{{detailList.stage}}</span>
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.time}}
                        </el-form-item>
                        <el-form-item label="报修人：">
                            {{detailList.addInfo.nickname}}
                        </el-form-item>
                        <el-form-item label="报修位置：">
                            {{detailList.addInfo.location}}
                        </el-form-item>
                        <el-form-item label="问题描述：" class="allWid">
                            {{detailList.addInfo.remark}}
                            <div v-if="detailList.addInfo.imageUrls && detailList.addInfo.imageUrls.length>0">
                                <img v-for="item in detailList.addInfo.imageUrls.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-form>
                    <span class="title">管理人员</span>
                    <el-form label-width="90px">
                        <el-form-item label="管理人：">
                            {{detailList.addInfo.allocationName}}
                        </el-form-item>
                        <el-form-item label="处理时间：">
                            {{detailList.addInfo.designateTime}}
                        </el-form-item>
                        <el-form-item label="负责人：">
                            {{detailList.addInfo.propertyName}}
                        </el-form-item>
                        <el-form-item label="处理时间：">
                            {{detailList.addInfo.settlementTime}}
                        </el-form-item>
                        <el-form-item label="维修反馈：" class="allWid">
                            {{detailList.addInfo.feedback}}
                            <div v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">
                                <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-form>
                    <span class="title">评价</span>
                    <el-form label-width="90px">
                        <el-form-item label="服务星级：">
                            {{detailList.addInfo.commentStar}}
                        </el-form-item>
                        <el-form-item label="维修反馈：">
                            {{detailList.addInfo.commentText}}
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import {repSuggest,showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
        data(){
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                page:1,
                pagesize:7,
                activeName:'first',
                complaintFilters: {
                    searchTitle: '',
                    timeValue:[]
                },
                reparisFilters: {
                    searchTitle: '',
                    timeRepValue:[]
                },
                timeValue:[],
                timeRepValue:[],
                compList:[
                    {
                        time:'',
                        addInfo:{
                            companyName:'',
                            industry:''
                        }
                    }
                ],
                reparisList:[
                    {
                        time:'',
                        addInfo:{
                            companyName:'',
                            location:'',
                            contact:'',
                            custodian:'',
                            principal:''
                        }
                    }
                ],
                complicantLoading:false,
                repairLoading:false,
                viewVisible:false,
                decViewVisible:false,
                detailList:{
                    stage:'',
                    time:'',
                    settlement:'',
                    addInfo:{
                        location:'',
                        remark:'',
                        contact:'',
                        images:[],
                        imageUrls:[],
                        allocationName:'',
                        allocationTime:'',
                        propertyName:'',
                        settlementTime:'',

                        companyName:'',
                        phone:'',
                        website:'',
                        industry:'',
                        email:'',
                        decorationCompanyName:'',
                        decorationCompanyPhone:'',
                        decorationCompanyContact:'',
                        decorationCompanyContactPhone:''
                    }
                },
                compTotal:1,
                repairTotal:1,

            }
        },
        methods:{
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                this.page=1;
            },
            getQueryComplaint(){ //投诉建议 条件查询
                let type='投诉建议';
                let url=repSuggest+type;
                let startTime=this.complaintFilters.timeValue[0];
                let endTime=this.complaintFilters.timeValue[1];
                let question=this.complaintFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=question===''?url+'':url+'&question='+question;
                this.getComplaintList(url);
                this.complaintFilters={
                    timeValue:[],
                    searchTitle:''
                }
            },
            getComplaint(){ //投诉建议数据
                let type='投诉建议';
                this.getComplaintList(repSuggest+type);
            },
            getComplaintList(url){//投诉建议 列表数据
                this.complicantLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.compList=res;
                        this.compTotal=this.compList.length>0?this.compList.length:1;
                        this.complicantLoading=false;
                    })
            },
            getQueryRepairs(){ //报修处理 条件查询
                let type='物业报修';
                let url=repSuggest+type;
                let startTime=this.reparisFilters.timeRepValue[0];
                let endTime=this.reparisFilters.timeRepValue[1];
                let question=this.reparisFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=question===''?url+'':url+'&question='+question;
                this.getRepairsList(url);
                this.reparisFilters={
                    timeRepValue:[],
                    searchTitle:''
                }
            },
            getRepairs(){ //报修处理数据
                let type='物业报修';
                this.getRepairsList(repSuggest+type);
            },
            getRepairsList(url){//报修处理 列表数据
                this.repairLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.reparisList=res;
                        this.repairTotal=this.reparisList.length>0?this.reparisList.length:1;
                        this.repairLoading=false;
                    })
            },
            allDeal(){ //全部
                this.getComplaint();
            },
            pending(){ //待处理
                let url=repSuggest+'投诉建议'+'&stage=待处理';
                this.getComplaintList(url);
            },
            processed(){ //已处理
                let url=repSuggest+'投诉建议'+'&stage=已处理';
                this.getComplaintList(url);
            },
            allDealRep(){ //全部
                this.getRepairs();
            },
            pendingRep(){ //待处理
                let url=repSuggest+'物业报修'+'&stage=待处理';
                this.getRepairsList(url);
            },
            processedRep(){ //已处理
                let url=repSuggest+'物业报修'+'&stage=已处理';
                this.getRepairsList(url);
            },
            evaluation(){ //已评价
                let url=repSuggest+'物业报修'+'&stage=已评价';
                this.getRepairsList(url);
            },
            complicantView(index, row){
                this.viewVisible=true;
                this.detailList=row;
            },
            repairView(index, row){
                this.decViewVisible=true;
                this.detailList=row;
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            compCurChange(val) {
                this.page = val;
                this.getComplaint();
            },
            repairCurChange(val) {
                this.page = val;
                this.getRepairs();
            },

        },
        mounted(){
            this.getComplaint();
            this.getRepairs();
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
                &.allWid{
                    width: 100%;
                }
            }
        }
        .title{
            font-weight: bold;
        }
    }
    .allWid{
        img{
            height: 80px;
            margin-right: 15px;
        }
    }
</style>