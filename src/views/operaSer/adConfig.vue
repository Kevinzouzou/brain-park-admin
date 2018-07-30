<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true">
                <el-form-item>
                    广告位筛选：
                    <el-select v-model="secAdValue" placeholder="请选择" @change="getAdsList">
                        <el-option label="全部" value="">
                        </el-option>
                        <el-option label="首页" value="首页">
                        </el-option>
                        <el-option label="园区wifi页" value="园区wifi页">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="danger" @click="adsBatchRemove">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="adsAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="adsList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="adsLoading" @selection-change="selsAdsChange"
            style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60" label="序号">
            </el-table-column>
            <el-table-column label="缩略图">
                <template slot-scope="scope">
                    <img :src="scope.row.imageUrl" width="40" height="40" style="border-radius: 6px;" />
                </template>
            </el-table-column>
            <el-table-column prop="position" label="广告位">
            </el-table-column>
            <el-table-column label="链接">
                <template slot-scope="scope">
                    <a :href="scope.row.linkUrl" target="_blank">{{scope.row.linkUrl}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="clickCount" label="点击量">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="AdsEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="AdsDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background @size-change="highSizeChange" @current-change="adsCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="adsList.length" :current-page="page" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title="addEditTitle" :visible.sync="addEditAdsVisible">
            <el-form :model="adsForm" label-width="80px" :rules="adsFormRules" ref="adsForm">
                <el-form-item label="广告图" required>
                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :on-success="uploadAdsImgSuccess" :show-file-list="false">
                        <img v-if="adsForm.imageUrl" :src="adsForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告位" prop="position" required>
                    <el-select v-model="adsForm.position" placeholder="请选择">
                        <el-option v-for="item in adLocList.slice(1)" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接" prop="linkUrl" required>
                    <el-input v-model="adsForm.linkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description" required>
                    <el-input v-model="adsForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addEditAdsVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAdsSubmit" :loading="addEditAdsLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        uploadPic,
        addDisplay,
        deleteDisplay,
        adsUrl,
        addAdsUrl,
        delAdsUrl
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
                secAdValue: '',
                adLocList: [{
                        id: '000',
                        name: '全部页面'
                    },
                    {
                        id: '001',
                        name: '首页'
                    },
                    {
                        id: '002',
                        name: '园区wifi页'
                    },
                ],
                page: 1,
                pagesize: 7,
                adsList: [],
                adsLoading: false,
                adsSels: [], //选中项
                addEditTitle: '新增',
                addEditAdsVisible: false,
                addEditAdsLoading: false,
                adsForm: {
                    addInfo: {},
                    clickCount: 0,
                    createTime: "",
                    description: "",
                    id: "",
                    imageUrl: "",
                    linkUrl: "",
                    parkId: "",
                    position: ""
                },
                adsFormRules: {
                    position: [{
                        required: true,
                        message: '请选择广告位',
                        trigger: 'blur'
                    }],
                    linkUrl: [{
                        required: true,
                        message: '请输入链接',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    }]
                },
                imgAdsList: [],
                dialogAdsImageUrl: '',
                dialogAdsVisible: false,
                selectLabel: '',
                isEdit: false,
                isEditId: '',

            }
        },
        methods: {
            // 获取广告管理列表
            getAdsList() {
                let position = this.secAdValue === '' ? '' : `&position=${this.secAdValue}`;
                this.adsLoading = true;
                this.$get(adsUrl + position)
                    .then((res) => {
                        this.adsList = res;
                        this.adsLoading = false;
                    })
            },
            // 批量删除
            adsBatchRemove() {
                if (this.adsSels.length === 0) {
                    this.$message({
                        message: '请先选择广告',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认删除选中的广告？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.adsSels) {
                            this.$del(delAdsUrl + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已删除广告位为 "${i.position}" 的广告`,
                                    type: 'success'
                                });
                                this.getAdsList();
                            });
                        }
                    }).catch(() => {});
                }
            },
            adsAdd() {
                this.adsForm = {
                    addInfo: {},
                    clickCount: 0,
                    createTime: "",
                    description: "",
                    imageUrl: "",
                    linkUrl: "",
                    parkId: "",
                    position: ""
                };
                this.addEditTitle = '新增';
                this.addEditAdsVisible = true;
            },
            selsAdsChange(val) {
                this.adsSels = val;
            },
            // 显示编辑界面
            AdsEdit(index, row) {
                this.addEditTitle = '编辑';
                this.adsForm.imageUrl = '';
                this.adsForm = publicFunction.deepCopy(this.adsForm, row);
                this.addEditAdsVisible = true;
            },
            // 园区公告 删除
            AdsDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(delAdsUrl + row.id)
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getAdsList();
                        });
                }).catch(() => {});
            },
            highSizeChange(val) {
                this.pagesize = val;
            },
            adsCurChange(val) {
                this.page = val;
                this.getAdsList();
            },
            uploadAdsImgSuccess(res, file, fileList) {
                this.adsForm.imageUrl = res.responseList.url;
            },
            addAdsSubmit() { //新增
                this.$refs.adsForm.validate((valid) => {
                    if (valid) {
                        let data = this.adsForm;
                        data.parkId = localStorage.getItem("parkId");
                        this.$post(addAdsUrl, data)
                            .then(res => {
                                this.addEditAdsVisible = false;
                                this.getAdsList();
                                this.$message({
                                    message: `${this.addEditTitle}成功`,
                                    type: 'success'
                                });
                            })
                    }
                });
            },
        },
        mounted() {
            this.getAdsList();
            this.imgUploadUrl = localStorage.getItem("upUrl") + uploadPic;
            this.imgData.folderName = localStorage.getItem("parkId");
        }
    }
</script>

<style lang="scss">
    .avatar-uploader {
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
    }

    .avatar-uploader {
        .el-upload:hover {
            border-color: #409EFF;
        }
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
</style>