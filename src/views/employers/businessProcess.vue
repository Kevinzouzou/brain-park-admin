<!--<template>-->
    <!--<section>-->
        <!--<el-tabs v-model="activeName" type="card" @tab-click="handleClick">-->
            <!--<el-tab-pane label="入驻申请" name="first">-->
                <!--<el-col :span="24" justify="center">-->
                    <!--<el-form :inline="true" :model="enterFilters">-->
                        <!--<el-form-item>-->
                            <!--<div class="block">-->
                                <!--&lt;!&ndash;<p>组件值：{{ timerValue }}</p>&ndash;&gt;-->
                                <!--<el-date-picker v-model="timeValue" type="daterange" start-placeholder="开始日期"-->
                                                <!--end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"-->
                                                <!--:default-time="['00:00:00', '23:59:59']">-->
                                <!--</el-date-picker>-->
                            <!--</div>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item>-->
                            <!--<el-input v-model="enterFilters.searchTitle" placeholder="公司名称搜索"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item>-->
                            <!--<el-button type="primary" v-on:click="getInApply">查询</el-button>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
                <!--</el-col>-->
                <!--&lt;!&ndash;工具条&ndash;&gt;-->
                <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
                    <!--<el-form :inline="true">-->
                        <!--<el-form-item>-->
                            <!--<el-button type="danger" @click="allDeal">全部</el-button>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item>-->
                            <!--<el-button type="success" @click="pending">待处理</el-button>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item>-->
                            <!--<el-button type="primary" @click="processed">已处理</el-button>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
                <!--</el-col>-->
                <!--&lt;!&ndash;列表&ndash;&gt;-->
                <!--<el-table :data="inApplyList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="inApplyLoading" style="width: 100%;">-->
                    <!--<el-table-column type="index" width="60">-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="addInfo.companyName" label="公司名称" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="addInfo.industry" label="所属行业" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="addInfo.contact" label="联系人" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="lookUpNum" label="申请时间" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="applyNum" label="状态" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="lookUpNum" label="管理人" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="applyNum" label="对接人" sortable>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="操作">-->
                        <!--<template scope="scope">-->
                            <!--<el-button type="success" size="small" @click="hASigns(scope.$index, scope.row)">报名</el-button>-->
                            <!--<el-button type="info" size="small" @click="hAedit(scope.$index, scope.row)">编辑</el-button>-->
                            <!--<el-button type="danger" size="small" @click="hADel(scope.$index, scope.row)">删除</el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                <!--</el-table>-->
                <!--&lt;!&ndash;分页&ndash;&gt;-->
                <!--<el-col :span="24" class="toolbar">-->
                    <!--<el-pagination background-->
                                   <!--@size-change="highActSizeChange"-->
                                   <!--@current-change="highActCurChange"-->
                                   <!--:page-sizes="[7,8,10,20]"-->
                                   <!--:page-size="pagesize"-->
                                   <!--layout="total, sizes, prev, pager, next, jumper"-->
                                   <!--:total="highActTotal"-->
                                   <!--:current-page="page"-->
                                   <!--style="float:right;">-->
                    <!--</el-pagination>-->
                <!--</el-col>-->
                <!--&lt;!&ndash;新增/编辑界面&ndash;&gt;-->
                <!--<el-dialog :title=addEditTitle :visible.sync="addEditVisible">-->
                    <!--<el-form :model="addEditForm" label-width="80px" ref="addEditForm">-->
                        <!--<el-form-item label="标题" prop="title">-->
                            <!--<el-input v-model="addEditForm.title" auto-complete="off"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="类别" prop="circleSec">-->
                            <!--<el-select v-model="secCateValue" placeholder="请选择" @change="secHighValue">-->
                                <!--<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="缩略图">-->
                            <!--<el-upload action="/api/OperFile/uploadFile/" list-type="picture-card"-->
                                       <!--:on-preview="handleHAPictureCardPreview" :on-remove="handleHARemove"-->
                                       <!--:file-list="imgHAList" :on-success="moreHAShow">-->
                                <!--<i class="el-icon-plus"></i>-->
                            <!--</el-upload>-->
                            <!--<el-dialog :visible.sync="dialogHAVisible">-->
                                <!--<img width="100%" :src="dialogHAImageUrl" >-->
                            <!--</el-dialog>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="活动时间">-->
                            <!--<el-date-picker v-model="addEditForm.actTimerValue" type="daterange" start-placeholder="开始日期"-->
                                            <!--end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"-->
                                            <!--:default-time="['00:00:00', '23:59:59']">-->
                            <!--</el-date-picker>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="活动地址" prop="address">-->
                            <!--<el-input v-model="addEditForm.address" auto-complete="off"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="详细介绍">-->
                            <!--<UE :id=ue @editorChange="hActAddChange"></UE>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
                    <!--<div slot="footer" class="dialog-footer">-->
                        <!--<el-button @click.native="addEditVisible = false">取消</el-button>-->
                        <!--<el-button type="primary" @click.native="addHighActSubmit" :loading="addEditLoading">提交</el-button>-->
                    <!--</div>-->
                <!--</el-dialog>-->
                <!--&lt;!&ndash;报名&ndash;&gt;-->
                <!--<el-dialog title="报名人员" :visible.sync="hASignsVisible" >-->
                    <!--<div>-->
                        <!--<span>活动标题：</span>-->
                        <!--<span >{{message.title}}</span>-->
                    <!--</div>-->
                    <!--<div>-->
                        <!--<span>活动时间：</span>-->
                        <!--<span  >{{message.startTime}}</span> ~-->
                        <!--<span >{{message.endTime}}</span>-->
                    <!--</div>-->
                    <!--<el-table :data="hASignsData.slice((page-1)*pagesize,page*pagesize)">-->
                        <!--<el-table-column type="index" ></el-table-column>-->
                        <!--<el-table-column property="name" label="姓名"></el-table-column>-->
                        <!--<el-table-column prop="addInfo.enterpriseName" label="公司" ></el-table-column>-->
                        <!--<el-table-column property="cellphone" label="手机"></el-table-column>-->
                        <!--<el-table-column prop="sex" label="性别" :formatter="forSex" ></el-table-column>-->
                        <!--<el-table-column prop="joinTime" label="报名时间" ></el-table-column>-->
                    <!--</el-table>-->
                    <!--<el-pagination class="el-pages" background-->
                                   <!--@size-change="highActSizeChange"-->
                                   <!--@current-change="highSignsCurChange"-->
                                   <!--:page-sizes="[7,8,10,20]"-->
                                   <!--:page-size="pagesize"-->
                                   <!--layout="total,sizes, prev, pager, next, jumper"-->
                                   <!--:current-page="page"-->
                                   <!--:total="hASignstotal">-->

                    <!--</el-pagination>-->
                <!--</el-dialog>-->

            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="装修申请" name="second">-->

            <!--</el-tab-pane>-->
        <!--</el-tabs>-->
    <!--</section>-->
<!--</template>-->

<!--<script>-->
    <!--import {showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'-->

    <!--export default {-->
        <!--data(){-->
            <!--return {-->
                <!--page:1,-->
                <!--pagesize:7,-->
                <!--activeName:'first',-->
                <!--enterFilters: {-->
                    <!--searchTitle: ''-->
                <!--},-->
                <!--timeValue:[],-->
                <!--inApplyList:[],-->
                <!--inApplyLoading:false,-->

            <!--}-->
        <!--},-->
        <!--methods:{-->
            <!--getInApply(){ //入驻申请数据-->
                <!--// let type='意见反馈';-->
                <!--// this.feBackLoading=true;-->
                <!--// this.$get(proList+type)-->
                <!--//     .then((res) => {-->
                <!--//         this.feedBackList=res;-->
                <!--//         this.feBackTotal=this.feedBackList.length>0?this.feedBackList.length:1;-->
                <!--//         this.feBackLoading=false;-->
                <!--//     })-->
            <!--},-->
            <!--allDeal(){ //全部-->

            <!--},-->
            <!--pending(){ //待处理-->

            <!--},-->
            <!--processed(){ //已处理-->

            <!--},-->

        <!--}-->
    <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->