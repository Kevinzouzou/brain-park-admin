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
                <template slot-scope="scope">
                    <span :key="item" v-for="item in scope.row.addInfo.permissionList">{{item}}、</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="parkRoleEdit(scope.$index, scope.row)">详情</el-button>
                    <el-button type="danger" size="small" @click="deleteParkRole(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--列表-->
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-sizes="[8,10,20,50]" :page-size="pagesize"
                    layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="parkRoleListTotal" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <!--工具条-->
        <!--弹出框 新增用户-->
        <el-dialog title="新增角色" :visible.sync="addRoleFormVisible">
            <el-row :gutter="20">
                <el-form :model="addRoleForm" :label-position="'right'" label-width="160px" :rules="addRoleFormRules" ref="addRoleForm">
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
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="金融服务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="用户反馈处理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="信息公告"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="共享资源"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="公寓租赁资源"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="家政服务"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg mt10">园区入驻企业服务类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业之家"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="流程业务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="服务效能概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="租赁合同管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg mt10" >园区工作管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="考勤"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="审批"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="排班"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="工作手册"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="通讯录"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg mt10" >园区物业服务管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="addRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="服务效能概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="投诉建议&报修处理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="物业公告"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="放行申请"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="设备巡检"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="巡更管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="抄表管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="监控管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="收费管理"></el-checkbox>
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

        <!--弹出框 编辑操作员角色-->
        <el-dialog title="角色详情" :visible.sync="editRoleFormVisible">
            <el-row :gutter="20" v-show="editRoleFormInfoVisible">
                <el-form :model="editRoleForm" :label-position="'right'" label-width="160px">
                    <el-row :gutter="24">
                        <el-col :span="10">
                            <el-form-item label="角色名称：">
                                {{editRoleForm.name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="10">
                            <el-button type="primary" @click="editRoleFormInfoVisible = false">修改</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="角色描述：">
                                {{editRoleForm.intro}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="角色权限">
                            请选择角色可操作的业务模块
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <el-row class="row-bg">角色权限：
                            <el-button type="text" style="float: right;padding: 0;" @click="innerRoleFormVisible = true">查看哪些操作员账号关联此角色>></el-button>
                        </el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <span :key="item" v-for="item in editRoleForm.addInfo.permissionList">
                                {{item}}、
                            </span>
                        </el-card>
                    </el-col>
                </el-row>
            </el-row>
            <el-dialog width="30%" title="关联当前角色的操作员账号：" :visible.sync="innerRoleFormVisible" append-to-body>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <!--列表-->
                        <el-table :data="userByRoleList" highlight-current-row style="width: 100%;">
                            <el-table-column prop="phone" label="账号名">
                            </el-table-column>
                            <el-table-column prop="addInfo.permissionList" label="最后登录时间">
                            </el-table-column>
                        </el-table>
                        <!--列表-->
                        <div style="margin-top:10px">
                            账号数量：{{userByRoleListTotal}}
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>
            <el-row :gutter="20" v-show="!editRoleFormInfoVisible">
                <el-form :model="editRoleForm" :label-position="'right'" label-width="160px" :rules="editRoleFormRules" ref="editRoleForm">
                    <el-row :gutter="24">
                        <el-col :span="10">
                            <el-form-item label="角色名称：" required prop="name">
                                <el-input placeholder="角色名称" v-model="editRoleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="角色描述：" required prop="intro">
                                <el-input type="textarea" placeholder="角色描述" v-model="editRoleForm.intro"></el-input>
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
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="主页概况"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区用户与物业工作人员管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
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
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业操作"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区运营服务管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="运营概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="圈子"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="话题"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="广告配置"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="金融服务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="用户反馈处理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="信息公告"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="共享资源"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="公寓租赁资源"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="家政服务"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区入驻企业服务类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="服务效能概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="企业之家"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="流程业务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="租赁合同管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="政务服务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="IT服务"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="人才服务"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区工作管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="考勤"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="审批"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="排班"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="工作手册"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="通讯录"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg mt10" >园区物业服务管理类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="服务效能概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="投诉建议&报修处理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="物业公告"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="放行申请"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="设备巡检"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="巡更管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="抄表管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="监控管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="收费管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">园区基础建设运维类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="运维概况"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="区域管理"></el-checkbox>
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="设备管理"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">数据分析与报表类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="数据中心"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                        <el-row class="row-bg" style="margin-top:10px;">平台基础配置类</el-row>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-checkbox-group v-model="editRoleForm.addInfo.permissionList">
                                <el-checkbox style="min-width: 150px;margin: 5px !important;" label="系统设置"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                    </el-col>
                </el-row>
            </el-row>
            <div slot="footer" class="dialog-footer" v-show="!editRoleFormInfoVisible">
                <el-button @click="editRoleFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="parkRoleUpdate('editRoleForm')">提交</el-button>
            </div>
        </el-dialog>
        <!--弹出框 编辑操作员角色-->
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        parkRoleList,
        addOrUpdateParkRole,
        deleteParkRole,
        findUserByRoleId
    } from '../../api/api';
    export default {
        data() {
            return {
                page: 1,
                pagesize: 8,
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
                },
                editRoleFormInfoVisible: true,
                editRoleFormVisible: false,
                innerRoleFormVisible: false,
                userByRoleList: [],
                userByRoleListTotal: 0,
                editRoleForm: {
                    id: '',
                    parkId: '',
                    name: '',
                    intro: '',
                    addInfo: {
                        permissionList: [],
                    }
                },
                editRoleFormRules: {
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
                },
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
                this.$confirm('删除角色将同时取消该角色关联的操作员权限,是否删除？', '注意！', {
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$del(deleteParkRole + row.id).then((response) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getParkRoleList(parkRoleList);
                    });
                }).catch(() => {

                });
            },
            // 编辑角色
            parkRoleEdit: function (index, row) {
                this.editRoleForm.name = row.name;
                this.editRoleForm.intro = row.intro;
                this.editRoleForm.addInfo.permissionList = row.addInfo.permissionList;
                this.editRoleForm.id = row.id;
                this.findUserByRoleId();
                this.editRoleFormVisible = true;
                this.editRoleFormInfoVisible = true;
            },
            // 查找使用此角色的操作员
            findUserByRoleId() {
                this.$get(findUserByRoleId + this.editRoleForm.id).then(res => {
                    this.userByRoleList = res;
                    this.userByRoleListTotal = res.length;
                });
            },
            // 更新角色
            parkRoleUpdate: function (formName) {
                this.$refs[formName].validate(valid => {
                    let data = this.editRoleForm;
                    data.parkId = localStorage.getItem("parkId");
                    this.$put(addOrUpdateParkRole, data).then(res => {
                        this.resetForm("editRoleForm");
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        });
                        this.getParkRoleList(parkRoleList);
                        this.editRoleFormVisible = false;
                    });
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            pageSizeChange(val) {
                this.pagesize = val;
            },
            pageCurrentChange(val) {
                this.page = val;
                // this.getParkRoleList(parkRoleList);
            },

        },
        mounted() {
            this.getParkRoleList(parkRoleList);
        }
    }
</script>
<style lang="scss" scoped>
</style>