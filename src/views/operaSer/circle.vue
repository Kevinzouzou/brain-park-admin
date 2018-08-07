<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="圈子管理" name="first">
                <!--工具条-->
                <el-row>
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="primary" @click="circleAdd">新增圈子</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <!--列表-->
                <el-table :data="circleList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="listLoading" style="width: 100%;">
                    <el-table-column prop="id" label="ID">
                    </el-table-column>
                    <el-table-column prop="title" label="圈子名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="圈子logo">
                        <template slot-scope="scope">
                            <img :src="scope.row.thumbUrl" width="40" height="40" style="border-radius: 6px;" />
                        </template>
                    </el-table-column>
                    <el-table-column label="背景图">
                        <template slot-scope="scope">
                            <img :src="scope.row.addInfo.bgUrl" width="40" height="40" style="border-radius: 6px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="joinNum" label="已加入成员数">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="circleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="circleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-row>
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[7,8,10,20]"
                            :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="circleList.length"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!--新增界面-->
                <el-dialog title="新增圈子" :visible.sync="addCircleVisible">
                    <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子名称" required prop="title">
                                    <el-input v-model="addForm.title" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子logo" required>
                                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="logoImgUploadSuccess"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="addForm.thumbUrl" :src="addForm.thumbUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="背景图片" required>
                                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="backgroundImgUploadSuccess">
                                        <img v-if="addForm.addInfo.bgUrl" :src="addForm.addInfo.bgUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子简介" required prop="addInfo.intro">
                                    <el-input type="textarea" v-model="addForm.addInfo.intro"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细内容" required>
                                    <quill-editor v-model="addForm.content"></quill-editor>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addCircleVisible = false">取消</el-button>
                        <el-button type="primary" @click="addSubmit">提交</el-button>
                    </div>
                </el-dialog>
                <!--编辑界面-->
                <el-dialog title="编辑圈子" :visible.sync="editCircleVisible">
                    <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子名称" prop="title" required>
                                    <el-input v-model="editForm.title" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子logo" required>
                                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="logoImgUploadSuccess"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="editForm.thumbUrl" :src="editForm.thumbUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="背景图片" required>
                                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="backgroundImgUploadSuccess">
                                        <img v-if="editForm.addInfo.bgUrl" :src="editForm.addInfo.bgUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="圈子简介" required prop="addInfo.intro">
                                    <el-input type="textarea" v-model="editForm.addInfo.intro"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细内容" required>
                                    <quill-editor v-model="editForm.content"></quill-editor>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="editCircleVisible = false">取消</el-button>
                        <el-button type="primary" @click="editSubmit">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>

            <el-tab-pane label="活动管理" name="second">
                <el-row>
                    <el-col>
                        <el-form :inline="true">
                            <el-form-item label="圈子筛选">
                                <el-select v-model="filters.secValue" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in circleList" :key="item.id" :label="item.title" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <el-date-picker v-model="filters.timerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="filters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getActQuery">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="batchRemove">批量删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="activityAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table ref="multipleTable" :data="activityList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="actListLoading"
                    @selection-change="handleSelectionChange">
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
                    <el-table-column label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="actApplicant(scope.$index, scope.row)">报名</el-button>
                            <el-button type="primary" size="small" @click="activityEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="activityDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[7,8,10,20]"
                        :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="activityList.length"
                        style="float:right;">
                    </el-pagination>
                </el-col>

                <!--报名-->
                <el-dialog title="报名人员" :visible.sync="actApplicantVisible" class="actApply" width="70%">
                    <div>
                        <span>活动标题：</span>
                        <span>{{detailList.title}}</span>
                    </div>
                    <div>
                        <span>活动时间：</span>
                        <span>{{detailList.addInfo.startTime}}</span> ~
                        <span>{{detailList.addInfo.endTime}}</span>
                    </div>
                    <el-table v-if="actAppliData.length > 0" :data="actAppliData">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column property="addInfo.userInfo.addInfo.nickName" label="姓名"></el-table-column>
                        <el-table-column property="addInfo.userInfo.phone" label="手机号"></el-table-column>
                        <el-table-column prop="addInfo.userInfo.addInfo.gender" label="性别" :formatter="formatSex"></el-table-column>
                        <el-table-column prop="addInfo.enterpriseName" label="公司"></el-table-column>
                        <el-table-column prop="createTime" label="报名时间"></el-table-column>
                    </el-table>
                    <el-pagination class="el-pages" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[7,8,10,20]"
                        :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="actAppliData.length">
                    </el-pagination>
                </el-dialog>

                <!--编辑界面-->
                <el-dialog title="编辑活动" :visible.sync="editActivityVisible">
                    <el-form :model="editActForm" label-width="100px" ref="editActForm" :rules="addActFormRules">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="活动标题：" prop="title" required>
                                    <el-input v-model="editActForm.title" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="活动地址：" required prop="addInfo.address">
                                    <el-input v-model="editActForm.addInfo.address" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="圈子选择：" required prop="socialCircleId">
                                    <el-select style="width: 100%;" v-model="editActForm.socialCircleId" placeholder="请选择" @change="secCirValue">
                                        <el-option v-for="item in circleList" :key="item.id" :label="item.title" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="活动时间：" required prop="actTimerValue">
                                    <el-date-picker style="width: 100%;" v-model="editActForm.actTimerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="活动人数：" required prop="addInfo.mems">
                                    <el-input v-model="editActForm.addInfo.mems" :number="true" auto-complete="off">
                                        <template slot="append">人</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="费用说明：" required>
                                    <el-radio-group v-model="editActForm.isFree">
                                        <el-radio class="radio" label="免费">免费</el-radio>
                                        <el-radio class="radio" label="收费">收费</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="0" :number="true" v-model="editActForm.addInfo.price" :disabled="editActForm.isFree === '免费'">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细介绍：" required>
                                    <quill-editor v-model="editActForm.content"></quill-editor>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="editActivityVisible = false">取消</el-button>
                        <el-button type="primary" @click="editActSubmit">提交</el-button>
                    </div>
                </el-dialog>

                <!--新增界面-->
                <el-dialog title="新增活动" :visible.sync="addActivityVisible">
                    <el-form :model="addActForm" label-width="100px" ref="addActForm" :rules="addActFormRules">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="活动标题：" prop="title" required>
                                    <el-input v-model="addActForm.title" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="活动地址：" required prop="addInfo.address">
                                    <el-input v-model="addActForm.addInfo.address" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="圈子选择：" required prop="socialCircleId">
                                    <el-select style="width: 100%;" v-model="addActForm.socialCircleId" placeholder="请选择" @change="secCirValue">
                                        <el-option v-for="item in circleList" :key="item.id" :label="item.title" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="活动时间：" required prop="actTimerValue">
                                    <el-date-picker style="width: 100%;" v-model="addActForm.actTimerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="14">
                                <el-form-item label="活动人数：" required prop="addInfo.mems">
                                    <el-input v-model="addActForm.addInfo.mems" :number="true" auto-complete="off">
                                        <template slot="append">人</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="费用说明：" required>
                                    <el-radio-group v-model="addActForm.isFree">
                                        <el-radio class="radio" label="免费">免费</el-radio>
                                        <el-radio class="radio" label="收费">收费</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-input placeholder="0" :number="true" v-model="addActForm.addInfo.price" :disabled="addActForm.isFree === '免费'">
                                    <template slot="append">元</template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细介绍：" required>
                                    <quill-editor v-model="addActForm.content"></quill-editor>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="addActivityVisible = false">取消</el-button>
                        <el-button type="primary" @click="addActSubmit">提交</el-button>
                    </div>
                </el-dialog>

            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script type="text/ecmascript-6">
    import util from '../../common/js/util'
    import axios from 'axios'
    import {
        showCircle,
        addCir,
        delCir,
        showActList,
        addAct,
        delAct,
        userTarget,
        uploadPic,
    } from '../../api/api'
    import publicFunction from '../../api/publicFunction';

    export default {
        data() {
            return {
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                comSerContent: '',
                imgUploadUrl: '', //图片上传路径
                circleAddContent: '',
                cirEditContent: '',
                actEditContent: '',
                actAddContent: '',
                defaultMsg: '',
                imageUrl: '',
                logoImg: '',
                actListLoading: false,
                addActivityVisible: false, //新增界面是否显示
                activityList: [],
                editActivityVisible: false, //编辑界面是否显示
                actApplicantVisible: false, //报名界面是否显示
                actAppliData: [],
                //编辑界面数据
                editActForm: {
                    content: "",
                    id: "",
                    parkId: "",
                    socialCircleId: "",
                    title: "",
                    userId: "",
                    actTimerValue: [],
                    addInfo: {
                        address: "",
                        endTime: "",
                        mems: "",
                        price: "",
                        startTime: "",
                    }
                },
                //新增界面数据
                addActForm: {
                    title: "",
                    content: "",
                    socialCircleId: "",
                    actTimerValue: [],
                    isFree: "免费",
                    addInfo: {
                        address: "",
                        mems: "",
                        price: "",
                        startTime: "",
                        endTime: "",
                    }
                },
                addActFormRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: ['blur']
                    }],
                    socialCircleId: [{
                        required: true,
                        message: '请选择圈子',
                        trigger: ['blur']
                    }],
                    actTimerValue: [{
                        required: true,
                        message: '请选择日期',
                        trigger: ['blur']
                    }],
                    addInfo: [{
                        address: [{
                            required: true,
                            message: '请输入地址',
                            trigger: ['blur']
                        }],
                        mems: [{
                            required: true,
                            message: '请输入人数',
                            trigger: ['blur']
                        }],
                    }],
                },
                actTimerValue: [],
                circleId: '',
                activeName: 'first',
                circleList: [], //圈子列表
                circleTotal: 0,
                fileList: [], //上传图片路径
                fileLists: [], //上传图片路径
                morePicList: '',
                dialogImageUrl: '',
                dialogVisible: false,
                filters: {
                    secValue: '',
                    timerValue: [],
                    searchTitle: ''
                },
                users: [],
                page: 1,
                pagesize: 7,
                listLoading: false,
                multipleSelection: [], //列表选中列
                editCircleVisible: false, //编辑界面是否显示
                //编辑圈子数据
                editForm: {
                    content: "",
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    joinNum: 0,
                    parkId: "",
                    state: 1,
                    thumbUrl: "",
                    title: "",
                    type: "",
                    updateTime: "",
                    userId: "",
                    addInfo: {
                        intro: '',
                        bgUrl: ''
                    }
                },
                addCircleVisible: false, //新增界面是否显示
                //新增圈子数据
                addForm: {
                    title: '',
                    content: '',
                    thumbUrl: '',
                    content: '',
                    state: 1,
                    type: "默认",
                    addInfo: {
                        intro: '',
                        bgUrl: '',
                    }
                },
                addFormRules: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: ['blur']
                    }],
                    addInfo: [{
                        intro: [{
                            required: true,
                            message: '请输入圈子简介',
                            trigger: ['blur']
                        }],
                    }],
                },
                secValue: '',
                timerValue: [],
                state: 1,
                type: "默认",
                detailList: {
                    addInfo: {
                        publisher: {
                            addInfo: {
                                nickName: '',
                                avatarUrl: ''
                            }
                        }
                    }
                },
                addTitle: '新增',
                isEdit: false,
                isEditId: '',
                isdisabled: false,
            }
        },
        methods: {
            handleClick(tab, event) {
                this.page = 1;
            },
            // 性别显示转换
            formatSex: function (row, column) {
                return row.addInfo.userInfo.addInfo.gender == 1 ? '男' : row.addInfo.userInfo.addInfo.gender == 2 ?
                    '女' : '未知';
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getCircle();
            },
            // 获取圈子列表
            getCircle() {
                this.listLoading = true;
                this.$get(showCircle + localStorage.getItem("parkId"))
                    .then(res => {
                        this.circleList = res;
                        this.circleTotal = this.circleList.length > 0 ? this.circleList.length : 1;
                        this.listLoading = false;
                    })
            },
            // 圈子活动 条件模糊查询
            getActQuery() {
                let url = showActList + localStorage.getItem("parkId");
                let startTime = this.filters.timerValue[0];
                let endTime = this.filters.timerValue[1];
                let title = this.filters.searchTitle;
                let circleId = this.filters.secValue;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime.replace(/-/g, '/');
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                url = circleId === '' ? url + '' : url + '&circleId=' + circleId;
                this.getActivityList(url);
            },
            //圈子活动 列表数据
            getActivityList(url) {
                this.actListLoading = true;
                this.$get(url)
                    .then(res => {
                        this.activityList = res;
                        this.actListLoading = false;
                    })
            },
            //显示新增界面
            circleAdd: function () {
                this.addTitle = '新增';
                this.isEdit = false;
                this.addCircleVisible = true;
                this.addForm = {
                    title: '',
                    content: '',
                    thumbUrl: '',
                    content: '',
                    state: 1,
                    type: "默认",
                    addInfo: {
                        intro: '',
                        bgUrl: '',
                    }
                };
            },
            //显示编辑界面
            circleEdit(index, row) {
                // 初始化编辑数据
                this.editForm = {
                    content: "",
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    joinNum: 0,
                    parkId: "",
                    state: 1,
                    thumbUrl: "",
                    title: "",
                    type: "",
                    updateTime: "",
                    userId: "",
                    addInfo: {
                        intro: '',
                        bgUrl: ''
                    }
                };
                this.editForm = publicFunction.deepCopy(this.editForm, row);
                this.editCircleVisible = true;
            },
            //新增圈子
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let para = Object.assign({}, this.addForm);
                        let data = this.addForm;
                        data.parkId = localStorage.getItem("parkId");
                        data.userId = localStorage.getItem("userId");
                        if (data.thumbUrl === "") {
                            this.$message({
                                message: '请添加圈子logo',
                                type: 'error'
                            });
                        } else if (data.addInfo.bgUrl === "") {
                            this.$message({
                                message: '请添加圈子背景',
                                type: 'error'
                            });
                        } else if (data.content === "") {
                            this.$message({
                                message: '请添加详细内容',
                                type: 'error'
                            });
                        } else {
                            this.$post(addCir, data).then((res) => {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.$refs.addForm.resetFields();
                                this.addCircleVisible = false;
                                this.getCircle();
                            });
                        }
                    }
                });
            },
            // 编辑圈子
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = this.editForm;
                        if (data.thumbUrl === "") {
                            this.$message({
                                message: '请添加圈子logo',
                                type: 'error'
                            });
                        } else if (data.addInfo.bgUrl === "") {
                            this.$message({
                                message: '请添加圈子背景',
                                type: 'error'
                            });
                        } else if (data.content === "") {
                            this.$message({
                                message: '请添加详细内容',
                                type: 'error'
                            });
                        } else {
                            this.$post(addCir, data).then((res) => {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$refs.editForm.resetFields();
                                this.editCircleVisible = false;
                                this.getCircle();
                            });
                        }
                    }
                });
            },
            //删除圈子
            circleDel: function (index, row) {
                this.$confirm('确认删除该圈子吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(delCir + row.id)
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCircle();
                        });
                }).catch(() => {});
            },
            backgroundImgUploadSuccess(res, file, fileList) {
                this.addForm.addInfo.bgUrl = res.responseList.url;
                this.editForm.addInfo.bgUrl = res.responseList.url;
            },
            changeUpload: function (file, fileList) {
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
            // 圈子新增或修改logo
            logoImgUploadSuccess(res, file) {
                this.addForm.thumbUrl = res.responseList.url;
                this.editForm.thumbUrl = res.responseList.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },

            secCirValue(value) {
                this.circleId = value;
            },
            //批量删除
            batchRemove() {
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        message: '请先选择活动',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认删除选中的活动？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.multipleSelection) {
                            this.$del(delAct + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已删除"${i.title}"活动`,
                                    type: 'success'
                                });
                                this.getActQuery();
                            });
                        }
                    }).catch(() => {});
                }
            },
            //显示新增界面
            activityAdd() {
                this.addActivityVisible = true;
                this.addActForm = {
                    title: "",
                    content: "",
                    socialCircleId: "",
                    actTimerValue: [],
                    isFree: "免费",
                    addInfo: {
                        address: "",
                        mems: "",
                        price: "",
                        startTime: "",
                        endTime: "",
                    }
                };
            },
            //新增
            addActSubmit() {
                this.$refs.addActForm.validate((valid) => {
                    if (valid) {
                        let data = this.addActForm;
                        data.addInfo.price = this.addActForm.isFree === "免费" ? 0 : this.addInfo.price;
                        delete data.isFree;
                        data.parkId = localStorage.getItem("parkId");
                        data.userId = localStorage.getItem("userId");
                        data.addInfo.startTime = data.actTimerValue[0];
                        data.addInfo.endTime = data.actTimerValue[1];
                        this.$post(addAct, data)
                            .then((res) => {
                                this.$refs.addActForm.resetFields();
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.addActivityVisible = false;
                                this.getActQuery();
                            });
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 费用说明显示转换
            formatPrice(row, column) {
                return row.addInfo.price === 0 ? '免费' : row.addInfo.price ? '￥' + row.addInfo.price : '';
            },
            // 显示编辑界面
            activityEdit(index, row) {
                this.editActivityVisible = true;
                this.editActForm = publicFunction.deepCopy(this.editActForm, row);
                this.editActForm.isFree = this.editActForm.addInfo.price === 0 ? '免费' : '收费';
                let arr = [];
                arr.push(row.addInfo.startTime);
                arr.push(row.addInfo.endTime);
                this.editActForm.actTimerValue = arr;
            },
            //编辑
            editActSubmit() {
                this.$refs.editActForm.validate((valid) => {
                    if (valid) {
                        let data = this.editActForm;
                        data.addInfo.price = data.isFree === "免费" ? 0 : data.addInfo.price;
                        delete data.isFree;
                        data.addInfo.startTime = data.actTimerValue[0];
                        data.addInfo.endTime = data.actTimerValue[1];
                        this.$post(addAct, data).then((res) => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$refs.editActForm.resetFields();
                            this.editActivityVisible = false;
                            this.getActQuery();
                        });
                    }
                });
            },
            // 显示报名界面
            actApplicant(index, row) {
                this.getApply(row.id);
                this.actApplicantVisible = true;
            },
            // 获取报名名单
            getApply(id) {
                this.$get(userTarget + id)
                    .then((res) => {
                        this.actAppliData = res;
                    })
            },
            //删除
            activityDel(index, row) {
                this.$confirm('确认删除该活动?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.actListLoading = true;
                    this.$del(delAct + row.id)
                        .then(res => {
                            this.actListLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getActQuery();
                        });
                }).catch(() => {});
            },
        },
        mounted() {
            this.getCircle();
            this.getActQuery();
            this.imgUploadUrl = localStorage.getItem("upUrl") + uploadPic;
            this.imgData.folderName = localStorage.getItem('parkId');
        }
    }
</script>
<style lang="scss">
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

    .el-dialog__body {
        min-height: 280px;
    }

    .el-pages {
        margin: 10px 0;
        text-align: right;
    }
</style>