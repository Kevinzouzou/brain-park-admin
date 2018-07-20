<template>
    <section>
        <div class="mainPage" v-show="mainPageVisible">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="高端活动" name="first">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="highFilters">
                            <el-form-item>
                                <el-button type="primary" @click="cateMg">类别管理</el-button>
                                <el-select v-model="highFilters.secCateValue" placeholder="请选择">
                                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">

                                    <el-date-picker v-model="highFilters.timeValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="highFilters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryHighAct">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="highActBatchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="highActAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="highActList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="highActLoading" @selection-change="selsHighActChange"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" sortable show-overflow-tooltip="">
                        </el-table-column>
                        <el-table-column prop="type" label="类别" sortable>
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间" sortable>
                        </el-table-column>
                        <el-table-column prop="lookUpNum" label="浏览量" sortable>
                        </el-table-column>
                        <el-table-column prop="applyNum" label="报名" sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="success" size="small" @click="hASigns(scope.$index, scope.row)">报名</el-button>
                                <el-button type="info" size="small" @click="hAedit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="hADel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highActSizeChange" @current-change="highActCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="highActTotal" :current-page="page" style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title=addEditTitle :visible.sync="addEditVisible">
                        <el-form :model="addEditForm" label-width="80px" ref="addEditForm">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="addEditForm.title" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="类别" prop="circleSec">
                                <el-select v-model="secCateValue" placeholder="请选择" @change="secHighValue">
                                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="缩略图">
                                <el-upload :action=url list-type="picture-card" :data="othParams" ref="upload" :on-preview="handleHAPictureCardPreview" :on-remove="handleHARemove"
                                    :file-list="imgHAList" :on-success="moreHAShow">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogHAVisible">
                                    <img width="100%" :src="dialogHAImageUrl">
                                </el-dialog>
                            </el-form-item>
                            <el-form-item label="活动时间">
                                <el-date-picker v-model="addEditForm.actTimerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                    :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="活动地址" prop="addInfo.location">
                                <el-input v-model="addEditForm.addInfo.location" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="详细介绍">
                                <UE :id=ue @editorChange="hActAddChange"></UE>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click.native="addEditVisible = false">取消</el-button>
                            <el-button type="primary" @click.native="addHighActSubmit" :loading="addEditLoading">提交</el-button>
                        </div>
                    </el-dialog>
                    <!--报名-->
                    <el-dialog title="报名人员" :visible.sync="hASignsVisible" width="70%">
                        <div>
                            <span>活动标题：</span>
                            <span>{{detailList.title}}</span>
                        </div>
                        <div>
                            <span>活动时间：</span>
                            <span>{{detailList.addInfo.startTime}}</span> ~
                            <span>{{detailList.addInfo.endTime}}</span>
                        </div>
                        <el-table :data="hASignsData.slice((page-1)*pagesize,page*pagesize)">
                            <el-table-column type="index"></el-table-column>
                            <el-table-column property="addInfo.userInfo.addInfo.nickName" label="姓名"></el-table-column>
                            <el-table-column prop="addInfo.enterpriseName" label="公司"></el-table-column>
                            <el-table-column property="addInfo.userInfo.phone" label="手机"></el-table-column>
                            <el-table-column prop="addInfo.userInfo.addInfo.gender" label="性别" :formatter="forSex"></el-table-column>
                            <el-table-column prop="createTime" label="报名时间"></el-table-column>
                        </el-table>
                        <el-pagination class="el-pages" background @size-change="highActSizeChange" @current-change="highSignsCurChange" :page-sizes="[7,8,10,20]"
                            :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="hASignstotal">

                        </el-pagination>
                    </el-dialog>

                </el-tab-pane>
                <el-tab-pane label="商务服务" name="second">
                    <el-col :span="24">
                        <el-tabs v-model="activeSer" @tab-click="handleClick">
                            <el-tab-pane label="商务服务" name="firstSer">
                                <el-col :span="24" justify="center">
                                    <el-form :inline="true" :model="commerSerFilters">
                                        <el-form-item>
                                            <span>日期范围：</span>
                                        </el-form-item>
                                        <el-form-item>
                                            <div class="block">
                                                <el-date-picker v-model="commerSerFilters.timeComSerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                                    value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                                </el-date-picker>
                                            </div>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-input v-model="commerSerFilters.searchTitle" placeholder="搜索标题"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" v-on:click="getQueryCommer">查询</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <!--工具条-->
                                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                                    <el-form :inline="true">
                                        <el-form-item>
                                            <el-button type="danger" @click="comSerBatchRemove" :disabled="this.comSerSels.length===0">批量删除</el-button>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="comSerAdd">新增</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <!--列表-->
                                <el-table :data="comSerList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="comSerLoading" @selection-change="selsComSerChange"
                                    style="width: 100%;">
                                    <el-table-column type="selection" width="55">
                                    </el-table-column>
                                    <el-table-column type="index" width="60">
                                    </el-table-column>
                                    <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="发布时间" sortable>
                                    </el-table-column>
                                    <el-table-column prop="lookUpNum" label="浏览量" sortable>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="info" size="small" @click="comSerEdit(scope.$index, scope.row)">编辑</el-button>
                                            <el-button type="danger" size="small" @click="comSerDel(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--分页-->
                                <el-col :span="24" class="toolbar">
                                    <el-pagination background @size-change="highActSizeChange" @current-change="comSerCurrentChange" :page-sizes="[7,8,10,20]"
                                        :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="comSerTotal"
                                        :current-page="page" style="float:right;">
                                    </el-pagination>
                                </el-col>
                                <!--新增/编辑界面-->
                                <el-dialog :title=addEditTitle :visible.sync="commerSerAEVisible">
                                    <el-form :model="comSerAEForm" label-width="80px" ref="comSerAEForm">
                                        <el-form-item label="标题" prop="title">
                                            <el-input v-model="comSerAEForm.title" auto-complete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="缩略图">
                                            <el-upload :action=url list-type="picture-card" :data="othParams" ref="upload2" :on-preview="handleComSerCardPreview" :on-remove="handleComSerRemove"
                                                :file-list="imgComSerList" :on-success="moreComSerShow">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <el-dialog :visible.sync="dialogComSerVisible">
                                                <img width="100%" :src="dialogComSerImageUrl">
                                            </el-dialog>
                                        </el-form-item>
                                        <el-form-item label="详细介绍">
                                            <UE :id=ue2 @editorChange="comSerAddChange"></UE>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click.native="commerSerAEVisible = false">取消</el-button>
                                        <el-button type="primary" @click.native="addComSerSubmit" :loading="comSerAELoading">提交</el-button>
                                    </div>
                                </el-dialog>
                            </el-tab-pane>
                            <el-tab-pane label="预约管理" name="secondSer">
                                <!-- <el-col :span="24" justify="center">
                                    <el-form :inline="true" :model="bookingFilters">
                                        <el-form-item>
                                            <span>日期范围：</span>
                                        </el-form-item>
                                        <el-form-item>
                                            <div class="block">
                                                <el-date-picker v-model="bookingFilters.timeBookingValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                                    value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                                </el-date-picker>
                                            </div>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-input v-model="bookingFilters.searchTitle" placeholder="搜索标题"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" v-on:click="getQueryBooking">查询</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col> -->
                                <!--工具条-->
                                <el-row type="flex" justify="center">
                                    <el-col :span="22" style="padding-bottom: 0px;">
                                        <el-form :inline="true">
                                            <el-radio-group v-model="selectWeek" @change="commerceCourseListByTime">
                                                <el-radio-button label="本周"></el-radio-button>
                                                <el-radio-button label="下周"></el-radio-button>
                                                <el-radio-button label="后周"></el-radio-button>
                                            </el-radio-group>
                                            <el-button style="float:right" type="text" @click="viewHistory()">查看历史纪录 >></el-button>
                                        </el-form>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 20px;" type="flex" justify="center">
                                    <el-col :span="22">
                                        <table class="appointmentForm">
                                            <tr>
                                                <th width='80' colspan="2">
                                                    日期
                                                </th>
                                                <th width='250'>
                                                    服务课程
                                                </th>
                                                <th width='500'>
                                                    课程描述
                                                </th>
                                                <th>
                                                    预定状态
                                                </th>
                                            </tr>
                                            <tr v-for="item in AppointmentManagementList">
                                                <td>{{item.date}}
                                                    <el-alert v-show="item.today" title="今日" type="success" :closable="false">
                                                    </el-alert>
                                                </td>
                                                <td>{{item.period}}</td>
                                                <td>
                                                    <el-select @change="addOrUpCommerceCourse(item)" v-model="item.addInfo.title" placeholder="请选择" :disabled="item.past === true || item.bookListSize > 0">
                                                        <el-option key="" label="无" value="">
                                                        </el-option>
                                                        <el-option v-for="item in ServiceCourseOption" :key="item.value" :label="item.title" :value="item.title">
                                                        </el-option>
                                                    </el-select>
                                                </td>
                                                <td>{{item.addInfo.content}}</td>
                                                <td>
                                                    <el-button type="text" @click="CommerceCourseStateCheck(item)">{{item.bookListSize}}</el-button>
                                                </td>
                                            </tr>
                                        </table>
                                    </el-col>
                                </el-row>
                                <el-dialog title="预定状态" :visible.sync="ScheduledStateVisible">
                                    <el-row :gutter="20">
                                        <el-col :span="5" :offset="2">{{CommerceCourseState.date}}</el-col>
                                        <el-col :span="5">{{CommerceCourseState.period}}</el-col>
                                        <el-col :span="5">{{CommerceCourseState.addInfo.title}}</el-col>
                                        <el-col :span="5">{{CommerceCourseState.bookListSize}} 个企业已预约</el-col>
                                    </el-row>
                                    <el-row :gutter="20" type="flex" justify="center" style="margin-top:20px;">
                                        <el-col :span="20">
                                            <el-table :data="CommerceCourseState.bookList" height="250" border style="width: 100%">
                                                <el-table-column prop="addInfo.enterprise" label="企业名称">
                                                </el-table-column>
                                                <el-table-column prop="addInfo.name" label="联系人">
                                                </el-table-column>
                                                <el-table-column prop="addInfo.phone" label="电话">
                                                </el-table-column>
                                                <el-table-column label="操作" width="100">
                                                    <template slot-scope="scope">
                                                        <el-button type="danger" size="small" @click="deleteUserTarget(scope.$index, scope.row)">删除</el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-col>
                                    </el-row>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="ScheduledStateVisible = false">关闭</el-button>
                                        <!-- <el-button type="primary" @click="updateServiceCourse('ServiceCourseForm')">保存</el-button> -->
                                    </div>
                                </el-dialog>
                                <div class="historyContent" v-show="HistoryContentShow">
                                    <el-col :span="24" style="padding-bottom: 0px;">
                                        <el-form :inline="true">
                                            <el-form-item>
                                                <div style="color: #606266;">预约历史</div>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-input v-model="HistoryContentFilters.selection" class="userinfo-search" placeholder="输入课程名称或企业名称" prefix-icon="el-icon-search"></el-input>
                                            </el-form-item>
                                            <el-form-item>
                                                <div style="color: #606266;">日期范围：</div>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-date-picker v-model="HistoryContentFilters.startTime" type="daterange" align="right" unlink-panels range-separator="至"
                                                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="HistoryListOptions">
                                                </el-date-picker>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button type="primary" @click="getHistoryContent">搜索</el-button>
                                            </el-form-item>
                                            <el-form-item style="float:right">
                                                <el-button @click="HistoryContentShow = false">关闭预约历史</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                    <!--列表-->
                                    <el-table :data="HistoryList.slice((page-1)*HistoryListPagesize,page*HistoryListPagesize)" highlight-current-row v-loading="HistoryListLoading"
                                        style="width: 100%;">
                                        <el-table-column prop="addInfo.empNo" label="日期">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.name" label="服务课程">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.gender" label="课程详情">
                                        </el-table-column>
                                        <el-table-column prop="departmentInfo.name" label="企业名称">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.position" label="电话">
                                        </el-table-column>
                                    </el-table>
                                    <!--分页-->
                                    <el-col :span="24" class="toolbar">
                                        <el-pagination background @size-change="sizeChange" @current-change="currentChange" :page-sizes="[7,8,10,20]" :page-size="HistoryListPagesize"
                                            layout="total,sizes, prev, pager, next, jumper" :total="parkUserListTotal" :current-page="HistoryListPage"
                                            style="float:right;">
                                        </el-pagination>
                                    </el-col>
                                </div>
                                <!--分页-->
                                <!-- <el-col :span="24" class="toolbar">
                                    <el-pagination background @size-change="highActSizeChange" @current-change="bookingCurrentChange" :page-sizes="[7,8,10,20]"
                                        :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page"
                                        :total="bookingTotal" style="float:right;">
                                    </el-pagination>
                                </el-col> -->
                                <!--新增/编辑界面-->
                                <!-- <el-dialog class="el-book" :title=addEditTitle :visible.sync="bookingVisible">
                                    <el-form :model="bookingAEForm" label-width="80px" ref="bookingAEForm">
                                        <el-form-item label="服务活动" prop="title">
                                            <el-input v-model="bookingAEForm.title" auto-complete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="活动时间">
                                            <el-date-picker v-model="bookingAEForm.activityTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click.native="bookingVisible = false">取消</el-button>
                                        <el-button type="primary" @click.native="addBookingSubmit" :loading="bookingAELoading">提交</el-button>
                                    </div>
                                </el-dialog> -->
                                <!--预约-->
                                <!-- <el-dialog class="el-book" title="从中关村看一个国家的未来  （2018-05-12 星期一）" :visible.sync="bookingInfoVisible">
                                    <ul class="book">
                                        <li class="title">上午</li>
                                        <li>申请时间：{{bookDialogList.amTime}}</li>
                                        <li>申请公司：{{bookDialogList.amCompany}}</li>
                                        <li>申请人：{{bookDialogList.amPerson}}</li>
                                        <li>联系电话：{{bookDialogList.amPhone}}</li>
                                        <li class="title">下午</li>
                                        <li>申请时间：{{bookDialogList.pmTime}}</li>
                                        <li>申请公司：{{bookDialogList.pmCompany}}</li>
                                        <li>申请人：{{bookDialogList.pmPerson}}</li>
                                        <li>联系电话：{{bookDialogList.pmPhone}}</li>
                                    </ul>
                                </el-dialog> -->
                            </el-tab-pane>
                            <el-tab-pane label="服务课程" name="thirdSer">
                                <el-row>
                                    <el-col :span="24" style="padding-bottom: 0px;">
                                        <el-form :inline="true">
                                            <el-form-item>
                                                <el-button type="primary" @click="ServiceCourseAddVisible = true">新增</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <!--列表-->
                                    <el-table :data="ServiceCourseListData" highlight-current-row style="width: 100%;" v-loading="ServiceCourseListLoding">
                                        <el-table-column type="index" width="60" label="序号">
                                        </el-table-column>
                                        <el-table-column prop="title" label="服务课程">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.themeContent" label="课程详情" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="primary" size="small" @click="ServiceCourseEdit(scope.$index, scope.row)">编辑</el-button>
                                                <el-button type="danger" size="small" @click="ServiceCourseDel(scope.$index, scope.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-row>
                                <el-dialog title="新增课程" :visible.sync="ServiceCourseAddVisible">
                                    <el-row :gutter="20">
                                        <el-form :model="ServiceCourseAddForm" label-width="160px" :rules="ServiceCourseAddFormRules" ref="ServiceCourseAddForm">
                                            <el-row :gutter="24">
                                                <el-col :span="10">
                                                    <el-form-item label="课程名称：" prop="title">
                                                        <el-input v-model="ServiceCourseAddForm.title"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="20">
                                                    <el-form-item label="课程详情：" prop="addInfo.themeContent">
                                                        <el-input style="width:100%" type="textarea" v-model="ServiceCourseAddForm.addInfo.themeContent"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-row>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="ServiceCourseAddVisible = false">取消</el-button>
                                        <el-button type="primary" @click="addServiceCourse('ServiceCourseAddForm')">确 定</el-button>
                                    </div>
                                </el-dialog>
                                <el-dialog title="编辑课程" :visible.sync="ServiceCourseEditVisible">
                                    <el-row :gutter="20">
                                        <el-form :model="ServiceCourseForm" label-width="160px" :rules="ServiceCourseAddFormRules" ref="ServiceCourseForm">
                                            <el-row :gutter="24">
                                                <el-col :span="10">
                                                    <el-form-item label="课程名称：" prop="title">
                                                        <el-input v-model="ServiceCourseForm.title"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="20">
                                                    <el-form-item label="课程详情：" prop="addInfo.themeContent">
                                                        <el-input style="width:100%" type="textarea" v-model="ServiceCourseForm.addInfo.themeContent"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-row>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="ServiceCourseEditVisible = false">取消</el-button>
                                        <el-button type="primary" @click="updateServiceCourse('ServiceCourseForm')">确 定</el-button>
                                    </div>
                                </el-dialog>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="信息化建设" name="third">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="infoConFilters">
                            <el-form-item>
                                <span>日期范围：</span>
                            </el-form-item>
                            <el-form-item>
                                <div class="block">
                                    <el-date-picker v-model="infoConFilters.timeinfoConValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="infoConFilters.searchTitle" placeholder="搜索标题"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryInfoCon">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="danger" @click="infoConBatchRemove" :disabled="this.infoConSels.length===0">批量删除</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="infoConAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="infoConList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="infoConLoading" @selection-change="selsInfoConChange"
                        style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间" sortable>
                        </el-table-column>
                        <el-table-column prop="lookUpNum" label="浏览量" sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="info" size="small" @click="infoConEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="infoConDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highActSizeChange" @current-change="infoConCurrentChange" :page-sizes="[7,8,10,20]"
                            :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="infoConTotal"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title=addEditTitle :visible.sync="infoConAEVisible">
                        <el-form :model="infoConAEForm" label-width="80px" ref="infoConAEForm">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="infoConAEForm.title" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="缩略图">
                                <el-upload :action=url list-type="picture-card" :data="othParams" ref="upload3" :on-preview="handleInfoConCardPreview" :on-remove="handleInfoConRemove"
                                    :file-list="imgInfoConList" :on-success="moreInfoConShow">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogInfoConVisible">
                                    <img width="100%" :src="dialogInfoConImageUrl">
                                </el-dialog>
                            </el-form-item>
                            <el-form-item label="咨询电话" prop="addInfo.telephone">
                                <el-input v-model="infoConAEForm.addInfo.telephone" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="详细介绍">
                                <UE :id=ue3 @editorChange="infoConAddChange"></UE>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click.native="infoConAEVisible = false">取消</el-button>
                            <el-button type="primary" @click.native="addInfoConSubmit" :loading="infoConAELoading">提交</el-button>
                        </div>
                    </el-dialog>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="secondPage" v-show="secondPageVisible" title="详情">
            <el-button class="backUp" type="danger" @click="backToMainPage">返回</el-button>
            <el-col :span="24" justify="center">
                <el-form :inline="true" :model="categoryFilters">
                    <el-form-item>
                        <span>快速添加分类：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="categoryFilters.addType" placeholder="添加类别"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="categoryAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="danger" @click="categoryBatchRemove" :disabled="this.categorySels.length===0">批量删除</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="categoryList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="categoryLoading" @selection-change="selsCategoryChange"
                style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="类别" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="categoryEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="categoryDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="highActSizeChange" @current-change="categoryCurrentChange" :page-sizes="[7,8,10,20]"
                    :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="categoryTotal" :current-page="page"
                    style="float:right;">
                </el-pagination>
            </el-col>
            <!--编辑界面-->
            <el-dialog title="编辑" :visible.sync="categoryAEVisible">
                <el-form :model="categoryAEForm" label-width="80px" ref="categoryAEForm">
                    <el-form-item label="分类" prop="name">
                        <el-input v-model="categoryAEForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="categoryAEVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editCategorySubmit" :loading="categoryAELoading">提交</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import util from '../../common/js/util';
    import UE from '../../components/ue';
    import {
        showDisplay,
        addDisplay,
        deleteDisplay,
        findDic,
        showDict,
        addDict,
        deleteDict,
        userTarget,
        uploadPic,
        commerceCourseListByTime,
        addOrUpCommerceCourse,
        deleteCommerceCourse,
        commerceCourseList,
        deleteUserTargetAssociation,
        businessServerOrderHistoryList
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';

    export default {
        components: {
            UE
        },
        data() {
            return {
                othParams: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                url: '',
                cateDic: {},
                pagesize: 7,
                page: 1,
                activeName: 'second',
                secCateValue: '',
                highFilters: {
                    searchTitle: '',
                    secCateValue: '',
                    timeValue: []
                },
                timeValue: [],
                addEditTitle: '新增',
                addEditVisible: false,
                addEditForm: {
                    title: '',
                    timeValue: '',
                    actTimerValue: [],
                    price: '',
                    priceValue: '',
                    addInfo: {
                        location: ''
                    }
                },
                addEditLoading: false,
                highActLabel: '',
                highActList: [],
                highActLoading: false,
                sels: [], //列表选中列
                highActTotal: 2,
                imgHAList: [],
                dialogHAImageUrl: '',
                dialogHAVisible: false,
                moreHAPicList: [],
                ue: 'highActId',
                highActContent: '',
                hASignsVisible: false,
                message: {
                    title: '外交部:朝方关闭核试验场有助于政治解决半岛问题',
                    startTime: '2018-01-02',
                    endTime: '2018-02-03'
                },
                hASignsData: [{
                    createTime: '2018-01-05',
                    addInfo: {
                        userInfo: {
                            phone: '',
                            addInfo: {
                                gender: '',
                                nickName: ''
                            }
                        },
                        enterpriseName: '松湖智谷'
                    }
                }],
                hASignstotal: 1,
                activeSer: 'secondSer',
                timeinfoConValue: [],
                timeComSerValue: [],
                timeBookingValue: [],
                categoryFilters: {
                    addType: ''
                },
                infoConFilters: {
                    searchTitle: '',
                    timeinfoConValue: []
                },
                commerSerFilters: {
                    searchTitle: '',
                    timeComSerValue: []
                },
                bookingFilters: {
                    searchTitle: '',
                    timeBookingValue: []
                },
                categoryList: [],
                infoConList: [],
                comSerList: [],
                bookingList: [],
                categoryLoading: false,
                infoConLoading: false,
                comSerLoading: false,
                bookingLoading: false,
                categoryAEVisible: false,
                infoConAEVisible: false,
                commerSerAEVisible: false,
                bookingVisible: false,
                bookingInfoVisible: false,
                categoryAEForm: {
                    name: ''
                },
                infoConAEForm: {
                    title: '',
                    addInfo: {
                        phone: ''
                    }
                },
                comSerAEForm: {
                    title: ''
                },
                bookingAEForm: {
                    title: '',
                    activityTime: ''
                },
                comSerAELoading: false,
                categoryAELoading: false,
                infoConAELoading: false,
                bookingAELoading: false,
                categoryTotal: 2,
                infoConTotal: 2,
                comSerTotal: 2,
                bookingTotal: 3,
                imgInfoConList: [],
                imgComSerList: [],
                dialogComSerVisible: false,
                dialogInfoConVisible: false,
                dialogComSerImageUrl: '',
                dialogInfoConImageUrl: '',
                ue2: 'comSerUEId',
                ue3: 'infoConUEId',
                comSerContent: '',
                infoConContent: '',
                categorySels: [], //类别管理列表选中项
                infoConSels: [], //信息化列表选中项
                comSerSels: [], //商务列表选中项
                mainPageVisible: true,
                secondPageVisible: false,
                activeTopicName: 'first',
                bookDialogList: {
                    amTime: '2018-05-15 20:19',
                    amCompany: '深圳一不留神有限公司',
                    amPerson: '赵钱孙  ',
                    amPhone: '13789729878',
                    pmTime: '2018-05-15 20:19',
                    pmCompany: '深圳一而再再而三有限公司',
                    pmPerson: '周吴郑',
                    pmPhone: '13789729878'
                },
                isEdit: false,
                isEditId: '',
                detailList: {
                    addInfo: {
                        publisher: {
                            addInfo: {
                                nickName: '',
                                avatarUrl: ''
                            }
                        },
                        addInfo: {
                            startTime: '',
                            endTime: ''
                        }
                    }
                },
                // 商务服务-预约管理
                selectWeek: '本周',
                weekTimeData: [],
                AppointmentManagementList: [],
                AppointmentManagementListLoading: false,
                ServiceCourseOption: [],
                ScheduledStateVisible: false,
                HistoryContentShow: false,
                CommerceCourseState: {
                    id: '',
                    date: '',
                    fullDate: '',
                    period: '',
                    addInfo: {
                        title: '',
                        content: ''
                    },
                    bookList: [],
                    bookListSize: '',
                    past: '',
                    today: ''
                },
                HistoryContentFilters: {
                    selection: '',
                    startTime: '',
                    endTime: ''
                },
                HistoryListPage: 1,
                HistoryListPagesize: 7,
                HistoryList: [],
                HistoryListTotal: 0,
                HistoryListLoading: false,
                HistoryListOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                // 商务服务-服务课程
                ServiceCourseListData: [],
                ServiceCourseListLoding: false,
                ServiceCourseAddVisible: false,
                ServiceCourseEditVisible: false,
                ServiceCourseForm: {
                    id: '',
                    title: '',
                    thumbUrl: 'null',
                    addInfo: {
                        themeContent: ''
                    }
                },
                ServiceCourseAddForm: {
                    title: '',
                    thumbUrl: 'null',
                    addInfo: {
                        themeContent: ''
                    },
                    type: '服务课程'
                },
                ServiceCourseAddFormRules: {
                    title: [{
                        required: true,
                        message: '请填写课程名称',
                        trigger: 'blur'
                    }],
                    addInfo: {
                        themeContent: [{
                            required: true,
                            message: '请输入课程详情',
                            trigger: 'blur'
                        }]
                    }
                }
            };
        },
        methods: {
            handleClick(tab, event) {
                this.page = 1;
            },
            categoryAdd() {
                //类别管理添加
                this.categoryLoading = true;
                let data = {
                    parkId: localStorage.getItem('parkId'),
                    name: this.categoryFilters.addType,
                    code: this.cateDic.code + '.' + this.categoryFilters.addType,
                    pid: this.cateDic.id,
                    pname: this.cateDic.name,
                    addInfo: {}
                };
                this.$post(addDict, data).then(res => {
                    this.categoryLoading = false;
                    this.getCategory();
                });
                this.categoryFilters.addType = '';
            },
            addBookingSubmit: function () {
                //新增  预约管理
                this.$refs.bookingAEForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.bookingAELoading = true;
                            let para = Object.assign({}, this.bookingAEForm);
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                title: this.bookingAEForm.title,
                                type: '预约管理',
                                detailUrl: 'null',
                                thumbUrl: 'null',
                                addInfo: {
                                    timeStart: para.activityTime + ' 00:00:00',
                                    timeEnd: para.activityTime + ' 23:59:59'
                                }
                            };
                            if (this.isEdit) {
                                data.id = this.isEditId;
                            }
                            // let url='/api/displayContent/addDisplayContent';
                            this.$post(addDisplay, data).then(res => {
                                this.bookingAELoading = false;
                                this.bookingVisible = false;
                                this.getBooking();
                            });
                        });
                    }
                });
            },
            editCategorySubmit: function () {
                //编辑  类别管理
                this.$refs.categoryAEForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.categoryAELoading = true;
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                name: this.categoryAEForm.name,
                                code: this.cateDic.code +
                                    '.' +
                                    this.categoryAEForm.name,
                                pid: this.cateDic.id,
                                pname: this.cateDic.name,
                                id: this.categoryAEForm.id,
                                addInfo: {}
                            };
                            this.$post(addDict, data).then(res => {
                                this.categoryAELoading = false;
                                this.categoryAEVisible = false;
                                this.getCategory();
                            });
                        });
                    }
                });
            },
            addInfoConSubmit: function () {
                //新增  信息化建设
                this.$refs.infoConAEForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.infoConAELoading = true;
                            let para = Object.assign({}, this.infoConAEForm);
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                thumbUrl: this.moreHAPicList[0],
                                title: this.infoConAEForm.title,
                                type: '信息化建设',
                                detailUrl: 'null',
                                addInfo: {
                                    themeContent: this.infoConContent,
                                    telephone: this.infoConAEForm.addInfo.telephone
                                }
                            };
                            if (this.isEdit) {
                                data.id = this.isEditId;
                            }
                            // let url='/api/displayContent/addDisplayContent';
                            this.$post(addDisplay, data).then(res => {
                                this.infoConAELoading = false;
                                this.infoConAEVisible = false;
                                this.getInfoCon();
                            });
                        });
                    }
                });
            },
            addComSerSubmit: function () {
                //新增  商务服务
                this.$refs.comSerAEForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.comSerAELoading = true;
                            let para = Object.assign({}, this.comSerAEForm);
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                thumbUrl: this.moreHAPicList[0],
                                title: this.comSerAEForm.title,
                                type: '商务服务',
                                detailUrl: 'null',
                                addInfo: {
                                    themeContent: this.comSerContent
                                }
                            };
                            if (this.isEdit) {
                                data.id = this.isEditId;
                            }
                            let url = '/api/displayContent/addDisplayContent';
                            this.$post(addDisplay, data).then(res => {
                                this.comSerAELoading = false;
                                this.commerSerAEVisible = false;
                                this.getComSer();
                            });
                        });
                    }
                });
            },
            selsCategoryChange: function (sels) {
                this.categorySels = sels;
            },
            selsInfoConChange: function (sels) {
                this.infoConSels = sels;
            },
            selsComSerChange: function (sels) {
                this.comSerSels = sels;
            },
            infoConAddChange(html) {
                //信息化建设 ueditor
                this.infoConContent = html;
            },
            comSerAddChange(html) {
                //商务服务 ueditor
                this.comSerContent = html;
            },
            moreInfoConShow(res, file, fileList) {
                this.moreHAPicList.push(res.responseList.url);
            },
            handleInfoConRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            handleInfoConCardPreview(file) {
                this.dialogInfoConImageUrl = file.url;
                this.dialogInfoConVisible = true;
            },
            moreComSerShow(res, file, fileList) {
                this.moreHAPicList.push(res.responseList.url);
            },
            handleComSerRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            handleComSerCardPreview(file) {
                this.dialogComSerImageUrl = file.url;
                this.dialogComSerVisible = true;
            },
            categoryCurrentChange(val) {
                //类别管理分页
                this.page = val;
                this.getCategory();
            },
            infoConCurrentChange(val) {
                //信息化建设分页
                this.page = val;
                this.getInfoCon();
            },
            comSerCurrentChange(val) {
                //商务服务分页
                this.page = val;
                this.getComSer();
            },
            bookingCurrentChange(val) {
                //预约管理分页
                this.page = val;
                this.getBooking();
            },
            getCateDic() {
                //高端活动 类别管理获取Pid
                this.$get(findDic + '高端活动').then(res => {
                    this.cateDic = res[0];
                });
            },
            getCategory() {
                //高端活动 类别管理列表
                let pname = '高端活动';
                let url = '/api/dict/dictList/' + pname;
                this.categoryLoading = true;
                this.$get(showDict + pname).then(res => {
                    this.categoryList = res;
                    this.categoryTotal =
                        this.categoryList.length > 0 ? this.categoryList.length : 1;
                    this.categoryLoading = false;
                });
            },
            getQueryInfoCon() {
                // 信息化建设模糊查询
                let type = '信息化建设';
                let url = showDisplay + type;
                let startTime = this.infoConFilters.timeinfoConValue[0];
                let endTime = this.infoConFilters.timeinfoConValue[1];
                let title = this.infoConFilters.searchTitle;
                url =
                    startTime === undefined ?
                    url + '' :
                    url + '&startTime=' + startTime.replace(/-/g, '/');
                url =
                    endTime === undefined ?
                    url + '' :
                    url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                this.getInfoConList(url);
                this.infoConFilters = {
                    timeinfoConValue: [],
                    searchTitle: ''
                };
            },
            getInfoCon() {
                //信息化建设列表
                let type = '信息化建设';
                this.getInfoConList(showDisplay + type);
            },
            getInfoConList(url) {
                //信息化建设列表 数据
                this.infoConLoading = true;
                this.$get(url).then(res => {
                    this.infoConList = res;
                    this.infoConTotal =
                        this.infoConList.length > 0 ? this.infoConList.length : 1;
                    this.infoConLoading = false;
                });
            },
            getQueryCommer() {
                // 商务服务模糊查询
                let type = '商务服务';
                let url = showDisplay + type;
                let startTime = this.commerSerFilters.timeComSerValue[0];
                let endTime = this.commerSerFilters.timeComSerValue[1];
                let title = this.commerSerFilters.searchTitle;
                url =
                    startTime === undefined ?
                    url + '' :
                    url + '&startTime=' + startTime.replace(/-/g, '/');
                url =
                    endTime === undefined ?
                    url + '' :
                    url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                this.getComSerList(url);
                this.commerSerFilters = {
                    timeComSerValue: [],
                    searchTitle: ''
                };
            },
            getComSer() {
                //商务服务列表
                let type = '商务服务';
                this.getComSerList(showDisplay + type);
            },
            getComSerList(url) {
                //商务服务列表 数据
                this.comSerLoading = true;
                this.$get(url).then(res => {
                    this.comSerList = res;
                    this.comSerTotal =
                        this.comSerList.length > 0 ? this.comSerList.length : 1;
                    this.comSerLoading = false;
                });
            },
            getQueryBooking() {
                // 预约管理模糊查询
                let type = '预约管理';
                let url = showDisplay + type;
                let startTime = this.bookingFilters.timeBookingValue[0];
                let endTime = this.bookingFilters.timeBookingValue[1];
                let title = this.bookingFilters.searchTitle;
                url =
                    startTime === undefined ?
                    url + '' :
                    url + '&startTime=' + startTime.replace(/-/g, '/');
                url =
                    endTime === undefined ?
                    url + '' :
                    url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                this.getBookingList(url);
                this.bookingFilters = {
                    timeBookingValue: [],
                    searchTitle: ''
                };
            },
            getBooking() {
                //商务预约管理
                let type = '预约管理';
                this.getBookingList(showDisplay + type);
            },
            getBookingList(url) {
                //商务预约管理 数据
                this.bookingLoading = true;
                this.$get(url).then(res => {
                    this.bookingList = res;
                    this.bookingTotal =
                        this.bookingList.length > 0 ? this.bookingList.length : 1;
                    this.bookingLoading = false;
                });
            },
            categoryEdit(index, row) {
                //类别管理显示编辑界面
                this.categoryAEVisible = true;
                this.categoryAEForm = Object.assign({}, row);
            },
            infoConEdit(index, row) {
                //信息化建设显示编辑界面
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.infoConAEVisible = true;
                this.infoConAEForm = Object.assign({}, row);
            },
            //显示编辑界面
            comSerEdit(index, row) {
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.commerSerAEVisible = true;
                this.comSerAEForm = Object.assign({}, row);
            },
            bookingEdit(index, row) {
                //显示编辑界面
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.bookingVisible = true;
                this.bookingAEForm = Object.assign({}, row);
                this.bookingAEForm.activityTime = row.addInfo.startTime;
            },
            bookingInfo(index, row) {
                //显示预约界面
                this.bookingInfoVisible = true;
            },
            categoryDel(index, row) {
                // 类别管理列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.categoryLoading = true;
                        let para = {
                            id: row.id
                        };
                        // let url='/api/dict/deleteDict/'+para.id;
                        let self = this;
                        this.$del(deleteDict + para.id).then(function (response) {
                            self.categoryLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getCategory();
                        });
                    })
                    .catch(() => {});
            },
            infoConDel(index, row) {
                // 信息化列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.infoConLoading = true;
                        let para = {
                            id: row.id
                        };
                        // let url='/api/displayContent/deleteDisplayContent/'+para.id;
                        let self = this;
                        this.$del(deleteDisplay + para.id).then(function (response) {
                            self.infoConLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInfoCon();
                        });
                    })
                    .catch(() => {});
            },
            //删除
            comSerDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.comSerLoading = true;
                        let para = {
                            id: row.id
                        };
                        let url =
                            '/api/displayContent/deleteDisplayContent/' + para.id;
                        let self = this;
                        this.$del(deleteDisplay + para.id).then(function (response) {
                            self.comSerLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getComSer();
                        });
                    })
                    .catch(() => {});
            },
            //删除
            bookingDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.bookingLoading = true;
                        let para = {
                            id: row.id
                        };
                        // let url='/api/displayContent/deleteDisplayContent/'+para.id;
                        let self = this;
                        this.$del(deleteDisplay + para.id).then(function (response) {
                            self.bookingLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getBooking();
                        });
                    })
                    .catch(() => {});
            },
            categoryBatchRemove() {
                // 类别管理批量删除
            },
            infoConBatchRemove() {
                // 信息化建设批量删除
            },
            // 商务批量删除
            comSerBatchRemove() {},
            infoConAdd() {
                //信息化建设显示新增界面
                if (this.$refs.upload3 !== undefined)
                    this.$refs.upload3.clearFiles();
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.moreHAPicList.length = 0;
                this.infoConAEVisible = true;
                this.infoConAEForm = {
                    title: '',
                    addInfo: {
                        phone: ''
                    }
                };
            },
            comSerAdd() {
                //显示新增界面
                if (this.$refs.upload2 !== undefined)
                    this.$refs.upload2.clearFiles();
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.moreHAPicList.length = 0;
                this.commerSerAEVisible = true;
                this.comSerAEForm = {
                    title: ''
                };
            },
            bookingAdd() {
                //显示新增界面
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.bookingVisible = true;
                this.bookingAEForm = {
                    title: '',
                    activityTime: ''
                };
            },
            //性别显示转换
            forSex: function (row, column) {
                return row.addInfo.userInfo.addInfo.gender == 1 ?
                    '男' :
                    row.addInfo.userInfo.addInfo.gender == 2 ? '女' : '未知';
            },
            hActAddChange(html) {
                this.highActContent = html;
            },
            moreHAShow(res, file, fileList) {
                this.moreHAPicList.push(res.responseList.url);
            },
            handleHARemove(file, fileLists) {
                console.log(file, fileLists);
            },
            handleHAPictureCardPreview(file) {
                this.dialogHAImageUrl = file.url;
                this.dialogHAVisible = true;
            },
            //新增
            addHighActSubmit: function () {
                this.$refs.addEditForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addEditLoading = true;
                            let para = Object.assign({}, this.addEditForm);
                            let data = {
                                parkId: localStorage.getItem('parkId'),
                                thumbUrl: this.moreHAPicList[0],
                                title: this.addEditForm.title,
                                type: '高端活动',
                                detailUrl: 'null',
                                addInfo: {
                                    subtype: this.highActLabel,
                                    themeContent: this.highActContent,
                                    location: this.addEditForm.addInfo.location,
                                    timeStart: this.addEditForm.actTimerValue[0],
                                    timeEnd: this.addEditForm.actTimerValue[1]
                                }
                            };
                            if (this.isEdit) {
                                data.id = this.isEditId;
                            }
                            // let url='/api/displayContent/addDisplayContent';
                            this.$post(addDisplay, data).then(res => {
                                this.addEditLoading = false;
                                this.addEditVisible = false;
                                this.getHighActivity();
                            });
                        });
                    }
                });
            },
            secHighValue(value) {
                let obj = {};
                obj = this.categoryList.find(item => {
                    //遍历的数据源
                    return item.id === value; //筛选出匹配数据
                });
                this.highActLabel = obj.name;
            },
            highActAdd() {
                if (this.$refs.upload !== undefined) this.$refs.upload.clearFiles();
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.moreHAPicList.length = 0;
                this.highActContent = '';
                this.addEditVisible = true;
                this.addEditForm = {
                    title: '',
                    timeValue: '',
                    actTimerValue: [],
                    price: '',
                    priceValue: '',
                    addInfo: {
                        location: ''
                    }
                };
            },
            // 类别管理
            cateMg() {
                this.mainPageVisible = false;
                this.secondPageVisible = true;
                this.page = 1;
            },
            backToMainPage() {
                this.mainPageVisible = true;
                this.secondPageVisible = false;
                this.page = 1;
            },
            getQueryHighAct() {
                //高端活动列表 条件查询
                let type = '高端活动';
                let url = showDisplay + type;
                let startTime = this.highFilters.timeValue[0];
                let endTime = this.highFilters.timeValue[1];
                let subType = this.highFilters.secCateValue;
                let title = this.highFilters.searchTitle;
                url =
                    startTime === undefined ?
                    url + '' :
                    url + '&startTime=' + startTime.replace(/-/g, '/');
                url =
                    endTime === undefined ?
                    url + '' :
                    url + '&endTime=' + endTime.replace(/-/g, '/');
                url = title === '' ? url + '' : url + '&title=' + title;
                url = subType === '' ? url + '' : url + '&subType=' + subType;
                this.getHighActList(url);
                this.highFilters = {
                    secCateValue: '',
                    timeValue: [],
                    searchTitle: ''
                };
            },
            getHighActivity() {
                // 获取高端活动列表
                let type = '高端活动';
                this.getHighActList(showDisplay + type);
            },
            getHighActList(url) {
                //高端活动列表数据
                this.highActLoading = true;
                this.$get(url).then(res => {
                    this.highActList = res;
                    this.highActTotal =
                        this.highActList.length > 0 ? this.highActList.length : 1;
                    this.highActLoading = false;
                });
            },
            selsHighActChange: function (sels) {
                this.sels = sels;
            },
            //显示编辑界面
            hAedit(index, row) {
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.moreHAPicList.length = 0;
                this.addEditVisible = true;
                this.addEditForm = Object.assign({}, row);
                let arr = [];
                arr.push(row.addInfo.timeStart);
                arr.push(row.addInfo.timeEnd);
                this.addEditForm.actTimerValue = arr;
            },
            //删除
            hADel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.highActLoading = true;
                        //NProgress.start();
                        let para = {
                            id: row.id
                        };
                        let url =
                            '/api/displayContent/deleteDisplayContent/' + para.id;
                        let self = this;
                        this.$del(deleteDisplay + para.id).then(function (response) {
                            self.highActLoading = false;
                            //NProgress.done();
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getHighActivity();
                        });
                    })
                    .catch(() => {});
            },
            hASigns(index, row) {
                //报名
                this.hASignsVisible = true;
                this.detailList = row;
                let id = this.detailList.id;
                this.getHighSigns(id);
            },
            getHighSigns(id) {
                //高端活动 报名人员列表
                this.$get(userTarget + id).then(res => {
                    this.hASignsData = res;
                    this.hASignstotal =
                        this.hASignsData.length > 0 ? this.hASignsData.length : 1;
                });
            },
            //高端活动批量删除
            highActBatchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.highActLoading = true;
                        //NProgress.start();
                        let para = {
                            ids: ids
                        };
                        // batchRemoveUser(para).then((res) => {
                        //     this.highActLoading = false;
                        //     //NProgress.done();
                        //     this.$message({
                        //         message: '删除成功',
                        //         type: 'success'
                        //     });
                        //     this.getHighActivity();
                        // });
                    })
                    .catch(() => {});
            },
            highActSizeChange(val) {
                this.pagesize = val;
            },
            highActCurChange(val) {
                this.page = val;
                this.getHighActivity();
            },
            highSignsCurChange(val) {
                this.page = val;
                this.getHighSigns();
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 获取当前一周/下周/后周时间
            getWeek() {
                let weekDay =
                    this.selectWeek === '本周' ?
                    0 :
                    this.selectWeek === '下周' ?
                    7 :
                    this.selectWeek === '后周' ? 14 : 0;
                let dateOfToday = Date.now();
                let dayOfToday = (new Date().getDay() + 7 - 1) % 7 - weekDay;
                let daysOfThisWeek = Array.from(new Array(7)).map((_, i) => {
                    let date = new Date(
                        dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24
                    );
                    let day = date.getDay();
                    let text = '';
                    switch (day) {
                        case 0:
                            text = '周日';
                            break;
                        case 1:
                            text = '周一';
                            break;
                        case 2:
                            text = '周二';
                            break;
                        case 3:
                            text = '周三';
                            break;
                        case 4:
                            text = '周四';
                            break;
                        case 5:
                            text = '周五';
                            break;
                        case 6:
                            text = '周六';
                            break;
                    }
                    let dateObj = {
                        date: date.getFullYear() +
                            '-' +
                            String(date.getMonth() + 1).padStart(2, '0') +
                            '-' +
                            String(date.getDate()).padStart(2, '0'),
                        day: text,
                        past: date.getTime() < dateOfToday ? true : false,
                        today: date.getTime() === dateOfToday ? true : false
                    };
                    return dateObj;
                });
                return daysOfThisWeek;
            },
            // 预约管理列表
            commerceCourseListByTime() {
                this.AppointmentManagementListLoading = true;
                this.weekTimeData = this.getWeek();
                let weekTimeData = this.weekTimeData;
                this.$get(
                    commerceCourseListByTime +
                    `&startDate=${this.weekTimeData[0].date}` +
                    `&endDate=${this.weekTimeData[6].date}`
                ).then(res => {
                    let AppointmentManagementList = [];
                    for (let i = 0; i < weekTimeData.length; i++) {
                        let Amdata = {
                            id: '',
                            date: weekTimeData[i].day,
                            fullDate: weekTimeData[i].date,
                            period: '上午',
                            addInfo: {
                                title: '',
                                content: ''
                            },
                            bookList: [],
                            bookListSize: '',
                            past: weekTimeData[i].past,
                            today: weekTimeData[i].today
                        };
                        let Pmdata = {
                            id: '',
                            date: weekTimeData[i].date,
                            fullDate: weekTimeData[i].date,
                            period: '下午',
                            addInfo: {
                                title: '',
                                content: ''
                            },
                            bookList: [],
                            bookListSize: '',
                            past: weekTimeData[i].past
                        };
                        for (let j = 0; j < res.length; j++) {
                            if (res[j].serveDate === weekTimeData[i].date) {
                                if (res[j].period === '上午') {
                                    Amdata.id = res[j].id;
                                    Amdata.bookList = res[j].bookList;
                                    Amdata.addInfo = res[j].addInfo;
                                    Amdata.bookListSize = res[j].bookListSize;
                                } else {
                                    Pmdata.id = res[j].id;
                                    Pmdata.bookList = res[j].bookList;
                                    Pmdata.addInfo = res[j].addInfo;
                                    Pmdata.bookListSize = res[j].bookListSize;
                                }
                            }
                        }
                        AppointmentManagementList.push(Amdata);
                        AppointmentManagementList.push(Pmdata);
                    }
                    this.AppointmentManagementList = AppointmentManagementList;
                    this.AppointmentManagementListLoading = false;
                    this.getServiceCourse(); // 获取服务课程
                });
            },
            // 添加或修改上门预约课程
            addOrUpCommerceCourse(item) {
                for (let i = 0; i < this.ServiceCourseOption.length; i++) {
                    if (item.addInfo.title === this.ServiceCourseOption[i].title) {
                        item.addInfo.content = this.ServiceCourseOption[
                            i
                        ].addInfo.themeContent;
                    }
                }
                let data = {
                    addInfo: {
                        title: item.addInfo.title,
                        content: item.addInfo.content
                    },
                    parkId: localStorage.getItem('parkId'),
                    period: item.period,
                    serveDate: item.fullDate
                };
                if (item.id !== '') {
                    data.id = item.id;
                }
                if (item.addInfo.title === '') {
                    this.$del(deleteCommerceCourse + item.id).then(res => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.commerceCourseListByTime();
                    });
                } else {
                    this.$post(addOrUpCommerceCourse, data).then(res => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.commerceCourseListByTime();
                    });
                }
            },
            // 预约状态查看
            CommerceCourseStateCheck(item) {
                this.ScheduledStateVisible = true;
                this.CommerceCourseState = publicFunction.deepCopy(
                    this.CommerceCourseState,
                    item
                );
            },
            // 删除预定企业
            deleteUserTarget(index, row) {
                this.$confirm('确认删除该目标用户的预定状态?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        this.$del(deleteUserTargetAssociation + row.id).then(
                            res => {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.ScheduledStateVisible = false;
                                this.commerceCourseListByTime();
                            }
                        );
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            // 查看历史纪录
            viewHistory() {
                this.HistoryContentShow = true;
                this.businessServerOrderHistoryList();
            },
            // 获取历史纪录列表
            businessServerOrderHistoryList() {
                this.$get(businessServerOrderHistoryList + `&type=USER_ORDER_COMMERCE_COURSE`).then(res => {

                })
            },
            //  获取服务课程列表
            getServiceCourse() {
                this.ServiceCourseListLoding = true;
                this.$get(showDisplay + `服务课程`).then(res => {
                    this.ServiceCourseListData = res;
                    this.ServiceCourseOption = res;
                });
                this.ServiceCourseListLoding = false;
            },
            // 添加服务课程
            addServiceCourse(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.ServiceCourseAddForm.parkId = localStorage.getItem(
                            'parkId'
                        );
                        this.$post(addDisplay, this.ServiceCourseAddForm).then(
                            res => {
                                if (res.operationResult === 'failure') {
                                    this.$message({
                                        message: res.failureMsg,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getServiceCourse();
                                    this.ServiceCourseAddVisible = false;
                                }
                            }
                        );
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 编辑服务课程窗口
            ServiceCourseEdit(index, item) {
                this.ServiceCourseForm = {
                    id: '',
                    title: '',
                    addInfo: {
                        themeContent: ''
                    }
                };
                this.ServiceCourseEditVisible = true;
                this.ServiceCourseForm = publicFunction.deepCopy(
                    this.ServiceCourseForm,
                    item
                );
            },
            // 更新服务课程
            updateServiceCourse(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.ServiceCourseForm.parkId = localStorage.getItem(
                            'parkId'
                        );
                        this.$post(addDisplay, this.ServiceCourseForm).then(res => {
                            if (res.operationResult === 'failure') {
                                this.$message({
                                    message: res.failureMsg,
                                    type: 'error'
                                });
                            } else {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.ServiceCourseEditVisible = false;
                                this.getServiceCourse();
                            }
                        });
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 删除服务课程
            ServiceCourseDel(index, item) {
                this.$confirm('确认删除该服务课程？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        this.$del(deleteDisplay + item.id).then(res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getServiceCourse();
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            }
        },
        mounted() {
            this.getServiceCourse(); // 服务课程列表
            this.commerceCourseListByTime(); // 预约管理列表
            this.getHighActivity(); //高端活动
            this.getComSer(); //商务服务
            this.getBooking(); //预约管理
            this.getInfoCon(); //信息化建设
            this.getCateDic(); //类别管理id
            this.getCategory(); //类别管理
            this.url = localStorage.getItem('upUrl') + uploadPic;
            this.othParams = {
                bucketName: 'shared-resource',
                folderName: localStorage.getItem('parkId')
            };
        }
    };
</script>

<style lang="scss">
    .backUp {
        float: right;
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

    .publisher {
        float: left;
        img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }

    .mainContent {
        width: 80%;
        margin: 10px auto;
        .topicType {
            color: #866;
            font-weight: 600;
        }
        .pubTime {
            line-height: 60px;
        }
        .content {
            text-align: justify;
            text-indent: 28px;
        }
        img {
            height: 120px;
            margin: 10px 15px;
        }
        .tips {
            display: inline-block;
            &:after {
                content: '';
                display: block;
                clear: both;
            }
            li {
                display: inline-block;
                padding-left: 45px;
                margin: 5px 5px 15px;
                width: 40px;
                height: 40px;
                line-height: 40px;
                background: url(../../assets/icon_show.png) no-repeat left center;
                background-size: 40px 30px;
                &:first-child {
                    background-size: 40px 40px;
                }
                &:nth-child(2) {
                    background-image: url(../../assets/icon_praise.png);
                }
                &:last-child {
                    background-image: url(../../assets/icon_comment.png);
                }
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
    }

    .book {
        margin-bottom: 10px;
        li {
            display: inline-block;
            width: 48%;
            &.title {
                display: block;
                font-weight: bold;
                margin: 16px 0;
            }
        }
    }

    .el-dialog__body {
        min-height: 60px;
    }

    .el-book {
        .el-dialog__body {
            min-height: 100px;
        }
    }

    .el-pages {
        margin: 10px 0;
        text-align: right;
    }

    .appointmentForm {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        border: 1px solid #ebeef5;
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
            &:nth-child(odd) {
                td {
                    &:nth-of-type(1) {
                        border-top: none;
                    }
                }
            }
            &:nth-child(even) {
                td {
                    &:nth-of-type(1) {
                        border-bottom: none;
                    }
                }
            }
        }
    }

    .el-alert--success {
        display: inline;
        padding: 8px 6px;
        margin-left: 20px;
    }

    .historyContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: #fff;
        left: 0;
    }
</style>