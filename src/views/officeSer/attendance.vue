<template>
    <section>
        <div class="mainPage" v-show="mainPage">
            <el-col :span="24" justify="center">
                <el-form :inline="true" :model="attendanceFilters">
                    <el-form-item>
                        <div class="block">
                            <!--<p>组件值：{{ timerValue }}</p>-->
                            <el-date-picker v-model="attendanceFilters.timeValue" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                            :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="attendanceFilters.searchTitle" placeholder="姓名搜索"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getQueryAttend">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item label="考勤分析">
                        <el-select v-model="secValue" placeholder="请选择">
                            <el-option v-for="item in yearList" :key="item.id" :label="item.title" :value="item.title">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-for="item in months.slice(0,monthNum)" :key="item.id" @click="monthAttend(item.value,item.id)">{{item.value}}</el-button>
                    </el-form-item>

                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="attendList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="attendanceLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="createTime" label="时间" sortable>
                </el-table-column>
                <el-table-column prop="addInfo.name" label="姓名" sortable>
                </el-table-column>
                <el-table-column prop="addInfo.department" label="部门" sortable>
                </el-table-column>
                <el-table-column prop="addInfo.address" label="地址" sortable show-overflow-tooltip="">
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
                               :total="attendTotal"
                               :current-page="page"
                               style="float:right;">
                </el-pagination>
            </el-col>

        </div>
        <div class="secondPage" v-show="secondPage">
            <el-button class="backUp" type="danger" @click="backToFirstAn">返回</el-button>
            <el-col :span="24" justify="center">
                <el-form :inline="true" :model="monthFilters">
                   <el-form-item>
                        <el-input v-model="monthFilters.searchTitle" placeholder="姓名搜索"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getMonthAttend">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
               {{secValue}}-{{monValue}}考勤异常统计表
            </el-col>
            <!--列表-->
            <el-table :data="monthAttendList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="monthAttendanceLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="addInfo.nickName" label="姓名" sortable>
                </el-table-column>
                <el-table-column label="异常记录" sortable show-overflow-tooltip="">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="monthAtView(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="审批申请">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="monthAtView(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination background
                               @size-change="sizeChange"
                               @current-change="monAttCurChange"
                               :page-sizes="[7,8,10,20]"
                               :page-size="pagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="monAttTotal"
                               :current-page="page"
                               style="float:right;">
                </el-pagination>
            </el-col>
            <!--查看界面-->
            <el-dialog class="inView" title="审批申请-记录" :visible.sync="viewVisible">
                <span class="title">请假</span>
                <div>{{detailList.addInfo.leave}}</div>
                <span class="title">出差</span>
                <div>{{detailList.addInfo.leave}}</div>
                <span class="title">外出</span>
                <div>{{detailList.addInfo.goOut}}</div>
            </el-dialog>

        </div>

    </section>
</template>

<script>
    import {attendList,unAttendList,} from '../../api/api'

    export default {
        data(){
            return {
                attendanceFilters: {
                    searchTitle: '',
                    timeValue:''
                },
                monthFilters: {
                    searchTitle: ''
                },
                page:1,
                pagesize:7,
                timeValue:[],
                attendList:[
                    {
                        time:'2018-05-01 9:30',
                        addInfo:{
                            nickName:'宋远桥',
                            department:'运营部',
                            gps:'广东省深圳市龙华区清祥路1号·宝能科技园'
                        }
                    },
                    {
                        time:'2018-05-01 9:30',
                        addInfo:{
                            nickName:'宋远桥',
                            department:'运营部',
                            gps:'广东省深圳市龙华区清祥路1号·宝能科技园'
                        }
                    }
                ],
                monthAttendList:[
                    {
                        addInfo:{
                            nickName:'宋远桥',
                            exception:'05-12迟到，05-15早退',
                            leave:'05-18 上午；05-21下午；05-31 上午-下午；',
                            evection:'05-17 上午-下午；05-19 上午-下午；',
                            goOut:'05-25 上午-下午；05-27 下午；'
                        }
                    },
                    {
                        addInfo:{
                            nickName:'宋远桥',
                            exception:'05-12迟到，05-15早退，05-16出差',
                            leave:'05-18 上午；05-21下午；05-31 上午-下午；',
                            evection:'05-17 上午-下午；05-19 上午-下午；',
                            goOut:'05-25 上午-下午；05-27 下午；'
                        }
                    }
                ],
                attendanceLoading:false,
                monthAttendanceLoading:false,
                attendTotal:1,
                monAttTotal:1,
                viewVisible:false,
                detailList:{
                    addInfo:{
                        leave:'',
                        evection:'',
                        goOut:''
                    }
                },
                secValue: '',
                yearList:[
                    {
                        id:'6',
                        title:'2016年'
                    },
                    {
                        id:'7',
                        title:'2017年'
                    },
                    {
                        id:'8',
                        title:'2018年'
                    },
                    {
                        id:'9',
                        title:'2019年'
                    }
                ],
                months:[
                    {
                        id:'01',
                        value:'一月'
                    },
                    {
                        id:'02',
                        value:'二月'
                    },
                    {
                        id:'03',
                        value:'三月'
                    },
                    {
                        id:'04',
                        value:'四月'
                    },
                    {
                        id:'05',
                        value:'五月'
                    },
                    {
                        id:'06',
                        value:'六月'
                    },
                    {
                        id:'07',
                        value:'七月'
                    },
                    {
                        id:'08',
                        value:'八月'
                    },
                    {
                        id:'09',
                        value:'九月'
                    },
                    {
                        id:'10',
                        value:'十月'
                    },
                    {
                        id:'11',
                        value:'十一月'
                    },
                    {
                        id:'12',
                        value:'十二月'
                    }
                ],
                mainPage:true,
                secondPage:false,
                monValue:'',
                monthNum:1,


            }
        },
        methods:{
            getQueryAttend(){//条件查询
                let url=attendList;
                let startTime=this.attendanceFilters.timeValue[0];
                let endTime=this.attendanceFilters.timeValue[1];
                let userName=this.attendanceFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=userName===''?url+'':url+'&userName='+userName;
                this.getAttendanceList(url);
                this.attendanceFilters={
                    timeValue:[],
                    searchTitle:''
                }
            },
            getAttendance(){ //考勤数据
                let year=this.secValue.substring(0,4);
                let url=attendList+'&startTime='+year+'/01/01 00:00:00'+'&endTime='+year+'/12/31 23:59:59';
                this.getAttendanceList(url);
            },
            getAttendanceList(url){//考勤数据列表
                this.attendanceLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.attendList=res;
                        this.attendTotal=this.attendList.length>0?this.attendList.length:1;
                        this.attendanceLoading=false;
                    })
            },
            getMonthAttend(){ //月份考勤数据

            },
            monthAttend(val,id){ //月份考勤
                this.mainPage=false;
                this.secondPage=true;
                this.page=1;
                this.monValue=val;
                let monStr='&month='+this.secValue.substring(0,4)+'-'+id;
                let url=unAttendList+monStr;
                this.getUnAttendList(url);
                console.log(monStr)
                console.log(url)
                // console.log(this.secValue.slice(0,4))
                // console.log(this.secValue.substring(0,4))
            },
            getUnAttendList(url){//考勤异常 数据列表
                this.monthAttendanceLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.monthAttendList=res;
                        this.monAttTotal=this.monthAttendList.length>0?this.monthAttendList.length:1;
                        this.monthAttendanceLoading=false;
                    })
            },
            backToFirstAn(){
                this.mainPage=true;
                this.secondPage=false;
                this.page=1;
            },
            pending(){ //待处理

            },
            processed(){ //已处理

            },
            monthAtView(index, row){
                this.viewVisible=true;
                this.detailList=row;
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            compCurChange(val) {
                this.page = val;
                this.getAttendance();
            },
            monAttCurChange(val) {
                this.page = val;
                this.getMonthAttend();
            },
            getCurTime(){
                let d = new Date();
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                this.secValue=year+'年';
                this.monthNum=month;
            },


        },
        mounted(){
            this.getCurTime();
            this.getAttendance();
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
        div{
            margin: 10px 6px 20px;
        }
    }
    .allWid{
        img{
            height: 80px;
            margin-right: 15px;
        }
    }
</style>