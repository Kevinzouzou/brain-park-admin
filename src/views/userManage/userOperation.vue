<template>
  <section>
    <!--工具条-->
    <el-row :gutter="24">
      <el-col :span="24" justify="center">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="addUserFormVisible = true">新增用户</el-button>
          </el-form-item>
          <el-form-item>
            <span>搜索条件：</span>
          </el-form-item>

          <el-form-item>
            <el-autocomplete popper-class="my-autocomplete" v-model="ParkStaffListFilters.enterpriseName" :fetch-suggestions="querySearch"
              placeholder="输入企业名称搜索" @select="handleSelect">
              <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-input v-model="ParkStaffListFilters.nameOrNickNameOrPhone" class="userinfo-search" placeholder="用户搜索，如姓名、昵称、手机" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getQueryParkStaffList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success">导出到表格</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">导入名单</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="parkStaffList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="ParkStaffListLoading"
      style="width: 100%;">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="name" label="姓名" sortable>
      </el-table-column>
      <el-table-column prop="userInfo.addInfo.nickName" label="昵称" sortable>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
      </el-table-column>
      <el-table-column prop="userInfo.addInfo.gender" label="性别">
      </el-table-column>
      <el-table-column prop="enterpriseInfo.name" label="所属企业" sortable>
      </el-table-column>
      <el-table-column prop="post" label="身份角色" sortable>
      </el-table-column>
      <el-table-column prop="userInfo.addInfo.lastLoginTime" label="最近登录时间">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="parkStaffEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="parkStaffDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-row :gutter="24">
      <el-col :span="24" class="toolbar">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
          layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="parkStaffListTotal" style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top:20px;">
      <el-col style="text-align:center;" :offset="2" :span="4">
        企业所有者：
        <span style="font-size:16px;font-weight:bold;">{{basicStatistics.ownerNum}}</span> 人
      </el-col>
      <el-col style="text-align:center;" :span="4">
        企业管理员：
        <span style="font-size:16px;font-weight:bold;">{{basicStatistics.managerNum}}</span> 人
      </el-col>
      <el-col style="text-align:center;" :span="4">
        员工：
        <span style="font-size:16px;font-weight:bold;">{{basicStatistics.staffNum}}</span> 人
      </el-col>
      <el-col style="text-align:center;" :span="6">
        用户总数：
        <span style="font-size:16px;font-weight:bold;">{{basicStatistics.allMun}}</span> 人
      </el-col>
    </el-row>
    <!--弹出框 新增用户-->
    <el-dialog title="新增用户" :visible.sync="addUserFormVisible">
      <el-row :gutter="20">
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserForm" :label-position="'right'" label-width="80px">
          <el-row :gutter="24">
            <el-col :offset="2" :span="8">
              <el-form-item label="姓名" required prop="name">
                <el-input v-model="addUserForm.name" placeholder="姓名"></el-input>
              </el-form-item>

              <el-form-item label="所属企业" required prop="enterpriseId">
                <el-select v-model="addUserForm.enterpriseId" filterable placeholder="请选择">
                  <el-option v-for="item in restaurants" :key="item.value" :label="item.value" :value="item.enterpriseId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="8">
              <el-form-item label="手机号码" required prop="phone">
                <el-input v-model="addUserForm.phone" placeholder="手机号码"></el-input>
              </el-form-item>
              <!-- <el-form-item label="性别：" required prop="gender">
                                <el-select v-model="addUserForm.gender">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item> -->
              <el-form-item label="员工身份" required prop="post">
                <el-select v-model="addUserForm.post" placeholder="请选择员工身份">
                  <el-option label="员工" value="员工"></el-option>
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="企业所有者" value="企业所有者"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button @click="resetForm('addUserForm')">重置</el-button>
        <el-button type="primary" @click="addParkStaff('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--弹出框 查看用户-->
    <el-dialog title="用户详情" :visible.sync="editUserFormVisible">
      <el-row :gutter="20">
        <el-col :span="5" :offset="1">
          <el-form :label-position="right" label-width="150px">
            <el-upload class="avatar-uploader" :action=imageUploadUrl :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="editUserInfoForm.userInfo.addInfo.avatarUrl" :src="editUserInfoForm.userInfo.addInfo.avatarUrl" class="avatar userImg">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form>
        </el-col>
        <el-row :gutter="24">
          <el-form :model="editUserInfoForm" :rules="editUserInfoFormRules" ref="editUserInfoForm" :label-position="'right'" label-width="100px">
            <el-col :span="8">
              <el-form-item label="姓名：" prop="name">
                <el-input placeholder="姓名" v-model="editUserInfoForm.name"></el-input>
              </el-form-item>

              <el-form-item label="所属企业：" prop="enterpriseId">
                <el-select v-model="editUserInfoForm.enterpriseId" filterable placeholder="请选择">
                  <el-option v-for="item in restaurants" :key="item.value" :label="item.value" :value="item.enterpriseId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码：" prop="phone">
                <el-input placeholder="手机号码" v-model="editUserInfoForm.phone"></el-input>
              </el-form-item>
              <!-- <el-form-item label="性别：" prop="userInfo.addInfo.gender">
                                <el-select placeholder="请选择性别" v-model="editUserInfoForm.userInfo.addInfo.gender">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item> -->
              <el-form-item label="身份角色：" prop="post">
                <el-select placeholder="请选择员工身份角色" v-model="editUserInfoForm.post">
                  <el-option label="员工" value="员工"></el-option>
                  <el-option label="管理员" value="管理员"></el-option>
                  <el-option label="企业所有者" value="企业所有者"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" :offset="6">
          <el-form :label-position="'right'" label-width="90px">
            <el-form-item label="昵称：">
              <span>{{editUserInfoForm.userInfo.addInfo.nickName}}</span>
            </el-form-item>
            <el-form-item label="注册时间：">
              <span>{{editUserInfoForm.userInfo.createTime}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form :label-position="'right'" label-width="110px">
            <el-form-item label="职业：">
              <span>{{editUserInfoForm.userInfo.addInfo.position}}</span>
            </el-form-item>
            <el-form-item label="最后登陆时间：">
              <span>{{editUserInfoForm.userInfo.addInfo.lastLoginTime}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyParkStaffEdit('editUserInfoForm')">确认修改</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import axios from "axios";
  import TreeRender from "../../components/tree-render";
  import {
    parkStaffList,
    addOrUpdateParkStaff,
    deleteStaff,
    settledEnterpriseList,
    uploadPic
  } from "../../api/api";
  export default {
    data() {
      return {
        right: "right",
        imageUploadUrl: "", //图片上传路径
        page: 1,
        pagesize: 7,
        ParkStaffListLoading: false,
        parkStaffList: [],
        parkStaffListTotal: 0,
        basicStatistics: {
          ownerNum: 0,
          managerNum: 0,
          staffNum: 0,
          allMun: 0
        },
        ParkStaffListFilters: {
          nameOrNickNameOrPhone: "",
          enterpriseName: ""
        },
        restaurants: [],
        addUserFormVisible: false,
        editUserFormVisible: false,
        addUserForm: {
          name: "",
          phone: "",
          post: "",
          enterpriseId: "",
          addInfo: {}
        },
        addUserFormRules: {
          name: [{
            required: true,
            message: "请输入正确姓名",
            trigger: "blur",
            pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
          }],
          phone: [{
            required: true,
            message: "请输入正确的电话号码",
            trigger: "blur",
            pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
          }],
          enterpriseId: [{
            required: true,
            message: "请选择所属企业",
            trigger: "change"
          }],
          post: [{
            required: true,
            message: "请选择员工身份",
            trigger: "change"
          }]
        },
        editUserInfoForm: {
          id: "",
          name: "",
          enterpriseInfo: {
            name: ""
          },
          userInfo: {
            createTime: "",
            addInfo: {
              gender: "",
              nickName: "",
              position: "",
              lastLoginTime: "",
              avatarUrl: ""
            }
          },
          phone: "",
          enterpriseId: "",
          post: ""
        },
        editUserInfoFormRules: {
          name: [{
            required: true,
            message: "请输入正确姓名",
            trigger: "blur",
            pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
          }],
          phone: [{
            required: true,
            message: "请输入正确的电话号码",
            trigger: "blur",
            pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
          }],
          enterpriseId: [{
            required: true,
            message: "请选择所属企业",
            trigger: "change"
          }],
          post: [{
            required: true,
            message: "请选择员工身份",
            trigger: "change"
          }]
        }
      };
    },
    methods: {
      // 拷贝对象
      deepCopy(object, beCopied) {
        for (let i in object) {
          if (Object.prototype.toString.call(beCopied[i]) === "[object String]") {
            object[i] = beCopied[i];
          } else if (Object.prototype.toString.call(beCopied[i]) === "[object Number]") {
            object[i] = beCopied[i];
          } else if (Object.prototype.toString.call(beCopied[i]) === "[object Object]") {
            this.deepCopy(object[i], beCopied[i]);
          } else if (Object.prototype.toString.call(beCopied[i]) === "[object Undefined]") {
            object[i] = object[i];
          } else if (Object.prototype.toString.call(beCopied[i]) === "[object Boolean]") {
            object[i] = beCopied[i];
          } else if (Object.prototype.toString.call(beCopied[i]) === "[object Array]") {
            object[i] = beCopied[i];
          } else {
            object[i] = "";
          }
        }
        return object;
      },
      // 获取用户列表
      getParkStaffList(url) {
        this.ParkStaffListLoading = true;
        this.$get(url).then(res => {
          this.parkStaffList = res.staffList;
          console.log(this.parkStaffList);
          this.parkStaffListTotal =
            this.parkStaffList.length > 0 ? this.parkStaffList.length : 0;
          this.ParkStaffListLoading = false;
          this.basicStatistics.ownerNum = res.ownerNum;
          this.basicStatistics.managerNum = res.managerNum;
          this.basicStatistics.staffNum = res.staffNum;
          this.basicStatistics.allMun = res.allMun;
        });
      },
      // 编辑用户窗口
      parkStaffEdit(index, row) {
        this.editUserInfoForm = this.deepCopy(this.editUserInfoForm, row);
        this.editUserFormVisible = true;
        console.log(this.editUserInfoForm);
      },
      // 修改用户
      modifyParkStaffEdit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {};
            data.id = this.editUserInfoForm.id;
            data.name = this.editUserInfoForm.name;
            data.phone = this.editUserInfoForm.phone;
            data.post = this.editUserInfoForm.post;
            data.enterpriseId = this.editUserInfoForm.enterpriseId;
            data.parkId = localStorage.getItem("parkId");
            this.$post(addOrUpdateParkStaff, data).then(res => {
              this.resetForm("editUserInfoForm");
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
                this.editUserFormVisible = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.getParkStaffList(parkStaffList);
              }
              console.log(res);
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 添加用户
      addParkStaff(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = this.addUserForm;
            data.parkId = localStorage.getItem("parkId");
            this.$post(addOrUpdateParkStaff, data).then(res => {
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
                this.getParkStaffList(parkStaffList);
                this.resetForm("addUserForm");
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 删除用户
      parkStaffDel: function (index, row) {
        this.$confirm("确认删除该用户吗?", "提示", {
            type: "warning"
          })
          .then(() => {
            this.ParkStaffListLoading = true;
            let para = {
              id: row.id
            };
            let self = this;
            this.$del(deleteStaff + para.id).then(function (response) {
              self.actListLoading = false;
              self.$message({
                message: "删除成功",
                type: "success"
              });
              self.getParkStaffList();
            });
          })
          .catch(() => {});
      },
      // 查询公司或用户信息模糊查询
      getQueryParkStaffList() {
        let url = parkStaffList;
        let nameOrNickNameOrPhone = this.ParkStaffListFilters
          .nameOrNickNameOrPhone;
        let enterpriseName = this.ParkStaffListFilters.enterpriseName;
        url =
          nameOrNickNameOrPhone === "" ?
          url + "" :
          url + "&nameOrNickNameOrPhone=" + nameOrNickNameOrPhone;
        url =
          enterpriseName === "" ?
          url + "" :
          url + "&enterpriseName=" + enterpriseName;
        this.getParkStaffList(url);
      },
      // 图片上传
      handleAvatarSuccess(res, file) {
        this.editUserInfoForm.addInfo.avatarUrl = res.responseList;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      pageSizeChange(val) {
        this.pagesize = val;
      },
      pageCurrentChange(val) {
        this.page = val;
        this.getQueryParkStaffList();
        // this.getParkStaffList(parkStaffList);
      },
      // 获取企业名单
      getSettledEnterpriseList() {
        this.$get(settledEnterpriseList).then(res => {
          let data = [];
          for (let value of res) {
            let singleEnterpriseData = {};
            singleEnterpriseData.value = value.name;
            singleEnterpriseData.address = value.address;
            singleEnterpriseData.enterpriseId = value.id;
            data.push(singleEnterpriseData);
          }
          this.restaurants = data;
        });
      },
      // 企业筛选
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ?
          restaurants.filter(this.createFilter(queryString)) :
          restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return restaurant => {
          return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
            0
          );
        };
      },

      handleSelect(item) {
        console.log(item);
      },
      handleIconClick(ev) {
        console.log(ev);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getParkStaffList(parkStaffList);
      this.getSettledEnterpriseList();
    }
  };
</script>

<style lang="scss">
  .el-input.userinfo-search {
    input {
      width: 230px;
    }
  }

  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }

  .userImg {
    width: 150px;
    height: 150px;
    border-radius: 6px;
  }

  .ml-3 {
    margin-left: 30px;
  }
</style>