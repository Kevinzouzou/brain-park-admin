<template>
    <section>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" justify="center">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="addParkOperatorFormVisible = true">新增操作员</el-button>
                    </el-form-item>
                    <el-form-item>
                        <span>搜索条件：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="parkOperatorListFilters.phone" class="userinfo-search" placeholder="用户名搜索" prefix-icon="el-icon-search"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getQueryParkOperatorListList">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--工具条-->
        <!--列表-->
        <el-table :data="parkOperatorList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="parkOperatorListLoading"
            style="width: 100%;">
            <el-table-column prop="id" label="账号ID">
            </el-table-column>
            <el-table-column prop="phone" label="用户名">
            </el-table-column>
            <el-table-column prop="addInfo.roleList.name" label="账号角色">
                <template slot-scope="scope">
                    <span :key="item.id" v-for="item in scope.row.roleList">{{item.name}}；</span>
                </template>
            </el-table-column>
            <el-table-column prop="ownerInfo.addInfo.name" label="账号所有者">
            </el-table-column>
            <el-table-column prop="ownerInfo.addInfo.position" label="岗位">
            </el-table-column>
            <el-table-column prop="ownerInfo.departmentInfo.name" label="部门">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.addInfo.state === 1">是</span>
                    <span v-else-if="scope.row.addInfo.state === 2">否</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="addInfo.lastLoginTime" label="最近登录时间">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="parkStaffEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteParkOperator(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--列表-->
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                    layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="parkOperatorListTotal" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <!--工具条-->
        <!-- 添加操作员弹框 -->
        <el-dialog title="添加操作员" :visible.sync="addParkOperatorFormVisible">
            <el-form :model="addParkOperatorForm" :rules="addParkOperatorFormRules" :label-position="'right'" label-width="150px" ref="addParkOperatorForm">
                <el-row :gutter="24">
                    <el-col :span="11">
                        <el-form-item label="用户名：" required prop="phone">
                            <el-input placeholder="请填写用户名" v-model="addParkOperatorForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="登录密码：" required>
                            <el-input placeholder="重置密码将随机生成8位数密码" v-model="addParkOperatorForm.password" disabled=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="状态：" required>
                            <el-select v-model="addParkOperatorForm.addInfo.state">
                                <el-option label="正常" value="1"></el-option>
                                <el-option label="停用" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button @click="createPassword()">重置密码</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="20">
                        <el-form-item label="已分配角色：" label-width="150px">
                            <span>{{assignedRoleText}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <el-table max-height="250" ref="multipleTable" :data="parkRoleList" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="name" label="角色名称" width="150">
                            </el-table-column>
                            <el-table-column prop="addInfo.permissionList" label="权限">
                            </el-table-column>
                            <el-table-column prop="intro" label="角色描述">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row :gutter="24" style="margin-top: 20px;">
                    <el-col :span="20">
                        <el-form-item label="账号所有者：">
                            <el-button @click="innerParkUserVisible = true">添加/修改</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="姓名：">
                            <span>{{addParkOperatorForm.ownerInfo.name}}</span>
                        </el-form-item>
                        <el-form-item label="岗位：">
                            <span>{{addParkOperatorForm.ownerInfo.position}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="工号：">
                            <span>{{addParkOperatorForm.ownerInfo.empNo }}</span>
                        </el-form-item>
                        <el-form-item label="部门：">
                            <span>{{addParkOperatorForm.ownerInfo.departmentName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearSelection()">取 消</el-button>
                <el-button type="primary" @click="addParkOperator('addParkOperatorForm')">添加</el-button>
            </div>
            <el-dialog width="40%" title="选择员工" :visible.sync="innerParkUserVisible" append-to-body>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-input v-model="parkUserListFilters.nameOrPhone" class="userinfo-search" placeholder="搜索员工姓名" prefix-icon="el-icon-search"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getQueryParkUserList">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row :gutter="24" type="flex" justify="center">
                    <el-col :span="20">
                        <el-table max-height="400" :data="parkUserList" tooltip-effect="dark" border style="width: 100%" v-loading="parkUserListLoading">
                            <el-table-column prop="addInfo.empNo" label="工号">
                            </el-table-column>
                            <el-table-column prop="addInfo.name" label="姓名">
                            </el-table-column>
                            <el-table-column prop="addInfo.gender" label="性别">
                            </el-table-column>
                            <el-table-column prop="departmentInfo.name" label="部门">
                            </el-table-column>
                            <el-table-column prop="addInfo.position" label="职位">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="selectParkUser(scope.$index, scope.row)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-dialog>
        </el-dialog>
    </section>
</template>
<script>
    import axios from "axios";
    import {
        parkUserList,
        parkOperatorList,
        addParkUser,
        deleteStaff,
        parkRoleList
    } from "../../api/api";
    export default {
        data() {
            return {
                page: 1,
                pagesize: 7,
                parkOperatorListLoading: false,
                parkOperatorList: [],
                parkOperatorListTotal: 0,
                parkRoleList: [],
                parkUserList: [],
                multipleSelection: [],
                assignedRoleText: "",
                restaurants: [],
                parkOperatorListFilters: {
                    phone: ""
                },
                parkUserListLoading: false,
                parkUserListFilters: {
                    nameOrPhone: ""
                },
                addParkOperatorFormVisible: false,
                innerParkUserVisible: false,
                addParkOperatorForm: {
                    addInfo: {
                        state: "1",
                        roleList: [],
                        ownerId: ""
                    },
                    phone: "",
                    password: "",
                    type: 3,
                    ownerInfo: {
                        name: "",
                        empNo: "",
                        position: "",
                        departmentName: ""
                    }
                },
                addParkOperatorFormRules: {
                    phone: [{
                        required: true,
                        message: "请输入5到16位英文字母或数字作为用户名",
                        trigger: "blur",
                        pattern: /^[a-zA-Z0-9_-]{5,16}$/
                    }]
                },
                formLabelWidth: "120px"
            };
        },
        methods: {
            // 查询操作员角色列表
            getParkRoleList(url) {
                this.$get(url).then(res => {
                    this.parkRoleList = res;
                    // this.parkRoleListTotal = this.parkRoleList.length > 0 ? this.parkRoleList.length : 0;
                });
            },
            // 获取操作员列表
            getParkOperatorList(url) {
                this.parkOperatorListLoading = true;
                this.$get(url).then(res => {
                    this.parkOperatorList = res;
                    this.parkOperatorListTotal =
                        this.parkOperatorListTotal.length > 0 ?
                        this.parkOperatorListTotal.length :
                        1;
                    this.parkOperatorListLoading = false;
                });
            },
            //获取员工列表
            getParkUserList(url) {
                this.parkUserListLoading = true;
                this.$get(url).then(res => {
                    this.parkUserList = res;
                    this.parkUserListLoading = false;
                });
            },
            // 选择该员工
            selectParkUser: function (index, row) {
                console.log(row);
                this.addParkOperatorForm.addInfo.ownerId = row.id;
                this.addParkOperatorForm.ownerInfo.name = row.addInfo.name;
                this.addParkOperatorForm.ownerInfo.empNo = row.addInfo.empNo;
                this.addParkOperatorForm.ownerInfo.position = row.addInfo.position;
                this.addParkOperatorForm.ownerInfo.departmentName =
                    row.departmentInfo.name;
                this.innerParkUserVisible = false;
            },
            // 添加操作员
            addParkOperator(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = this.addParkOperatorForm;
                        if (data.addInfo.roleList.length === 0) {
                            this.$message.error('请给操作员分配角色');
                        } else if (data.addInfo.ownerId === '') {
                            this.$message.error('请选择账号所有者');
                        } else if (data.password === '') {
                            this.$message.error('请重置密码');
                        } else {
                            delete data.ownerInfo;
                            data.parkId = localStorage.getItem("parkId");
                            data.addInfo.state = data.addInfo.state === "1" ? 1 : 2;
                            console.log(data);
                            this.$post(addParkUser, data)
                                .then(res => {
                                    if (res.operationResult === "failure") {
                                        let title = res.failureMsg;
                                        let name = res.responseList.name;
                                        let phone = res.responseList.phone;
                                        let post = res.responseList.post;
                                        let id = res.responseList.id;
                                        this.$alert(
                                            `<span>姓名：${name}</span></br><span>电话：${phone}</span></br><span>职位：${post}</span></br><span>ID：${id}</span></br>`,
                                            title, {
                                                dangerouslyUseHTMLString: true
                                            }
                                        );
                                    } else {
                                        this.getParkOperatorList(parkOperatorList);
                                        this.addParkOperatorForm = {
                                            addInfo: {
                                                state: "1",
                                                roleList: [],
                                                ownerId: ""
                                            },
                                            phone: "",
                                            password: "",
                                            type: 3,
                                            ownerInfo: {
                                                name: "",
                                                empNo: "",
                                                position: "",
                                                departmentName: ""
                                            }
                                        };
                                        this.resetForm("addParkOperatorForm");
                                        this.$message({
                                            message: "添加成功",
                                            type: "success"
                                        });
                                        this.clearSelection();
                                        this.addParkOperatorFormVisible = false;
                                    }
                                });
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            // 编辑操作员
            // 删除操作员
            deleteParkOperator: function (index, row) {
                this.$confirm(
                        "删除操作员将同时取消该操作员的平台登录权限,是否删除？",
                        "注意！", {
                            type: "warning"
                        }
                    )
                    .then(() => {
                        this.parkOperatorListLoading = true;
                        //NProgress.start();
                        let para = {
                            id: row.id
                        };
                        let self = this;
                        this.$del(deleteStaff + para.id).then(function (response) {
                            self.parkOperatorListLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            self.getParkOperatorList(parkOperatorList);
                        });
                    })
                    .catch(() => {});
            },
            // 查询公司或用户信息模糊查询
            getQueryParkOperatorListList() {
                let url = parkOperatorList;
                let phone = this.parkOperatorListFilters.phone;
                url = phone === "" ? url + "" : url + "&phone=" + phone;
                this.getParkOperatorList(url);
            },
            // 查询员工
            getQueryParkUserList() {
                let url = parkUserList;
                let nameOrPhone = this.parkUserListFilters.nameOrPhone;
                url =
                    nameOrPhone === "" ?
                    url + "" :
                    url + "&nameOrPhone=" + nameOrPhone;
                this.getParkUserList(url);
            },
            pageSizeChange(val) {
                this.pagesize = val;
            },
            pageCurrentChange(val) {
                this.page = val;
                this.getParkOperatorList(parkOperatorList);
            },
            // 获取企业名单
            getSettledEnterpriseList() {
                this.$get(settledEnterpriseList);
            },
            createFilter(queryString) {
                return restaurant => {
                    return (
                        restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                    );
                };
            },
            handleSelect(item) {
                console.log(item);
            },
            handleIconClick(ev) {
                console.log(ev);
            },
            createPassword() {
                this.addParkOperatorForm.password = Math.random()
                    .toString()
                    .slice(-8);
            },
            // 分配操作员角色
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.assignedRoleText = "";
                this.addParkOperatorForm.addInfo.roleList = [];
                val.forEach(i => {
                    this.assignedRoleText += i.name + "、";
                    this.addParkOperatorForm.addInfo.roleList.push(i.id);
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            clearSelection() {
                this.addParkOperatorFormVisible = false;
                this.$refs.multipleTable.clearSelection();
            }
        },
        mounted() {
            this.getParkUserList(parkUserList);
            this.getParkOperatorList(parkOperatorList);
            this.getParkRoleList(parkRoleList);
            //this.getSettledEnterpriseList();
        }
    };
</script>
<style lang="scss" scoped>
</style>