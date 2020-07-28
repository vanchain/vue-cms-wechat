<template>
	<div>
		<el-container style="min-height: 100vh;">
			<el-header>
				<NavBar @change="isCollapse = !isCollapse"></NavBar>
			</el-header>
			<el-container>
				<!-- 左侧菜单 -->
				<!-- <el-aside width="200px"> -->
					<LeftMenu :isCollapse="isCollapse"></LeftMenu>
				<!-- </el-aside> -->
				<!-- 内容 -->
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
	
</template>

<script>
	import NavBar from '@/components/NavBar.vue'
	import LeftMenu from '@/components/LeftMenu.vue'
	export default{
		components:{
			NavBar,
			LeftMenu
		},
		data(){
			return{
				isCollapse:false
			}
		},
	}
</script>

<style>
	.main {
		/* display: flex; */
	}
	.el-header{
		padding: 0 !important;
	}
</style>
