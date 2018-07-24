<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content userProfile">
                            <div class="grid-title">今日概况</div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">{{TodaySituation.todaySubject}}</div>
                                    <div class="data-title">今日发帖</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{TodaySituation.todaySubjectReply}}</div>
                                    <div class="data-title">今日回帖</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{TodaySituation.todaysharedResourceReservation}}</div>
                                    <div class="data-title">共享资源预约</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{TodaySituation.todaySubject}}</div>
                                    <div class="data-title">今日投诉</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content sharedResourceOverview">
                            <div class="grid-title">共享资源概况</div>
                            <div class="content">
                                <div id="sharedResourceChart" style="height:100%;width:100%;">

                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content  classificationStatistics">
                            <div class="grid-title">共享资源分类统计</div>
                            <div class="content">
                                <div id="classificationStatisticsChart" style="height:100%;width:100%;">

                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content  monthlyBookingRateTrend">
                            <div class="grid-title">月度预约率趋势</div>
                            <div class="content">
                                <div id="monthlyBookingRateTrendChart" style="height:100%;width:100%;">
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div class="grid-content  userComplaintFeedbackTrend">
                            <div class="grid-title">用户投诉反馈趋势</div>
                            <div class="content">
                                <div id="userComplaintFeedbackTrendChart" style="height:100%;width:100%;">
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content  HighReservationRate">
                    <div class="grid-title">一个月内高预约率共享资源排序</div>
                    <div class="content">
                        <div id="HighReservationRateChart" style="height:100%;width:100%;">
                        </div>
                    </div>
                </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content  LowReservationRate">
                    <div class="grid-title">一个月内低预约率共享资源排序</div>
                    <div class="content">
                        <div id="LowReservationRateChart" style="height:100%;width:100%;">
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
                // 今日概况
                TodaySituation: {
                    todaySubject: 0,
                    todaySubjectReply: 0,
                    todaysharedResourceReservation: 0,
                    todayComplaints: 0,
                },
                // 共享资源概况
                SharedResourceOverviewOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                    },
                    color: ['#5b9bd5', '#F5A623', '#a5a5a5', '#7ED321'],
                    legend: {
                        orient: 'horizontal',
                        left: 'center',
                        data: ['已预约', '空闲', '维修']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '60%'],
                        data: [{
                                value: 0,
                                name: '已预约'
                            },
                            {
                                value: 0,
                                name: '空闲'
                            },
                            {
                                value: 0,
                                name: '维修'
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
                // 预约资源分类统计
                classificationStatisticsOption: {
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
                                    '#ffc000', '#ed7d31', '#e65100'
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
                // 月度预约率趋势
                monthlyBookingRateTrendOption: {
                    color: ['#5b9bd5'],
                    xAxis: {
                        type: 'category',
                        data: []
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
                // 用户投诉反馈趋势
                userComplaintFeedbackTrendOption: {
                    color: ['#ff5252'],
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}'
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}: {c}'
                    },
                    series: [{
                        data: [],
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c} '
                            },
                        }
                    }]
                },
                //  一个月内高预约率共享资源
                HighReservationRateOption: {
                    color: ['#ff9100'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                        },
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [{
                        name: '预约率',
                        type: 'bar',
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c} %'
                            },
                        }
                    }]
                },
                // 一个月内低预约率共享资源
                LowReservationRateOption: {
                    color: ['#0091ea'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                        },
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [{
                        name: '预约率',
                        type: 'bar',
                        data: [],
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c} %'
                            },
                        }
                    }],
                }
            }
        },
        methods: {
            // 今日概况
            getTodaySituation() {
                this.$get(this.url + 'todaySituation').then(res => {
                    this.TodaySituation = publicFunction.deepCopy(this.TodaySituation, res);
                })
            },
            // 预约资源分类统计
            getSharedResourceTotalByType() {
                this.$get(this.url + 'sharedResourceTotalByType').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.sharedResourceTypeTotalList.length; i++) {
                        xAxisData.push(res.sharedResourceTypeTotalList[i].type);
                        seriesData.push(res.sharedResourceTypeTotalList[i].count);
                    }
                    this.classificationStatisticsOption.xAxis[0].data = xAxisData;
                    this.classificationStatisticsOption.series[0].data = seriesData;
                    let classificationStatisticsChart = echarts.init(document.getElementById(
                        'classificationStatisticsChart'));
                    classificationStatisticsChart.setOption(this.classificationStatisticsOption);
                    window.addEventListener("resize", classificationStatisticsChart.resize);
                })
            },
            //  共享资源概况
            getSharedResourceSituation() {
                this.$get(this.url + 'sharedResourceSituation').then(res => {
                    this.SharedResourceOverviewOption.series[0].data = [{
                            value: res.appointmentTotal,
                            name: '已预约'
                        },
                        {
                            value: res.idleTotal,
                            name: '空闲'
                        },
                        {
                            value: res.repairTotal,
                            name: '维修'
                        }
                    ]
                    let sharedResourceChart = echarts.init(document.getElementById(
                        'sharedResourceChart'));
                    sharedResourceChart.setOption(this.SharedResourceOverviewOption);
                    window.addEventListener("resize", sharedResourceChart.resize);
                });
            },
            // 月度预约率趋势
            getMonthlyAppointmentRate() {
                this.$get(this.url + 'monthlyAppointmentRate').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.monthlyAppointmentList.length; i++) {
                        xAxisData.push(res.monthlyAppointmentList[i].month);
                        seriesData.push(res.monthlyAppointmentList[i].rate);
                    }
                    this.monthlyBookingRateTrendOption.xAxis.data = xAxisData;
                    this.monthlyBookingRateTrendOption.series[0].data = seriesData;
                    let monthlyBookingRateTrendChart = echarts.init(document.getElementById(
                        'monthlyBookingRateTrendChart'));
                    monthlyBookingRateTrendChart.setOption(this.monthlyBookingRateTrendOption);
                    window.addEventListener("resize", monthlyBookingRateTrendChart.resize);
                });
            },
            // 用户投诉反馈趋势
            getUserComplainTendency() {
                this.$get(this.url + 'userComplainTendency').then(res => {
                    let xAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < res.userComplainTendencyList.length; i++) {
                        xAxisData.push(res.userComplainTendencyList[i].month);
                        seriesData.push(res.userComplainTendencyList[i].count);
                    }
                    this.userComplaintFeedbackTrendOption.xAxis.data = xAxisData;
                    this.userComplaintFeedbackTrendOption.series[0].data = seriesData;
                    let userComplaintFeedbackTrendChart = echarts.init(document.getElementById(
                        'userComplaintFeedbackTrendChart'));
                    userComplaintFeedbackTrendChart.setOption(this.userComplaintFeedbackTrendOption);
                    window.addEventListener("resize", userComplaintFeedbackTrendChart.resize);
                });
            },
            //  一个月内高预约率共享资源
            getMonthlyHighAppointmentRate() {
                this.$get(this.url + 'monthlyHighAppointmentRate').then(res => {
                    let arr = res.monthlyAppointmentRankList;
                    let len = arr.length;
                    for (let i = 0; i < len; i++) {
                        for (let j = 0; j < len - 1 - i; j++) {
                            if (arr[j].rate > arr[j + 1].rate) { //相邻元素两两对比
                                let temp = arr[j + 1]; //元素交换
                                arr[j + 1] = arr[j];
                                arr[j] = temp;
                            }
                        }
                    }
                    let yAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < arr.length; i++) {
                        yAxisData.push(arr[i].name);
                        seriesData.push(arr[i].rate);
                    }
                    this.HighReservationRateOption.yAxis.data = yAxisData;
                    this.HighReservationRateOption.series[0].data = seriesData;
                    let HighReservationRateChart = echarts.init(document.getElementById(
                        'HighReservationRateChart'));
                    HighReservationRateChart.setOption(this.HighReservationRateOption);
                    window.addEventListener("resize", HighReservationRateChart.resize);
                });
            },
            // 一个月内低预约率共享资源
            getMonthlyLowAppointmentRate() {
                this.$get(this.url + 'monthlyLowAppointmentRate').then(res => {
                    let arr = res.monthlyAppointmentRankList;
                    let len = arr.length;
                    for (let i = 0; i < len; i++) {
                        for (let j = 0; j < len - 1 - i; j++) {
                            if (arr[j].rate < arr[j + 1].rate) { //相邻元素两两对比
                                let temp = arr[j + 1]; //元素交换
                                arr[j + 1] = arr[j];
                                arr[j] = temp;
                            }
                        }
                    }
                    let yAxisData = [];
                    let seriesData = [];
                    for (let i = 0; i < arr.length; i++) {
                        yAxisData.push(arr[i].name);
                        seriesData.push(arr[i].rate);
                    }
                    this.LowReservationRateOption.yAxis.data = yAxisData;
                    this.LowReservationRateOption.series[0].data = seriesData;
                    let LowReservationRateChart = echarts.init(document.getElementById(
                        'LowReservationRateChart'));
                    LowReservationRateChart.setOption(this.LowReservationRateOption);
                    window.addEventListener("resize", LowReservationRateChart.resize);
                });
            },
        },
        mounted() {
            this.url = publicURL.chartsURL + 'operation/';
            this.getTodaySituation();
            this.getSharedResourceTotalByType();
            this.getSharedResourceSituation();
            this.getMonthlyAppointmentRate();
            this.getUserComplainTendency();
            this.getMonthlyHighAppointmentRate();
            this.getMonthlyLowAppointmentRate();
        }
    }
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
            color: #4A4A4A;
            letter-spacing: 0;
            height: 50px;
            line-height: 50px;
            padding-left: 30px;
            border-bottom: 1px solid #D5D5D5;
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
                    background: linear-gradient(135deg, #F53252, #EC67C1);
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

    .sharedResourceOverview {
        .content {
            height: 350px;
        }
    }

    .classificationStatistics,
    .monthlyBookingRateTrend {
        .content {
            height: 250px;
        }
    }

    .userComplaintFeedbackTrend {
        .content {
            height: 250px;
        }
    }

    .HighReservationRate,
    .LowReservationRate {
        .content {
            height: 350px;
        }
    }
</style>