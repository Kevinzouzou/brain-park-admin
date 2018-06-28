<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="releaseFilters">
                <el-form-item>
                    <div class="block">
                        <!--<p>组件值：{{ timerValue }}</p>-->
                        <el-date-picker v-model="releaseFilters.timeValue" type="daterange" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="releaseFilters.searchTitle" placeholder="公司名称或申请人搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryRelease">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="danger" @click="allDeal">全部</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="pending">未完结</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="processed">已完结</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="releaseList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="releaseLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="addInfo.outTime" label="出行时间" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.userName" label="出行申请人" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.enterprise" label="所属公司" sortable show-overflow-tooltip="">
            </el-table-column>
            <el-table-column prop="stage" label="状态" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.flows[0].name" label="公司负责人" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.flows[1].name" label="物业管理人" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.flows[2].name" label="保安" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="releaseView(scope.$index, scope.row)">查看</el-button>
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
                           :total="releaseTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--查看界面-->
        <el-dialog class="inView" title="放行详情" :visible.sync="viewVisible" width="70%">
            <span class="right">{{detailList.stage}}</span>
            <el-form label-width="90px">
                <el-form-item label="申请时间：">
                    {{detailList.time}}
                </el-form-item>
                <el-form-item label="隶属公司：">
                    {{detailList.addInfo.enterprise}}
                </el-form-item>
                <!--<el-form-item label="公司地址：">-->
                    <!--{{detailList.addInfo.address}}-->
                <!--</el-form-item>-->
                <el-form-item label="申请人：">
                    {{detailList.addInfo.userName}}
                </el-form-item>
                <el-form-item label="出行时间：">
                    {{detailList.addInfo.outTime}}
                </el-form-item>
                <el-form-item label="放行物品：" class="allWid">
                    {{detailList.addInfo.items}}
                </el-form-item>
            </el-form>
            <span class="title" v-if="dutys.step1===1">公司审核</span>
            <el-form label-width="90px" v-if="dutys.step1===1">
                <el-form-item label="审核人：">
                    {{dutys.name1}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{dutys.handleTime1}}
                </el-form-item>
            </el-form>
            <span class="title" v-if="dutys.step2===2">管理处审核</span>
            <el-form label-width="90px" v-if="dutys.step2===2">
                <el-form-item label="负责人：">
                    {{dutys.name2}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{dutys.handleTime2}}
                </el-form-item>
            </el-form>
            <span class="title" v-if="dutys.step3===3">保安审核</span>
            <el-form label-width="90px" v-if="dutys.step3===3">
                <el-form-item label="负责人：">
                    {{dutys.name3}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{dutys.handleTime3}}
                </el-form-item>
            </el-form>
        </el-dialog>

    </section>
</template>

<script>
    import {showDisplay, addDisplay,proList,throughApply, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
       data(){
           return {
               releaseFilters: {
                   searchTitle: '',
                   timeValue:[]
               },
               page:1,
               pagesize:7,
               timeValue:[],
               releaseList:[
                   {
                       time:'',
                       addInfo:{
                           companyName:'',
                           industry:''
                       }
                   }
               ],
               releaseLoading:false,
               releaseTotal:1,
               viewVisible:false,
               detailList:{
                   stage:'',
                   time:'',
                   createTime:'',
                   settlement:'',
                   addInfo:{
                       enterprise:'',
                       items:'',
                       next:'',
                       outTime:'',
                       phone:'',
                       userName:'',
                       flows:[]
                   }
               },
               dutys:{},


           }
       },
       methods:{
           getQueryRelease(){//放行申请 条件查询
               let type='&type=放行申请';
               let url=throughApply+type;
               let startTime=this.releaseFilters.timeValue[0];
               let endTime=this.releaseFilters.timeValue[1];
               let companyOrUserName=this.releaseFilters.searchTitle;
               url=startTime===undefined?url+'':url+'&startTime='+startTime.replace(/-/g,'/');
               url=endTime===undefined?url+'':url+'&endTime='+endTime.replace(/-/g,'/');
               url=companyOrUserName===''?url+'':url+'&companyOrUserName='+companyOrUserName;
               this.getReleaseList(url);
               this.releaseFilters={
                   timeValue:[],
                   searchTitle:''
               }
           },
           getRelease(){ //放行申请数据
               let type='&type=放行申请';
               this.getReleaseList(throughApply+type);
           },
           getReleaseList(url){//放行申请 列表数据
               this.releaseLoading=true;
               this.$get(url)
                   .then((res) => {
                       this.releaseList=res;
                       this.releaseTotal=this.releaseList.length>0?this.releaseList.length:1;
                       this.releaseLoading=false;
                   })
           },
           allDeal(){ //全部
               this.getRelease();
           },
           pending(){ //未完结
               let url=throughApply+'&type=放行申请'+'&stage=未完结';
               this.getReleaseList(url);
           },
           processed(){ //已完结
               let url=throughApply+'&type=放行申请'+'&stage=已完结';
               this.getReleaseList(url);
           },
           releaseView(index, row){
               this.viewVisible=true;
               this.detailList=row;
               this.detailList.addInfo.flows.forEach((item)=>{
                    if(item.step===1){
                        this.dutys.name1=item.name;
                        this.dutys.step1=item.step;
                        this.dutys.handleTime1=item.handleTime;
                    }else if(item.step===2){
                        this.dutys.name2=item.name;
                        this.dutys.step2=item.step;
                        this.dutys.handleTime2=item.handleTime;
                    }else if(item.step===3){
                        this.dutys.name3=item.name;
                        this.dutys.step3=item.step;
                        this.dutys.handleTime3=item.handleTime;
                    }
               })
           },
           sizeChange(val) {
               this.pagesize=val;
           },
           compCurChange(val) {
               this.page = val;
               this.getRelease();
           },


       },
       mounted(){
           this.getRelease();
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
        .el-form{
            .el-form-item{
                display: inline-block;
                width: 48%;
                &.allWid{
                    width: 100%;
                }
            }
        }
        .title{
            font-weight: bold;
        }
    }
    .allWid{
        img{
            height: 80px;
            margin-right: 15px;
        }
    }
</style>