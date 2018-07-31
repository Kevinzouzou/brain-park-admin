<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="资源管理" name="ResourceManagement">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" :model="resourceFilter">
                            <el-form-item>
                                <el-button type="primary" @click="SharedResourceInfoAddVisible = true">新增资源</el-button>
                            </el-form-item>
                            <el-form-item label="共享类型：">
                                <el-select placeholder="请选择服务分类" v-model="resourceFilter.type" @change="sharedResourceListSeach()">
                                    <el-option label="全部" value="全部"></el-option>
                                    <el-option label="会议室" value="会议室"></el-option>
                                    <el-option label="电子屏" value="电子屏"></el-option>
                                    <el-option label="展厅" value="展厅"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input prefix-icon="el-icon-search" v-model="resourceFilter.nameOrLocation" placeholder="搜索名称/地点"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="sharedResourceListSeach()">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <!--列表-->
                    <el-table :data="SharedResourceList.slice((SharedResourceListPage-1)*SharedResourceListPagesize,SharedResourceListPage*SharedResourceListPagesize)"
                        highlight-current-row v-loading="SharedResourceListLoading" style="width: 100%;">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="type" label="共享类型">
                        </el-table-column>
                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column label="图片" width="230">
                            <template slot-scope="scope">
                                <span v-for="item in scope.row.addInfo.images" style="margin:0 5px">
                                    <img class="tableImg" :src="item" width="40" height="40" />
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="租金">
                            <template slot-scope="scope">
                                <span>{{scope.row.addInfo.rent}} 元/半天</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addInfo.location" label="地点">
                        </el-table-column>
                        <el-table-column prop="addInfo.capacity" label="容纳人数">
                        </el-table-column>
                        <el-table-column prop="addInfo.area" label="面积">
                        </el-table-column>
                        <el-table-column label="操作" width="230">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="sharedResourceInfoCheck(scope.$index, scope.row)">查看</el-button>
                                <el-button type="success" size="small" @click="sharedResourceInfoEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="sharedResourceInfoDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <!--工具条-->
                <el-row :gutter="24">
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="SharedResourceListPageSizeChange" @current-change="SharedResourceListPageCurrentChange"
                            :page-sizes="[7,8,10,20]" :page-size="SharedResourceListPagesize" layout="total,sizes, prev, pager, next, jumper"
                            :current-page="SharedResourceListPage" :total="SharedResourceListTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!-- 新增共享资源 -->
                <el-dialog title="新增共享资源" :visible.sync="SharedResourceInfoAddVisible">
                    <el-form :model="SharedResourceInfoAddForm" label-width="150px" :rules="SharedResourceInfoAddFormRules" ref="SharedResourceInfoAddForm">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源类型：" required prop="type">
                                    <el-select placeholder="请选择资源类型" v-model="SharedResourceInfoAddForm.type">
                                        <el-option label="会议室" value="会议室"></el-option>
                                        <el-option label="电子屏" value="电子屏"></el-option>
                                        <el-option label="展厅" value="展厅"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源名称：" required prop="name">
                                    <el-input v-model="SharedResourceInfoAddForm.name" placeholder="请输入资源名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="地点：" required prop="addInfo.location">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.location" placeholder="请输入资源地点"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <el-form-item label="租金：" required prop="addInfo.rent">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.rent" placeholder="金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    元/半天
                                </span>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="面积：" required label-width="65px" prop="addInfo.area">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.area" placeholder="占地面积"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    平方米
                                </span>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="容纳人数：" required label-width="100px">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.capacity" placeholder="人数" :disabled="SharedResourceInfoAddForm.type === '电子屏'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    人
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="图片：" required>
                                    <el-upload :action="imageUploadUrl" :data="imgData" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveForAdd"
                                        :before-upload="beforeUpload" :on-success="moreShowForAdd" :on-error="imgUploadError"
                                        :limit="4" :before-remove="beforeRemove" :on-exceed="handleExceed">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl">
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细介绍：" required prop="addInfo.intro">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.intro" type="textarea" placeholder="请输入详细介绍"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="温馨提示：" required prop="addInfo.prompt">
                                    <el-input v-model="SharedResourceInfoAddForm.addInfo.prompt" type="textarea" placeholder="请输入温馨提示"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="SharedResourceInfoAddVisible = false">关闭</el-button>
                        <el-button type="primary" @click="addSharedResourceInfo('SharedResourceInfoAddForm')">添加</el-button>
                    </div>
                </el-dialog>
                <!-- 查看共享资源 -->
                <el-dialog title="查看资源详情" :visible.sync="SharedResourceInfoVisible">
                    <el-form :model="SharedResourceInfo" label-width="150px">
                        <el-row>
                            <el-col :span="10" :offset="1">
                                <h1>基本信息</h1>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源类型：">
                                    <span>{{SharedResourceInfo.type}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源名称：">
                                    <span>{{SharedResourceInfo.name}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="地点：">
                                    <span>{{SharedResourceInfo.addInfo.location}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="租金：">
                                    <span>{{SharedResourceInfo.addInfo.rent}} 元/半天</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="面积：" label-width="65px">
                                    <span>{{SharedResourceInfo.addInfo.area}} 平方米</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="容纳人数：" label-width="100px">
                                    <span>{{SharedResourceInfo.addInfo.capacity}} 人</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源图片：">
                                    <img class="sharedResourceImg" v-for="image in SharedResourceInfo.addInfo.images" :src="image">
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细介绍：">
                                    <span>{{SharedResourceInfo.addInfo.intro}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="温馨提示：">
                                    <span>{{SharedResourceInfo.addInfo.prompt}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10" :offset="1">
                                <h1>预约状态</h1>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="center" style="margin-top: 20px;">
                            <el-col :span="20">
                                <table class="appointmentForm">
                                    <tr>
                                        <th>
                                            日期
                                        </th>
                                        <th v-for="item in seventDaysData">
                                            <div>{{item.date}}</div>
                                            <div>{{item.day}}</div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>上午</td>
                                        <td v-for="item in seventDaysData">
                                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!item.AM.isBook">
                                                <div slot="content" v-if="item.AM.isBook">申请人：{{item.AM.addInfo.contactName}}
                                                    <br/>联系电话：{{item.AM.addInfo.contactPhone}}</div>
                                                <el-dropdown trigger="click">
                                                    <span class="el-dropdown-link">
                                                        {{item.AM.state}}
                                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item v-if="!item.AM.isBook && item.AM.state !== '维修'">
                                                            <el-button type="primary" @click="addSharedResourceReservation(item.fulldate,'上午')">维修</el-button>
                                                        </el-dropdown-item>
                                                        <el-dropdown-item v-else-if="!item.AM.isBook && item.AM.state === '维修'">
                                                            <el-button type="success" @click="deleteSharedResourceReservation(false,item.AM.id)">可预约</el-button>
                                                        </el-dropdown-item>
                                                        <el-dropdown-item v-else>
                                                            <el-button type="danger" @click="deleteSharedResourceReservation(true,item.AM.id)">取消预约</el-button>
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </el-tooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>下午</td>
                                        <td v-for="item in seventDaysData">
                                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!item.PM.isBook">
                                                <div slot="content" v-if="item.PM.isBook">申请人：{{item.PM.addInfo.contactName}}
                                                    <br/>联系电话：{{item.PM.addInfo.contactPhone}}</div>
                                                <el-dropdown trigger="click">
                                                    <span class="el-dropdown-link">
                                                        {{item.PM.state}}
                                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item v-if="!item.PM.isBook && item.PM.state !== '维修'">
                                                            <el-button type="primary" @click="addSharedResourceReservation(item.fulldate,'下午')">维修</el-button>
                                                        </el-dropdown-item>
                                                        <el-dropdown-item v-else-if="!item.PM.isBook && item.PM.state === '维修'">
                                                            <el-button type="success" @click="deleteSharedResourceReservation(false,item.PM.id)">可预约</el-button>
                                                        </el-dropdown-item>
                                                        <el-dropdown-item v-else>
                                                            <el-button type="danger" @click="deleteSharedResourceReservation(true,item.PM.id)">取消预约</el-button>
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </el-tooltip>
                                        </td>
                                    </tr>
                                </table>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="SharedResourceInfoVisible = false">关闭</el-button>
                    </div>
                </el-dialog>
                <!-- 编辑共享资源 -->
                <el-dialog title="编辑共享资源" :visible.sync="SharedResourceInfoEditVisible">
                    <el-form :model="SharedResourceInfo" label-width="150px" :rules="SharedResourceInfoAddFormRules" ref="SharedResourceInfo">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源类型：" required prop="type">
                                    <el-select placeholder="请选择资源类型" v-model="SharedResourceInfo.type">
                                        <el-option label="会议室" value="会议室"></el-option>
                                        <el-option label="电子屏" value="电子屏"></el-option>
                                        <el-option label="展厅" value="展厅"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源名称：" required prop="name">
                                    <el-input v-model="SharedResourceInfo.name" placeholder="请输入资源名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="地点：" required prop="addInfo.location">
                                    <el-input v-model="SharedResourceInfo.addInfo.location" placeholder="请输入资源地点"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="7">
                                <el-form-item label="租金：" required prop="addInfo.rent">
                                    <el-input v-model="SharedResourceInfo.addInfo.rent" placeholder="金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    元/半天
                                </span>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="面积：" required label-width="65px" prop="addInfo.area">
                                    <el-input v-model="SharedResourceInfo.addInfo.area" placeholder="占地面积"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    平方米
                                </span>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="容纳人数：" required label-width="100px">
                                    <el-input v-model="SharedResourceInfo.addInfo.capacity" placeholder="人数" :disabled="SharedResourceInfo.type === '电子屏'"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <span style="line-height: 40px;padding-left: 10px;">
                                    人
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="图片：" required>
                                    <el-upload :action="imageUploadUrl" :data="imgData" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveForEdit"
                                        :before-upload="beforeUpload" :on-success="moreShowForEdit" :on-error="imgUploadError"
                                        :limit="4" :file-list="SharedResourceInfo.addInfo.images" :before-remove="beforeRemove"
                                        :on-exceed="handleExceed">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl">
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="详细介绍：" required prop="addInfo.intro">
                                    <el-input v-model="SharedResourceInfo.addInfo.intro" type="textarea" placeholder="请输入详细介绍"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="温馨提示：" required prop="addInfo.prompt">
                                    <el-input v-model="SharedResourceInfo.addInfo.prompt" type="textarea" placeholder="请输入温馨提示"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="SharedResourceInfoEditVisible = false">关闭</el-button>
                        <el-button type="primary" @click="updateSharedResourceInfo('SharedResourceInfo')">修改</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="申请记录" name="ApplicationRecord">
                <el-row>
                    <el-col :span="24">
                        <el-form :inline="true" :model="applicationRecordFilter">
                            <el-form-item label="共享类型：">
                                <el-select placeholder="请选择服务分类" v-model="applicationRecordFilter.resourceType" @change="applicationRecordListSeach()">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="会议室" value="会议室"></el-option>
                                    <el-option label="电子屏" value="电子屏"></el-option>
                                    <el-option label="展厅" value="展厅"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态：">
                                <el-select placeholder="请选择服务分类" v-model="applicationRecordFilter.state" @change="applicationRecordListSeach()">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="已预约" value="已预约"></el-option>
                                    <el-option label="已退款" value="已退款"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input prefix-icon="el-icon-search" v-model="applicationRecordFilter.selection" placeholder=" 搜索名称/申请人/联系电话"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="applicationRecordListSeach()">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row>
                    <!--列表-->
                    <el-table :data="ApplicationRecordList.slice((ApplicationRecordListPage-1)*ApplicationRecordListPagesize,ApplicationRecordListPage*ApplicationRecordListPagesize)"
                        highlight-current-row v-loading="ApplicationRecordListLoading" style="width: 100%;">
                        <el-table-column prop="id" label="ID">
                        </el-table-column>
                        <el-table-column prop="addInfo.resourceType" label="共享类型">
                        </el-table-column>
                        <el-table-column prop="addInfo.resourceName" label="名称">
                        </el-table-column>
                        <el-table-column prop="addInfo.contactName" label="申请人">
                        </el-table-column>
                        <el-table-column prop="addInfo.contactPhone" label="联系电话">
                        </el-table-column>
                        <el-table-column label="租金/半天">
                            <template slot-scope="scope">
                                <span>{{scope.row.pay/100}} 元/半天</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addInfo.dateAndPeriod" label="租期">
                        </el-table-column>
                        <el-table-column prop="rentTime" label="租时(天)">
                        </el-table-column>
                        <el-table-column prop="addInfo.resourceRent" label="付费(元)">
                            <template slot-scope="scope">
                                <span>{{scope.row.addInfo.resourceRent/100}} 元</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addInfo.state" label="状态">
                        </el-table-column>
                        <el-table-column label="操作" width="230">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="ApplicationRecordCheck(scope.$index, scope.row)">查看</el-button>
                                <el-button v-show="scope.row.addInfo.state === '已预约'" type="danger" size="small" @click="ApplicationRecordRefund(scope.$index, scope.row)">退款</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <!--工具条-->
                <el-row :gutter="24">
                    <el-col :span="24" class="toolbar">
                        <el-pagination background @size-change="ApplicationRecordListPagesizeChange" @current-change="ApplicationRecordListPageCurrentChange"
                            :page-sizes="[7,8,10,20]" :page-size="ApplicationRecordListPagesize" layout="total,sizes, prev, pager, next, jumper"
                            :current-page="ApplicationRecordListPage" :total="ApplicationRecordListTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-row>
                <!-- 查看申请纪录 -->
                <el-dialog title="查看申请纪录" :visible.sync="ApplicationRecordCheckVisible">
                    <el-form :model="SharedResourceInfo" label-width="150px">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源类型：">
                                    <span>{{ApplicationRecordInfo.addInfo.resourceType}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="资源名称：">
                                    <span>{{ApplicationRecordInfo.addInfo.resourceName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="地点：">
                                    <span>{{ApplicationRecordInfo.addInfo.state}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="租金：">
                                    <span>{{ApplicationRecordInfo.addInfo.resourceRent}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="面积：">
                                    <span>{{ApplicationRecordInfo.addInfo.area}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="容纳人数：">
                                    <span>{{ApplicationRecordInfo.addInfo.capacity}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="申请人：">
                                    <span>{{ApplicationRecordInfo.addInfo.contactName}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="联系电话：">
                                    <span>{{ApplicationRecordInfo.addInfo.contactPhone}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="所属企业：">
                                    <span>{{ApplicationRecordInfo.addInfo.enterprise}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="企业楼栋：">
                                    <span>{{ApplicationRecordInfo.addInfo.state}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="申请时间：">
                                    <span>{{ApplicationRecordInfo.createTime}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="22">
                                <el-form-item label="备注信息：">
                                    <span>{{ApplicationRecordInfo.addInfo.remark}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="ApplicationRecordCheckVisible = false">关闭</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
    import axios from 'axios';
    import {
        sharedResourceList,
        addOrUpdateSharedResource,
        deleteSharedResource,
        sharedResourceReservationList,
        bookSharedResourceList,
        addSharedResourceReservation,
        deleteSharedResourceReservation,
        updateUserTargetAssociation,
        uploadPic
    } from '../../api/api';
    import publicFunction from '../../api/publicFunction';
    export default {
        data() {
            return {
                activeName: 'ResourceManagement',
                imageUploadUrl: '',
                imgData: {
                    bucketName: 'shared-resource',
                    folderName: ''
                },
                dialogImageUrl: '',
                dialogVisible: false,
                SharedResourceListPage: 1,
                SharedResourceListPagesize: 7,
                resourceFilter: {
                    type: '全部',
                    nameOrLocation: ''
                },
                seventDaysData: [],
                SharedResourceListLoading: false,
                SharedResourceList: [],
                SharedResourceListTotal: 0,
                SharedResourceInfoAddVisible: false,
                SharedResourceInfoCheckVisible: false,
                SharedResourceInfoEditVisible: false,
                SharedResourceInfoVisible: false,
                SharedResourceInfoAddForm: {
                    id: '',
                    name: '',
                    type: '会议室',
                    addInfo: {
                        location: '',
                        rent: '',
                        area: '',
                        capacity: '',
                        images: [],
                        intro: '',
                        prompt: ''
                    }
                },
                SharedResourceInfo: {
                    id: '',
                    name: '',
                    type: '',
                    addInfo: {
                        location: '',
                        rent: '',
                        area: '',
                        capacity: '',
                        images: [],
                        intro: '',
                        prompt: ''
                    }
                },
                SharedResourceInfoAddFormRules: {
                    type: [{
                        required: true,
                        message: '请选择资源类型',
                        trigger: 'change'
                    }],
                    name: [{
                        required: true,
                        message: '请输入名称',
                        trigger: ['blur', 'change']
                    }],
                    addInfo: {
                        location: [{
                            required: true,
                            message: '请输入地点',
                            trigger: ['blur', 'change']
                        }],
                        rent: [{
                            required: true,
                            message: '请输入正确的价格',
                            trigger: ['blur', 'change'],
                            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
                        }],
                        area: [{
                            required: true,
                            message: '请输入占地面积',
                            trigger: ['blur', 'change'],
                            pattern: /(^[0-9]*$)/
                        }],
                        capacity: [{
                            required: true,
                            message: '请输入容纳人数',
                            trigger: ['blur', 'change'],
                            pattern: /(^[0-9]*$)/
                        }],
                        intro: [{
                            required: true,
                            message: '请输入详细介绍',
                            trigger: ['blur', 'change']
                        }],
                        prompt: [{
                            required: true,
                            message: '请输入温馨提示',
                            trigger: ['blur', 'change']
                        }]
                    }
                },
                applicationRecordFilter: {
                    resourceType: '',
                    state: '',
                    selection: ''
                },
                ApplicationRecordListLoading: false,
                ApplicationRecordList: [],
                ApplicationRecordListTotal: 0,
                ApplicationRecordListPage: 1,
                ApplicationRecordListPagesize: 7,
                ApplicationRecordCheckVisible: false,
                ApplicationRecordInfo: {
                    createTime: "",
                    deleted: 1,
                    id: "",
                    isEnabled: 1,
                    parkId: "",
                    pay: 0,
                    rentTime: 0.5,
                    targetId: "",
                    type: "USER_ORDER_SHARED_RESOURCE",
                    userId: "",
                    addInfo: {
                        amount: 0,
                        contactName: "",
                        contactPhone: "",
                        dateAndPeriod: [],
                        enterprise: "",
                        remark: "",
                        resourceId: "",
                        resourceName: "",
                        resourceRent: "",
                        resourceType: "",
                        tradeNo: "",
                        state: ''
                    }
                }
            };
        },
        methods: {
            // 获取共享资源列表
            getSharedResourceList(url) {
                this.SharedResourceListLoading = true;
                this.$get(url).then(res => {
                    this.SharedResourceList = res;
                    this.SharedResourceListTotal = res.length;
                    this.SharedResourceListLoading = false;
                });
            },
            // 搜索共享资源列表
            sharedResourceListSeach() {
                let type = this.resourceFilter.type;
                let nameOrLocation = this.resourceFilter.nameOrLocation;
                let url = sharedResourceList;
                if (type !== '全部') {
                    url += `&type=${type}`;
                }
                if (nameOrLocation !== '') {
                    url += `&nameOrLocation=${nameOrLocation}`;
                }
                this.getSharedResourceList(url);
            },
            // 添加共享资源
            addSharedResourceInfo(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = this.SharedResourceInfoAddForm;
                        let arr = [];
                        let images = this.SharedResourceInfoAddForm.addInfo.images;
                        for (let i in images) {
                            if (typeof images[i].response === 'undefined') {
                                arr.push(images[i].url);
                            } else {
                                arr.push(images[i].response.responseList.url)
                            }
                        }
                        if (arr.length < 1) {
                            this.$alert('请至少添加一张图片', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            data.addInfo.images = arr;
                            data.parkId = localStorage.getItem('parkId');
                            delete data.id;
                            console.log(JSON.stringify(data));
                            data.addInfo.capacity =
                                data.type === '电子屏' ? '' : data.addInfo.capacity;
                            if (
                                data.type !== '电子屏' &&
                                data.addInfo.capacity === ''
                            ) {
                                this.$message({
                                    message: '请输入容纳人数',
                                    type: 'error'
                                });
                            } else {
                                this.$post(addOrUpdateSharedResource, data).then(
                                    res => {
                                        if (res.operationResult === 'failure') {
                                            this.$message({
                                                message: 'failureMsg',
                                                type: 'error'
                                            });
                                        } else {
                                            this.resetForm(formName);
                                            this.SharedResourceInfoAddVisible = false;
                                            this.$message({
                                                message: '添加成功',
                                                type: 'success'
                                            });
                                            this.getSharedResourceList(
                                                sharedResourceList
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 编辑共享资源
            sharedResourceInfoEdit(index, row) {
                this.SharedResourceInfo = publicFunction.deepCopy(
                    this.SharedResourceInfo,
                    row
                );
                let images = this.SharedResourceInfo.addInfo.images;
                let arr = [];
                for (let i in images) {
                    let data = {
                        name: i,
                        url: images[i]
                    }
                    arr.push(data)
                }
                this.SharedResourceInfo.addInfo.images = arr;
                this.SharedResourceInfoEditVisible = true;
            },
            // 添加共享资源
            updateSharedResourceInfo(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = this.SharedResourceInfo;
                        data.parkId = localStorage.getItem('parkId');
                        console.log(JSON.stringify(data));
                        console.log(JSON.stringify(this.SharedResourceInfo));
                        data.addInfo.capacity = data.type === '电子屏' ? '' : data.addInfo.capacity;
                        let arr = [];
                        let images = this.SharedResourceInfo.addInfo.images;
                        console.log(images)
                        for (let i in images) {
                            if (typeof images[i].response === 'undefined') {
                                arr.push(images[i].url);
                            } else {
                                arr.push(images[i].response.responseList.url)
                            }
                        }
                        if (arr.length < 1) {
                            this.$alert('请至少添加一张图片', '提示', {
                                confirmButtonText: '确定'
                            });
                        } else {
                            data.addInfo.images = arr;
                            if (
                                data.type !== '电子屏' &&
                                data.addInfo.capacity === ''
                            ) {
                                this.$message({
                                    message: '请输入容纳人数',
                                    type: 'error'
                                });
                            } else {
                                this.$post(addOrUpdateSharedResource, data).then(
                                    res => {
                                        if (res.operationResult === 'failure') {
                                            this.$message({
                                                message: 'failureMsg',
                                                type: 'error'
                                            });
                                        } else {
                                            this.resetForm(formName);
                                            this.SharedResourceInfoEditVisible = false;
                                            this.$message({
                                                message: '更新成功',
                                                type: 'success'
                                            });
                                            this.getSharedResourceList(
                                                sharedResourceList
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    } else {
                        console.log('表单未完全填写');
                        return false;
                    }
                });
            },
            // 删除共享资源
            sharedResourceInfoDel(index, row) {
                this.$confirm('此操作将永久删除该共享资源, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        this.$del(deleteSharedResource + row.id).then(response => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSharedResourceList(sharedResourceList);
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
            },
            // 查看共享资源预定
            sharedResourceInfoCheck(index, row) {
                this.SharedResourceInfoVisible = true;
                this.SharedResourceInfo = publicFunction.deepCopy(
                    this.SharedResourceInfo,
                    row
                );
                console.log(JSON.stringify(this.SharedResourceInfo));
                console.log(JSON.stringify(row));
                let startDate = this.seventDaysData[0].fulldate;
                let endDate = this.seventDaysData[this.seventDaysData.length - 1]
                    .fulldate;
                let url =
                    sharedResourceReservationList +
                    `?resourceId=${row.id}` +
                    `&startDate=${startDate}` +
                    `&endDate=${endDate}`;
                this.seachSharedResourceReservationList(url);
                this.SharedResourceInfoAddForm.id = row.id;
                console.log(this.seventDaysData.resourceId);
            },
            // 查询共享资源预约详情
            seachSharedResourceReservationList(url) {
                this.$get(url).then(res => {
                    this.seventDaysData = this.getWeek();
                    let seventDaysData = this.seventDaysData;
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < seventDaysData.length; j++) {
                            if (seventDaysData[j].fulldate === res[i].useDate) {
                                if (res[i].period === '上午') {
                                    seventDaysData[j].AM.isBook =
                                        res[i].state === '维修' ? false : true;
                                    seventDaysData[j].AM.id = res[i].id;
                                    seventDaysData[j].AM.state = res[i].state;
                                    seventDaysData[j].AM.addInfo =
                                        res[i].state === '维修' ?
                                        seventDaysData[j].AM.addInfo :
                                        res[i].addInfo;
                                    seventDaysData[j].AM.resourceId =
                                        res[i].resourceId;
                                } else {
                                    seventDaysData[j].PM.isBook =
                                        res[i].state === '维修' ? false : true;
                                    seventDaysData[j].PM.id = res[i].id;
                                    seventDaysData[j].PM.state = res[i].state;
                                    seventDaysData[j].PM.addInfo =
                                        res[i].state === '维修' ?
                                        seventDaysData[j].PM.addInfo :
                                        res[i].addInfo;
                                    seventDaysData[j].PM.resourceId =
                                        res[i].resourceId;
                                }
                            }
                        }
                    }
                    this.seventDaysData = seventDaysData;
                });
            },
            // 添加共享资源预定
            addSharedResourceReservation(useDate, period) {
                let data = {
                    resourceId: this.SharedResourceInfoAddForm.id,
                    parkId: localStorage.getItem('parkId'),
                    useDate: useDate,
                    period: period,
                    state: '维修',
                    addInfo: {}
                };
                this.$post(addSharedResourceReservation, data).then(res => {
                    let startDate = this.seventDaysData[0].fulldate;
                    let endDate = this.seventDaysData[this.seventDaysData.length - 1]
                        .fulldate;
                    let url =
                        sharedResourceReservationList +
                        `?resourceId=${this.SharedResourceInfoAddForm.id}` +
                        `&startDate=${startDate}` +
                        `&endDate=${endDate}`;
                    this.seachSharedResourceReservationList(url);
                    this.$message({
                        message: '修改状态成功',
                        type: 'success'
                    });
                });
            },
            // 删除共享资源预定
            deleteSharedResourceReservation(userAppointment, id) {
                if (userAppointment) {
                    this.$confirm('此操作取消该用户预约, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$del(deleteSharedResourceReservation + id).then(response => {
                            this.$message({
                                message: '取消成功',
                                type: 'success'
                            });
                            let startDate = this.seventDaysData[0].fulldate;
                            let endDate = this.seventDaysData[this.seventDaysData.length - 1]
                                .fulldate;
                            let url =
                                sharedResourceReservationList +
                                `?resourceId=${this.SharedResourceInfoAddForm.id}` +
                                `&startDate=${startDate}` +
                                `&endDate=${endDate}`;
                            this.seachSharedResourceReservationList(url);
                        });
                    }).catch(() => {});
                } else {
                    this.$del(deleteSharedResourceReservation + id).then(response => {
                        this.$message({
                            message: '修改状态成功',
                            type: 'success'
                        });
                        let startDate = this.seventDaysData[0].fulldate;
                        let endDate = this.seventDaysData[this.seventDaysData.length - 1]
                            .fulldate;
                        let url =
                            sharedResourceReservationList +
                            `?resourceId=${this.SharedResourceInfoAddForm.id}` +
                            `&startDate=${startDate}` +
                            `&endDate=${endDate}`;
                        this.seachSharedResourceReservationList(url);
                    });
                }

            },
            // 图片上传组件
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleRemoveForAdd(file, fileList) {
                this.SharedResourceInfoAddForm.addInfo.images = fileList;
            },
            moreShowForAdd(res, file, fileList) {
                this.SharedResourceInfoAddForm.addInfo.images = fileList;
            },
            handleRemoveForEdit(file, fileList) {
                this.SharedResourceInfo.addInfo.images = fileList;
            },
            moreShowForEdit(res, file, fileList) {
                this.SharedResourceInfo.addInfo.images = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            imgUploadError(res, file) {
                this.$message({
                    message: '图片上传失败，请检查',
                    type: 'error'
                });
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            SharedResourceListPageSizeChange(val) {
                this.SharedResourceListPageSize = val;
            },
            SharedResourceListPageCurrentChange(val) {
                this.SharedResourceListPage = val;
                this.sharedResourceListSeach();
            },
            ApplicationRecordListPagesizeChange(val) {
                this.ApplicationRecordListPagesize = val;
            },
            ApplicationRecordListPageCurrentChange(val) {
                this.ApplicationRecordListPage = val;
                this.applicationRecordListSeach();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getWeek() {
                const week = [];
                for (let i = 0; i < 7; i++) {
                    let Stamp = new Date();
                    Stamp.setDate(Stamp.getDate() + i);
                    week[i] = {
                        date: '',
                        fulldate: '',
                        day: '',
                        resourceId: '',
                        AM: {
                            isBook: false,
                            addInfo: {
                                contactName: '',
                                contactPhone: ''
                            },
                            id: '',
                            state: '可预约',
                            resourceId: ''
                        },
                        PM: {
                            isBook: false,
                            addInfo: {
                                contactName: '',
                                contactPhone: ''
                            },
                            id: '',
                            state: '可预约',
                            resourceId: ''
                        }
                    };
                    week[i].date =
                        Stamp.getMonth() + 1 + '月' + Stamp.getDate() + '日';
                    let year = Stamp.getFullYear();
                    let month = (Stamp.getMonth() + 1) < 10 ? '0' + Stamp.getMonth() : Stamp.getMonth();
                    let day = Stamp.getDate() < 10 ? '0' + Stamp.getDate() : Stamp.getDate();
                    week[i].fulldate = year + '-' + month + '-' + day;
                    switch (Stamp.getDay()) {
                        case 0:
                            week[i].day = '周日';
                            break;
                        case 1:
                            week[i].day = '周一';
                            break;
                        case 2:
                            week[i].day = '周二';
                            break;
                        case 3:
                            week[i].day = '周三';
                            break;
                        case 4:
                            week[i].day = '周四';
                            break;
                        case 5:
                            week[i].day = '周五';
                            break;
                        case 6:
                            week[i].day = '周六';
                            break;
                    }
                }
                week[0].day = '今日';
                return week;
            },
            // 获取共享资源申请列表
            getBookSharedResourceList(url) {
                this.ApplicationRecordListLoading = true;
                this.$get(url).then(res => {
                    this.ApplicationRecordList = res;
                    this.ApplicationRecordListTotal =
                        this.ApplicationRecordList.length > 0 ?
                        this.ApplicationRecordList.length :
                        0;
                    this.ApplicationRecordListLoading = false;
                });
            },
            // 共享资源申请列表查询
            applicationRecordListSeach() {
                let resourceType = this.applicationRecordFilter.resourceType === '' ? '' :
                    `&resourceType=${this.applicationRecordFilter.resourceType}`;
                let state = this.applicationRecordFilter.state === '' ? '' :
                    `&state=${this.applicationRecordFilter.state}`;
                let selection = this.applicationRecordFilter.selection === '' ? '' :
                    `&selection=${this.applicationRecordFilter.selection}`;
                let url = bookSharedResourceList + resourceType + state + selection;
                this.getBookSharedResourceList(url);
            },
            // 查看共享资源详情
            ApplicationRecordCheck(index, row) {
                this.ApplicationRecordCheckVisible = true;
                this.ApplicationRecordInfo = publicFunction.deepCopy(this.ApplicationRecordInfo, row);
            },
            // 共享资源申请退款
            ApplicationRecordRefund(index, row) {
                this.$confirm('确认将对该申请人进行退款操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = row;
                    data.addInfo.state = '已退款';
                    this.$put(updateUserTargetAssociation, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '退款成功!'
                        });
                        this.applicationRecordListSeach();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退款'
                    });
                });
            },
        },
        mounted() {
            this.imgData.folderName = localStorage.getItem('parkId');
            this.imageUploadUrl = localStorage.getItem('upUrl') + uploadPic;
            this.getSharedResourceList(sharedResourceList);
            this.seventDaysData = this.getWeek();
            this.getBookSharedResourceList(bookSharedResourceList);
        }
    };
</script>

<style lang="scss" scoped>
    .sharedResourceImg {
        width: 150px;
        height: auto;
        display: inline-block;
        border-radius: 6px;
        margin-left: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .appointmentForm {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        border: 1px solid #ebeef5;
        th {
            color: #606266;
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
    }

    .el-dropdown-menu__item {
        padding: 0 10px;
    }

    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
        cursor: auto;
    }

    .el-dropdown-link {
        cursor: pointer;
        user-select: none;
        &:focus {
            outline: none;
        }
    }

    .tableImg {
        width: 40px;
        height: 40px;
        border-radius: 4px;
    }
</style>