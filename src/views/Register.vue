<template>
	<div class="bg">
		<el-card class="box-card login_register_card">
			<div slot="header" class="clearfix">
				<span>欢迎注册</span>
			</div>
			<div class="text item">
				<el-form :rules="rules" ref="form" :model="form" label-width="60px">
					<el-form-item label="账户" prop="username">
						<el-input prefix-icon="el-icon-user" v-model="form.username" placeholder="请输入2-5位账户名"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input show-password prefix-icon="el-icon-key" v-model="form.password" placeholder="请输入3-10位密码"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="fullname">
						<el-input prefix-icon="el-icon-postcard" v-model="form.fullname" placeholder="请输入真实姓名"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="男"></el-radio>
							<el-radio label="女"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机" prop="tel">
						<el-input prefix-icon="el-icon-phone-outline" v-model="form.tel" placeholder="请输入手机号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox-group v-model="form.checkbox">
							<el-checkbox label="同意本站用户协议"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="!form.checkbox" type="primary" @click="submitForm('form')">登录</el-button>
					</el-form-item>
				</el-form>
				<div class="text_link">
					<router-link to="/login">登录账户</router-link>
					<el-link href="javascript:void(0)" target="_blank">忘记密码？</el-link>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {Admin} from '@/api/index'
	export default {
		data() {
			var checkPhone = (rule, value, callback) => {
				const phoneReg = /^1[34578]\d{9}$$/
				if (!value) {
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {
					// Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
					// 所以在前面加了一个+实现隐式转换

					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			};
			return {
				form: {
					username: '',
					password: '',
					fullname: '',
					sex: '',
					tel: '',
					checkbox: ''
				},
				rules: {
					username: [
						{ required: true, message: '请输入账户名', trigger: 'blur' },
						{ min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请填写密码', trigger: 'blur' },
						{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					fullname: [
						{ required: true, message: '请填写姓名', trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'blur' }
					],
					tel: [
						{ required: true, validator: checkPhone, trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let {status,msg} = await Admin.register({...this.form});
						if(status){
							this.$message.success(msg);
							this.$router.push('/login');
						}else{
							this.$message.error(msg);
						}
					}
				});
			},
		}
	}
</script>

<style lang="less">
	.login_register_card{
		width: 350px;
	}
	.text_link {
		display: flex;
		justify-content: space-between;
		
		a{
			text-decoration: none;
			color: #666;
			font-size: 14px;
		}
	}
</style>
