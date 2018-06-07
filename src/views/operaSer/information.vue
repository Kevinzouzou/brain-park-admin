<template>
    <section>
       <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
           <el-tab-pane label="园区公告" name="first">
               <div class="firstAnnounce" v-show="firstAnVisible">
                  <el-col :span="24" justify="center">
                      <el-form :inline="true" :model="announceFilters">
                          <el-form-item>
                              <el-button type="primary" @click="cateAnMg">类别管理</el-button>
                              <el-select v-model="secCateAnValue" placeholder="请选择">
                                  <el-option v-for="item in anCategoryList" :key="item.id" :label="item.name" :value="item.id">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item>
                              <div class="block">
                                  <!--<p>组件值：{{ timerValue }}</p>-->
                                  <el-date-picker v-model="timeAnValue" type="daterange" start-placeholder="开始日期"
                                                  end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                  :default-time="['00:00:00', '23:59:59']">
                                  </el-date-picker>
                              </div>
                          </el-form-item>
                          <el-form-item>
                              <el-input v-model="announceFilters.searchTitle" placeholder="搜索标题"></el-input>
                          </el-form-item>
                          <el-form-item>
                              <el-button type="primary" v-on:click="getAnnounceMg">查询</el-button>
                          </el-form-item>
                      </el-form>
                  </el-col>
                  <!--工具条-->
                  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                      <el-form :inline="true">
                          <el-form-item>
                              <el-button type="danger" @click="announceBatchRemove" :disabled="this.anSels.length===0">批量删除</el-button>
                          </el-form-item>
                          <el-form-item>
                              <el-button type="primary" @click="announceAdd">新增</el-button>
                          </el-form-item>
                      </el-form>
                  </el-col>
                  <!--列表-->
                  <el-table :data="announceList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="announceLoading" @selection-change="selsAnChange" style="width: 100%;">
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
                              <el-button type="info" size="small" @click="AnEdit(scope.$index, scope.row)">编辑</el-button>
                              <el-button type="danger" size="small" @click="AnDel(scope.$index, scope.row)">删除</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <!--分页-->
                  <el-col :span="24" class="toolbar">
                      <el-pagination background
                                     @size-change="highSizeChange"
                                     @current-change="announceCurChange"
                                     :page-sizes="[7,8,10,20]"
                                     :page-size="pagesize"
                                     layout="total, sizes, prev, pager, next, jumper"
                                     :total="announceTotal"
                                     :current-page="page"
                                     style="float:right;">
                      </el-pagination>
                  </el-col>
                  <!--新增/编辑界面-->
                  <el-dialog :title=addEditTitle :visible.sync="addEditAnVisible">
                      <el-form :model="announceForm" label-width="80px" ref="announceForm">
                          <el-form-item label="标题" prop="title">
                              <el-input v-model="announceForm.title" auto-complete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="类别">
                              <el-select v-model="secCateAnValue" placeholder="请选择" @change="secAnValue">
                                  <el-option v-for="item in anCategoryList" :key="item.id" :label="item.name" :value="item.id">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="缩略图">
                              <el-upload action="/api/OperFile/uploadFile/" list-type="picture-card"
                                         :on-preview="handleAnPictureCardPreview" :on-remove="handleAnRemove"
                                         :file-list="imgAnList" :on-success="moreAnShow">
                                  <i class="el-icon-plus"></i>
                              </el-upload>
                              <el-dialog :visible.sync="dialogAnVisible">
                                  <img width="100%" :src="dialogAnImageUrl" >
                              </el-dialog>
                          </el-form-item>
                          <el-form-item label="详细介绍">
                              <UE :id=ue @editorChange="announceAddChange"></UE>
                          </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                          <el-button @click.native="addEditAnVisible = false">取消</el-button>
                          <el-button type="primary" @click.native="addAnnounceSubmit" :loading="addEditAnLoading">提交</el-button>
                      </div>
                  </el-dialog>
              </div>
               <div class="secondAnnounce" v-show="secondAnVisible" title="类别管理">
                   <el-button class="backUp" type="danger" @click="backToFirstAn">返回</el-button>
                   <el-col :span="24" justify="center">
                       <el-form :inline="true" :model="anCategoryFilters">
                           <el-form-item>
                               <span>快速添加分类：</span>
                           </el-form-item>
                           <el-form-item>
                               <el-input v-model="anCategoryFilters.addType" placeholder="添加类别"></el-input>
                           </el-form-item>
                           <el-form-item>
                               <el-button type="primary" v-on:click="anCategoryAdd">添加</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--工具条-->
                   <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                       <el-form :inline="true">
                           <el-form-item>
                               <el-button type="danger" @click="anCategoryBatchRemove" :disabled="this.anCateSels.length===0">批量删除</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--列表-->
                   <el-table :data="anCategoryList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="anCategoryLoading" @selection-change="selsAnCategoryChange" style="width: 100%;">
                       <el-table-column type="selection" width="55">
                       </el-table-column>
                       <el-table-column type="index" width="60">
                       </el-table-column>
                       <el-table-column prop="name" label="类别" sortable>
                       </el-table-column>
                       <el-table-column label="操作">
                           <template scope="scope">
                               <el-button type="info" size="small" @click="anCateEdit(scope.$index, scope.row)">编辑</el-button>
                               <el-button type="danger" size="small" @click="anCateDel(scope.$index, scope.row)">删除</el-button>
                           </template>
                       </el-table-column>
                   </el-table>
                   <!--分页-->
                   <el-col :span="24" class="toolbar">
                       <el-pagination background
                                      @size-change="highSizeChange"
                                      @current-change="anCateCurrentChange"
                                      :page-sizes="[7,8,10,20]"
                                      :page-size="pagesize"
                                      layout="total,sizes, prev, pager, next, jumper"
                                      :total="anCateTotal"
                                      :current-page="page"
                                      style="float:right;">
                       </el-pagination>
                   </el-col>
                   <!--编辑界面-->
                   <el-dialog title="编辑" :visible.sync="anCateVisible">
                       <el-form :model="anCateForm" label-width="80px" ref="anCateForm">
                           <el-form-item label="分类" prop="type">
                               <el-input v-model="anCateForm.type" auto-complete="off"></el-input>
                           </el-form-item>
                       </el-form>
                       <div slot="footer" class="dialog-footer">
                           <el-button @click.native="anCateVisible = false">取消</el-button>
                           <el-button type="primary" @click.native="editAnCateSubmit" :loading="anCateLoading">提交</el-button>
                       </div>
                   </el-dialog>
               </div>
           </el-tab-pane>
           <el-tab-pane label="惠通知" name="second">
               <div class="firstAnnounce" v-show="firInformVisible">
                   <el-col :span="24" justify="center">
                       <el-form :inline="true" :model="informFilters">
                           <el-form-item>
                               <el-button type="primary" @click="cateInformMg">类别管理</el-button>
                               <el-select v-model="secCateInformValue" placeholder="请选择">
                                   <el-option v-for="item in informCateList" :key="item.id" :label="item.name" :value="item.id">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                           <el-form-item>
                               <div class="block">
                                   <!--<p>组件值：{{ timerValue }}</p>-->
                                   <el-date-picker v-model="timeInformValue" type="daterange" start-placeholder="开始日期"
                                                   end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                                   :default-time="['00:00:00', '23:59:59']">
                                   </el-date-picker>
                               </div>
                           </el-form-item>
                           <el-form-item>
                               <el-input v-model="informFilters.searchTitle" placeholder="搜索标题"></el-input>
                           </el-form-item>
                           <el-form-item>
                               <el-button type="primary" v-on:click="getInform">查询</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--工具条-->
                   <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                       <el-form :inline="true">
                           <el-form-item>
                               <el-button type="danger" @click="informBatchRemove" :disabled="this.informSels.length===0">批量删除</el-button>
                           </el-form-item>
                           <el-form-item>
                               <el-button type="primary" @click="informAdd">新增</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--列表-->
                   <el-table :data="informList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="informLoading" @selection-change="selsInformChange" style="width: 100%;">
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
                               <el-button type="info" size="small" @click="informEdit(scope.$index, scope.row)">编辑</el-button>
                               <el-button type="danger" size="small" @click="informDel(scope.$index, scope.row)">删除</el-button>
                           </template>
                       </el-table-column>
                   </el-table>
                   <!--分页-->
                   <el-col :span="24" class="toolbar">
                       <el-pagination background
                                      @size-change="highSizeChange"
                                      @current-change="informCurChange"
                                      :page-sizes="[7,8,10,20]"
                                      :page-size="pagesize"
                                      layout="total, sizes, prev, pager, next, jumper"
                                      :total="informTotal"
                                      :current-page="page"
                                      style="float:right;">
                       </el-pagination>
                   </el-col>
                   <!--新增/编辑界面-->
                   <el-dialog :title=addEditTitle :visible.sync="addEditInformVisible">
                       <el-form :model="informForm" label-width="80px" ref="informForm">
                           <el-form-item label="标题" prop="title">
                               <el-input v-model="informForm.title" auto-complete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="类别" >
                               <el-select v-model="secCateInformValue" placeholder="请选择" @change="secInformValue">
                                   <el-option v-for="item in informCateList" :key="item.id" :label="item.name" :value="item.id">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                           <el-form-item label="缩略图">
                               <el-upload action="/api/OperFile/uploadFile/" list-type="picture-card"
                                          :on-preview="informPictureCardPreview" :on-remove="handleInformRemove"
                                          :file-list="imgInformList" :on-success="moreInformShow">
                                   <i class="el-icon-plus"></i>
                               </el-upload>
                               <el-dialog :visible.sync="dialogInformVisible">
                                   <img width="100%" :src="dialogInformImageUrl" >
                               </el-dialog>
                           </el-form-item>
                           <el-form-item label="商家名称" prop="addInfo.name">
                               <el-input v-model="informForm.addInfo.name" auto-complete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="商家地址" prop="addInfo.address">
                               <el-input v-model="informForm.addInfo.address" auto-complete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="商家电话" prop="addInfo.phone">
                               <el-input v-model="informForm.addInfo.phone" auto-complete="off"></el-input>
                           </el-form-item>
                           <el-form-item label="详细内容">
                               <UE :id=ue1 @editorChange="informAddChange"></UE>
                           </el-form-item>
                       </el-form>
                       <div slot="footer" class="dialog-footer">
                           <el-button @click.native="addEditInformVisible = false">取消</el-button>
                           <el-button type="primary" @click.native="addInformSubmit" :loading="addEditInformLoading">提交</el-button>
                       </div>
                   </el-dialog>
               </div>
               <div class="secondAnnounce" v-show="secInformVisible" title="类别管理">
                   <el-button class="backUp" type="danger" @click="backToFirstInform">返回</el-button>
                   <el-col :span="24" justify="center">
                       <el-form :inline="true" :model="informCateFilters">
                           <el-form-item>
                               <span>快速添加分类：</span>
                           </el-form-item>
                           <el-form-item>
                               <el-input v-model="informCateFilters.addType" placeholder="添加类别"></el-input>
                           </el-form-item>
                           <el-form-item>
                               <el-button type="primary" v-on:click="informCateAdd">添加</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--工具条-->
                   <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                       <el-form :inline="true">
                           <el-form-item>
                               <el-button type="danger" @click="informCateBatchRemove" :disabled="this.informCateSels.length===0">批量删除</el-button>
                           </el-form-item>
                       </el-form>
                   </el-col>
                   <!--列表-->
                   <el-table :data="informCateList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="informCateLoading" @selection-change="selsInformCateChange" style="width: 100%;">
                       <el-table-column type="selection" width="55">
                       </el-table-column>
                       <el-table-column type="index" width="60">
                       </el-table-column>
                       <el-table-column prop="name" label="类别" sortable>
                       </el-table-column>
                       <el-table-column label="操作">
                           <template scope="scope">
                               <el-button type="info" size="small" @click="informCateEdit(scope.$index, scope.row)">编辑</el-button>
                               <el-button type="danger" size="small" @click="informCateDel(scope.$index, scope.row)">删除</el-button>
                           </template>
                       </el-table-column>
                   </el-table>
                   <!--分页-->
                   <el-col :span="24" class="toolbar">
                       <el-pagination background
                                      @size-change="highSizeChange"
                                      @current-change="informCateCurChange"
                                      :page-sizes="[7,8,10,20]"
                                      :page-size="pagesize"
                                      layout="total,sizes, prev, pager, next, jumper"
                                      :total="informCateTotal"
                                      :current-page="page"
                                      style="float:right;">
                       </el-pagination>
                   </el-col>
                   <!--编辑界面-->
                   <el-dialog title="编辑" :visible.sync="informCateVisible">
                       <el-form :model="informCateForm" label-width="80px" ref="informCateForm">
                           <el-form-item label="分类" prop="type">
                               <el-input v-model="informCateForm.type" auto-complete="off"></el-input>
                           </el-form-item>
                       </el-form>
                       <div slot="footer" class="dialog-footer">
                           <el-button @click.native="informCateVisible = false">取消</el-button>
                           <el-button type="primary" @click.native="editInformCateSubmit" :loading="informCateEditLoading">提交</el-button>
                       </div>
                   </el-dialog>
               </div>
           </el-tab-pane>
       </el-tabs>
    </section>
</template>

<script>
    import UE from '../../components/ue'
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'
    export default {
        components: {UE},
        data(){
            return {
                activeName:'first',
                page:1,
                pagesize:7,
                firstAnVisible:true,
                secondAnVisible:false,
                firInformVisible:true,
                secInformVisible:false,
                announceFilters: {
                    searchTitle: ''
                },
                informFilters: {
                    searchTitle: ''
                },
                secCateAnValue:'',
                secCateInformValue:'',
                timeAnValue:[],
                timeInformValue:[],
                anSels: [],//园区公告 列表选中列
                informSels: [],//惠通知 列表选中列
                addEditTitle:'新增',
                morePicList:[],
                announceList:[],
                informList:[],
                announceLoading:false,
                informLoading:false,
                addEditAnVisible:false,
                addEditInformVisible:false,
                announceForm:{
                    title:''
                },
                informForm:{
                    title:'',
                    addInfo:{
                        name:'',
                        addrress:'',
                        phone:''
                    }
                },
                selectLabel:'',
                imgAnList:[],
                imgInformList:[],
                announceContent:'',
                informContent:'',
                ue:'announceId',
                ue1:'informId',
                addEditAnLoading:false,
                addEditInformLoading:false,
                announceTotal:2,
                informTotal:2,
                dialogAnImageUrl: '',
                dialogAnVisible: false,
                dialogInformImageUrl: '',
                dialogInformVisible: false,
                anCategoryFilters: {
                    addType: ''
                },
                informCateFilters: {
                    addType: ''
                },
                anCategoryList:[],
                informCateList:[],
                anCategoryLoading:false,
                informCateLoading:false,
                anCateSels:[],  //园区公告类别管理列表选中项
                informCateSels:[],  //惠通知类别管理列表选中项
                anCateVisible:false,
                informCateVisible:false,
                anCateForm:{
                    type:''
                },
                informCateForm:{
                    type:''
                },
                anCateLoading:false,
                informCateEditLoading:false,
                anCateTotal:3,
                informCateTotal:3,
                cateDic:{},
                informCateDic:{}



            }
        },
        methods:{
            handleClick(tab, event) {
                this.page=1;
            },
            backToFirstAn(){
                this.firstAnVisible=true;
                this.secondAnVisible=false;
                this.page=1;
            },
            cateAnMg(){// 园区公告 类别管理
                this.firstAnVisible=false;
                this.secondAnVisible=true;
                this.page=1;
            },
            backToFirstInform(){
                this.firInformVisible=true;
                this.secInformVisible=false;
                this.page=1;
            },
            cateInformMg(){// 惠通知 类别管理
                this.firInformVisible=false;
                this.secInformVisible=true;
                this.page=1;
            },
            getAnnounceMg(){   //获取园区公告列表
                let type='公告';
                this.announceLoading=true;
                 this.$get(showDisplay+type)
                    .then((res) => {
                        this.announceList=res;
                        this.announceTotal=this.announceList.length>0?this.announceList.length:1;
                        this.announceLoading=false;
                    })
            },
            getInform(){   //获取惠通知列表
                let type='惠通知';
                this.informLoading=true;
                this.$get(showDisplay+type)
                    .then((res) => {
                        this.informList=res;
                        this.informTotal=this.informList.length>0?this.informList.length:1;
                        this.informLoading=false;
                    })
            },
            announceBatchRemove () { //园区公告批量删除
                var ids = this.anSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.announceLoading = true;
                    //NProgress.start();
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
            informBatchRemove () { //园区公告批量删除
                var ids = this.informSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informLoading = true;
                    let para = { ids: ids };

                }).catch(() => {

                });
            },
            informAdd(){  //惠通知 新增
                this.addEditTitle='新增';
                this.morePicList.length=0;
                this.informContent='';
                this.addEditInformVisible=true;
                this.informForm={
                    title:'',
                    addInfo:{
                        name:'',
                        address:'',
                        phone:''
                    }
                };
            },
            announceAdd(){
                this.addEditTitle='新增';
                this.morePicList.length=0;
                this.announceContent='';
                this.addEditAnVisible=true;
                this.announceForm={
                    title:''
                };
            },
            selsAnChange(sels) {
                this.anSels = sels;
            },
            selsInformChange(sels) {
                this.informSels = sels;
            },
            secAnValue(value){
                let obj = {};
                obj = this.anCategoryList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
            },
            secInformValue(value){
                let obj = {};
                obj = this.informCateList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
            },
            moreAnShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            handleAnRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            handleAnPictureCardPreview(file) {
                this.dialogAnImageUrl = file.url;
                this.dialogAnVisible = true;
            },
            moreInformShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            handleInformRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            informPictureCardPreview(file) {
                this.dialogInformImageUrl = file.url;
                this.dialogInformVisible = true;
            },
            announceAddChange(html){
                this.announceContent=html;
            },
            informAddChange(html){
                this.informContent=html;
            },
            addAnnounceSubmit() {  //园区公告新增
                this.$refs.announceForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addEditAnLoading = true;
                            let para = Object.assign({}, this.addActForm);
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                thumbUrl:this.morePicList[0],
                                title:this.announceForm.title,
                                type:'公告',
                                detailUrl:'null',
                                addInfo:{
                                    subtype:this.selectLabel,
                                    themeContent:this.announceContent
                                }
                            };
                            this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.addEditAnLoading = false;
                                    this.addEditAnVisible = false;
                                    this.getAnnounceMg();
                                })
                        });
                    }
                });
            },
            addInformSubmit() {  //惠通知 新增
                this.$refs.informForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addEditInformLoading = true;
                            let para = Object.assign({}, this.addActForm);
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                thumbUrl:this.morePicList[0],
                                title:this.informForm.title,
                                type:'惠通知',
                                detailUrl:'null',
                                addInfo:{
                                    subtype:this.selectLabel,
                                    themeContent:this.informContent,
                                    location:this.informForm.addInfo.address,
                                    telephone:this.informForm.addInfo.phone,
                                    name:this.informForm.addInfo.name
                                }
                            };
                            this.$post(addDisplay,data)
                                .then((res)=>{
                                    this.addEditInformLoading = false;
                                    this.addEditInformVisible = false;
                                    this.getInform();
                                })
                        });
                    }
                });
            },
            AnEdit(index, row) { //园区公告 显示编辑界面
                this.addEditTitle='编辑';
                this.morePicList.length=0;
                this.addEditAnVisible = true;
                this.announceForm = Object.assign({}, row);
            },
            informEdit(index, row) { //惠通知 显示编辑界面
                this.addEditTitle='编辑';
                this.morePicList.length=0;
                this.addEditInformVisible = true;
                this.informForm = Object.assign({}, row);
            },
            AnDel(index, row) {  //园区公告 删除
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
                            self.getAnnounceMg();
                        });
                }).catch(() => {

                });
            },
            informDel(index, row) {  //惠通知 删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informLoading = true;
                    let para = { id: row.id };
                   let self=this;
                    this.$del(deleteDisplay+para.id)
                        .then(function(response) {
                            self.informLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInform();
                        });
                }).catch(() => {

                });
            },
            highSizeChange(val) {
                this.pagesize=val;
            },
            announceCurChange(val) {
                this.page = val;
                this.getAnnounceMg();
            },
            informCurChange(val) {
                this.page = val;
                this.getInform();
            },
            anCategoryAdd(){ //园区公告类别管理添加
                this.anCategoryLoading=true;
                let data={
                    parkId:localStorage.getItem("parkId"),
                    name:this.anCategoryFilters.addType,
                    code:this.cateDic.code+'.'+this.anCategoryFilters.addType,
                    pid:this.cateDic.id,
                    pname:this.cateDic.name,
                    addInfo:{}
                };
                this.$post(addDict,data)
                    .then((res)=>{
                        this.anCategoryLoading = false;
                        this.getAnCategory();
                    });
                this.anCategoryFilters.addType='';
            },
            informCateAdd(){ //惠通知类别管理添加
                this.informCateLoading=true;
                let data={
                    parkId:localStorage.getItem("parkId"),
                    name:this.informCateFilters.addType,
                    code:this.informCateDic.code+'.'+this.informCateFilters.addType,
                    pid:this.informCateDic.id,
                    pname:this.informCateDic.name,
                    addInfo:{}
                };
                this.$post(addDict,data)
                    .then((res)=>{
                        this.informCateLoading = false;
                        this.getInformCategory();
                    });
                this.informCateFilters.addType='';
            },
            selsAnCategoryChange (sels) {
                this.anCateSels = sels;
            },
            selsInformCateChange (sels) {
                this.informCateSels = sels;
            },
            getAnCateDic(){     //园区公告 类别管理获取Pid
                this.$get(findDic+'公告').then((res)=>{
                    this.cateDic=res[0];
                })
            },
            getAnCategory(){  //园区公告 类别管理列表
                let pname='公告';
                this.anCategoryLoading=true;
                this.$get(showDict+pname)
                    .then((res) => {
                        this.anCategoryList=res;
                        this.anCateTotal=this.anCategoryList.length>0?this.anCategoryList.length:1;
                        this.anCategoryLoading=false;
                    })
            },
            getInformCateDic(){     //惠通知 类别管理获取Pid
                this.$get(findDic+'惠通知').then((res)=>{
                    this.informCateDic=res[0];
                })
            },
            getInformCategory(){  //惠通知 类别管理列表
                let pname='惠通知';
                this.informCateLoading=true;
                this.$get(showDict+pname)
                    .then((res) => {
                        this.informCateList=res;
                        this.informCateTotal=this.informCateList.length>0?this.informCateList.length:1;
                        this.informCateLoading=false;
                    })
            },
            anCategoryBatchRemove(){ // 园区公告 类别管理批量删除

            },
            informCateBatchRemove(){ // 惠通知 类别管理批量删除

            },
            editAnCateSubmit: function () {  //编辑  园区公告类别管理
                this.$refs.anCateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.anCateLoading = true;
                            // NProgress.start();
                            // let para = Object.assign({}, this.addActForm);
                            // let price=this.addActForm.price===0?this.addActForm.price:this.addActForm.priceValue;
                            // let data={
                            //     content:this.$refs.ue.getUEContent(),
                            //     // content:this.addActForm.content,
                            //     title:this.addActForm.title,
                            //     parkId:localStorage.getItem("parkId"),
                            //     socialCircleId:this.circleId,
                            //     userId:localStorage.getItem("userId"),
                            //     addInfo:{
                            //         address:this.addActForm.address,
                            //         startTime:this.addActForm.actTimerValue[0],
                            //         endTime:this.addActForm.actTimerValue[1],
                            //         mems:this.addActForm.mems,
                            //         price:price
                            //     }
                            // };
                            // console.log(data)
                            let url='/api/socialCircle/addSocialCircleActive';
                            // this.$post(url,data)
                            //     .then((res)=>{
                            //         console.log(res)
                            this.anCateLoading = false;
                            this.anCateVisible = false;
                            this.getAnCategory();
                            // })
                        });
                    }
                });
            },
            editInformCateSubmit: function () {  //编辑  惠通知类别管理
                this.$refs.informCateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.informCateEditLoading = true;
                            // NProgress.start();
                            // let para = Object.assign({}, this.addActForm);
                            // let price=this.addActForm.price===0?this.addActForm.price:this.addActForm.priceValue;
                            // let data={
                            //     content:this.$refs.ue.getUEContent(),
                            //     // content:this.addActForm.content,
                            //     title:this.addActForm.title,
                            //     parkId:localStorage.getItem("parkId"),
                            //     socialCircleId:this.circleId,
                            //     userId:localStorage.getItem("userId"),
                            //     addInfo:{
                            //         address:this.addActForm.address,
                            //         startTime:this.addActForm.actTimerValue[0],
                            //         endTime:this.addActForm.actTimerValue[1],
                            //         mems:this.addActForm.mems,
                            //         price:price
                            //     }
                            // };
                            // console.log(data)
                            let url='/api/socialCircle/addSocialCircleActive';
                            // this.$post(url,data)
                            //     .then((res)=>{
                            //         console.log(res)
                            this.informCateEditLoading = false;
                            this.informCateVisible = false;
                            this.getInformCategory();
                            // })
                        });
                    }
                });
            },
            anCateEdit(index, row) { //园区公告类别管理显示编辑界面
                this.anCateVisible = true;
                this.anCateForm = Object.assign({}, row);
            },
            informCateEdit(index, row) { //惠通知类别管理显示编辑界面
                this.informCateVisible = true;
                this.informCateForm = Object.assign({}, row);
            },
            anCateDel(index, row) { // 类别管理列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.anCategoryLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDict+para.id)
                        .then(function(response) {
                            self.anCategoryLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAnCategory();
                        });
                }).catch(() => {

                });
            },
            informCateDel(index, row) { // 惠通知类别管理列表删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.informCateLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(deleteDict+para.id)
                        .then(function(response) {
                            self.informCateLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getInformCategory();
                        });
                }).catch(() => {

                });
            },
            anCateCurrentChange(val) {  //园区公告类别管理分页
                this.page = val;
                this.getAnCategory();
            },
            informCateCurChange(val) {  //惠通知类别管理分页
                this.page = val;
                this.getInformCategory();
            },



        },
        mounted(){
            this.getAnnounceMg(); //园区公告列表
            this.getAnCateDic();
            this.getAnCategory();  //园区公告类别管理列表
            this.getInform(); //惠通知列表
            this.getInformCateDic();
            this.getInformCategory()//惠通知 类别管理列表
        }
    }
</script>

<style scoped>

</style>