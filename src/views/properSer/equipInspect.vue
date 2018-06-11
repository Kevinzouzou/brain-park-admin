<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="巡检记录" name="first">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="inspectFilters">
                        <el-form-item>
                            <div class="block">
                                <el-date-picker v-model="timeValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="inspectFilters.searchTitle" placeholder="设备名称搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getInspection">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    巡检记录
                </el-col>
                <!--列表-->
                <el-table :data="inspectList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="inspectLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.equipmentInfo.name" label="设备名称" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.equipmentInfo.location" label="设备地点" sortable show-overflow-tooltip="">
                    </el-table-column>
                    <el-table-column prop="user" label="巡检人" sortable>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="巡检时间" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="success" size="small" @click="inspectView(scope.$index, scope.row)">查看</el-button>
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
                                   :total="inspectTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--查看界面-->
                <el-dialog class="inView" title="巡检详情" :visible.sync="viewVisible" width="70%">
                    <span class="right">{{detailList.state}}</span>
                    <el-form label-width="90px">
                        <el-form-item label="设备名称：">
                            {{detailList.addInfo.equipmentInfo.name}}
                        </el-form-item>
                        <el-form-item label="设备编号：">
                            {{detailList.addInfo.equipmentInfo.serial}}
                        </el-form-item>
                        <el-form-item label="设备地址：">
                            {{detailList.addInfo.equipmentInfo.location}}
                        </el-form-item>
                        <el-form-item label="巡检时间：">
                            {{detailList.createTime}}
                        </el-form-item>
                        <el-form-item label="巡检人：">
                            {{detailList.user}}
                        </el-form-item>
                        <el-form-item label="巡检记录：">
                            {{detailList.remark}}
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="设备管理" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="deviceFilters">
                        <el-form-item>
                            <div class="block">
                                <el-date-picker v-model="timeDeviceValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="deviceFilters.searchTitle" placeholder="标题搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getDevice">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="deviceAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="deviceList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="deviceLoading" style="width: 100%;">
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="name" label="设备名称" sortable>
                    </el-table-column>
                    <el-table-column prop="serial" label="设备编号" sortable>
                    </el-table-column>
                    <el-table-column prop="location" label="设备地址" sortable show-overflow-tooltip="">
                    </el-table-column>
                    <el-table-column prop="duration" label="巡检周期（天）" sortable>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="success" size="small" @click="deviceInspect(scope.$index, scope.row)">巡检</el-button>
                            <el-button type="info" size="small" @click="deviceEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="deviceDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="sizeChange"
                                   @current-change="deviceCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="deviceTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--巡检界面-->
                <el-dialog class="devInspec" title="巡检" :visible.sync="decViewVisible" width="70%">
                    <div class="devices">
                        <span>设备名称：{{deviceDetailList.name}}</span>
                        <span>设备编号：{{deviceDetailList.serial}}</span>
                        <span>设备地址：{{deviceDetailList.location}}</span>
                        <span>巡检周期（天）：{{deviceDetailList.duration}}</span>
                    </div>
                    <div class="pullRight">
                        <span>累计巡检：<b>{{deviceData.length}}（次）</b></span>
                        <span>异常：<b class="red">{{deviceData.abnum}}（次）</b></span>
                    </div>
                    <el-table :data="deviceData" highlight-current-row v-loading="deviceDataLoading">
                        <el-table-column type="index" ></el-table-column>
                        <el-table-column property="user" label="巡检人"></el-table-column>
                        <el-table-column property="state" label="设备状态"></el-table-column>
                        <el-table-column prop="remark" label="备注" ></el-table-column>
                        <el-table-column prop="createTime" label="巡检时间" ></el-table-column>
                    </el-table>
                    <el-pagination class="el-pages" background
                                   @size-change="sizeChange"
                                   @current-change="devCurrentChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total,sizes, prev, pager, next, jumper"
                                   :current-page="page"
                                   :total="devDataTotal">

                    </el-pagination>
                </el-dialog>
                <!--新增/编辑界面-->
                <el-dialog :title=addEditTitle :visible.sync="deviceAEVisible">
                    <el-form :model="deviceAEForm" label-width="80px" ref="deviceAEForm">
                        <el-form-item label="设备名称" prop="name">
                            <el-input v-model="deviceAEForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="巡检周期" prop="duration">
                            <el-input v-model="deviceAEForm.duration" auto-complete="off">
                                <template slot="append">（天）</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="设备地址" prop="location">
                            <el-input v-model="deviceAEForm.location" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="设备编号" prop="serial">
                            <el-input v-model="deviceAEForm.serial" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="success" @click="printQrCode">生成并打印设备二维码</el-button>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="deviceAEVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addDeviceSubmit" :loading="deviceAELoading">提交</el-button>
                    </div>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import {inspectUrl,equipUrl,delEquip,addEquip, showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
        data(){
            return {
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                dialogImageUrl: '',
                dialogVisible: false,
                page:1,
                pagesize:7,
                activeName:'first',
                inspectFilters: {
                    searchTitle: ''
                },
                deviceFilters: {
                    searchTitle: ''
                },
                timeValue:[],
                timeDeviceValue:[],
                inspectList:[
                    {
                        time:'',
                        addInfo:{
                            companyName:'',
                            industry:''
                        }
                    }
                ],
                deviceList:[
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
                inspectLoading:false,
                deviceLoading:false,
                deviceDataLoading:false,
                viewVisible:false,
                decViewVisible:false,
                detailList:{
                    state:'',
                    createTime:'',
                    user:'',
                    remark:'',
                    addInfo:{
                        equipmentInfo:{
                            location:'',
                            name:'',
                            serial:''
                        }
                    }
                },
                deviceDetailList:{
                    name:'',
                    serial:'',
                    location:'',
                    duration:''
                },
                inspectTotal:1,
                deviceTotal:1,
                deviceAEVisible:false,
                deviceAEForm:{
                    name:'',
                    duration:'',
                    location:'',
                    serial:''
                },
                deviceData:[
                    {
                        user:'张三',
                        state:'正常',
                        remark:'运行正常',
                        createTime:'2018-05-05 12:30:33'
                    }
                ],
                devDataTotal:1,
                insNum:10, //累计巡检次数
                abnorNum:3, //异常登记次数
                deviceAELoading:false,

            }
        },
        methods:{
            printQrCode(){ //生成并打印设备二维码
                console.log("qrCode")
            },
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                this.page=1;
            },
            getInspection(){ //巡检记录数据
                this.inspectLoading=true;
                this.$get(inspectUrl)
                    .then((res) => {
                        this.inspectList=res;
                        this.inspectTotal=this.inspectList.length>0?this.inspectList.length:1;
                        this.inspectLoading=false;
                    })
            },
            getDevice(){ //设备管理列表
                this.deviceLoading=true;
                this.$get(equipUrl)
                    .then((res) => {
                        this.deviceList=res;
                        this.deviceTotal=this.deviceList.length>0?this.deviceList.length:1;
                        this.deviceLoading=false;
                    })
            },
            getDeviceData(){ //设备管理 巡检列表
                this.deviceDataLoading=true;
                // this.$get(equipUrl)
                //     .then((res) => {
                //         this.deviceData=res;
                //         this.devDataTotal=this.deviceData.length>0?this.deviceData.length:1;
                //         this.deviceDataLoading=false;
                //     })
            },
            allDeal(){ //全部
                this.getInspection();
            },
            pending(){ //待处理

            },
            processed(){ //已处理

            },
            deviceAdd(){ //显示新增
                this.addEditTitle='新增';
                this.isEdit=false;
                this.deviceAEVisible=true;
                this.deviceAEForm={
                    name:'',
                    duration:'',
                    location:'',
                    serial:''
                };
            },
            inspectView(index, row){
                this.viewVisible=true;
                this.detailList=row;
            },
            deviceInspect(index, row){
                this.decViewVisible=true;
                this.deviceDetailList=row;
                let serialValue='';
                if(this.deviceDetailList.serial!==''){
                    serialValue=this.deviceDetailList.serial;
                }
                let url=inspectUrl+'&nameOrSerial='+serialValue;
                this.$get(url)
                    .then((res) => {
                        this.deviceData=res;
                        let abnum=0;
                        this.devDataTotal=this.deviceData.length>0?this.deviceData.length:1;
                        this.deviceData.forEach((item)=>{
                            if(item.state==='异常'){
                                abnum++;
                            }
                        })
                        this.deviceData.abnum=abnum;
                    })
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            compCurChange(val) {
                this.page = val;
                this.getInspection();
            },
            devCurrentChange(val) { //巡检
                this.page = val;
                this.getDeviceData();
            },
            deviceCurChange(val) {
                this.page = val;
                this.getDevice();
            },
            addDeviceSubmit: function () {  //新增
                this.$refs.deviceAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.deviceAELoading = true;
                            let para = Object.assign({}, this.deviceAEForm);
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                name:this.deviceAEForm.name,
                                duration:this.deviceAEForm.duration,
                                location:this.deviceAEForm.location,
                                serial:this.deviceAEForm.serial,
                                addInfo:{}
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addEquip,data)
                                .then((res)=>{
                                    this.deviceAELoading = false;
                                    this.deviceAEVisible = false;
                                    this.getDevice();
                                })
                        });
                    }
                });
            },
            deviceEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.deviceAEVisible = true;
                this.deviceAEForm = Object.assign({}, row);
            },
            deviceDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.deviceLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(delEquip+para.id)
                        .then(function(response) {
                            self.deviceLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getDevice();
                            console.log("delete")
                        });
                }).catch(() => {

                });
            },

        },
        mounted(){
            this.getInspection();
            this.getDevice();
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
    .devInspec{
        .devices{
            display: inline-block;
            width: 70%;
            min-height: 50px;
            span{
                display: inline-block;
                margin-right: 25px;
                margin-bottom: 6px;
            }
        }
        .pullRight{
            width: 30%;
            height: 50px;
            text-align: right;
            float: right;
            display: inline-block;
            position: absolute;
            right: 23px;
            span{
                display: block;
                margin-bottom: 6px;
                .red{
                    color: #ff4d51;
                }
            }
        }
    }
</style>