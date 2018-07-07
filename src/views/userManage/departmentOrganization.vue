<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="输入部门关键字自动筛选" v-model="keyword"></el-input>
                    </el-form-item>
                </el-form>
                <el-card shadow="never" style="height:750px;overflow-y: scroll;" v-loading="parkInfoTreeListLoading">
                    <el-tree class="filter-tree" :data="parkInfoTreeList" :props="parkInfoTreeListProps" @node-click="handleNodeClick" :filter-node-method="filterNode"
                        node-key="id" highlight-current default-expand-all :expand-on-click-node="false" ref="tree"></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <!--工具条-->
                <div style="line-height: 40px;padding-left: 50px;color: #606266;margin-bottom: 22px;">
                    松湖智谷管理公司
                    <span>{{departmentName}}</span>
                </div>
                <el-card shadow="never">
                    <el-form :inline="true" class="demo-form-inline" :label-position="'right'" label-width="120px">
                        <el-form-item label="部门级别：">
                            <span>{{departmentLevel}}级</span>
                        </el-form-item>
                        <el-form-item label="部门名称：">
                            <el-input placeholder="部门名称" v-model="departmentName" style="width:300px;"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-card shadow="never">
                        <div style=" padding-left: 20px;color: #606266;">
                            办公区域关联
                        </div>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-table :data="parkInfoTreeAddZoneInfoData" style="width: 100%" height="250" v-loading="parkInfoTreeAddZoneInfoLoading">
                                <el-table-column label="区域">
                                    <template slot-scope="scope">
                                        {{scope.row[0].name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="楼栋">
                                    <template slot-scope="scope">
                                        {{scope.row[1].name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="层">
                                    <template slot-scope="scope">
                                        {{scope.row[2].name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="房号">
                                    <template slot-scope="scope">
                                        {{scope.row[3].name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="danger" size="small" @click="parkUserDel(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                        <el-form :inline="true" class="demo-form-inline" style="margin-top:20px;">
                            <el-cascader style="width: 450px;" :separator="'-'" :options="departmentAreaList" v-model="selectedOptions" @change="handleChange"
                                :props="departmentAreaListProps">
                            </el-cascader>
                            <el-button type="primary">新增</el-button>
                        </el-form>
                    </el-card>
                    <el-card shadow="never" style="margin-top:20px;">
                        <div style=" padding-left: 20px;color: #606266;">
                            管理端APP操作权限
                        </div>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-row class="row-bg" style="margin:10px 0;">基本权限</el-row>
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="门禁"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="打卡"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="排班"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="报修"></el-checkbox>
                            </el-checkbox-group>
                            <el-row class="row-bg" style="margin:10px 0;">基本权限</el-row>
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="入驻管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="投建管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="企业之家"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="物业费"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="会议室管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="共享管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="公寓管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="商家联盟"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="租赁合同"></el-checkbox>
                            </el-checkbox-group>
                            <el-row class="row-bg" style="margin:10px 0;">基本权限</el-row>
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="物业监控"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="维修管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="装修管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="放行管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="停车管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="设备巡检"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="抄表"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;" border label="巡更"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                    </el-card>
                    <el-row class="row-bg" style="margin-top:20px;">
                        <el-button type="danger">删除部门</el-button>
                        <el-button type="primary">保存修改</el-button>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import {
        parkInfoTreeList,
        parkInfoTreeAddZoneInfo,
        delParkTreeUrl
    } from '../../api/api'
    export default {
        data() {
            return {
                keyword: '',
                departmentName: '',
                departmentLevel: '1',
                parkInfoTreeListLoading: false,
                parkInfoTreeList: [],
                parkInfoTreeListProps: {
                    children: "children",
                    label: "name"
                },
                departmentAreaList: '',
                departmentAreaListProps: {
                    value: 'id',
                    children: 'children',
                    label: 'name'
                },
                parkInfoTreeAddZoneInfoLoading: false,
                parkInfoTreeList: '',
                selectedOptions: '',
                options: '',
                checkList: '',
                parkInfoTreeAddZoneInfoData: '',
                value: ''
            };
        },
        watch: {
            keyword(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            // 树形结构数据筛选
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
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
            // 点击树形结构查询员工列表
            handleNodeClick(data) {
                if (data.parentId === '') {
                    this.departmentName = '';
                    this.departmentLevel = '1';
                } else {
                    this.departmentName = data.name;
                    this.departmentLevel = data.level;
                    this.getParkInfoTreeAddZoneInfo(data.id);
                }
            },
            // 获取部门组织结构
            getParkInfoTreeList() {
                this.parkInfoTreeListLoading = true;
                this.$get(parkInfoTreeList + '组织架构')
                    .then((res) => {
                        this.parkInfoTreeList = res;
                        console.log(this.parkInfoTreeList);
                        this.parkInfoTreeListLoading = false;
                    })
            },
            // 获取部门区域列表
            getDepartmentAreaList() {
                this.$get(parkInfoTreeList + '区域')
                    .then((res) => {
                        this.departmentAreaList = this.killChildren(res);
                        console.log(this.departmentAreaList);
                    })
            },
            // 获取当前部门的办公区域
            getParkInfoTreeAddZoneInfo(id) {
                this.parkInfoTreeAddZoneInfoData = '';
                this.parkInfoTreeAddZoneInfoLoading = true;
                this.$get(parkInfoTreeAddZoneInfo + id)
                    .then((res) => {
                        this.parkInfoTreeAddZoneInfoData = res;
                        this.parkInfoTreeAddZoneInfoLoading = false;
                        console.log(this.parkInfoTreeAddZoneInfoData);
                    })
            },
        },
        mounted() {
            this.getParkInfoTreeList();
            this.getDepartmentAreaList();
        }
    };
</script>