<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-card shadow="never" style="height:750px;overflow-y: scroll;" v-loading="parkInfoTreeListLoading">
                    <el-tree :data="parkInfoTreeList" :props="parkInfoTreeListProps" @node-click="handleNodeClick" default-expand-all="true"></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <!--工具条-->
                <div style="color: #606266;">松湖智谷管理公司
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
                    <el-table-column prop="addInfo.empNo" label="工号" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.name" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.gender" label="性别">
                    </el-table-column>
                    <el-table-column prop="addInfo.department" label="部门" sortable>
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
                            <el-button type="info" size="small" @click="parkUserEdit(scope.$index, scope.row)">编辑</el-button>
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
                    <!-- <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-form :model="addParkUserForm" :label-position="right" label-width="160px" :rules="addParkUserFormRules">
                    <el-row :gutter="24">
                        <el-col :span="10">
                            <el-form-item label="姓名：" required prop="name">
                                <el-input placeholder="姓名" v-model="addParkUserForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="所属部门：" required prop="department">
                                <!-- <el-select v-model="addParkUserForm.departmentId">
                                    <el-option label="总经办" value="总经办"></el-option>
                                    <el-option label="保安队" value="保安队"></el-option>
                                    <el-option label="行政部" value="行政部"></el-option>
                                    <el-option label="人力资源部" value="人力资源部"></el-option>
                                </el-select> -->
                                <el-cascader :options="departmentTreeData" :show-all-levels="false"></el-cascader>
                            </el-form-item>
                            <el-form-item label="手机号码：" prop="phone" required>
                                <el-input placeholder="手机号码" v-model="addParkUserForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="性别：" prop="gender" required>
                                <el-select v-model="addParkUserForm.addInfo.gender">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职位：" required prop="position">
                                <el-input placeholder="职位" v-model="addParkUserForm.addInfo.position"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱地址：" required prop="email">
                                <el-input placeholder="邮箱地址" v-model="addParkUserForm.addInfo.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-checkbox v-model="addParkUserForm.addInfo.isManager" style="margin-top:70px;">团队负责人</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="入职时间：" required prop="hiredate">
                                <el-date-picker v-model="addParkUserForm.addInfo.hiredate" type="date" placeholder="选择入职日期" align="right" :picker-options="pickerOptions1">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10" offset="4">
                            <el-switch v-model="addParkUserForm.isSendPwd" active-text="发送随机初始密码到用户手机">
                            </el-switch>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addParkUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParkUserFormVisible = false">提交</el-button>
            </div>
        </el-dialog>
        <!--弹出框 新增用户-->
        <!--弹出框 员工详情-->
        <el-dialog title="员工详情" :visible.sync="dialogEmployeeDetailsVisible">
            <el-form :model="form" :label-position="right" label-width="160px">
                <el-form-item label="员工照片：">
                    <!-- <el-upload  action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->
                    <img class="userImg" src="http://dingyue.nosdn.127.net/8ZIRto71kgyY0MB3pem8QyB0M9tXQ=NuWB3cgK5iOs1fS1518416187907.jpg">
                </el-form-item>
                <el-form-item label="工号：">
                    <span>123456</span>
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form :label-position="right" label-width="160px">
                        <el-form-item label="姓名：" required prop="name">
                            <el-input v-show="false" placeholder="姓名"></el-input>
                            <span>彭于晏</span>
                        </el-form-item>
                        <el-form-item label="所属部门：" prop="department" required>
                            <el-select v-show="false">
                                <el-option label="员工" value="yungong"></el-option>
                                <el-option label="管理员" value="guanliyuan"></el-option>
                                <el-option label="企业所有者" value="boss"></el-option>
                            </el-select>
                            <span>员工</span>
                        </el-form-item>
                        <el-form-item label="手机号码：" prop="phone" required>
                            <el-input v-show="false" placeholder="手机号码"></el-input>
                            <span>手机号码</span>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <el-form :model="ruleForm" :label-position="right" label-width="160px">
                        <el-form-item label="性别：" prop="sex" required>
                            <el-select v-show="false">
                                <el-option label="男" value="yungong"></el-option>
                                <el-option label="女" value="guanliyuan"></el-option>
                            </el-select>
                            <span>男</span>
                        </el-form-item>
                        <el-form-item label="职位：" required prop="position">
                            <el-input v-show="false" placeholder="职位"></el-input>
                            <span>工头</span>
                        </el-form-item>
                        <el-form-item label="邮箱地址：">
                            <el-input v-show="false" placeholder="邮箱地址"></el-input>
                            <span>pengyuyan@qq.com</span>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">修改资料</el-button>
                    <el-checkbox v-model="checked" style="margin-top:30px;" disabled>团队负责人</el-checkbox>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form :model="ruleForm" :label-position="right" label-width="160px">
                        <el-form-item label="入职时间：" required prop="date">
                            <el-date-picker v-show="false" v-model="value1" type="date" placeholder="选择入职日期" align="right" :picker-options="pickerOptions1">
                            </el-date-picker>
                            <span>2018-06-06</span>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="10" offset="4">
                    <el-switch v-model="value3" active-text="发送随机初始密码到用户手机">
                    </el-switch>
                </el-col>
            </el-row> -->
            <div v-show="false" slot="footer" class="dialog-footer">
                <el-button @click="dialogEmployeeDetailsVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogEmployeeDetailsVisible = false">提交</el-button>
            </div>
        </el-dialog>
        <!--弹出框 员工详情-->
    </section>
</template>

<script>
    import {
        parkUserList,
        addParkUser,
        deleteUser,
        parkInfoTreeList
    } from '../../api/api'
    export default {
        data() {
            return {

                right: 'right',
                page: 1,
                pagesize: 7,
                departmentName: '',
                parkUserList: '', // 员工列表
                parkUserListTotal: 0, // 员工总数
                parkUserListLoading: false, // 员工列表loading控件
                parkUserListFilters: { //员工列表筛选
                    nameOrPhone: '',
                    male: false,
                    female: false,
                    headOfTheTeam: false
                },
                parkInfoTreeList: [], // 组织结构数据
                departmentTreeData: [],
                parkInfoTreeListLoading: false, // 组织结构loading控件
                // 左侧树形组件规则
                parkInfoTreeListProps: {
                    children: "children",
                    label: "name"
                },
                // 弹框
                addParkUserFormVisible: false,
                addParkUserForm: {
                    name: "",
                    phone: "",
                    addInfo: {
                        gender: "",
                        position: "",
                        email: "",
                        isManager: false,
                        hiredate: "",
                    },
                    department: "",
                    post: "",
                    enterpriseId: "",
                    isSendPwd: false,
                },
                dialogEmployeeDetailsVisible: false,
                // 时间组件
                pickerOptions1: {
                    shortcuts: [{
                        text: "今天",
                        onClick(picker) {
                            picker.$emit("pick", new Date());
                        }
                    }]
                },
                value1: "",
                // 表单验证规则
                addParkUserFormRules: {
                    name: [{
                        required: true,
                        message: "请输入正确姓名",
                        trigger: "blur",
                        pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
                    }],
                    sex: [{
                        required: true,
                        message: "请选择员工性别",
                        trigger: "change"
                    }],
                    addInfo: {
                        position: [{
                            required: true,
                            message: "请填写员工职位",
                            trigger: "blur"
                        }],
                        email: [{
                            required: true,
                            message: "请填写员工邮箱",
                            trigger: "blur"
                        }],
                        hiredate: [{
                            type: "date",
                            required: true,
                            message: "请选择日期",
                            trigger: "change"
                        }],
                    },
                    department: [{
                        required: true,
                        message: "请选择所属部门",
                        trigger: "change"
                    }],
                    phone: [{
                        required: true,
                        message: "请输入正确的电话号码",
                        trigger: "blur",
                        pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
                    }],
                    // options: [{
                    //     value: 'zhinan',
                    //     label: '指南',
                    //     children: [{
                    //         value: 'shejiyuanze',
                    //         label: '设计原则',
                    //         children: [{
                    //             value: 'yizhi',
                    //             label: '一致'
                    //         }, {
                    //             value: 'fankui',
                    //             label: '反馈'
                    //         }, {
                    //             value: 'xiaolv',
                    //             label: '效率'
                    //         }, {
                    //             value: 'kekong',
                    //             label: '可控'
                    //         }]
                    //     }, {
                    //         value: 'daohang',
                    //         label: '导航',
                    //         children: [{
                    //             value: 'cexiangdaohang',
                    //             label: '侧向导航'
                    //         }, {
                    //             value: 'dingbudaohang',
                    //             label: '顶部导航'
                    //         }]
                    //     }]
                    // }, {
                    //     value: 'zujian',
                    //     label: '组件',
                    //     children: [{
                    //         value: 'basic',
                    //         label: 'Basic',
                    //         children: [{
                    //             value: 'layout',
                    //             label: 'Layout 布局'
                    //         }, {
                    //             value: 'color',
                    //             label: 'Color 色彩'
                    //         }, {
                    //             value: 'typography',
                    //             label: 'Typography 字体'
                    //         }, {
                    //             value: 'icon',
                    //             label: 'Icon 图标'
                    //         }, {
                    //             value: 'button',
                    //             label: 'Button 按钮'
                    //         }]
                    //     }, {
                    //         value: 'form',
                    //         label: 'Form',
                    //         children: [{
                    //             value: 'radio',
                    //             label: 'Radio 单选框'
                    //         }, {
                    //             value: 'checkbox',
                    //             label: 'Checkbox 多选框'
                    //         }, {
                    //             value: 'input',
                    //             label: 'Input 输入框'
                    //         }, {
                    //             value: 'input-number',
                    //             label: 'InputNumber 计数器'
                    //         }, {
                    //             value: 'select',
                    //             label: 'Select 选择器'
                    //         }, {
                    //             value: 'cascader',
                    //             label: 'Cascader 级联选择器'
                    //         }, {
                    //             value: 'switch',
                    //             label: 'Switch 开关'
                    //         }, {
                    //             value: 'slider',
                    //             label: 'Slider 滑块'
                    //         }, {
                    //             value: 'time-picker',
                    //             label: 'TimePicker 时间选择器'
                    //         }, {
                    //             value: 'date-picker',
                    //             label: 'DatePicker 日期选择器'
                    //         }, {
                    //             value: 'datetime-picker',
                    //             label: 'DateTimePicker 日期时间选择器'
                    //         }, {
                    //             value: 'upload',
                    //             label: 'Upload 上传'
                    //         }, {
                    //             value: 'rate',
                    //             label: 'Rate 评分'
                    //         }, {
                    //             value: 'form',
                    //             label: 'Form 表单'
                    //         }]
                    //     }, {
                    //         value: 'data',
                    //         label: 'Data',
                    //         children: [{
                    //             value: 'table',
                    //             label: 'Table 表格'
                    //         }, {
                    //             value: 'tag',
                    //             label: 'Tag 标签'
                    //         }, {
                    //             value: 'progress',
                    //             label: 'Progress 进度条'
                    //         }, {
                    //             value: 'tree',
                    //             label: 'Tree 树形控件'
                    //         }, {
                    //             value: 'pagination',
                    //             label: 'Pagination 分页'
                    //         }, {
                    //             value: 'badge',
                    //             label: 'Badge 标记'
                    //         }]
                    //     }, {
                    //         value: 'notice',
                    //         label: 'Notice',
                    //         children: [{
                    //             value: 'alert',
                    //             label: 'Alert 警告'
                    //         }, {
                    //             value: 'loading',
                    //             label: 'Loading 加载'
                    //         }, {
                    //             value: 'message',
                    //             label: 'Message 消息提示'
                    //         }, {
                    //             value: 'message-box',
                    //             label: 'MessageBox 弹框'
                    //         }, {
                    //             value: 'notification',
                    //             label: 'Notification 通知'
                    //         }]
                    //     }, {
                    //         value: 'navigation',
                    //         label: 'Navigation',
                    //         children: [{
                    //             value: 'menu',
                    //             label: 'NavMenu 导航菜单'
                    //         }, {
                    //             value: 'tabs',
                    //             label: 'Tabs 标签页'
                    //         }, {
                    //             value: 'breadcrumb',
                    //             label: 'Breadcrumb 面包屑'
                    //         }, {
                    //             value: 'dropdown',
                    //             label: 'Dropdown 下拉菜单'
                    //         }, {
                    //             value: 'steps',
                    //             label: 'Steps 步骤条'
                    //         }]
                    //     }, {
                    //         value: 'others',
                    //         label: 'Others',
                    //         children: [{
                    //             value: 'dialog',
                    //             label: 'Dialog 对话框'
                    //         }, {
                    //             value: 'tooltip',
                    //             label: 'Tooltip 文字提示'
                    //         }, {
                    //             value: 'popover',
                    //             label: 'Popover 弹出框'
                    //         }, {
                    //             value: 'card',
                    //             label: 'Card 卡片'
                    //         }, {
                    //             value: 'carousel',
                    //             label: 'Carousel 走马灯'
                    //         }, {
                    //             value: 'collapse',
                    //             label: 'Collapse 折叠面板'
                    //         }]
                    //     }]
                    // }, {
                    //     value: 'ziyuan',
                    //     label: '资源',
                    //     children: [{
                    //         value: 'axure',
                    //         label: 'Axure Components'
                    //     }, {
                    //         value: 'sketch',
                    //         label: 'Sketch Templates'
                    //     }, {
                    //         value: 'jiaohu',
                    //         label: '组件交互文档'
                    //     }]
                    // }]
                }
            };
        },
        methods: {
            // 获取部门组织结构
            getParkInfoTreeList() {
                this.parkInfoTreeListLoading = true;
                this.$get(parkInfoTreeList + '组织架构')
                    .then((res) => {
                        this.parkInfoTreeList = res;
                        console.log(JSON.stringify(res));
                        // console.log(this.parkInfoTreeList);
                        this.parkInfoTreeListLoading = false;
                        // console.log(this.departmentTreeData);
                        // console.log(res[0]);
                        this.departmentTreeData = this.getDepartmentTreeData(this.departmentTreeData, res[0]);
                        // console.log(this.departmentTreeData);
                    })
            },
            //获取员工列表
            getParkUserList(url, headOfTheTeam) {
                this.parkUserListLoading = true;
                this.$get(url)
                    .then((res) => {
                        let data = [];
                        if (headOfTheTeam) {
                            for (let value of res) {
                                value.addInfo.isManager === 1 ? data.push(value) : '';
                            }

                        } else {
                            data = res;
                        }
                        this.parkUserList = data;
                        // console.log(data);
                        // console.log(this.parkUserList);
                        this.parkUserListTotal = this.parkUserList.length > 0 ? this.parkUserList.length :
                            1;
                        this.parkUserListLoading = false;
                    })
            },

            //删除员工
            parkUserDel: function (index, row) {
                this.$confirm('删除员工将同时取消该员工的物管服务APP登录权限，是否删除？', '注意', {
                    type: 'warning'
                }).then(() => {
                    this.parkUserListLoading = true;
                    //NProgress.start();
                    let para = {
                        id: row.id
                    };
                    let self = this;
                    this.$del(deleteUser + para.id)
                        .then(function (response) {
                            self.parkUserListLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getParkUserList();
                        });
                }).catch(() => {

                });
            },
            // 查询公司或用户信息模糊查询
            getQueryParkUserList() {
                let url = parkUserList;
                let nameOrPhone = this.parkUserListFilters.nameOrPhone;
                let male = this.parkUserListFilters.male;
                let female = this.parkUserListFilters.female;
                let headOfTheTeam = this.parkUserListFilters.headOfTheTeam;
                url = nameOrPhone === '' ? url + '' : url + '&nameOrPhone=' + nameOrPhone;
                url = male === false ? (female === false ? url + '' : url + '&gender=女') : (female === true ? url + '' :
                    url + '&gender=男');
                this.getParkUserList(url, headOfTheTeam);
            },
            handleNodeClick(data) {
                // this.parkInfoTreeList;
                console.log(data);
                if (data.parentId.id === '') {
                    this.departmentName = '';
                } else {
                    this.departmentName = data.name;
                }
                let departmentId = data.id;
                // console.log(name, parentId);
                this.getParkUserList(parkUserList);
            },
            // getDepartmentTreeData(departmentTreeData, parkInfoTreeList) {
            //     let data = {};
            //     data.label = parkInfoTreeList.name;
            //     data.value = parkInfoTreeList.id;
            //     if (parkInfoTreeList.children.length === 0) {
            //         departmentTreeData.push(data);
            //     } else {
            //         data.children = [];
            //         for (let i = 0; i < parkInfoTreeList.children.length; i++) {
            //             let deepData = {};
            //             deepData.label = parkInfoTreeList.children[i].name;
            //             deepData.value = parkInfoTreeList.children[i].id;
            //             if (parkInfoTreeList.children[i].children.length === 0) {
            //                 data.children.push(deepData);
            //             } else {
            //                 deepData.label = parkInfoTreeList.children[i].name;
            //                 deepData.value = parkInfoTreeList.children[i].id;
            //                 deepData.children = [];
            //                 let returnData = this.getDepartmentTreeData(deepData.children, parkInfoTreeList.children[i]);
            //                 data.children.push(returnData);
            //             }
            //         }
            //         departmentTreeData.push(data);
            //     }
            //     console.log(JSON.stringify(departmentTreeData));
            //     return departmentTreeData;
            // },
            getDepartmentTreeData(departmentTreeData, parkInfoTreeList) {
                let data = {};
                data.label = parkInfoTreeList.name;
                data.value = parkInfoTreeList.id;
                if (parkInfoTreeList.children.length === 0) {
                    departmentTreeData.push(data);
                } else {
                    data.children = [];
                    for (let i = 0; i < parkInfoTreeList.children.length; i++) {
                        let deepData = {};
                        deepData.label = parkInfoTreeList.children[i].name;
                        deepData.value = parkInfoTreeList.children[i].id;
                        if (parkInfoTreeList.children[i].children.length === 0) {
                            data.children.push(deepData);
                        } else {
                            deepData.children = [];
                            let returnData = this.getDepartmentTreeData(deepData.children, parkInfoTreeList.children[i]);
                            data.children.push(returnData);
                        }
                    }
                }
                departmentTreeData.push(data);
                console.log(JSON.stringify(departmentTreeData));
                return departmentTreeData;
            },
            // queryParentTreeData(parkInfoTreeList, parentId) {
            //     let name = '';
            //     let parentId = parentId;
            //     for (let value in parkInfoTreeList) {
            //         if (parkInfoTreeList[value].parentId === parentId) {
            //             name = parkInfoTreeList[value].name + name;
            //             parentId = parkInfoTreeList[value].parentId;
            //         }
            //     }
            //     return name;
            // },
            sizeChange(val) {
                this.pagesize = val;
            },
            currentChange(val) {
                this.page = val;
                this.getQueryParkUserList();
            },
        },
        mounted() {
            this.getParkUserList(parkUserList);
            this.getParkInfoTreeList();

        }
    };
</script>

<style lang="scss">
</style>