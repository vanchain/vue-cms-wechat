<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>用户列表</span>
			</div>
			<div class="text item">
				<el-table :default-sort="{prop: 'date', order: 'descending'}" :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#">
					</el-table-column>
					<el-table-column label="头像">
						<template slot-scope="scope">
							<el-image class="photo" :src="scope.row.avatar"></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="账号" sortable>
					</el-table-column>
					<el-table-column prop="fullname" label="姓名" sortable>
					</el-table-column>
					<el-table-column prop="sex" label="性别" sortable>
					</el-table-column>
					<el-table-column prop="tel" label="手机" sortable>
					</el-table-column>
					<el-table-column label="角色" sortable>
						<template slot-scope="scope">
							<el-tag :type="typeHandle(scope.row.id)">{{scope.row.role_name}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="login_time" label="上次登录" sortable>
					</el-table-column>
					<el-table-column prop="login_count" label="登陆次数" sortable>
					</el-table-column>
					<el-table-column prop="operation" label="操作">
						<template slot-scope="scope">
							<el-button @click="editAdmin(scope.row,scope.$index)" type="primary" plain icon="el-icon-edit"></el-button>
							<el-button @click="deleteUser(scope.row.id,scope.$index)" :disabled="scope.row.id == 1" type="danger" plain icon="el-icon-delete"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog title="修改信息" :visible.sync="editFormVisible">
			<el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
				<el-form-item label="姓名" prop="fullname">
					<el-input v-model="editForm.fullname"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="editForm.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="tel">
					<el-input v-model="editForm.tel"></el-input>
				</el-form-item>
				<el-form-item label="权限" prop="role">
					<el-select v-model="editForm.role">
						<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<upload uploadAddress="/api/upload/avatar" @remove="this.editForm.avatar = ''" @success="loadImage($event)" :url="editForm.avatar"></upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editAdminConfirm('editForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Admin } from '@/api/index'
	import upload from '@/components/SingleUpload.vue'
	export default {
		components:{
			upload
		},
		data() {
			return {
				tableData: [],
				editForm: {
					id: '',
					fullname: '',
					sex: '',
					avatar: '',
					tel: '',
					email: '',
					role: ''
				},
				rules: {
					username: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请选择姓名', trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '请输入电话', trigger: 'blur' }
					],
					role: [
						{ required: true, message: '请选择权限', trigger: 'blur' }
					],
					avatar: [
						{ required: true, message: '请上传头像', trigger: 'blur' }
					]
				},
				editFormVisible: false,
				index: 0,
				roleList: []
			}
		},
		created() {
			this.loadUserList();
			this.typeHandle();
			this.loadRole();
		},
		methods: {
			async loadUserList() {
				let { status, data } = await Admin.list({});
				if (status) {
					data.forEach((item) => {
						item.avatar = item.avatar.replace(/(\S*)\images/, 'http://localhost:3003/images');
					});
					this.tableData = data;
				}
			},
			typeHandle(id) {
				if (id == 1) {
					return 'danger';
				}
			},
			// 编辑管理员
			editAdmin(data, index) {
				// this.index = index;
				this.editForm = { ...data };
				this.editFormVisible = true;
			},
			editAdminConfirm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Admin.edit({ ...this.editForm });
						if (status) {
							// 更新DOM数据
							// let index = this.index;
							// this.$set(this.tableData, index, this.editForm);
							this.loadUserList();

							this.$message.success(msg);
							this.editFormVisible = false;
						} else {
							this.$message.error(msg);
						}
					}
				});
			},
			// 删除管理员
			deleteUser(id, index) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let { status, data } = await Admin.del({ id });
					if (status) {
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			},
			// 获取角色列表
			async loadRole() {
				let { status, data } = await Admin.load_role();
				if (status) {
					this.roleList = data;
				}
			},
			
			loadImage({src}){
				this.editForm.avatar = src;
			}
		}
	}
</script>

<style scoped="scoped">
	.photo {
		width: 50px;
		border-radius: 50%;
	}

	.el-form-item__label {
		text-align: center;
	}
</style>
