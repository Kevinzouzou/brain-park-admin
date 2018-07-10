<template>
    <section>
        <el-col :span="24" justify="center" class="topBar">
            <el-form :inline="true" :model="adminFilters">
                <el-form-item>
                    <span>搜索条件：</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="adminFilters.enterName" placeholder="企业名称搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getQueryAdmin">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="newEnterprise">新增企业</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="exportData">导出到表格</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="importIn">导入名单</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="adminList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="adminLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="企业名称" sortable>
            </el-table-column>
            <el-table-column prop="zoneInfo[0].name" label="区域" sortable>
            </el-table-column>
            <el-table-column prop="zoneInfo[1].name" label="楼栋" sortable>
            </el-table-column>
            <el-table-column prop="zoneInfo[2].name" label="楼层" sortable>
            </el-table-column>
            <el-table-column prop="zoneInfo[3].name" label="房号" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.industry" label="所属行业" sortable>
            </el-table-column>
            <el-table-column prop="addInfo.enterTime" label="入驻时间" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" size="small" @click="adminEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="adminDel(scope.$index, scope.row)">删除</el-button>
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
                           :total="adminTotal"
                           :current-page="page"
                           style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增/编辑界面-->
        <el-dialog :title=addEditTitle :visible.sync="adminAEVisible" class="dialog">
            <el-form :model="adminAEForm" label-width="90px" ref="adminAEForm" :rules="rules">
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="adminAEForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属行业" prop="addInfo.industry">
                    <el-select v-model="adminAEForm.addInfo.industry" placeholder="请选择">
                        <el-option v-for="item in indusList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业图片" class="allLength">
                    <el-upload :action=picUrl list-type="picture-card"
                               :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                               :file-list="imgAnList" :on-success="moreShow">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogAnVisible">
                        <img width="100%" :src="dialogAnImageUrl" >
                    </el-dialog>
                </el-form-item>
                <el-form-item label="地址" class="secAddress allLength">
                    <span>松湖智谷园区</span>
                    <el-select v-if="adminAEForm.zoneInfo[0]" v-model="adminAEForm.zoneInfo[0].name" placeholder="选择区域">
                        <el-option v-for="item in level1" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-if="adminAEForm.zoneInfo[1]" v-model="adminAEForm.zoneInfo[1].name" placeholder="选择楼栋">
                        <el-option v-for="item in level2" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-if="adminAEForm.zoneInfo[2]" v-model="adminAEForm.zoneInfo[2].name" placeholder="选择楼层">
                        <el-option v-for="item in level3" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-if="adminAEForm.zoneInfo[3]" v-model="adminAEForm.zoneInfo[3].name" placeholder="选择房号" @change="roomChange">
                        <el-option v-for="item in level4" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业描述" class="allLength">
                    <el-input type="textarea" :rows="3" placeholder="请填写企业描述（200字内）"
                              maxlength="200" v-model="adminAEForm.addInfo.intro">
                    </el-input>
                </el-form-item>
                <el-form-item label="入驻时间" class="allLength" prop="addInfo.enterTime">
                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="adminAEForm.addInfo.enterTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                    <el-button type="success" @click="secDayTime">今日</el-button>
                </el-form-item>
            </el-form>
            <!--<el-form label-width="100px" v-if="isEdit">-->
                <!--<el-form-item label="创建时间">-->
                    <!--{{modifyList.createTime}}-->
                <!--</el-form-item>-->
                <!--<el-form-item label="创建人">-->
                    <!--{{modifyList.createName}}-->
                <!--</el-form-item>-->
                <!--<el-form-item label="最后修改时间">-->
                    <!--{{modifyList.lastTime}}-->
                <!--</el-form-item>-->
                <!--<el-form-item label="修改人">-->
                    <!--{{modifyList.modifyName}}-->
                <!--</el-form-item>-->
            <!--</el-form>-->

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="adminAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addAdminSubmit" :loading="admAELoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import UE from '../../components/ue'
    import {enterpriseUrl,addUpEnterUrl,delEnterUrl,treeUrl, addDisplay, deleteDisplay,uploadPic, } from '../../api/api'

    export default {
        components: {UE},
        data(){
            return {
                treeList:[],
                level1:[],
                level2:[],
                level3:[],
                level4:[],
                industry:'',
                secAreaValue:'',
                secBuildValue:'',
                secFloorValue:'',
                secRoomValue:'',
                selectLabel:'',
                areaLabel:'',
                buildLabel:'',
                floorLabel:'',
                roomLabel:'',
                zoneId:'',
                indusList:[
                    {
                        id:1,
                        name:'计算机/互联网/通讯/电子'
                    },
                    {
                        id:2,
                        name:'广告/媒体'
                    },
                    {
                        id:3,
                        name:'服务业'
                    },
                    {
                        id:4,
                        name:'会计/金融/银行/保险'
                    },
                    {
                        id:5,
                        name:'贸易/消费/制造/运营'
                    },
                    {
                        id:6,
                        name:'制药/医疗'
                    },
                    {
                        id:7,
                        name:'房地产/建筑'
                    },
                    {
                        id:8,
                        name:'专业服务/教育/培训'
                    },
                    {
                        id:9,
                        name:'物流/运输'
                    },
                    {
                        id:10,
                        name:'能源/原材料'
                    },
                    {
                        id:11,
                        name:'政府/非营利组织/其他'
                    },
                ],
                areaList:[
                    {
                        id:1,
                        name:'东一区'
                    },
                    {
                        id:2,
                        name:'东二区'
                    },
                    {
                        id:3,
                        name:'东三区'
                    }
                ],
                buildList:[
                    {
                        id:1,
                        name:'A栋'
                    },
                    {
                        id:2,
                        name:'B栋'
                    },
                    {
                        id:3,
                        name:'C栋'
                    }
                ],
                floorList:[
                    {
                        id:1,
                        name:'1层'
                    },
                    {
                        id:2,
                        name:'2层'
                    },
                    {
                        id:3,
                        name:'3层'
                    }
                ],
                roomList:[
                    {
                        id:1,
                        name:'1001'
                    },
                    {
                        id:2,
                        name:'1002'
                    },
                    {
                        id:3,
                        name:'1003'
                    }
                ],
                picUrl:'',
                imgAnList:[],
                dialogAnImageUrl: '',
                dialogAnVisible: false,
                page:1,
                pagesize:7,
                adminFilters: {
                    enterName: ''
                },
                addEditTitle:'新增',
                isEdit:false,
                isEditId:'',
                adminAEVisible:false,
                adminAEForm:{
                    name:'',
                    addInfo:{
                        industry:'',
                        logo:'',
                        intro:'',
                        enterTime:'',
                    },
                    zoneInfo:[
                        {name:''},
                        {name:''},
                        {name:''},
                        {name:''}
                    ]
                },
                adminList:[
                    {
                        name:'深圳微品致远信息科技有限公司',
                        industry:'计算机/互联网/通讯/电子',
                        inTime:'2018-06-22',
                        textarea:'公司总部在深圳南山科技园',
                        addInfo:{
                            area:'东一区',
                            building:'A1',
                            floor:'4',
                            room:'F2',
                        }
                    },
                    {
                        name:'中信集团',
                        industry:'银行/证券',
                        inTime:'2018-06-12',
                        textarea:'公司总部在深圳南山科技园',
                        addInfo:{
                            area:'东二区',
                            building:'C1',
                            floor:'6',
                            room:'C3',
                        }
                    },
                ],
                adminLoading:false,
                admAELoading:false,
                adminTotal:1,
                ue:'announceId',
                announceContent:'',
                rules: {
                    name: [
                        { required: true, message: '请填写企业名称', trigger: 'blur' }
                    ],
                    addInfo:{industry: [
                        { required: true, message: '请选择所属行业', trigger: 'change' }
                    ],
                   enterTime: [
                        { type: 'string', required: true, message: '请选择入驻时间', trigger: 'change' }
                    ]}
                },
                modifyList:{
                    createTime:'2018-06-02 17:30:30',
                    createName:'平台管理员123',
                    lastTime:'2018-06-20 19:10:15',
                    modifyName:'李小四'
                },
                morePicList:[],

            }
        },
        methods:{
            secDayTime(){//时间为当前时间
                let now=new Date();
                let year=now.getFullYear();
                year += (year < 2000) ? 1900 : 0; //
                let month=now.getMonth()+1;
                month=month<10?'0'+month:''+month;
                let day = now.getDate() <10 ? '0' + now.getDate() : '' + now.getDate(); //
                this.admAELoading=true;
                this.adminAEForm.addInfo.enterTime=year+'-'+month+'-'+day;
                this.admAELoading = false;
            },
            handlePictureCardPreview(file) {
                this.dialogAnImageUrl = file.url;
                this.dialogAnVisible = true;
            },
            handleRemove(file, fileLists) {
                console.log(file, fileLists);
            },
            moreShow(res,file,fileList){
                this.morePicList.push(res.responseList)
            },
            secIndustry(value){
                let obj = {};
                obj = this.indusList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.selectLabel=obj.name;
            },
            roomChange(value){
                let obj = {};
                obj = this.level4.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.roomLabel=obj.name;
                this.zoneId=obj.id;
            },
            exportData(){//导出到表格

            },
            importIn(){//导入名单

            },
            newEnterprise(){  //显示新增界面
                this.addEditTitle='新增';
                this.isEdit=false;
                this.adminAEVisible=true;
                this.adminAEForm={
                    name:'',
                    addInfo:{
                        industry:'',
                        enterTime:'',
                        logo:'',
                        intro:'',
                    },
                    zoneInfo:[
                        {name:''},
                        {name:''},
                        {name:''},
                        {name:''}
                    ]
                };
            },
            getQueryAdmin(){ // 企业管理模糊查询
                let url=enterpriseUrl;
                let name=this.adminFilters.enterName;
                url=name===''?url+'':url+'&name='+name;
                this.getAnData(url);
                this.adminFilters={
                    enterName:''
                }
            },
            getTree(){
                let type='&type=区域';
                this.$get(treeUrl+type)
                    .then((res) => {
                        this.treeList=res;
                        // let obj={};
                        this.treeList.forEach((item)=>{
                            if(item.level===1){
                                let obj={
                                    level:item.level,
                                    name:item.name,
                                    id:item.id
                                };
                                this.level1.push(obj);
                            }
                            if(item.children.length>0){
                                item.children.forEach((item2)=>{
                                    if(item2.level===2) {
                                        let obj = {
                                            level: item2.level,
                                            name: item2.name,
                                            id: item2.id
                                        };
                                        this.level2.push(obj);
                                    }
                                    if(item2.children.length>0){
                                        item2.children.forEach((item3)=>{
                                            if(item3.level===3) {
                                                let obj = {
                                                    level: item3.level,
                                                    name: item3.name,
                                                    id: item3.id
                                                };
                                                this.level3.push(obj);
                                            }
                                            if(item3.children.length>0){
                                                item3.children.forEach((item4)=>{
                                                    if(item4.level===4) {
                                                        let obj = {
                                                            level: item4.level,
                                                            name: item4.name,
                                                            id: item4.id
                                                        };
                                                        this.level4.push(obj);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    })
            },
            getAdminList(){    //企业管理列表
                this.getAnData(enterpriseUrl);
            },
            getAnData(url){
                this.adminLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.adminList=res;
                        this.adminTotal=this.adminList.length>0?this.adminList.length:1;
                        this.adminLoading=false;
                    })
            },
            adminDel(index, row) {   //删除
                this.$confirm('删除企业将同时取消改企业下属用户的关联企业属性，是否删除?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.adminLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    this.$del(delEnterUrl+para.id)
                        .then(function(response) {
                            self.adminLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getAdminList();
                        });
                }).catch(() => {

                });
            },
            adminEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑';
                this.isEditId=row.id;
                this.isEdit=true;
                this.adminAEVisible = true;
                this.adminAEForm = Object.assign({}, row);
                this.roomLabel=row.zoneInfo[3].name;
                this.zoneId=row.zoneInfo[3].id;
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
                this.getAdminList();
            },
            addAdminSubmit: function () {  //新增
                this.$refs.adminAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.admAELoading = true;
                           let address='松湖智谷园区'+this.adminAEForm.zoneInfo[0].name+this.adminAEForm.zoneInfo[1].name+
                                this.adminAEForm.zoneInfo[2].name+this.roomLabel;
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                address:address,
                                name:this.adminAEForm.name,
                                addInfo:{
                                    zoneId:this.zoneId,
                                    industry:this.adminAEForm.addInfo.industry,
                                    logo:this.morePicList[0],
                                    enterTime:this.adminAEForm.addInfo.enterTime,
                                    intro:this.adminAEForm.addInfo.intro
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            this.$post(addUpEnterUrl,data)
                                .then((res)=>{
                                    this.admAELoading = false;
                                    this.adminAEVisible = false;
                                    this.getAdminList();
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
            this.getAdminList();   //企业管理
            this.picUrl=localStorage.getItem("upUrl")+uploadPic;
            this.getTree(); //获取区域信息
        }
    }
</script>

<style lang="scss">
    .topBar{
        padding: 0 10px;
        margin: 10px 0 0;
    }
    .dialog{
        .el-form{
            .el-form-item{
                display: inline-block;
                width: 48%;
                &.allLength{
                    width: 100%;
                }
            }
        }
    }
    .secAddress{
        .el-select{
            display: inline-block;
            width: 145px;
            margin-right: 10px;
        }
    }
</style>
