<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true">
                <el-form-item>
                    反馈来源筛选：
                    <el-select v-model="secFebackValue" placeholder="请选择" @change="secQueryFeBackValue">
                        <el-option label="全部来源" value="">
                        </el-option>
                        <el-option label="物业App" value="物业App">
                        </el-option>
                        <el-option label="用户App" value="用户App">
                        </el-option>
                    </el-select>
                    <!--<div class="pull-right">-->
                    <!--用户端APP：{{userAppNum}}-->
                    <!--物业端APP：{{proAppNum}}-->
                    <!--</div>-->
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="feedBackList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="Loading" style="width: 100%;">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="time" label="时间">
            </el-table-column>
            <el-table-column prop="addInfo.remark" label="反馈内容" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="addInfo.source" label="来源">
            </el-table-column>
            <el-table-column prop="userInfo.phone" label="反馈人">
            </el-table-column>
            <el-table-column prop="stage" label="状态">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="feBackView(scope.$index, scope.row)">查看</el-button>
                    <el-button type="primary" size="small" @click="feBackEdit(scope.$index, scope.row)" v-if=" scope.row.stage !== '已处理'">回复</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background @size-change="highSizeChange" @current-change="feBackCurChange" :page-sizes="[8,10,20,50]" :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="feedBackList.length" :current-page="page" style="float:right;">
            </el-pagination>
        </el-col>
        <!--回复界面-->
        <el-dialog title="回复" :visible.sync="feBackReportVisible" width="40%">
            <el-form :model="feBackForm" ref="feBackForm">
                <el-form-item prop="disc">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="feBackForm.disc">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="feBackReportVisible = false">取消</el-button>
                <el-button type="primary" @click="feBackReport">提交</el-button>
            </div>
        </el-dialog>

        <!--查看界面-->
        <el-dialog title="反馈详情" :visible.sync="feBackViewVisible">
            <el-form label-width="150px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="反馈时间：">
                            {{detailList.time || ' - '}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="反馈人：">
                            {{detailList.userInfo.phone || ' - '}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="反馈内容：">
                            <div class="content">{{detailList.addInfo.remark || ' - '}}</div>
                            <div class="imgs" v-if="detailList.addInfo.images && detailList.addInfo.images.length > 0">
                                <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                                <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="回复备注：" v-if="detailList.stage === '已处理'">
                            {{detailList.settlement || ' - '}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>


    </section>
</template>

<script>
    import {
        findSuggestion,
        replyUrl,
    } from '../../api/api'
    import publicFunction from '../../api/publicFunction';

    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                userAppNum: 0, //用户端APP数
                proAppNum: 0, //物业端APP数
                secFebackValue: '',
                page: 1,
                pagesize: 8,
                feedBackList: [],
                feBackTotal: 1,
                Loading: false,
                feBackReportVisible: false,
                feBackForm: {
                    disc: ''
                },
                detailList: {
                    time: '',
                    settlement: "",
                    stage: "",
                    userInfo: {
                        phone: '',
                    },
                    addInfo: {
                        remark: '',
                        images: [],
                        commentText: ''
                    }
                },
                feBackViewVisible: false,
                replyId: '',
            }
        },
        methods: {
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            // 获取意见反馈列表
            getFeedBackList(url) {
                this.Loading = true;
                this.$get(url)
                    .then((res) => {
                        this.feedBackList = res;
                        this.Loading = false;
                    })
            },
            feBackEdit(index, row) { // 显示回复界面
                this.feBackReportVisible = true;
                this.replyId = row.id;
            },
            feBackView(index, row) { //查看
                this.feBackViewVisible = true;
                this.detailList = publicFunction.deepCopy(this.detailList, row);
            },
            highSizeChange(val) {
                this.pagesize = val;
            },
            feBackCurChange(val) {
                this.page = val;
            },
            secQueryFeBackValue() {
                let url = this.secFebackValue === '' ? findSuggestion : findSuggestion + '&source=' + this.secFebackValue;
                this.getFeedBackList(url);
            },
            feBackReport() { //新增
                this.$refs.feBackForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let url = replyUrl + '&id=' + this.replyId + '&reply=' + this.feBackForm.disc;
                            this.$get(url)
                                .then((res) => {
                                    this.feBackReportVisible = false;
                                    this.getFeedBackList(findSuggestion);
                                })
                        });
                    }
                });
            },
        },
        mounted() {
            this.getFeedBackList(findSuggestion);
        }
    }
</script>

<style lang="scss" scoped>
    .imgs {
        margin: 10px auto;
        img {
            height: 120px;
            margin: 10px 15px;
        }
    }
</style>