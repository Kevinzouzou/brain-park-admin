<template>
    <section>
        <div v-show="mainPage">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="巡检任务" name="first">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="inspectFilters">
                            <el-form-item>
                                <el-input v-model="inspectFilters.searchTitle" placeholder="请输入巡检路线名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryInspection">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                状态筛选：
                                <el-select v-model="inspectFilters.state" placeholder="请选择" @change="secQueryState">
                                    <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                完成状态筛选：
                                <el-select v-model="inspectFilters.doneState" placeholder="请选择" @change="secQueryDoneState">
                                    <el-option v-for="item in doneList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

                    </el-col>
                    <!--列表-->
                    <el-table :data="inspectList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="inspectLoading" style="width: 100%;">
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="名称" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="cycle" label="巡检周期" sortable>
                            <template slot-scope="scope">
                                <span v-if="scope.row.cycle && scope.row.cycle.split(',').length===2 && scope.row.cycle.split(',')[0]==='0' && scope.row.cycle.split(',')[1]==='6'">周末</span>
                                <span v-else-if="scope.row.cycle && scope.row.cycle.split(',').length===5 && scope.row.cycle.split(',')[0]==='1' && scope.row.cycle.split(',')[4]==='5'">工作日</span>
                                <span v-else-if="scope.row.cycle && scope.row.cycle.split(',').length===7">每天</span>
                                <span v-else>
                                    <span v-if="scope.row.cycle" v-for="item in scope.row.cycle.split(',')" :key="item">{{week[item]}} </span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" sortable>
                        </el-table-column>
                        <el-table-column prop="userInfo.addInfo.name" label="巡检员" sortable>
                        </el-table-column>
                        <el-table-column prop="recentInspectDate" label="最近巡检时间" sortable>
                        </el-table-column>
                        <el-table-column prop="completeState" label="完成状况" sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="success" size="small" @click="detailEdit(scope.$index, scope.row)">
                                    {{scope.row.addInfo.state==='停用'?'详情':'详情 / 编辑'}}
                                </el-button>
                                <el-button type="primary" size="small" @click="historyRecord(scope.$index, scope.row)">历史记录</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background
                                       @size-change="sizeChange"
                                       @current-change="compCurChange"
                                       :page-sizes="[7,8,10,20]"
                                       :page-size="pagesize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="inspectTotal"
                                       :current-page="page"
                                       style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="巡检路线管理" name="second">
                    <el-col :span="24" justify="center">
                        <el-form :inline="true" :model="routeFilters">
                            <el-form-item>
                                <el-input v-model="routeFilters.searchTitle" placeholder="巡检路线名称搜索"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getQueryRoute">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                状态筛选：
                                <el-select v-model="routeFilters.state" placeholder="请选择" @change="queryInsRouteState">
                                    <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-button type="primary" @click="routeAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!--列表-->
                    <el-table :data="routeList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="routeLoading" style="width: 100%;">
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="name" label="名称" sortable>
                        </el-table-column>
                        <el-table-column prop="cycle" label="巡检周期" sortable>
                            <template slot-scope="scope">
                                <span v-if="scope.row.cycle && scope.row.cycle.split(',').length===2 && scope.row.cycle.split(',')[0]==='0' && scope.row.cycle.split(',')[1]==='6'">周末</span>
                                <span v-else-if="scope.row.cycle && scope.row.cycle.split(',').length===5 && scope.row.cycle.split(',')[0]==='1' && scope.row.cycle.split(',')[4]==='5'">工作日</span>
                                <span v-else-if="scope.row.cycle && scope.row.cycle.split(',').length===7">每天</span>
                                <span v-else>
                                    <span v-if="scope.row.cycle" v-for="item in scope.row.cycle.split(',')" :key="item">{{week[item]}} </span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" sortable show-overflow-tooltip="">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建日期" sortable>
                        </el-table-column>
                        <el-table-column prop="alreadyInspectTime" label="已执行次数" sortable>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="success" size="small" @click="routeEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button type="info" size="small" @click="enableOrdisable(scope.$index, scope.row)" :disabled="scope.row.state==='故障' || scope.row.state==='报废'">
                                    {{scope.row.state==='停用'?'启用':'停用'}}
                                </el-button>
                                <el-button type="danger" size="small" @click="routeDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination background
                                       @size-change="sizeChange"
                                       @current-change="routeCurChange"
                                       :page-sizes="[7,8,10,20]"
                                       :page-size="pagesize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="routeTotal"
                                       :current-page="page"
                                       style="float:right;">
                        </el-pagination>
                    </el-col>
                    <!--&lt;!&ndash;新增/编辑界面&ndash;&gt;-->
                    <!--<el-dialog :title=addEditTitle :visible.sync="deviceAEVisible">-->
                        <!--<el-form :model="deviceAEForm" label-width="80px" ref="deviceAEForm">-->
                            <!--<el-form-item label="设备名称" prop="name">-->
                                <!--<el-input v-model="deviceAEForm.name" auto-complete="off"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="巡检周期" prop="duration">-->
                                <!--<el-input v-model="deviceAEForm.duration" auto-complete="off">-->
                                    <!--<template slot="append">（天）</template>-->
                                <!--</el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="设备地址" prop="location">-->
                                <!--<el-input v-model="deviceAEForm.location" auto-complete="off"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="设备编号" prop="serial">-->
                                <!--<el-input v-model="deviceAEForm.serial" auto-complete="off"></el-input>-->
                            <!--</el-form-item>-->
                            <!--&lt;!&ndash;<el-form-item label="">&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-button type="success" @click="printQrCode">生成并打印设备二维码</el-button>&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--</el-form>-->
                        <!--<div slot="footer" class="dialog-footer">-->
                            <!--<el-button @click.native="deviceAEVisible = false">取消</el-button>-->
                            <!--<el-button type="primary" @click.native="addDeviceSubmit" :loading="deviceAELoading">提交</el-button>-->
                        <!--</div>-->
                    <!--</el-dialog>-->

                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-show="detailPage">
            <div style="text-align: right;">
                <el-button v-show="!inspectHisView" type="danger" @click="backMainPage">返回</el-button>
                <el-button v-show="inspectHisView" type="danger" @click="backHisPage">返回</el-button>
            </div>
            <el-form label-width="90px" class="inView">
                <el-form-item label="巡检路线：">
                    {{detailList.name || '无数据'}}
                </el-form-item>
                <el-form-item label="状态：">
                    {{detailList.state || '无数据'}}
                </el-form-item>
                <el-form-item label="巡检周期：">
                    <span v-if="detailList.cycle && detailList.cycle.split(',').length===2 && detailList.cycle.split(',')[0]==='0' && detailList.cycle.split(',')[1]==='6'">周末</span>
                    <span v-else-if="detailList.cycle && detailList.cycle.split(',').length===5 && detailList.cycle.split(',')[0]==='1' && detailList.cycle.split(',')[4]==='5'">工作日</span>
                    <span v-else-if="detailList.cycle && detailList.cycle.split(',').length===7">每天</span>
                    <span v-else>
                        <span v-if="detailList.cycle" v-for="item in detailList.cycle.split(',')" :key="item">{{week[item] || '无数据'}} </span>
                    </span>
                </el-form-item>
                <el-form-item v-show="!inspectHisView" label="最近巡检：">
                    {{detailList.recentInspectDate || '无数据'}} {{detailList.completeState || '完成状况无数据'}}
                </el-form-item>
                <el-form-item v-show="inspectHisView" label="巡检任务：">
                    {{hisInspectDate || '无数据'}} {{hisCompleteState || '完成状况无数据'}}
                </el-form-item>
                <el-form-item v-show="!inspectHisView" label="巡检人：" class="allWid">
                    <el-select v-model="detailList.addInfo.department" disabled>
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="detailList.addInfo.group" disabled>
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="detailList.userInfo.addInfo.name" :disabled="detailList.state==='停用'?true:false" placeholder="请选择" @change="personChoice">
                        <el-option v-for="item in personList" :key="item.id" :label="item.addInfo.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" v-show="changeMember" style="margin-left: 15px" @click.native="saveChangeMem">保存</el-button>
                </el-form-item>
                <el-form-item v-show="inspectHisView" label="巡检人：" class="allWid">
                    {{detailList.addInfo.department}}
                    {{detailList.addInfo.group}}
                    {{recordUserName}}
                </el-form-item>
            </el-form>
            <el-col :span="24" class="toolbar" justify="center">
                <el-form :inline="true">
                    <el-form-item>
                        巡检结果筛选：
                        <el-select v-model="secInspecValue" placeholder="请选择" @change="queryInspectState">
                            <el-option v-for="item in inspecStaList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="inspectResultList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="inspectResultLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="设备名称" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类别" sortable>
                </el-table-column>
                <el-table-column prop="location" label="设备位置" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="inspectRecord.userInfo.addInfo.name" label="巡检人" sortable>
                </el-table-column>
                <el-table-column prop="inspectRecord.createTime" label="巡检时间" sortable>
                </el-table-column>
                <el-table-column prop="inspectRecord.state" label="巡检结果" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="viewRecord(scope.$index, scope.row)">检查记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination background
                               @size-change="sizeChange"
                               @current-change="inspectResultCurChange"
                               :page-sizes="[7,8,10,20]"
                               :page-size="pagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="inspectResultTotal"
                               :current-page="page"
                               style="float:right;">
                </el-pagination>
            </el-col>
        </div>
        <div v-show="historyPage">
            <div style="text-align: right;">
                <el-button type="danger" @click="backMainPage">返回</el-button>
            </div>
            <el-form label-width="90px" class="inView">
                <el-form-item label="巡检路线：">
                    {{detailList.name || '无数据'}}
                </el-form-item>
                <el-form-item label="状态：">
                    {{detailList.state || '无数据'}}
                </el-form-item>
                <el-form-item label="巡检周期：">
                    <span v-if="detailList.cycle && detailList.cycle.split(',').length===2 && detailList.cycle.split(',')[0]==='0' && detailList.cycle.split(',')[1]==='6'">周末</span>
                    <span v-else-if="detailList.cycle && detailList.cycle.split(',').length===5 && detailList.cycle.split(',')[0]==='1' && detailList.cycle.split(',')[4]==='5'">工作日</span>
                    <span v-else-if="detailList.cycle && detailList.cycle.split(',').length===7">每天</span>
                    <span v-else>
                        <span v-if="detailList.cycle" v-for="item in detailList.cycle.split(',')" :key="item">{{week[item] || '无数据'}} </span>
                    </span>
                </el-form-item>
                <el-form-item label="最近巡检：">
                    {{detailList.recentInspectDate || '无数据'}} {{detailList.completeState || '完成状况无数据'}}
                </el-form-item>
                <el-form-item label="巡检人："  class="allWid">
                    <el-select v-model="detailList.addInfo.department" disabled>
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="detailList.addInfo.group" disabled>
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="detailList.userInfo.addInfo.name" disabled>
                        <el-option v-for="item in personList" :key="item.id" :label="item.addInfo.name" :value="item.addInfo.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-col :span="24" class="toolbar" justify="center">
                <el-form :inline="true" v-model="recordFilters">
                    <el-form-item label="巡检记录：">
                        <div class="block">
                            <el-date-picker v-model="recordFilters.timeRecordValue" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                            :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getQueryRecord">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        完成状况：
                        <el-select v-model="recordFilters.secDoneValue" placeholder="请选择" @change="queryRecordState">
                            <el-option v-for="item in doneList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        故障情况：
                        <el-select v-model="recordFilters.secFaultValue" placeholder="请选择" @change="queryRecordFault">
                            <el-option v-for="item in faultCondition" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="recordList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="recordLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="inspectDate" label="巡检时间" sortable>
                </el-table-column>
                <el-table-column prop="userInfo.addInfo.name" label="巡检员" sortable>
                </el-table-column>
                <el-table-column prop="completeState" label="完成状况" sortable>
                </el-table-column>
                <el-table-column prop="faultState" label="故障情况" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="recordDetail(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
                <el-pagination background
                               @size-change="sizeChange"
                               @current-change="recordCurChange"
                               :page-sizes="[7,8,10,20]"
                               :page-size="pagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="recordTotal"
                               :current-page="page"
                               style="float:right;">
                </el-pagination>
            </el-col>
        </div>
        <div v-show="routeAddEditPage">
            <div style="text-align: right;">
                <el-button type="danger" @click="backMainPage">返回</el-button>
            </div>
            <el-form :model="routeForm" label-width="90px" class="routeDetail">
                <el-form-item label="巡检路线：">
                    <el-input v-model="routeForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="巡检周期：">
                    <el-checkbox-group v-model="routeForm.type">
                        <el-checkbox label="星期日" name="type"></el-checkbox>
                        <el-checkbox label="星期一" name="type"></el-checkbox>
                        <el-checkbox label="星期二" name="type"></el-checkbox>
                        <el-checkbox label="星期三" name="type"></el-checkbox>
                        <el-checkbox label="星期四" name="type"></el-checkbox>
                        <el-checkbox label="星期五" name="type"></el-checkbox>
                        <el-checkbox label="星期六" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="路线节点：">
                    <el-button type="success" @click.native="addNodeDevice">添加节点设备</el-button>
                    <el-checkbox v-model="routeChecked">新增后启用</el-checkbox>
                </el-form-item>
            </el-form>
            <el-table :data="insNodeList" v-loading="inspectNodeLoading" style="width: 98%;margin: 0 auto;" max-height="400">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="设备名称" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类别" sortable>
                </el-table-column>
                <el-table-column prop="location" label="设备位置" sortable>
                </el-table-column>
                <el-table-column label="操作" sortable>
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" @click="routeNoteDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="router-footer">
                <el-button type="primary" @click.native="addInspectRouteSubmit" :loading="deviceAELoading">提交</el-button>
            </div>
        </div>
        <!--查看检查记录-->
        <el-dialog class="inView" title="检查记录" :visible.sync="viewRecordVisible">
            <el-form label-width="90px" class="inView">
                <el-form-item label="设备名称：">
                    {{viewList.name || ' - '}}
                </el-form-item>
                <el-form-item label="设备类型：">
                    {{viewList.type || ' - '}}
                </el-form-item>
                <el-form-item label="设备位置：">
                    {{viewList.location || ' - '}}
                </el-form-item>
                <el-form-item label="巡检人：">
                    {{viewList.inspectRecord && viewList.inspectRecord.userInfo && viewList.inspectRecord.userInfo.addInfo && viewList.inspectRecord.userInfo.addInfo.name?viewList.inspectRecord.userInfo.addInfo.name: ' - '}}
                </el-form-item>
                <el-form-item label="巡检结果：">
                    {{viewList.inspectRecord && viewList.inspectRecord.state?viewList.inspectRecord.state:' - '}}
                </el-form-item>
                <el-form-item label="巡检时间：">
                    {{viewList.inspectRecord && viewList.inspectRecord.createTime?viewList.inspectRecord.createTime:' - '}}
                </el-form-item>
                <el-form-item label="记录：" class="allWid">
                    {{viewList.inspectRecord && viewList.inspectRecord.remark?viewList.inspectRecord.remark:' - '}}
                    <div class="imgs" v-if="viewList.addInfo.image">
                    <!--<div class="imgs" v-if="viewList.addInfo.image && viewList.addInfo.image.length>0">-->
                        <!--<img v-for="item in viewList.addInfo.image.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">-->
                        <img :src="viewList.addInfo.image" @click="handlePictureCardPreview(viewList.addInfo.image)">
                        <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                            <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--选中需要巡检的设备-->
        <el-dialog title="选中需要巡检的设备" :visible.sync="choiceDeviceVisible">
            <el-col :span="24" justify="center">
                <el-form :inline="true" :model="allNodeFilters">
                    <el-form-item>
                        <el-input v-model="allNodeFilters.searchTitle" placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getQueryAllNodes">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        筛选：
                        <el-select v-model="allNodeFilters.state" placeholder="请选择" @change="queryInsAllNodes">
                            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table :data="allInspectNodeList"  v-loading="allInspectNodeLoading" style="width: 98%;" max-height="400" @selection-change="selsChange">
                <el-table-column type="selection" width="60">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="设备名称" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类别" sortable>
                </el-table-column>
                <el-table-column prop="location" label="设备位置" sortable>
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="choiceDeviceVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addDeviceSubmit" :loading="deviceAELoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {inspectTaskListUrl, delInsTaskUrl, addUpdateInsTaskUrl, parkUserList, inspectBySelUrl, historyListlUrl, inspectUrl,equipUrl,delEquip,addEquip, showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'
    import publicFunction from  '../../api/publicFunction';
    export default {
        data(){
            return {
                recordUserName:'',
                hisInspectDate:'',
                hisCompleteState:'',
                inspectHisView:false,
                routeChecked:'',
                sels: [],//列表选中列
                changeMember:false,
                secInspecValue:'',
                inspecStaList:[
                    {
                        id:'000',
                        name:'全部'
                    },
                    {
                        id:'001',
                        name:'正常'
                    },
                    {
                        id:'002',
                        name:'故障'
                    },
                    {
                        id:'003',
                        name:'未巡检'
                    },
                ],
                departList: [
                    {
                        id: 1,
                        name: '物业部'
                    },
                    {
                        id: 2,
                        name: '工程部'
                    },
                ],
                groupList: [
                    {
                        id: 1,
                        name: '工程组'
                    },
                    {
                        id: 2,
                        name: '技术组'
                    },
                ],
                personList: [],
                mainPage:true,
                detailPage:false,
                historyPage:false,
                routeAddEditPage:false,
                stateList:[
                    {
                        id:'001',
                        name:'全部状态'
                    },
                    {
                        id:'002',
                        name:'启用'
                    },
                    {
                        id:'003',
                        name:'停用'
                    },
                ],
                cateList:[
                    {
                        id:'001',
                        name:'全部'
                    },
                    {
                        id:'002',
                        name:'消防设备'
                    },
                    {
                        id:'003',
                        name:'空调'
                    },
                    {
                        id:'004',
                        name:'电梯'
                    },
                    {
                        id:'005',
                        name:'门禁通道'
                    },
                    {
                        id:'006',
                        name:'停车场'
                    },
                    {
                        id:'007',
                        name:'其他'
                    },
                ],
                doneList:[
                    {
                        id:'001',
                        name:'全部状态'
                    },
                    {
                        id:'002',
                        name:'完成'
                    },
                    {
                        id:'003',
                        name:'未完成'
                    },
                ],
                faultCondition:[
                    {
                        id:'001',
                        name:'全部'
                    },
                    {
                        id:'002',
                        name:'有'
                    },
                    {
                        id:'003',
                        name:'无'
                    },
                ],
                selectLabel:'',


                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                dialogImageUrl: '',
                dialogVisible: false,
                page:1,
                pagesize:7,
                activeName:'first',
                inspectFilters: {
                    searchTitle: '',
                    state:'',
                    doneState:''
                },
                recordFilters: {
                    timeRecordValue: [],
                    secDoneValue:'',
                    secFaultValue:''
                },
                routeFilters: {
                    searchTitle: '',
                    state:'',
                },
                allNodeFilters: {
                    searchTitle: '',
                    state:'',
                },
                timeValue:[],
                timeDeviceValue:[],
                inspectList:[],
                inspectResultList:[],
                recordList:[],
                routeList:[],
                insNodeList:[],
                inspectNodeList:[],
                allInspectNodeList:[],
                inspectLoading:false,
                inspectResultLoading:false,
                recordLoading:false,
                routeLoading:false,
                inspectNodeLoading:false,
                allInspectNodeLoading:false,
                viewRecordVisible:false,
                detailList:{
                    inspectTime:'',
                    cycle:'',
                    name:'',
                    state:'',
                    createTime:'',
                    recentInspectDate:'',
                    addInfo:{
                        remark:'',
                        inspector:'',
                        department:'',
                        group:'',
                        equipmentInfo:{
                            location:'',
                            name:'',
                            serial:''
                        }
                    },
                    userInfo:{
                        addInfo:{
                            gender:"男",
                            departmentId:"112",
                            name:"彭于晏",
                            isManager:1,
                            isScheduling:"1",
                            emoNo:"cd425b",
                            position:"架构师",
                            avatar:"http://shared-resource.oss-cn-beijing.aliyuncs.com/969878f1f1149e6a7afae38636c0abc/8211071354101990136.png",
                            hiredate:"2018-07-07T02:37:46.802Z",
                            email:"123456@qq.com"
                        }
                    }
                },
                viewList:{
                    userInfo:{
                        addInfo:{
                            name:''
                        }
                    },
                    inspectRecord:{
                        state:'',
                        createTime:'',
                        remark:'',
                    },
                    inspectTime:'',
                    addInfo:{
                        name:'',
                        state:'',
                        inspector:'',
                        department:'',
                        group:'',
                        lastInspectTime:'',
                        equipmentInfo:{
                            location:'',
                            name:'',
                            serial:''
                        }
                    }
                },
                inspectTotal:1,
                inspectResultTotal:1,
                recordTotal:1,
                routeTotal:1,
                deviceAEVisible:false,
                inspectRecordVisible:false,
                choiceDeviceVisible:false,
                deviceAEForm:{
                    name:'',
                    duration:'',
                    location:'',
                    serial:''
                },
                routeForm:{
                    name:'',
                    type:[],
                },
                insNum:10, //累计巡检次数
                abnorNum:3, //异常登记次数
                deviceAELoading:false,
                week:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                equipmentIdList:'',
                userid:'',

            }
        },
        methods:{
            selsChange: function (sels) {
                this.sels = sels;
            },
            personChoice(val){
                let obj = {};
                obj = this.personList.find((item)=>{//遍历的数据源
                    return item.id === val;//筛选出匹配数据
                });
                this.userid=obj.id;
            },
            queryInspectState(value){
                let obj = {};
                obj = this.inspecStaList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=inspectBySelUrl+'&taskId='+this.detailList.id+'&equipmentIdList='+
                    this.equipmentIdList+'&recentDate='+this.detailList.recentInspectDate;
                url=this.selectLabel==='全部'?url+'':url+'&state='+this.selectLabel;
                this.getInsBySelList(url);
            },
            backMainPage(){
                this.mainPage=true;
                this.detailPage=false;
                this.historyPage=false;
                this.routeAddEditPage=false;
                this.page=1;
            },
            backHisPage(){
                this.mainPage=false;
                this.detailPage=false;
                this.historyPage=true;
                this.routeAddEditPage=false;
                this.page=1;
            },
            printQrCode(){ //生成并打印设备二维码
                console.log("qrCode")
            },
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                this.page=1;
            },
            getQueryInspection(){ //巡检任务 条件查询
                let url=inspectTaskListUrl;
                let name=this.inspectFilters.searchTitle;
                url=name===''?url+'':url+'&name='+name;
                this.getInspect(url);
                this.inspectFilters={
                    searchTitle:'',
                }
            },
            secQueryState(value){
                let obj = {};
                obj = this.stateList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=inspectTaskListUrl;
                url=this.selectLabel==='全部状态'?url+'':url+'&state='+this.selectLabel;
                this.getInspect(url);
            },
            secQueryDoneState(value){
                let obj = {};
                obj = this.doneList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=inspectTaskListUrl;
                url=this.selectLabel==='全部状态'?url+'':url+'&completeState='+this.selectLabel;
                this.getInspect(url);
            },
            getQueryRecord(){//巡检任务历史记录 条件查询
                let url=historyListlUrl+'&taskId='+this.detailList.id;
                let startDate=this.recordFilters.timeRecordValue[0];
                let endDate=this.recordFilters.timeRecordValue[1];
                url=startDate===undefined?url+'':url+'&startDate='+startDate.slice(0,10);
                url=endDate===undefined?url+'':url+'&endDate='+endDate.slice(0,10);
                this.getHistoryList(url);
                this.recordFilters={
                    timeRecordValue:[],
                    secDoneValue:'',
                    secFaultValue:'',
                }
            },
            queryRecordState(value){
                let obj = {};
                obj = this.doneList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=historyListlUrl+'&taskId='+this.detailList.id;
                url=this.selectLabel==='全部状态'?url+'':url+'&completeState='+this.selectLabel;
                this.getHistoryList(url);
            },
            queryRecordFault(value){
                let obj = {};
                obj = this.faultCondition.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=historyListlUrl+'&taskId='+this.detailList.id;
                url=this.selectLabel==='全部'?url+'':url+'&faultState='+this.selectLabel;
                this.getHistoryList(url);
            },
            getInspection(){ //巡检记录数据
                this.getInspect(inspectTaskListUrl);
            },
            getInspect(url){//巡检任务 列表数据
                this.inspectLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.inspectList=res;
                        this.inspectTotal=this.inspectList.length>0?this.inspectList.length:1;
                        this.inspectLoading=false;
                    })
            },
            getQueryRoute(){//设备管理 条件查询
                let url=inspectTaskListUrl;
                let name=this.routeFilters.searchTitle;
                url=name===''?url+'':url+'&name='+name;
                this.getRouteList(url);
                this.routeFilters={
                    state:'',
                    searchTitle:''
                }
            },
            getQueryAllNodes(){//需要巡检的设备 条件查询
                let url=equipUrl;
                let name=this.allNodeFilters.searchTitle;
                url=name===''?url+'':url+'&name='+name;
                this.getAllInsNodeList(url);
                this.allNodeFilters={
                    state:'',
                    searchTitle:''
                }
            },
            queryInsRouteState(value){
                let obj = {};
                obj = this.stateList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=inspectTaskListUrl;
                url=this.selectLabel==='全部状态'?url+'':url+'&state='+this.selectLabel;
                this.getRouteList(url);
            },
            queryInsAllNodes(value){
                let obj = {};
                obj = this.cateList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let url=equipUrl;
                url=this.selectLabel==='全部'?url+'':url+'&type='+this.selectLabel;
                this.getAllInsNodeList(url);
            },
            getInspectRouteMg(){ //巡检路线管理列表
                this.getRouteList(inspectTaskListUrl);
            },
            getRouteList(url){//设备管理列表数据
                this.routeLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.routeList=res;
                        this.routeTotal=this.routeList.length>0?this.routeList.length:1;
                        this.routeLoading=false;
                    })
            },
            allDeal(){ //全部
                this.getInspection();
            },
            pending(){ //待处理

            },
            processed(){ //已处理

            },
            routeAdd(){ //显示新增
                this.mainPage=false;
                this.routeAddEditPage=true;
                this.page=1;
                this.inspectNodeLoading=true;
                this.insNodeList=[];
                this.inspectNodeLoading=false;
                // this.addEditTitle='新增';
                this.isEdit=false;
                // this.deviceAEVisible=true;
                // this.deviceAEForm={
                //     name:'',
                //     duration:'',
                //     location:'',
                //     serial:''
                // };
            },
            saveChangeMem(){//保存 更换巡检人
                this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    this.detailPage = false;
                    this.historyPage = false;
                    this.mainPage = true;
                    this.changeMember=false;
                    this.changePerson();
                });
            },
            changePerson(){
                let data={
                    parkId:localStorage.getItem("parkId"),
                    state: this.detailList.state,
                    name: this.detailList.name,
                    cycle:this.detailList.cycle,
                    id:this.detailList.id,
                    userId:this.userid,
                    addInfo:{
                        equipments:this.detailList.addInfo.equipments
                    }
                };
                this.$post(addUpdateInsTaskUrl,data)
                    .then((res)=>{
                        this.getInspection();
                    })
            },
            detailEdit(index, row){ //显示详情/编辑
                this.mainPage=false;
                this.detailPage=true;
                this.historyPage=false;
                this.inspectHisView=false;
                this.page=1;
                this.changeMember=row.addInfo.state==='停用'?false:true;
                this.detailList=Object.assign({}, row);
                this.detailList.addInfo.department="物业部";
                this.detailList.addInfo.group='工程组';
                if(!row.userInfo){
                    this.detailList.userInfo=Object.assign({},{
                        addInfo:{
                            name:''
                        }
                    });
                    this.detailList=Object.assign({},this.detailList);
                }
                this.equipmentIdList=row.addInfo.equipments.join(',');
                let url=inspectBySelUrl+'&taskId='+this.detailList.id+'&equipmentIdList='+
                    this.equipmentIdList+'&recentDate='+this.detailList.recentInspectDate;
                this.userid=row.userId;
                this.getInsBySelList(url);
            },
            getInsBySelList(url){//巡检任务 列表数据
                this.inspectResultLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.inspectResultList=res;
                        this.inspectResultTotal=this.inspectResultList.length>0?this.inspectResultList.length:1;
                        this.inspectResultLoading=false;
                    })
            },
            historyRecord(index, row){// 显示历史记录
                this.mainPage=false;
                this.detailPage=false;
                this.historyPage=true;
                this.page=1;
                this.detailList=Object.assign({}, row);
                if(!row.userInfo){
                    this.detailList.userInfo=Object.assign({},{
                        addInfo:{
                            name:''
                        }
                    });
                    this.detailList=Object.assign({},this.detailList);
                }
                this.detailList.addInfo.department='物业部';
                this.detailList.addInfo.group='工程组';
                let url=historyListlUrl+'&taskId='+this.detailList.id;
                this.getHistoryList(url);
            },
            getHistoryList(url){//巡检任务 列表数据
                this.recordLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.recordList=res;
                        this.recordTotal=this.recordList.length>0?this.recordList.length:1;
                        this.recordLoading=false;
                    })
            },
            viewRecord(index,row){//显示检查记录
                this.viewList=Object.assign({}, row);
                this.viewRecordVisible=true;
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            compCurChange(val) {
                this.page = val;
                this.getInspection();
            },
            inspectResultCurChange(val) {
                this.page = val;
                // this.getInspectionResult();
            },
            recordCurChange(val) {
                this.page = val;
                // this.getRecord();
            },
            routeCurChange(val) {
                this.page = val;
                this.getInspectRouteMg();
            },
            addNodeDevice(){//添加节点设备
                this.choiceDeviceVisible=true;
                // this.getAllInsNodeList(equipUrl);
            },
            getAllInsNodeList(url){//设备管理列表数据
                this.allInspectNodeLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.allInspectNodeList=res;
                        let arr=[];
                        let newArr = [];//数组去重
                        this.allInspectNodeList.forEach((item)=>{
                            arr.push(item.type);
                        });
                        for(let i =0;i<arr.length-1;i++){
                            if(newArr.indexOf(arr[i]) == -1){
                                newArr.push(arr[i]);
                            }
                        }
                        this.cateList=[{id:'001',name:'全部'}];
                        newArr.forEach((item,index)=>{
                            let obj={
                                id:index,
                                name:item
                            };
                            this.cateList.push(obj);
                        });
                        this.allInspectNodeLoading=false;
                    })
            },
            addDeviceSubmit: function () {  //新增巡检设备
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.deviceAELoading = true;
                    this.insNodeList.push.apply(this.insNodeList,this.sels);
                    // this.$post(addEquip,data)
                    //     .then((res)=>{
                            this.deviceAELoading = false;
                            this.choiceDeviceVisible = false;
                            // this.getInspectRouteMg();
                        // })
                });
            },
            addInspectRouteSubmit() {  //新增巡检路线
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.routeAddEditPage = true;
                    let arr=this.routeForm.type;
                    let brr=[];
                    if(arr.length>0){
                        arr.forEach((item)=>{
                            brr.push(this.week.indexOf(item));
                        })
                    }
                    brr=brr.sort(this.compare);
                    let equipments=[];
                    this.insNodeList.forEach((item)=>{
                        equipments.push(item.id);
                    });
                    let state=this.routeChecked?'启用':'停用';
                    let data={
                        parkId:localStorage.getItem("parkId"),
                        state: state,
                        name: this.routeForm.name,
                        cycle:brr.join(','),
                        addInfo:{
                            equipments:equipments
                        }
                    };
                    if(this.isEdit){
                        data.id=this.isEditId;
                    }

                    this.$post(addUpdateInsTaskUrl,data)
                        .then((res)=>{
                            this.routeAddEditPage = false;
                            this.mainPage = true;
                            this.getInspectRouteMg();
                        })
                });
            },
            compare(x, y) {//比较函数
                if (x < y) {
                    return -1;
                } else if (x > y) {
                    return 1;
                } else {
                    return 0;
                }
            },
            recordDetail(index, row) {//显示 巡检记录详情
                this.hisInspectDate=row.inspectDate;
                this.recordUserName=row.userInfo && row.userInfo.addInfo && row.userInfo.addInfo.name?row.userInfo.addInfo.name:'无数据';
                this.hisCompleteState=row.completeState;
                this.inspectHisView=true;
                this.mainPage=false;
                this.detailPage=true;
                this.historyPage=false;
                this.page=1;
                // this.changeMember=row.addInfo.state==='停用'?false:true;
                this.changeMember=false;
                this.detailList.addInfo.department="物业部";
                this.detailList.addInfo.group='工程组';
                if(!row.userInfo){
                    this.detailList.userInfo=Object.assign({},{
                        addInfo:{
                            name:''
                        }
                    });
                    this.detailList=Object.assign({},this.detailList);
                }
                this.equipmentIdList=this.detailList.addInfo.equipments.join(',');
                // this.equipmentIdList=row.addInfo.equipments.join(',');
                let url=inspectBySelUrl+'&taskId='+this.detailList.id+'&equipmentIdList='+
                    this.equipmentIdList+'&recentDate='+row.inspectDate;
                this.userid=this.detailList.userId;
                this.getInsBySelList(url);
            },
            routeEdit(index, row) {//显示编辑界面
                this.mainPage=false;
                this.routeAddEditPage=true;
                this.page=1;
                this.insNodeList=[];
                this.routeChecked=row.state==='启用'?true:false;
                this.inspectNodeLoading=true;
                this.allInspectNodeList.forEach((item)=>{
                    if(row.addInfo.equipments){
                        row.addInfo.equipments.forEach((rowitem)=>{
                            if(rowitem===item.id){
                                this.insNodeList.push(item);
                            }
                        })
                    }
                });
                this.inspectNodeLoading=false;
                this.isEditId=row.id;
                this.isEdit=true;
                // this.deviceAEVisible = true;
                // this.routeForm = Object.assign({}, row);
                this.routeForm.name =row.name;
                this.routeForm.type=[];
                if(row.cycle && row.cycle.split(',').length>0){
                    let type=row.cycle.split(',');
                    type.forEach((item)=>{
                        this.routeForm.type.push(this.week[item]);
                    })
                }
            },
            enableOrdisable(index,row){//启用或停用
                this.$confirm('确认改变该状态吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let state=row.state;
                    state=state==='启用'?'停用':state==='停用'?'启用':state;
                    let data={
                        id:row.id,
                        parkId:localStorage.getItem("parkId"),
                        state:state,
                        name:row.name,
                        cycle:row.cycle,
                        addInfo:{
                            equipments:row.addInfo.equipments
                        }
                    };
                    this.$post(addUpdateInsTaskUrl,data)
                        .then((res)=>{
                            this.getInspectRouteMg();
                        })
                }).catch(() => {

                });


            },
            routeDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.routeLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(delInsTaskUrl+para.id)
                        .then(function(response) {
                            self.routeLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInspectRouteMg();
                        });
                }).catch(() => {

                });
            },
            routeNoteDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.inspectNodeLoading = true;
                    this.insNodeList.splice(index,1);
                    this.inspectNodeLoading = false;
                }).catch(() => {

                });
            },
            getUserList() {  //获取员工列表
                this.$get(parkUserList).then(res => {
                    this.personList = res;
                });
            },

        },
        mounted(){
            this.getInspection();//巡检任务
            this.getInspectRouteMg();//巡检路线管理
            this.getUserList();//获取员工列表
            this.getAllInsNodeList(equipUrl);//所以需要查询的设备管理列表数据
        }
    }
</script>

<style lang="scss" scoped>
    .right{
        position: absolute;
        right: 23px;
        top: 55px;
    }
    .inView{
        .el-form-item{
            display: inline-block;
            width: 48%;
            &.allWid{
                width: 100%;
            }
            .el-select{
                width: 150px;
            }
        }
    }
    .allWid{
        img{
            height: 80px;
            margin-right: 15px;
        }
    }
    .devInspec{
        .devices{
            display: inline-block;
            width: 70%;
            min-height: 50px;
            span{
                display: inline-block;
                margin-right: 25px;
                margin-bottom: 6px;
            }
        }
        .pullRight{
            width: 30%;
            height: 50px;
            text-align: right;
            float: right;
            display: inline-block;
            position: absolute;
            right: 23px;
            span{
                display: block;
                margin-bottom: 6px;
                .red{
                    color: #ff4d51;
                }
            }
        }
    }
    .routeDetail{
        .el-input{
            width: 350px;
        }
    }
    .router-footer{
        margin-top: 25px;
        text-align: right;
        .el-button{
            margin-right: 10%;
        }
    }
</style>