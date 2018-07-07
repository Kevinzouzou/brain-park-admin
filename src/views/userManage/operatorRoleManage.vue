<template>
    <section>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" justify="center">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="addRoleFormVisible = true">新增角色</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--工具条-->
        <!--列表-->
        <el-table :data="parkRoleList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="parkRoleListLoading"
            style="width: 100%;">
            <el-table-column type="index" label="序号">
            </el-table-column>
            <el-table-column prop="name" label="角色名称">
            </el-table-column>
            <el-table-column prop="addInfo.permissionList" label="权限">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="parkStaffEdit(scope.$index, scope.row)">详情</el-button>
                    <el-button type="danger" size="small" @click="deleteParkOperator(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--列表-->
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                    layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="parkRoleListTotal" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <!--工具条-->
        <!--弹出框 新增用户-->
        <el-dialog title="新增员工" :visible.sync="addRoleFormVisible">
            <el-row :gutter="20">
                <el-form :model="addRoleForm" :label-position="right" label-width="160px" :rules="addRoleFormRules" ref="addRoleForm">
                    <el-row :gutter="24">
                        <el-col :span="10">
                            <el-form-item label="角色名称：" required prop="name">
                                <el-input placeholder="角色名称" v-model="addRoleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="角色描述：" required prop="intro">
                                <el-input type="textarea" placeholder="角色描述" v-model="addRoleForm.intro"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="角色权限" required>
                            请选择角色可操作的业务模块
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <el-row class="row-bg">园区整体运营概况类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="主页概况"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区用户与物业工作人员管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="用户概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="用户操作"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="员工管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="部门组织架构"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="操作员账号管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="操作员角色管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区企业信息管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业操作"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区运营服务管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="运营概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="圈子"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="话题"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="广告配置"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="推送配置"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="金融服务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="商家联盟"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="用户反馈处理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="信息公告"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区入驻企业服务类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="服务效能概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业之家"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="流程业务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="租赁合同管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区工作管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="考勤"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="审批"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="工作手册"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="通讯录"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区基础建设运维类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="运维概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="区域管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="设备管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">数据分析与报表类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="数据中心"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">平台基础配置类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="系统设置"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                    </el-col>
                </el-row>

            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRoleFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParkRole('addRoleForm')">提交</el-button>
            </div>
        </el-dialog>
        <!--弹出框 新增操作员角色-->
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        parkRoleList,
        addOrUpdateParkRole
    } from '../../api/api';
    export default {
        data() {
            return {
                page: 1,
                pagesize: 7,
                parkRoleListLoading: false,
                parkRoleList: [],
                parkRoleListTotal: 0,
                parkInfoTreeList: [], // 组织结构数据
                addRoleForm: {
                    parkId: '',
                    name: '',
                    intro: '',
                    addInfo: {
                        permissionList: [],
                    }
                },
                addRoleFormVisible: false,
                restaurants: [],
                addRoleFormRules: {
                    name: [{
                        required: true,
                        message: "请填写角色名称",
                        trigger: "blur"
                    }],
                    intro: [{
                        required: true,
                        message: "请填写角色描述",
                        trigger: "blur"
                    }],
                }
            };
        },
        methods: {
            // 查询角色列表
            getParkRoleList(url) {
                this.parkRoleListLoading = true;
                this.$get(url)
                    .then((res) => {
                        this.parkRoleList = res;
                        this.parkRoleListTotal = this.parkRoleList.length > 0 ? this.parkRoleList.length : 0;
                        this.parkRoleListLoading = false;
                    })
            },
            // 添加角色
            addParkRole: function (formName) {
                this.$refs[formName].validate(valid => {
                    let data = this.addRoleForm;
                    data.parkId = localStorage.getItem("parkId");
                    this.$put(addOrUpdateParkRole, data).then(res => {
                        this.getParkRoleList(parkRoleList);
                        this.resetForm("addRoleForm");
                        this.$message({
                            message: "添加成功",
                            type: "success"
                        });
                        this.getParkRoleList(parkRoleList);
                        this.addRoleFormVisible = false;
                    });
                })
            },
            // 删除角色
            deleteParkRole: function (index, row) {
                this.$confirm('删除操作员将同时取消该操作员的平台登录权限,是否删除？', '注意！', {
                    type: 'warning'
                }).then(() => {
                    this.parkOperatorListList = true;
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteStaff + para.id).then(function (response) {
                        self.parkOperatorListList = false;
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        self.getParkOperatorList(parkOperatorList);
                    });
                }).catch(() => {

                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            pageSizeChange(val) {
                this.pagesize = val;
            },
            pageCurrentChange(val) {
                this.page = val;
                this.getParkRoleList(parkRoleList);
            },

        },
        mounted() {
            this.getParkRoleList(parkRoleList);
        }
    }
</script>
<style lang="scss" scoped>
</style>