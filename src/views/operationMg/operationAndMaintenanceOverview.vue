<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content userProfile">
                            <div class="grid-title">设备概况</div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">{{EquipmentSituation.total}}</div>
                                    <div class="data-title">设备总数</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{EquipmentSituation.todayFaul}}</div>
                                    <div class="data-title">今日故障</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{EquipmentSituation.todayFaulRate}}%</div>
                                    <div class="data-title">今日故障率</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content equipmentStatusOverview">
                            <div class="grid-title">设备状态概况</div>
                            <div class="content">
                                <div id="equipmentStatusOverviewChart" style="height: 370px;width:100%;"></div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content deviceTypeDistribution">
                            <div class="grid-title">设备类型分布</div>
                            <div class="content">
                                <div id="deviceTypeDistributionChart" style="height:100%;width:100%;"></div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content equipmentFailureDataStatistics">
                            <div class="grid-title">设备故障数据统计</div>
                            <div class="content">
                                <div id="equipmentFailureDataStatisticsChart" style="height: 300px;width:100%;"></div>
                                <div style="padding:20px">
                                    <table class="tabel">
                                        <tr>
                                            <th>设备</th>
                                            <th v-for="item in tableData.time">{{item}}</th>
                                        </tr>
                                        <tr>
                                            <td>电梯</td>
                                            <td v-for="item in tableData.elevatorList">{{item}}</td>
                                        </tr>
                                        <tr>
                                            <td>空调</td>
                                            <td v-for="item in tableData.airConditionList">{{item}}</td>
                                        </tr>
                                        <tr>
                                            <td>消防设备</td>
                                            <td v-for="item in tableData.fireFightingList">{{item}}</td>
                                        </tr>
                                        <tr>
                                            <td>整体</td>
                                            <td v-for="item in tableData.entiretyList">{{item}}</td>
                                        </tr>
                                        <tr>
                                            <td>其他</td>
                                            <td v-for="item in tableData.otherList">{{item}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </section>
</template>
<script>
    const publicURL = require('../../../config/urlConfig');
    import echarts from 'echarts/lib/echarts';
    import axios from 'axios';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                url: '',
                EquipmentSituation: {
                    total: 0,
                    todayFaul: 0,
                    todayFaulRate: 0,
                },
                tableData: {
                    time: [],
                    otherList: [],
                    elevatorList: [],
                    airConditionList: [],
                    fireFightingList: [],
                    entiretyList: []
                },
                // 设备状态概况
                EquipmentStatusOverviewOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                    },
                    color: ['#7ED321', '#5b9bd5', '#F5A623', '#a5a5a5'],
                    legend: {
                        orient: 'horizontal',
                        left: 'center',
                        data: ['正常', '停用', '故障', '报废']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['0', '50%'],
                        center: ['50%', '60%'],
                        data: [{
                                value: 0,
                                name: '正常'
                            },
                            {
                                value: 0,
                                name: '停用'
                            },
                            {
                                value: 0,
                                name: '故障'
                            },
                            {
                                value: 0,
                                name: '报废'
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{b|{b}}\n{c|{c}} {per|{d}%}',
                                rich: {
                                    b: {
                                        color: '#9B9B9B',
                                        fontSize: 16,
                                        lineHeight: 24,
                                        align: 'left'
                                    },
                                    c: {
                                        color: '#9B9B9B',
                                        fontSize: 14,
                                        lineHeight: 24,
                                        align: 'left'
                                    },
                                    per: {
                                        color: '#9B9B9B',
                                        fontSize: 14,
                                        padding: [2, 4],
                                        align: 'left'
                                    }
                                }
                            }
                        },
                    }]
                },
                // 设备类型分布
                deviceTypeDistributionOption: {
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontWeight: 'bolder',
                                    fontSize: '12',
                                    fontFamily: '微软雅黑'
                                },
                                position: 'top'
                            },
                            color: function (params) {
                                var colorList = [
                                    '#ffc000', '#ed7d31', '#e65100', '#455a64', '#689f38'
                                ];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        top: '10%',
                        left: '5%',
                        right: '5%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['电梯', '空调', '消防设备', '其他'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '资源数目',
                        type: 'bar',
                        barWidth: '60%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: [146, 4567, 6789, 1245]
                    }]
                },
                equipmentFailureDataStatisticsOption: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['电梯', '空调', '消防设备', '整体', '其他']
                    },
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['三月', '四月', '五月', '六月', '七月', '八月']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                            name: '电梯',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '空调',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '消防设备',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '整体',
                            type: 'line',
                            stack: '总量',
                            data: []
                        }, {
                            name: '其他',
                            type: 'line',
                            stack: '总量',
                            data: []
                        }
                    ]
                }
            }
        },
        methods: {
            // 设备概况
            getEquipmentSituation() {
                this.$get(this.url + 'equipmentSituation').then(res => {
                    this.EquipmentSituation = publicFunction.deepCopy(this.EquipmentSituation, res);
                })
            },
            // 设备类型分布
            getEquipmentTypeDistribution() {
                this.$get(this.url + 'equipmentTypeDistribution').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.equipmentTypeList.length; i++) {
                        xAxisData.push(res.equipmentTypeList[i].type);
                        seriesData.push(res.equipmentTypeList[i].count);
                    }
                    this.deviceTypeDistributionOption.xAxis[0].data = xAxisData;
                    this.deviceTypeDistributionOption.series[0].data = seriesData;
                    let deviceTypeDistributionChart = echarts.init(document.getElementById(
                        'deviceTypeDistributionChart'));
                    deviceTypeDistributionChart.setOption(this.deviceTypeDistributionOption);
                    window.addEventListener("resize", deviceTypeDistributionChart.resize);
                })
            },
            // 设备状态概况
            getEquipmentStateSituation() {
                this.$get(this.url + 'equipmentStateSituation').then(res => {
                    this.EquipmentStatusOverviewOption.series[0].data = [{
                            value: res.normalEquipment,
                            name: '正常'
                        },
                        {
                            value: res.disableEquipment,
                            name: '停用'
                        },
                        {
                            value: res.faultEquipment,
                            name: '故障'
                        },
                        {
                            value: res.scrapEquipment,
                            name: '报废'
                        }
                    ];
                    let equipmentStatusOverviewChart = echarts.init(document.getElementById(
                        'equipmentStatusOverviewChart'));
                    equipmentStatusOverviewChart.setOption(this.EquipmentStatusOverviewOption);
                    window.addEventListener("resize", equipmentStatusOverviewChart.resize);
                });
            },
            // 设备故障数据统计
            getEquipmentFaulStatistics() {
                this.$get(this.url + 'equipmentFaulStatistics').then(res => {
                    let tableDataTime = [];
                    let otherList = [];
                    let elevatorList = [];
                    let airConditionList = [];
                    let fireFightingList = [];
                    let entiretyList = [];
                    let xAxisData = [];
                    let seriesData = [{
                            name: '其他',
                            type: 'line',
                            stack: '总量',
                            data: []
                        }, {
                            name: '电梯',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '空调',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '消防设备',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '整体',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                    ];
                    for (let i in res.otherList) {
                        seriesData[0].data.push(res.otherList[i].count);
                        xAxisData.push(res.otherList[i].month);
                        otherList.push(res.otherList[i].count);
                        tableDataTime.push(res.otherList[i].month);
                    }
                    for (let i in res.elevatorList) {
                        seriesData[1].data.push(res.elevatorList[i].count);
                        elevatorList.push(res.elevatorList[i].count);
                    }
                    for (let i in res.airConditionList) {
                        seriesData[2].data.push(res.airConditionList[i].count);
                        airConditionList.push(res.airConditionList[i].count);
                    }
                    for (let i in res.fireFightingList) {
                        seriesData[3].data.push(res.fireFightingList[i].count);
                        fireFightingList.push(res.fireFightingList[i].count);
                    }
                    for (let i in res.entiretyList) {
                        seriesData[4].data.push(res.entiretyList[i].count);
                        entiretyList.push(res.entiretyList[i].count);
                    }
                    this.equipmentFailureDataStatisticsOption.series = seriesData;
                    this.equipmentFailureDataStatisticsOption.xAxis.data = xAxisData;
                    this.tableData.time = tableDataTime;
                    this.tableData.otherList = otherList;
                    this.tableData.elevatorList = elevatorList;
                    this.tableData.airConditionList = airConditionList;
                    this.tableData.fireFightingList = fireFightingList;
                    this.tableData.entiretyList = entiretyList;
                    let equipmentFailureDataStatisticsChart = echarts.init(document.getElementById(
                        'equipmentFailureDataStatisticsChart'));
                    equipmentFailureDataStatisticsChart.setOption(this.equipmentFailureDataStatisticsOption);
                    window.addEventListener("resize", equipmentFailureDataStatisticsChart.resize);
                });
            }
        },
        mounted() {
            this.url = publicURL.chartsURL + 'ops/';
            this.getEquipmentSituation();
            this.getEquipmentTypeDistribution();
            this.getEquipmentStateSituation();
            this.getEquipmentFaulStatistics();
        }
    };
</script>
<style lang="scss" scoped>
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
        background-color: #f4f4f4;
    }

    .el-col {
        border-radius: 4px;
        .grid-title {
            font-size: 14px;
            color: #4a4a4a;
            letter-spacing: 0;
            height: 50px;
            line-height: 50px;
            padding-left: 30px;
            border-bottom: 1px solid #d5d5d5;
            span {
                font-size: 12px;
                color: #757575;
                letter-spacing: 0;
                margin-left: 5px;
            }
        }
    }

    .userProfile {
        .user-data {
            display: flex;
            justify-content: space-around;
            text-align: center;
            align-items: center;
            height: 150px;
            .data-item {
                .data-num {
                    background: linear-gradient(135deg, #f53252, #ec67c1);
                    font-weight: bold;
                    -webkit-background-clip: text;
                    color: transparent;
                    font-size: 32px;
                    line-height: 55px;
                }
                .data-title {
                    font-size: 12px;
                    color: #757575;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
        }
    }



    .deviceTypeDistribution {
        .content {
            height: 220px;
        }
    }

    .tabel {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        border: 1px solid #ebeef5;
        background: #fff;
        tr {
            th {
                color: #606266;
                padding: 12px 0;
            }
            td {
                border: 1px solid #ebeef5;
                padding: 12px 0;
                min-width: 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
            }
        }
    }
</style>