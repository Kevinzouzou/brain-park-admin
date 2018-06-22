<template>
    <section>
        <el-col :span="24" justify="center">

        </el-col>
        <el-row :gutter="20">
            <el-col :span="7">
                fafad
            </el-col>
            <el-col :span="17">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="addMembers">添加成员</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="transMembers">转移成员</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="membersRemove" :disabled="this.sels.length===0">删除成员</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!--列表-->
                <el-table :data="contactList.slice((page-1)*pagesize,page*pagesize)" highlight-current-row v-loading="contactLoading" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column prop="addInfo.nickName" label="姓名" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.position" label="职务" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.department" label="部门" sortable>
                    </el-table-column>
                    <el-table-column prop="phone" label="手机" sortable>
                    </el-table-column>
                    <el-table-column prop="addInfo.email" label="邮箱" sortable>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="info" size="small" @click="memberEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="memberDel(scope.$index, scope.row)">删除</el-button>
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
                                   :total="memberTotal"
                                   :current-page="page"
                                   style="float:right;">
                    </el-pagination>
                </el-col>
            </el-col>
        </el-row>

        <!--新增/编辑界面-->
        <el-dialog class="inView" :title=addEditTitle :visible.sync="memberAEVisible">
            <el-form :model="memberAEForm" label-width="80px" ref="memberAEForm">
                <el-form-item label="姓名" prop="addInfo.nickName">
                    <el-input v-model="memberAEForm.addInfo.nickName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="隶属部门" prop="addInfo.department">
                    <!--<el-input v-model="memberAEForm.addInfo.department" auto-complete="off"></el-input>-->
                    <el-select v-model="memberAEForm.addInfo.department" placeholder="请选择" @change="secDepartValue">
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门职务" prop="addInfo.position">
                    <el-input v-model="memberAEForm.addInfo.position" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="memberAEForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="工作邮箱" prop="addInfo.email">
                    <el-input v-model="memberAEForm.addInfo.email" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="memberAEVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addMemberSubmit" :loading="memAELoading">提交</el-button>
            </div>
        </el-dialog>
        <!--转移成员界面-->
        <el-dialog :title=addEditTitle :visible.sync="memberTransVisible">
            <el-form :model="memberTransForm" label-width="80px" ref="memberTransForm">
                <el-form-item label="转入部门" prop="addInfo.department">
                    <el-select v-model="memberTransForm.addInfo.department" placeholder="请选择" @change="secDepartValue">
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="memberTransVisible = false">取消</el-button>
                <el-button type="primary" @click.native="transMember" :loading="memTransLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'

    export default {
        data(){
            return {
                page:1,
                pagesize:7,
                timememberValue:[],
                addEditTitle:'新增成员',
                isEdit:false,
                isEditId:'',
                memberAEVisible:false,
                memberTransVisible:false,
                memberAEForm:{
                    phone:'',
                    addInfo:{
                        nickName:'',
                        department:'',
                        position:'',
                        email:''
                    }
                },
                memberTransForm:{
                    addInfo:{
                        department:''
                    }
                },
                contactList:[
                    {
                        phone:'13512345678',
                        addInfo:{
                            nickName:'张老三',
                            position:'项目经理',
                            department:'研发部',
                            email:'123@163.com'
                        }
                    }
                ],
                sels:[],   //列表选中项
                contactLoading:false,
                memAELoading:false,
                memTransLoading:false,
                memberTotal:1,
                departList:[
                    {
                        id:'选项1',
                        name:'总经办'
                    },
                    {
                        id:'选项2',
                        name:'研发部'
                    },
                    {
                        id:'选项3',
                        name:'市场部'
                    }
                ],
                departSecLabel:'',

            }
        },
        methods:{
            secDepartValue(value){
                let obj = {};
                obj = this.departList.find((item)=>{//遍历的数据源
                    return item.id === value;//筛选出匹配数据
                });
                this.departSecLabel=obj.name;
            },
            membersRemove(){  // 批量删除

            },
            transMembers(){//显示转移成员界面
                this.addEditTitle='转移成员';
                this.memberTransVisible=true;
                this.memberTransForm={
                    addInfo:{
                        department:''
                    }
                };
            },
            addMembers(){  //显示新增界面
                this.addEditTitle='新增成员';
                this.isEdit=false;
                this.memberAEVisible=true;
                this.memberAEForm={
                    phone:'',
                    addInfo:{
                        nickName:'',
                        department:'',
                        position:'',
                        email:''
                    }
                };
            },
            getcontactList(){    //物业公告列表
                let type='物业公告';
                // this.getAnData(showDisplay+type);
            },
            getAnData(url){
                this.contactLoading=true;
                this.$get(url)
                    .then((res) => {
                        this.contactList=res;
                        this.memberTotal=this.contactList.length>0?this.contactList.length:1;
                        this.contactLoading=false;
                    })
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            memberDel(index, row) {   //删除
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.contactLoading = true;
                    let para = { id: row.id };
                    let self=this;
                    // this.$del(deleteDisplay+para.id)
                    //     .then(function(response) {
                            self.contactLoading = false;
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getcontactList();
                        // });
                }).catch(() => {

                });
            },
            memberEdit(index, row) {//显示编辑界面
                this.addEditTitle='编辑成员';
                this.isEditId=row.id;
                this.isEdit=true;
                this.memberAEVisible = true;
                this.memberAEForm = Object.assign({}, row);
            },
            sizeChange(val) {
                this.pagesize=val;
            },
            currentChange(val) {  //分页
                this.page = val;
                this.getcontactList();
            },
            addMemberSubmit: function () {  //新增
                this.$refs.memberAEForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.memAELoading = true;
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                phone:this.memberAEForm.phone,
                                addInfo:{
                                    nickName:this.memberAEForm.addInfo.nickName,
                                    department:this.memberAEForm.addInfo.department,
                                    position:this.memberAEForm.addInfo.position,
                                    email:this.memberAEForm.addInfo.email
                                }
                            };
                            if(this.isEdit){
                                data.id=this.isEditId;
                            }
                            // this.$post(addDisplay,data)
                            //     .then((res)=>{
                                    this.memAELoading = false;
                                    this.memberAEVisible = false;
                                    this.getcontactList();
                                // })
                        });
                    }
                });
            },
            transMember(){//转移成员
                this.$refs.memberTransForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.memAELoading = true;
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                addInfo:{
                                    department:this.memberTransForm.addInfo.department
                                }
                            };
                            // this.$post(addDisplay,data)
                            //     .then((res)=>{
                            this.memTransLoading = false;
                            this.memberTransVisible = false;
                            this.getcontactList();
                            // })
                        });
                    }
                });
            },

        },
        mounted(){
            // this.getcontactList();   //物业公告
        }
    }
</script>

<style lang="scss">
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
</style>
