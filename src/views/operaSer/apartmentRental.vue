<template>
    <section>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="ApartmentRentalResourcesAddVisible = true">新增公寓</el-button>
                </el-form-item>
                <el-form-item>
                    <span>搜索条件：</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="ApartmentRentalResourcesListFilters.nameOrLocation" class="userinfo-search" placeholder="用户搜索，如姓名、昵称、手机"
                        prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getApartmentRentalResourcesList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <!--列表-->
            <el-table :data="ApartmentRentalResourcesList.slice((ApartmentRentalResourcesListPage-1)*ApartmentRentalResourcesListPagesize,ApartmentRentalResourcesListPage*ApartmentRentalResourcesListPagesize)"
                highlight-current-row v-loading="ApartmentRentalResourcesListLoading" style="width: 100%;">
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="title" label="小区名称">
                </el-table-column>
                <el-table-column label="图片" width="230">
                    <template slot-scope="scope">
                        <span v-for="item in scope.row.addInfo.images" style="margin:0 5px">
                            <img class="tableImg" :src="item" width="40" height="40" />
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="addInfo.location" label="小区地点">
                </el-table-column>
                <el-table-column prop="addInfo.minRent" label="最低月租">
                </el-table-column>
                <el-table-column prop="addInfo.maxRent" label="最高月租">
                </el-table-column>
                <el-table-column prop="addInfo.contact" label="租房联系人">
                </el-table-column>
                <el-table-column prop="addInfo.contactPhone" label="联系人电话">
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="ApartmentRentalResourcesCheck(scope.$index, scope.row)">查看</el-button>
                        <el-button type="success" size="small" @click="ApartmentRentalResourcesEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteApartmentRentalResources(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="ApartmentRentalResourcesListPagesizeChange" @current-change="ApartmentRentalResourcesListPageCurrentChange"
                    :page-sizes="[8,10,20,50]" :page-size="ApartmentRentalResourcesListPagesize" layout="total,sizes, prev, pager, next, jumper"
                    :current-page="ApartmentRentalResourcesListPage" :total="ApartmentRentalResourcesListTotal" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新增公寓 -->
        <el-dialog title="新增公寓" :visible.sync="ApartmentRentalResourcesAddVisible">
            <el-form :model="ApartmentRentalResourcesAddForm" label-width="150px" :rules="ApartmentRentalResourcesAddFormRules" ref="ApartmentRentalResourcesAddForm">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区名称：" required prop="title">
                            <el-input v-model="ApartmentRentalResourcesAddForm.title" placeholder="小区名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区地点：" required prop="addInfo.location">
                            <el-input v-model="ApartmentRentalResourcesAddForm.addInfo.location" placeholder="小区地点"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="图片：" required>
                            <el-upload :action="imageUploadUrl" :data="imgData" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveForAdd"
                                :before-upload="beforeUpload" :on-success="moreShowForAdd" :on-error="imgUploadError" :limit="4"
                                :before-remove="beforeRemove" :on-exceed="handleExceed">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl">
                            </el-dialog>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="最低月租：" required prop="addInfo.minRent">
                            <el-input v-model="ApartmentRentalResourcesAddForm.addInfo.minRent" placeholder="最低月租"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="最高月租：" required prop="addInfo.maxRent">
                            <el-input v-model="ApartmentRentalResourcesAddForm.addInfo.maxRent" placeholder="最高月租"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区户型：" required prop="addInfo.unit">
                            <el-checkbox-group v-model="ApartmentRentalResourcesAddForm.addInfo.unit">
                                <el-checkbox label="单间出租"></el-checkbox>
                                <el-checkbox label="一室一厅"></el-checkbox>
                                <el-checkbox label="二室一厅"></el-checkbox>
                                <el-checkbox label="三室两厅"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="租房联系人：" required prop="addInfo.contact">
                            <el-input v-model="ApartmentRentalResourcesAddForm.addInfo.contact" placeholder="租房联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="联系人电话：" required prop="addInfo.contactPhone">
                            <el-input v-model="ApartmentRentalResourcesAddForm.addInfo.contactPhone" placeholder="联系人电话"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区环境：" required prop="addInfo.surrounding">
                            <el-input type="textarea" v-model="ApartmentRentalResourcesAddForm.addInfo.surrounding" placeholder="小区环境"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注说明：" required prop="addInfo.remark">
                            <el-input type="textarea" v-model="ApartmentRentalResourcesAddForm.addInfo.remark" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ApartmentRentalResourcesAddVisible = false">关闭</el-button>
                <el-button type="primary" @click="addApartmentRentalResources('ApartmentRentalResourcesAddForm')">提交</el-button>
            </div>
        </el-dialog>
        <!-- 查看公寓 -->
        <el-dialog title="查看公寓" :visible.sync="ApartmentRentalResourcesCheckVisible">
            <el-form :model="ApartmentRentalResourcesAddForm" label-width="150px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区名称：">
                            <span>{{ApartmentRentalResourcesEditForm.title}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区地点：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.location}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="图片：">
                            <img class="addInfoImg" v-for="item in ApartmentRentalResourcesEditForm.addInfo.images" :src="item">
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="最低月租：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.minRent}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="最高月租：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.maxRent}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区户型：">
                            <span v-for="item in ApartmentRentalResourcesEditForm.addInfo.unit">{{item}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="租房联系人：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.contact}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="联系人电话：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.contactPhone}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区环境：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.surrounding}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注说明：">
                            <span>{{ApartmentRentalResourcesEditForm.addInfo.remark}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ApartmentRentalResourcesCheckVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 编辑公寓 -->
        <el-dialog title="编辑公寓" :visible.sync="ApartmentRentalResourcesEditVisible">
            <el-form :model="ApartmentRentalResourcesEditForm" label-width="150px" :rules="ApartmentRentalResourcesAddFormRules" ref="ApartmentRentalResourcesEditForm">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区名称：" required prop="title">
                            <el-input v-model="ApartmentRentalResourcesEditForm.title" placeholder="小区名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区地点：" required prop="addInfo.location">
                            <el-input v-model="ApartmentRentalResourcesEditForm.addInfo.location" placeholder="小区地点"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="图片：" required>
                            <el-upload :action="imageUploadUrl" :data="imgData" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveForEdit"
                                :before-upload="beforeUpload" :on-success="moreShowForEdit" :on-error="imgUploadError" :limit="4"
                                :file-list="ApartmentRentalResourcesEditForm.addInfo.images" :before-remove="beforeRemove" :on-exceed="handleExceed">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl">
                            </el-dialog>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="最低月租：" required prop="addInfo.minRent">
                            <el-input v-model="ApartmentRentalResourcesEditForm.addInfo.minRent" placeholder="最低月租"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="最高月租：" required prop="addInfo.maxRent">
                            <el-input v-model="ApartmentRentalResourcesEditForm.addInfo.maxRent" placeholder="最高月租"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区户型：" required prop="addInfo.unit">
                            <el-checkbox-group v-model="ApartmentRentalResourcesEditForm.addInfo.unit">
                                <el-checkbox label="单间出租"></el-checkbox>
                                <el-checkbox label="一室一厅"></el-checkbox>
                                <el-checkbox label="二室一厅"></el-checkbox>
                                <el-checkbox label="三室两厅"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="租房联系人：" required prop="addInfo.contact">
                            <el-input v-model="ApartmentRentalResourcesEditForm.addInfo.contact" placeholder="租房联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="联系人电话：" required prop="addInfo.contactPhone">
                            <el-input v-model="ApartmentRentalResourcesEditForm.addInfo.contactPhone" placeholder="联系人电话"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="小区环境：" required prop="addInfo.surrounding">
                            <el-input type="textarea" v-model="ApartmentRentalResourcesEditForm.addInfo.surrounding" placeholder="小区环境"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注说明：" required prop="addInfo.remark">
                            <el-input type="textarea" v-model="ApartmentRentalResourcesEditForm.addInfo.remark" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ApartmentRentalResourcesEditVisible = false">关闭</el-button>
                <el-button type="primary" @click="updateApartmentRentalResources('ApartmentRentalResourcesEditForm')">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        uploadPic,
        apartmentResourcesList,
        showDisplay,
        addDisplay,
        deleteDisplay
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                imageUploadUrl: '',
                dialogImageUrl: '',
                dialogVisible: false,
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: localStorage.getItem('parkId')
                },
                ApartmentRentalResourcesListPage: 1,
                ApartmentRentalResourcesListPagesize: 8,
                ApartmentRentalResourcesListFilters: {
                    nameOrLocation: ''
                },
                ApartmentRentalResourcesList: [],
                ApartmentRentalResourcesListTotal: 0,
                ApartmentRentalResourcesListLoading: false,
                ApartmentRentalResourcesAddVisible: false,
                ApartmentRentalResourcesCheckVisible: false,
                ApartmentRentalResourcesEditVisible: false,
                ApartmentRentalResourcesAddForm: {
                    thumbUrl: "null",
                    addInfo: {
                        location: "",
                        images: [],
                        minRent: "",
                        maxRent: "",
                        unit: [],
                        contact: "",
                        contactPhone: "",
                        surrounding: "",
                        remark: ""
                    },
                    title: ''
                },
                ApartmentRentalResourcesAddFormRules: {
                    title: [{
                        required: true,
                        message: '请输入名称',
                        trigger: ['blur'],
                    }],
                    addInfo: {
                        location: [{
                            required: true,
                            message: '请输入地点',
                            trigger: ['blur', 'change']
                        }],
                        minRent: [{
                            required: true,
                            message: '请输入正确的价格',
                            trigger: ['blur', 'change'],
                            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
                        }],
                        maxRent: [{
                            required: true,
                            message: '请输入正确的价格',
                            trigger: ['blur', 'change'],
                            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
                        }],
                        unit: [{
                            type: 'array',
                            required: true,
                            message: '请至少选择一个小区户型',
                            trigger: 'change'
                        }],
                        contact: [{
                            required: true,
                            message: '请输入租房联系人',
                            trigger: ['blur'],
                        }],
                        contactPhone: [{
                            required: true,
                            message: '请输入联系人电话',
                            trigger: ['blur'],
                        }],
                        surrounding: [{
                            required: true,
                            message: '请输入详细介绍',
                            trigger: ['blur']
                        }],
                        remark: [{
                            required: true,
                            message: '请输入温馨提示',
                            trigger: ['blur']
                        }]
                    }
                },
                ApartmentRentalResourcesEditForm: {
                    id: '',
                    thumbUrl: "null",
                    title: '',
                    addInfo: {
                        location: "",
                        images: [],
                        minRent: "",
                        maxRent: "",
                        unit: [],
                        contact: "",
                        contactPhone: "",
                        surrounding: "",
                        remark: ""
                    }
                },
            }
        },
        methods: {
            // 获取公寓列表
            getApartmentRentalResourcesList() {
                this.ApartmentRentalResourcesListLoading = true;
                let nameOrLocation = this.ApartmentRentalResourcesListFilters.nameOrLocation === '' ? '' :
                    `&nameOrLocation=${this.ApartmentRentalResourcesListFilters.nameOrLocation}`;
                this.$get(apartmentResourcesList + '&type=公寓租赁' + nameOrLocation).then(res => {
                    this.ApartmentRentalResourcesList = res;
                    this.ApartmentRentalResourcesListTotal = res.length;
                    this.ApartmentRentalResourcesListLoading = false;
                });
            },
            ApartmentRentalResourcesListPagesizeChange(val) {
                this.ApartmentRentalResourcesListPagesize = val;
            },
            ApartmentRentalResourcesListPageCurrentChange(val) {
                this.ApartmentRentalResourcesListPage = val;
                this.sharedResourceListSeach();
            },
            // 上传图片组件
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleRemoveForAdd(file, fileList) {
                this.ApartmentRentalResourcesAddForm.addInfo.images = fileList;
            },
            moreShowForAdd(res, file, fileList) {
                this.ApartmentRentalResourcesAddForm.addInfo.images = fileList;
            },
            handleRemoveForEdit(file, fileList) {
                this.ApartmentRentalResourcesEditForm.addInfo.images = fileList;
            },
            moreShowForEdit(res, file, fileList) {
                this.ApartmentRentalResourcesEditForm.addInfo.images = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogVisible = true;
                this.dialogImageUrl = file.url;
            },
            imgUploadError(res, file) {
                this.$message({
                    message: '图片上传失败，请检查',
                    type: 'error'
                });
            },
            beforeUpload(file) {
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
            // 添加公寓
            addApartmentRentalResources(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let arr = [];
                        let images = this.ApartmentRentalResourcesAddForm.addInfo.images;
                        for (let i in images) {
                            if (typeof images[i].response === 'undefined') {
                                arr.push(images[i].url);
                            } else {
                                arr.push(images[i].response.responseList.url)
                            }
                        }
                        let data = this.ApartmentRentalResourcesAddForm;
                        data.parkId = localStorage.getItem('parkId');
                        data.type = '公寓租赁';
                        data.addInfo.images = arr;
                        if (arr.length < 1) {
                            this.$alert('请至少添加一张图片', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$post(addDisplay, data).then(
                                res => {
                                    if (res.operationResult === 'failure') {
                                        this.$message({
                                            message: 'failureMsg',
                                            type: 'error'
                                        });
                                    } else {
                                        this.resetForm(formName);
                                        this.ApartmentRentalResourcesAddVisible = false;
                                        this.$message({
                                            message: '添加成功',
                                            type: 'success'
                                        });
                                        this.getApartmentRentalResourcesList()
                                    }
                                }
                            );
                        }
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 查看公寓
            ApartmentRentalResourcesCheck(index, row) {
                this.ApartmentRentalResourcesCheckVisible = true;
                this.ApartmentRentalResourcesEditForm = publicFunction.deepCopy(this.ApartmentRentalResourcesEditForm,
                    row);
            },
            // 编辑公寓
            ApartmentRentalResourcesEdit(index, row) {
                this.ApartmentRentalResourcesEditForm = publicFunction.deepCopy(this.ApartmentRentalResourcesEditForm,
                    row);
                let images = this.ApartmentRentalResourcesEditForm.addInfo.images;
                let arr = [];
                for (let i in images) {
                    let data = {
                        name: i,
                        url: images[i]
                    }
                    arr.push(data)
                }
                this.ApartmentRentalResourcesEditForm.addInfo.images = arr;
                this.ApartmentRentalResourcesEditVisible = true;
            },
            // 更新公寓信息
            updateApartmentRentalResources(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let arr = [];
                        let images = this.ApartmentRentalResourcesEditForm.addInfo.images;
                        for (let i in images) {
                            if (typeof images[i].response === 'undefined') {
                                arr.push(images[i].url);
                            } else {
                                arr.push(images[i].response.responseList.url)
                            }
                        }
                        let data = this.ApartmentRentalResourcesEditForm;
                        data.parkId = localStorage.getItem('parkId');
                        data.type = '公寓租赁';
                        data.addInfo.images = arr;
                        console.log(JSON.stringify(data));
                        if (arr.length < 1) {
                            this.$alert('请至少添加一张图片', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            this.$post(addDisplay, data).then(
                                res => {
                                    if (res.operationResult === 'failure') {
                                        this.$message({
                                            message: 'failureMsg',
                                            type: 'error'
                                        });
                                    } else {
                                        this.resetForm(formName);
                                        this.ApartmentRentalResourcesEditVisible = false;
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.getApartmentRentalResourcesList()
                                    }
                                }
                            );
                        }
                    } else {

                    }
                });
            },
            // 删除公寓
            deleteApartmentRentalResources(index, row) {
                this.$confirm('确认删除该公寓?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$del(deleteDisplay + row.id).then(res => {
                        this.getApartmentRentalResourcesList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        mounted() {
            this.imageUploadUrl = localStorage.getItem('upUrl') + uploadPic;
            this.getApartmentRentalResourcesList();
        }
    }
</script>
<style lang="scss" scoped>
    .tableImg {
        width: 40px;
        height: 40px;
        border-radius: 4px;
    }

    .addInfoImg {
        width: 250px;
        border-radius: 4px;
        margin: 0 10px;
    }
</style>