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
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script>
    import axios from 'axios';
    import {
        parkOperatorList,
        deleteStaff
    } from '../../api/api';
    export default {
        data() {
            return {
                page: 1,
                pagesize: 7,
                parkOperatorListLoading: false,
                parkOperatorList: [],
                parkOperatorListTotal: 0,
                restaurants: [],
                parkOperatorListFilters: {
                    phone: '',
                },
                addParkOperatorFormVisible: false,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px'
            };
        },
        methods: {
            // 获取操作员列表
            getParkOperatorList(url) {
                this.parkOperatorListLoading = true;
                this.$get(url)
                    .then((res) => {
                        this.parkOperatorList = res;
                        this.parkOperatorListTotal = this.parkOperatorListTotal.length > 0 ? this.parkOperatorListTotal
                            .length :
                            1;
                        this.parkOperatorListLoading = false;
                    })
            },
            // 编辑操作员
            // 删除操作员
            deleteParkOperator: function (index, row) {
                this.$confirm('删除操作员将同时取消该操作员的平台登录权限,是否删除？', '注意！', {
                    type: 'warning'
                }).then(() => {
                    this.parkOperatorListLoading = true;
                    //NProgress.start();
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteStaff + para.id)
                        .then(function (response) {
                            self.parkOperatorListLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getParkOperatorList(parkOperatorList);
                        });
                }).catch(() => {

                });
            },
            // 查询公司或用户信息模糊查询
            getQueryParkOperatorListList() {
                let url = parkOperatorList;
                let phone = this.parkOperatorListFilters.phone;
                url = phone === '' ? url + '' : url + '&phone=' + phone;
                this.getParkOperatorList(url);
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
            }
        },
        mounted() {
            this.getParkOperatorList(parkOperatorList);
            //this.getSettledEnterpriseList();
        }
    }
</script>
<style lang="scss" scoped>
</style>