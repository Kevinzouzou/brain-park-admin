<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<img class="logoImg" v-if="!collapsed" src="../assets/logo.png">
			</el-col>
			<el-col :span="8" :offset="6" class="userinfo">
				<!--<div class="usermenu" v-if="user.id">-->
				<span class="usermenu">
					欢迎您：{{user.username || ''}}
				</span>
				<a href="javascript:;" class="out" @click="logout">退出</a>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in routersList" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf" v-show="item.ishide">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-show="child.ishide" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>

				<!--<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"-->
						 <!--unique-opened router v-show="!collapsed">-->
					<!--<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">-->
						<!--<el-submenu :index="index+''" v-if="!item.leaf">-->
							<!--<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>-->
							<!--<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>-->
						<!--</el-submenu>-->
						<!--<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>-->
					<!--</template>-->
				<!--</el-menu>-->
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
			    user:{},
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				routersList:[],

			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
				    sessionStorage.setItem('token','');
					// sessionStorage.removeItem('user');
					_this.$router.push('/');
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
            getrouters(){
                let perList=JSON.parse(sessionStorage.getItem('permission'));
                // console.log(perList)
                this.routersList=require('../routes.js');
                this.routersList=this.routersList.default;
                console.log(this.routersList)
                this.routersList.forEach((item,index)=>{
                   if(item.children && item.children.length>0){
                       item.children.forEach((childitem)=>{
                           if(perList.indexOf(childitem.name)!==-1){
                               childitem.ishide=true;
						   }else{
                               childitem.ishide=false;
                           }
                           if(childitem.ishide===true){
                               item.ishide=true;
						   }else{
                               item.ishide=false;
						   }
					   })
				   }
				});
                // console.log(this.routersList)
                let rou=this.routersList;
                rou.forEach((item,index)=>{
                    if(item.hidden===false || item.ishide===false){
                        rou.splice(index,1);
                    }
					if(item.children && item.children.length>0){
                        item.children.forEach((child,childindex)=>{
                            if(child.ishide===false){
                                item.children.splice(childindex,1);
							}
						})
					}
				});
				console.log(rou)

            },
		},
		mounted() {
			this.user =JSON.parse(sessionStorage.getItem('user'));
            this.getrouters();
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				font-size: 17px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
				.out{
					color: #fff;
					text-decoration: none;
					margin-left: 15px;
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.logoImg{
					height: 30px;
					width: 72%;
					margin: 15px 0;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
					.el-submenu{
						.fa{
							vertical-align: middle;
    						margin-right: 5px;
    						width: 24px;
    						text-align: center;
    						font-size: 18px;
						}
					}
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>