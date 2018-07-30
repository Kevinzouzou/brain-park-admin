<template>
    <section>
        <div class="mainPage" v-show="!historicalRecord">
            <el-row>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="policyVisible = true">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <span>企业阶段：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="policyListFilter.subType" placeholder="请选择">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="孵化器" value="孵化器"></el-option>
                            <el-option label="初创型" value="初创型"></el-option>
                            <el-option label="成长期" value="成长期"></el-option>
                            <el-option label="人才类" value="人才类"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="policyListFilter.selection" class="userinfo-search" placeholder=" 搜索项目名称/扶持对象" prefix-icon="el-icon-search"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getPolicyList()">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="historicalRecord = true">查看申请记录</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <!--列表-->
                <el-table :data="policyList.slice((policyListPage-1)*policyListPagesize,policyListPage*policyListPagesize)" highlight-current-row
                    v-loading="ListLoading" style="width: 100%;">
                    <el-table-column prop="id" label="ID">
                    </el-table-column>
                    <el-table-column prop="addInfo.subtype" label="企业阶段">
                    </el-table-column>
                    <el-table-column prop="title" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="addInfo.target" label="扶持对象">
                    </el-table-column>
                    <el-table-column prop="addInfo.planningTime" label="申报时间预估">
                    </el-table-column>
                    <el-table-column label="操作" width="220">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="policyDetailsCheck(scope.$index, scope.row)">查看</el-button>
                            <el-button type="success" size="small" @click="policyDetailsEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="policyDetailsDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <!--工具条-->
            <el-row :gutter="24">
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="policyListPagesizeChange" @current-change="policyListPageCurrentChange" :page-sizes="[7,8,10,20]"
                        :page-size="policyListPagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="policyListPage"
                        :total="policyList.length" style="float:right;">
                    </el-pagination>
                </el-col>
            </el-row>

            <el-dialog title="新增政务服务" :visible.sync="policyVisible">
                <el-form :model="policyAddForm" label-width="150px" :rules="policyAddFormRules" ref="policyAddForm">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业阶段：" required prop="addInfo.subtype">
                                <el-select v-model="policyAddForm.addInfo.subtype" placeholder="请选择资源类型">
                                    <el-option label="孵化器" value="孵化器"></el-option>
                                    <el-option label="初创期" value="初创期"></el-option>
                                    <el-option label="成长期" value="成长期"></el-option>
                                    <el-option label="人才类" value="人才类"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="项目名称：" required prop="title">
                                <el-input v-model="policyAddForm.title " placeholder="项目名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="扶持对象：" required prop="addInfo.target">
                                <el-input v-model="policyAddForm.addInfo.target" placeholder="扶持对象"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="申报时间预估：" required prop="addInfo.planningTime">
                                <el-input v-model="policyAddForm.addInfo.planningTime" placeholder="大概月数或天数"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="资助标准：" required prop="addInfo.standard">
                                <el-input type="textarea" v-model="policyAddForm.addInfo.standard" placeholder="资助标准"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定条件：" required prop="addInfo.condition">
                                <el-input type="textarea" v-model="policyAddForm.addInfo.condition" placeholder="认定条件"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定流程：" required prop="addInfo.procedure">
                                <el-input type="textarea" v-model="policyAddForm.addInfo.procedure" placeholder="认定流程"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="policyVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addPolicy">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="查看政务服务" :visible.sync="policyDetailsVisible">
                <el-form :model="policyDetails" label-width="150px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业阶段：">
                                <span>{{policyDetails.addInfo.subtype}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="项目名称：">
                                <span>{{policyDetails.title}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="扶持对象：">
                                <span>{{policyDetails.addInfo.target}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="申报时间预估：">
                                <span>{{policyDetails.addInfo.planningTime}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="资助标准：">
                                <span>{{policyDetails.addInfo.standard}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定条件：">
                                <span>{{policyDetails.addInfo.condition}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定流程：">
                                <span>{{policyDetails.addInfo.procedure}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="policyDetailsVisible = false">关闭</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑政务服务" :visible.sync="policyEditVisible">
                <el-form :model="policyDetails" label-width="150px" :rules="policyAddFormRules" ref="policyDetails">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业阶段：" required prop="addInfo.subtype">
                                <el-select v-model="policyDetails.addInfo.subtype" placeholder="请选择资源类型">
                                    <el-option label="孵化器" value="孵化器"></el-option>
                                    <el-option label="初创期" value="初创期"></el-option>
                                    <el-option label="成长期" value="成长期"></el-option>
                                    <el-option label="人才类" value="人才类"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="项目名称：" required prop="title">
                                <el-input v-model="policyDetails.title " placeholder="项目名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="扶持对象：" required prop="addInfo.target">
                                <el-input v-model="policyDetails.addInfo.target" placeholder="扶持对象"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="申报时间预估：" required prop="addInfo.planningTime">
                                <el-input v-model="policyDetails.addInfo.planningTime" placeholder="大概月数或天数"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="资助标准：" required prop="addInfo.standard">
                                <el-input type="textarea" v-model="policyDetails.addInfo.standard" placeholder="资助标准"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定条件：" required prop="addInfo.condition">
                                <el-input type="textarea" v-model="policyDetails.addInfo.condition" placeholder="认定条件"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认定流程：" required prop="addInfo.procedure">
                                <el-input type="textarea" v-model="policyDetails.addInfo.procedure" placeholder="认定流程"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="policyEditVisible = false">关闭</el-button>
                    <el-button type="primary" @click="updatePolicyDetails">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="secondPage" v-show="historicalRecord">
            <el-row>
                <el-form :inline="true">
                    <el-form-item>
                        <span>服务名称：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="PolicyServiceApplicationFiter.serviceName" placeholder="请选择">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="工商注册" value="工商注册"></el-option>
                            <el-option label="消防代办" value="消防代办"></el-option>
                            <el-option label="税务代办" value="税务代办"></el-option>
                            <el-option label="高企申报" value="高企申报"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span>状态：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="PolicyServiceApplicationFiter.stage" placeholder="请选择">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="处理中" value="处理中"></el-option>
                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="PolicyServiceApplicationFiter.selection" class="userinfo-search" placeholder=" 搜索申请人/联系电话/所属企业" prefix-icon="el-icon-search"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getPolicyServiceApplication()">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click="historicalRecord = false">返回政策解读</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <!--列表-->
                <el-table :data="ApplicationList.slice((ApplicationListPage-1)*ApplicationListPagesize,ApplicationListPage*ApplicationListPagesize)"
                    highlight-current-row v-loading="ListLoading" style="width: 100%;">
                    <el-table-column prop="id" label="ID">
                    </el-table-column>
                    <el-table-column prop="type" label="服务名称">
                    </el-table-column>
                    <el-table-column prop="addInfo.itemName" label="子服务">
                    </el-table-column>
                    <el-table-column prop="addInfo.contact" label="申请人">
                    </el-table-column>
                    <el-table-column prop="addInfo.companyName" label="所属企业">
                    </el-table-column>
                    <el-table-column prop="time" label="申请时间">
                    </el-table-column>
                    <el-table-column prop="stage" label="状态">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="ApplicationDetailsCheck(scope.$index, scope.row)">查看</el-button>
                            <el-button v-if="scope.row.stage === '处理中'" type="success" size="small" @click="ApplicationDetailsComplete(scope.$index, scope.row)">完成</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <!--工具条-->
            <el-row :gutter="24">
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="ApplicationListPagesizeChange" @current-change="ApplicationListPageCurrentChange"
                        :page-sizes="[7,8,10,20]" :page-size="ApplicationListPagesize" layout="total,sizes, prev, pager, next, jumper"
                        :current-page="ApplicationListPage" :total="ApplicationList.length" style="float:right;">
                    </el-pagination>
                </el-col>
            </el-row>

            <el-dialog title="查看申请记录" :visible.sync="ApplicationDetailsVisible">
                <el-form :model="policyDetails" label-width="150px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="状态：">
                                <span>{{ApplicationDetails.stage}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="服务类型：">
                                <span>{{ApplicationDetails.type}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="服务名称：">
                                <span>{{ApplicationDetails.addInfo.serviceName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="子服务：">
                                <span>{{ApplicationDetails.addInfo.itemName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="申请人：">
                                <span>{{ApplicationDetails.addInfo.contact}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="联系电话：">
                                <span>{{ApplicationDetails.addInfo.phone}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="所属企业：">
                                <span>{{ApplicationDetails.addInfo.companyName}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业楼栋：">
                                <span>{{ApplicationDetails.addInfo.location}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="申请时间：">
                                <span>{{ApplicationDetails.time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="备注信息：">
                                <span>{{ApplicationDetails.addInfo.remark}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button v-if="ApplicationDetails.stage === '处理中'" type="success" @click="ApplicationDetailsComplete(null,ApplicationDetails)">完成</el-button>
                    <el-button @click="ApplicationDetailsVisible = false">关闭</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>
<script>
    import axios from 'axios';
    import {
        policyList,
        addDisplay,
        deleteDisplay,
        PolicyServiceApplication,
        updatePropertyApplication
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                policyListPage: 1,
                ApplicationListPage: 1,
                policyListPagesize: 7,
                ApplicationListPagesize: 7,
                ListLoading: false,
                policyVisible: false,
                policyDetailsVisible: false,
                policyEditVisible: false,
                historicalRecord: false,
                ApplicationDetailsVisible: false,
                policyListFilter: {
                    subType: '全部',
                    selection: '',
                },
                PolicyServiceApplicationFiter: {
                    serviceName: '全部',
                    stage: '全部',
                    selection: ''
                },
                policyList: [],
                ApplicationList: [],
                policyAddForm: {
                    type: '政策解读',
                    parkId: '',
                    thumbUrl: 'null',
                    title: '',
                    addInfo: {
                        subtype: "",
                        target: "",
                        planningTime: "",
                        standard: "",
                        condition: "",
                        procedure: ""
                    }
                },
                policyDetails: {
                    id: '',
                    title: '',
                    addInfo: {
                        subtype: "",
                        target: "",
                        planningTime: "",
                        standard: "",
                        condition: "",
                        procedure: ""
                    }
                },
                policyAddFormRules: {
                    title: [{
                        required: true,
                        message: '请输入名称',
                        trigger: ['blur'],
                    }],
                    addInfo: {
                        subtype: [{
                            required: true,
                            message: '请选择企业阶段',
                            trigger: 'change'
                        }],
                        target: [{
                            required: true,
                            message: '请输入扶持对象',
                            trigger: ['blur', 'change']
                        }],
                        planningTime: [{
                            required: true,
                            message: '请输入时间预估(示例：3-4月）',
                            trigger: ['blur', 'change']
                        }],
                        standard: [{
                            required: true,
                            message: '请输入资助标准',
                            trigger: ['blur', 'change']
                        }],
                        condition: [{
                            required: true,
                            message: '请输入认定条件',
                            trigger: ['blur', 'change']
                        }],
                        procedure: [{
                            required: true,
                            message: '请输入认定流程',
                            trigger: ['blur', 'change']
                        }],
                    }
                },
                ApplicationDetails: {
                    addInfo: {
                        companyName: "",
                        contact: "",
                        itemName: "",
                        location: "",
                        phone: "",
                        remark: "",
                        serviceName: "",
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
            // 获取政策解读
            getPolicyList() {
                let url = policyList;
                url = this.policyListFilter.subType !== '全部' ? url + `&subType=${this.policyListFilter.subType}` :
                    url;
                url = this.policyListFilter.selection !== '' ? url + `&selection=${this.policyListFilter.selection}` :
                    url;
                this.ListLoading = true;
                this.$get(url).then(res => {
                    this.policyList = res;
                    this.ListLoading = false;
                })
            },
            // 获取申请记录
            getPolicyServiceApplication() {
                let url = PolicyServiceApplication;
                url = this.PolicyServiceApplicationFiter.serviceName !== '全部' ? url +
                    `&serviceName=${this.PolicyServiceApplicationFiter.serviceName}` :
                    url;
                url = this.PolicyServiceApplicationFiter.stage !== '全部' ? url +
                    `&stage=${this.PolicyServiceApplicationFiter.stage}` :
                    url;
                url = this.PolicyServiceApplicationFiter.selection !== '' ? url +
                    `&selection=${this.PolicyServiceApplicationFiter.selection}` :
                    url;
                this.ListLoading = true;
                this.$get(url).then(res => {
                    this.ApplicationList = res;
                    this.ListLoading = false;
                })
            },
            ApplicationListPagesizeChange() {
                this.ApplicationListPagesize = val;
            },
            ApplicationListPageCurrentChange() {
                this.ApplicationListPage = val;
                this.getPolicyList();
            },
            policyListPagesizeChange() {
                this.policyListPagesize = val;
            },
            policyListPageCurrentChange() {
                this.policyListPage = val;
                this.getPolicyList();
            },
            // 添加政务服务
            addPolicy() {
                this.$refs.policyAddForm.validate(valid => {
                    if (valid) {
                        let data = this.policyAddForm;
                        data.parkId = localStorage.getItem('parkId');
                        this.$post(addDisplay, data).then(
                            res => {
                                if (res.operationResult === 'failure') {
                                    this.$message({
                                        message: 'failureMsg',
                                        type: 'error'
                                    });
                                } else {
                                    this.$refs.policyAddForm.resetFields();
                                    this.policyVisible = false;
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getPolicyList();
                                }
                            }
                        );
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 查看政务服务
            policyDetailsCheck(index, row) {
                this.policyDetailsVisible = true;
                this.policyDetails = publicFunction.deepCopy(this.policyDetails, row);
            },
            // 编辑政务服务
            policyDetailsEdit(index, row) {
                this.policyEditVisible = true;
                this.policyDetails = publicFunction.deepCopy(this.policyDetails, row);
            },
            // 更新政务服务
            updatePolicyDetails() {
                this.$refs.policyDetails.validate(valid => {
                    if (valid) {
                        let data = this.policyDetails;
                        data.parkId = localStorage.getItem('parkId');
                        this.$post(addDisplay, data).then(
                            res => {
                                if (res.operationResult === 'failure') {
                                    this.$message({
                                        message: 'failureMsg',
                                        type: 'error'
                                    });
                                } else {
                                    this.$refs.policyDetails.resetFields();
                                    this.policyEditVisible = false;
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getPolicyList();
                                }
                            }
                        );
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 删除政务服务
            policyDetailsDel(index, row) {
                this.$confirm('是否确认删除该项目?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$del(deleteDisplay + row.id).then(res => {
                        this.getPolicyList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 查看申请记录
            ApplicationDetailsCheck(index, row) {
                this.ApplicationDetailsVisible = true;
                this.ApplicationDetails = publicFunction.deepCopy(this.ApplicationDetails, row);
            },
            // 修改申请记录为完成
            ApplicationDetailsComplete(index, row) {
                this.$confirm('是否确认完成该申请记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = row;
                    data.stage = "已完成"
                    this.$put(updatePropertyApplication, data).then(res => {
                        this.ApplicationDetailsVisible = false;
                        this.getPolicyServiceApplication()
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                }).catch(() => {});
            }
        },
        mounted() {
            this.getPolicyList();
            this.getPolicyServiceApplication();
        },
    }
</script>
<style lang="scss" scoped>
    section {
        position: relative;
    }

    .historyContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: #fff;
        left: 0;
    }
</style>