<template>
    <section>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <!--<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">-->
            <el-tab-pane label="圈子管理" name="first">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="circleAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="circleList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="listLoading" style="width: 100%;">
                    <el-table-column type="index" >
                    </el-table-column>
                    <el-table-column prop="title" label="圈子名称" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="圈子logo"  >
                        <template slot-scope="scope">
                            <img :src="scope.row.thumbUrl" width="40" height="40"/>
                            <!--<img src="../../assets/logo4.png" width="40" height="40"/>-->
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable>
                    </el-table-column>
                    <el-table-column prop="joinNum" label="已加入成员数" sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="info" size="small" @click="circleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="circleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total,sizes, prev, pager, next, jumper"
                                   :current-page="page"
                                   :total="circleTotal"
                                   style="float:right;">
                    </el-pagination>
                </el-col>

                <!--编辑界面-->
                <el-dialog title="编辑" :visible.sync="editCircleVisible">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                        <el-form-item label="圈子名称" prop="title">
                            <el-input v-model="editForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="圈子logo">
                            <el-upload class="upload-demo" action="" :auto-upload='false' :on-change='changeUpload'>
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="圈子logo">
                            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                                       :show-file-list="false" :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="圈子图片">
                            <el-upload class="upload-cirBg" action="" :auto-upload='false' :on-change='changeUpload'>
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="圈子简介">
                            <el-input type="textarea" v-model="editForm.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="详细内容">
                            <UE  :id=ue3 @editorChange="editorCirChange"></UE>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editCircleVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog :title=addTitle :visible.sync="addCircleVisible">
                    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                        <el-form-item label="圈子名称" prop="title">
                            <el-input v-model="addForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="圈子logo">
                            <el-upload class="avatar-uploader" :action=url
                                       :show-file-list="false" :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="logoImg" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="背景图片">
                            <el-upload :action=url list-type="picture-card"
                                       :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                                       :file-list="imgList" :on-success="moreShow">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" >
                            </el-dialog>
                        </el-form-item>
                        <el-form-item label="圈子简介">
                            <el-input type="textarea" v-model="addForm.addInfo.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="详细内容">
                            <UE :id=ue1 @editorChange="editorChange"></UE>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addCircleVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="活动管理" name="second">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="filters">
                        <el-form-item label="圈子筛选">
                            <el-select v-model="filters.secValue" placeholder="请选择">
                                <el-option v-for="item in circleList" :key="item.id" :label="item.title" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="block">
                                <!--<p>组件值：{{ timerValue }}</p>-->
                                <el-date-picker v-model="filters.timerValue" type="daterange" start-placeholder="开始日期"
                                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="filters.searchTitle" placeholder="搜索标题"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getActQuery">查询</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="activityAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="activityList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="actListLoading" @selection-change="selsActChange" style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发布时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.price" label="费用说明" :formatter="formatPrice">
                    </el-table-column>
                    <el-table-column prop="addInfo.startTime" label="开始时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.endTime" label="结束时间" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="actApplicant(scope.$index, scope.row)">报名</el-button>
                            <el-button type="info" size="small" @click="activityEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="activityDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                   <el-pagination background
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange"
                                  :page-sizes="[7,8,10,20]"
                                  :page-size="pagesize"
                                  layout="total,sizes, prev, pager, next, jumper"
                                  :current-page="page"
                                  :total="total"
                                  style="float:right;">
                    </el-pagination>
                </el-col>

                <!--报名-->
                <el-dialog title="报名人员" :visible.sync="actApplicantVisible" class="actApply" width="70%">
                    <div>
                        <span>活动标题：</span>
                        <span >{{detailList.title}}</span>
                    </div>
                    <div>
                        <span>活动时间：</span>
                        <span  >{{detailList.addInfo.startTime}}</span> ~
                        <span >{{detailList.addInfo.endTime}}</span>
                    </div>
                    <el-table v-if="actAppliData.length>0" :data="actAppliData">
                        <el-table-column type="index" ></el-table-column>
                        <el-table-column property="addInfo.userInfo.addInfo.nickName" label="姓名"></el-table-column>
                        <el-table-column property="addInfo.userInfo.phone" label="手机号"></el-table-column>
                        <el-table-column prop="addInfo.userInfo.addInfo.gender" label="性别" :formatter="formatSex" ></el-table-column>
                        <el-table-column prop="addInfo.enterpriseName" label="公司" ></el-table-column>
                        <el-table-column prop="createTime" label="报名时间" ></el-table-column>
                    </el-table>
                    <el-pagination class="el-pages" background
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total,sizes, prev, pager, next, jumper"
                                   :current-page="page"
                                   :total="actAppTotal">

                    </el-pagination>
                </el-dialog>

                <!--编辑界面-->
                <el-dialog title="编辑" :visible.sync="editActivityVisible">
                    <el-form :model="editActForm" label-width="80px"  ref="editActForm">
                        <el-form-item label="活动标题" prop="title">
                            <el-input v-model="editActForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="活动地址" prop="address">
                            <el-input v-model="editActForm.address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="活动时间">
                            <el-date-picker v-model="editActForm.actTimerValue" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                            :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="活动人数" prop="mems">
                            <el-input v-model="editActForm.mems" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="费用说明">
                            <el-row>
                                <el-col :span="6" style="width: 187px;">
                                    <el-radio-group v-model="editActForm.price">
                                        <el-radio class="radio" label="免费">免费</el-radio>
                                        <el-radio class="radio" label="收费">收费</el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="6">
                                    <el-input placeholder="0" :number="true" size="large" v-model="editActForm.priceValue" :disabled=" editActForm.price === '0' "><template slot="append">元</template></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="详细介绍">
                            <UE :id=ue4 @editorChange="editorActChange"></UE>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editActivityVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editActSubmit" :loading="editActLoading">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog :title=addTitle :visible.sync="addActivityVisible">
                    <el-form :model="addActForm" label-width="80px" ref="addActForm">
                        <el-form-item label="活动标题" prop="title">
                            <el-input v-model="addActForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="活动地址" prop="addInfo.address">
                            <el-input v-model="addActForm.addInfo.address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="圈子选择" prop="circleSec">
                            <el-select v-model="secValue" placeholder="请选择" @change="secCirValue">
                                <el-option v-for="item in circleList" :key="item.id" :label="item.title" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="活动时间">
                            <el-date-picker v-model="addActForm.actTimerValue" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                            :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="活动人数" prop="addInfo.mems">
                            <el-input v-model="addActForm.addInfo.mems" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="费用说明">
                            <el-row>
                                <el-col :span="6" style="width: 187px;">
                                    <el-radio-group v-model="addActForm.price">
                                        <el-radio class="radio" label="免费">免费</el-radio>
                                        <el-radio class="radio" label="收费">收费</el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col :span="6">
                                    <el-input placeholder="0" :number="true" size="large" v-model="addActForm.priceValue" :disabled=isdisabled><template slot="append">元</template></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="详细介绍">
                            <UE :id=ue2 @editorChange="actAddChange"></UE>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addActivityVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addActSubmit" :loading="addActLoading">提交</el-button>
                    </div>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script type="text/ecmascript-6">
    import util from '../../common/js/util'
    import axios from 'axios'
    import qs from 'qs'
    import UE from '../../components/ue'
    import wangEditor from 'wangeditor'
    //import NProgress from 'nprogress'
    // import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser,} from '../../api/api';
    import {showCircle, showActList, delCir,addCir,addAct,delAct,userTarget,uploadPic, batchRemoveUser, editUser,} from '../../api/api'

    export default {
        components: {UE},
        data() {
            return {
                url:'',//图片上传路径
                circleAddContent:'',
                cirEditContent:'',
                actEditContent:'',
                actAddContent:'',
                // content: '<p>example content</p>',
                // editorOption: { /* quill options */ },
                ue1:'cirId',
                ue2:'actId',
                ue3:'cirEditId',
                ue4:'actEditId',

                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 200
                },
                imageUrl:'',
                logoImg:'',
                actListLoading:false,
                addActivityVisible: false,//新增界面是否显示
                addActLoading: false,
                activityList:[
                    {
                        title:'外交部:朝方关闭核试验场有助于政治解决半岛问题',
                        createTime:'2018-05-14 18:26',
                        addInfo:{
                            price:0,
                            priceValue:0,
                            startTime:'2018-05-10 18:26',
                            endTime:'2018-06-15 18:00'
                        }
                    },
                    {
                        title:'缅北冲突致2名中方在缅人员死亡 中国外交部回应',
                        createTime:'2018-05-14 18:26',
                        addInfo:{
                            price:1,
                            priceValue:30,
                            startTime:'2018-05-10 18:26',
                            endTime:'2018-06-15 18:00'
                        }
                    }
                ],
                editActivityVisible: false,//编辑界面是否显示
                editActLoading: false,
                actApplicantVisible: false,//报名界面是否显示
                actAppliData:[
                    {
                        name:"张三",
                        nickname:'zhangSir',
                        cellphone:'13215698988',
                        sex:1,
                        joinTime:'2018-01-05',
                        createTime:'2018-01-05',
                        addInfo:{
                            enterpriseName:'松湖智谷',
                            userInfo:{
                                enterpriseName:'abcdefg',
                                phone:'12345678911',
                                addInfo:{
                                    nickName:'',
                                    gender:2,
                                }
                            }
                        }
                    },
                ],
                message:{
                  title:'外交部:朝方关闭核试验场有助于政治解决半岛问题',
                  startTime:'2018-01-02',
                  endTime:'2018-02-03'
                },
                //编辑界面数据
                editActForm: {
                    id: 0,
                    title: '',
                    address: '',
                    startTime:'',
                    endTime:'',
                    actTimerValue:'',
                    mems: 10,
                    price: 0,
                    // content: ''
                },
                //新增界面数据
                addActForm: {
                    title: '',
                    actTimerValue:[],
                    price: 0,
                    priceValue:0,
                    addInfo:{
                        address: '',
                        mems: 10,
                        startTime:'',
                        endTime:''
                    }
                    // content: ''
                },
                actTimerValue: [],
                circleId:'',


                activeName2: 'first',
                circleList:[],      //圈子列表
                circleTotal:0,
                fileList:[],      //上传图片路径
                fileLists:[],      //上传图片路径
                morePicList:[],
                dialogImageUrl: '',
                dialogVisible: false,
                filters: {
                    secValue:'',
                    timerValue:[],
                    searchTitle: ''
                },
                users: [],
                total: 0,
                page: 1,
                pagesize:7,
                listLoading: false,
                sels: [],//列表选中列

                editCircleVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    title: '',
                    // content: '',
                    thumbUrl:'',
                    intro:'',
                    addInfo: {
                        intro:''
                    }
                },

                addCircleVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    title: '',
                    // content: '',
                    thumbUrl:'',
                    addInfo: {
                        intro:''
                    }
                },

                secValue: '',
                timerValue: [],
                imgList:[],
                state:1,
                type:"默认",
                detailList:{
                    addInfo:{
                        publisher:{
                            addInfo:{
                                nickName:'',
                                avatarUrl:''
                            }
                        }
                    }
                },
                actAppTotal:1,
                addTitle:'新增',
                isEdit:false,
                isEditId:'',
                isdisabled:false,
            }
        },
        methods: {
            handleClick(tab, event) {
                this.page=1;
            },
            actAddChange(html){
                this.actAddContent=html;
            },
            editorActChange(html){
                this.actEditContent=html;
            },
            editorCirChange(html){
                this.cirEditContent=html;
            },
            editorChange(html){
                this.circleAddContent=html;
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.addInfo.userInfo.addInfo.gender == 1 ? '男' : row.addInfo.userInfo.addInfo.gender == 2 ? '女' : '未知';
            },
            handleSizeChange(val) {
                this.pagesize=val;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getCircle();
            },
            //获取圈子列表
            getCircle(){
                this.listLoading=true;
                this.$get(showCircle+localStorage.getItem("parkId"))
                    .then((res) => {
                        this.circleList=res;
                        this.circleTotal=this.circleList.length>0?this.circleList.length:1;
                        this.listLoading=false;
                    })
            },
            getActQuery(){//圈子活动 条件模糊查询
                let url=showActList;
                let startTime=this.filters.timerValue[0];
                let endTime=this.filters.timerValue[1];
                let title=this.filters.searchTitle;
                let circleId=this.filters.secValue;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=title===''?url+'':url+'&title='+title;
                url=circleId===''?url+'':url+'&circleId='+circleId;
                this.getActivityList(url);
                this.filters={
                    timerValue:[],
                    searchTitle:'',
                    secValue:''
                }

            },
            getActivity(){ //获取圈子活动列表
                this.getActivityList(showActList+localStorage.getItem("parkId"));
            },
            getActivityList(url){//圈子活动 列表数据
                this.actListLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.activityList=res;
                        this.total=this.activityList.length>0?this.activityList.length:1;
                        this.actListLoading=false;
                    })
            },
            //删除
            circleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    let self=this;
                    this.$del(delCir+para.id)
                        .then(function(response) {
                            self.listLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getCircle();
                        });
                }).catch(() => {

                });
            },
            //显示编辑界面
            circleEdit: function (index, row) {
                this.addTitle='编辑';
                // this.editCircleVisible = true;
                // this.editForm = Object.assign({}, row);
                this.addCircleVisible = true;
                this.addForm = Object.assign({}, row);
                this.imageUrl=row.thumbUrl;
                this.logoImg=row.thumbUrl;
                this.isEditId=row.id;
                this.isEdit=true;
            },
            //显示新增界面
            circleAdd: function () {
                this.addTitle='新增';
                this.isEdit=false;
                this.morePicList.length=0;
                this.addCircleVisible = true;
                this.addForm = {
                    title: '',
                    // content: '',
                    thumbUrl:'',
                    intro:'',
                    addInfo: {
                        intro:''
                    }
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editCircleVisible = false;
                                this.getCircle();
                            });
                        });
                    }
                });
            },
            handleRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            moreShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            let data={
                                content: this.circleAddContent,
                                parkId: localStorage.getItem("parkId"),
                                thumbUrl: this.logoImg,
                                title: this.addForm.title,
                                userId:localStorage.getItem("userId"),
                                state:this.state,
                                type:this.type,
                                addInfo: {
                                    intro:this.addForm.addInfo.intro,
                                    bgUrl:this.morePicList[0]
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            // let url='/api/socialCircle/addSocialCircle';
                            this.$post(addCir,data).then((res)=>{
                                    this.addLoading = false;
                                    this.addCircleVisible = false;
                                    this.getCircle();
                            })
                        });
                    }
                });
            },
            changeUpload: function(file, fileList) {
                this.fileList = fileList;
                this.$nextTick(() => {
                    let upload_list_li = document.getElementsByClassName('el-upload-list')[0].children;
                    for (let i = 0; i < upload_list_li.length; i++) {
                        let li_a = upload_list_li[i];
                        let imgElement = document.createElement("img");
                        imgElement.setAttribute('src', fileList[i].url);
                        imgElement.setAttribute('style', "max-width:50%;padding-left:25%");
                        if (li_a.lastElementChild.nodeName !== 'IMG') {
                            li_a.appendChild(imgElement);
                        }
                    }
                });
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.logoImg=res.responseList;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },

            secCirValue(value){
                this.circleId=value;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.actListLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.actListLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getActivity();
                    });
                }).catch(() => {

                });
            },
            //显示新增界面
            activityAdd: function () {
                this.addTitle='新增';
                this.isEdit=false;
                this.addActivityVisible = true;
                this.addActForm = {
                    title: '',
                    actTimerValue:[],
                    price: 0,
                    priceValue:0,
                    intro: '',
                    addInfo:{
                        address: '',
                        mems: 0,
                        startTime:'',
                        endTime:''
                    }
                };
            },
            //新增
            addActSubmit: function () {
                this.$refs.addActForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addActLoading = true;
                            // NProgress.start();
                            let para = Object.assign({}, this.addActForm);
                            let price=this.addActForm.price===0?this.addActForm.price:this.addActForm.priceValue;
                            let data={
                                content:this.actAddContent,
                                title:this.addActForm.title,
                                parkId:localStorage.getItem("parkId"),
                                socialCircleId:this.circleId,
                                userId:localStorage.getItem("userId"),
                                addInfo:{
                                    address:this.addActForm.addInfo.address,
                                    startTime:this.addActForm.actTimerValue[0],
                                    endTime:this.addActForm.actTimerValue[1],
                                    mems:this.addActForm.addInfo.mems,
                                    price:price
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            // let url='/api/socialCircle/addSocialCircleActive';
                            this.$post(addAct,data)
                                .then((res)=>{
                                this.addActLoading = false;
                                this.addActivityVisible = false;
                                this.getActivity();
                            })
                        });
                    }
                });
            },
            selsActChange: function (sels) {
                this.sels = sels;
            },
            //费用说明显示转换
            formatPrice: function (row, column) {
                return row.addInfo.price === 0 ? '免费' : row.addInfo.price? '￥'+row.addInfo.price:'';
            },
            //显示编辑界面
            activityEdit: function (index, row) {
                this.addTitle='编辑';
                this.isEdit=true;
                this.isEditId=row.id;
                this.addActivityVisible = true;
                this.addActForm = Object.assign({}, row);
                let arr=[];
                arr.push(row.addInfo.startTime);
                arr.push(row.addInfo.endTime);
                this.addActForm.actTimerValue=arr;
            },
            //编辑
            editActSubmit: function () {
                this.$refs.editActForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editActLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editActForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editActLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editActivityVisible = false;
                                this.getActivity();
                            });
                        });
                    }
                });
            },
            actApplicant(index,row){
                this.actApplicantVisible=true;
                this.detailList=row;
                let id=this.detailList.id;
                this.getApply(id);
            },
            getApply(id){
                this.$get(userTarget+id)
                    .then((res) => {
                        this.actAppliData=res;
                        this.actAppTotal=this.actAppliData.length>0?this.actAppliData.length:1;
                    })
            },
            //删除
            activityDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.actListLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    // let url='/api/socialCircle/deleteSocialCircleActive/'+para.id;
                    let self=this;
                    this.$del(delAct+para.id)
                        .then(function(response) {
                            self.actListLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getActivity();
                        });
                }).catch(() => {

                });
            },

        },
        mounted() {
            this.getCircle();
            this.getActivity();
            this.url=localStorage.getItem("upUrl")+uploadPic;
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-dialog__body{
        min-height: 280px;
    }
    .el-pages{
        margin: 10px 0;
        text-align: right;
    }
</style>
