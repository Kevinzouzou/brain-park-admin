<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true">
                <el-form-item>
                    反馈来源筛选：
                    <el-select v-model="secFebackValue" placeholder="请选择" @change="secQueryFeBackValue">
                        <el-option v-for="item in feBackList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <!--<div class="pullRight">-->
                        <!--用户端APP：{{userAppNum}}-->
                        <!--物业端APP：{{proAppNum}}-->
                    <!--</div>-->
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="feedBackList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="feBackLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="time" label="时间" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.remark" label="反馈内容" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="addInfo.source" label="来源" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="反馈人" sortable>
            </el-table-column>
            <el-table-column prop="stage" label="状态" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="feBackView(scope.$index, scope.row)">查看</el-button>
                    <el-button type="info" size="small" @click="feBackEdit(scope.$index, scope.row)" v-if="scope.row.stage!=='已处理'">回复</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination background
                           @size-change="highSizeChange"
                           @current-change="feBackCurChange"
                           :page-sizes="[7,8,10,20]"
                           :page-size="pagesize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="feBackTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--回复界面-->
        <el-dialog :title=addEditTitle :visible.sync="feBackReportVisible" width="40%">
            <el-form :model="feBackForm" ref="feBackForm">
               <el-form-item prop="disc">
                   <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="feBackForm.disc">
                   </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="feBackReportVisible = false">取消</el-button>
                <el-button type="primary" @click.native="feBackReport" :loading="feBackReportLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--查看界面-->
        <el-dialog title="反馈详情" :visible.sync="feBackViewVisible">
            <el-form label-width="90px">
                <el-form-item label="反馈时间：">
                   {{detailList.time || ' - '}}
                </el-form-item>
                <el-form-item label="反馈内容：">
                    <div class="content">{{detailList.addInfo.remark || ' - '}}</div>
                    <div class="imgs" v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">
                        <img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">
                        <el-dialog :visible.sync="dialogVisible" style="z-index: 2020;" :append-to-body="true">
                            <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </el-form-item>
                <el-form-item label="反馈人：">
                    {{detailList.userName || ' - '}}
                </el-form-item>
                <el-form-item label="回复备注："  v-if="detailList.stage==='已处理'">
                    {{detailList.addInfo.reply || ' - '}}
                </el-form-item>
            </el-form>
        </el-dialog>


    </section>
</template>

<script>
    import {findSuggest,showDisplay,replyUrl, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
        data(){
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                userAppNum:0, //用户端APP数
                proAppNum:0,  //物业端APP数
                secFebackValue:'',
                feBackList:[
                    {
                        id:'001',
                        name:'全部来源'
                    },
                    {
                        id:'002',
                        name:'物业端APP'
                    },
                    {
                        id:'003',
                        name:'用户端APP'
                    }
                ],
                page:1,
                pagesize:7,
                feedBackList:[],
                feBackTotal:1,
                feBackLoading:false,
                adsSels:[],//选中项
                addEditTitle:'回复',
                morePicList:[],
                feBackReportVisible:false,
                feBackReportLoading:false,
                feBackForm:{
                    disc:''
                },
                imgAdsList:[],
                dialogAdsImageUrl: '',
                dialogAdsVisible: false,
                selectLabel:'',
                detailList:{
                    addInfo:{
                        remark:'',
                        images:[],
                        commentText:''
                    }
                },
                feBackViewVisible:false,
                replyId:'',

            }
        },
        methods:{
            handlePictureCardPreview(item) {
                this.dialogImageUrl = item;
                this.dialogVisible = true;
            },
            getFeedBack(){   //获取意见反馈列表
                let type='&type=意见反馈';
                this.getFeedBackList(findSuggest+type);
            },
            getFeedBackList(url){
                this.feBackLoading=true;
                this.$get(url)
                    .then((res) => {
                        if(res.length>0){
                            this.feedBackList=res;
                            this.feBackTotal=this.feedBackList.length>0?this.feedBackList.length:1;
                            this.feBackLoading=false;
                        }
                    })
            },
            adsBatchRemove () { //批量删除
                var ids = this.adsSels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.feBackLoading = true;
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
            feBackEdit(index, row) { // 显示回复界面
                this.addEditTitle='回复';
                this.feBackReportVisible = true;
                this.feBackForm = Object.assign({}, row);
                this.replyId=row.id;
            },
            feBackView(index, row) {  //查看
                this.feBackViewVisible=true;
                this.detailList=row;
            },
            highSizeChange(val) {
                this.pagesize=val;
            },
            feBackCurChange(val) {
                this.page = val;
                this.getFeedBack();
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
            secQueryFeBackValue(value){
                let obj = {};
                obj = this.feBackList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
                let type='&type=意见反馈';
                let url=findSuggest+type;
                url=this.selectLabel==='全部来源'?url+'':url+'&source='+this.selectLabel;
                this.getFeedBackList(url);
            },
            secAdsValue(value){
                let obj = {};
                obj = this.feBackList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
            },
            feBackReport() {  //新增
                this.$refs.feBackForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.feBackReportLoading = true;
                            let para = Object.assign({}, this.feBackForm);
                            let data={
                                id:this.replyId,
                                reply:this.feBackForm.disc
                            };
                            let url=replyUrl+'&id='+this.replyId+'&reply='+this.feBackForm.disc;
                            this.$get(url)
                                .then((res)=>{
                                    this.feBackReportLoading = false;
                                    this.feBackReportVisible = false;
                                    this.getFeedBack();
                                })
                        });
                    }
                });
            },

        },
        mounted(){
            this.getFeedBack();
        }
    }
</script>

<style lang="scss" scoped>
    .pullRight{
        float: right;
    }
    .imgs{
        margin: 10px auto;
        img{
            height: 120px;
            margin: 10px 15px;
        }
    }
</style>