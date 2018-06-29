<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="adminFilters">
                <el-form-item>
                    <span>搜索条件：</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="adminFilters.enterName" placeholder="企业名称搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryAdmin">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="newEnterprise">新增企业</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="exportData">导出到表格</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="importIn">导入名单</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="adminList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="adminLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="企业名称" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.area" label="区域" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.building" label="楼栋" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.floor" label="楼层" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.room" label="房号" sortable>
            </el-table-column>
            <el-table-column prop="industry" label="所属行业" sortable>
            </el-table-column>
            <el-table-column prop="inTime" label="入驻时间" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="adminEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="adminDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[7,8,10,20]"
                           :page-size="pagesize"
                           layout="total,sizes, prev, pager, next, jumper"
                           :total="adminTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="adminAEVisible" class="dialog">
            <el-form :model="adminAEForm" label-width="80px" ref="adminAEForm" :rules="rules">
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="adminAEForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属行业" prop="industry">
                    <el-select v-model="adminAEForm.industry" placeholder="请选择" @change="secIndustry">
                        <el-option v-for="item in indusList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业图片">
                    <el-upload :action=picUrl list-type="picture-card"
                               :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                               :file-list="imgAnList" :on-success="moreShow">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogAnVisible">
                        <img width="100%" :src="dialogAnImageUrl" >
                    </el-dialog>
                </el-form-item>
                <el-form-item label="地址" class="secAddress allLength">
                    <span>松湖智谷园区</span>
                    <el-select v-model="adminAEForm.addInfo.area" placeholder="选择区域" @change="secArea">
                        <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="adminAEForm.addInfo.building" placeholder="选择楼栋" @change="secBuild">
                        <el-option v-for="item in buildList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="adminAEForm.addInfo.floor" placeholder="选择楼层" @change="secFloor">
                        <el-option v-for="item in floorList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="adminAEForm.addInfo.room" placeholder="选择房号" @change="secRoom">
                        <el-option v-for="item in roomList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业描述" class="allLength">
                    <el-input type="textarea" :rows="3" placeholder="请填写企业描述（200字内）"
                              maxlength="200" v-model="adminAEForm.textarea">
                    </el-input>
                </el-form-item>
                <el-form-item label="入驻时间" class="allLength" prop="inTime">
                    <el-date-picker v-model="adminAEForm.inTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                    <el-button type="success" @click="secDayTime">今日</el-button>
                </el-form-item>
            </el-form>
            <el-form label-width="100px" v-if="isEdit">
                <el-form-item label="创建时间">
                    {{modifyList.createTime}}
                </el-form-item>
                <el-form-item label="创建人">
                    {{modifyList.createName}}
                </el-form-item>
                <el-form-item label="最后修改时间">
                    {{modifyList.lastTime}}
                </el-form-item>
                <el-form-item label="修改人">
                    {{modifyList.modifyName}}
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="adminAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAdminSubmit" :loading="admAELoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import UE from '../../components/ue'
    import {showDisplay, addDisplay, deleteDisplay,uploadPic, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                industry:'',
                secAreaValue:'',
                secBuildValue:'',
                secFloorValue:'',
                secRoomValue:'',
                selectLabel:'',
                areaLabel:'',
                buildLabel:'',
                floorLabel:'',
                roomLabel:'',
                indusList:[
                    {
                        id:1,
                        name:'计算机/互联网'
                    },
                    {
                        id:2,
                        name:'广告/媒体'
                    },
                    {
                        id:3,
                        name:'服务业'
                    }
                ],
                areaList:[
                    {
                        id:1,
                        name:'东一区'
                    },
                    {
                        id:2,
                        name:'东二区'
                    },
                    {
                        id:3,
                        name:'东三区'
                    }
                ],
                buildList:[
                    {
                        id:1,
                        name:'A栋'
                    },
                    {
                        id:2,
                        name:'B栋'
                    },
                    {
                        id:3,
                        name:'C栋'
                    }
                ],
                floorList:[
                    {
                        id:1,
                        name:'1层'
                    },
                    {
                        id:2,
                        name:'2层'
                    },
                    {
                        id:3,
                        name:'3层'
                    }
                ],
                roomList:[
                    {
                        id:1,
                        name:'1001'
                    },
                    {
                        id:2,
                        name:'1002'
                    },
                    {
                        id:3,
                        name:'1003'
                    }
                ],
                picUrl:'',
                imgAnList:[],
                dialogAnImageUrl: '',
                dialogAnVisible: false,
                page:1,
                pagesize:7,
                adminFilters: {
                    enterName: ''
                },
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                adminAEVisible:false,
                adminAEForm:{
                    name:'',
                    textarea:'',
                    inTime:'',
                    industry:'',
                    addInfo:{
                        area:'',
                        building:'',
                        floor:'',
                        room:''
                    }
                },
                adminList:[
                    {
                        name:'深圳微品致远信息科技有限公司',
                        industry:'计算机/互联网/通讯/电子',
                        inTime:'2018-06-22',
                        textarea:'公司总部在深圳南山科技园',
                        addInfo:{
                            area:'东一区',
                            building:'A1',
                            floor:'4',
                            room:'F2',
                        }
                    },
                    {
                        name:'中信集团',
                        industry:'银行/证券',
                        inTime:'2018-06-12',
                        textarea:'公司总部在深圳南山科技园',
                        addInfo:{
                            area:'东二区',
                            building:'C1',
                            floor:'6',
                            room:'C3',
                        }
                    },
                ],
                adminLoading:false,
                admAELoading:false,
                adminTotal:1,
                ue:'announceId',
                announceContent:'',
                rules: {
                    name: [
                        { required: true, message: '请填写企业名称', trigger: 'blur' }
                    ],
                    industry: [
                        { required: true, message: '请选择所属行业', trigger: 'change' }
                    ],
                    inTime: [
                        { type: 'date', required: true, message: '请选择入驻时间', trigger: 'change' }
                    ]
                },
                modifyList:{
                    createTime:'2018-06-02 17:30:30',
                    createName:'平台管理员123',
                    lastTime:'2018-06-20 19:10:15',
                    modifyName:'李小四'
                },

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
                this.admAELoading=true;
                this.adminAEForm.inTime=year+'-'+month+'-'+day;

            },
            handlePictureCardPreview(file) {
                this.dialogAnImageUrl = file.url;
                this.dialogAnVisible = true;
            },
            handleRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            moreShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            secIndustry(value){
                let obj = {};
                obj = this.indusList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
            },
            secArea(value){
                let obj = {};
                obj = this.areaList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.areaLabel=obj.name;
            },
            secBuild(value){
                let obj = {};
                obj = this.buildList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.buildLabel=obj.name;
            },
            secFloor(value){
                let obj = {};
                obj = this.floorList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.floorLabel=obj.name;
            },
            secRoom(value){
                let obj = {};
                obj = this.roomList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.roomLabel=obj.name;
            },
            exportData(){//导出到表格

            },
            importIn(){//导入名单

            },
            newEnterprise(){  //显示新增界面
                this.addEditTitle='新增';
                this.isEdit=false;
                this.adminAEVisible=true;
                this.adminAEForm={
                    name:'',
                    textarea:'',
                    inTime:'',
                    industry:'',
                    addInfo:{
                        area:'',
                        building:'',
                        floor:'',
                        room:''
                    }
                };
            },
            getQueryAdmin(){ // 企业管理模糊查询
                let type='企业管理';
                let url=showDisplay+type;
                let title=this.adminFilters.enterName;
                url=title===''?url+'':url+'&title='+title;
                this.getAnData(url);
                this.adminFilters={
                    enterName:''
                }
            },
            getAdminList(){    //企业管理列表
                let type='企业管理';
                this.getAnData(showDisplay+type);
            },
            getAnData(url){
                this.adminLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.adminList=res;
                        this.adminTotal=this.adminList.length>0?this.adminList.length:1;
                        this.adminLoading=false;
                    })
            },
            adminDel(index, row) {   //删除
                this.$confirm('删除企业将同时取消改企业下属用户的关联企业属性，是否删除?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.adminLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDisplay+para.id)
                        .then(function(response) {
                            self.adminLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAdminList();
                        });
                }).catch(() => {

                });
            },
            adminEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.adminAEVisible = true;
                this.adminAEForm = Object.assign({}, row);
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
                this.getAdminList();
            },
            addAdminSubmit: function () {  //新增
                this.$refs.adminAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.admAELoading = true;
                            // let para = Object.assign({}, this.adminAEForm);
                            // let data={
                            //     parkId:localStorage.getItem("parkId"),
                            //     thumbUrl:'null',
                            //     title:this.adminAEForm.title,
                            //     type:'企业管理',
                            //     detailUrl:'null',
                            //     addInfo:{
                            //         themeContent:this.announceContent
                            //     }
                            // };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.admAELoading = false;
                                    this.adminAEVisible = false;
                                    this.getAdminList();
                                })
                        });
                    }
                });
            },
            AddChange(html){  // ueditor
                this.announceContent=html;
            },

        },
        mounted(){
            // this.getAdminList();   //企业管理
            this.picUrl=localStorage.getItem("upUrl")+uploadPic;
        }
    }
</script>

<style lang="scss">
    .dialog{
        .el-form{
            .el-form-item{
                display: inline-block;
                width: 48%;
                &.allLength{
                    width: 100%;
                }
            }
        }
    }
    .secAddress{
        .el-select{
            display: inline-block;
            width: 120px;
            margin-right: 10px;
        }
    }
</style>
