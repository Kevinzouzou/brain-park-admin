<template>
    <section>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <span>服务名称：</span>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="ITserviceListFilter.serviceName" placeholder="请选择">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="企业建站" value="企业建站"></el-option>
                        <el-option label="IT托管" value="IT托管"></el-option>
                        <el-option label="智能化集成" value="智能化集成"></el-option>
                        <el-option label="云服务" value="云服务"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>状态：</span>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="ITserviceListFilter.stage" placeholder="请选择">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="处理中" value="处理中"></el-option>
                        <el-option label="已完成" value="已完成"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="ITserviceListFilter.selection" class="userinfo-search" placeholder="搜索申请人/联系电话/所属企业" prefix-icon="el-icon-search"
                        clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getITServiceApplication()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <!--列表-->
            <el-table :data="ITserviceList.slice((ITserviceListPage-1)*ITserviceListPagesize,ITserviceListPage*ITserviceListPagesize)"
                highlight-current-row v-loading="ListLoading" style="width: 100%;">
                <el-table-column prop="id" label="ID">
                </el-table-column>
                <el-table-column prop="addInfo.serviceName" label="服务名称">
                </el-table-column>
                <el-table-column prop="addInfo.contact" label="申请人">
                </el-table-column>
                <el-table-column prop="addInfo.phone" label="联系电话">
                </el-table-column>
                <el-table-column prop="addInfo.companyName" label="所属企业">
                </el-table-column>
                <el-table-column prop="createTime" label="申请时间">
                </el-table-column>
                <el-table-column prop="stage" label="状态">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="ITserviceDetailsCheck(scope.$index, scope.row)">查看</el-button>
                        <el-button v-if="scope.row.stage === '处理中'" type="success" size="small" @click="ITserviceDetailsComplete(scope.$index, scope.row)">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="ITserviceListPagesizeChange" @current-change="ITserviceListPageCurrentChange" :page-sizes="[8,10,20,50]"
                    :page-size="ITserviceListPagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="ITserviceListPage"
                    :total="ITserviceList.length" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog title="查看IT服务" :visible.sync="ITserviceDetailsVisible">
            <el-form :model="ITserviceDetails" label-width="150px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="状态：">
                            <span>{{ITserviceDetails.stage}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="服务类型：">
                            <span>{{ITserviceDetails.type}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="服务名称：">
                            <span>{{ITserviceDetails.addInfo.serviceName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="申请人：">
                            <span>{{ITserviceDetails.addInfo.contact}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="联系电话：">
                            <span>{{ITserviceDetails.addInfo.phone}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="所属企业：">
                            <span>{{ITserviceDetails.addInfo.companyName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="企业楼栋：">
                            <span>{{ITserviceDetails.addInfo.location}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="申请时间：">
                            <span>{{ITserviceDetails.createTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注信息：">
                            <span>{{ITserviceDetails.addInfo.remark}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ITserviceDetailsVisible = false">关闭</el-button>
                <el-button type="success" v-if="ITserviceDetails.stage === '处理中'" @click="ITserviceDetailsComplete(null, ITserviceDetails)">完成</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        ITServiceApplication,
        updatePropertyApplication
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                ITserviceListPage: 1,
                ITserviceListPagesize: 8,
                ITserviceList: [],
                ITserviceListFilter: {
                    serviceName: '全部',
                    stage: '全部',
                    selection: ''
                },
                ListLoading: false,
                ITserviceDetailsVisible: false,
                ITserviceDetails: {
                    addInfo: {
                        itemName: "",
                        phone: "",
                        companyName: "",
                        contact: "",
                        location: "",
                        remark: "",
                        serviceName: ""
                    },
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    parkId: "",
                    settlement: "",
                    stage: "",
                    time: "",
                    type: "",
                    userId: "",
                }
            }
        },
        methods: {
            getITServiceApplication() {
                let url = ITServiceApplication;
                url = this.ITserviceListFilter.serviceName !== '全部' ? url +
                    `&serviceName=${this.ITserviceListFilter.serviceName}` :
                    url;
                url = this.ITserviceListFilter.selection !== '' ? url +
                    `&selection=${this.ITserviceListFilter.selection}` :
                    url;
                url = this.ITserviceListFilter.stage !== '全部' ? url + `&stage=${this.ITserviceListFilter.stage}` :
                    url;
                this.ListLoading = true;
                this.$get(url).then(res => {
                    this.ITserviceList = res;
                    this.ListLoading = false;
                })
            },
            ITserviceListPagesizeChange() {
                this.ITserviceListPagesize = val;
            },
            ITserviceListPageCurrentChange() {
                this.ITserviceListPage = val;
                // this.getITServiceApplication();
            },
            ITserviceDetailsCheck(index, row) {
                this.ITserviceDetailsVisible = true;
                this.ITserviceDetails = publicFunction.deepCopy(this.ITserviceDetails, row);
            },
            ITserviceDetailsComplete(index, row) {
                this.$confirm('是否确认完成该申请记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = row;
                    data.stage = "已完成"
                    this.$put(updatePropertyApplication, data).then(res => {
                        this.ITserviceDetailsVisible = false;
                        this.getITServiceApplication();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                }).catch(() => {});
            },
        },
        mounted() {
            this.getITServiceApplication();
        },
    }
</script>
<style lang="scss" scoped>
</style>