<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content  userProfile">
                            <div class="grid-title">用户概况
                                <span>(单位：家)</span>
                            </div>
                            <div class="user-data">
                                <div class="data-item">
                                    <div class="data-num">10000</div>
                                    <div class="data-title">用户总数</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">99</div>
                                    <div class="data-title">今日新增</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">2000</div>
                                    <div class="data-title">今日活跃</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content  userDistribution">
                            <div class="grid-title">用户分布</div>
                            <div>
                                <div id="charts" style="width:90%;height:400px;">
                                    <div id="main" style="width:100%;height:400px"></div>
                                </div>
                            </div>
                            <div class="percentageComponent">
                                <div class="title">
                                    <span>充值用户 4773</span>
                                    <span>13%</span>
                                </div>
                                <div class="data">
                                    <span style="width:13%"></span>
                                </div>
                            </div>
                            <div class="percentageComponent">
                                <div class="title">
                                    <span>活跃用户 4773</span>
                                    <span>50%</span>
                                </div>
                                <div class="data">
                                    <span style="width:50%"></span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content  businessUsers">
                            <div class="grid-title">企业用户分布</div>
                            <div class="businessContent">
                                <div class="businessPercentage">
                                    <div class="percentageComponent">
                                        <div class="title">
                                            <span>所有者 956</span>
                                            <span>13%</span>
                                        </div>
                                        <div class="data">
                                            <span style="width:13%"></span>
                                        </div>
                                    </div>
                                    <div class="percentageComponent">
                                        <div class="title">
                                            <span>管理者 5666</span>
                                            <span>50%</span>
                                        </div>
                                        <div class="data">
                                            <span style="width:50%"></span>
                                        </div>
                                    </div>
                                    <div class="percentageComponent">
                                        <div class="title">
                                            <span>员工 90066</span>
                                            <span>50%</span>
                                        </div>
                                        <div class="data">
                                            <span style="width:50%"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="businessCharts">
                                    <div id="businessChartsMain" style="width:100%;height:200px">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content  genderAndAge">
                            <div class="grid-title">性别及年龄层分布</div>
                            <div class="genderAndAgeContent">
                                <div class="item-gender">
                                    <div class="gender-top">
                                        <div class="gender-top-item">
                                            <img class="gender-img" src="../../../static/images/female.png">
                                            <div class="item-data">
                                                <span>女性</span>
                                                <span>35%</span>
                                            </div>
                                        </div>
                                        <div class="gender-top-item">
                                            <div class="item-data">
                                                <span>男性</span>
                                                <span>65%</span>
                                            </div>
                                            <img src="../../../static/images/male.png">
                                        </div>
                                    </div>
                                    <div class="gender-bottom">
                                        <div class="content">
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="female"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                            <span class="male"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-age">
                                    <div class="age-item">
                                        <div>青年</div>
                                        <div id="ageYouthCharts" class="chartsContent">
                                            <div class="item">
                                                <div class="cg-wrap">
                                                    <div class="circle-left-wrap">
                                                        <div class="circle-left"></div>
                                                    </div>
                                                    <div class="circle-right-wrap">
                                                        <div class="circle-right"></div>
                                                    </div>
                                                    <div class="mask">
                                                        <span>25</span>%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="age-item">
                                        <div>中年</div>
                                        <div id="ageMiddleCharts" class="chartsContent">
                                            <div class="item">
                                                <div class="cg-wrap">
                                                    <div class="circle-left-wrap">
                                                        <div class="circle-left"></div>
                                                    </div>
                                                    <div class="circle-right-wrap">
                                                        <div class="circle-right"></div>
                                                    </div>
                                                    <div class="mask">
                                                        <span>25</span>%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="age-item">
                                        <div>老年</div>
                                        <div id="ageElderlyCharts" class="chartsContent">
                                            <div class="item">
                                                <div class="cg-wrap">
                                                    <div class="circle-left-wrap">
                                                        <div class="circle-left"></div>
                                                    </div>
                                                    <div class="circle-right-wrap">
                                                        <div class="circle-right"></div>
                                                    </div>
                                                    <div class="mask">
                                                        <span>25</span>%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="age-item">
                                        <div>其他</div>
                                        <div id="ageOtherCharts" class="chartsContent">
                                            <div class="item">
                                                <div class="cg-wrap">
                                                    <div class="circle-left-wrap">
                                                        <div class="circle-left"></div>
                                                    </div>
                                                    <div class="circle-right-wrap">
                                                        <div class="circle-right"></div>
                                                    </div>
                                                    <div class="mask">
                                                        <span>25</span>%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="grid-content  userGrowthRate">
                            <div class="grid-title">用户增长率</div>
                            <div class="businessContent">
                                <div id="userGrowthRateCharts" style="height:100%;width:100%;">

                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="grid-content  enterpriseUserRanking">
                            <div class="grid-title">企业用户TOP10</div>
                            <div class="enterpriseUserRankingContent">
                                <div id="enterpriseUserRankingCharts" style="height:100%;width:100%;">

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
    import echarts from 'echarts/lib/echarts';
    import axios from 'axios';
    export default {
        name: 'Bank',
        data() {
            return {};
        },
        components: {},
        computed: {},
        methods: {},
        mounted() {
            /*ECharts图表*/
            var myChart = echarts.init(document.getElementById('main'));
            var businessChartsMain = echarts.init(document.getElementById('businessChartsMain'));
            var userGrowthRateCharts = echarts.init(document.getElementById('userGrowthRateCharts'));
            var enterpriseUserRankingCharts = echarts.init(document.getElementById('enterpriseUserRankingCharts'));
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "<br/>{b} : {c} ({d}%)",
                }, //设置饼图的颜色
                color: ['#1C95FF', '#F76B1C', '#E900FF', '#05FFA9'],
                // itemStyle: {
                //     normal: { //正常状态下的饼块设置
                //         label: {
                //             show: true
                //         },
                //         color: { //渐变效果
                //             type: 'linear',
                //             x: 0,
                //             y: 0,
                //             x2: 0,
                //             y2: 1,
                //             colorStops: [{
                //                 offset: 0,
                //                 color: '#1C95FF' // 0% 处的颜色
                //             }, {
                //                 offset: 1,
                //                 color: '#79D7FF' // 100% 处的颜色
                //             }],
                //             globalCoord: true // 缺省为 false
                //         },
                //         labelLine: {
                //             show: true
                //         }
                //     },
                // },
                series: [{
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '50%'],
                    data: [{
                            value: 5485,
                            name: '安卓APP'
                        },
                        {
                            value: 4778,
                            name: '苹果用户'
                        },
                        {
                            value: 1334,
                            name: '公众号'
                        },
                        {
                            value: 16656,
                            name: '小程序'
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
                            formatter: '{b|{b}}\n{c|{c}}  {per|{d}%}',
                            rich: {
                                b: {
                                    color: '#9B9B9B',
                                    fontSize: 16,
                                    lineHeight: 24,
                                    align: 'left'
                                },
                                c: {
                                    color: '#9B9B9B',
                                    fontSize: 16,
                                    lineHeight: 24
                                },
                                per: {
                                    color: '#9B9B9B',
                                    fontSize: 16,
                                    padding: [2, 4],
                                }
                            }
                        }
                    },
                }]
            });
            businessChartsMain.setOption({
                color: ['#17eace', '#fd304e'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['企业用户', '注册用户']
                },
                series: [{
                    type: 'pie',
                    radius: ['8%', '62%'],
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    label: {
                        normal: {
                            position: 'inner',
                            formatter: '{d}%'
                        }
                    },
                    data: [{
                            value: 535,
                            name: '企业用户'
                        },
                        {
                            value: 510,
                            name: '注册用户'
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
            });

            var posList = [
                'left', 'right', 'top', 'bottom',
                'inside',
                'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
            ];
            app.configParameters = {
                rotate: {
                    min: -90,
                    max: 90
                },
                align: {
                    options: {
                        left: 'left',
                        center: 'center',
                        right: 'right'
                    }
                },
                verticalAlign: {
                    options: {
                        top: 'top',
                        middle: 'middle',
                        bottom: 'bottom'
                    }
                },
                position: {
                    options: echarts.util.reduce(posList, function (map, pos) {
                        map[pos] = pos;
                        return map;
                    }, {})
                },
                distance: {
                    min: 0,
                    max: 100
                }
            };

            app.config = {
                rotate: 90,
                align: 'left',
                verticalAlign: 'middle',
                position: 'insideBottom',
                distance: 15,
                onChange: function () {
                    var labelOption = {
                        normal: {
                            rotate: app.config.rotate,
                            align: app.config.align,
                            verticalAlign: app.config.verticalAlign,
                            position: app.config.position,
                            distance: app.config.distance
                        }
                    };
                    myChart.setOption({
                        series: [{
                            label: labelOption
                        }, {
                            label: labelOption
                        }]
                    });
                }
            };


            var option = {
                color: ['#93d242', '#f9b84c'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['企业用户数', '用户数', ]
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: ['一月', '二月', '三月', '四月', '五月', '一月', '二月', '三月', '四月', '五月', '四月', '五月']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                        name: '企业用户数',
                        type: 'bar',
                        barGap: 0,
                        data: [3200, 3320, 3010, 3340, 3900, 3200, 3302, 3001, 3304, 3090, 3034, 3900]
                    },
                    {
                        name: '用户数',
                        type: 'bar',
                        data: [2200, 1820, 1910, 2340, 2900, 2200, 1820, 1091, 2304, 2900, 2900, 3090]
                    },

                ]
            };
            var option2 = {
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
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220, 390, 330, 500]
                }]
            };;
            userGrowthRateCharts.setOption(option);
            enterpriseUserRankingCharts.setOption(option2);
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

    .userDistribution {
        padding-bottom: 20px;


    }

    .businessUsers {
        .businessContent {
            display: flex;
            justify-content: space-around;
            .businessPercentage {
                width: 55%;
            }
            .businessCharts {
                width: 45%;
            }
        }
    }

    .genderAndAge {
        .genderAndAgeContent {
            display: flex;
            justify-content: space-between;
            .item-gender {
                width: 45%;
                display: flex;
                flex-wrap: wrap;
                height: 200px;
                justify-content: center;
                .gender-top {
                    display: flex;
                    justify-content: space-around;
                    height: 58%;
                    .gender-top-item {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        .gender-img {
                            height: 50px;
                        }
                        .item-data {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            span {
                                text-align: center;
                                width: 100%;
                                line-height: 20px;
                                margin: 0 10px;
                                font-size: 14px;
                                color: #4A4A4A;
                            }
                        }
                    }
                }
                .gender-bottom {
                    height: 42%;
                    width: 90%;
                    .content {
                        height: 64px;
                        width: 190px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        flex-wrap: wrap;
                        span {
                            width: 6px;
                            height: 6px;
                            margin: 0 6px 6px 0;
                            border-radius: 5px;
                            &.male {
                                background-image: linear-gradient(-134deg, #17EACE 0%, #6090F4 100%);
                            }
                            &.female {
                                background-image: linear-gradient(-134deg, #FE2B44 0%, #EC67C1 100%);
                            }
                        }
                    }
                }
            }
            .item-age {
                width: 55%;
                display: flex;
                flex-wrap: wrap;
                height: 200px;
                justify-content: center;
                .age-item {
                    height: 50%;
                    width: 50%;
                    display: flex;
                    align-items: center;
                    .chartsContent {
                        width: 60%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .item {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            .cg-wrap {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                background: #E900FF;
                            }

                            .circle-left-wrap,
                            .circle-right-wrap {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 25px;
                                height: 50px;
                                overflow: hidden;
                            }
                            .circle-right-wrap {
                                left: 50px;
                            }
                            .circle-left,
                            .circle-right {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                background: #d3d3d3;
                            }
                            .circle-right {
                                left: -50px;
                            }

                            .circle-left {
                                clip: rect(0, 50px, auto, 0);
                            }
                            .circle-right {
                                clip: rect(0, auto, auto, 50px);
                            }
                            .mask {
                                position: absolute;
                                top: 2.5px;
                                left: 2.5px;
                                width: 45px;
                                height: 45px;
                                border-radius: 50%;
                                background: #f4f4f4;
                                line-height: 45px;
                                text-align: center;
                                font-size: 14px;
                                color: #333333;
                            }
                        } // .circle {
                        //     position: absolute;
                        //     width: 45px;
                        //     height: 45%;
                        //     border: 3px #d3d3d3 solid;
                        //     -webkit-border-radius: 100px;
                        //     clip: rect(0px, 50px, 50px, 50px);
                        // }
                    }
                }
            }
        }
    }


    .userGrowthRate {
        .businessContent {
            width: 100%;
            height: 300px;
        }
    }

    .enterpriseUserRanking {
        .enterpriseUserRankingContent {
            width: 100%;
            height: 300px;
        }
    }
</style>