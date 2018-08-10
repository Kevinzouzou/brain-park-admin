<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="workBookFilters">
                <el-form-item>
                    <span>日期范围：</span>
                </el-form-item>
                <el-form-item>
                    <div class="block">
                        <!--<p>组件值：{{ timerValue }}</p>-->
                        <el-date-picker v-model="workBookFilters.workBookTimeValue" type="daterange" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="workBookFilters.searchTitle" placeholder="工作手册搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryWorkBook">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
               <el-form-item>
                    <el-button type="primary" @click="workBookAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="workBookList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="workBookLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="workBookEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="workBookDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[8,10,20,50]"
                           :page-size="pagesize"
                           layout="total,sizes, prev, pager, next, jumper"
                           :total="workBookTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="workBookAEVisible">
            <el-form :model="workBookAEForm" label-width="90px" ref="workBookAEForm">
                <el-form-item label="手册名称：" prop="title">
                    <el-input v-model="workBookAEForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传文件：" prop="title">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action=url
                            :data="othParams"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuc"
                            :file-list="fileList"
                            >
                        <el-button v-show="checkFile" slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="workBookAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="workBookSubmit" :loading="wBookAELoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import UE from '../../components/ue'
    import {uploadPic,showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                othParams:{
                    bucketName:'shared-resource',
                    folderName:''
                },
                checkFile:true,
                page:1,
                pagesize:8,
                workBookFilters: {
                    searchTitle: '',
                    workBookTimeValue:[]
                },
                workBookTimeValue:[],
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                workBookAEVisible:false,
                workBookAEForm:{
                    title:''
                },
                workBookList:[
                    {
                        title:'深刻把握科技创新与发展大势 央视快评',
                        createTime:'2018-06-13'
                    },
                    {
                        title:'习近平的上合“心”动力 为上合组织发展规划蓝图',
                        createTime:'2018-06-12'
                    }
                ],
                sels:[],   //列表选中项
                workBookLoading:false,
                wBookAELoading:false,
                workBookTotal:1,
                fileList:[],
                url:'', //文件上传路径
                moreFileList:[],

            }
        },
        methods:{
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.checkFile=true;
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSuc(res, file, fileList){
                this.moreFileList.push(res.responseList.url);
                this.checkFile=false;
            },
            getQueryWorkBook(){ // 工作手册模糊查询
                let type='工作手册';
                let url=showDisplay+type;
                let startTime=this.workBookFilters.workBookTimeValue[0];
                let endTime=this.workBookFilters.workBookTimeValue[1];
                let title=this.workBookFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=title===''?url+'':url+'&title='+title;
                this.getWorkBookList(url);
                this.workBookFilters={
                    workBookTimeValue:[],
                    searchTitle:''
                }
            },
            workBookAdd(){  //显示新增界面
                this.addEditTitle='新增';
                this.isEdit=false;
                this.moreFileList.length=0;
                this.workBookAEVisible=true;
                if(this.$refs.upload!==undefined) this.$refs.upload.clearFiles();
                this.checkFile=true;
                this.workBookAEForm={
                    title:''
                };
            },
            getWorkBook(){    //工作手册列表
                let type='工作手册';
                this.getWorkBookList(showDisplay+type);
            },
            getWorkBookList(url){//手册列表数据
                this.workBookLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.workBookList=res;
                        this.workBookTotal=this.workBookList.length>0?this.workBookList.length:1;
                        this.workBookLoading=false;
                    })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            workBookDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.workBookLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDisplay+para.id)
                        .then(function(response) {
                            self.workBookLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getWorkBook();
                        });
                }).catch(() => {

                });
            },
            workBookEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.moreFileList.length=0;
                this.workBookAEVisible = true;
                this.workBookAEForm = Object.assign({}, row);
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
            },
            workBookSubmit: function () {  //新增
                this.$refs.workBookAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.wBookAELoading = true;
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                // thumbUrl:this.moreFileList[0],
                                thumbUrl:'null',
                                detailUrl:this.moreFileList[0],
                                title:this.workBookAEForm.title,
                                type:'工作手册',
                                addInfo:{}
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.wBookAELoading = false;
                                    this.workBookAEVisible = false;
                                    this.getWorkBook();
                                })
                        });
                    }
                });
            },

        },
        mounted(){
            this.getWorkBook();   //物业公告
            this.url=localStorage.getItem("upUrl")+uploadPic;
            this. othParams={
                bucketName:'shared-resource',
                folderName:localStorage.getItem("parkId")
            };
        }
    }
</script>

<style lang="scss">

</style>
