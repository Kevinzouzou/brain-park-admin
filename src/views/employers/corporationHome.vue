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
                                    <el-date-picker v-model="highFilters.timeValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd HH:mm:ss"
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
                                <el-button type="danger" @click="highActBatchRemove" :disabled="true">批量删除</el-button>
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
                        <el-table-column type="index" width="60" label="序号">
                        </el-table-column>
                        <el-table-column prop="title" label="标题" sortable show-overflow-tooltip="">
                        </el-table-column>
                        <el-table-column prop="type" label="类别" sortable>
                        </el-table-column>
                        <el-table-column prop="createTime" label="发布时间" sortable>
                        </el-table-column>
                        <el-table-column prop="addInfo.lookUpNum" label="浏览量" sortable>
                        </el-table-column>
                        <el-table-column prop="applyNum" label="报名" sortable>
                        </el-table-column>
                        <el-table-column label="操作" width="250">
                            <template slot-scope="scope">
                                <el-button type="success" size="small" @click="hASigns(scope.$index, scope.row)">报名</el-button>
                                <el-button type="primary" size="small" @click="hAedit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="hADel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="highActSizeChange" @current-change="highActCurChange" :page-sizes="[7,8,10,20]" :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper" :total="highActList.length" :current-page="page"
                            style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--新增/编辑界面-->
                    <el-dialog :title="addEditTitle" :visible.sync="addEditVisible">
                        <el-form :model="addEditForm" label-width="100px" ref="addEditForm">
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="标题：" required>
                                        <el-input v-model="addEditForm.title" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="类别：" required>
                                        <el-select v-model="addEditForm.addInfo.subtype" placeholder="请选择">
                                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="缩略图：" required>
                                        <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" ref="upload" :on-success="HighActImgUpload" :show-file-list="false">
                                            <img v-if="addEditForm.thumbUrl" :src="addEditForm.thumbUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="活动时间：" required>
                                        <el-date-picker v-model="addEditForm.actTimerValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd HH:mm:ss"
                                            :default-time="['00:00:00', '23:59:59']">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="活动地址：" required>
                                        <el-input v-model="addEditForm.addInfo.location" auto-complete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="22">
                                    <el-form-item label="详细介绍：" required>
                                        <quill-editor v-model="addEditForm.addInfo.themeContent"></quill-editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="addEditVisible = false">取消</el-button>
                            <el-button type="primary" @click="addHighActSubmit">提交</el-button>
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
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="addInfo.name" label="姓名"></el-table-column>
                            <el-table-column prop="addInfo.enterprise" label="公司"></el-table-column>
                            <el-table-column prop="addInfo.phone" label="手机"></el-table-column>
                            <!-- <el-table-column prop="addInfo.gender" label="性别" :formatter="forSex"></el-table-column> -->
                            <el-table-column prop="createTime" label="报名时间"></el-table-column>
                        </el-table>
                        <el-pagination class="el-pages" background @size-change="highActSizeChange" @current-change="highSignsCurChange" :page-sizes="[7,8,10,20]"
                            :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :current-page="page" :total="hASignsData.length">
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
                                                    value-format="yyyy/MM/dd HH:mm:ss" :picker-options="HistoryListOptions" :default-time="['00:00:00', '23:59:59']">
                                                </el-date-picker>
                                            </div>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-input prefix-icon="el-icon-search" v-model="commerSerFilters.searchTitle" placeholder="搜索标题" clearable></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="getQueryCommer">查询</el-button>
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
                                    <el-table-column type="index" width="60" label="序号">
                                    </el-table-column>
                                    <el-table-column prop="title" label="标题" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="发布时间">
                                    </el-table-column>
                                    <el-table-column prop="addInfo.lookUpNum" label="浏览量">
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="primary" size="small" @click="comSerEdit(scope.$index, scope.row)">编辑</el-button>
                                            <el-button type="danger" size="small" @click="comSerDel(scope.$index, scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!--分页-->
                                <el-col :span="24" class="toolbar">
                                    <el-pagination background @size-change="highActSizeChange" @current-change="comSerCurrentChange" :page-sizes="[7,8,10,20]"
                                        :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="comSerList.length"
                                        :current-page="page" style="float:right;">
                                    </el-pagination>
                                </el-col>
                                <!--新增/编辑界面 商务服务-->
                                <el-dialog :title="addEditTitle" :visible.sync="commerSerAEVisible">
                                    <el-form :model="comSerAEForm" label-width="100px" ref="comSerAEForm">
                                        <el-row>
                                            <el-col :span="22">
                                                <el-form-item label="标题" required>
                                                    <el-input v-model="comSerAEForm.title" auto-complete="off"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="22">
                                                <el-form-item label="缩略图" required>
                                                    <el-upload class="avatar-uploader" :action="imgUploadUrl" :data="imgData" :show-file-list="false" :on-success="uploadComSer">
                                                        <img v-if="comSerAEForm.thumbUrl" :src="comSerAEForm.thumbUrl" class="avatar">
                                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                    </el-upload>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="22">
                                                <el-form-item label="详细介绍" required>
                                                    <quill-editor v-model="comSerAEForm.addInfo.themeContent">
                                                    </quill-editor>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click.native="commerSerAEVisible = false">取消</el-button>
                                        <el-button type="primary" @click="addComSerSubmit">提交</el-button>
                                    </div>
                                </el-dialog>
                            </el-tab-pane>
                            <el-tab-pane label="预约管理" name="secondSer">
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
                                                    <el-alert v-show="item.today" title="今日" type="success" :closable="false" style="display: inline;">
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
                                                <el-input v-model="HistoryContentFilters.selection" class="userinfo-search" placeholder="输入课程名称或企业名称" prefix-icon="el-icon-search"
                                                    clearable></el-input>
                                            </el-form-item>
                                            <el-form-item>
                                                <div style="color: #606266;">日期范围：</div>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-date-picker v-model="HistoryContentFilters.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
                                                    end-placeholder="结束日期" :picker-options="HistoryListOptions" value-format="yyyy/MM/dd HH:mm:ss">
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
                                    <el-table :data="HistoryList.slice((HistoryListPage-1)*HistoryListPagesize,HistoryListPage*HistoryListPagesize)" highlight-current-row
                                        v-loading="HistoryListLoading" style="width: 100%;">
                                        <el-table-column label="日期">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.commerceCourseInfo.serveDate}}</span>
                                                <span>{{scope.row.commerceCourseInfo.period}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="commerceCourseInfo.addInfo.title" label="服务课程">
                                        </el-table-column>
                                        <el-table-column prop="commerceCourseInfo.addInfo.content" label="课程详情">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.enterprise" label="企业名称">
                                        </el-table-column>
                                        <el-table-column prop="addInfo.phone" label="电话">
                                        </el-table-column>
                                    </el-table>
                                    <!--分页-->
                                    <el-col :span="24" class="toolbar">
                                        <el-pagination background @size-change="HistoryListSizeChange" @current-change="HistoryListCurrentChange" :page-sizes="[7,8,10,20]"
                                            :page-size="HistoryListPagesize" layout="total,sizes, prev, pager, next, jumper"
                                            :total="HistoryListTotal" :current-page="HistoryListPage" style="float:right;">
                                        </el-pagination>
                                    </el-col>
                                </div>
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
            </el-tabs>
        </div>
        <div class="secondPage" v-show="secondPageVisible" title="详情">
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
                    <el-form-item class="pull-right">
                        <el-button type="danger" @click="backToMainPage">返回</el-button>
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
                <el-table-column type="index" width="60" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="类别" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="categoryEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="categoryDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination background @size-change="highActSizeChange" @current-change="categoryCurrentChange" :page-sizes="[7,8,10,20]"
                    :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="categoryList.length" :current-page="page"
                    style="float:right;">
                </el-pagination>
            </el-col>
            <!--编辑界面-->
            <el-dialog title="编辑" :visible.sync="categoryAEVisible">
                <el-form :model="categoryAEForm" label-width="100px">
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
        data() {
            return {
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                imgUploadUrl: '',
                cateDic: {},
                pagesize: 7,
                page: 1,
                activeName: 'first',
                secCateValue: '',
                highFilters: {
                    searchTitle: '',
                    secCateValue: '',
                    timeValue: ''
                },
                timeValue: [],
                addEditTitle: '新增',
                addEditVisible: false,
                addEditForm: {
                    title: '',
                    thumbUrl: '',
                    timeValue: '',
                    actTimerValue: [],
                    addInfo: {
                        location: "",
                        subtype: "",
                        themeContent: "",
                        timeEnd: "",
                        timeStart: "",
                    }
                },
                highActLabel: '',
                highActList: [],
                highActLoading: false,
                sels: [], //列表选中列

                dialogHAImageUrl: '',
                dialogHAVisible: false,
                moreHAPicList: '',
                ue: 'highActId',
                highActContent: '',
                hASignsVisible: false,
                message: {
                    title: '外交部:朝方关闭核试验场有助于政治解决半岛问题',
                    startTime: '2018-01-02',
                    endTime: '2018-02-03'
                },
                hASignsData: [],
                activeSer: 'firstSer',
                timeComSerValue: [],
                timeBookingValue: [],
                categoryFilters: {
                    addType: ''
                },

                commerSerFilters: {
                    searchTitle: '',
                    timeComSerValue: ''
                },
                bookingFilters: {
                    searchTitle: '',
                    timeBookingValue: []
                },
                categoryList: [],

                comSerList: [],
                bookingList: [],
                categoryLoading: false,
                comSerLoading: false,
                categoryAEVisible: false,
                commerSerAEVisible: false,
                bookingVisible: false,
                bookingInfoVisible: false,
                categoryAEForm: {
                    name: ''
                },
                comSerAEForm: {
                    id: '',
                    title: '',
                    thumbUrl: '',
                    type: '商务服务',
                    addInfo: {
                        themeContent: ''
                    }
                },
                bookingAEForm: {
                    title: '',
                    activityTime: ''
                },
                categoryAELoading: false,
                bookingAELoading: false,
                imgInfoConList: [],
                imgComSerList: [],
                dialogComSerVisible: false,
                dialogInfoConVisible: false,
                dialogComSerImageUrl: '',
                dialogInfoConImageUrl: '',
                comSerContent: '',
                categorySels: [], //类别管理列表选中项
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
                    time: '',
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
                    thumbUrl: '',
                    addInfo: {
                        themeContent: ''
                    }
                },
                ServiceCourseAddForm: {
                    title: '',
                    thumbUrl: '',
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
            // 高端活动类别管理添加
            categoryAdd() {
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
            // 编辑类别管理
            editCategorySubmit: function () {
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
            },
            //   商务服务图片上传
            uploadComSer(res, file, fileList) {
                this.comSerAEForm.thumbUrl = res.responseList.url;
            },
            // 新增商务服务
            addComSerSubmit: function () {
                this.$refs.comSerAEForm.validate(valid => {
                    if (valid) {
                        let data = this.comSerAEForm;
                        if (data.title === '') {
                            this.$message({
                                message: '请填写标题',
                                type: 'error'
                            });
                        } else if (data.thumbUrl === '') {
                            this.$message({
                                message: '请添加图片',
                                type: 'error'
                            });
                        } else if (data.addInfo.themeContent === '') {
                            this.$message({
                                message: '请填写详细介绍',
                                type: 'error'
                            });
                        } else {
                            data.parkId = localStorage.getItem('parkId');
                            this.$post(addDisplay, data).then(res => {
                                this.commerSerAEVisible = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.getComSer();
                            });
                        }
                    }
                });
            },
            // 分页
            selsCategoryChange(val) {
                this.categorySels = val;
            },
            selsComSerChange(val) {
                this.comSerSels = val;
            },
            // 类别管理分页
            categoryCurrentChange(val) {
                this.page = val;
                this.getCategory();
            },
            // 商务服务分页
            comSerCurrentChange(val) {
                this.page = val;
                this.getComSer();
            },
            // 高端活动 类别管理获取Pid
            getCateDic() {
                this.$get(findDic + '高端活动').then(res => {
                    this.cateDic = res[0];
                });
            },
            // 高端活动 类别管理列表
            getCategory() {
                let pname = '高端活动';
                let url = '/api/dict/dictList/' + pname;
                this.categoryLoading = true;
                this.$get(showDict + pname).then(res => {
                    this.categoryList = res;

                    this.categoryLoading = false;
                });
            },
            // 商务服务模糊查询
            getQueryCommer() {
                console.log(this.commerSerFilters);
                let type = '商务服务';
                let url = showDisplay + type;
                if (this.commerSerFilters.timeComSerValue !== null && this.commerSerFilters.timeComSerValue !== '') {
                    let startTime = this.commerSerFilters.timeComSerValue[0];
                    let endTime = this.commerSerFilters.timeComSerValue[1];
                    url =
                        startTime === '' ?
                        url + '' : url + '&startTime=' + startTime;
                    url =
                        endTime === '' ?
                        url + '' : url + '&endTime=' + endTime;
                }
                let title = this.commerSerFilters.searchTitle;
                url = title === '' ? url + '' : url + '&title=' + title;
                this.getComSerList(url);
            },

            // 获取商务服务列表
            getComSer() {
                let type = '商务服务';
                this.getComSerList(showDisplay + type);
            },
            //  商务服务列表数据
            getComSerList(url) {
                this.comSerLoading = true;
                this.$get(url).then(res => {
                    this.comSerList = res;
                    this.comSerLoading = false;
                });
            },
            //类别管理显示编辑界面
            categoryEdit(index, row) {
                this.categoryAEVisible = true;
                this.categoryAEForm = Object.assign({}, row);
            },
            //显示商务服务新增界面
            comSerAdd() {
                if (this.$refs.upload2 !== undefined) this.$refs.upload2.clearFiles();
                this.addEditTitle = '新增';
                this.commerSerAEVisible = true;
                this.comSerAEForm = {
                    title: '',
                    thumbUrl: '',
                    type: '商务服务',
                    addInfo: {
                        themeContent: ''
                    }
                };
            },
            //显示商务服务编辑界面
            comSerEdit(index, row) {
                this.comSerAEForm = {
                    id: '',
                    parkId: '',
                    title: '',
                    thumbUrl: '',
                    type: '商务服务',
                    addInfo: {
                        themeContent: ''
                    }
                }
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.commerSerAEVisible = true;
                this.comSerAEForm = publicFunction.deepCopy(this.comSerAEForm, row);
            },
            // 类别管理列表删除
            categoryDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.$del(deleteDict + row.id).then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCategory();
                        });
                    })
                    .catch(() => {});
            },


            //删除商务服务
            comSerDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.comSerLoading = true;
                        this.$del(deleteDisplay + row.id).then(res => {
                            this.comSerLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getComSer();
                        });
                    })
                    .catch(() => {});
            },

            // 类别管理批量删除
            categoryBatchRemove() {},

            // 商务批量删除
            comSerBatchRemove() {},



            //性别显示转换
            forSex(row, column) {
                return row.addInfo.userInfo.addInfo.gender == 1 ?
                    '男' :
                    (row.addInfo.userInfo.addInfo.gender == 2 ? '女' : '未知');
            },

            // 高端活动图片上传
            HighActImgUpload(res, file, fileList) {
                this.addEditForm.thumbUrl = res.responseList.url;
            },

            // 新增或修改高端活动
            addHighActSubmit: function () {
                this.$refs.addEditForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let data = {
                                type: '高端活动',
                                parkId: localStorage.getItem('parkId'),
                                thumbUrl: this.addEditForm.thumbUrl,
                                title: this.addEditForm.title,
                                addInfo: {
                                    subtype: this.addEditForm.addInfo.subtype,
                                    themeContent: this.addEditForm.addInfo.themeContent,
                                    location: this.addEditForm.addInfo.location,
                                    timeStart: this.addEditForm.actTimerValue[0],
                                    timeEnd: this.addEditForm.actTimerValue[1]
                                }
                            };
                            if (this.isEdit) {
                                data.id = this.isEditId;
                            }
                            this.$post(addDisplay, data).then(res => {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.addEditVisible = false;
                                this.getHighActivity();
                            });
                        });
                    }
                });
            },
            // 打开新增高端活动弹框
            highActAdd() {
                this.addEditForm = {
                    title: '',
                    thumbUrl: '',
                    timeValue: '',
                    actTimerValue: [],
                    addInfo: {
                        location: "",
                        subtype: "",
                        themeContent: "",
                        timeEnd: "",
                        timeStart: "",
                    }
                };
                if (this.$refs.upload !== undefined) this.$refs.upload.clearFiles();
                this.addEditTitle = '新增';
                this.isEdit = false;
                this.moreHAPicList = '';
                this.highActContent = '';
                this.addEditVisible = true;
            },
            // 打开类别管理
            cateMg() {
                this.mainPageVisible = false;
                this.secondPageVisible = true;
                this.page = 1;
            },
            // 返回高端活动
            backToMainPage() {
                this.mainPageVisible = true;
                this.secondPageVisible = false;
                this.page = 1;
            },
            //高端活动列表 条件查询
            getQueryHighAct() {
                let type = '高端活动';
                let url = showDisplay + type;
                let startTime = this.highFilters.timeValue[0];
                let endTime = this.highFilters.timeValue[1];
                let subType = this.highFilters.secCateValue;
                let title = this.highFilters.searchTitle;
                url =
                    startTime === undefined ?
                    url + '' :
                    url + '&startTime=' + startTime;
                url =
                    endTime === undefined ?
                    url + '' :
                    url + '&endTime=' + endTime;
                url = title === '' ? url + '' : url + '&title=' + title;
                url = subType === '' ? url + '' : url + '&subType=' + subType;
                this.getHighActList(url);
                // this.highFilters = {
                //     secCateValue: '',
                //     timeValue: [],
                //     searchTitle: ''
                // };
            },
            // 获取高端活动列表
            getHighActivity() {
                let type = '高端活动';
                this.getHighActList(showDisplay + type);
            },

            // 获取高端活动列表数据
            getHighActList(url) {
                this.highActLoading = true;
                this.$get(url).then(res => {
                    this.highActList = res;
                    this.highActLoading = false;
                });
            },
            // 高端活动复选框
            selsHighActChange(val) {
                this.sels = val;
            },
            // 显示高端活动编辑界面
            hAedit(index, row) {
                this.addEditTitle = '编辑';
                this.isEditId = row.id;
                this.isEdit = true;
                this.addEditVisible = true;
                this.addEditForm = publicFunction.deepCopy(this.addEditForm, row);
                let arr = [];
                arr.push(row.addInfo.timeStart);
                arr.push(row.addInfo.timeEnd);
                this.addEditForm.actTimerValue = arr;
                console.log(JSON.stringify(this.addEditForm))
            },
            // 删除高端活动
            hADel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.highActLoading = true;
                        this.$del(deleteDisplay + row.id).then(res => {
                            this.highActLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getHighActivity();
                        });
                    })
                    .catch(() => {});
            },
            // 高端活动报名弹框
            hASigns(index, row) {
                this.hASignsVisible = true;
                this.detailList = row;
                this.getHighSigns(row.id);
            },
            //高端活动 报名人员列表
            getHighSigns(id) {
                this.$get(userTarget + id).then(res => {
                    this.hASignsData = res;
                });
            },
            //高端活动批量删除
            highActBatchRemove: function () {
                if (this.sels.length === 0) {
                    this.$message({
                        message: '请先选择高端活动',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确认删除选中的高端活动？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        for (let i of this.sels) {
                            this.$del(deleteDisplay + i.id).then(res => {
                                this.$notify({
                                    title: '成功',
                                    message: `已删除"${i.title}"活动`,
                                    type: 'success'
                                });
                                this.getHighActivity();
                            });
                        }
                    }).catch(() => {});
                }
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
                this.getHistoryContent();
            },
            getHistoryContent() {
                let url = businessServerOrderHistoryList + `&type=USER_ORDER_COMMERCE_COURSE`;
                let selection = this.HistoryContentFilters.selection === '' ? '' :
                    `&selection=${this.HistoryContentFilters.selection}`;
                url = url + selection;
                if (this.HistoryContentFilters.time !== null && this.HistoryContentFilters.time !== '') {
                    let startTime =
                        `&startTime=${this.HistoryContentFilters.time[0]}`;
                    let endTime =
                        `&endTime=${this.HistoryContentFilters.time[1]}`;
                    url = url + startTime + endTime;
                }
                this.businessServerOrderHistoryList(url);
            },
            // 获取历史纪录列表
            businessServerOrderHistoryList(url) {
                this.$get(url).then(res => {
                    this.HistoryList = res;
                    this.HistoryListTotal = res.length;
                })
            },
            HistoryListSizeChange(val) {
                this.HistoryListPagesize = val;
            },
            HistoryListCurrentChange(val) {
                this.HistoryListPage = val;
                this.getHistoryContent();
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
            this.getCateDic(); //类别管理id
            this.getCategory(); //类别管理
            this.imgUploadUrl = localStorage.getItem('upUrl') + uploadPic;
            this.imgData.folderName = localStorage.getItem('parkId');
        }
    };
</script>

<style lang="scss">
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
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


    .historyContent {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: #fff;
        left: 0;
    }

    .ThumbnailImg {
        width: 100%;
        height: 100%;
        border-radius: 6px;
    }
</style>