<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>账户信息</span>
		</div>
		<div class="text item">
			<el-form :rules="rules" ref="form" :model="form" label-position="right" label-width="80px">
				<el-form-item label="账户">
					<el-input disabled class="account_width" v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="fullname">
					<el-input class="account_width" v-model="form.fullname"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="form.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="tel">
					<el-input class="account_width" v-model="form.tel"></el-input>
				</el-form-item>
				<el-form-item label="权限">
					<el-select v-model="form.role">
						<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<upload uploadAddress="/api/upload/avatar" @remove="addForm.img = ''" @success="loadImg($event)" :url="form.avatar"></upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit('form')">修改</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>

<script>
	import { Admin } from '@/api/index'
	import upload from '@/components/SingleUpload.vue'
	export default {
		components: {
			upload
		},
		data() {
			return {
				form: {
					id:'',
					username: '',
					fullname: '',
					sex: '',
					tel: '',
					email:'',
					avatar: '',
					role:''
				},
				rules: {
					fullname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
						{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '请输入电话号码', trigger: 'blur' }
					],
					rights: [
						{ required: true, message: '请选择权限', trigger: 'blur' }
					],
					avatar: [
						{ required: true, message: '请上传头像', trigger: 'blur' }
					],
					account: [
						{ required: true, message: '请上传头像', trigger: 'blur' }
					]
				},
				roleList: []
			}
		},
		created() {
			this.loadAdminInfo();
			this.loadRole();
		},
		methods: {
			async loadAdminInfo() {
				let id = sessionStorage.uid;
				let { status, data } = await Admin.info({ id });
				if (status) {
					this.form = data;
					this.form.avatar = data.avatar.replace(/(\S*)\images/, 'http://localhost:3003/images');
				}
			},
			// 获取角色列表
			async loadRole() {
				let { status, data } = await Admin.load_role();
				if (status) {
					this.roleList = data;
				}
			},
			onSubmit(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let id = sessionStorage.uid;
						this.form.id = id;
						let {status,data,msg} = await Admin.edit({...this.form});
						if(status){
							this.$message.success(msg);
							this.$router.push('/user/list');
						}
					}
				});
			},

			transmission({ res }) {
				this.form.avatar = data;
			}
		}
	}
</script>

<style scoped>
	.text {
		display: flex;
		justify-content: center;
	}

	.el-form-item__label {
		text-align: center;
	}

	.account_width {
		width: 1000px;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
