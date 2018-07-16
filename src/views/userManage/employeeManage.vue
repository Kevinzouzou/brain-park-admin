<template>
    <section>
        <el-row :gutter="24">
            <el-col :span="5">
                <el-card shadow="never" style="height:750px;overflow-y: scroll;" v-loading="parkInfoTreeListLoading">
                    <el-tree :data="parkInfoTreeList" :props="parkInfoTreeListProps" @node-click="handleNodeClick" :highlight-current="true"
                        default-expand-all :expand-on-click-node="false"></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <!--工具条-->
                <div style="color: #606266;">松湖智谷
                    <span>{{departmentName}}</span>
                </div>
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="addParkUserFormVisible = true">新增员工</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="parkUserListFilters.nameOrPhone" class="userinfo-search" placeholder="输入姓名或手机号码" prefix-icon="el-icon-search"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getQueryParkUserList">搜索</el-button>
                        </el-form-item>
                        <el-form-item label="筛选：">
                            <el-checkbox v-model="parkUserListFilters.male" @change="getQueryParkUserList">男</el-checkbox>
                            <el-checkbox v-model="parkUserListFilters.female" @change="getQueryParkUserList">女</el-checkbox>
                            <el-checkbox v-model="parkUserListFilters.headOfTheTeam" @change="getQueryParkUserList">只看团队负责人</el-checkbox>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="parkUserList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="parkUserListLoading"
                    style="width: 100%;">
                    <el-table-column prop="addInfo.empNo" label="工号" width="80">
                    </el-table-column>
                    <el-table-column prop="addInfo.name" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.gender" label="性别">
                    </el-table-column>
                    <el-table-column prop="departmentInfo.name" label="部门" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.position" label="职位" sortable>
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号">
                    </el-table-column>
                    <el-table-column prop="addInfo.email" label="邮箱">
                    </el-table-column>
                    <el-table-column label="团队负责人">
                        <template slot-scope="scope">
                            <span v-if="scope.row.addInfo.isManager === 1">是</span>
                            <span v-else>否</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="info" size="small" @click="parkUserEdit(scope.$index, scope.row)">详情</el-button>
                            <el-button type="danger" size="small" @click="parkUserDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background @size-change="sizeChange" @current-change="currentChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                        layout="total,sizes, prev, pager, next, jumper" :total="parkUserListTotal" :current-page="page" style="float:right;">
                    </el-pagination>
                </el-col>
                <!--分页-->
            </el-col>
        </el-row>
        <!--弹出框 新增用户-->
        <el-dialog title="新增员工" :visible.sync="addParkUserFormVisible">
            <el-form :label-position="right" label-width="150px">
                <el-form-item label="员工照片：">
                    <el-upload class="avatar-uploader" :action=imageUploadUrl :data="imgData" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="addParkUserForm.addInfo.avatar" :src="addParkUserForm.addInfo.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-form :model="addParkUserForm" :label-position="right" label-width="160px" :rules="addParkUserFormRules" ref="addParkUserForm">
                    <el-row :gutter="24">
                        <el-col :span="10">
                            <el-form-item label="姓名：" required prop="addInfo.name">
                                <el-input placeholder="姓名" v-model="addParkUserForm.addInfo.name"></el-input>
                            </el-form-item>
                            <el-form-item label="所属部门：" required prop="addInfo.departmentId">
                                <el-cascader change-on-select :show-all-levels="false" :options="departmentTreeData" v-model="addParkUserForm.addInfo.departmentId" :props="departmentTreeDataProps"></el-cascader>
                            </el-form-item>
                            <el-form-item label="手机号码：" prop="phone" required>
                                <el-input placeholder="手机号码" v-model="addParkUserForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="性别：" prop="addInfo.gender" required>
                                <el-select v-model="addParkUserForm.addInfo.gender">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职位：" required prop="addInfo.position">
                                <el-input placeholder="职位" v-model="addParkUserForm.addInfo.position"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱地址：" required prop="addInfo.email">
                                <el-input placeholder="邮箱地址" v-model="addParkUserForm.addInfo.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-checkbox v-model="addParkUserForm.addInfo.isManager" style="margin-top:70px;">团队负责人</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="入职时间：" required prop="addInfo.hiredate">
                                <el-date-picker v-model="addParkUserForm.addInfo.hiredate" type="date" placeholder="选择入职日期" align="right" :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10" :offset="4">
                            <el-switch v-model="addParkUserForm.isSendPwd" active-text="发送随机初始密码到用户手机">
                            </el-switch>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addParkUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParkUser('addParkUserForm')">提交</el-button>
            </div>
        </el-dialog>
        <!--弹出框 新增用户-->
        <!--弹出框 员工详情-->
        <el-dialog title="员工详情" :visible.sync="editParkUserFormVisible">
            <el-form :model="editParkUserForm" :label-position="right" label-width="160px" v-show="!editParkUserFormShow">
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="员工照片：">
                            <img v-if="editParkUserForm.addInfo.avatar" :src="editParkUserForm.addInfo.avatar" class="avatar">
                            <span v-else></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="10">
                        <el-button type="primary" @click="editParkUserFormShow = true">修改</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="工号：">
                            <span>{{editParkUserForm.addInfo.empNo}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="姓名：">
                            <span v-if="editParkUserForm.addInfo">
                            {{editParkUserForm.addInfo.name}}
                            </span>
                        </el-form-item>
                        <el-form-item label="所属部门：">
                            <span v-if="editParkUserForm.departmentInfo">
                                {{editParkUserForm.departmentInfo.name}}
                            </span>
                        </el-form-item>
                        <el-form-item label="手机号码：">
                            {{editParkUserForm.phone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="性别：">
                             <span v-if="editParkUserForm.addInfo">
                            {{editParkUserForm.addInfo.gender}}
                             </span>
                        </el-form-item>
                        <el-form-item label="职位：">
                             <span v-if="editParkUserForm.addInfo">
                            {{editParkUserForm.addInfo.position}}
                             </span>
                        </el-form-item>
                        <el-form-item label="邮箱地址：">
                             <span v-if="editParkUserForm.addInfo">
                            {{editParkUserForm.addInfo.email}}
                             </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="editParkUserForm.addInfo.isManager" style="margin-top:70px;" disabled>团队负责人</el-checkbox>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="入职时间：">
                            {{editParkUserForm.addInfo.hiredate.slice(0,10)}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="手机APP登陆密码：">
                            <el-input placeholder="重置密码将改变原来的密码" v-model="appPassword" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-button @click="resetPassword()">重置密码</el-button>
                        <el-button type="primary" @click="sendTheMessage()">发送手机短信</el-button>
                    </el-col>
                </el-row>
            </el-form>

            <el-form :model="editParkUserForm" :label-position="right" label-width="160px" :rules="editParkUserFormRules" ref="editParkUserForm"
                v-show="editParkUserFormShow">
                <el-form-item label="员工照片：">
                    <el-upload class="avatar-uploader" :action="imageUploadUrl" :data="imgData" :show-file-list="false" :on-success="handleEditParkUserAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="editParkUserForm.addInfo.avatar" :src="editParkUserForm.addInfo.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="工号：">
                            <span>{{editParkUserForm.addInfo.empNo}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="姓名：" required prop="addInfo.name">
                            <el-input placeholder="姓名" v-model="editParkUserForm.addInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="所属部门：" required prop="addInfo.departmentId">
                            <el-cascader :show-all-levels="false" :options="departmentTreeData" v-model="editParkUserForm.addInfo.departmentId" :props="departmentTreeDataProps"></el-cascader>
                        </el-form-item>
                        <el-form-item label="手机号码：" prop="phone" required>
                            <el-input placeholder="手机号码" v-model="editParkUserForm.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="性别：" prop="addInfo.gender" required>
                            <el-select v-model="editParkUserForm.addInfo.gender">
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="职位：" required prop="addInfo.position">
                            <el-input placeholder="职位" v-model="editParkUserForm.addInfo.position"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱地址：" required prop="addInfo.email">
                            <el-input placeholder="邮箱地址" v-model="editParkUserForm.addInfo.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="editParkUserForm.addInfo.isManager" style="margin-top:70px;">团队负责人</el-checkbox>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="入职时间：" required  >
                            <el-date-picker v-model="editParkUserForm.addInfo.hiredate" type="date" placeholder="选择入职日期" align="right" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="editParkUserFormShow">
                <el-button @click="editParkUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateParkUserInfo('editParkUserForm')">修改</el-button>
            </div>
        </el-dialog>
        <!--弹出框 员工详情-->
    </section>
</template>

<script>
import {
    parkUserList,
    addParkUser,
    updateParkUserInfo,
    deleteUser,
    parkInfoTreeList,
    uploadPic,
    sendMessage
} from '../../api/api';
export default {
    data() {
        return {
            imageUploadUrl: '', //图片上传路径
            right: 'right',
            page: 1,
            pagesize: 7,
            departmentName: '',
            imgData: {
                bucketName: 'shared-resource',
                folderName: ''
            },
            parkUserList: '', // 员工列表
            parkUserListTotal: 0, // 员工总数
            parkUserListLoading: false, // 员工列表loading控件
            parkUserListFilters: {
                //员工列表筛选
                nameOrPhone: '',
                male: false,
                female: false,
                headOfTheTeam: false,
                departmentId: ''
            },
            parkInfoTreeList: [], // 组织结构数据
            departmentTreeData: '', // 员工所属部门数据
            departmentTreeDataProps: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
            parkInfoTreeListLoading: false, // 组织结构loading控件
            // 左侧树形组件规则
            parkInfoTreeListProps: {
                children: 'children',
                label: 'name'
            },
            addParkUserFormVisible: false, // 弹框
            addParkUserForm: {
                //添加员工数据表单
                phone: '',
                addInfo: {
                    name: '',
                    gender: '',
                    position: '',
                    email: '',
                    isManager: false,
                    hiredate: '',
                    departmentId: '',
                    avatar: ''
                },
                isSendPwd: false
            },
            dialogEmployeeDetailsVisible: false,
            // 时间组件
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }
                ]
            },
            appPassword: '', // 重置的新密码
            // 表单验证规则
            addParkUserFormRules: {
                phone: [
                    {
                        required: true,
                        message: '请输入正确的电话号码',
                        trigger: 'blur',
                        pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
                    }
                ],
                addInfo: {
                    name: [
                        {
                            required: true,
                            message: '请输入正确的中文姓名',
                            trigger: 'blur',
                            pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
                        }
                    ],
                    gender: [
                        {
                            required: true,
                            message: '请选择员工性别',
                            trigger: 'change'
                        }
                    ],
                    position: [
                        {
                            required: true,
                            message: '请填写员工职位',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            message: '请填写正确格式的员工邮箱',
                            trigger: 'blur',
                            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                        }
                    ],
                    hiredate: [
                        {
                            type: 'date',
                            required: true,
                            message: '请选择日期',
                            trigger: 'change'
                        }
                    ],
                    departmentId: [
                        {
                            required: true,
                            message: '请选择所属部门',
                            trigger: 'change'
                        }
                    ]
                }
            },
            editParkUserFormVisible: false,
            editParkUserFormShow: false,
            editParkUserForm: {
                id: '',
                type: 2,
                phone: '',
                addInfo: {
                    empNo: '',
                    name: '',
                    gender: '',
                    position: '',
                    email: '',
                    isManager: false,
                    hiredate: '',
                    departmentId: [],
                    avatar: ''
                },
                departmentInfo: {
                    name: '',
                    sequence: ''
                }
            },
            // 表单验证规则
            editParkUserFormRules: {
                phone: [
                    {
                        required: true,
                        message: '请输入正确的电话号码',
                        trigger: 'blur',
                        pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
                    }
                ],
                addInfo: {
                    name: [
                        {
                            required: true,
                            message: '请输入正确的中文姓名',
                            trigger: 'blur',
                            pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
                        }
                    ],
                    gender: [
                        {
                            required: true,
                            message: '请选择员工性别',
                            trigger: 'change'
                        }
                    ],
                    position: [
                        {
                            required: true,
                            message: '请填写员工职位',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            message: '请填写正确格式的员工邮箱',
                            trigger: 'blur',
                            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                        }
                    ],
                    // hiredate: [
                    //     {
                    //         type: 'date',
                    //         required: true,
                    //         message: '请选择日期',
                    //         trigger: 'change'
                    //     }
                    // ],
                    departmentId: [
                        {
                            required: true,
                            message: '请选择所属部门',
                            trigger: 'change'
                        }
                    ]
                }
            }
        };
    },
    methods: {
        // 获取部门组织结构
        getParkInfoTreeList() {
            this.parkInfoTreeListLoading = true;
            this.$get(parkInfoTreeList + '组织架构').then(res => {
                this.parkInfoTreeList = res;
                this.parkInfoTreeListLoading = false;
                this.departmentTreeData = this.killChildren(res[0].children);
            });
        },
        // 删除对象里孩子为空的属性
        killChildren(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].children.length === 0) {
                    delete data[i].children;
                } else {
                    this.killChildren(data[i].children);
                }
            }
            return data;
        },
        //获取员工列表
        getParkUserList(url, headOfTheTeam) {
            this.parkUserListLoading = true;
            this.$get(url).then(res => {
                let data = [];
                if (headOfTheTeam) {
                    for (let value of res) {
                        value.addInfo.isManager === 1 ? data.push(value) : '';
                    }
                } else {
                    data = res;
                }
                this.parkUserList = data;
                this.parkUserListTotal =
                    this.parkUserList.length > 0 ? this.parkUserList.length : 1;
                this.parkUserListLoading = false;
            });
        },
        // 添加员工
        addParkUser(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = this.addParkUserForm;
                    data.parkId = localStorage.getItem('parkId');
                    data.type = 2; // 添加员工
                    data.addInfo.departmentId = this.addParkUserForm.addInfo.departmentId.pop();
                    data.isSendPwd =
                        this.addParkUserForm.isSendPwd === true ? 1 : 0;
                    data.addInfo.isManager =
                        this.addParkUserForm.addInfo.isManager === true ? 1 : 0;
                    console.log(JSON.stringify(data));
                    this.$post(addParkUser, data).then(res => {
                        if (res.operationResult === 'failure') {
                            let title = res.failureMsg;
                            let name = res.responseList.name;
                            let phone = res.responseList.phone;
                            let post = res.responseList.post;
                            let id = res.responseList.id;
                            this.$alert(
                                `<span>姓名：${name}</span></br><span>电话：${phone}</span></br><span>职位：${post}</span></br><span>ID：${id}</span></br>`,
                                title,
                                {
                                    dangerouslyUseHTMLString: true
                                }
                            );
                        } else {
                            this.departmentTreeData = this.departmentTreeData;
                            this.getParkUserList(parkUserList);
                            this.resetForm('addParkUserForm');
                            this.addParkUserForm.addInfo.departmentId = [];
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                        }
                    });
                } else {
                    console.log('表单未完全填写');
                    return false;
                }
            });
        },
        // 图片上传
        handleAvatarSuccess(res, file) {
            this.addParkUserForm.addInfo.avatar = res.responseList.url;
        },
        handleEditParkUserAvatarSuccess(res, file) {
            console.log(file);
            this.editParkUserForm.addInfo.avatar = res.responseList.url;
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
        // 编辑员工窗口
        parkUserEdit: function(index, row) {
            this.appPassword = '';
            this.editParkUserFormVisible = true;
            this.editParkUserFormShow = false;
            this.editParkUserForm = this.deepCopy(this.editParkUserForm, row);
            this.editParkUserForm.addInfo.isManager =
                row.addInfo.isManager === 1 ? true : false;
            this.editParkUserForm.addInfo.departmentId = this.editParkUserForm.departmentInfo.sequence
                .split('.')
                .slice(1);
        },
        updateParkUserInfo(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = this.editParkUserForm;
                    data.parkId = localStorage.getItem('parkId');
                    data.addInfo.departmentId = this.editParkUserForm.addInfo.departmentId.pop();
                    data.addInfo.isManager =
                        this.editParkUserForm.addInfo.isManager === true
                            ? 1
                            : 0;
                    delete data.departmentInfo;
                    console.log(JSON.stringify(data));
                    this.$put(updateParkUserInfo, data).then(res => {
                        if (res.operationResult === 'failure') {
                            let title = res.failureMsg;
                            let name = res.responseList.name;
                            let phone = res.responseList.phone;
                            let post = res.responseList.post;
                            let id = res.responseList.id;
                            this.$alert(
                                `<span>姓名：${name}</span></br><span>电话：${phone}</span></br><span>职位：${post}</span></br><span>ID：${id}</span></br>`,
                                title,
                                {
                                    dangerouslyUseHTMLString: true
                                }
                            );
                        } else {
                            this.editParkUserFormVisible = false;
                            this.getParkUserList(parkUserList);
                            this.editParkUserForm = {
                                id: '',
                                type: 2,
                                phone: '',
                                addInfo: {
                                    empNo: '',
                                    name: '',
                                    gender: '',
                                    position: '',
                                    email: '',
                                    isManager: false,
                                    hiredate: '',
                                    departmentId: [],
                                    avatar: ''
                                },
                                departmentInfo: {
                                    name: '',
                                    sequence: ''
                                }
                            };
                            this.resetForm('editParkUserForm');
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        }
                    });
                } else {
                    console.log('表单未完全填写');
                    return false;
                }
            });
        },
        // 删除员工
        parkUserDel: function(index, row) {
            this.$confirm(
                '删除员工将同时取消该员工的物管服务APP登录权限，是否删除？',
                '注意',
                {
                    type: 'warning'
                }
            )
                .then(() => {
                    this.parkUserListLoading = true;
                    let para = {
                        id: row.id
                    };
                    this.$del(deleteUser + para.id).then(response => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getParkUserList(parkUserList);
                    });
                })
                .catch(() => {});
        },
        // 查询公司或用户信息模糊查询
        getQueryParkUserList() {
            let url = parkUserList;
            let nameOrPhone = this.parkUserListFilters.nameOrPhone;
            let male = this.parkUserListFilters.male;
            let female = this.parkUserListFilters.female;
            let headOfTheTeam = this.parkUserListFilters.headOfTheTeam;
            let departmentId = this.parkUserListFilters.departmentId;
            url =
                nameOrPhone === ''
                    ? url + ''
                    : url + '&nameOrPhone=' + nameOrPhone;
            url =
                male === false
                    ? female === false ? url + '' : url + '&gender=女'
                    : female === true ? url + '' : url + '&gender=男';
            url =
                departmentId === ''
                    ? url + ''
                    : url + '&departmentId=' + departmentId;
            this.getParkUserList(url, headOfTheTeam);
        },
        // 点击树形结构查询员工列表
        handleNodeClick(data) {
            if (data.parentId === '') {
                this.departmentName = '';
                this.parkUserListFilters.departmentId = '';
            } else {
                this.departmentName = data.name;
                this.parkUserListFilters.departmentId = data.id;
            }
            this.getQueryParkUserList();
        },
        // 重置员工密码并保存数据库
        resetPassword() {
            this.$confirm(
                '此操作将重置该员工密码并保存数据库, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }
            )
                .then(() => {
                    this.appPassword = Math.random()
                        .toString()
                        .slice(-8);
                    let data = {};
                    data.id = this.editParkUserForm.id;
                    data.password = this.appPassword;
                    data.type = 2;
                    this.$put(updateParkUserInfo, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        // 发送重置密码给员工
        sendTheMessage() {
            let password = this.appPassword;
            let data = {
                phoneNumbers: '18813958331',
                signName: '松湖智谷',
                templateCode: 'SMS_137421065',
                templateParam: {
                    // name: this.editParkUserForm.addInfo.name,
                    name: 'ooo',
                    code: password
                }
            };
            if (password === '') {
                this.$message({
                    type: 'info',
                    message: '请先重置员工密码'
                });
            } else {
                this.$confirm(
                    '此操作将发送员工的新密码到该员工的手机上， 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }
                )
                    .then(() => {
                        console.log(JSON.stringify(data));
                        this.$post(sendMessage, data).then(res => {
                            if (res.operationResult === 'failure') {
                                this.$message({
                                    type: 'error',
                                    message: `${res.failureMsg}`
                                });
                            } else {
                                this.$message({
                                    type: 'success',
                                    message: '发送成功!'
                                });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            }
        },
        sizeChange(val) {
            this.pagesize = val;
        },
        currentChange(val) {
            this.page = val;
            this.getQueryParkUserList();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 拷贝对象
        deepCopy(object, beCopied) {
            for (let i in object) {
                if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object String]'
                ) {
                    object[i] = beCopied[i];
                } else if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object Number]'
                ) {
                    object[i] = beCopied[i];
                } else if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object Object]'
                ) {
                    this.deepCopy(object[i], beCopied[i]);
                } else if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object Undefined]'
                ) {
                    object[i] = object[i];
                } else if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object Boolean]'
                ) {
                    object[i] = beCopied[i];
                } else if (
                    Object.prototype.toString.call(beCopied[i]) ===
                    '[object Array]'
                ) {
                    object[i] = beCopied[i];
                } else {
                    object[i] = '';
                }
            }
            return object;
        }
    },
    mounted() {
        this.getParkUserList(parkUserList);
        this.getParkInfoTreeList();
        this.imageUploadUrl = localStorage.getItem('upUrl') + uploadPic;
        this.imgData = {
            bucketName: 'shared-resource',
            folderName: localStorage.getItem('parkId')
        };
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