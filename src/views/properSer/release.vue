<template>
    <section>
        <el-col :span="24" justify="center">
            <el-form :inline="true" :model="releaseFilters">
                <el-form-item>
                    <div class="block">
                        <!--<p>组件值：{{ timerValue }}</p>-->
                        <el-date-picker v-model="timeValue" type="daterange" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="releaseFilters.searchTitle" placeholder="公司名称或申请人搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getRelease">查询</el-button>
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
                    <el-button type="success" @click="pending">待处理</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="processed">已处理</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="releaseList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="releaseLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="time" label="出行时间" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.contact" label="出行申请人" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.companyName" label="所属公司" sortable show-overflow-tooltip="">
            </el-table-column>
            <el-table-column prop="stage" label="状态" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.allocationName" label="管理人" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.propertyName" label="保安" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
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
        <el-dialog class="inView" title="投诉建议" :visible.sync="viewVisible" width="70%">
            <span class="right">{{detailList.stage}}</span>
            <el-form label-width="90px">
                <el-form-item label="申请时间：">
                    {{detailList.time}}
                </el-form-item>
                <el-form-item label="隶属公司：">
                    {{detailList.addInfo.companyName}}
                </el-form-item>
                <el-form-item label="公司地址：">
                    {{detailList.addInfo.address}}
                </el-form-item>
                <el-form-item label="申请人：">
                    {{detailList.addInfo.contact}}
                </el-form-item>
                <el-form-item label="出行时间：">
                    {{detailList.createTime}}
                </el-form-item>
                <el-form-item label="放行物品：" class="allWid">
                    {{detailList.addInfo.remark}}
                    <!--<div v-if="detailList.addInfo.images && detailList.addInfo.images.length>0">-->
                        <!--<img v-for="item in detailList.addInfo.images.slice(0,6)" :src="item" @click="handlePictureCardPreview(item)">-->
                        <!--<el-dialog :visible.sync="dialogVisible" style="z-index: 2020;">-->
                            <!--<img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="">-->
                        <!--</el-dialog>-->
                    <!--</div>-->
                </el-form-item>
            </el-form>
            <span class="title">公司审核</span>
            <el-form label-width="90px">
                <el-form-item label="审核人：">
                    {{detailList.addInfo.allocationName}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{detailList.addInfo.allocationTime}}
                </el-form-item>
            </el-form>
            <span class="title">管理处审核</span>
            <el-form label-width="90px">
                <el-form-item label="负责人：">
                    {{detailList.addInfo.nickName}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{detailList.addInfo.companyVerifyTime}}
                </el-form-item>
            </el-form>
            <span class="title">保安审核</span>
            <el-form label-width="90px">
                <el-form-item label="负责人：">
                    {{detailList.addInfo.propertyName}}
                </el-form-item>
                <el-form-item label="处理时间：">
                    {{detailList.addInfo.settlementTime}}
                </el-form-item>
            </el-form>
        </el-dialog>

    </section>
</template>

<script>
    import {showDisplay, addDisplay,proList, deleteDisplay, findDic, showDict, addDict, deleteDict} from '../../api/api'

    export default {
       data(){
           return {
               releaseFilters: {
                   searchTitle: ''
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
                       address:'',
                       remark:'',
                       contact:'',
                       allocationName:'',
                       allocationTime:'',
                       propertyName:'',
                       settlementTime:'',
                       companyName:'',
                       nickName:'',
                       companyVerifyTime:'',
                   }
               },


           }
       },
       methods:{
           getRelease(){ //放行申请数据
               let type='放行申请';
               this.releaseLoading=true;
               this.$get(proList+type)
                   .then((res) => {
                       this.releaseList=res;
                       this.releaseTotal=this.releaseList.length>0?this.releaseList.length:1;
                       this.releaseLoading=false;
                   })
           },
           allDeal(){ //全部
               this.getRelease();
           },
           pending(){ //待处理

           },
           processed(){ //已处理

           },
           releaseView(index, row){
               this.viewVisible=true;
               this.detailList=row;
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