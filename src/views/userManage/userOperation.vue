<template>
    <section>
        <!--工具条-->
        <el-col :span="24"
            justify="center">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary"
                        icon="el-icon-plus"
                        @click="dialogFormVisible = true">新增用户</el-button>
                </el-form-item>
                <el-form-item>
                    <span>搜索条件：</span>
                </el-form-item>
                <el-form-item>
                    <el-autocomplete popper-class="my-autocomplete"
                        v-model="state3"
                        :fetch-suggestions="querySearch"
                        placeholder="输入企业名称搜索"
                        prefix-icon="el-icon-search"
                        @select="handleSelect">
                        <i class="el-icon-edit el-input__icon"
                            slot="suffix"
                            @click="handleIconClick"></i>
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.value }}</div>
                            <span class="addr">{{ item.address }}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item>
                    <el-input class="userinfo-search"
                        placeholder="用户搜索，如姓名、昵称、手机"
                        prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success">导出到表格</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">导入名单</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table highlight-current-row
            v-loading="listLoading"
            style="width: 100%;">
            <el-table-column type="index"
                label="ID">
            </el-table-column>
            <el-table-column prop="title"
                label="姓名"
                sortable>
            </el-table-column>
            <el-table-column prop="nickname"
                label="昵称"
                sortable>
            </el-table-column>
            <el-table-column prop="telphone"
                label="手机号">
            </el-table-column>
            <el-table-column prop="nickname"
                label="性别">
            </el-table-column>
            <el-table-column prop="company"
                label="所属企业"
                sortable>
            </el-table-column>
            <el-table-column prop="role"
                label="身份角色"
                sortable>
            </el-table-column>
            <el-table-column prop="lastLoginTime"
                label="最近登录时间">
            </el-table-column>
            <el-table-column label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button type="info"
                        size="small">编辑</el-button>
                    <el-button type="danger"
                        size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24"
            class="toolbar">
            <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[7,8,10,20]"
                :page-size="pagesize"
                layout="total,sizes, prev, pager, next, jumper"
                :current-page="page"
                :total="circleTotal"
                style="float:right;">
            </el-pagination>
        </el-col>
        <!--弹出框 新增用户-->
        <el-dialog title="新增用户"
            :visible.sync="dialogFormVisible">
            <el-form :model="form"
                :label-position="right"
                label-width="160px">
                <el-form-item label="ID">
                    <span>123456</span>
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form :model="form"
                        :label-position="right"
                        label-width="160px">
                        <el-form-item label="姓名">
                            <el-input placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业">
                            <el-autocomplete popper-class="my-autocomplete"
                                v-model="state3"
                                :fetch-suggestions="querySearch"
                                placeholder="输入企业名称搜索"
                                @select="handleSelect">
                                <i class="el-icon-edit el-input__icon"
                                    slot="suffix"
                                    @click="handleIconClick"></i>
                                <template slot-scope="{ item }">
                                    <div class="name">{{ item.value }}</div>
                                    <span class="addr">{{ item.address }}</span>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <el-form :model="form"
                        :label-position="right"
                        label-width="160px">
                        <el-form-item label="手机号码">
                            <el-input placeholder="手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="员工身份"
                            prop="region">
                            <el-select placeholder="请选择活动区域">
                                <el-option label="员工"
                                    value="yungong"></el-option>
                                <el-option label="管理员"
                                    value="guanliyuan"></el-option>
                                <el-option label="企业所有者"
                                    value="boss"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!--弹出框 查看用户-->
        <el-dialog title="用户详情"
            :visible.sync="dialoguserVisible">
            <el-form :model="form"
                :label-position="right"
                label-width="160px">
                <el-form-item label="ID">
                    <span>123456</span>
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form :model="form"
                        :label-position="right"
                        label-width="160px">
                        <el-form-item label="姓名">
                            <el-input placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="所属企业">
                            <el-autocomplete popper-class="my-autocomplete"
                                v-model="state3"
                                :fetch-suggestions="querySearch"
                                placeholder="输入企业名称搜索"
                                @select="handleSelect">
                                <i class="el-icon-edit el-input__icon"
                                    slot="suffix"
                                    @click="handleIconClick"></i>
                                <template slot-scope="{ item }">
                                    <div class="name">{{ item.value }}</div>
                                    <span class="addr">{{ item.address }}</span>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <el-form :model="form"
                        :label-position="right"
                        label-width="160px">
                        <el-form-item label="手机号码">
                            <el-input placeholder="手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="员工身份"
                            prop="region">
                            <el-select placeholder="请选择活动区域">
                                <el-option label="员工"
                                    value="yungong"></el-option>
                                <el-option label="管理员"
                                    value="guanliyuan"></el-option>
                                <el-option label="企业所有者"
                                    value="boss"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            page: 1,
            pagesize: 7,
            restaurants: [],
            state3: "",
            dialogTableVisible: false,
            dialogFormVisible: false,
            dialoguserVisible:true,
            form: {
                name: "",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: ""
            },
            formLabelWidth: "120px"
        };
    },
    methods: {
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return restaurant => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        loadAll() {
            return [
                { value: "三全鲜食（北新泾店）", address: "长宁区新渔路144号" },
                {
                    value: "Hot honey 首尔炸鸡（仙霞路）",
                    address: "上海市长宁区淞虹路661号"
                },
                {
                    value: "新旺角茶餐厅",
                    address: "上海市普陀区真北路988号创邑金沙谷6号楼113"
                },
                { value: "泷千家(天山西路店)", address: "天山西路438号" },
                {
                    value: "胖仙女纸杯蛋糕（上海凌空店）",
                    address: "上海市长宁区金钟路968号1幢18号楼一层商铺18-101"
                },
                { value: "贡茶", address: "上海市长宁区金钟路633号" },
                {
                    value: "豪大大香鸡排超级奶爸",
                    address: "上海市嘉定区曹安公路曹安路1685号"
                },
                {
                    value: "茶芝兰（奶茶，手抓饼）",
                    address: "上海市普陀区同普路1435号"
                },
                { value: "十二泷町", address: "上海市北翟路1444弄81号B幢-107" },
                { value: "星移浓缩咖啡", address: "上海市嘉定区新郁路817号" },
                { value: "阿姨奶茶/豪大大", address: "嘉定区曹安路1611号" },
                {
                    value: "新麦甜四季甜品炸鸡",
                    address: "嘉定区曹安公路2383弄55号"
                },
                {
                    value: "Monica摩托主题咖啡店",
                    address: "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F"
                },
                {
                    value: "浮生若茶（凌空soho店）",
                    address: "上海长宁区金钟路968号9号楼地下一层"
                },
                {
                    value: "NONO JUICE  鲜榨果汁",
                    address: "上海市长宁区天山西路119号"
                },
                {
                    value: "CoCo都可(北新泾店）",
                    address: "上海市长宁区仙霞西路"
                },
                {
                    value: "快乐柠檬（神州智慧店）",
                    address: "上海市长宁区天山西路567号1层R117号店铺"
                },
                {
                    value: "Merci Paul cafe",
                    address: "上海市普陀区光复西路丹巴路28弄6号楼819"
                },
                {
                    value: "猫山王（西郊百联店）",
                    address: "上海市长宁区仙霞西路88号第一层G05-F01-1-306"
                },
                { value: "枪会山", address: "上海市普陀区棕榈路" },
                { value: "纵食", address: "元丰天山花园(东门) 双流路267号" },
                { value: "钱记", address: "上海市长宁区天山西路" },
                { value: "壹杯加", address: "上海市长宁区通协路" }
            ];
        },
        handleSelect(item) {
            console.log(item);
        },
        handleIconClick(ev) {
            console.log(ev);
        }
    },
    mounted() {
        this.restaurants = this.loadAll();
    }
};
</script>

<style lang="scss" >
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
</style>
