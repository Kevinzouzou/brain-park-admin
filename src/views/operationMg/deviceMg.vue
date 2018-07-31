<template>
    <div>
        <div v-show="mainPageVisible">
            <el-col :span="24" justify="center">
                <el-form :inline="true" :model="deviceFilters">
                    <el-form-item>
                        <el-input v-model="deviceFilters.searchTitle" placeholder="设备名称搜索"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getQueryDevice">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        筛选：
                        <el-select v-model="deviceFilters.secFebackValue" placeholder="请选择" @change="secQueryFeBackValue">
                            <el-option v-for="item in feBackList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        状态：
                        <el-select v-model="deviceFilters.state" placeholder="请选择" @change="secQueryState">
                            <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="deviceAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="exportTable">导出到表格</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="importDevice">导入设备清单</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="deviceList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="deviceLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="设备名称" sortable width="180">
                </el-table-column>
                <el-table-column prop="type" label="类别" sortable width="120">
                </el-table-column>
                <el-table-column prop="location" label="设备位置" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="useTime" label="启用时间" sortable>
                </el-table-column>
                <el-table-column prop="state" label="状态" sortable width="120">
                </el-table-column>
                <el-table-column prop="addInfo.lastInspectionTime" label="最近巡检时间" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="deviceInspect(scope.$index, scope.row)">查看</el-button>
                        <el-button type="info" size="small" @click="normalStop(scope.$index, scope.row)" :disabled="scope.row.state==='故障' || scope.row.state==='报废'">
                            {{scope.row.state==='停用'?'正常':'停用'}}
                        </el-button>
                        <el-button type="danger" size="small" @click="qrCodeDevice(scope.$index, scope.row)">二维码</el-button>
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
        </div>
        <div v-show="secondPageVisible">
            <div style="text-align: right;">
                <el-button type="warning" @click="backMainPage">返回</el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="5" class="comImage">
                    <div v-if="detailList.addInfo.image">
                        <!--<img src="../../assets/guide.jpg">-->
                        <img :src="detailList.addInfo.image" @click="handlePictureCardPreview(detailList.addInfo.image)">
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-col>
                <el-col :span="18">
                    <el-form label-width="90px" class="detail">
                        <el-form-item label="设备名称：">
                            {{detailList.name || '无数据'}}
                        </el-form-item>
                        <el-form-item label="类别：">
                            {{detailList.type || '无数据'}}
                        </el-form-item>
                        <el-form-item label="设备位置：">
                            {{detailList.location || '无数据'}}
                        </el-form-item>
                        <el-form-item label="启用日期：">
                            {{detailList.useTime || '无数据'}}
                        </el-form-item>
                        <el-form-item label="设备描述：" class="allLength">
                            {{detailList.addInfo.info || '无数据'}}
                        </el-form-item>
                    </el-form>
                    <div class="groupBtns">
                        <el-button type="primary" plain @click="checkingDetail">巡检详情</el-button>
                        <el-button type="success" plain @click="checkingRecord">巡检记录</el-button>
                    </div>
                    <el-form label-width="110px" v-show="!inspectDetail" class="detail">
                        <el-form-item label="设备状态：">
                            {{detailList.state || '无数据'}}
                        </el-form-item>
                        <el-form-item label="最后巡检时间：">
                            {{detailList.addInfo.lastInspectionTime || '无数据'}}
                        </el-form-item>
                        <el-form-item label="巡检次数：">
                            {{detailList.inspectionNum || '无数据'}}
                        </el-form-item>
                        <el-form-item label="正常次数：">
                            {{detailList.normalSateNum || '无数据'}}
                        </el-form-item>
                        <el-form-item label="故障次数：">
                            {{detailList.unusualSateNum || '无数据'}}
                        </el-form-item>
                        <el-form-item label="故障率：">
                            {{detailList.faultRate || '无数据'}}
                        </el-form-item>
                    </el-form>
                    <el-table v-show="inspectDetail" :data="checkList" style="width: 100%" max-height="400">
                        <el-table-column prop="createTime" label="巡检时间" sortable>
                        </el-table-column>
                        <el-table-column prop="userName" label="巡检人" sortable>
                        </el-table-column>
                        <el-table-column prop="state" label="巡检结果" sortable>
                        </el-table-column>
                        <el-table-column prop="remark" label="描述" sortable>
                        </el-table-column>
                    </el-table>
                    <div class="changeBtn">
                        <el-button type="primary" @click="editDevice">修改</el-button>
                        <el-button type="danger" @click="delDevice">删除</el-button>
                    </div>
                </el-col>
            </el-row>

        </div>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="deviceAEVisible" class="detail" width="45%">
            <el-form :model="deviceAEForm" label-width="90px" ref="deviceAEForm" :rules="rules">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="deviceAEForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="type">
                    <el-select v-model="deviceAEForm.type" placeholder="请选择">
                        <el-option v-for="item in feBackList.slice(1)" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备图片" class="allLength">
                    <el-upload :action=picUrl list-type="picture-card" :data="othParams" ref="upload"
                               :on-preview="handlePicPreview" :on-remove="handleRemove"
                               :file-list="imgAnList" :on-success="moreShow">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogAnVisible">
                        <img width="100%" :src="dialogAnImageUrl" >
                    </el-dialog>
                </el-form-item>
                <el-form-item label="设备位置" prop="location" class="allLength">
                    <el-input v-model="deviceAEForm.location" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="启用日期" class="allLength" prop="useTime">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="deviceAEForm.useTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                    <el-button type="success" @click="secDayTime">今日</el-button>
                </el-form-item>
                <el-form-item label="设备描述" prop="addInfo.info" class="allLength">
                    <el-input type="textarea"  :rows="4" v-model="deviceAEForm.addInfo.info" placeholder="对设备进行描述" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备状态" prop="state">
                    <el-select v-model="deviceAEForm.state" placeholder="请选择">
                        <el-option v-for="item in stateList.slice(1)" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="deviceAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addDeviceSubmit" :loading="deviceAELoading">提交</el-button>
            </div>
        </el-dialog>
        <!--二维码-->
        <el-dialog title="生成设备ID的二维码" :visible.sync="qrDeviceVisible" width="35%">
            <div class="qrCode">
                <vue-qr :text="configvalue" :size="200" :margin="0"></vue-qr>
            </div>
            <div class="info">
                <span>{{detailList.id}}</span>
                <span>{{detailList.name}}</span>
                <span>{{detailList.type}}</span>
                <span>{{detailList.location}}</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="qrDeviceVisible = false">取消</el-button>
                <el-button type="primary" @click.native="savePath" :loading="qrDeviceLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import VueQr from 'vue-qr'
    import {uploadPic,inspectUrl,equipUrl,delEquip,addEquip, showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
        components:{VueQr},
        data(){
            return {
                othParams:{
                    bucketName:'shared-resource',
                    folderName:''
                },
                page:1,
                pagesize:7,
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                deviceFilters: {
                    searchTitle: '',
                    secFebackValue:'',
                    state:''
                },
                feBackList:[
                    {
                        id:'001',
                        name:'全部类别'
                    },
                    {
                        id:'002',
                        name:'电梯'
                    },
                    {
                        id:'003',
                        name:'消防设备'
                    },
                    {
                        id:'004',
                        name:'空调'
                    },
                    {
                        id:'005',
                        name:'门禁通道'
                    },
                    {
                        id:'006',
                        name:'停车场'
                    },
                ],
                stateList:[
                    {
                        id:'001',
                        name:'全部状态'
                    },
                    {
                        id:'002',
                        name:'正常'
                    },
                    {
                        id:'003',
                        name:'停用'
                    },
                    {
                        id:'004',
                        name:'故障'
                    },
                    {
                        id:'005',
                        name:'报废'
                    },
                ],
                deviceList:[
                    {
                        id:"1",
                        name:'公用电梯',
                        type:'电梯',
                        location:'东区一号楼大厅',
                        useTime:'2018-06-06 16:06:06',
                        state:'正常',
                        addInfo:{
                            lastInspectionTime:'2018-06-06 20:30:33',
                            image:'',
                            info:'设备很好很强大，效果很明显，上楼从此变得 so easy'
                        }
                    },
                ],
                detailList:{
                    id:1,
                    name:'公用电梯一',
                    type:'电梯',
                    location:'东区一号楼大厅',
                    useTime:'2018-05-30',
                    state:'正常',
                    addInfo:{
                        lastInspectionTime:'2018-06-06 19:30:20',
                        image:'',
                        info:'设备很好很强大，效果很明显，上楼从此变得 so easy',
                        inspectionNum:'',
                        normalSateNum:'',
                        unusualSateNum:'',
                        faultRate:'',
                    }
                },
                deviceLoading:false,
                deviceTotal:1,
                deviceAEVisible:false,
                qrDeviceVisible:false,
                deviceAEForm:{
                    name:'',
                    type:'',
                    location:'',
                    useTime:'',
                    state:'',
                    addInfo:{
                        image:'',
                        info:'',
                    }
                },
                deviceAELoading:false,
                qrDeviceLoading:false,
                mainPageVisible:true,
                secondPageVisible:false,
                dialogImageUrl: '',
                dialogVisible: false,
                inspectDetail:false,
                checkList:[
                    {
                        createTime:'2018-06-06 12:00:00',
                        userName:'唐宋',
                        state:'正常',
                        remark:'无'
                    },
                ],
                rules:{
                    name: [
                        { required: true, message: '请填写设备名称', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类别', trigger: 'change' }
                    ],
                    location: [
                        { required: true, message: '请填写设备位置', trigger: 'blur' }
                    ],
                    useTime: [
                        { type: 'string', required: true, message: '请选择启用日期', trigger: 'change' }
                    ]
                },
                imgAnList:[],
                dialogAnImageUrl: '',
                dialogAnVisible: false,
                picUrl:'',
                configvalue:'',
                morePicList:[],
                selectLabel:'',


            }
        },
        methods:{
            secDayTime(){//时间为当前时间
                let now=new Date();
                let year=now.getFullYear();
                year += (year < 2000) ? 1900 : 0; //
                let month=now.getMonth()+1;
                month=month<10?'0'+month:''+month;
                let day = now.getDate() <10 ? '0' + now.getDate() : '' + now.getDate(); //
                this.deviceAELoading=true;
                this.deviceAEForm.useTime=year+'-'+month+'-'+day;
                this.deviceAELoading = false;
            },
            handlePicPreview(file) {
                this.dialogAnImageUrl = file.url;
                this.dialogAnVisible = true;
            },
            handleRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            moreShow(res,file,fileList){
                this.morePicList.push(res.responseList.url);
            },
            normalStop(index,row){//正常或停用
                this.$confirm('确认改变该状态吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let state=row.state;
                    state=state==='正常'?'停用':state==='停用'?'正常':state;
                    let data={
                        id:row.id,
                        parkId:localStorage.getItem("parkId"),
                        name:row.name,
                        type:row.type,
                        useTime:row.useTime.slice(0,10),
                        state:state,
                        location:row.location,
                        addInfo:{
                            image:row.addInfo.image,
                            info:row.addInfo.info
                        }
                    };
                    this.$post(addEquip,data)
                        .then((res)=>{
                            this.getDevice();
                        })
                }).catch(() => {

                });


            },
            checkingDetail(){//巡检详情
                this.inspectDetail=false;
            },
            checkingRecord(){//巡检记录
                this.inspectDetail=true;
                let url=inspectUrl+'&equipmentId='+this.detailList.id;
                this.$get(url)
                    .then((res) => {
                        this.checkList=res;
                    })
            },
            editDevice() {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=this.detailList.id;
                this.isEdit=true;
                this.deviceAEVisible = true;
                this.deviceAEForm=this.detailList;
            },
            delDevice: function () { //屏蔽
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.secondPageVisible = true;
                    let paraId = this.detailList.id;
                    let self=this;
                    this.$del(delEquip+paraId)
                        .then(function(response) {
                            self.secondPageVisible = false;
                            self.mainPageVisible=true;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getDevice();
                        });
                }).catch(() => {

                });
            },
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            getQueryDevice(){
                let url=equipUrl;
                let name=this.deviceFilters.searchTitle;
                url=name===''?url+'':url+'&name='+name;
                this.getDeviceList(url);
                this.deviceFilters={
                    searchTitle:''
                }
            },
            deviceInspect(index,row){
                this.mainPageVisible=false;
                this.secondPageVisible=true;
                this.inspectDetail=false;
                this.detailList=Object.assign({}, row);
            },
            backMainPage(){
                this.mainPageVisible=true;
                this.secondPageVisible=false;
            },
            secQueryFeBackValue(value){
                let obj = {};
                obj = this.feBackList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=equipUrl;
                url=this.selectLabel==='全部类别'?url+'':url+'&type='+this.selectLabel;
                this.getDeviceList(url);
            },
            secQueryState(value){
                let obj = {};
                obj = this.stateList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=equipUrl;
                url=this.selectLabel==='全部状态'?url+'':url+'&state='+this.selectLabel;
                this.getDeviceList(url);
            },
            qrCodeDevice(index,row){//二维码
                this.detailList=Object.assign({}, row);
                this.qrDeviceVisible=true;
                this.configvalue=row.id;
            },
            deviceAdd(){ //显示新增
                if(this.$refs.upload!==undefined) this.$refs.upload.clearFiles();
                this.morePicList.length=0;
                this.addEditTitle='新增';
                this.isEdit=false;
                this.deviceAEVisible=true;
                this.deviceAEForm={
                    name:'',
                    type:'',
                    location:'',
                    useTime:'',
                    state:'',
                    addInfo:{
                        image:'',
                        info:'',
                    }
                };
            },
            exportTable(){//导出到表格

            },
            importDevice(){//导入设备清单

            },
            getDevice(){ //设备管理列表
                this.getDeviceList(equipUrl);
            },
            getDeviceList(url){//设备管理列表数据
                this.deviceLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.deviceList=res;
                        this.deviceTotal=this.deviceList.length>0?this.deviceList.length:1;
                        this.deviceLoading=false;
                    })
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            deviceCurChange(val) {
                this.page = val;
                this.getDevice();
            },
            savePath(){//保存二维码路径
                this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    this.qrDeviceLoading = true;
                    let oQrcode = document.querySelector('.qrCode img');
                    let url = oQrcode.src;
                    let a = document.createElement('a');
                    let event = new MouseEvent('click');
                    // 下载图名字
                    a.download = '二维码';
                    //url
                    a.href = url;
                    //合成函数，执行下载
                    a.dispatchEvent(event);
                            this.qrDeviceLoading = false;
                            this.qrDeviceVisible = false;
                            // this.getDevice();
                });
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
                                type:this.deviceAEForm.type,
                                useTime:this.deviceAEForm.useTime.slice(0,10),
                                state:this.deviceAEForm.state,
                                location:this.deviceAEForm.location,
                                addInfo:{
                                    image:this.morePicList[0],
                                    info:this.deviceAEForm.addInfo.info
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addEquip,data)
                                .then((res)=>{
                                    this.deviceAELoading = false;
                                    this.deviceAEVisible = false;
                                    this.mainPageVisible=true;
                                    this.secondPageVisible=false;
                                    this.getDevice();
                                })
                        });
                    }
                });
            },
        },
        mounted(){
            this.getDevice();
            this.picUrl=localStorage.getItem("upUrl")+uploadPic;
            this. othParams={
                bucketName:'shared-resource',
                folderName:localStorage.getItem("parkId")
            };
        }
    }
</script>

<style lang="scss">
    .backUp{
        float: right;
    }
    .detail{
        .el-form-item{
            display: inline-block;
            width: 48%;
            &.allLength{
                width: 100%;
            }
        }
    }
    .comImage{
        text-align: center;
        img{
            display: inline-block;
            width: 86%;
            margin-top: 15px;
        }
    }
    .changeBtn{
        margin-top: 20px;
    }
    .groupBtns{
        margin: 15px 0;
    }
    .qrCode{
        text-align: center;
        margin: 1px auto 15px;
        height: 200px;
        padding: 0 0 15px;
    }
    .info{
        margin: 15px 10px 10px;
        text-align: center;
        span{
            margin: 0 20px;
        }
    }
</style>
