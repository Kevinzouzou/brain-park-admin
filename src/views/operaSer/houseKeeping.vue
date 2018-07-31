<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="服务管理" name="ServiceManagement">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" :model="serviceFilter">
                            <el-form-item label="服务分类：">
                                <el-select placeholder="请选择服务分类" v-model="serviceFilter.subType" @change="housekeepingListSeach()">
                                    <el-option label="全部" value="全部"></el-option>
                                    <el-option label="装修服务" value="装修服务"></el-option>
                                    <el-option label="搬迁服务" value="搬迁服务"></el-option>
                                    <el-option label="保洁服务" value="保洁服务"></el-option>
                                    <el-option label="园艺服务" value="园艺服务"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input prefix-icon="el-icon-search" v-model="serviceFilter.thirdPartOrPhone" placeholder="搜索"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="housekeepingListSeach()">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <!--列表-->
                    <el-table :data="HousekeepingList.slice((HousekeepingListPage-1)*HousekeepingListPagesize,HousekeepingListPage*HousekeepingListPagesize)"
                        highlight-current-row v-loading="HousekeepingListLoading" style="width: 100%;">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="addInfo.subtype" label="服务分类">
                        </el-table-column>
                        <el-table-column prop="addInfo.itemType" label="类型">
                        </el-table-column>
                        <el-table-column label="图片">
                            <template slot-scope="scope">
                                <img :src="scope.row.thumbUrl" width="40" height="40" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="addInfo.price" label="参考价格">
                            <template slot-scope="scope">
                                <span>{{scope.row.addInfo.price}}/{{scope.row.addInfo.unit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addInfo.companyName" label="第三方公司">
                        </el-table-column>
                        <el-table-column prop="addInfo.contactPhone" label="预约电话">
                        </el-table-column>
                        <el-table-column prop="addInfo.shared" label="拼单">
                            <template slot-scope="scope">
                                <span v-if="scope.row.addInfo.shared === 1">是</span>
                                <span v-else>否</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="houseKeepingInfoCheck(scope.$index, scope.row)">查看</el-button>
                                <el-button type="success" size="small" @click="houseKeepingInfoEdit(scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <!--工具条-->
                <el-row :gutter="24">
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="HousekeepingListPageSizeChange" @current-change="HousekeepingListPageCurrentChange"
                            :page-sizes="[7,8,10,20]" :page-size="HousekeepingListPagesize" layout="total,sizes, prev, pager, next, jumper"
                            :current-page="HousekeepingListPage" :total="HousekeepingListTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-row>

                <!-- 查看服务详情 -->
                <el-dialog title="查看服务信息" :visible.sync="HouseKeepingInfoCheckVisible">
                    <el-form :model="houseKeepingInfo" label-width="150px">
                        <el-row>
                            <el-form-item label="服务分类：">
                                <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.subtype}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="类型：">
                                    <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.itemType}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="是否可拼单：">
                                    <span v-if="houseKeepingInfo.addInfo.shared === 1">是</span>
                                    <span v-else>否</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="图片：">
                                <img v-if="houseKeepingInfo.thumbUrl" :src="houseKeepingInfo.thumbUrl" style="width: 178px;border-radius: 6px;" />
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="参考价格：">
                                    <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.price}}</span>元
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="价格计算单位：">
                                    <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.unit}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="第三方公司：">
                                <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.companyName}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="预约电话：">
                                <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.contactPhone}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="注意事项：">
                                <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.remark}}</span>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="HouseKeepingInfoCheckVisible = false">关闭</el-button>
                        <el-button type="primary" @click="HouseKeepingInfoCheckVisible = false">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 编辑服务详情 -->
                <el-dialog title="编辑服务信息" :visible.sync="HouseKeepingInfoEditVisible">
                    <el-form :model="houseKeepingInfo" label-width="150px" :rules="houseKeepingInfoRules" ref="houseKeepingInfo">
                        <el-row>
                            <el-form-item label="服务分类：" required>
                                <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.subtype}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="类型：" required>
                                    <span v-if="houseKeepingInfo.addInfo">{{houseKeepingInfo.addInfo.itemType}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="是否可拼单：" required>
                                    <span v-if="houseKeepingInfo.addInfo.shared === 1">是</span>
                                    <span v-else>否</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="图片：" required>
                                <!-- <img v-if="houseKeepingInfo.thumbUrl" :src="houseKeepingInfo.thumbUrl" style="width: 178px;border-radius: 6px;" /> -->
                                <el-upload class="avatar-uploader" :action=imageUploadUrl :data="imgData" :show-file-list="false" :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="houseKeepingInfo.thumbUrl" :src="houseKeepingInfo.thumbUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="参考价格：" required prop="addInfo.price">
                                    <el-input v-model="houseKeepingInfo.addInfo.price" placeholder="价格"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <span style="line-height: 40px;padding-left: 10px;">元</span>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="价格计算单位：" required prop="addInfo.unit">
                                    <el-input v-model="houseKeepingInfo.addInfo.unit" placeholder="单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <span style="line-height: 40px;padding-left: 10px;">(例如：天、月、次)</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="第三方公司：" required prop="addInfo.companyName">
                                    <el-input v-model="houseKeepingInfo.addInfo.companyName" placeholder="公司名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="预约电话：" required prop="addInfo.contactPhone">
                                    <el-input v-model="houseKeepingInfo.addInfo.contactPhone" placeholder="预约电话"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="19">
                                <el-form-item label="注意事项：" required prop="addInfo.remark">
                                    <el-input type="textarea" v-model="houseKeepingInfo.addInfo.remark" placeholder="注意事项"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="HouseKeepingInfoEditVisible = false">关闭</el-button>
                        <el-button type="primary" @click="updateHouseKeepingInfo('houseKeepingInfo')">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="拼单记录" name="CrowdorderingNotes">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" :model="crowdorderingFilter">
                            <el-form-item label="服务分类：">
                                <el-select placeholder="请选择服务分类" v-model="crowdorderingFilter.subtype" @change="housekeepingListSeach()">
                                    <el-option label="全部" value="全部"></el-option>
                                    <el-option label="装修服务" value="装修服务"></el-option>
                                    <el-option label="搬迁服务" value="搬迁服务"></el-option>
                                    <el-option label="保洁服务" value="保洁服务"></el-option>
                                    <el-option label="园艺服务" value="园艺服务"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="类型：">
                                <el-select placeholder="请选择分类" v-model="crowdorderingFilter.itemType" @change="housekeepingListSeach()">
                                    <el-option label="全部" value="全部"></el-option>
                                    <el-option label="绿植维护" value="绿植维护"></el-option>
                                    <el-option label="包月保洁" value="包月保洁"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态：">
                                <el-select placeholder="请选择分类" v-model="crowdorderingFilter.stage" @change="housekeepingListSeach()">
                                    <el-option label="全部" value="全部"></el-option>
                                    <el-option label="待拼单" value="待拼单"></el-option>
                                    <el-option label="已拼单" value="已拼单"></el-option>
                                    <el-option label="已退款" value="已退款"></el-option>
                                    <el-option label="已取消" value="已取消"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input prefix-icon="el-icon-search" v-model="crowdorderingFilter.selection" placeholder=" 搜索拼单联系人/拼单联系电话/拼单公司/公司楼栋"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="crowdorderingListSeach()">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <!--列表-->
                    <el-table :data="crowdorderingList.slice((crowdorderingListPage-1)*crowdorderingListPagesize,crowdorderingListPage*crowdorderingListPagesize)"
                        highlight-current-row v-loading="crowdorderingListLoading" style="width: 100%;">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="addInfo.subtype" label="服务分类">
                        </el-table-column>
                        <el-table-column prop="addInfo.itemType" label="类型">
                        </el-table-column>
                        <el-table-column prop="addInfo.contact" label="拼单联系人">
                        </el-table-column>
                        <el-table-column prop="addInfo.phone" label="联系电话">
                        </el-table-column>
                        <el-table-column prop="addInfo.companyName" label="拼单公司">
                        </el-table-column>
                        <el-table-column prop="addInfo.location" label="公司楼栋">
                        </el-table-column>
                        <el-table-column prop="addInfo.area" label="公司面积">
                        </el-table-column>
                        <el-table-column prop="stage" label="状态">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="crowdorderingInfoCheck(scope.$index, scope.row)">查看</el-button>
                                <el-button v-show="scope.row.stage === '待拼单'" type="success" size="small" @click="updatePropertyApplication(scope.$index, scope.row,'已拼单')">拼单</el-button>
                                <el-button v-show="scope.row.stage === '已拼单'" type="danger" size="small" @click="updatePropertyApplication(scope.$index, scope.row,'已退款')">退款</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <!--工具条-->
                <el-row :gutter="24">
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="crowdorderingListPageSizeChange" @current-change="crowdorderingListPageCurrentChange"
                            :page-sizes="[7,8,10,20]" :page-size="crowdorderingListPagesize" layout="total,sizes, prev, pager, next, jumper"
                            :current-page="crowdorderingListPage" :total="crowdorderingListTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-row>

                <el-dialog title="拼单详情" :visible.sync="crowdorderingInfoFormVisible">
                    <el-form :model="crowdorderingInfoForm" label-width="150px">
                        <el-row>
                            <el-form-item label="服务分类：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.subtype}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="类型：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.itemType}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="状态：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.stage}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="拼单联系人：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.contact}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="联系电话：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.phone}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="拼单公司：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.companyName}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="公司楼栋：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.location}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="公司面积：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.area}}</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="用户备注：">
                                <span v-if="crowdorderingInfoForm.addInfo">{{crowdorderingInfoForm.addInfo.remark}}</span>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button v-show="crowdorderingInfoForm.stage === '待拼单'" @click="updatePropertyApplication(null,null,'已取消')">取消拼单</el-button>
                        <el-button v-show="crowdorderingInfoForm.stage === '待拼单'" type="success" @click="updatePropertyApplication(null,null,'已拼单')">拼单</el-button>
                        <el-button v-show="crowdorderingInfoForm.stage === '已拼单'" type="danger" @click="updatePropertyApplication(null,null,'已退款')">退款</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import axios from 'axios';
    import {
        housekeepingList,
        addOrUpdateDisplayContent,
        crowdorderingApplication,
        updatePropertyApplication,
        uploadPic
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                imageUploadUrl: '',
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                HousekeepingListPage: 1,
                HousekeepingListPagesize: 7,
                activeName: 'ServiceManagement',
                serviceFilter: {
                    subType: '全部',
                    thirdPartOrPhone: ''
                },
                HousekeepingListLoading: false,
                HousekeepingList: [],
                HousekeepingListTotal: 0,
                HouseKeepingInfoCheckVisible: false,
                HouseKeepingInfoEditVisible: false,
                houseKeepingInfo: {
                    addInfo: {
                        companyName: "",
                        contactPhone: "",
                        itemType: "",
                        price: "",
                        remark: "",
                        shared: 1,
                        subtype: "",
                        unit: "",
                    },
                    id: "",
                    thumbUrl: '',
                    type: "家政服务",
                },
                houseKeepingInfoRules: {
                    addInfo: {
                        price: [{
                            required: true,
                            message: '请输入正确的价格',
                            trigger: ['blur', 'change'],
                            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
                        }],
                        unit: [{
                            required: true,
                            message: '请输入正确的单位',
                            trigger: 'blur',
                        }],
                        companyName: [{
                            required: true,
                            message: '请输入公司姓名',
                            trigger: 'blur',
                        }],
                        contactPhone: [{
                            required: true,
                            message: '请输入纯数字作为联系电话',
                            trigger: ['blur', 'change'],
                            // pattern: /(^[0-9]*$)/
                        }],
                        remark: [{
                            required: true,
                            message: '请输入注意事项',
                            trigger: 'blur',
                        }]
                    }
                },
                crowdorderingListPage: 1,
                crowdorderingListPagesize: 7,
                crowdorderingFilter: {
                    subtype: '全部',
                    itemType: '全部',
                    stage: '全部',
                    selection: ''
                },
                crowdorderingList: [],
                crowdorderingListTotal: 0,
                crowdorderingListLoading: false,
                crowdorderingInfoFormVisible: false,
                crowdorderingInfoForm: {
                    addInfo: {
                        area: "",
                        companyName: "",
                        contact: "",
                        itemType: "",
                        location: "",
                        phone: "",
                        remark: "",
                        subtype: "",
                    },
                    id: "",
                    stage: "",
                    type: "",
                }
            };
        },
        methods: {
            // 获取家政服务列表
            getHousekeepingList(url) {
                this.HousekeepingListLoading = true;
                url += '&type=家政服务';
                this.$get(url).then(res => {
                    this.HousekeepingList = res;
                    this.HousekeepingListTotal =
                        this.HousekeepingList.length > 0 ?
                        this.HousekeepingList.length :
                        0;
                    this.HousekeepingListLoading = false;
                });
            },
            // 搜索家政服务列表
            housekeepingListSeach() {
                let subType = this.serviceFilter.subType;
                let thirdPartOrPhone = this.serviceFilter.thirdPartOrPhone;
                let url = housekeepingList;
                if (subType !== '全部') {
                    url += `&subType=${subType}`;
                }
                if (thirdPartOrPhone !== '') {
                    url += `&thirdPartOrPhone=${thirdPartOrPhone}`;
                }
                this.getHousekeepingList(url);
            },
            houseKeepingInfoCheck(index, row) {
                this.HouseKeepingInfoCheckVisible = true;
                let dataObj = this.houseKeepingInfo
                this.houseKeepingInfo = publicFunction.deepCopy(dataObj, row);
            },
            houseKeepingInfoEdit(index, row) {
                this.HouseKeepingInfoEditVisible = true;
                let dataObj = this.houseKeepingInfo
                this.houseKeepingInfo = publicFunction.deepCopy(dataObj, row);

            },
            // 更新
            updateHouseKeepingInfo(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = this.houseKeepingInfo;
                        data.parkId = localStorage.getItem('parkId');
                        console.log(JSON.stringify(data));
                        this.$post(addOrUpdateDisplayContent, data).then(res => {
                            if (res.operationResult === 'failure') {
                                this.$message({
                                    message: 'failureMsg',
                                    type: 'success'
                                });
                            } else {
                                this.resetForm(formName);
                                this.HouseKeepingInfoEditVisible = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.getHousekeepingList(housekeepingList);
                            }
                        });
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            handleAvatarSuccess(res, file) {
                this.houseKeepingInfo.thumbUrl = res.responseList.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            HousekeepingListPageSizeChange(val) {
                this.HousekeepingListPagesize = val;
            },
            HousekeepingListPageCurrentChange(val) {
                this.HousekeepingListPage = val;
                this.housekeepingListSeach();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 获取家政申请拼单列表
            getCrowdorderingList(url) {
                this.crowdorderingListLoading = true;
                url += '&type=家政拼单'
                this.$get(url).then(res => {
                    this.crowdorderingList = res;
                    this.crowdorderingListTotal =
                        this.crowdorderingList.length > 0 ?
                        this.crowdorderingList.length :
                        0;
                    this.crowdorderingListLoading = false;
                });
            },
            // 搜索家政申请拼单列表
            crowdorderingListSeach() {
                let subtype = this.crowdorderingFilter.subtype;
                let itemType = this.crowdorderingFilter.itemType;
                let stage = this.crowdorderingFilter.stage;
                let selection = this.crowdorderingFilter.selection;
                let url = crowdorderingApplication;
                if (subtype !== '全部') {
                    url += `&subtype=${subtype}`;
                }
                if (itemType !== '全部') {
                    url += `&itemType=${itemType}`;
                }
                if (stage !== '全部') {
                    url += `&stage=${stage}`;
                }
                if (selection !== '') {
                    url += `&selection=${selection}`;
                }
                this.getCrowdorderingList(url);
            },
            crowdorderingListPageSizeChange(val) {
                this.crowdorderingListPagesize = val;
            },
            crowdorderingListPageCurrentChange(val) {
                this.crowdorderingListPage = val;
                this.getCrowdorderingList(crowdorderingApplication);
            },
            crowdorderingInfoCheck(index, row) {
                this.crowdorderingInfoFormVisible = true;
                let dataObj = this.crowdorderingInfoForm
                this.crowdorderingInfoForm = publicFunction.deepCopy(dataObj, row);
            },
            //  修改物业拼单状态
            updatePropertyApplication(index, row, operating) {
                if (index === null) {
                    this.crowdorderingInfoForm.stage = operating;
                } else {
                    let dataObj = this.crowdorderingInfoForm
                    this.crowdorderingInfoForm = publicFunction.deepCopy(dataObj, row);
                    this.crowdorderingInfoForm.stage = operating;
                }
                this.$put(updatePropertyApplication, this.crowdorderingInfoForm).then(res => {
                    if (res.operationResult === 'failure') {
                        this.$message({
                            message: 'failureMsg',
                            type: 'success'
                        });
                    } else {
                        this.crowdorderingInfoFormVisible = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getCrowdorderingList(crowdorderingApplication);
                    }
                });
            }
        },
        mounted() {
            this.imgData = {
                bucketName: 'shared-resource',
                folderName: localStorage.getItem('parkId')
            };
            this.imageUploadUrl = localStorage.getItem('upUrl') + uploadPic;
            this.getHousekeepingList(housekeepingList);
            this.getCrowdorderingList(crowdorderingApplication);
        }
    };
</script>

<style lang="scss">
    .avatar {
        width: 178px;
        height: auto;
        display: block;
        border-radius: 6px;
    }
</style>