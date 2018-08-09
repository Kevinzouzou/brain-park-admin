<template>
    <section>
        <el-row>
            <el-form :inline="true">
                <el-form-item>
                    <span>服务名称：</span>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="talentServiceListFilter.serviceName" placeholder="请选择">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="人才招聘" value="人才招聘"></el-option>
                        <el-option label="人才测评" value="人才测评"></el-option>
                        <el-option label="人才培训" value="人才培训"></el-option>
                        <el-option label="人事代理" value="人事代理"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span>状态：</span>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="talentServiceListFilter.stage" placeholder="请选择">
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="处理中" value="处理中"></el-option>
                        <el-option label="已完成" value="已完成"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="talentServiceListFilter.selection" class="userinfo-search" placeholder="搜索申请人/联系电话/所属企业" prefix-icon="el-icon-search"
                        clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTalentServiceApplication()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <!--列表-->
            <el-table :data="TalentServiceList.slice((TalentServiceListPage-1)*TalentServiceListPagesize,TalentServiceListPage*TalentServiceListPagesize)"
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
                        <el-button type="primary" size="small" @click="TalentServiceDetailsCheck(scope.$index, scope.row)">查看</el-button>
                        <el-button v-if="scope.row.stage === '处理中'" type="success" size="small" @click="TalentServiceDetailsComplete(scope.$index, scope.row)">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!--工具条-->
        <el-row :gutter="24">
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="TalentServiceListPagesizeChange" @current-change="TalentServiceListPageCurrentChange"
                    :page-sizes="[8,10,20,50]" :page-size="TalentServiceListPagesize" layout="total,sizes, prev, pager, next, jumper"
                    :current-page="TalentServiceListPage" :total="TalentServiceList.length" style="float:right;">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog title="查看人才服务" :visible.sync="TalentServiceDetailsVisible">
            <el-form :model="TalentServiceDetails" label-width="150px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="状态：">
                            <span>{{TalentServiceDetails.stage}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="服务类型：">
                            <span>{{TalentServiceDetails.type}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="服务名称：">
                            <span>{{TalentServiceDetails.addInfo.serviceName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="申请人：">
                            <span>{{TalentServiceDetails.addInfo.contact}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="联系电话：">
                            <span>{{TalentServiceDetails.addInfo.phone}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="所属企业：">
                            <span>{{TalentServiceDetails.addInfo.companyName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="企业楼栋：">
                            <span>{{TalentServiceDetails.addInfo.location}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="申请时间：">
                            <span>{{TalentServiceDetails.createTime}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注信息：">
                            <span>{{TalentServiceDetails.addInfo.remark}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="TalentServiceDetailsVisible = false">关闭</el-button>
                <el-button type="success" v-if="TalentServiceDetails.stage === '处理中'" @click="TalentServiceDetailsComplete(null, TalentServiceDetails)">完成</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        TalentServiceApplication,
        updatePropertyApplication
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                TalentServiceListPage: 1,
                TalentServiceListPagesize: 8,
                TalentServiceList: [],
                talentServiceListFilter: {
                    serviceName: '全部',
                    stage: '全部',
                    selection: ''
                },
                ListLoading: false,
                TalentServiceDetailsVisible: false,
                TalentServiceDetails: {
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
            getTalentServiceApplication() {
                let url = TalentServiceApplication;
                url = this.talentServiceListFilter.serviceName !== '全部' ? url +
                    `&serviceName=${this.talentServiceListFilter.serviceName}` :
                    url;
                url = this.talentServiceListFilter.selection !== '' ? url +
                    `&selection=${this.talentServiceListFilter.selection}` :
                    url;
                url = this.talentServiceListFilter.stage !== '全部' ? url +
                    `&stage=${this.talentServiceListFilter.stage}` :
                    url;
                this.ListLoading = true;
                this.$get(url).then(res => {
                    this.TalentServiceList = res;
                    this.ListLoading = false;
                })
            },
            TalentServiceListPagesizeChange() {
                this.TalentServiceListPagesize = val;
            },
            TalentServiceListPageCurrentChange() {
                this.TalentServiceListPage = val;
                this.getTalentServiceApplication();
            },
            TalentServiceDetailsCheck(index, row) {
                this.TalentServiceDetailsVisible = true;
                this.TalentServiceDetails = publicFunction.deepCopy(this.TalentServiceDetails, row);
            },
            TalentServiceDetailsComplete(index, row) {
                this.$confirm('是否确认完成该申请记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = row;
                    data.stage = "已完成"
                    this.$put(updatePropertyApplication, data).then(res => {
                        this.TalentServiceDetailsVisible = false;
                        this.getTalentServiceApplication();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                }).catch(() => {});
            },
        },
        mounted() {
            this.getTalentServiceApplication();
        },
    }
</script>
<style lang="scss" scoped>
</style>