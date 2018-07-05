<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="7">
                <el-col :span="24" justify="center" class="topBar">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input v-model="keyword" placeholder="输入区域关键字进行过滤"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24" style="padding-bottom: 0px;" class="toolbar">
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
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick">
                    </el-tree>
                </el-col>

            </el-col>
            <el-col :span="17">
                <el-col :span="24" style="padding-bottom: 0px;margin: 10px 0 5px;">
                   松湖智谷 {{area}} {{build}} {{floor}} {{room}}
                </el-col>
                <el-col :span="24" class="containArea" style="margin-bottom: 7px;">
                    <span>包含区域数：{{areanum}}</span>
                    <span>包含楼栋数：{{buildnum}}</span>
                    <span>包含楼层数：{{floornum}} </span>
                    <span>包含单元数：{{roomnum}}</span>
                </el-col>
                <!--工具条-->
                <el-col :span="24" v-show="showZone" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="danger" @click="delAreaNodes">删除区域节点</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-form v-show="showZone" :model="zoneDatas" label-width="90px" ref="zoneDatas" :rules="rules" class="areaMg">
                    <el-form-item label="区域级别">
                        {{zoneDatas.level}} 级
                    </el-form-item>
                    <el-form-item label="区域名称" prop="name">
                        <el-input v-model="zoneDatas.name" auto-complete="off" placeholder="输入区域名称"></el-input>
                    </el-form-item>
                    <el-form-item label="门点">
                        <ul class="doors" v-if="zoneDatas.addInfo.doors">
                            <li v-for="(item,index) in zoneDatas.addInfo.doors">
                                <el-input v-model="item.name" auto-complete="off" placeholder="输入门点"></el-input>
                                <el-select v-model="item.type" placeholder="请选择">
                                    <el-option v-for="item in passagewayList" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-button type="success" plain @click="deleteNode(index)">删除</el-button>
                            </li>
                        </ul>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addDoors">新增门点</el-button>
                        <el-button @click="saveChanges('zoneDatas')">保存修改</el-button>
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
    import {treeUrl, upParkTreeUrl, delParkTreeUrl, } from '../../api/api'
    import TreeRender from '../../components/tree-render';
    export default {
       data(){
           return {
               keyword:'',
               isLoadingTree: true,//是否加载节点树
               dataTree: [],
               defaultProps: {
                   children: 'children',
                   label: 'name'
               },
               defaultExpandKeys: [],//默认展开节点列表
               non_maxexpandId: 100,//api.maxexpandId,//新增节点开始id(不更改)
               maxexpandId: 95,
               zoneDatas:{
                   name:'',
                   level:0,
                   addInfo:{
                       doors:[],
                   }
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
               zoneNodes:{},
               areanum:0,
               buildnum:0,
               floornum:0,
               roomnum:0,
               area:'未选中区域',
               build:'',
               floor:'',
               room:'',
               showZone:false,

           }
       },
        watch: {
            keyword(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods:{
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getTree(){//组织架构信息
                let type='&type=区域';
                this.$get(treeUrl+type).then((res)=>{
                    this.dataTree=res;
                })
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
                    // isEdit: false,
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
                    // isEdit: false,
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
                this.zoneDatas=d;
                this.zoneNodes=n;
                console.log(d,n)
                // d.isEdit = false;//放弃编辑状态
                this.showZone=true;
                if(this.zoneDatas.level===4){
                    this.areanum=0;this.buildnum=0;this.floornum=0;this.roomnum=1;
                }else if(this.zoneDatas.level===3){
                    this.areanum=0;this.buildnum=0;this.floornum=1;
                    this.roomnum=this.zoneDatas.children && this.zoneDatas.children.length>0?this.zoneDatas.children.length:0;
                }else if(this.zoneDatas.level===2){
                    this.areanum=0;this.buildnum=1;
                    if(this.zoneDatas.children && this.zoneDatas.children.length>0){
                       let num=0;
                       this.zoneDatas.children.forEach((item)=>{
                           num=item.children && item.children.length>0?item.children.length+num:num;
                       });
                       this.floornum=this.zoneDatas.children.length;
                       this.roomnum=num;
                    }else{
                        this.floornum=0;this.roomnum=0;
                    }
                }else if(this.zoneDatas.level===1){
                    this.areanum=1;
                    if(this.zoneDatas.children && this.zoneDatas.children.length>0){
                        let num=0;let num2=0;
                        this.zoneDatas.children.forEach((item)=>{
                            num=item.children && item.children.length>0?item.children.length+num:num;
                            if(item.children && item.children.length>0){
                                item.children.forEach((item2)=>{
                                    num2=item2.children && item2.children.length>0?item2.children.length+num2:num2;
                                })
                            }
                        });
                        this.buildnum=this.zoneDatas.children.length;
                        this.floornum=num;this.roomnum=num2;
                    }else{
                        this.buildnum=0;this.floornum=0;this.roomnum=0;
                    }
                }
                if(this.zoneNodes.level===1){
                    this.area=this.zoneNodes.label;this.build='';this.floor='';this.room='';
                }else if(this.zoneNodes.level===2){
                    this.area=this.zoneNodes.parent.label;this.build=this.zoneNodes.label;this.floor='';this.room='';
                }else if(this.zoneNodes.level===3){
                    this.area=this.zoneNodes.parent.parent.label;this.build=this.zoneNodes.parent.label;
                    this.floor=this.zoneNodes.label;this.room='';
                }else if(this.zoneNodes.level===4){
                    this.area=this.zoneNodes.parent.parent.parent.label;this.build=this.zoneNodes.parent.parent.label;
                    this.floor=this.zoneNodes.parent.label;this.room=this.zoneNodes.label;
                }
            },
            addDoors(){//新增门点
                console.log(this.zoneDatas.addInfo.doors)
                let obj={name:'',type:'请选择'};
                if(!this.zoneDatas.addInfo.doors){
                    this.zoneDatas.addInfo.doors=[];
                }
                this.zoneDatas.addInfo.doors.push(obj)
            },
            delAreaNodes(){//删除区域节点
                this.$confirm('区域内包括 '+this.deviceNum+' 家入驻企业！ 删除该门点将清除入驻企业的地址信息?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let self=this;
                    this.$del(delParkTreeUrl+this.zoneDatas.id)
                        .then(function(response) {
                            self.$message({
                                message: '区域门点删除成功',
                                type: 'success'
                            });
                            self.getTree();
                        });
                }).catch(() => {

                });
            },
            deleteNode(index){//删除节点
                this.$confirm('删除该门点将解除设备的绑定关系?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.zoneDatas.addInfo.doors.splice(index,1);
                    let parentId=this.zoneNodes.level===1?'':this.zoneNodes.parent.key;
                    let data={
                        addInfo: {
                            doors:this.zoneDatas.addInfo.doors
                        },
                        id: this.zoneNodes.key,
                        parkId:localStorage.getItem("parkId"),
                        level:this.zoneNodes.level,
                        parentId:parentId,
                        name:this.zoneNodes.label
                    };
                    this.$post(upParkTreeUrl,data)
                        .then((res)=>{
                            this.getTree();
                        })
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
                            let parentId=this.zoneNodes.level===1?'':this.zoneNodes.parent.key;
                            let data={
                                addInfo: {
                                    doors:this.zoneDatas.addInfo.doors
                                },
                                id: this.zoneNodes.key,
                                parkId:localStorage.getItem("parkId"),
                                level:this.zoneNodes.level,
                                parentId:parentId,
                                name:this.zoneNodes.label
                            };
                            this.$post(upParkTreeUrl,data)
                                .then((res)=>{
                                    this.getTree();
                                })
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
            this.getTree(); //区域信息
        }
    }
</script>

<style lang="scss" scoped>
    .topBar{
        padding: 0 10px;
        margin: 10px 0 0;
    }
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
        margin-bottom: 30px;
        .el-input{
            width: 200px;
        }
        .doors{
            li{
                margin-bottom: 15px;
                .el-select{
                    width: 200px;
                    margin: 0 15px;
                }
            }
        }
    }
</style>