<template>
    <section>
        <div class="mainPage" v-show="mainPageVisible">
            <el-tabs v-model="activeTopicName" type="card" @tab-click="handleClick">
                <el-tab-pane label="话题管理" name="first">
                    <div v-show="firstVisible">
                        <el-col :span="24" justify="center">
                            <el-form :inline="true" :model="topicFilters">
                                <el-form-item>
                                    <el-button type="primary" @click="cateMg">类别管理</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-select v-model="topicFilters.secCateValue" placeholder="请选择">
                                        <el-option label="全部" value="">
                                        </el-option>
                                        <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-date-picker v-model="topicFilters.timeTopicValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="topicFilters.searchTitle" placeholder="搜索标题" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="getQueryTopic">查询</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!--工具条-->
                        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                            <el-form :inline="true">
                                <el-form-item>
                                    <el-button type="danger" @click="topicBatchRemove">批量屏蔽</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!--列表-->
                        <el-table :data="topicList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="Loading" @selection-change="selsTopicChange"
                            style="width: 100%;">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="addInfo.name" label="昵称">
                                <template slot-scope="scope">
                                    <span>{{scope.row.addInfo.isRealName === true ? scope.row.addInfo.name : '匿名'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="类别">
                            </el-table-column>
                            <el-table-column prop="content" label="内容" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="updateTime" label="时间" sortable>
                            </el-table-column>
                            <el-table-column prop="likeNum" label="点赞" width="60">
                            </el-table-column>
                            <el-table-column prop="collectNum" label="收藏" width="60">
                            </el-table-column>
                            <el-table-column prop="tipOfNum" label="举报" width="60">
                            </el-table-column>
                            <el-table-column label="操作" width="150">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="topicView(scope.$index, scope.row)">查看</el-button>
                                    <el-button type="danger" size="small" @click="topicDel(scope.$index, scope.row)">屏蔽</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-col :span="24" class="toolbar">
                            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[8,10,20,50]"
                                :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="topicList.length"
                                style="float:right;">
                            </el-pagination>
                        </el-col>
                    </div>
                    <div v-show="secondVisible" title="类别管理">
                        <el-col :span="24" justify="center">
                            <el-form :inline="true">
                                <el-form-item>
                                    <span>快速添加分类：</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="category" placeholder="添加类别"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="cateAdd">添加</el-button>
                                </el-form-item>
                                <el-form-item style="float:right">
                                    <el-button type="danger" @click="backToFirstAn">返回</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!--工具条-->
                        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                            <el-form :inline="true">
                                <el-form-item>
                                    <el-button type="danger" @click="cateBatchRemove">批量删除</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!--列表-->
                        <el-table :data="cateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="Loading" @selection-change="selsCateChange"
                            style="width: 100%;">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="name" label="类别" sortable>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="anCateEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="danger" size="small" @click="anCateDel(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-col :span="24" class="toolbar">
                            <el-pagination background @size-change="handleSizeChange" @current-change="cateCurrentChange" :page-sizes="[8,10,20,50]" :page-size="pagesize"
                                layout="total,sizes, prev, pager, next, jumper" :total="cateList.length" :current-page="page"
                                style="float:right;">
                            </el-pagination>
                        </el-col>
                        <!--编辑界面-->
                        <el-dialog title="编辑" :visible.sync="anCateVisible">
                            <el-form :model="anCateForm" label-width="100px" ref="anCateForm">
                                <el-row>
                                    <el-col :span="22">
                                        <el-form-item label="分类" prop="name">
                                            <el-input v-model="anCateForm.name" auto-complete="off"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="anCateVisible = false">取消</el-button>
                                <el-button type="primary" @click="editAnCateSubmit">提交</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="留言管理" name="second">
                    <!--列表-->
                    <el-table :data="msgList.slice((msgListPage-1)*msgListPageSize,msgListPage*msgListPageSize)" highlight-current-row v-loading="Loading"
                        style="width: 100%;">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="createTime" label="时间">
                        </el-table-column>
                        <el-table-column prop="addInfo.name" label="昵称">
                            <template slot-scope="scope">
                                <span>{{scope.row.addInfo.isRealName === true ? scope.row.addInfo.name : '匿名' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="comment" label="内容" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" size="small" @click="msgDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="msgListSizeChange" @current-change="msgListCurrentChange" :page-sizes="[8,10,20,50]"
                            :page-size="msgListPageSize" layout="total,sizes, prev, pager, next, jumper" :current-page="msgListPage"
                            :total="msgList.length" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="secondPage" v-show="secondPageVisible" title="详情">
            <el-button style="float:right;" type="danger" @click="backMainPage">返回</el-button>
            <el-row type="flex" justify="center">
                <el-col :span="20">
                    <el-row>
                        <el-col :span="6">
                            <img :src="detailList.addInfo.avatar" style="display:block;height: 70px;border-radius: 50%;width: 70px;">
                            <p style="width:70px;text-align:center">
                                {{detailList.addInfo.isRealName === true ? detailList.addInfo.name : '匿名'}}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <i class="fa fa-tags mr10"></i>{{detailList.type || ' - '}}
                        </el-col>
                        <el-col :span="6">发布时间：{{detailList.createTime || ' - '}}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <p style="text-align: justify;text-indent: 28px;">{{detailList.content || ' - '}}</p>
                        </el-col>
                    </el-row>
                    <el-row class="mb20" v-if="detailList.addInfo.urlList">
                        <el-col>
                            <img style="vertical-align: top;width:100px;margin-right:10px;border-radius: 6px;" v-for="item in detailList.addInfo.urlList"
                                :src="item" @click="handlePictureCardPreview(item)">
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" style="height: 100%;" :src="dialogImageUrl">
                            </el-dialog>
                        </el-col>
                    </el-row>
                    <el-row class="mb20">
                        <el-col :span="3">阅读
                            <i class="fa fa-eye mr10"></i>{{detailList.likeNum}}
                        </el-col>
                        <el-col :span="3">点赞
                            <i class="fa fa-thumbs-o-up mr10"></i>{{detailList.likeNum}}
                        </el-col>
                        <el-col :span="3">评论
                            <i class="fa fa-commenting-o mr10"></i>{{detailList.commentNum}}
                        </el-col>
                        <el-col :span="3">
                            <el-button style="line-height: 0px;" type="danger" size="small" @click="delTopicThis">屏蔽该话题</el-button>
                        </el-col>
                    </el-row>
                    <div class="bottomTips">
                        <el-tabs v-model="activeBT" type="card" @tab-click="handleClick">
                            <el-tab-pane :label="'留言（'+ commentLists.length+')' " name="firstTips">
                                <ul class="comCont">
                                    <li v-for="item in commentLists.slice((commentListsPage-1)*commentListsPageSize,commentListsPage*commentListsPageSize) ">
                                        <label>{{item.addInfo.isRealName === true ? item.addInfo.name : '匿名' }} ({{item.createTime}})
                                        </label>
                                        <div class="commentR">{{item.comment}}
                                            <div class="comRBody" v-if="item.replyList && item.replyList.length > 0" v-for="childitem in item.replyList">
                                                回复 {{childitem.addInfo.isRealName === true ? childitem.addInfo.name : '匿名'}} （{{childitem.createTime}}）：{{childitem.reply}}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <el-row>
                                    <el-col :span="24" class="toolbar">
                                        <el-pagination background @size-change="commentListsPageSizeChange" @current-change="commentListsPageCurrentChange" :page-sizes="[20,50,100]"
                                            :page-size="commentListsPageSize" layout="total,sizes, prev, pager, next, jumper"
                                            :total="commentLists.length" :current-page="commentListsPage" style="float:right;">
                                        </el-pagination>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane :label="'举报（'+ reportLists.length+')'" name="secondTips">
                                <ul class="comCont">
                                    <li v-for="item in reportLists">
                                        <label>{{item.addInfo.userInfo.addInfo.nickName}} {{item.createTime}}</label>
                                        <div class="commentR">
                                            {{item.tipOffCause}}
                                        </div>
                                        <span class="topicType">{{item.tipOffType}}</span>
                                    </li>
                                </ul>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import {
        showTopic,
        delTopic,
        subsUrl,
        tipsOffUrl,
        subComs,
        delSubCom,
        findDic,
        deleteDict,
        showDict,
        addDict,
    } from '../../api/api'

    export default {
        data() {
            return {
                firstVisible: true,
                secondVisible: false,
                dialogImageUrl: '',
                dialogVisible: false,
                page: 1,
                msgListPage: 1,
                commentListsPage: 1,
                pagesize: 8,
                msgListPageSize: 8,
                commentListsPageSize: 20,
                mainPageVisible: true,
                secondPageVisible: false,
                activeTopicName: 'first',
                topicFilters: {
                    searchTitle: '',
                    secCateValue: '',
                    timeTopicValue: []
                },
                topicList: [],
                selectTopicArr: [], //列表选中列
                activeBT: 'firstTips',
                commentLists: [],
                reportLists: [],
                msgList: [],
                Loading: false,
                detailList: {
                    id: "",
                    parkId: "",
                    userId: "",
                    type: "",
                    title: "",
                    updateTime: "",
                    createTime: "",
                    content: "",
                    addInfo: {
                        name: "",
                        urlList: [],
                        avatar: "",
                        isRealName: true
                    },
                    isEnabled: 1,
                    deleted: 1,
                    likeNum: 0,
                    commentNum: 0,
                    tipsOfNum: 0,
                    collectNum: 0
                },
                category: '',
                cateList: [],
                anCateSels: [], // 类别管理列表选中项
                anCateVisible: false,
                anCateForm: {},
                cateDic: {},
            }
        },
        methods: {
            // 编辑类别管理
            editAnCateSubmit() {
                this.$refs.anCateForm.validate((valid) => {
                    if (valid) {
                        let data = {
                            parkId: localStorage.getItem("parkId"),
                            name: this.anCateForm.name,
                            code: this.cateDic.code + '.' + this.anCateForm.name,
                            pid: this.cateDic.id,
                            pname: this.cateDic.name,
                            id: this.anCateForm.id,
                            addInfo: {}
                        };
                        this.$post(addDict, data)
                            .then((res) => {
                                this.anCateVisible = false;
                                this.getCategory();
                            })
                    }
                });
            },
            // 类别管理分页
            cateCurrentChange(val) {
                this.page = val;
                this.getCategory();
            },
            // 类别管理显示编辑界面
            anCateEdit(index, row) {
                this.anCateVisible = true;
                this.anCateForm = row;
            },
            selsCateChange(val) {
                this.anCateSels = val;
            },
            // 类别管理列表删除
            anCateDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(deleteDict + row.id)
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCategory();
                        });
                }).catch(() => {});
            },
            // 类别管理列表
            getCategory() {
                this.Loading = true;
                this.$get(showDict + '话题')
                    .then((res) => {
                        this.cateList = res;
                        this.Loading = false;
                    })
            },
            // 类别管理获取Pid
            getAnCateDic() {
                this.$get(findDic + '话题').then((res) => {
                    this.cateDic = res[0];
                })
            },
            // 类别管理添加
            cateAdd() {
                let data = {
                    parkId: localStorage.getItem("parkId"),
                    name: this.category,
                    code: this.cateDic.code + '.' + this.category,
                    pid: this.cateDic.id,
                    pname: this.cateDic.name,
                    addInfo: {}
                };
                this.$post(addDict, data)
                    .then((res) => {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.getCategory();
                    });
                this.category = '';
            },
            //  类别管理批量删除
            cateBatchRemove() {
                if (this.anCateSels.length === 0) {
                    this.$message({
                        message: '请先选择分类',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认删除选中的分类？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.anCateSels) {
                            this.$del(deleteDict + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已删除 "${i.name}" 话题`,
                                    type: 'success'
                                });
                                this.getCategory();
                            });
                        }
                    }).catch(() => {});
                }
            },
            // 话题管理 类别管理
            cateMg() {
                this.firstVisible = false;
                this.secondVisible = true;
                this.page = 1;
            },
            backToFirstAn() {
                this.firstVisible = true;
                this.secondVisible = false;
                this.page = 1;
            },
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                this.page = 1;
            },
            // 获取话题列表
            getTopic() {
                this.getTopicList(showTopic)
            },
            // 话题 列表数据
            getTopicList(url) {
                this.Loading = true;
                this.$get(url)
                    .then((res) => {
                        this.topicList = res;
                        this.Loading = false;
                    })
            },
            // 按条件模糊查询
            getQueryTopic() {
                let url = showTopic;
                let startTime = this.topicFilters.timeTopicValue[0];
                let endTime = this.topicFilters.timeTopicValue[1];
                let type = this.topicFilters.secCateValue;
                let title = this.topicFilters.searchTitle;
                url = startTime === undefined ? url + '' : url + '&startTime=' + startTime.replace(/-/g, '/');
                url = endTime === undefined ? url + '' : url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                url = type === '' ? url + '' : url + '&type=' + type;
                this.getTopicList(url);
            },
            // 获取留言列表
            getMsg() {
                this.Loading = true;
                this.$get(subComs)
                    .then((res) => {
                        this.msgList = res;
                        this.Loading = false;
                    })
            },
            //话题批量屏蔽
            selsTopicChange: function (val) {
                this.selectTopicArr = val;
            },
            topicBatchRemove: function () {
                if (this.selectTopicArr.length === 0) {
                    this.$message({
                        message: '请先选择话题',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认屏蔽选中的话题？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.selectTopicArr) {
                            this.$del(delTopic + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已屏蔽 "${i.title}" 话题`,
                                    type: 'success'
                                });
                                this.getTopic();
                            });
                        }
                    }).catch(() => {});
                }
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            msgListSizeChange(val) {
                this.msgListPageSize = val;
            },
            commentListsPageSizeChange(val) {
                this.commentListsPageSize = val;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getTopic();
            },
            msgListCurrentChange(val) {
                this.msgListPage = val;
                this.getMsg();
            },
            commentListsPageCurrentChange(val) {
                this.commentListsPage = val;
                this.getSubComment(this.detailList.id);
            },
            //屏蔽
            topicDel(index, row) {
                this.$confirm('确认屏蔽该话题吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(delTopic + row.id)
                        .then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getTopic();
                        });
                }).catch(() => {});
            },
            //屏蔽
            delTopicThis() {
                this.$confirm('确认屏蔽该话题吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(delTopic + this.detailList.id)
                        .then(res => {
                            this.secondPageVisible = false;
                            this.mainPageVisible = true;
                            this.$message({
                                message: '屏蔽成功',
                                type: 'success'
                            });
                            this.getTopic();
                        });
                }).catch(() => {});
            },
            topicView(index, row) {
                console.log(JSON.stringify(row))
                this.mainPageVisible = false;
                this.secondPageVisible = true;
                this.detailList = row;
                this.getSubComment(this.detailList.id);
                this.getTipsOff(this.detailList.id);
            },
            // 获取留言
            getSubComment(id) {
                this.$get(subsUrl + id)
                    .then((res) => {
                        this.commentLists = res;
                    })
            },
            // 举报
            getTipsOff(id) {
                this.$get(tipsOffUrl + id)
                    .then((res) => {
                        this.reportLists = res;
                    })
            },
            backMainPage() {
                this.mainPageVisible = true;
                this.secondPageVisible = false;
            },
            commentCurrentChange(val) {
                this.page = val;
                this.getSubComment(this.detailList.id);
            },
            reportCurrentChange(val) {
                this.page = val;
                this.getTipsOff(this.detailList.id);
            },
            // 屏蔽
            msgDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$del(delSubCom + row.id)
                        .then( res=>{
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getMsg();
                        });
                }).catch(() => {});
            },
        },
        mounted() {
            this.getTopic();
            this.getMsg();
            this.getAnCateDic();
            this.getCategory();
        }
    }
</script>

<style lang="scss">
    .interact {
        text-align: center;
        li {
            display: inline-block;
            width: 30%;
            height: 100px;
            border-left: 1px solid #ddd;
            &:first-child {
                border: 0;
            }
            label {
                display: block;
                height: 50px;
                line-height: 50px;
                margin-bottom: 15px;
            }
        }
    }



    .left {
        float: left;
    }

    .center {
        text-align: center;
    }

    .text-left {
        text-align: left;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .publish {
        float: left;
        img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }

    .bottomTips {
        .el-tab-pane {
            .comCont {
                li {
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                    label {
                        display: inline-block;
                        width: 20%;
                        color: #aaa;
                        vertical-align: top;
                    }
                    .commentR {
                        display: inline-block;
                        text-align: justify;
                        width: 78%;
                        .comRBody {
                            border: 1px solid #ccc;
                            padding: 5px 8px;
                            margin: 5px 0;
                            color: #888;
                            background: #f3f3f3;
                        }
                    }
                    .topicType {
                        border: 1px solid #f00;
                        border-radius: 3px;
                        padding: 6px;
                        color: #333;
                    }
                }
            }
        }

    }
</style>