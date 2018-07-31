<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="园区公告" name="first">
                <div class="firstAnnounce" v-show="firstAnVisible">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="announceFilters">
                            <el-form-item>
                                <el-button type="primary" @click="cateAnMg">类别管理</el-button>
                                <el-select v-model="announceFilters.secCateAnValue" placeholder="请选择" @change="getQueryAnnou">
                                    <el-option label="全部" value="">
                                    </el-option>
                                    <el-option v-for="item in anCategoryList" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <el-date-picker v-model="announceFilters.timeAnValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="announceFilters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getQueryAnnou">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="announceBatchRemove" :disabled="true">批量删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="announceAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="announceList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="announceLoading" @selection-change="selsAnChange"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="type" label="类别">
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间">
                        </el-table-column>
                        <el-table-column prop="lookUpNum" label="浏览量">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="AnEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="AnDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="announceCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="announceList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title="addEditTitle" :visible.sync="addEditAnVisible">
                        <el-form :model="announceForm" label-width="100px" ref="announceForm">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="标题" required>
                                        <el-input v-model="announceForm.title" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="类别" required>
                                        <el-select v-model="announceForm.addInfo.subtype" placeholder="请选择">
                                            <el-option v-for="item in anCategoryList" :key="item.id" :label="item.name" :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="缩略图" required>
                                        <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="announceFormImgUpload">
                                            <img v-if="announceForm.thumbUrl" :src="announceForm.thumbUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="详细介绍" required>
                                        <quill-editor v-model="announceForm.addInfo.themeContent"></quill-editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addEditAnVisible = false">取消</el-button>
                            <el-button type="primary" @click="addAnnounceSubmit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
                <div class="secondAnnounce" v-show="secondAnVisible" title="类别管理">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="anCategoryFilters">
                            <el-form-item>
                                <span>快速添加分类：</span>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="anCategoryFilters.addType" placeholder="添加类别"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="anCategoryAdd">添加</el-button>
                            </el-form-item>
                            <el-form-item class="pull-right">
                                <el-button type="danger" @click="backToFirstAn">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="anCategoryBatchRemove" :disabled="this.anCateSels.length===0">批量删除</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="anCategoryList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="anCategoryLoading"
                        @selection-change="selsAnCategoryChange" style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="类别">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="anCateEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="anCateDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="anCateCurrentChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total,sizes, prev, pager, next, jumper" :total="anCategoryList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--编辑界面-->
                    <el-dialog title="编辑" :visible.sync="anCateVisible">
                        <el-form :model="anCateForm" label-width="80px" ref="anCateForm">
                            <el-form-item label="分类" prop="name">
                                <el-input v-model="anCateForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="anCateVisible = false">取消</el-button>
                            <el-button type="primary" @click="editAnCateSubmit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-tab-pane>
            <el-tab-pane label="惠通知" name="second">
                <div class="firstAnnounce" v-show="firInformVisible">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="informFilters">
                            <el-form-item>
                                <el-button type="primary" @click="cateInformMg">类别管理</el-button>
                                <el-select v-model="informFilters.secCateInformValue" placeholder="请选择" @change="getQueryInform">
                                    <el-option label="全部" value="">
                                    </el-option>
                                    <el-option v-for="item in informCateList" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <el-date-picker v-model="informFilters.timeInformValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="informFilters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryInform">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="informBatchRemove" :disabled="true">批量删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="informAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="informList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="informLoading" @selection-change="selsInformChange"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="type" label="类别">
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间">
                        </el-table-column>
                        <el-table-column prop="addInfo.lookUpNum" label="浏览量">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="informEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="informDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="informCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="informList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title="addEditTitle" :visible.sync="addEditInformVisible">
                        <el-form :model="informForm" label-width="100px" ref="informForm" :rules="informFormRules">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="标题" prop="title" required>
                                        <el-input v-model="informForm.title" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="类别" required prop="addInfo.subtype">
                                        <el-select v-model="informForm.addInfo.subtype" placeholder="请选择">
                                            <el-option v-for="item in informCateList" :key="item.id" :label="item.name" :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="缩略图" required>
                                        <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="moreInformShow">
                                            <img v-if="informForm.thumbUrl" :src="informForm.thumbUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="商家名称" required prop="addInfo.name">
                                        <el-input v-model="informForm.addInfo.name"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="商家地址" required prop="addInfo.location">
                                        <el-input v-model="informForm.addInfo.location"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="商家电话" required prop="addInfo.telephone">
                                        <el-input v-model="informForm.addInfo.telephone"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="详细内容" required>
                                        <quill-editor v-model="informForm.addInfo.themeContent"></quill-editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addEditInformVisible = false">取消</el-button>
                            <el-button type="primary" @click="addInformSubmit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
                <div class="secondAnnounce" v-show="secInformVisible" title="类别管理">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="informCateFilters">
                            <el-form-item>
                                <span>快速添加分类：</span>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="informCateFilters.addType" placeholder="添加类别"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="informCateAdd">添加</el-button>
                            </el-form-item>
                            <el-form-item class="pull-right">
                                <el-button type="danger" @click="backToFirstInform">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="informCateBatchRemove" :disabled="true">批量删除</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="informCateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="informCateLoading"
                        @selection-change="selsInformCateChange" style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="类别">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="informCateEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="informCateDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="informCateCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total,sizes, prev, pager, next, jumper" :total="informCateList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--编辑界面-->
                    <el-dialog title="编辑" :visible.sync="informCateVisible">
                        <el-form :model="informCateForm" label-width="80px" ref="informCateForm">
                            <el-form-item label="分类" prop="name">
                                <el-input v-model="informCateForm.name" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="informCateVisible = false">取消</el-button>
                            <el-button type="primary" @click="editInformCateSubmit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import {
        showDisplay,
        addDisplay,
        deleteDisplay,
        findDic,
        showDict,
        addDict,
        deleteDict,
        uploadPic
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                imgUploadUrl: '',
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                activeName: 'first',
                page: 1,
                pagesize: 7,
                firstAnVisible: true,
                secondAnVisible: false,
                firInformVisible: true,
                secInformVisible: false,
                announceFilters: {
                    searchTitle: '',
                    secCateAnValue: '',
                    timeAnValue: []
                },
                informFilters: {
                    searchTitle: '',
                    secCateInformValue: '',
                    timeInformValue: []
                },
                anSels: [], //园区公告 列表选中列
                informSels: [], //惠通知 列表选中列
                addEditTitle: '新增',
                morePicList: [],
                announceList: [],
                informList: [],
                announceLoading: false,
                informLoading: false,
                addEditAnVisible: false,
                addEditInformVisible: false,
                announceForm: {
                    title: '',
                    thumbUrl: '',
                    type: '公告',
                    detailUrl: '',
                    addInfo: {
                        subtype: '',
                        themeContent: '',
                    }
                },
                informForm: {
                    thumbUrl: '',
                    title: '',
                    type: '惠通知',
                    detailUrl: '',
                    addInfo: {
                        subtype: '',
                        themeContent: '',
                        location: '',
                        telephone: '',
                        name: ''
                    }
                },
                informFormRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: ['blur']
                    }],
                    addInfo: [{
                        subtype: [{
                            required: true,
                            message: '请选择类别',
                            trigger: ['blur']
                        }],
                        name: [{
                            required: true,
                            message: '请输入商家名称',
                            trigger: ['blur']
                        }],
                        location: [{
                            required: true,
                            message: '请输入商家地址',
                            trigger: ['blur']
                        }],
                        telephone: [{
                            required: true,
                            message: '请输入商家电话',
                            trigger: ['blur']
                        }],
                    }],
                },
                selectLabel: '',
                announceContent: '',
                informContent: '',
                dialogAnImageUrl: '',
                dialogAnVisible: false,
                dialogInformImageUrl: '',
                dialogInformVisible: false,
                anCategoryFilters: {
                    addType: ''
                },
                informCateFilters: {
                    addType: ''
                },
                anCategoryList: [],
                informCateList: [],
                anCategoryLoading: false,
                informCateLoading: false,
                anCateSels: [], //园区公告类别管理列表选中项
                informCateSels: [], //惠通知类别管理列表选中项
                anCateVisible: false,
                informCateVisible: false,
                anCateForm: {
                    type: ''
                },
                informCateForm: {
                    type: ''
                },
                cateDic: {},
                informCateDic: {},
                isEdit: false,
                isEditId: '',
            }
        },
        methods: {
            handleClick(tab, event) {
                this.page = 1;
            },
            backToFirstAn() {
                this.firstAnVisible = true;
                this.secondAnVisible = false;
                this.page = 1;
            },
            cateAnMg() { // 园区公告 类别管理
                this.firstAnVisible = false;
                this.secondAnVisible = true;
                this.page = 1;
            },
            backToFirstInform() {
                this.firInformVisible = true;
                this.secInformVisible = false;
                this.page = 1;
            },
            cateInformMg() { // 惠通知 类别管理
                this.firInformVisible = false;
                this.secInformVisible = true;
                this.page = 1;
            },
            getQueryAnnou() { // 园区公告 条件查询
                let type = '公告';
                let url = showDisplay + type;
                let startTime = this.announceFilters.timeAnValue[0];
                let endTime = this.announceFilters.timeAnValue[1];
                let subType = this.announceFilters.secCateAnValue;
                let title = this.announceFilters.searchTitle;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime.replace(/-/g, '/');
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                url = subType === '' ? url + '' : url + '&subType=' + subType;
                this.getAnnounce(url);
                // this.announceFilters = {
                //     secCateAnValue: '',
                //     timeAnValue: [],
                //     searchTitle: ''
                // }
            },
            getAnnounceMg() { //获取园区公告列表
                let type = '公告';
                this.getAnnounce(showDisplay + type);
            },
            getAnnounce(url) { //园区公告列表数据
                this.announceLoading = true;
                this.$get(url)
                    .then((res) => {
                        this.announceList = res;
                        this.announceLoading = false;
                    })
            },
            getQueryInform() { //惠通知列表 条件查询
                let type = '惠通知';
                let url = showDisplay + type;
                let startTime = this.informFilters.timeInformValue[0];
                let endTime = this.informFilters.timeInformValue[1];
                let subType = this.informFilters.secCateInformValue;
                let title = this.informFilters.searchTitle;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime.replace(/-/g, '/');
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                url = subType === '' ? url + '' : url + '&subType=' + subType;
                this.getInformList(url);
                // this.informFilters = {
                //     secCateInformValue: '',
                //     timeInformValue: [],
                //     searchTitle: ''
                // }
            },
            // 获取惠通知列表
            getInform() {
                let type = '惠通知';
                this.getInformList(showDisplay + type);
            },
            // 惠通知列表 数据
            getInformList(url) {
                this.informLoading = true;
                this.$get(url)
                    .then((res) => {
                        this.informList = res;
                        this.informLoading = false;
                    })
            },
            // 园区公告批量删除
            announceBatchRemove() {
                var ids = this.anSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.announceLoading = true;
                    //NProgress.start();
                    let para = {
                        ids: ids
                    };
                    // batchRemoveUser(para).then((res) => {
                    //     this.highActLoading = false;
                    //     //NProgress.done();
                    //     this.$message({
                    //         message: '删除成功',
                    //         type: 'success'
                    //     });
                    //     this.getHighActivity();
                    // });
                }).catch(() => {});
            },
            // 园区公告批量删除
            informBatchRemove() {
                var ids = this.informSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informLoading = true;
                    let para = {
                        ids: ids
                    };

                }).catch(() => {});
            },
            // 惠通知 打开新增弹框
            informAdd() {
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.morePicList.length = 0;
                this.informContent = '';
                this.addEditInformVisible = true;
                this.informForm = {
                    thumbUrl: '',
                    title: '',
                    type: '惠通知',
                    detailUrl: 'null',
                    addInfo: {
                        subtype: '',
                        themeContent: '',
                        location: '',
                        telephone: '',
                        name: ''
                    }
                };
                this.$refs.informForm.resetFields();
            },
            announceAdd() {
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.morePicList.length = 0;
                this.announceContent = '';
                this.addEditAnVisible = true;
                this.announceForm = {
                    title: '',
                    thumbUrl: '',
                    type: '公告',
                    detailUrl: '',
                    addInfo: {
                        subtype: '',
                        themeContent: '',
                    }
                };
            },
            selsAnChange(val) {
                this.anSels = val;
            },
            selsInformChange(val) {
                this.informSels = val;
            },
            secAnValue(value) {
                let obj = {};
                obj = this.anCategoryList.find((item) => { //遍历的数据源
                    return item.id === value; //筛选出匹配数据
                });
                this.selectLabel = obj.name;
            },
            // secInformValue(value) {
            //     let obj = {};
            //     obj = this.informCateList.find((item) => { //遍历的数据源
            //         return item.id === value; //筛选出匹配数据
            //     });
            //     this.selectLabel = obj.name;
            // },
            announceFormImgUpload(res, file, fileList) {
                this.announceForm.thumbUrl = res.responseList.url;
            },
            moreInformShow(res, file, fileList) {
                this.informForm.thumbUrl = res.responseList.url;
            },
            announceAddChange(html) {
                this.announceContent = html;
            },
            informAddChange(html) {
                this.informContent = html;
            },
            // 园区公告新增
            addAnnounceSubmit() {
                let data = this.announceForm;
                data.parkId = localStorage.getItem("parkId");
                if (this.isEdit) {
                    data.id = this.isEditId;
                }
                this.$post(addDisplay, data)
                    .then((res) => {
                        this.addEditAnVisible = false;
                        this.getAnnounceMg();
                    })
            },
            //惠通知 新增或修改
            addInformSubmit() {
                this.$refs.informForm.validate((valid) => {
                    if (valid) {
                        let data = this.informForm;
                        data.parkId = localStorage.getItem("parkId");
                        this.$post(addDisplay, data)
                            .then((res) => {
                                this.addEditInformVisible = false;
                                this.getInform();
                            })
                    }
                });
            },
            //园区公告 显示编辑界面
            AnEdit(index, row) {
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.morePicList.length = 0;
                this.addEditAnVisible = true;
                this.announceForm = publicFunction.deepCopy(this.announceForm, row);
            },
            //惠通知 显示编辑界面
            informEdit(index, row) {
                this.addEditTitle = '编辑';
                this.informForm = {
                    id: '',
                    thumbUrl: '',
                    title: '',
                    type: '惠通知',
                    // detailUrl: 'null',
                    addInfo: {
                        subtype: '',
                        themeContent: '',
                        location: '',
                        telephone: '',
                        name: ''
                    }
                };
                this.isEditId = row.id;
                this.isEdit = true;
                this.addEditInformVisible = true;
                this.informForm = publicFunction.deepCopy(this.informForm, row);
            },
            //园区公告 删除
            AnDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.announceLoading = true;
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteDisplay + para.id)
                        .then(function (response) {
                            self.announceLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAnnounceMg();
                        });
                }).catch(() => {

                });
            },
            //惠通知 删除
            informDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informLoading = true;
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteDisplay + para.id)
                        .then(function (response) {
                            self.informLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInform();
                        });
                }).catch(() => {

                });
            },
            highSizeChange(val) {
                this.pagesize = val;
            },
            announceCurChange(val) {
                this.page = val;
                this.getAnnounceMg();
            },
            informCurChange(val) {
                this.page = val;
                this.getInform();
            },
            // 园区公告类别管理添加
            anCategoryAdd() {
                this.anCategoryLoading = true;
                let data = {
                    parkId: localStorage.getItem("parkId"),
                    name: this.anCategoryFilters.addType,
                    code: this.cateDic.code + '.' + this.anCategoryFilters.addType,
                    pid: this.cateDic.id,
                    pname: this.cateDic.name,
                    addInfo: {}
                };
                this.$post(addDict, data)
                    .then((res) => {
                        this.anCategoryLoading = false;
                        this.getAnCategory();
                    });
                this.anCategoryFilters.addType = '';
            },
            // 惠通知类别管理添加
            informCateAdd() {
                this.informCateLoading = true;
                let data = {
                    parkId: localStorage.getItem("parkId"),
                    name: this.informCateFilters.addType,
                    code: this.informCateDic.code + '.' + this.informCateFilters.addType,
                    pid: this.informCateDic.id,
                    pname: this.informCateDic.name,
                    addInfo: {}
                };
                this.$post(addDict, data)
                    .then((res) => {
                        this.informCateLoading = false;
                        this.getInformCategory();
                    });
                this.informCateFilters.addType = '';
            },
            selsAnCategoryChange(sels) {
                this.anCateSels = sels;
            },
            selsInformCateChange(sels) {
                this.informCateSels = sels;
            },
            // 园区公告 类别管理获取Pid
            getAnCateDic() {
                this.$get(findDic + '公告').then((res) => {
                    this.cateDic = res[0];
                })
            },
            //园区公告 类别管理列表
            getAnCategory() {
                let pname = '公告';
                this.anCategoryLoading = true;
                this.$get(showDict + pname)
                    .then((res) => {
                        this.anCategoryList = res;
                        this.anCategoryLoading = false;
                    })
            },
            // 惠通知 类别管理获取Pid
            getInformCateDic() {
                this.$get(findDic + '惠通知').then((res) => {
                    this.informCateDic = res[0];
                })
            },
            // 惠通知 类别管理列表
            getInformCategory() {
                let pname = '惠通知';
                this.informCateLoading = true;
                this.$get(showDict + pname)
                    .then((res) => {
                        this.informCateList = res;
                        this.informCateLoading = false;
                    })
            },
            anCategoryBatchRemove() { // 园区公告 类别管理批量删除

            },
            informCateBatchRemove() { // 惠通知 类别管理批量删除

            },
            editAnCateSubmit() { //编辑  园区公告类别管理
                this.$refs.anCateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let data = {
                                parkId: localStorage.getItem("parkId"),
                                name: this.anCateForm.name,
                                code: this.cateDic.code + '.' + this.anCateForm.name,
                                pid: this.cateDic.id,
                                pname: this.cateDic.name,
                                id: this.anCateForm.id,
                                addInfo: {}
                            };
                            this.$post(addDict, data)
                                .then((res) => {
                                    this.anCateVisible = false;
                                    this.getAnCategory();
                                })
                        });
                    }
                });
            },
            editInformCateSubmit: function () { //编辑  惠通知类别管理
                this.$refs.informCateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let data = {
                                parkId: localStorage.getItem("parkId"),
                                name: this.informCateForm.name,
                                code: this.informCateDic.code + '.' + this.informCateForm.name,
                                pid: this.informCateDic.id,
                                pname: this.informCateDic.name,
                                id: this.informCateForm.id,
                                addInfo: {}
                            };
                            this.$post(addDict, data)
                                .then((res) => {
                                    this.informCateVisible = false;
                                    this.getInformCategory();
                                })
                        });
                    }
                });
            },
            anCateEdit(index, row) { //园区公告类别管理显示编辑界面
                this.anCateVisible = true;
                this.anCateForm = Object.assign({}, row);
            },
            informCateEdit(index, row) { //惠通知类别管理显示编辑界面
                this.informCateVisible = true;
                this.informCateForm = Object.assign({}, row);
            },
            anCateDel(index, row) { // 类别管理列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.anCategoryLoading = true;
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteDict + para.id)
                        .then(function (response) {
                            self.anCategoryLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAnCategory();
                        });
                }).catch(() => {

                });
            },
            informCateDel(index, row) { // 惠通知类别管理列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informCateLoading = true;
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteDict + para.id)
                        .then(function (response) {
                            self.informCateLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInformCategory();
                        });
                }).catch(() => {

                });
            },
            anCateCurrentChange(val) { //园区公告类别管理分页
                this.page = val;
                this.getAnCategory();
            },
            informCateCurChange(val) { //惠通知类别管理分页
                this.page = val;
                this.getInformCategory();
            },
        },
        mounted() {
            this.getAnnounceMg(); //园区公告列表
            this.getAnCateDic();
            this.getAnCategory(); //园区公告类别管理列表
            this.getInform(); //惠通知列表
            this.getInformCateDic();
            this.getInformCategory() //惠通知 类别管理列表
            this.imgUploadUrl = localStorage.getItem("upUrl") + uploadPic;
            this.imgData.folderName = localStorage.getItem('parkId');
        }
    }
</script>

<style scoped>
</style>