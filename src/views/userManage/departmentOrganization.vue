<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-input placeholder="输入部门关键字" v-model="filterText"></el-input>
                    </el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form>
                <el-card shadow="never" style="height:750px;overflow-y: scroll;">
                    <el-tree class="filter-tree" :data="parkInfoTreeList" :props="parkInfoTreeListProps" @node-click="handleNodeClick" :filter-node-method="filterNode"
                        default-expand-all></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <!--工具条-->
                <div style="line-height: 40px;padding-left: 50px;color: #606266;margin-bottom: 22px;">
                    松湖智谷管理公司 运营部 电商运营部
                </div>
                <el-card shadow="never">
                    <el-form :inline="true" class="demo-form-inline" :label-position="right" label-width="120px">
                        <el-form-item label="部门级别：">
                            <span>3级</span>
                        </el-form-item>
                        <el-form-item label="部门名称：">
                            <el-input placeholder="部门名称" value="电商运营部" style="width:300px;"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-card shadow="never">
                        <div style=" padding-left: 20px;color: #606266;">
                            办公区域关联
                        </div>
                        <el-card shadow="never" style="margin-top:10px;">
                            <el-table :data="tableData3" style="width: 100%" height="250">
                                <el-table-column prop="name" label="区域">
                                </el-table-column>
                                <el-table-column prop="province" label="楼栋">
                                </el-table-column>
                                <el-table-column prop="city" label="层">
                                </el-table-column>
                                <el-table-column prop="address" label="房号">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                                        <el-button type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                        <el-form :inline="true" class="demo-form-inline" style="margin-top:20px;">
                            <el-select v-model="value" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="value" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="value" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
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
        parkInfoTreeList
    } from '../../api/api'
    export default {
        data() {
            return {
                filterText: '',
                parkInfoTreeList: [],
                parkInfoTreeListProps: {
                    children: "children",
                    label: "name"
                },
                checked: true,
                options:'',
                value3: "",
                checkList: '',
                // 弹框
                dialogFormVisible: false,
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
                tableData3: [{
                        date: "2016-05-03",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-02",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-04",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-01",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-08",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-06",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    },
                    {
                        date: "2016-05-07",
                        name: "王小虎",
                        province: "上海",
                        city: "普陀区",
                        address: "上海市普陀区金沙江路 1518 弄",
                        zip: 200333
                    }
                ]
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                console.log(data);
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
        },
        mounted() {
            this.getParkInfoTreeList();
        }
    };
</script>