<template>
	<div class="header">
		<div class="left">
			<img src="../assets/images/logo.png" alt="">
			<i @click="collapseHandle" class="el-icon-s-fold"></i>
		</div>
		<div class="right">
			<el-menu router class="el-menu-demo" mode="horizontal" background-color="#31404e" 
			text-color="#fff" active-text-color="#ffd04b">
				<el-submenu index="2">
					<template slot="title">
						<el-avatar class="right_avatar" size="large" :src="form.avatar"></el-avatar>{{form.name}}
					</template>
					<el-menu-item index="/usermanage/list">消息</el-menu-item>
					<el-menu-item index="/rightsset/userrole">设置</el-menu-item>
					<el-menu-item index="/login">退出</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>

<script>
	import {Admin} from '@/api/index'
	export default {
		data() {
			return {
				form:{
					name:'',
					avatar:''
				}
			}
		},
		created() {
			this.loadUserInfo();
		},
		methods: {
			collapseHandle() {
				this.$emit('change');
			},
			async loadUserInfo(){
				let id = sessionStorage.uid;
				let {status,data} = await Admin.info({id});
				if(status){
					this.form.avatar = data.avatar;
					this.form.name = data.fullname;
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.header {
		height: 60px;
		background-color: #31404e;
		display: flex;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
			padding-left: 50px;

			img {
				height: 60px;
			}

			.el-icon-s-fold {
				color: white;
			}
		}

		.right {
			display: flex;
			align-items: center;
			padding-right: 50px;
			
			.right_avatar{
				margin-right: 10px;
			}
		}
	}
</style>
