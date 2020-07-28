<template>
	<div class="bg">
		<el-card class="box-card login_register_card">
			<div slot="header" class="clearfix">
				<span>欢迎登陆</span>
			</div>
			<div class="text item">
				<el-form :rules="rules" ref="form" :model="form" label-width="60px">
					<el-form-item label="账户" prop="username">
						<el-input prefix-icon="el-icon-user" v-model="form.username" placeholder="请输入账户名"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input prefix-icon="el-icon-key" v-model="form.password" show-password placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('form')">登录</el-button>
					</el-form-item>
				</el-form>
				<div class="text_link">
					<router-link to="/register">注册账户</router-link>
					<el-link href="javascript:void(0)" target="_blank">忘记密码？</el-link>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { Admin } from '@/api/index.js'
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [
						{ required: true, message: '请填写账号', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请填写密码', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, data, msg } = await Admin.login({ ...this.form });
						if (status) {
							// 登陆成功之后，储存 token、uid、role
							sessionStorage.token = data.token;
							sessionStorage.uid = data.id;
							sessionStorage.role = data.role;
							// 成功
							this.$message.success(msg);
							// 是否有重定向 redirect 参数
							let { redirect } = this.$route.query;
							if (redirect) {
								this.$router.replace(redirect);
								return;
							}
							this.$router.push('/goodsmanage/list');
						} else {
							this.$message.error(msg)
						}
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.login_register_card {
		width: 350px;
	}

	.text_link {
		display: flex;
		justify-content: space-between;

		a {
			text-decoration: none;
			color: #333;
			font-size: 15px;
		}
	}
</style>
