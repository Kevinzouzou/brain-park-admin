<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'app',
		components: {},
		mounted() {
			// this.$ajax({
			//     method: 'post',
			//     url: 'api/park/queryEnterprise',
			//     data: {
			//         parkId: '969878f1f1149e6a7afae38636c0abc'
			//     }
			// }).then(res=>{
			//     console.log(res);
			// })
			// localStorage.setItem("parkId",'969878f1f1149e6a7afae38636c0abc');
			// localStorage.setItem("userId",'71f3df48263f4c74be2efbb83250e66b');
		},
		created() {


		}
	}
</script>

<style lang="scss">
	body {
		margin: 0px;
		padding: 0px;
		/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
		// background: #1F2D3D;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		font-size: 14px;
		-webkit-font-smoothing: antialiased;
		font-family: -apple-system, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Arial, sans-serif;
		text-rendering: optimizeLegibility;
	}

	#app {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}

	.el-submenu [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.el-menu-item [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.toolbar {
		background: #f2f2f2;
		padding: 10px; //border:1px solid #dfe6ec;
		margin: 10px 0px;
		.el-form-item {
			margin-bottom: 10px;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all .2s ease;
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
</style>