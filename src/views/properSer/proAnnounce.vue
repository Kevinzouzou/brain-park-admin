<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="announceFilters">
                <el-form-item>
                    <span>日期范围：</span>
                </el-form-item>
                <el-form-item>
                    <div class="block">
                        <!--<p>组件值：{{ timerValue }}</p>-->
                        <el-date-picker v-model="announceFilters.timeAnnounceValue" type="daterange" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="announceFilters.searchTitle" placeholder="搜索标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryAnnounce">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="danger" @click="BatchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="announceAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="announceList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="announceLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间" sortable>
            </el-table-column>
            <el-table-column prop="lookUpNum" label="浏览量" sortable>
                <template slot-scope="scope">
                    <span>{{scope.row.lookUpNum?scope.row.lookUpNum:0}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="announceEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="announceDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="sizeChange"
                           @current-change="currentChange"
                           :page-sizes="[7,8,10,20]"
                           :page-size="pagesize"
                           layout="total,sizes, prev, pager, next, jumper"
                           :total="announceTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="announceAEVisible">
            <el-form :model="announceAEForm" label-width="80px" ref="announceAEForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="announceAEForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="详细介绍">
                    <UE :id=ue @editorChange="AddChange"></UE>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="announceAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAnnouSubmit" :loading="annouAELoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import UE from '../../components/ue'
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                page:1,
                pagesize:7,
                announceFilters: {
                    searchTitle: '',
                    timeAnnounceValue:[]
                },
                timeAnnounceValue:[],
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',             
                announceAEVisible:false,
                announceAEForm:{
                    title:''
                },
                announceList:[],
                sels:[],   //列表选中项
                announceLoading:false,
                annouAELoading:false,
                announceTotal:1,
                ue:'announceId',
                announceContent:'',

            }
        },
        methods:{
            BatchRemove(){  // 批量删除

            },
            announceAdd(){  //显示新增界面
                this.addEditTitle='新增';
                this.isEdit=false;
                this.announceAEVisible=true;
                this.announceAEForm={
                    title:''
                };
            },
            getQueryAnnounce(){ // 物业公告模糊查询
                let type='物业公告';
                let url=showDisplay+type;
                let startTime=this.announceFilters.timeAnnounceValue[0];
                let endTime=this.announceFilters.timeAnnounceValue[1];
                let title=this.announceFilters.searchTitle;
                url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
                url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
                url=title===''?url+'':url+'&title='+title;
                this.getAnData(url);
                this.announceFilters={
                    timeAnnounceValue:[],
                    searchTitle:''
                }
            },
            getAnnounceList(){    //物业公告列表
                let type='物业公告';
                this.getAnData(showDisplay+type);
            },
            getAnData(url){
                this.announceLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.announceList=res;
                        this.announceTotal=this.announceList.length>0?this.announceList.length:1;
                        this.announceLoading=false;
                    })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            announceDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.announceLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDisplay+para.id)
                        .then(function(response) {
                            self.announceLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAnnounceList();
                        });
                }).catch(() => {

                });
            },
            announceEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.announceAEVisible = true;
                this.announceAEForm = Object.assign({}, row);
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
                this.getAnnounceList();
            },
            addAnnouSubmit: function () {  //新增
                this.$refs.announceAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.annouAELoading = true;
                            let para = Object.assign({}, this.announceAEForm);
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                thumbUrl:'null',
                                title:this.announceAEForm.title,
                                type:'物业公告',
                                detailUrl:'null',
                                addInfo:{
                                    themeContent:this.announceContent
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                           this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.annouAELoading = false;
                                    this.announceAEVisible = false;
                                    this.getAnnounceList();
                                })
                        });
                    }
                });
            },
            AddChange(html){  // ueditor
                this.announceContent=html;
            },

        },
        mounted(){
            this.getAnnounceList();   //物业公告
        }
    }
</script>

<style lang="scss">

</style>
