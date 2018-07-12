<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-form>
                    <el-form-item>
                        <el-input placeholder="输入部门关键字自动筛选"
                            v-model="keyword"></el-input>
                    </el-form-item>
                </el-form>
                <el-card shadow="never"
                    style="height:750px;overflow-y: scroll;"
                    v-loading="parkInfoTreeListLoading">
                    <el-tree class="filter-tree"
                        :data="parkInfoTreeList"
                        :props="parkInfoTreeListProps"
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode"
                        node-key="id"
                        highlight-current
                        default-expand-all
                        :render-content="renderContent"
                        :expand-on-click-node="false"
                        :default-expanded-keys="defaultExpandKeys"
                        ref="tree"></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <!--工具条-->
                <div style="line-height: 40px;padding-left: 50px;color: #606266;margin-bottom: 22px;">
                    松湖智谷管理公司
                    <span>{{currentDepartmentalOrganizational.name}}</span>
                </div>
                <el-card shadow="never">
                    <el-row type="flex"
                        justify="space-between">
                        <el-col :span="12">
                            <el-form :inline="true"
                                class="demo-form-inline"
                                :label-position="'right'"
                                label-width="120px">
                                <el-form-item label="部门级别：">
                                    <span>{{currentDepartmentalOrganizational.level}} 级</span>
                                </el-form-item>
                                <el-form-item label="部门名称：">
                                    <el-input placeholder="请选择左侧部门结构"
                                        v-model="currentDepartmentalOrganizational.name"
                                        style="width:300px;"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary"
                                @click="saveDepartmantChanges()">保存当前修改</el-button>
                            <el-button type="danger"
                                @click="delParkTreeUrl()">删除当前部门</el-button>
                        </el-col>
                    </el-row>
                    <el-card shadow="never">
                        <div style=" padding-left: 20px;color: #606266;">
                            办公区域关联
                        </div>
                        <el-card shadow="never"
                            style="margin-top:10px;">
                            <el-table :data="parkInfoTreeAddZoneInfoData"
                                style="width: 100%"
                                height="250"
                                v-loading="parkInfoTreeAddZoneInfoLoading">
                                <el-table-column label="区域">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row[0].name">{{scope.row[0].name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="楼栋">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row[1].name">{{scope.row[1].name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="层">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row[2].name">{{scope.row[2].name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="房号">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row[3].name">{{scope.row[3].name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="danger"
                                            size="small"
                                            @click="parkInfoZoneDel(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                        <el-form :inline="true"
                            class="demo-form-inline"
                            style="margin-top:20px;">
                            <el-cascader placeholder="请选择办公区域关联"
                                filterable
                                clearable
                                style="width: 450px;"
                                :separator="'-'"
                                :options="departmentAreaList"
                                v-model="selectedOptions"
                                :props="departmentAreaListProps">
                            </el-cascader>
                            <el-button type="primary"
                                @click="addOfficeArea()">新增</el-button>
                        </el-form>
                    </el-card>
                    <el-card shadow="never"
                        style="margin-top:20px;">
                        <div style=" padding-left: 20px;color: #606266;">
                            管理端APP操作权限
                        </div>
                        <el-card shadow="never"
                            style="margin-top:10px;">
                            <el-checkbox-group v-model="currentDepartmentalOrganizational.addInfo.features"
                                style="margin-bottom:20px;">
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="门禁"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="打卡"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="排班"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="报修"></el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="currentDepartmentalOrganizational.addInfo.features"
                                style="margin-bottom:20px;">
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="入驻管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="投建管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="企业之家"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="物业费"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="会议室管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="共享管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="公寓管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="商家联盟"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="租赁合同"></el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="currentDepartmentalOrganizational.addInfo.features">
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="物业监控"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="维修管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="装修管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="放行管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="停车管理"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="设备巡检"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="抄表"></el-checkbox>
                                <el-checkbox style="width: 200px;margin: 5px !important;"
                                    border
                                    label="巡更"></el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                    </el-card>

                </el-card>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import {
    parkInfoTreeList,
    parkInfoTreeAddZoneInfo,
    addOrUpdateParkInfoTree,
    findUserNumByDepartmentId,
    deleteParkInfoTree
} from '../../api/api';
import TreeRender from '../../components/tree-render';
export default {
    data() {
        return {
            keyword: '',
            parkInfoTreeListLoading: false,
            parkInfoTreeList: [],
            parkInfoTreeListProps: {
                children: 'children',
                label: 'name'
            },
            departmentAreaList: '',
            departmentAreaListProps: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
            parkInfoTreeAddZoneInfoLoading: false,
            selectedOptions: '',
            options: '',
            checkList: '',
            parkInfoTreeAddZoneInfoData: [],
            newArea: [],
            value: '',
            currentlySelectedNode: '',
            currentDepartmentalOrganizational: {
                id: '',
                level: '',
                name: '',
                parentId: '',
                parkId: '',
                addInfo: {
                    features: [],
                    zones: []
                }
            }
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
            this.currentlySelectedNode = data.id;
            this.currentDepartmentalOrganizational.addInfo.features =
                typeof data.addInfo === 'undefined'
                    ? []
                    : data.addInfo.features;
            if (data.parentId === '') {
                this.currentDepartmentalOrganizational.name = '';
                this.currentDepartmentalOrganizational.level = 1;
            } else {
                this.currentDepartmentalOrganizational.id = data.id;
                this.currentDepartmentalOrganizational.parentId = data.parentId;
                this.currentDepartmentalOrganizational.name = data.name;
                this.currentDepartmentalOrganizational.level = data.level;
                this.getParkInfoTreeAddZoneInfo(this.currentlySelectedNode);
            }
        },
        // 获取部门组织结构
        getParkInfoTreeList() {
            this.parkInfoTreeListLoading = true;
            this.$get(parkInfoTreeList + '组织架构').then(res => {
                this.parkInfoTreeList = res;
                this.parkInfoTreeListLoading = false;
            });
        },
        // 获取部门区域列表
        getDepartmentAreaList() {
            this.$get(parkInfoTreeList + '区域').then(res => {
                this.departmentAreaList = this.killChildren(res);
            });
        },
        // 获取当前部门的办公区域
        getParkInfoTreeAddZoneInfo(id) {
            this.parkInfoTreeAddZoneInfoData = [];
            this.parkInfoTreeAddZoneInfoLoading = true;
            this.$get(parkInfoTreeAddZoneInfo + id).then(res => {
                for (let i in res) {
                    this.parkInfoTreeAddZoneInfoData.push(res[i]);
                }
                this.parkInfoTreeAddZoneInfoLoading = false;
                console.log(this.parkInfoTreeAddZoneInfoData);
            });
        },
        //删除当前部门的办公区域
        parkInfoZoneDel: function(index, row) {
            this.parkInfoTreeAddZoneInfoData.splice(index, 1);
        },
        // 保存当前部门信息
        saveDepartmantChanges() {
            this.currentDepartmentalOrganizational.parkId = localStorage.getItem(
                'parkId'
            );
            let zones = this.parkInfoTreeAddZoneInfoData;
            for (let i = 0; i < zones.length; i++) {
                let index = zones[i].length - 1;
                this.currentDepartmentalOrganizational.addInfo.zones.push(
                    zones[i][index].id
                );
            }
            let data = this.currentDepartmentalOrganizational;
            console.log(JSON.stringify(data));
            this.$post(addOrUpdateParkInfoTree, data).then(res => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.getParkInfoTreeList();
            });
        },
        // 新增办公区域
        addOfficeArea() {
            this.newArea = [];
            let data = this.selectedOptions;
            let areaList = this.departmentAreaList;
            this.seachAreaName(data, areaList, 0);
            this.parkInfoTreeAddZoneInfoData.push(this.newArea);
        },
        // 新增节点
        renderContent(h, { node, data, store }) {
            let that = this;
            return h(TreeRender, {
                props: {
                    DATA: data,
                    NODE: node,
                    STORE: store,
                    maxexpandId: that.non_maxexpandId
                },
                on: {
                    nodeAdd: (s, d, n) => that.handleAdd(s, d, n)
                    // nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
                    // nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
                }
            });
        },
        // handleAddTop() {
        //     this.dataTree.push({
        //         id: ++this.maxexpandId,
        //         name: '新增节点',
        //         pid: '',
        //         // isEdit: false,
        //         children: []
        //     })
        // },
        // 增加节点
        handleAdd(s, d, n) {
            console.log(s, d, n);
            if (n.level >= 3) {
                this.$message.error('最多只支持三级！');
                return false;
            }
            //添加数据
            d.children.push({
                id: ++this.maxexpandId,
                name: '新增节点',
                parentId: d.id,
                level: d.level + 1,
                addInfo: {
                    features: [],
                    zones: []
                },
                children: []
            });
            console.log(d);
            let datas = {
                parkId: localStorage.getItem('parkId'),
                level: d.level + 1,
                parentId: d.id,
                name: '新增部门',
                type: '组织架构',
                addInfo: {
                    features: [],
                    zones: []
                }
            };
            console.log(datas);
            this.$post(addOrUpdateParkInfoTree, datas).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.getParkInfoTreeList();
            });
            // 展开节点
            if (!n.expanded) {
                n.expanded = true;
            }
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
        // 删除当前部门
        delParkTreeUrl() {
            this.$get(
                findUserNumByDepartmentId +
                    this.currentDepartmentalOrganizational.id
            )
                .then(res => {
                    if (res) console.log(res);
                    this.$confirm(
                        `该部门内包括${res}位员工。删除该部门将清除员工的部门信息！确定删除？`,
                        '警告！',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error',
                            center: true
                        }
                    )
                        .then(() => {
                            this.$del(
                                deleteParkInfoTree +
                                    this.currentDepartmentalOrganizational.id
                            ).then(response => {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.currentDepartmentalOrganizational = {
                                    id: '',
                                    level: '',
                                    name: '',
                                    parentId: '',
                                    parkId: '',
                                    addInfo: {
                                        features: [],
                                        zones: []
                                    }
                                };
                                this.getParkInfoTreeList();
                            });
                        })
                        .catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    mounted() {
        this.getParkInfoTreeList();
        this.getDepartmentAreaList();
    }
};
</script>