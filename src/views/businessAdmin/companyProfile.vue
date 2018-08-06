<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content  userProfile">
                            <div class="grid-title">企业概况
                                <span>(单位：家)</span>
                            </div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">{{EnterpriseSituation.enterpriseTotal}}</div>
                                    <div class="data-title">企业总数</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{EnterpriseSituation.thisMonthEnter}}</div>
                                    <div class="data-title">本月入驻</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">{{EnterpriseSituation.thisMonthEvacuation}}</div>
                                    <div class="data-title">本月撤离</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content">
                            <div class="grid-title">企业年限分布</div>
                            <div class="content">
                                <div style="width:100%;height:520px; margin: 0 auto;">
                                    <div id="BusinessYearDistribution" style="width:100%;height:100%;"></div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="grid-content  ">
                            <div class="grid-title">企业流动率</div>
                            <div class="content">
                                <div id="businessTurnover" style="width:100%;height:200px"></div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div class="grid-content  ">
                            <div class="grid-title">企业性质分布</div>
                            <div class="content">
                                <div id="EnterpriseNature" style="width:100%;height:200px"></div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="14">
                        <div class="grid-content  ">
                            <div class="grid-title">入驻企业数量趋势</div>
                            <div class="content">
                                <div id="EntryTrend" style="width:100%;height:200px"></div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="grid-content  ">
                            <div class="grid-title">行业分布</div>
                            <div class="content">
                                <div id="IndustrialDistribution" style="width:100%;height:200px"></div>
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
                // 企业概况
                EnterpriseSituation: {
                    thisMonthEnter: 0,
                    enterpriseTotal: 0,
                    thisMonthEvacuation: 0
                },
                // 企业年限分布
                EnterpriseAge: {
                    threeToFiveYears: 0,
                    fiveToTenYears: 0,
                    enterpriseTotal: 9,
                    oneToThreeYears: 0,
                    tenYearsAbove: 0
                },
                // 企业年限分布
                BusinessYearDistributionOption: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                    },
                    color: ['#4EB8FF', '#F5A623', '#F53252', '#7ED321'],
                    legend: {
                        orient: '',
                        right: '10',
                        top: '10',
                        data: ['1～3年', '3～5年', '5～10年', '10年以上']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '50%'],
                        data: [{
                                value: 0,
                                name: '1～3年'
                            },
                            {
                                value: 0,
                                name: '3～5年'
                            },
                            {
                                value: 0,
                                name: '5～10年'
                            },
                            {
                                value: 0,
                                name: '10年以上'
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
                                formatter: '{b|{b}}\n{per|{d}%}',
                                rich: {
                                    b: {
                                        color: '#9B9B9B',
                                        fontSize: 16,
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
                // 企业流动率（最近12个月）
                BusinessTurnoverOption: {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                        },
                    }],
                    series: [{
                        name: '企业流动率',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }]
                },
                // 企业性质分布
                EnterpriseNatureOption: {
                    color: ['#F5A623', '#4EB8FF', '#BD10E0', '#F53252'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: '',
                        right: '10',
                        y: 'center',
                        data: ['国有企业', '民营企业', '外商独资', '合资企业']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['45%', '60%'],
                        center: ['45%', '50%'],
                        selectedMode: 'single',
                        label: {
                            normal: {
                                formatter: '{per|{d}%}',
                                rich: {
                                    per: {
                                        color: '#9B9B9B',
                                        fontSize: 14,
                                        padding: [2, 4],
                                        align: 'left'
                                    }
                                }
                            }
                        },
                        data: [{
                                value: 0,
                                name: '国有企业'
                            },
                            {
                                value: 0,
                                name: '民营企业'
                            }, {
                                value: 0,
                                name: '外商独资'
                            },
                            {
                                value: 0,
                                name: '合资企业'
                            }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                },
                // 企业入驻趋势（最近12个月）
                EntryTrendOption: {
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
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    series: [{
                        data: [],
                        type: 'line'
                    }]
                },
                // 行业分布
                IndustrialDistributionOption: {
                    color: ['#F53252'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        top: '10%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '行业分布',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }]
                },
            }
        },
        methods: {
            // 企业概况
            queryEnterpriseSituation() {
                this.$get(this.url + 'queryEnterpriseSituation').then(res => {
                    this.EnterpriseSituation = res;
                })
            },
            // 企业年限分布
            queryEnterpriseAge() {
                this.$get(this.url + 'queryEnterpriseAge').then(res => {
                    this.BusinessYearDistributionOption.series[0].data = [{
                            value: res.oneToThreeYears,
                            name: '1～3年'
                        },
                        {
                            value: res.threeToFiveYears,
                            name: '3～5年'
                        },
                        {
                            value: res.fiveToTenYears,
                            name: '5～10年'
                        },
                        {
                            value: res.tenYearsAbove,
                            name: '10年以上'
                        }
                    ];
                    let BusinessYearDistribution = echarts.init(document.getElementById(
                        'BusinessYearDistribution'));
                    BusinessYearDistribution.setOption(this.BusinessYearDistributionOption);
                    window.addEventListener("resize", BusinessYearDistribution.resize);
                })
            },
            // 企业流动率（最近12个月）
            queryEnterpriseFlowRate() {
                this.$get(this.url + 'queryEnterpriseFlowRate').then(res => {
                    let businessTurnover = echarts.init(document.getElementById('businessTurnover'));
                    let month = [];
                    let flowRate = [];
                    let evacuationTotal = [];
                    for (let i = 0; i < res.enterpriseFlowList.length; i++) {
                        month.push(res.enterpriseFlowList[i].month);
                        flowRate.push(res.enterpriseFlowList[i].flowRate);
                        evacuationTotal.push(res.enterpriseFlowList[i].evacuationTotal);
                    }
                    this.BusinessTurnoverOption.xAxis[0].data = month;
                    this.BusinessTurnoverOption.series[0].data = flowRate;
                    businessTurnover.setOption(this.BusinessTurnoverOption);
                    window.addEventListener("resize", businessTurnover.resize);
                })
            },
            // 企业性质分布
            queryEnterpriseNature() {
                this.$get(this.url + 'queryEnterpriseNature').then(res => {
                    this.EnterpriseNatureOption.series[0].data = [{
                            value: res.stateOwned,
                            name: '国有企业'
                        },
                        {
                            value: res.privatelyOwned,
                            name: '民营企业'
                        }, {
                            value: res.foreignOwned,
                            name: '外商独资'
                        },
                        {
                            value: res.foreignJointCapital,
                            name: '合资企业'
                        }
                    ];
                    let EnterpriseNature = echarts.init(document.getElementById('EnterpriseNature'));
                    EnterpriseNature.setOption(this.EnterpriseNatureOption);
                    window.addEventListener("resize", EnterpriseNature.resize);
                })
            },
            // 企业入驻趋势（最近12个月）
            queryEnterpriseEnterTendency() {
                this.$get(this.url + 'queryEnterpriseEnterTendency').then(res => {
                    let month = [];
                    let enterTotal = [];
                    for (let i = 0; i < res.enterpriseEnterTendencyList.length; i++) {
                        month.push(res.enterpriseEnterTendencyList[i].month);
                        enterTotal.push(res.enterpriseEnterTendencyList[i].enterTotal);
                    }
                    this.EntryTrendOption.xAxis.data = month;
                    this.EntryTrendOption.series[0].data = enterTotal;
                    let EntryTrend = echarts.init(document.getElementById('EntryTrend'));
                    EntryTrend.setOption(this.EntryTrendOption);
                    window.addEventListener("resize", EntryTrend.resize);
                });
            },
            // 行业分布
            queryIndustryDistribution() {
                this.$get(this.url + 'queryIndustryDistribution').then(res => {
                    console.log(res);
                    let industry = [];
                    let industryTotal = [];
                    for (let i = 0; i < res.industryDistributionList.length; i++) {
                        industry.push(res.industryDistributionList[i].industry);
                        industryTotal.push(res.industryDistributionList[i].industryTotal);
                    };
                    this.IndustrialDistributionOption.xAxis = {
                        type: 'category',
                        data: industry,
                        axisTick: {
                            alignWithLabel: true
                        }
                    };
                    this.IndustrialDistributionOption.series = {
                        name: '行业分布',
                        type: 'bar',
                        barWidth: '60%',
                        data: industryTotal
                    };
                    let IndustrialDistribution = echarts.init(document.getElementById('IndustrialDistribution'));
                    IndustrialDistribution.setOption(this.IndustrialDistributionOption);
                    window.addEventListener("resize", IndustrialDistribution.resize);
                });
            }
        },
        mounted() {
            this.url = publicURL.chartsURL + 'enterpriseStat/';
            this.queryEnterpriseSituation();
            this.queryEnterpriseAge();
            this.queryEnterpriseFlowRate();
            this.queryEnterpriseNature();
            this.queryEnterpriseEnterTendency();
            this.queryIndustryDistribution();
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

    .percentageComponent {
        width: 80%;
        margin: 20px auto;
        .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            span {
                font-size: 14px;
                color: #4A4A4A;
                letter-spacing: 0;
                line-height: 14px;
            }
        }
        .data {
            background: #D3D3D3;
            border-radius: 100px;
            width: 100%;
            height: 8px;
            span {
                display: block;
                width: 1%;
                height: 100%;
                background-image: linear-gradient(-135deg, #FE2B44 0%, #EC67C1 100%);
                border-radius: 100px;
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
</style>