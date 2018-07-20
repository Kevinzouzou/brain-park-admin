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
                                    <div class="data-num">1100</div>
                                    <div class="data-title">今日发帖</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">1100</div>
                                    <div class="data-title">今日回帖</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">1100</div>
                                    <div class="data-title">共享资源预约</div>
                                </div>
                                <div class="data-item">
                                    <div class="data-num">1100</div>
                                    <div class="data-title">今日投诉</div>
                                </div>
                            </div>
                        </div>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content userProfile">
                            <div class="grid-title">共享资源概况</div>
                            <div class="content">

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
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {}
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
</style>