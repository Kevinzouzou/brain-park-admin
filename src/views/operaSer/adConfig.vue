<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true">
                <el-form-item>
                    广告位筛选：
                    <el-select v-model="secAdValue" placeholder="请选择" @change="secJqueryAdsValue">
                        <el-option v-for="item in adLocList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <!--<el-button type="primary" v-on:click="getAdsMg">查询</el-button>-->
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="danger" @click="adsBatchRemove" :disabled="this.adsSels.length===0">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="adsAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="adsList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="adsLoading" @selection-change="selsAdsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="title" label="标题" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类别" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间" sortable>
            </el-table-column>
            <el-table-column prop="lookUpNum" label="浏览量" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="info" size="small" @click="AdsEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="AdsDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="highSizeChange"
                           @current-change="adsCurChange"
                           :page-sizes="[7,8,10,20]"
                           :page-size="pagesize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="adsTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="addEditAdsVisible">
            <el-form :model="adsForm" label-width="80px" ref="adsForm">
                <el-form-item label="广告图">
                    <el-upload action="/api/OperFile/uploadFile/" list-type="picture-card"
                               :on-preview="handleAdsPictureCardPreview" :on-remove="handleAdsRemove"
                               :file-list="imgAdsList" :on-success="moreAdsShow">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogAdsVisible">
                        <img width="100%" :src="dialogAdsImageUrl" >
                    </el-dialog>
                </el-form-item>
                <el-form-item label="广告位">
                    <el-select v-model="adsForm.secAdValue" placeholder="请选择" @change="secAdsValue">
                        <el-option v-for="item in adLocList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接" prop="links">
                    <el-input v-model="adsForm.links" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="disc">
                    <el-input v-model="adsForm.disc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addEditAdsVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAdsSubmit" :loading="addEditAdsLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
       data(){
           return {
               secAdValue:'',
               adLocList:[
                    {
                        id:'001',
                        name:'用户端-首页'
                    },
                    {
                        id:'002',
                        name:'用户端-服务页'
                    },
                    {
                        id:'003',
                        name:'用户端-信息页'
                    }
                ],
               page:1,
               pagesize:7,
               adsList:[],
               adsTotal:1,
               adsLoading:false,
               adsSels:[],//选中项
               addEditTitle:'新增',
               morePicList:[],
               addEditAdsVisible:false,
               addEditAdsLoading:false,
               adsForm:{
                   secAdValue:'',
                   links:'',
                   disc:''
               },
               imgAdsList:[],
               dialogAdsImageUrl: '',
               dialogAdsVisible: false,
               selectLabel:'',

           }
       },
       methods:{
           getAdsMg(){   //获取广告管理列表
               let type='广告管理';
               this.adsLoading=true;
               this.$get(showDisplay+type)
                   .then((res) => {
                       this.adsList=res;
                       this.adsTotal=this.adsList.length>0?this.adsList.length:1;
                       this.adsLoading=false;
                   })
           },
           adsBatchRemove () { //批量删除
               var ids = this.adsSels.map(item => item.id).toString();
               this.$confirm('确认删除选中记录吗？', '提示', {
                   type: 'warning'
               }).then(() => {
                   this.adsLoading = true;
                   let para = { ids: ids };
                   // batchRemoveUser(para).then((res) => {
                   //     this.highActLoading = false;
                   //     //NProgress.done();
                   //     this.$message({
                   //         message: '删除成功',
                   //         type: 'success'
                   //     });
                   //     this.getHighActivity();
                   // });
               }).catch(() => {

               });
           },
           adsAdd(){
               this.addEditTitle='新增';
               this.morePicList.length=0;
               this.addEditAdsVisible=true;
               this.adsForm={
                   secAdValue:'',
                   links:'',
                   disc:''
               };
           },
           selsAdsChange(sels) {
               this.adsSels = sels;
           },
           AdsEdit(index, row) { // 显示编辑界面
               this.addEditTitle='编辑';
               this.morePicList.length=0;
               this.addEditAdsVisible = true;
               this.adsForm = Object.assign({}, row);
           },
           AdsDel(index, row) {  //园区公告 删除
               this.$confirm('确认删除该记录吗?', '提示', {
                   type: 'warning'
               }).then(() => {
                   this.adsLoading = true;
                   let para = { id: row.id };
                   let self=this;
                   this.$del(deleteDisplay+para.id)
                       .then(function(response) {
                           self.adsLoading = false;
                           self.$message({
                               message: '删除成功',
                               type: 'success'
                           });
                           self.getAdsMg();
                       });
               }).catch(() => {

               });
           },
           highSizeChange(val) {
               this.pagesize=val;
           },
           adsCurChange(val) {
               this.page = val;
               this.getAdsMg();
           },
           moreAdsShow(res,file,fileList){
               this.morePicList.push(res.responseList)
           },
           handleAdsRemove(file, fileLists) {
               console.log(file, fileLists);
           },
           handleAdsPictureCardPreview(file) {
               this.dialogAdsImageUrl = file.url;
               this.dialogAdsVisible = true;
           },
           secJqueryAdsValue(value){
               let obj = {};
               obj = this.adLocList.find((item)=>{//遍历的数据源
                   return item.id === value;//筛选出匹配数据
               });
               this.selectLabel=obj.name;

           },
           secAdsValue(value){
               let obj = {};
               obj = this.adLocList.find((item)=>{//遍历的数据源
                   return item.id === value;//筛选出匹配数据
               });
               this.selectLabel=obj.name;
           },
           addAdsSubmit() {  //新增
               this.$refs.adsForm.validate((valid) => {
                   if (valid) {
                       this.$confirm('确认提交吗？', '提示', {}).then(() => {
                           this.addEditAdsLoading = true;
                           let para = Object.assign({}, this.adsForm);
                           let data={
                               parkId:localStorage.getItem("parkId"),
                               thumbUrl:this.morePicList[0],
                               title:this.adsForm.disc,
                               type:'公告',
                               detailUrl:this.adsForm.links,
                               addInfo:{
                                   subtype:this.selectLabel
                               }
                           };
                           this.$post(addDisplay,data)
                               .then((res)=>{
                                   this.addEditAdsLoading = false;
                                   this.addEditAdsVisible = false;
                                   this.getAdsMg();
                               })
                       });
                   }
               });
           },

       }
    }
</script>

<style scoped>

</style>