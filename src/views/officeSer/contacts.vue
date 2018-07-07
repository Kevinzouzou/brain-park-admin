<template>
    <section>
        <el-col :span="24" justify="center">

        </el-col>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-button @click="memAdd" class="right">+ 新增</el-button>
                <span class="organizMg">组织架构管理</span>
                <el-tree
                        class="expand-tree"
                        v-if="isLoadingTree"
                        :data="dataTree"
                        node-key="id"
                        ref="tree"
                        :props="defaultProps"
                        highlight-current
                        default-expand-all
                        :render-content="renderContent"
                        :expand-on-click-node="false"
                        :default-expanded-keys="defaultExpandKeys"
                        @node-click="handleNodeClick">
                </el-tree>
            </el-col>
            <el-col :span="18">
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
        <!--组织架构-新增-->
        <el-dialog :title=addEditTitle :visible.sync="organizationVisible">
            <el-form :model="organizationForm" label-width="80px" ref="organizationForm">
                <el-form-item label="部门名称" prop="addInfo.department">
                    <el-input v-model="organizationForm.addInfo.departmentLevel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门层级" prop="addInfo.department">
                    <el-select v-model="organizationForm.addInfo.department" placeholder="请选择" @change="secDepartValue">
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="organizationVisible = false">取消</el-button>
                <el-button type="primary" @click.native="organizationAdd" :loading="organizLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script type="text/ecmascript-6">
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,userTarget} from '../../api/api'
    import TreeRender from '../../components/tree-render';
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
                organizationVisible:false,
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
                organizationForm:{
                    addInfo:{
                        department:'',
                        departmentLevel:''
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
                organizLoading:false,
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
                dataTree: [
                    {
                        id:1,
                        isEdit:false,
                        pid: '',
                        remark: '',
                        name: '总经办',
                        children: [
                            {
                                id:101,
                                pid: 1,
                                isEdit:false,
                                name: '周董',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        id:2,
                        pid: '',
                        isEdit:false,
                        name: '策划部',
                        children: [
                            {
                                id:201,
                                pid: 2,
                                isEdit:false,
                                name: '李总',
                                // children: [{
                                //     label: '三级 1-1-1'
                                // }]
                            }
                        ]
                    },
                    {
                        id:3,
                        pid: '',
                        isEdit:false,
                        name: '运营部',
                        children: [
                            {
                                id:301,
                                pid: 3,
                                isEdit:false,
                                name: '企业服务部',
                                children: [{
                                    id:30101,
                                    pid: 3,
                                    isEdit:false,
                                    name: '李潇潇'
                                }]
                            },
                            {
                                id:302,
                                pid: 3,
                                isEdit:false,
                                name: '保安服务部',
                                children: [
                                    {id:30201, pid: 3,isEdit:false, name: '李国'},
                                    {id:30202, pid: 3,isEdit:false, name: '李明'},
                                    {id:30203, pid: 3,isEdit:false, name: '李靖'},
                                    {id:30204, pid: 3,isEdit:false, name: '周杰'},
                                    {id:30205, pid: 3,isEdit:false, name: '周黑鸭'}
                                ]
                            }
                        ]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                    // label: 'label'
                },
                isLoadingTree: true,//是否加载节点树
                defaultExpandKeys: [],//默认展开节点列表
                non_maxexpandId: 100,//api.maxexpandId,//新增节点开始id(不更改)
                maxexpandId: 95,

            }
        },
        methods:{
            initExpand(){
                this.dataTree.map((a) => {
                    this.defaultExpandKeys.push(a.id)
                });
                this.isLoadingTree = true;
            },
            renderContent(h,{node,data,store}){//加载节点
                let that = this;
                return h(TreeRender,{
                    props: {
                        DATA: data,
                        NODE: node,
                        STORE: store,
                        maxexpandId: that.non_maxexpandId
                    },
                    on: {
                        nodeAdd: ((s,d,n) => that.handleAdd(s,d,n)),
                        nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
                        nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
                    }
                });
            },
            handleAddTop(){
                this.dataTree.push({
                    id: ++this.maxexpandId,
                    name: '新增节点',
                    pid: '',
                    isEdit: false,
                    children: []
                })
            },
            handleAdd(s,d,n){//增加节点
                console.log(s,d,n)
                if(n.level >=6){
                    this.$message.error("最多只支持五级！")
                    return false;
                }
                //添加数据
                d.children.push({
                    id: ++this.maxexpandId,
                    name: '新增节点',
                    pid: d.id,
                    isEdit: false,
                    children: []
                });
                //展开节点
                if(!n.expanded){
                    n.expanded = true;
                }
            },
            handleEdit(s,d,n){//编辑节点
                console.log(s,d,n)
            },
            handleDelete(s,d,n){//删除节点
                console.log(s,d,n)
                let that = this;
                //有子级不删除
                if(d.children && d.children.length !== 0){
                    this.$message.error("此节点有子级，不可删除！")
                    return false;
                }else{
                    //新增节点直接删除，否则要询问是否删除
                    let delNode = () => {
                        let list = n.parent.data.children || n.parent.data,//节点同级数据
                            _index = 99999;//要删除的index
                        /*if(!n.parent.data.children){//删除顶级节点，无children
                          list = n.parent.data
                        }*/
                        list.map((c,i) => {
                            if(d.id == c.id){
                                _index = i;
                            }
                        })
                        let k = list.splice(_index,1);
                        //console.log(_index,k)
                        this.$message.success("删除成功！")
                    }
                    let isDel = () => {
                        that.$confirm("是否删除此节点？","提示",{
                            confirmButtonText: "确认",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            delNode()
                        }).catch(() => {
                            return false;
                        })
                    }
                    //判断是否新增
                    d.id > this.non_maxexpandId ? delNode() : isDel()

                }
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate);
            },
            handleNodeClick(d,n,s){//点击节点
                // console.log(d,n)
                d.isEdit = false;//放弃编辑状态
            },
            memAdd(){//组织架构 显示新增成员
                this.addEditTitle='组织框架 - 新增';
                this.organizationVisible=true;
                this.organizationForm={
                    addInfo:{
                        department:'',
                        departmentLevel:''

                    }
                };
            },
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
            getcontactList(){    //通讯录列表
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
            organizationAdd(){//组织框架 新增
                this.$refs.organizationForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.organizLoading = true;
                            let data={
                                parkId:localStorage.getItem("parkId"),
                                addInfo:{
                                    department:this.organizationForm.addInfo.department,
                                    departmentlevel:this.organizationForm.addInfo.departmentlevel
                                }
                            };
                            // this.$post(addDisplay,data)
                            //     .then((res)=>{
                            this.organizLoading = false;
                            this.organizationVisible = false;
                            this.getcontactList();
                            // })
                        });
                    }
                });
            },

        },
        mounted(){
            // this.getcontactList();   //通讯录
            this.initExpand()
        }
    }
</script>

<style lang="scss">
    .right{
        float: right;
        &:after{
            display: inline-block;
            content: '';
            clear: both;
        }
    }
    .organizMg{
        display: inline-block;
        font-size: 18px;
        margin: 10px 5px 15px;
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
    .expand-tree .tree-expand .tree-label{
        margin-right: 30px;
        &.tree-new{
            font-weight: normal;
            margin-right: 30px;
        }
    }
</style>
