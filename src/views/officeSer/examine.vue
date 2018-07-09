<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="请假" name="first">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="leaveFilters">
                        <el-form-item label="部门筛选：" label-width="">
                            <el-select v-model="leaveFilters.secDepartValue" placeholder="请选择部门">
                                <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="leaveFilters.departTimeValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="leaveFilters.searchTitle" placeholder="姓名搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryLeave">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="leaveList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="leaveLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.userName" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.department" label="部门" sortable>
                    </el-table-column>
                    <el-table-column prop="beginTime" label="开始时间" sortable>
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.subtype" label="类型" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.duration" label="请假时长（天）" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="提交时间" sortable>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="leaveDetail(scope.$index, scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="leaveCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="leaveTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--请假详情-->
                <el-dialog class="inView" title="请假详情" :visible.sync="leaveVisible">
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.createTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="申请人：">
                            {{detailList.addInfo.userName || ' - '}}
                        </el-form-item>
                        <el-form-item label="类型：">
                            {{detailList.addInfo.subtype || ' - '}}
                        </el-form-item>
                        <el-form-item label="请假时长：">
                            {{detailList.addInfo.duration || ' - '}}
                        </el-form-item>
                        <el-form-item label="开始时间：">
                            {{detailList.beginTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="结束时间：">
                            {{detailList.endTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="请假事由：" class="allWid">
                            {{detailList.typeDetail || ' - '}}
                            <div v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">
                                <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-form>
                    <span class="title" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">审批详情</span>
                    <el-form label-width="90px" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">
                        <el-form-item label="审批人：">
                            {{detailList.addInfo.flows[0].name || ' - '}}
                        </el-form-item>
                        <el-form-item label="审批时间：">
                            {{detailList.addInfo.flows[0].handleTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="状态：">
                            {{detailList.addInfo.flows[0].handleResult || ' - '}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.flows[0].handleResult!=='通过'" label="备注：">
                            {{detailList.addInfo.flows[0].handleContent || ' - '}}
                        </el-form-item>
                    </el-form>
                    <el-form label-width="90px" v-if="detailList.addInfo.recipients && detailList.addInfo.recipients.length>0">
                        <el-form-item label="抄送人：">
                            <span v-for="item in detailList.addInfo.recipients">{{item.name || ' - '}}，</span>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
            <el-tab-pane label="出差" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="evectionFilters">
                        <el-form-item label="部门筛选：" label-width="">
                            <el-select v-model="evectionFilters.secEveDepartValue" placeholder="请选择部门">
                                <el-option v-for="item in departEveList" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="evectionFilters.departEveValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="evectionFilters.searchTitle" placeholder="姓名搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryEvection">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="evecList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="evectionLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.userName" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.department" label="部门" sortable>
                    </el-table-column>
                    <el-table-column prop="beginTime" label="开始时间" sortable>
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.address" label="出差地" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.duration" label="出差时长（天）" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="提交时间" sortable>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="eveDetail(scope.$index, scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="eveCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="evecTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--出差详情-->
                <el-dialog class="inView" title="出差详情" :visible.sync="evecVisible">
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.createTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="申请人：">
                            {{detailList.addInfo.userName || ' - '}}
                        </el-form-item>
                        <el-form-item label="出差地点：">
                            {{detailList.addInfo.address || ' - '}}
                        </el-form-item>
                        <el-form-item label="出差时长：">
                            {{detailList.addInfo.duration || ' - '}}
                        </el-form-item>
                        <el-form-item label="开始时间：">
                            {{detailList.beginTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="结束时间：">
                            {{detailList.endTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="出差事由：" class="allWid">
                            {{detailList.typeDetail || ' - '}}
                            <div v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">
                                <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-form>
                    <span class="title" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">审批详情</span>
                    <el-form label-width="90px" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">
                        <el-form-item label="审批人：">
                            {{detailList.addInfo.flows[0].name || ' - '}}（部门经理）
                        </el-form-item>
                        <el-form-item label="审批时间：">
                            {{detailList.addInfo.flows[0].handleTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="状态：">
                            {{detailList.addInfo.flows[0].handleResult || ' - '}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.flows[0].handleResult!=='通过'" label="备注：">
                            {{detailList.addInfo.flows[0].handleContent || ' - '}}
                        </el-form-item>
                    </el-form>
                    <el-form label-width="90px" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>1">
                        <el-form-item label="审批人：">
                            {{detailList.addInfo.flows[1].name || ' - '}}（总经理）
                        </el-form-item>
                        <el-form-item label="审批时间：" v-if="detailList.addInfo.flows[0].handleResult==='通过'">
                            {{detailList.addInfo.flows[1].handleTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="状态：" v-if="detailList.addInfo.flows[0].handleResult==='通过'">
                            {{detailList.addInfo.flows[1].handleResult || ' - '}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.flows[0].handleResult==='通过' && detailList.addInfo.flows[1].handleResult!=='通过'" label="备注：">
                            {{detailList.addInfo.flows[1].handleContent || ' - '}}
                        </el-form-item>
                    </el-form>
                    <el-form label-width="90px" v-if="detailList.addInfo.recipients && detailList.addInfo.recipients.length>0">
                        <el-form-item label="抄送人：">
                            <span v-for="item in detailList.addInfo.recipients">{{item.name || ' - '}}，</span>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
            <el-tab-pane label="外出" name="third">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="goOutFilters">
                        <el-form-item label="部门筛选：" label-width="">
                            <el-select v-model="goOutFilters.secGoOutDepartValue" placeholder="请选择部门">
                                <el-option v-for="item in departGoOutList" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="goOutFilters.departGoOutValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goOutFilters.searchTitle" placeholder="姓名搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryGoOut">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="goOutList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="goOutLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.userName" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.department" label="部门" sortable>
                    </el-table-column>
                    <el-table-column prop="beginTime" label="开始时间" sortable>
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.duration" label="外出时长（天）" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="提交时间" sortable>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="goOutDetail(scope.$index, scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="goOutCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="goOutTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--外出详情-->
                <el-dialog class="inView" title="外出详情" :visible.sync="goOutVisible">
                    <el-form label-width="90px">
                        <el-form-item label="申请时间：">
                            {{detailList.createTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="申请人：">
                            {{detailList.addInfo.userName || ' - '}}
                        </el-form-item>
                        <el-form-item label="外出地点：">
                            {{detailList.addInfo.address || ' - '}}
                        </el-form-item>
                        <el-form-item label="外出时长：">
                            {{detailList.addInfo.duration || ' - '}}
                        </el-form-item>
                        <el-form-item label="开始时间：">
                            {{detailList.beginTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="结束时间：">
                            {{detailList.endTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="外出事由：" class="allWid">
                            {{detailList.typeDetail || ' - '}}
                            <div v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">
                                <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                        <!--<el-form-item label="GPS定位：" class="allWid">-->
                            <!---->
                        <!--</el-form-item>-->
                    </el-form>
                    <span class="title" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">审批详情</span>
                    <el-form label-width="90px" v-if="detailList.addInfo.flows && detailList.addInfo.flows.length>0">
                        <el-form-item label="审批人：">
                            {{detailList.addInfo.flows[0].name || ' - '}}
                        </el-form-item>
                        <el-form-item label="审批时间：">
                            {{detailList.addInfo.flows[0].handleTime || ' - '}}
                        </el-form-item>
                        <el-form-item label="状态：">
                            {{detailList.addInfo.flows[0].handleResult || ' - '}}
                        </el-form-item>
                        <el-form-item v-if="detailList.addInfo.flows[0].handleResult!=='通过'" label="备注：">
                            {{detailList.addInfo.flows[0].handleContent || ' - '}}
                        </el-form-item>
                    </el-form>
                    <el-form label-width="90px" v-if="detailList.addInfo.recipients && detailList.addInfo.recipients.length>0">
                        <el-form-item label="抄送人：">
                            <span v-for="item in detailList.addInfo.recipients">{{item.name || ' - '}}，</span>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script type="text/ecmascript-6">
    import {approvalList, showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        data(){
            return {
                pagesize:7,
                page:1,
                activeName:'first',
                secDepartValue: '',
                secGoOutDepartValue: '',
                secEveDepartValue: '',
                leaveFilters: {
                    searchTitle: '',
                    secDepartValue:'',
                    departTimeValue:[]
                },
                goOutFilters: {
                    secGoOutDepartValue:'',
                    departGoOutValue:[],
                    searchTitle: ''
                },
                evectionFilters: {
                    searchTitle: '',
                    secEveDepartValue:'',
                    departEveValue:[]

                },
                departTimeValue:[],
                departGoOutValue:[],
                departEveValue:[],
                departLabel:'',
                leaveList:[
                    {
                        createTime:'2018-01-01',
                        beginTime:'2018-02-02',
                        endTime:'2018-03-03',
                        state:'已完结',
                        typeDetail:'aaaaaa',
                        addInfo:{
                            userName:'enra',
                            duration:'3',
                            subtype:'事假',
                            department:'研发部',
                            images:[],
                        }
                    }
                ],
                goOutList:[],
                evecList:[],
                leaveLoading:false,
                goOutLoading:false,
                evectionLoading:false,
                leaveTotal:2,
                goOutTotal:2,
                evecTotal:2,
                leaveVisible:false,
                goOutVisible:false,
                evecVisible:false,
                departList:[
                    {
                        id:1,
                        name:'总经办',
                    },
                    {
                        id:2,
                        name:'研发部',
                    },
                    {
                        id:3,
                        name:'市场部',
                    }
                ],
                departGoOutList:[
                    {
                        id:1,
                        name:'总经办',
                    },
                    {
                        id:2,
                        name:'研发部',
                    },
                    {
                        id:3,
                        name:'市场部',
                    }
                ],
                departEveList:[
                    {
                        id:1,
                        name:'总经办',
                    },
                    {
                        id:2,
                        name:'研发部',
                    },
                    {
                        id:3,
                        name:'市场部',
                    }
                ],
                detailList:{
                    createTime:'',
                    applyTime:'',
                    beginTime:'',
                    endTime:'',
                    state:'',
                    typeDetail:'',
                    applyUser:{
                        addInfo:{
                            nickName:'',
                            department:''
                        }
                    },
                    addInfo:{
                        userName:'',
                        duration:'',
                        subtype:'',
                       leaveTime:'',
                       leaveType:'',
                        approver:'',
                        approverTime:'',
                        approvalState:'',
                        remark:'',
                        carbon:'',
                        images:[],
                        general:'',
                        generalTime:'',
                        generalRemark:'',
                    }
                },
                dialogImageUrl: '',
                dialogVisible: false,

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
            secDepartVal(value){
                let obj = {};
                obj = this.departList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.departLabel=obj.name;
            },
            getQueryLeave(){//请假条件查询
                let type='&type=请假';
                let url=approvalList+type;
                let startTime=this.leaveFilters.departTimeValue[0];
                let endTime=this.leaveFilters.departTimeValue[1];
                let department=this.leaveFilters.secDepartValue;
                let userName=this.leaveFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=userName===''?url+'':url+'&userName='+userName;
                url=department===''?url+'':url+'&department='+department;
                this.getLeave(url);
                this.leaveFilters={
                    secDepartValue:'',
                    departTimeValue:[],
                    searchTitle:''
                }
            },
            getLeaveList(){ // 获取请假列表
                let type='&type=请假';
                this.getLeave(approvalList+type);
            },
            getLeave(url){//请假列表
                this.leaveLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.leaveList=res;
                        this.leaveTotal=this.leaveList.length>0?this.leaveList.length:1;
                        this.leaveLoading=false;
                    })
            },
            getQueryGoOut(){//外出 条件查询
                let type='&type=外出';
                let url=approvalList+type;
                let startTime=this.goOutFilters.departGoOutValue[0];
                let endTime=this.goOutFilters.departGoOutValue[1];
                let department=this.goOutFilters.secGoOutDepartValue;
                let userName=this.goOutFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=userName===''?url+'':url+'&userName='+userName;
                url=department===''?url+'':url+'&department='+department;
                this.getGoOut(url);
                this.goOutFilters={
                    secGoOutDepartValue:'',
                    departGoOutValue:[],
                    searchTitle:''
                }
            },
            getGoOutList(){ // 获取外出列表
                let type='&type=外出';
                this.getGoOut(approvalList+type);
            },
            getGoOut(url){//外出列表
                let type='外出';
                this.goOutLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.goOutList=res;
                        this.goOutTotal=this.goOutList.length>0?this.goOutList.length:1;
                        this.goOutLoading=false;
                    })
            },
            getQueryEvection(){//出差列表 条件查询
                let type='&type=出差';
                let url=approvalList+type;
                let startTime=this.evectionFilters.departEveValue[0];
                let endTime=this.evectionFilters.departEveValue[1];
                let department=this.evectionFilters.secEveDepartValue;
                let userName=this.evectionFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=userName===''?url+'':url+'&userName='+userName;
                url=department===''?url+'':url+'&department='+department;
                this.getEvection(url);
                this.evectionFilters={
                    searchTitle: '',
                    secEveDepartValue:'',
                    departEveValue:[]
                }
            },
            getEvectionList(){ // 获取出差列表
                let type='&type=出差';
                this.getEvection(approvalList+type);
            },
            getEvection(url){//出差列表
                this.evectionLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.evecList=res;
                        this.evecTotal=this.evecList.length>0?this.evecList.length:1;
                        this.evectionLoading=false;
                    })
            },
            leaveDetail(index,row){ //请假详情
                this.leaveVisible=true;
                this.detailList=row;
            },
            goOutDetail(index,row){ //外出详情
                this.goOutVisible=true;
                this.detailList=row;
            },
            eveDetail(index,row){ //出差详情
                this.evecVisible=true;
                this.detailList=row;
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            leaveCurChange(val) {
                this.page = val;
                this.getLeaveList();
            },
            goOutCurChange(val) {
                this.page = val;
                this.getGoOutList();
            },
            eveCurChange(val) {
                this.page = val;
                this.getEvectionList();
            },


        },
        mounted() {
            this.getLeaveList();     //请假数据列表
            this.getEvectionList();  //出差列表
            this.getGoOutList();     //外出列表
        }

    }
</script>

<style lang="scss">
    .backUp{
        float: right;
    }
    .left{float: left;}
    .center{text-align: center;}
    .text-left{text-align: left;}
    ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .publisher{
        float: left;
        img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }
    .mainContent{
        width: 80%;
        margin: 10px auto;
        .topicType{
            color: #866;
            font-weight: 600;
        }
        .pubTime{
            line-height: 60px;
        }
        .content{
            text-align: justify;
            text-indent: 28px;
        }
        img{
            height: 120px;
            margin: 10px 15px;
        }
        .tips{
            display: inline-block;
            &:after{
                content: '';
                display: block;
                clear: both;
            }
            li{
                display: inline-block;
                padding-left: 45px;
                margin: 5px 5px 15px;
                width: 40px;
                height: 40px;
                line-height: 40px;
                background: url(../../assets/icon_show.png) no-repeat left center;
                background-size: 40px 30px;
                &:first-child{
                    background-size: 40px 40px;
                }
                &:nth-child(2){
                    background-image: url(../../assets/icon_praise.png);
                }
                &:last-child{
                    background-image: url(../../assets/icon_comment.png);
                }
            }
        }
        .bottomTips{
            .el-tab-pane{
                .comCont{
                    li{
                        border-bottom: 1px solid #ddd;
                        padding: 10px 0;
                        label{
                            display: inline-block;
                            width: 20%;
                            color: #aaa;
                            vertical-align: top;
                        }
                        .commentR{
                            display: inline-block;
                            text-align: justify;
                            width: 78%;
                            .comRBody{
                                border: 1px solid #ccc;
                                padding: 5px 8px;
                                margin: 5px 0;
                                color: #888;
                                background: #f3f3f3;
                            }
                        }
                        .topicType{
                            border: 1px solid #f00;
                            border-radius: 3px;
                            padding: 6px;
                            color: #333;
                        }
                    }
                }
            }

        }
    }
    .book{
        margin-bottom: 10px;
        li{
            display: inline-block;
            width: 48%;
            &.title{
                display: block;
                font-weight: bold;
                margin: 16px 0;
            }
        }
    }
    .el-dialog__body{
        min-height: 60px;
    }
    .el-book{
        .el-dialog__body{
            min-height: 100px;
        }
    }
    .el-pages{
        margin: 10px 0;
        text-align: right;
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
