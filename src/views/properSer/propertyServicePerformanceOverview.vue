<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content userProfile">
                            <div class="grid-title">服务效能概况
                            </div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">{{todaySituation.todayFinishInspectionTask}}/{{todaySituation.todayInspectionTask}}</div>
                                    <div class="data-title">今日设备巡检</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{todaySituation.todayRelease}}</div>
                                    <div class="data-title">今日放行</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{todaySituation.todayRepairs}}</div>
                                    <div class="data-title">今日报修</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{todaySituation.todayDealRepairs}}</div>
                                    <div class="data-title">今日处理报修</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content">
                            <div class="grid-title">本月报修处理状况</div>
                            <div class="content">
                                <div style="width:100%;height:370px; margin: 0 auto;">
                                    <div id="monthDealRepairsConditionChart" style="width:100%;height:100%;"></div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content">
                            <div class="grid-title">本月已处理报修 解决周期统计</div>
                            <div class="content">
                                <div id="monthDealRepairsCycleStatisticsChart" style="width:100%;height:260px;padding:20px;box-sizing: border-box;">
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content">
                            <div class="grid-title">本月未处理报修 延期统计</div>
                            <div class="content">
                                <div id="monthUnDealRepairsCycleStatisticsChart" style="width:100%;height:260px;padding:20px;box-sizing: border-box;">
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content">
                            <div class="grid-title">本月设备巡检概况</div>
                            <div class="content">
                                <div id="monthSituationChart" style="width:100%;height:260px;">
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content  inspectionOverview">
                            <div class="grid-title">巡更路线与人员及任务概况
                            </div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">{{patrolSituation.lineCount}}</div>
                                    <div class="data-title">巡检路线</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{patrolSituation.userCount}}</div>
                                    <div class="data-title">巡检员</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{patrolSituation.monthFinishTaskCount}}/{{patrolSituation.monthTaskCount}}</div>
                                    <div class="data-title">本月巡检任务</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="grid-content">
                    <div class="grid-title">设备巡检执行率</div>
                    <div class="content">
                        <div id="implementationRateChart" style="width:100%;height:260px;">
                        </div>
                    </div>
                </div>
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
                // 今天概况
                todaySituation: {
                    todayInspectionTask: 0,
                    todayFinishInspectionTask: 0,
                    todayRelease: 0,
                    todayRepairs: 0,
                    todayDealRepairs: 0,
                },
                // 巡更路线与人员及任务概况
                patrolSituation: {
                    lineCount: 0,
                    userCount: 0,
                    monthTaskCount: 0,
                    monthFinishTaskCount: 0,
                },
                // 本月报修处理状况
                monthDealRepairsConditionOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                    }, //设置饼图的颜色
                    color: ['#ed7d31', '#5b9bd5', '#7ED321'],
                    legend: {
                        orient: 'horizontal',
                        left: 'center',
                        data: ['本月处理报修', '本月未处理报修']
                    },
                    series: [{
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '60%'],
                        data: [],
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
                // 本月已处理报修 解决周期统计
                monthDealRepairsCycleStatisticsOption: {
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
                        }
                    },
                    color: ['#5b9bd5'],
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
                        data: ['会议室', '电子屏', '展厅'],
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
                        data: []
                    }]
                },
                // 本月未处理报修 延期统计
                monthUnDealRepairsCycleStatisticsOption: {
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
                        }
                    },
                    color: ['#ed7d31'],
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
                        data: ['会议室', '电子屏', '展厅'],
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
                        data: []
                    }]
                },
                // 设备巡检执行率
                implementationRateOption: {
                    color: ['#ff5252'],
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    grid: {
                        top: '10%',
                        left: '5%',
                        right: '5%',
                        bottom: '10%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}: {c}%'
                    },
                    series: [{
                        data: [],
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c} %'
                            },
                        }
                    }]
                },
                // 本月设备巡检概况
                monthSituationOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                    }, //设置饼图的颜色
                    color: ['#7ED321', '#5b9bd5', '#a5a5a5'],
                    legend: {
                        orient: 'horizontal',
                        left: 'center',
                        data: ['已完成', '未完成', '未开始']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '50%'],
                        center: ['50%', '60%'],
                        data: [],
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
                }
            };
        },
        methods: {
            // 今日概况
            getTodaySituation() {
                this.$get(this.url + 'todaySituation').then(res => {
                    this.todaySituation = res;
                });
            },
            // 本月报修处理状况
            getMonthDealRepairsCondition() {
                this.$get(this.url + 'monthDealRepairsCondition').then(res => {
                    this.monthDealRepairsConditionOption.series[0].data = [{
                            value: res.monthDealRepairs,
                            name: '本月处理报修'
                        },
                        {
                            value: res.monthNotDealRepairs,
                            name: '本月未处理报修'
                        }
                    ]
                    let monthDealRepairsConditionChart = echarts.init(document.getElementById(
                        'monthDealRepairsConditionChart'));
                    monthDealRepairsConditionChart.setOption(this.monthDealRepairsConditionOption);
                    window.addEventListener("resize", monthDealRepairsConditionChart.resize);
                });
            },
            // 本月已处理报修 解决周期统计
            getMonthDealRepairsCycleStatistics() {
                this.$get(this.url + 'monthDealRepairsCycleStatistics').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.dealCycleStatisticsList.length; i++) {
                        xAxisData.push(res.dealCycleStatisticsList[i].time);
                        seriesData.push(res.dealCycleStatisticsList[i].count);
                    }
                    this.monthDealRepairsCycleStatisticsOption.xAxis[0].data = xAxisData;
                    this.monthDealRepairsCycleStatisticsOption.series[0].data = seriesData;
                    let monthDealRepairsCycleStatisticsChart = echarts.init(document.getElementById(
                        'monthDealRepairsCycleStatisticsChart'));
                    monthDealRepairsCycleStatisticsChart.setOption(this.monthDealRepairsCycleStatisticsOption);
                    window.addEventListener("resize", monthDealRepairsCycleStatisticsChart.resize);
                });
            },
            //  本月未处理报修 延期统计
            getMonthUnDealRepairsCycleStatistics() {
                this.$get(this.url + 'monthUnDealRepairsCycleStatistics').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.dealCycleStatisticsList.length; i++) {
                        xAxisData.push(res.dealCycleStatisticsList[i].time);
                        seriesData.push(res.dealCycleStatisticsList[i].count);
                    }
                    this.monthUnDealRepairsCycleStatisticsOption.xAxis[0].data = xAxisData;
                    this.monthUnDealRepairsCycleStatisticsOption.series[0].data = seriesData;
                    let monthUnDealRepairsCycleStatisticsChart = echarts.init(document.getElementById(
                        'monthUnDealRepairsCycleStatisticsChart'));
                    monthUnDealRepairsCycleStatisticsChart.setOption(this.monthUnDealRepairsCycleStatisticsOption);
                    window.addEventListener("resize", monthUnDealRepairsCycleStatisticsChart.resize);
                });
            },
            // 设备巡检执行率
            getImplementationRate() {
                this.$get(this.url + 'implementationRate').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.implementationRateList.length; i++) {
                        xAxisData.push(res.implementationRateList[i].month);
                        seriesData.push(res.implementationRateList[i].rate);
                    }
                    this.implementationRateOption.xAxis.data = xAxisData;
                    this.implementationRateOption.series[0].data = seriesData;
                    let implementationRateChart = echarts.init(document.getElementById(
                        'implementationRateChart'));
                    implementationRateChart.setOption(this.implementationRateOption);
                    window.addEventListener("resize", implementationRateChart.resize);
                });
            },
            // 本月设备巡检概况
            getMonthSituation() {
                this.$get(this.url + 'monthSituation').then(res => {
                    this.monthSituationOption.series[0].data = [{
                            value: res.monthFinishTaskCount,
                            name: '已完成'
                        },
                        {
                            value: res.monthNotFinishTaskCount,
                            name: '未完成'
                        },
                        {
                            value: res.monthNotStartedTaskCount,
                            name: '未开始'
                        }
                    ]
                    let monthSituationChart = echarts.init(document.getElementById(
                        'monthSituationChart'));
                    monthSituationChart.setOption(this.monthSituationOption);
                    window.addEventListener("resize", monthSituationChart.resize);
                });
            },
            // 巡更路线、巡检人员概况
            getPatrolSituation() {
                this.$get(this.url + 'patrolSituation').then(res => {
                    this.patrolSituation = res;
                });
            }
        },
        mounted() {
            this.url = publicURL.chartsURL + 'property/';
            this.getTodaySituation();
            this.getMonthDealRepairsCondition();
            this.getMonthDealRepairsCycleStatistics();
            this.getMonthUnDealRepairsCycleStatistics();
            this.getImplementationRate();
            this.getMonthSituation();
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

    .inspectionOverview {
        .user-data {
            display: flex;
            justify-content: space-around;
            text-align: center;
            align-items: center;
            height: 260px;
            .data-item {
                .data-num {
                    background: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
                    font-weight: bold;
                    -webkit-background-clip: text;
                    color: transparent;
                    font-size: 32px;
                    line-height: 55px;
                }
                .data-title {
                    font-size: 16px;
                    color: #757575;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
        }
    }
</style>