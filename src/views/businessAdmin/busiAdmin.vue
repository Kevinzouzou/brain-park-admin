<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="adminFilters">
                <el-form-item>
                    <el-button type="primary" @click="newEnterprise">新增企业</el-button>
                </el-form-item>
                <el-form-item>
                    <span>搜索条件：</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="adminFilters.enterName" placeholder="企业名称搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryAdmin">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="exportData">导出到表格</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="importIn">导入名单</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="adminList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="adminLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="企业名称">
            </el-table-column>
            <el-table-column prop="zoneInfo[1].name" label="区域">
            </el-table-column>
            <el-table-column prop="zoneInfo[2].name" label="楼栋">
            </el-table-column>
            <el-table-column prop="zoneInfo[3].name" label="楼层">
            </el-table-column>
            <el-table-column prop="zoneInfo[4].name" label="房号">
            </el-table-column>
            <el-table-column prop="addInfo.area" label="租赁面积(平方米)">
            </el-table-column>
            <el-table-column prop="addInfo.industry" label="所属行业" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.businessModel" label="企业性质" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.enterTime" label="入驻时间" sortable>
            </el-table-column>
            <el-table-column label="撤离时间" sortable>
                <template slot-scope="scope">
                    {{scope.row.addInfo.outTime || '入驻中'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="editEnterprise(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteEnterprise(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background @size-change="sizeChange" @current-change="currentChange" :page-sizes="[8,10,20,50]" :page-size="pagesize"
                layout="total,sizes, prev, pager, next, jumper" :total="adminList.length" :current-page="page" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="adminAEVisible">
            <el-form :model="adminAEForm" :label-position="'right'" label-width="160px" ref="adminAEForm" :rules="rules">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="企业名称：" prop="name">
                            <el-input v-model="adminAEForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属行业：" prop="addInfo.industry">
                            <el-select v-model="adminAEForm.addInfo.industry" placeholder="请选择">
                                <el-option label="计算机/互联网/通讯/电子" value="计算机/互联网/通讯/电子"></el-option>
                                <el-option label="广告/媒体" value="广告/媒体"></el-option>
                                <el-option label="服务业" value="服务业"></el-option>
                                <el-option label="会计/金融/银行/保险" value="会计/金融/银行/保险"></el-option>
                                <el-option label="贸易/消费/制造/运营" value="贸易/消费/制造/运营"></el-option>
                                <el-option label="制药/医疗" value="制药/医疗"></el-option>
                                <el-option label="房地产/建筑" value="房地产/建筑"></el-option>
                                <el-option label="专业服务/教育/培训" value="专业服务/教育/培训"></el-option>
                                <el-option label="物流/运输" value="物流/运输"></el-option>
                                <el-option label="能源/原材料" value="能源/原材料"></el-option>
                                <el-option label="政府/非营利组织/其他" value="政府/非营利组织/其他"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="11">
                        <el-form-item label="租赁面积：" prop="addInfo.area">
                            <el-input v-model="adminAEForm.addInfo.area">
                                <template slot="append">米</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="企业性质：">
                            <el-select v-model="adminAEForm.addInfo.businessModel" placeholder="请选择">
                                <el-option label="私有" value="私有"></el-option>
                                <el-option label="国有" value="国有"></el-option>
                                <el-option label="外商独资" value="外商独资"></el-option>
                                <el-option label="外商合资" value="外商合资"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="企业图片：">
                            <el-upload class="avatar-uploader" :action='imageUploadUrl' :show-file-list="false" :data="imgData" :on-success="successUploadImg">
                                <img v-if="adminAEForm.addInfo.logo" :src="adminAEForm.addInfo.logo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="地址：">
                            <el-cascader :options="treeList" v-model="selOptions" :props="dataProps">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="入驻时间：" prop="addInfo.enterTime">
                            <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="adminAEForm.addInfo.enterTime" type="date"
                                placeholder="选择日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-show="isEdit">
                        <el-form-item label="撤离时间：">
                            <el-date-picker style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="adminAEForm.addInfo.outTime" type="date" placeholder="入驻中"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="企业描述：">
                            <el-input type="textarea" :rows="3" placeholder="请填写企业描述（200字内）" maxlength="200" v-model="adminAEForm.addInfo.intro">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--<el-form label-width="100px" v-if="isEdit">-->
            <!--<el-form-item label="创建时间">-->
            <!--{{modifyList.createTime}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="创建人">-->
            <!--{{modifyList.createName}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="最后修改时间">-->
            <!--{{modifyList.lastTime}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="修改人">-->
            <!--{{modifyList.modifyName}}-->
            <!--</el-form-item>-->
            <!--</el-form>-->
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="adminAEVisible = false">取消</el-button>
                <el-button type="primary" @click="addAdminSubmit">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import {
        settledEnterpriseList, // 获取企业名单
        addOrUpdatedEnterprise, // 添加或修改企业
        deleteEnterprise, // 删除企业
        treeUrl,
        addDisplay,
        deleteDisplay,
        uploadPic
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction.js';
    export default {
        data() {
            return {
                imageUploadUrl: '', //图片上传路径
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                newArea: [],
                dataProps: {
                    value: 'id',
                    children: 'children',
                    label: 'name'
                },
                selOptions: [],
                treeList: [],
                industry: '',
                zoneId: '',
                dialogAnVisible: false,
                page: 1,
                pagesize: 8,
                adminFilters: {
                    enterName: ''
                },
                addEditTitle: '新增',
                isEdit: false,
                isEditId: '',
                adminAEVisible: false,
                adminAEForm: {
                    name: '',
                    addInfo: {
                        industry: '',
                        enterTime: '',
                        outTime: '',
                        logo: '',
                        intro: '',
                        businessModel: '',
                        area: ''
                    },
                    zoneInfo: [{
                            name: ''
                        },
                        {
                            name: ''
                        },
                        {
                            name: ''
                        },
                        {
                            name: ''
                        }
                    ]
                },
                // 时间组件
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }]
                },
                adminList: [],
                adminLoading: false,
                rules: {
                    name: [{
                        required: true,
                        message: '请填写企业名称',
                        trigger: 'blur'
                    }],
                    addInfo: {
                        area: [{
                            required: true,
                            message: '请填写企业租赁面积',
                            trigger: 'blur'
                        }],
                        industry: [{
                            required: true,
                            message: '请选择所属行业',
                            trigger: 'change'
                        }],
                        enterTime: [{
                            type: 'string',
                            required: true,
                            message: '请选择入驻时间',
                            trigger: 'change'
                        }]
                    }
                },
                modifyList: {
                    createTime: '2018-06-02 17:30:30',
                    createName: '平台管理员123',
                    lastTime: '2018-06-20 19:10:15',
                    modifyName: '李小四'
                },
            };
        },
        methods: {
            successUploadImg(res, file, fileList) {
                this.adminAEForm.addInfo.logo = res.responseList.url;
            },
            exportData() {
                //导出到表格
            },
            importIn() {
                //导入名单
            },
            //显示新增界面
            newEnterprise() {
                this.selOptions = [];
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.adminAEVisible = true;
                this.adminAEForm = {
                    name: '',
                    addInfo: {
                        industry: '',
                        enterTime: '',
                        outTime: '',
                        logo: '',
                        intro: '',
                        businessModel: '',
                        area: ''
                    },
                    zoneInfo: [{
                            name: ''
                        },
                        {
                            name: ''
                        },
                        {
                            name: ''
                        },
                        {
                            name: ''
                        }
                    ]
                };
            },
            // 企业管理模糊查询
            getQueryAdmin() {
                let url = settledEnterpriseList;
                let name = this.adminFilters.enterName;
                url += name === '' ? '' : '&name=' + name;
                this.getAnData(url);
                this.adminFilters = {
                    enterName: ''
                };
            },
            seachAreaName(data, beSeachData, index) {
                for (let j = 0; j < beSeachData.length; j++) {
                    if (beSeachData[j].id === data[index]) {
                        let areaData = {};
                        areaData.name = beSeachData[j].name;
                        areaData.id = beSeachData[j].id;
                        this.newArea.push(areaData);
                        index = index + 1;
                        if (index < data.length) {
                            this.seachAreaName(
                                data,
                                beSeachData[j].children,
                                index
                            );
                        } else {
                            return;
                        }
                    }
                }
            },
            // 获取区域树形数据
            getTree() {
                this.$get(treeUrl + '&type=区域').then(res => {
                    this.treeList = publicFunction.killChildren(res[0].children);
                });
            },
            // 企业管理列表
            getAdminList() {
                this.getAnData(settledEnterpriseList);
            },
            getAnData(url) {
                this.adminLoading = true;
                this.$get(url).then(res => {
                    this.adminList = res;
                    this.adminLoading = false;
                });
            },
            //删除
            deleteEnterprise(index, row) {
                this.$confirm(
                        '删除企业将同时取消该企业下属用户的关联企业属性，是否删除?',
                        '提示', {
                            type: 'warning'
                        }
                    )
                    .then(() => {
                        this.adminLoading = true;
                        this.$del(deleteEnterprise + row.id).then(res => {
                            this.adminLoading = false;
                            this.$message.success('删除成功');
                            this.getAdminList();
                        });
                    })
                    .catch(() => {});
            },
            // 显示编辑界面
            editEnterprise(index, row) {
                if (this.$refs.adminAEForm !== undefined) this.$refs.adminAEForm.resetFields();
                this.selOptions = [];
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.adminAEVisible = true;
                this.adminAEForm = {
                    id: '',
                    name: '',
                    addInfo: {
                        industry: '',
                        enterTime: '',
                        outTime: '',
                        logo: '',
                        intro: '',
                        businessModel: '',
                        area: ''
                    }
                };
                this.adminAEForm = publicFunction.deepCopy(this.adminAEForm, row);
                console.log(row);
                for (let i of row.zoneInfo) {
                    this.selOptions.push(i.id);
                }
                this.selOptions.shift();
            },
            //分页
            sizeChange(val) {
                this.pagesize = val;
            },
            currentChange(val) {
                this.page = val;
            },
            //新增
            addAdminSubmit() {
                this.$refs.adminAEForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.newArea = [];
                            this.seachAreaName(this.selOptions, this.treeList, 0);
                            this.adminAEForm.address = '松湖智谷园区'
                            for (let i of this.newArea) {
                                this.adminAEForm.address += i.name
                            }
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                name: this.adminAEForm.name,
                                address: this.adminAEForm.address,
                                addInfo: {
                                    area: this.adminAEForm.addInfo.area,
                                    intro: this.adminAEForm.addInfo.intro,
                                    businessModel: this.adminAEForm.addInfo.businessModel,
                                    zoneId: this.selOptions[this.selOptions.length - 1],
                                    logo: this.adminAEForm.addInfo.logo,
                                    industry: this.adminAEForm.addInfo.industry,
                                    enterTime: this.adminAEForm.addInfo.enterTime,
                                    outTime: this.adminAEForm.addInfo.outTime,
                                }
                            };
                            let message = '添加成功';
                            if (this.isEdit) {
                                data.id = this.isEditId;
                                message = '修改成功';
                            }
                            this.$post(addOrUpdatedEnterprise, data).then(res => {
                                this.$message.success(message);
                                this.$refs.adminAEForm.resetFields();
                                this.adminAEVisible = false;
                                this.getAdminList();
                            });
                        });
                    }
                });
            }
        },
        mounted() {
            this.imgData.folderName = localStorage.getItem('parkId');
            this.imageUploadUrl = localStorage.getItem('upUrl') + uploadPic;
            this.getAdminList(); // 企业管理
            this.getTree(); // 获取区域信息
        }
    };
</script>

<style lang="scss">
    .logoImg {
        width: 100%;
        height: 100%;
        border-radius: 6px;
    }
</style>