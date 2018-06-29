<template>
    <section>
        <el-col :span="24" justify="center">
           班次说明：
            <span class="warning">早班</span>（6:00-14:00）
            <span class="warning">中班</span>（14:00-22:00）
            <span class="info">晚班</span>（22:00-6:00）
            <span class="success">休息</span>
            <span class="right">（排班中可备注的特殊情况：请假、外出、出差）</span>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="scheduleSet">排班人员设置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="importDetails">导入考勤明细</el-button>
                </el-form-item>
                <el-form-item class="right">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-arrow-left" @click="toLastWeek">上一周</el-button>
                        <el-button type="primary" @click="toNextWeek">下一周<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
                </el-form-item>

            </el-form>

        </el-col>
        <!--列表-->
        <el-table :data="scheduleList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="schduleLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="addInfo.name" label="姓名" sortable>
                <template slot-scope="scope">
                    <span @click="perSched(scope.$index, scope.row)" style="color: #00a2d4;">{{scope.row.addInfo.nickName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="addInfo.position" label="职务" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.department" label="部门" sortable>
            </el-table-column>
            <template v-for="(data ,index) in datas">
                <el-table-column :label="data" width="120" style="text-align: center;">
                    <template slot-scope="scope">
                      <!--<span v-if="scope.row.addInfo.scheduleInfo[data.slice(0,10)]" @click="individualSet(scope.$index, scope.row)" style="width: 100%;display: inline-block;">-->
                          <!--{{scope.row.addInfo.scheduleInfo[data.slice(0,10)]}}-->
                      <!--</span>-->
                      <!--<span v-else @click="individualSet(scope.$index, scope.row)" style="width: 100%;display: inline-block;">-->
                          <!-- - -->
                      <!--</span>-->
                      <span @click="individualSet(scope.$index, scope.row)" style="width: 100%;display: inline-block;">
                          {{scope.row.addInfo.scheduleInfo[data.slice(0,10)]?scope.row.addInfo.scheduleInfo[data.slice(0,10)]:'-' }}
                           <!--121-->
                      </span>
                    </template>
                </el-table-column>
            </template>

        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[7,8,10,20]"
                           :page-size="pagesize"
                           layout="total,sizes, prev, pager, next, jumper"
                           :total="scheduleTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--排班成员设置-->
        <el-dialog :title=addEditTitle :visible.sync="proScheSetVisible">
            <el-tree
                    :data="dataTree"
                    :props="defaultProps"
                    node-key="id"
                    ref="tree"
                    show-checkbox
                    @check-change="handleCheckChange">
            </el-tree>
            <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
            <!--<el-button @click="getCurrentNode">当前获取</el-button>-->
            <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
        </el-dialog>
        <!--个人当前月排班-->
        <el-dialog :title=perSchedule :visible.sync="perScheVisible">
            <el-form :model="perScheForm" label-width="0px" ref="perScheForm">
                <ul class="tag">
                    <li><b class="zao-shift"></b>早班</li>
                    <li><b class="zh-shift"></b>中班</li>
                    <li><b class="wan-shift"></b>晚班</li>
                    <li><b class="xiu-shift"></b>休息</li>
                </ul>
                <div id="calendar">
                    <ul class="weekdays">
                        <li>星期一</li>
                        <li>星期二</li>
                        <li>星期三</li>
                        <li>星期四</li>
                        <li>星期五</li>
                        <li>星期六</li>
                        <li>星期日</li>
                    </ul>
                    <!-- 日期 -->
                    <ul class="days">
                        <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
                        <li  v-for="dayobject in days">
                            <!--本月-->
                            <!--如果不是本月  改变类名加灰色-->
                            <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
                            <!--如果是本月  还需要判断是不是这一天-->
                            <span v-else>
                            <!--今天  同年同月同日-->
                                        <!--<span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>-->
                            <span v-if="perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='早班'" class="zao-active">{{ dayobject.day.getDate() }}</span>
                            <span v-else-if="perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='中班'" class="zh-active">{{ dayobject.day.getDate() }}</span>
                            <span v-else-if="perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='晚班'" class="wan-active">{{ dayobject.day.getDate() }}</span>
                            <span v-else-if="perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='休息'" class="xiu-active">{{ dayobject.day.getDate() }}</span>
                            <span v-else>{{ dayobject.day.getDate() }}</span>
                        </span>
                        </li>
                    </ul>
                </div>
            </el-form>
        </el-dialog>
        <!--个人排班设置-->
        <el-dialog :visible.sync="individualVisible" width="20%">
            <el-form :model="individualForm" label-width="0px" ref="individualForm">
                <el-form-item prop="resource">
                    <el-radio-group v-model="individualForm.resource">
                        <el-radio label="早班"></el-radio>
                        <el-radio label="中班"></el-radio>
                        <el-radio label="晚班"></el-radio>
                        <el-radio label="休息"></el-radio>
                        <el-radio label="备注"></el-radio>
                        <el-input  :number="true" size="large" v-model="individualForm.priceValue" :disabled=isdisabled></el-input>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="individualVisible = false">取消</el-button>
                <el-button type="primary" @click.native="individualSubmit" :loading="individualLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script type="text/ecmascript-6">
    import UE from '../../components/ue'
    import {schedListUrl, userListUrl, showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                page:1,
                pagesize:7,
                addEditTitle:'排班成员设置',
                isEdit:false,
                isEditId:'',
                proScheSetVisible:false,
                workBookAEForm:{
                    title:''
                },
                scheduleList:[
                    {
                        addInfo:{
                            nickName:'张三',
                            position:'部门经理',
                            department:'研发部门',
                            scheduleInfo:{
                                "2018-06-05":"早班",
                                "2018-06-06":"中班",
                                "2018-06-07":"晚班",
                                "2018-06-08":"休息",
                            }
                        }                      
                    },
                    {
                        addInfo:{
                            nickName:'张三',
                            position:'部门经理',
                            department:'研发部门',
                            scheduleInfo:{
                                "2018-06-05":"中班",
                                "2018-06-06":"晚班",
                                "2018-06-07":"晚班",
                                "2018-06-08":"中班",
                            }
                        }
                    },
                    {
                        addInfo:{
                            nickName:'张四',
                            position:'总经理',
                            department:'研发部门',
                            scheduleInfo:{
                                "2018-06-01":"早班",
                                "2018-06-02":"早班",
                                "2018-06-03":"早班",
                                "2018-06-04":"早班",
                                "2018-06-05":"晚班",
                                "2018-06-06":"晚班",
                                "2018-06-07":"晚班",
                                "2018-06-08":"晚班",
                            }
                        }
                    }
                ],
                moreList:[
                    {
                        "2018-05-01":"晚班1",
                        "2018-05-02":"晚班2",
                        "2018-05-08":"晚班8"
                    },
                    {
                        "2018-05-05":"中班",
                        "2018-05-06":"中班",
                        "2018-05-07":"中班",
                        "2018-05-08":"中班",
                    }
                ],
                week:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
                datas:[
                    "2018-05-28 星期一",
                    "2018-05-29 星期二",
                    "2018-05-30 星期三",
                    "2018-05-31 星期四",
                    "2018-06-01 星期五",
                    "2018-06-02 星期六",
                    "2018-06-03 星期日"
                ],
                sels:[],   //列表选中项
                schduleLoading:false,
                annouAELoading:false,
                scheduleTotal:1,
                fileList:[],
                individualVisible:false,
                individualForm:{
                    resource:'',
                    priceValue:''
                },
                individualLoading:false,
                isdisabled:false,

                currentYear: 1970,   // 年份
                currentMonth: 1,  // 月份
                currentDay: 1,    // 日期
                currentWeek: 1,    // 星期
                days: [],
                perSchedule:'',     //个人排班标题
                perScheVisible:false,
                perScheForm:{
                    addInfo:{
                        scheduleInfo:{}
                    }
                },
                dataTree: [
                    {
                        label: '总经办',
                        children: [
                            {
                                label: '周董',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        label: '策划部',
                        children: [
                            {
                                label: '李总',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        label: '运营部',
                        children: [
                            {
                                label: '企业服务部',
                                children: [{
                                    label: '李潇潇'
                                }]
                            },
                            {
                                label: '保安服务部',
                                children: [
                                    {label: '李国'},
                                    {label: '李明'},
                                    {label: '李靖'},
                                    {label: '周杰'},
                                    {label: '周黑鸭'}
                                ]
                            }
                        ]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                userList:[],
            }
        },
        methods:{
            initData: function(cur) {
                var leftcount=0; //存放剩余数量
                var date;
                if (cur) {
                    date = new Date(cur);
                } else {
                    var now=new Date();
                    var d = new Date(this.formatDateCalendar(now.getFullYear() , now.getMonth() , 1));
                    d.setDate(35);
                    date = new Date(this.formatDateCalendar(d.getFullYear(),d.getMonth() + 1,1));
                }
                this.currentDay = date.getDate();
                this.currentYear = date.getFullYear();
                this.currentMonth = date.getMonth() + 1;
                this.currentWeek = date.getDay(); // 1...6,0
                if (this.currentWeek == 0) {
                    this.currentWeek = 7;
                }
                var str = this.formatDateCalendar(this.currentYear , this.currentMonth, this.currentDay);
                this.days.length = 0;
                // 今天是周日，放在第一行第7个位置，前面6个
                //初始化本周
                for (var i = this.currentWeek - 1; i >= 0; i--) {
                    var d = new Date(str);
                    d.setDate(d.getDate() - i);
                    var dayobject={}; //用一个对象包装Date对象  以便为以后预定功能添加属性
                    dayobject.day=d;
                    this.days.push(dayobject);//将日期放入data 中的days数组 供页面渲染使用
                }
                //其他周
                for (var i = 1; i <= 42 - this.currentWeek; i++) {
                    var d = new Date(str);
                    d.setDate(d.getDate() + i);
                    var dayobject={};
                    dayobject.day=d;
                    this.days.push(dayobject);
                }
            },
            lt(d){
                return  d<10 ? '0' + d: '' + d;
            },
            formatDateCalendar: function(year,month,day){
                var y = year;
                var m = month;
                if(m<10) m = "0" + m;
                var d = day;
                if(d<10) d = "0" + d;
                return y+"-"+m+"-"+d
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            getCheckedNodes() {
                console.log(this.$refs.tree.getCheckedNodes());
            },
            getCurrentNode() {
                console.log(this.$refs.tree.getCurrentNode());
            },
            getCheckedKeys() {
                console.log(this.$refs.tree.getCheckedKeys());
            },
            importDetails(){//导入考勤明细

            },
            formatDate(date) {  //格式化日期：yyyy-MM-dd
                var myyear = date.getFullYear();
                var mymonth = date.getMonth() + 1;
                var myweekday = date.getDate();
                if (mymonth < 10) {
                    mymonth = "0" + mymonth;
                }
                if (myweekday < 10) {
                    myweekday = "0" + myweekday;
                }
                return (myyear + "-" + mymonth + "-" + myweekday);
            },
            toLastWeek(){//上一周
                let now=new Date(this.datas[0].slice(0,10));
                this.changeWeek(now,-7);
            },
            changeWeek(now,val){
                let wDate=new Date(now.setDate(now.getDate()+val))
                this.datas.length=0;
                let day=1;
                this.datas.push(this.formatDate(wDate)+' '+this.week[0])
                for(let i=1;i<7;i++){
                    const d=wDate;
                    d.setDate(d.getDate()+1)
                    let year=d.getFullYear();
                    year += (year < 2000) ? 1900 : 0; //
                    let month=d.getMonth()+1;
                    month=month<10?'0'+month:''+month;
                    let aDay = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate(); //
                    let astr=year+'-'+month+'-'+aDay+' '+this.week[i%7];
                    this.datas.push(astr);
                }
                let a=new Date(this.datas[0].slice(0,10))
                let b=new Date(this.datas[6].slice(0,10))
                let aMon=a.getMonth()+1;
                aMon=aMon<10?'0'+aMon:''+aMon;
                let aYear=a.getFullYear();
                aYear += (aYear < 2000) ? 1900 : 0;
                let bMon=b.getMonth()+1;
                bMon=bMon<10?'0'+bMon:''+bMon;
                let bYear=b.getFullYear();
                bYear += (bYear < 2000) ? 1900 : 0;
                // this.moreList.length=0;
                if(aMon===bMon){
                    this.initData(aYear+'-'+aMon+'-'+'01')
                    // console.log(true)
                    // console.log(aYear+aMon)
                    // console.log(bYear+bMon)
                    // this.scheduleList.forEach((item)=>{
                    //    // this.moreList.push(item.addInfo.scheduleInfo);
                    //    //  debugger;
                    //     this.moreList.forEach((childitem)=>{
                    //         // let obj = Object.assign(item.addInfo.scheduleInfo, childitem);
                    //         const list = [
                    //             ...item.addInfo.scheduleInfo,
                    //              ...childitem
                    //         ]
                    //         console.log(scheduleInfo)
                    //         // this.moreList.push(obj)
                    //     })
                    //     // let obj = Object.assign(item.addInfo.scheduleInfo, i);
                    //     // console.log(obj)
                    // })

                    // console.log(this.moreList)
                    // console.log("same month")
                }else{
                    this.initData(aYear+'-'+aMon+'-'+'01')
                    // console.log("different month")
                    // console.log('false')
                    // console.log(aYear+aMon)
                    // console.log(bYear+bMon)
                }

            },
            toNextWeek(){//下一周
                let now=new Date(this.datas[0].slice(0,10));
                this.changeWeek(now,7);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file,fileList) {
                console.log(file);
                console.log(fileList);
            },
            getQueryWorkBook(){ // 工作手册模糊查询

            },
            scheduleSet(){  //显示排班人员设置界面
                this.addEditTitle='排班成员设置';
                this.isEdit=false;
                this.proScheSetVisible=true;
                this.workBookAEForm={
                    title:''
                };
            },
            getSchedule(){    //排班列表
                let now=new Date();
                let year=now.getFullYear();
                year += (year < 2000) ? 1900 : 0; //
                let month=now.getMonth()+1;
                month=month<10?'0'+month:''+month;
                let url=schedListUrl+year+'-'+month;

                this.schduleLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.scheduleList=res;
                        this.scheduleTotal=this.scheduleList.length>0?this.scheduleList.length:1;
                        this.schduleLoading=false;
                    })
                console.log(this.scheduleList[0])
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            perSched(index, row) {//显示编辑界面
                this.perSchedule=row.addInfo.nickName+' - '+this.datas[0].slice(0,4)+'年'+this.datas[0].slice(5,7)+'月 排班';
                this.perScheVisible = true;
                this.perScheForm = Object.assign({}, row);
            },
            individualSet(index, row){//显示个人设置界面
                this.individualVisible=true;
                this.individualForm=Object.assign({},row);
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
                this.getSchedule();
            },
            individualSubmit(){//个人设置
                // this.individualLoading=true;

                this.individualLoading=false;
            },
            // getUser(url){// 获取用户列表
            //     // this.monthAttendanceLoading=true;
            //     this.$get(url)
            //         .then((res) => {
            //             this.userList=res;
            //             // this.monAttTotal=this.monthAttendList.length>0?this.monthAttendList.length:1;
            //             // this.monthAttendanceLoading=false;
            //         })
            //
            // },
        },
        mounted(){
            this.getSchedule();   //排班列表
            let now = new Date(); //当前日期
            let week = -now.getDay()+1; //今天本周的第几天
            this.changeWeek(now,week);
        }
    }
</script>

<style lang="scss">
    .right{
        float: right;
    }
    .el-radio-group{
        .el-radio{
            display: inline-block;
            width: 50%;
            margin: 10px 0;
        }
    }
    * {
        box-sizing: border-box;
    }
    ul {
        list-style-type: none;
    }
    body {
        font-family: Verdana, sans-serif;
        background: #E8F0F3;
    }
    .tag{
        margin-bottom: 15px;
        li{
            display: inline-block;
            margin-right: 10px;
            b{
                display: inline-block;
                width: 20px;
                height: 20px;
                background: #67c23a;
                margin-right: 5px;
                vertical-align: bottom;
                &.zh-shift{
                    background: #E6A23C;
                }
                &.wan-shift{
                    background: #F56C6C;
                }
                &.xiu-shift{
                    background: #909399;
                }
            }
        }
    }
    #calendar{
        width:100%;
        margin: 0 auto;
        border: 1px solid #ccc;
    }
    .weekdays {
        margin: 0;
        height: 50px;
        line-height: 50px;
        background-color: #dedede;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .weekdays li {
        display: inline-block;
        width: 13.6%;
        text-align: center;
    }
    .days {
        padding: 0;
        background: #FFFFFF;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .days li {
        list-style-type: none;
        display: inline-block;
        width: 14.2%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 1rem;
        color: #000;
    }
    .days li span{
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    .days li .active {
        background: #00B8EC;
        color: #fff;
    }
    .days li .zao-active {
        background: #67C23A;
        color: #fff;
    }
    .days li .zh-active {
        background: #E6A23C;
        color: #fff;
    }
    .days li .wan-active {
        background: #F56C6C;
        color: #fff;
    }
    .days li .xiu-active {
        background: #909399;
        color: #fff;
    }
    .days li .other-month {
        padding: 5px;
        color: gainsboro;
    }
</style>
