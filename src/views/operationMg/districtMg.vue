<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="7">
                <el-col :span="24" justify="center">
                    <el-form :inline="true" :model="districtFilters">
                        <el-form-item>
                            <el-input v-model="districtFilters.keyword" placeholder="输入区域关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getQueryDistrict">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="downloadTemp">下载模板</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="importArea">导入区域</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="exportArea">导出区域</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24">
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

            </el-col>
            <el-col :span="17">
                <el-col :span="24" style="padding-bottom: 0px;">
                   松湖智谷 三期 3号楼 4层 A
                </el-col>
                <el-col :span="24" class="containArea">
                    <span>包含区域数：0</span>
                    <span>包含楼栋数：0</span>
                    <span>包含楼层数：0 </span>
                    <span>包含单元数：1</span>
                </el-col>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="delAreaNodes">删除区域节点</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-form :model="areaForm" label-width="80px" ref="areaForm" :rules="rules" class="areaMg">
                    <el-form-item label="区域级别">
                        5级
                    </el-form-item>
                    <el-form-item label="区域名称" prop="name">
                        <el-input v-model="areaForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="门点">
                        <ul class="doors">
                            <li v-for="(item,index) in areaForm.doorTips">
                                <el-input v-model="item.tip" auto-complete="off"></el-input>
                                <el-select v-model="item.tipValue" placeholder="请选择">
                                    <el-option v-for="item in passagewayList" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-button type="success" plain @click="deleteNode(index)">删除</el-button>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDoors">新增门点</el-button>
                        <el-button @click="saveChanges('areaForm')">保存修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--导入导出路径提示框-->
        <el-dialog :title=pathTitle :visible.sync="pathVisible" width="30%" >
            {{path}}
        </el-dialog>
    </section>
</template>

<script>
    import {showDisplay, addDisplay, deleteDisplay, findDic, showDict, addDict, deleteDict,uploadPic} from '../../api/api'
    import TreeRender from '../../components/tree-render';
    export default {
       data(){
           return {
               districtFilters:{
                   keyword:''
               },
               isLoadingTree: true,//是否加载节点树
               dataTree: [
                   {
                       id:0,
                       isEdit:false,
                       pid:'',
                       remark:'',
                       name:'松湖智谷',
                       children:[
                           {
                               id:1,
                               isEdit:false,
                               pid: 0,
                               remark: '',
                               name: '一期'
                           },
                           {
                               id:2,
                               pid: 0,
                               isEdit:false,
                               name: '二期'
                           },
                           {
                               id:3,
                               pid: 0,
                               isEdit:false,
                               name: '三期',
                               children: [
                                   {
                                       id:301,
                                       pid: 3,
                                       isEdit:false,
                                       name: '3号楼',
                                       children: [
                                           {
                                               id:30101,
                                               pid: 301,
                                               isEdit:false,
                                               name: '3层'
                                           },
                                           {
                                               id:30102,
                                               pid: 301,
                                               isEdit:false,
                                               name: '4层',
                                               children:[
                                                   {id:3010201, pid:30102, idEdit:false, name:'A'},
                                                   {id:3010202, pid:30102, idEdit:false, name:'B'},
                                                   {id:3010203, pid:30102, idEdit:false, name:'C'},
                                                   {id:3010204, pid:30102, idEdit:false, name:'F1'},
                                                   {id:3010205, pid:30102, idEdit:false, name:'F2'}
                                               ]
                                           },
                                           {
                                               id:30103,
                                               pid: 301,
                                               isEdit:false,
                                               name: '5层'
                                           },
                                           {
                                               id:30104,
                                               pid: 301,
                                               isEdit:false,
                                               name: '6层',
                                               children:[
                                                   {id:3010401, pid:30102, idEdit:false, name:'001'},
                                                   {id:3010402, pid:30102, idEdit:false, name:'002'}
                                               ]
                                           },
                                       ]
                                   }
                               ]
                           },
                           {
                               id:4,
                               isEdit:false,
                               pid: 0,
                               remark: '',
                               name: '四期'
                           },
                           {
                               id:5,
                               isEdit:false,
                               pid: 0,
                               remark: '',
                               name: '五期'
                           }
                       ]
                   }
               ],
               defaultProps: {
                   children: 'children',
                   label: 'name'
               },
               defaultExpandKeys: [],//默认展开节点列表
               non_maxexpandId: 100,//api.maxexpandId,//新增节点开始id(不更改)
               maxexpandId: 95,
               areaForm:{
                   name:'',
                   doorTips:[
                       {tip:'大门', tipValue:'出入口'},
                       {tip:'出口门', tipValue:'出口'},
                       {tip:'入口门', tipValue:'入口'}
                   ],
               },
               passagewayList:[
                   {
                       id:'选项1',
                       name:'出入口'
                   },
                   {
                       id:'选项2',
                       name:'入口'
                   },
                   {
                       id:'选项3',
                       name:'出口'
                   }
               ],
               rules:{
                   name: [
                       { required: true, message: '请输入区域名称', trigger: 'blur' }
                   ],
               },
               pathVisible:false,
               pathTitle:'导入区域的路径',
               path:'本地路径',
               deviceNum:0,

           }
       },
        methods:{
            getQueryDistrict(){//条件查询
                // let type='公告';
                // let url=showDisplay+type;
                // let title=this.districtFilters.keyword;
                // url=title===''?url+'':url+'&title='+title;
                // this.getDistrict(url);
                // this.districtFilters={
                //     keyword:''
                // }
            },
            getDistrictList(){//获取列表数据
                // this.getDistrict(districtUrl);
            },
            getDistrict(url){//获取数据

            },
            downloadTemp(){//下载模板

            },
            importArea(){//导入区域
                this.pathVisible=true;
                this.pathTitle='导入区域的路径';
            },
            exportArea(){//导出区域
                this.pathVisible=true;
                this.pathTitle='导出区域的路径';
            },
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
            handleNodeClick(d,n,s){//点击节点
                // console.log(d,n)
                d.isEdit = false;//放弃编辑状态
            },
            addDoors(){//新增门点
                let obj={tip:'',tipValue:''}
                this.areaForm.doorTips.push(obj)
            },
            delAreaNodes(){//删除区域节点
                this.$confirm('区域内包括 '+this.deviceNum+' 家入驻企业！ 删除该门点将清除入驻企业的地址信息?', '提示', {
                    type: 'warning'
                }).then(() => {
                   console.log('相应的动作')
                    this.$message({
                        message: '区域门点删除成功',
                        type: 'success'
                    });
                }).catch(() => {

                });
            },
            deleteNode(index){//删除节点
                this.$confirm('门口已被 '+this.deviceNum+' 个门禁设备绑定！ 删除该门点将解除设备的绑定关系?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.areaForm.doorTips.splice(index,1)
                    this.$message({
                        message: '门点删除成功',
                        type: 'success'
                    });
                }).catch(() => {

                });
            },
            saveChanges(formName){//保存修改
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认修改吗？', '提示', {
                            type:'warning'
                        }).then(() => {
                            console.log(this.areaForm)
                        }).catch(() => {

                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


        },
        mounted(){

        }
    }
</script>

<style lang="scss" scoped>
    .expand-tree .tree-expand .tree-label{
        margin-right: 30px;
        &.tree-new{
            font-weight: normal;
            margin-right: 30px;
        }
    }
    .containArea{
        margin-top: 10px;
        span{
            margin-right: 18px;
        }
    }
    .areaMg{
        .el-input{
            width: 200px;
        }
        .doors{
            li{
                margin-bottom: 15px;
                .el-select{
                    width: 150px;
                    margin: 0 15px;
                }
            }
        }
    }
</style>