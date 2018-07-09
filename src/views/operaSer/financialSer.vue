<template>
    <section>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="公司金融服务" name="first">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="corporateBatchRemove" :disabled="this.corSels.length===0">批量删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="corporateAdd">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="corporateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="corporateLoading" @selection-change="selsCorporateChange" style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="type" label="类别" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发布时间" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.lookUpNum" label="浏览量" sortable>
                        <template slot-scope="scope">
                            <span>{{scope.row.addInfo.lookUpNum?scope.row.addInfo.lookUpNum:0}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="info" size="small" @click="corporateEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="corporateDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background
                                   @size-change="highSizeChange"
                                   @current-change="corporateCurChange"
                                   :page-sizes="[7,8,10,20]"
                                   :page-size="pagesize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="corporateTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
                <!--新增/编辑界面-->
                <el-dialog :title=addEditTitle :visible.sync="addEditCorporateVisible">
                    <el-form :model="corporateForm" label-width="80px" ref="corporateForm">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="corporateForm.title" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="缩略图">
                            <el-upload :action=url list-type="picture-card"
                                       :on-preview="corpPictureCardPreview" :on-remove="handleCorporateRemove"
                                       :file-list="imgCorpList" :on-success="moreCorporateShow">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogCorpVisible">
                                <img width="100%" :src="dialogCorpImageUrl" >
                            </el-dialog>
                        </el-form-item>
                        <el-form-item label="详细内容">
                            <UE :id=ue @editorChange="corporateAddChange"></UE>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addEditCorporateVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addCorporateSubmit" :loading="addEditCorLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <!--<el-tab-pane label="个人金融服务" name="second">个人金融服务 。。。</el-tab-pane>-->
        </el-tabs>

    </section>
</template>

<script>
    import UE from '../../components/ue'
    import {showDisplay, addDisplay, deleteDisplay,uploadPic,} from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                url:'',
                activeName:'first',
                page:1,
                pagesize:7,
                corSels: [],//公司。。列表选中列
                corporateList:[],
                corporateLoading:false,
                addEditTitle:'新增',
                addEditCorporateVisible:false,
                addEditCorLoading:false,
                corporateForm:{
                    title:''
                },
                ue:'corId',
                morePicList:[],
                corporateContent:'',
                corporateTotal:2,
                imgCorpList:[],
                dialogCorpImageUrl: '',
                dialogCorpVisible: false,
                isEditId:'',
                isEdit:false,
            }
        },
        methods:{
            handleClick(tab, event) {
                this.page=1;
            },
            corporateBatchRemove () { //公司金融服务批量删除
                var ids = this.corSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.corporateLoading = true;
                    let para = { ids: ids };

                }).catch(() => {

                });
            },
            corporateAdd(){  //公司。。新增
                this.addEditTitle='新增';
                this.isEdit=false;
                this.morePicList.length=0;
                this.corporateContent='';
                this.addEditCorporateVisible=true;
                this.corporateForm={
                    title:''
                };
            },
            selsCorporateChange(sels) {
                this.corSels = sels;
            },
            corporateEdit(index, row) { //公司。。 显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.morePicList.length=0;
                this.addEditCorporateVisible = true;
                this.corporateForm = Object.assign({}, row);
            },
            corporateDel(index, row) {  //惠通知 删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.corporateLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDisplay+para.id)
                        .then(function(response) {
                            self.corporateLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getCorporate();
                        });
                }).catch(() => {

                });
            },
            getCorporate(){  //公司金融服务列表
                let type='金融服务';
                this.corporateLoading=true;
                this.$get(showDisplay+type)
                    .then((res) => {
                        this.corporateList=res;
                        this.corporateTotal=this.corporateList.length>0?this.corporateList.length:1;
                        this.corporateLoading=false;
                    })
            },
            highSizeChange(val) {
                this.pagesize=val;
            },
            corporateCurChange(val) {
                this.page = val;
                this.getCorporate();
            },
            moreCorporateShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            handleCorporateRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            corpPictureCardPreview(file) {
                this.dialogCorpImageUrl = file.url;
                this.dialogCorpVisible = true;
            },
            corporateAddChange(html){
                this.corporateContent=html;
            },
            addCorporateSubmit() {  //公司金融服务 新增
                this.$refs.corporateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addEditCorLoading = true;
                            let para = Object.assign({}, this.corporateForm);
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                thumbUrl:this.morePicList[0],
                                title:this.corporateForm.title,
                                type:'金融服务',
                                detailUrl:'null',
                                addInfo:{
                                    themeContent:this.corporateContent
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.addEditCorLoading = false;
                                    this.addEditCorporateVisible = false;
                                    this.getCorporate();
                                })
                        });
                    }
                });
            },


        },
        mounted(){
            this.getCorporate();  //公司金融服务列表
            this.url=localStorage.getItem("upUrl")+uploadPic;
        }
    }
</script>

<style scoped>

</style>