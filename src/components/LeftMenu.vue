<template>
	<el-menu router :collapse="isCollapse" background-color="#334e66" text-color="#fff" active-text-color="#ffd04b" class="left-menu">
		<el-submenu v-for="(item,index) in menuList" :key="item.id" :index="index+''">
			<template slot="title">
				<i :class="'el-icon-' + item.icon"></i>
				<span>{{item.name}}</span>
			</template>
			<el-menu-item v-for="(item) in item.children" :key="item.id" :index="item.path">{{item.name}}
			</el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
	import {Rights} from '@/api/index'
	export default {
		props: ['isCollapse'],
		data(){
			return{
				menuList:[]
			}
		},
		created() {
			this.loadMenuList();
		},
		methods:{
			async loadMenuList(){
				let id = sessionStorage.uid;
				let {status,data} = await Rights.menu({id});
				if(status){
					console.log(data);
					this.menuList = data;
				}
			}
		}
	}
</script>

<style>
	.left_menu {
		height: calc(100vh - 60px);
		background-color: #334e66;
	}
</style>
