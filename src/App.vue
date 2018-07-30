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
		mounted() {},
		created() {}
	}
</script>

<style lang="scss">
	body {
		margin: 0px;
		padding: 0px;
		font-size: 14px;
		-webkit-font-smoothing: antialiased;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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
		padding: 10px;
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

	.mt10 {
		margin-top: 10px;
	}

	.mb10 {
		margin-bottom: 10px;
	}

	.ml10 {
		margin-left: 10px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.mt20 {
		margin-top: 20px;
	}

	.mb20 {
		margin-bottom: 20px;
	}

	.ml20 {
		margin-left: 20px;
	}

	.mr20 {
		margin-right: 20px;
	}
</style>