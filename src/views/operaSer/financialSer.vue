<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="公司金融服务" name="first">
                <div v-show="!CorporateFinanceOrder">
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="corporateBatchRemove">批量删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="corporateAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="corporateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="corporateLoading"
                        @selection-change="selsCorporateChange" style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60" label="序号">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="type" label="类别">
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间">
                        </el-table-column>
                        <el-table-column prop="addInfo.lookUpNum" label="浏览量">
                            <template slot-scope="scope">
                                <span>{{scope.row.addInfo.lookUpNum?scope.row.addInfo.lookUpNum:0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="250">
                            <template slot-scope="scope">
                                <el-button type="success" size="small" @click="corporateCheck(scope.$index, scope.row)">订单</el-button>
                                <el-button type="primary" size="small" @click="corporateEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="corporateDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="corporateCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="corporateList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title="addEditTitle" :visible.sync="addEditCorporateVisible">
                        <el-form :model="corporateForm" label-width="100px" ref="corporateForm">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="标题" required>
                                        <el-input v-model="corporateForm.title" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="图片" required>
                                        <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="uploadCorporateImg">
                                            <img v-if="corporateForm.thumbUrl" :src="corporateForm.thumbUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="详细内容" required>
                                        <quill-editor v-model="corporateForm.addInfo.themeContent"></quill-editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addEditCorporateVisible = false">取消</el-button>
                            <el-button type="primary" @click="addCorporateSubmit">提交</el-button>
                        </div>
                    </el-dialog>
                </div>
                <div v-show="CorporateFinanceOrder">
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item label="金融产品：">
                                <span style="font-size: 14px;color: #606266;line-height: 40px;">
                                    {{CorporateFinanceOrderTitle}}
                                </span>
                            </el-form-item>
                            <el-form-item class="pull-right">
                                <el-button type="primary" @click="CorporateFinanceOrder = !CorporateFinanceOrder">返回公司金融服务列表</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="CorporateFinanceOrderList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="corporateLoading"
                        style="width: 100%;">
                        <el-table-column prop="id" label="ID" type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="createTime" label="申请时间" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="addInfo.enterprise" label="企业名称">
                        </el-table-column>
                        <el-table-column prop="addInfo.name" label="联系人">
                        </el-table-column>
                        <el-table-column prop="addInfo.phone" label="联系电话">
                        </el-table-column>
                        <el-table-column label="备注">
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highSizeChange" @current-change="corporateCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="CorporateFinanceOrderList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
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
        userTarget,
        uploadPic,
    } from '../../api/api'
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                page: 1,
                pagesize: 7,
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                imgUploadUrl: '',
                activeName: 'first',
                corSels: [],
                corporateList: [],
                CorporateFinanceOrderTitle: '',
                CorporateFinanceOrderList: [],
                corporateLoading: false,
                addEditTitle: '新增',
                addEditCorporateVisible: false,
                CorporateFinanceOrder: false,
                corporateForm: {
                    detailUrl: 'null',
                    title: '',
                    thumbUrl: '',
                    addInfo: {
                        themeContent: ''
                    }
                },
            }
        },
        methods: {
            handleClick(tab, event) {
                this.page = 1;
            },
            //公司金融服务批量删除
            corporateBatchRemove() {
                if (this.corSels.length === 0) {
                    this.$message({
                        message: '请先选择金融服务',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认删除选中的金融服务？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.corSels) {
                            this.$del(deleteDisplay + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已删除"${i.title}"金融服务`,
                                    type: 'success'
                                });
                                this.getCorporate();
                            });
                        }
                    }).catch(() => {});
                }
            },
            // 新增 
            corporateAdd() {
                this.addEditTitle = '新增';
                this.corporateForm = {
                    title: '',
                    thumbUrl: '',
                    addInfo: {
                        themeContent: ''
                    }
                };
                this.addEditCorporateVisible = true;
            },
            selsCorporateChange(val) {
                this.corSels = val;
            },
            // 显示编辑界面
            corporateEdit(index, row) {
                this.addEditTitle = '编辑';
                this.corporateForm = publicFunction.deepCopy(this.corporateForm, row);
                this.corporateForm.id = row.id;
                this.addEditCorporateVisible = true;
            },
            // 显示金融产品订单
            corporateCheck(index, row) {
                this.CorporateFinanceOrder = true;
                this.CorporateFinanceOrderTitle = row.title;
                this.corporateLoading = true;
                this.$get(userTarget + row.id)
                    .then((res) => {
                        this.CorporateFinanceOrderList = res;
                        this.corporateLoading = false;
                    });
            },
            // 删除
            corporateDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(deleteDisplay + row.id)
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCorporate();
                        });
                }).catch(() => {});
            },
            // 公司金融服务列表
            getCorporate() {
                this.corporateLoading = true;
                this.$get(showDisplay + '金融服务')
                    .then((res) => {
                        this.corporateList = res;
                        this.corporateLoading = false;
                    })
            },
            highSizeChange(val) {
                this.pagesize = val;
            },
            corporateCurChange(val) {
                this.page = val;
                this.getCorporate();
            },
            uploadCorporateImg(res, file, fileList) {
                this.corporateForm.thumbUrl = res.responseList.url
            },
            // 公司金融服务 新增
            addCorporateSubmit() {
                this.$refs.corporateForm.validate((valid) => {
                    if (valid) {
                        if (this.corporateForm.title === '') {
                            this.$message({
                                message: '请填写标题',
                                type: 'error'
                            });
                        } else if (this.corporateForm.thumbUrl === '') {
                            this.$message({
                                message: '请上传图片',
                                type: 'error'
                            });
                        } else if (this.corporateForm.addInfo.themeContent === '') {
                            this.$message({
                                message: '请填写详细内容',
                                type: 'error'
                            });
                        } else {
                            let data = this.corporateForm;
                            data.parkId = localStorage.getItem("parkId");
                            data.type = '金融服务';
                            data.detailUrl = "";
                            this.$post(addDisplay, data)
                                .then((res) => {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.addEditCorporateVisible = false;
                                    this.getCorporate();
                                });
                        }
                    }
                });
            },
        },
        mounted() {
            this.getCorporate(); //公司金融服务列表
            this.imgUploadUrl = localStorage.getItem("upUrl") + uploadPic;
            this.imgData.folderName = localStorage.getItem("parkId");
        }
    }
</script>

<style scoped>
</style>