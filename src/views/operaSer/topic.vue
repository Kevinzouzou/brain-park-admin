<template>
    <section>
        <div class="mainPage" v-show="mainPageVisible">
            <el-tabs v-model="activeTopicName" type="card" @tab-click="handleClick">
                <el-tab-pane label="话题管理" name="first">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="topicFilters">
                            <el-form-item>
                                <el-button type="primary" @click="cateMg">类别管理</el-button>
                                <el-select v-model="secCateValue" placeholder="请选择">
                                    <el-option v-for="item in cateOptions" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <!--<p>组件值：{{ timerValue }}</p>-->
                                    <el-date-picker v-model="timeTopicValue" type="daterange" start-placeholder="开始日期"
                                                    end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                    :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="topicFilters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryTopic">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="topicBatchRemove" :disabled="this.sels.length===0">批量屏蔽</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="topicList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="topicLoading" @selection-change="selsTopicChange" style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="addInfo.publisher.addInfo.nickName" label="昵称" sortable>
                        </el-table-column>
                        <el-table-column prop="type" label="类别" sortable>
                        </el-table-column>
                        <el-table-column prop="content" label="内容" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="updateTime" label="时间" sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="success" size="small" @click="topicInteract(scope.$index, scope.row)">互动</el-button>
                                <el-button type="info" size="small" @click="topicView(scope.$index, scope.row)">查看</el-button>
                                <el-button type="danger" size="small" @click="topicDel(scope.$index, scope.row)">屏蔽</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background
                                       @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       :page-sizes="[7,8,10,20]"
                                       :page-size="pagesize"
                                       layout="total,sizes, prev, pager, next, jumper"
                                       :current-page="page"
                                       :total="topicTotal"
                                       style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--互动-->
                    <el-dialog title="互动数据" :visible.sync="topicInteractVisible" >
                        <ul class="interact">
                            <li>
                                <label>点赞</label>
                                <span>{{topicData.likeNum}}</span>
                            </li>
                            <li>
                                <label>收藏</label>
                                <span>{{topicData.collectNum}}</span>
                            </li>
                            <li>
                                <label>举报</label>
                                <span>{{topicData.tipOfNum}}</span>
                            </li>
                        </ul>
                    </el-dialog>

                </el-tab-pane>
                <el-tab-pane label="留言管理" name="second">
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                       留言管理
                    </el-col>
                    <!--列表-->
                    <el-table :data="msgList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="msgLoading" style="width: 100%;">
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="createTime" label="时间" sortable>
                        </el-table-column>
                        <el-table-column prop="addInfo.userInfo.addInfo.nickName" label="昵称" sortable>
                        </el-table-column>
                        <el-table-column prop="comment" label="内容" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="danger" size="small" @click="msgDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background
                                       @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       :page-sizes="[7,8,10,20]"
                                       :page-size="pagesize"
                                       layout="total,sizes, prev, pager, next, jumper"
                                       :current-page="page"
                                       :total="msgTotal"
                                       style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="secondPage" v-show="secondPageVisible" title="详情">
           <el-button class="backUp" type="danger" @click="backMainPage">返回</el-button>
            <ul class="publish center">
                <li>
                    <img :src="detailList.addInfo.publisher.addInfo.avatarUrl" class="pub">
                    <!--<img v-if="pubImg" src="../../assets/user.png" class="pub">-->
                </li>
                <li>{{detailList.addInfo.publisher.addInfo.nickName}}</li>
            </ul>
            <div class="mainContent">
                <span class="left topicType">{{detailList.type}}</span>
                <div class="center pubTime">发布时间：{{detailList.createTime}}</div>
                <div class="content">{{detailList.content}}</div>
                <div v-if="bannerUrl.length>0">
                    <img v-for="item in bannerUrl" :src="item" @click="handlePictureCardPreview(item)">
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>
                <ul class="tips">
                    <li>{{detailList.lookUpNum}}</li>
                    <li>{{detailList.likeNum}}</li>
                    <li>{{detailList.commentNum}}</li>
                </ul>
                <el-button type="danger" size="small" @click="delTopicThis">屏蔽</el-button>
                <div class="bottomTips">
                    <el-tabs v-model="activeBT" type="card" @tab-click="handleClick">
                        <!--<el-tab-pane label="留言" name="firstTips">-->
                        <el-tab-pane :label=theComment name="firstTips">
                            <ul class="comCont">
                                <li v-for="item in commentLists">
                                    <label>{{item.addInfo.userInfo.addInfo.nickName}} {{item.createTime}}</label>
                                    <div class="commentR">
                                        {{item.comment}}
                                        <div v-if="item.replyList.length>0" class="comRBody" v-for="childitem in item.replyList">
                                            回复{{childitem.addInfo.userInfo.addInfo.nickName}} （{{childitem.createTime}}）：{{childitem.reply}}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!--分页-->
                            <el-col :span="24" class="toolbar">
                                <el-pagination background
                                               @size-change="handleSizeChange"
                                               @current-change="commentCurrentChange"
                                               :page-sizes="[7,8,10,20]"
                                               :page-size="pagesize"
                                               layout="total,sizes, prev, pager, next, jumper"
                                               :total="commentTotal"
                                               :current-page="page"
                                               style="float:right;">
                                </el-pagination>
                            </el-col>
                        </el-tab-pane>
                        <!--<el-tab-pane label="举报" name="secondTips">-->
                        <el-tab-pane :label=theReport name="secondTips">
                            <ul class="comCont">
                                <li v-for="item in reportLists">
                                    <label>{{item.addInfo.userInfo.addInfo.nickName}} {{item.createTime}}</label>
                                    <div class="commentR">
                                        {{item.tipOffCause}}
                                    </div>
                                    <span class="topicType">{{item.tipOffType}}</span>
                                </li>
                            </ul>
                            <!--分页-->
                            <el-col :span="24" class="toolbar">
                                <el-pagination background
                                               @size-change="handleSizeChange"
                                               @current-change="reportCurrentChange"
                                               :page-sizes="[7,8,10,20]"
                                               :page-size="pagesize"
                                               layout="total,sizes, prev, pager, next, jumper"
                                               :total="reportTotal"
                                               :current-page="page"
                                               style="float:right;">
                                </el-pagination>
                            </el-col>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

    </section>
</template>

<script type="text/ecmascript-6">
    import {showTopic, delTopic, subsUrl,tipsOffUrl,subComs,delSubCom, delCir,addCir,addAct,delAct,uploadPic, batchRemoveUser, editUser,} from '../../api/api'

    export default {
        data(){
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                pagesize:7,
                page:1,
                mainPageVisible:true,
                secondPageVisible:false,
                activeTopicName:'first',
                cateOptions: [
                    {
                        value: '选项1',
                        label: '拼单'
                    },
                    {
                        value: '选项2',
                        label: '交友'
                    },
                    {
                        value: '选项3',
                        label: '旅游'
                    },
                    {
                        value: '选项4',
                        label: '吐槽'
                    }
                ],
                secCateValue: '',
                timeTopicValue:[],
                topicFilters: {
                    searchTitle: ''
                },
                topicList:[],
                topicLoading:false,
                sels: [],//列表选中列
                topicTotal:0,
                topicData:{
                    likeNum:9,
                    collectNum:8,
                    tipOfNum:7
                },
                topicInteractVisible:false,    //互动界面是否显示
                pubImg:'../../assets/user.png',
                publish:'张三丰',
                type:'旅游',
                publishTime:'2018-05-06 19:30',
                pubContent:'美国商务部长威尔伯罗斯美国东部时间5月14日表示，愿意尽快改变对中国手机制造商中兴通讯的销售禁令，此前一天美国总统特朗普表示，要求美国商务部帮助中兴通讯恢复运营，“中国流失了很多工作岗位”。这一消息遭致很多美国媒体的质疑，一些评论批评标榜“美国优先”的特朗普在此事上把中国人的就业放到了优先考虑的地方。',
                bannerUrl:[
                    '../../assets/guide.jpg',
                    '../../assets/guide.jpg',
                    '../../assets/guide.jpg'
                ],
                looks:100,
                praise:50,
                comments:20,
                informs:5,
                activeBT:'firstTips',

                commentTotal:2,

                commentLists:[],
                reportTotal:1,
                reportLists:[],

                msgList:[],
                msgLoading:false,
                msgTotal:2,
                detailList:{
                    addInfo:{
                        publisher:{
                            addInfo:{
                                nickName:'',
                                avatarUrl:''
                            }
                        }
                    }
                },
                theComment:'',
                theReport:'',


            }
        },
        methods:{
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                this.page=1;
            },
            // 类别管理
            cateMg(){

            },
            // 获取话题列表
            getTopic(){
                this.topicLoading=true;
                this.$get(showTopic)
                    .then((res) => {
                        this.topicList=res;
                        this.topicTotal=this.topicList.length>0?this.topicList.length:1;
                        this.topicLoading=false;
                    })
            },
            // 按条件模糊查询
            getQueryTopic(){

            },
            // 获取留言列表
            getMsg(){
                this.msgLoading=true;
                this.$get(subComs)
                    .then((res) => {
                        this.msgList=res;
                        this.msgTotal=this.msgList.length>0?this.msgList.length:1;
                        this.msgLoading=false;
                    })
            },
            //话题批量屏蔽
            topicBatchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.topicLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.topicLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTopic();
                    });
                }).catch(() => {

                });
            },
            selsTopicChange: function (sels) {
                this.sels = sels;
            },
            handleSizeChange(val) {
                this.pagesize=val;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getTopic();
            },
            topicInteract(index,row){
                this.topicInteractVisible=true;
                this.topicData.likeNum=row.likeNum?row.likeNum:0;
                this.topicData.collectNum=row.collectNum?row.collectNum:0;
                this.topicData.tipOfNum=row.tipOfNum?row.tipOfNum:0;
            },
            //屏蔽
            topicDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.topicLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    // let url='/api/subject/deleteSubject/'+para.id;
                    let self=this;
                    this.$del(delTopic+para.id)
                        .then(function(response) {
                            self.topicLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getTopic();
                        });
                }).catch(() => {

                });
            },
            delTopicThis: function () { //屏蔽
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.secondPageVisible = true;
                    //NProgress.start();
                    let paraId = this.detailList.id;
                    // let url='/api/subject/deleteSubject/'+para.id;
                    let self=this;
                    this.$del(delTopic+paraId)
                        .then(function(response) {
                            self.secondPageVisible = false;
                            self.mainPageVisible=true;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getTopic();
                        });
                }).catch(() => {

                });
            },
            topicView(index,row){
                this.mainPageVisible=false;
                this.secondPageVisible=true;
                this.detailList=row;
                this.bannerUrl=this.detailList.addInfo.urlList;
                let id=this.detailList.id;
                this.getSubComment(id);
                this.getTipsOff(id);
            },
            getSubComment(id){ //获取留言
                this.$get(subsUrl+id)
                    .then((res) => {
                        this.commentLists=res;
                        this.theComment='留言（'+this.commentLists.length+'）';
                        this.commentTotal=this.commentLists.length>0?this.commentLists.length:1;
                    })
            },
            getTipsOff(id){ //举报
                this.$get(tipsOffUrl+id)
                    .then((res) => {
                        this.reportLists=res;
                        this.theReport='举报（'+this.reportLists.length+'）';
                        this.reportTotal=this.reportLists.length>0?this.reportLists.length:1;
                    })
            },
            backMainPage(){
                this.mainPageVisible=true;
                this.secondPageVisible=false;
            },
            commentCurrentChange(val){
                this.page=val;
                this.getSubComment(this.detailList.id);
            },
            reportCurrentChange(val){
                this.page=val;
                this.getTipsOff(this.detailList.id);
            },
            //屏蔽
            msgDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.msgLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(delSubCom+para.id)
                        .then(function(response) {
                            self.msgLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getMsg();
                        });
                }).catch(() => {

                });
            },


        },
        mounted(){
            this.getTopic();
            this.getMsg();
        }

    }
</script>

<style lang="scss">
    .interact{
        text-align: center;
        li{
            display: inline-block;
            width: 30%;
            height: 100px;
            border-left: 1px solid #ddd;
            &:first-child{
                border: 0;
            }
            label{
                display: block;
                height: 50px;
                line-height: 50px;
                margin-bottom: 15px;
            }
        }
    }
    .backUp{
        float: right;
    }
    .left{float: left;}
    .center{text-align: center;}
    .text-left{text-align: left;}
    ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .publish{
        float: left;
        img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }
    .mainContent{
        width: 80%;
        margin: 10px auto;
        .topicType{
            color: #866;
            font-weight: 600;
        }
        .pubTime{
            line-height: 60px;
        }
        .content{
            text-align: justify;
            text-indent: 28px;
        }
        img{
            height: 120px;
            margin: 10px 15px;
        }
        .el-dialog__body{
            img{
                margin: 0;
            }
        }
        .tips{
            &:after{
                content: '';
                display: block;
                clear: both;
            }
            li{
                display: inline-block;
                padding-left: 45px;
                margin: 5px 5px 15px;
                width: 40px;
                height: 40px;
                line-height: 40px;
                background: url(../../assets/icon_show.png) no-repeat left center;
                background-size: 40px 30px;
                &:first-child{
                    background-size: 40px 40px;
                }
                &:nth-child(2){
                    background-image: url(../../assets/icon_praise.png);
                }
                &:nth-child(3){
                    background-image: url(../../assets/icon_comment.png);
                }
            }
        }
        .bottomTips{
            .el-tab-pane{
                .comCont{
                    li{
                        border-bottom: 1px solid #ddd;
                        padding: 10px 0;
                        label{
                            display: inline-block;
                            width: 20%;
                            color: #aaa;
                            vertical-align: top;
                        }
                        .commentR{
                            display: inline-block;
                            text-align: justify;
                            width: 78%;
                            .comRBody{
                                border: 1px solid #ccc;
                                padding: 5px 8px;
                                margin: 5px 0;
                                color: #888;
                                background: #f3f3f3;
                            }
                        }
                        .topicType{
                            border: 1px solid #f00;
                            border-radius: 3px;
                            padding: 6px;
                            color: #333;
                        }
                    }
                }
            }

        }
    }
</style>
