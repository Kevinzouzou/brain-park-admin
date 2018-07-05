<template>
    <section>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" justify="center">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="addUserFormVisible = true">新增角色</el-button>
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
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        parkRoleList
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
                restaurants: [],
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