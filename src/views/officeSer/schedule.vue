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
                <!--<el-form-item>-->
                    <!--<el-button type="success" @click="importDetails">导入考勤明细</el-button>-->
                <!--</el-form-item>-->
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
                    <span @click="perSched(scope.$index, scope.row)" style="color: #00a2d4;cursor: pointer;">{{scope.row.addInfo.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="addInfo.position" label="职务" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.infoTreeInfo.name" label="部门" sortable>
            </el-table-column>
            <template v-for="(data ,index) in datas">
                <el-table-column :label="data" width="120" style="text-align: center;">
                    <template slot-scope="scope">
                      <span @click="individualSet(scope.$index, scope.row,index)" style="width: 100%;display: inline-block;">
                          {{scope.row.addInfo.scheduleInfo && scope.row.addInfo.scheduleInfo[data.slice(0,10)]?scope.row.addInfo.scheduleInfo[data.slice(0,10)]:'-' }}
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
                           :page-sizes="[8,10,20,50]"
                           :page-size="pagesize"
                           layout="total,sizes, prev, pager, next, jumper"
                           :total="scheduleTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--排班成员设置-->
        <el-dialog :title=addEditTitle :visible.sync="proScheSetVisible">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-tree
                            class="expand-tree"
                            :data="dataTree"
                            node-key="id"
                            ref="tree"
                            :props="defaultProps"
                            highlight-current
                            default-expand-all
                            :expand-on-click-node="false"
                            :default-expanded-keys="defaultExpandKeys"
                            @node-click="handleNodeClick">
                    </el-tree>
                </el-col>
                <el-col :span="12" v-if="showDepart">
                    <span class="departTitle">{{nodes.name}}：</span>
                    <el-checkbox-group v-model="checkList" class="department">
                        <el-checkbox v-for="item in userList" :label="item.addInfo.name" :key="item.id" @change="secChange(item.id,item.addInfo.name)"></el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>

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
                                <span v-if="perScheForm.addInfo.scheduleInfo &&  perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='早班'" class="zao-active">{{ dayobject.day.getDate() }}</span>
                                <span v-else-if="perScheForm.addInfo.scheduleInfo &&  perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='中班'" class="zh-active">{{ dayobject.day.getDate() }}</span>
                                <span v-else-if="perScheForm.addInfo.scheduleInfo &&  perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='晚班'" class="wan-active">{{ dayobject.day.getDate() }}</span>
                                <span v-else-if="perScheForm.addInfo.scheduleInfo &&  perScheForm.addInfo.scheduleInfo[dayobject.day.getFullYear()+'-'+lt(parseInt(dayobject.day.getMonth()+1))+'-'+lt(dayobject.day.getDate())] =='休息'" class="xiu-active">{{ dayobject.day.getDate() }}</span>
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
                <el-form-item>
                    <ul class="group">
                        <li @change="change">
                            <input type="radio" name="schRadio" id="zao" value="早班" v-model="individualForm.checkValue">
                            <label for="zao">早班</label>
                        </li>
                        <li @change="change">
                            <input type="radio" name="schRadio" id="zhong" value="中班" v-model="individualForm.checkValue">
                            <label for="zhong">中班</label>
                        </li>
                        <li @change="change">
                            <input type="radio" name="schRadio" id="wan" value="晚班" v-model="individualForm.checkValue">
                            <label for="wan">晚班</label>
                        </li>
                        <li @change="change">
                            <input type="radio" name="schRadio" id="xiu" value="休息" v-model="individualForm.checkValue">
                            <label for="xiu">休息</label>
                        </li>
                        <li @change="change">
                            <input type="radio" name="schRadio" id="bei" value="备注" v-model="individualForm.checkValue">
                            <label for="bei">备注</label>
                        </li>
                        <li>
                            <el-input  :number="true" width="50" v-model="individualForm.value" :disabled=isdisabled></el-input>
                        </li>
                    </ul>
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
    import TreeRender from '../../components/tree-render';
    import {schedListUrl,scheChange, treeUrl, findUserUrl, upSchUrl, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        data(){
            return {
                showDepart:false,//显示部门人员
                nodes:'',//选中节点
                defaultExpandKeys:[],//默认展开节点列表
                page:1,
                pagesize:8,
                addEditTitle:'排班成员设置',
                isEdit:false,
                isEditId:'',
                proScheSetVisible:false,
                workBookAEForm:{
                    title:''
                },
                scheduleList:[],
                moreList:[],
                week:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
                datas:[],
                sels:[],   //列表选中项
                schduleLoading:false,
                annouAELoading:false,
                scheduleTotal:1,
                fileList:[],
                individualVisible:false,
                individualForm:{
                    checkValue:'',
                    value:''
                },
                individualLoading:false,
                isdisabled:true,

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
                        name: '总经办',
                        children: [
                            {
                                name: '周董',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        name: '策划部',
                        children: [
                            {
                                name: '李总',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        name: '运营部',
                        children: [
                            {
                                name: '企业服务部',
                                children: [{
                                    name: '李潇潇'
                                }]
                            },
                            {
                                name: '保安服务部',
                                children: [
                                    {name: '李国'},
                                    {name: '李明'},
                                    {name: '李靖'},
                                    {name: '周杰'},
                                    {name: '周黑鸭'}
                                ]
                            }
                        ]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dataIndex:0,
                checkList:[],
                userList:[
                    {
                        id:1,
                        addInfo:{
                            name:'jack'
                        }
                    },
                    {
                        id:2,
                        addInfo:{
                            name:'rose'
                        }
                    },
                    {
                        id:3,
                        addInfo:{
                            name:'marton'
                        }
                    },
                ],
            }
        },
        methods:{
            initExpand(){
                this.dataTree.map((a) => {
                    this.defaultExpandKeys.push(a.id)
                });
                this.isLoadingTree = true;
            },
            renderContent(h,{node,data,store}){//加载节点
                let that = this;
                return h(TreeRender,{
                    props: {
                        DATA: data,
                        NODE: node,
                        STORE: store,
                        maxexpandId: that.non_maxexpandId
                    },
                    // on: {
                    //     nodeAdd: ((s,d,n) => that.handleAdd(s,d,n)),
                    //     nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
                    //     nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
                    // }
                });
            },
            handleAddTop(){
                this.dataTree.push({
                    id: ++this.maxexpandId,
                    name: '新增节点',
                    pid: '',
                    isEdit: false,
                    children: []
                })
            },
            handleAdd(s,d,n){//增加节点
                if(n.level >=6){
                    this.$message.error("最多只支持五级！")
                    return false;
                }
                //添加数据
                d.children.push({
                    id: ++this.maxexpandId,
                    name: '新增节点',
                    pid: d.id,
                    isEdit: false,
                    children: []
                });
                //展开节点
                if(!n.expanded){
                    n.expanded = true;
                }
            },
            handleEdit(s,d,n){//编辑节点
                console.log(s,d,n)
            },
            handleDelete(s,d,n){//删除节点
                let that = this;
                //有子级不删除
                if(d.children && d.children.length !== 0){
                    this.$message.error("此节点有子级，不可删除！")
                    return false;
                }else{
                    //新增节点直接删除，否则要询问是否删除
                    let delNode = () => {
                        let list = n.parent.data.children || n.parent.data,//节点同级数据
                            _index = 99999;//要删除的index
                        /*if(!n.parent.data.children){//删除顶级节点，无children
                          list = n.parent.data
                        }*/
                        list.map((c,i) => {
                            if(d.id == c.id){
                                _index = i;
                            }
                        })
                        let k = list.splice(_index,1);
                        //console.log(_index,k)
                        this.$message.success("删除成功！")
                    }
                    let isDel = () => {
                        that.$confirm("是否删除此节点？","提示",{
                            confirmButtonText: "确认",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            delNode()
                        }).catch(() => {
                            return false;
                        })
                    }
                    //判断是否新增
                    d.id > this.non_maxexpandId ? delNode() : isDel()

                }
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            handleNodeClick(d,n,s){//点击节点
                this.nodes=d;
                d.isEdit = false;//放弃编辑状态
                this.showDepart=true;
                let url=findUserUrl+this.nodes.id;
                this.getUser(url);
            },
            getUser(url){// 获取用户列表
                this.$get(url)
                    .then((res) => {
                        this.userList=res;
                    })

            },
            initData: function(cur) {
                let leftcount=0; //存放剩余数量
                let date;
                if (cur) {
                    date = new Date(cur);
                } else {
                    let now=new Date();
                    let d = new Date(this.formatDateCalendar(now.getFullYear() , now.getMonth() , 1));
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
                let str = this.formatDateCalendar(this.currentYear , this.currentMonth, this.currentDay);
                this.days.length = 0;
                // 今天是周日，放在第一行第7个位置，前面6个
                //初始化本周
                for (let i = this.currentWeek - 1; i >= 0; i--) {
                    let d = new Date(str);
                    d.setDate(d.getDate() - i);
                    let dayobject={}; //用一个对象包装Date对象  以便为以后预定功能添加属性
                    dayobject.day=d;
                    this.days.push(dayobject);//将日期放入data 中的days数组 供页面渲染使用
                }
                //其他周
                for (let i = 1; i <= 42 - this.currentWeek; i++) {
                    let d = new Date(str);
                    d.setDate(d.getDate() + i);
                    let dayobject={};
                    dayobject.day=d;
                    this.days.push(dayobject);
                }
            },
            lt(d){
                return  d<10 ? '0' + d: '' + d;
            },
            formatDateCalendar: function(year,month,day){
                let y = year;
                let m = month;
                if(m<10) m = "0" + m;
                let d = day;
                if(d<10) d = "0" + d;
                return y+"-"+m+"-"+d
            },
            importDetails(){//导入考勤明细

            },
            formatDate(date) {  //格式化日期：yyyy-MM-dd
                let myyear = date.getFullYear();
                let mymonth = date.getMonth() + 1;
                let myweekday = date.getDate();
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
                this.diffOrNot(this.datas);
            },
            diffOrNot(datas){
                let a=new Date(datas[0].slice(0,10))
                let b=new Date(datas[6].slice(0,10))
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
                    let url=schedListUrl+aYear+'-'+aMon;
                    this.getScheduleList(url);
                }else if(aMon!==bMon){
                    this.initData(aYear+'-'+aMon+'-'+'01')
                    let url=schedListUrl+aYear+'-'+aMon;
                    let url2=schedListUrl+bYear+'-'+bMon;
                    this.schduleLoading=true;
                    this.$get(url2)
                        .then((res) => {
                            this.moreList=res;
                            this.$get(url)
                                .then((res) => {
                                    this.scheduleList=res;
                                    this.scheduleList.forEach((item)=>{
                                        this.moreList.forEach((item2)=>{
                                            if(item.id===item2.id){
                                                if(item.addInfo.scheduleInfo || item2.addInfo.scheduleInfo){
                                                    item.addInfo.scheduleInfo=Object.assign({},item.addInfo.scheduleInfo, item2.addInfo.scheduleInfo);
                                                }
                                            }
                                        })
                                    });
                                    this.scheduleTotal=this.scheduleList.length>0?this.scheduleList.length:1;
                                    this.schduleLoading=false;
                                })
                        })

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
                if(this.datas[0]){
                    this.diffOrNot(this.datas);
                }else{
                    this.getScheduleList(url);
                }
            },
            getScheduleList(url){//列表数据
                this.schduleLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.scheduleList=res;
                        this.scheduleTotal=this.scheduleList.length>0?this.scheduleList.length:1;
                        this.schduleLoading=false;
                    })
            },
            getTree(){//组织架构信息
                let type='&type=组织架构';
                this.$get(treeUrl+type).then((res)=>{
                    this.dataTree=res;
                })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            perSched(index, row) {//显示编辑界面
                this.perScheVisible = true;
                this.perScheForm = Object.assign({}, row);
                this.perSchedule=this.perScheForm.addInfo.name+' - '+this.datas[0].slice(0,4)+'年'+this.datas[0].slice(5,7)+'月 排班';
            },
            individualSet(index, row,ind){//显示个人设置界面
                this.individualVisible=true;
                this.individualForm=Object.assign({},row);
                this.dataIndex=ind;
                this.individualForm.checkValue=row.addInfo.scheduleInfo && row.addInfo.scheduleInfo[this.datas[ind].slice(0,10)]?row.addInfo.scheduleInfo[this.datas[ind].slice(0,10)]:''
                if(this.individualForm.checkValue!==''){
                    this.isEdit=true;
                    this.isEditId=this.individualForm.addInfo.scheduleId;
                }else{
                    this.isEdit=false;
                }
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
            },
            change(){
                this.isdisabled=this.individualForm.checkValue==='备注'?false:true;
            },
            individualSubmit(){//个人设置
                this.individualLoading=true;
                if(this.individualForm.checkValue==='备注'){
                    this.individualForm.checkValue=this.individualForm.value
                }
                let a=this.datas[this.dataIndex].slice(0,10);
                let b=this.individualForm.checkValue;
                let c=JSON.parse('{"'+a+'":"'+b+'"}');
                let data={
                    parkId:localStorage.getItem("parkId"),
                    schedDate:this.datas[this.dataIndex].slice(0,7),
                    userId:this.individualForm.id,
                    addInfo:c
                };
                if(this.isEdit){
                    data.scheduleId=this.isEditId;
                }
                this.$post(scheChange,data)
                    .then((res)=>{
                        this.individualLoading = false;
                        this.individualVisible = false;
                        this.getSchedule();
                    });
            },
            secChange(id,name){
                let data=[];
                if(this.checkList.indexOf(name)!==-1){
                    data=[{
                        userId:id,
                        isScheduling:"1"
                    }];
                }else{
                    data=[{
                        userId:id,
                        isScheduling:"0"
                    }];
                }
                this.updateSchedule(data);
            },
            updateSchedule(data){
                this.$post(upSchUrl,data)
                    .then((res)=>{
                        this.getSchedule();
                    });
            },

        },
        mounted(){
            this.getSchedule();   //排班列表
            let now = new Date(); //当前日期
            let week = -now.getDay()+1; //今天本周的第几天
            this.changeWeek(now,week);
            this.getTree(); //组织架构信息
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
    .el-radio-group .el-input{
        width: 50%;
    }
    .group{
        li{
            display: inline-block;
            width: 48%;
        }
    }
    .departTitle{
        display: inline-block;
        margin: 0 0 10px;
        font-weight: bold;
    }
    .department{
        .el-checkbox{
            display: inline-block;
            width: 48%;
            margin: 4px 0;
        }
    }
</style>
