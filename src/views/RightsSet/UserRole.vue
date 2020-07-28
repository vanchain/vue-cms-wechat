<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>角色列表</span>
				<el-button @click="addRole" icon="el-icon-circle-plus-outline" style="float: right" plain type="primary">添加角色</el-button>
			</div>
			<div class="text item">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="#">
					</el-table-column>
					<el-table-column label="角色">
						<template slot-scope="scope">
							<el-tag :type="typeHandle(scope.row.id)">{{scope.row.name}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="operation" label="操作">
						<template slot-scope="scope">
							<el-button @click="editRole(scope.row.id,scope.$index)" :disabled="scope.row.id == 1" type="primary" plain icon="el-icon-edit"></el-button>
							<el-button @click="deleteRole(scope.row.id,scope.$index)" :disabled="scope.row.id == 1" type="danger" plain icon="el-icon-delete"></el-button>
							<el-button type="primary" plain icon="el-icon-setting"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog title="编辑角色" :visible.sync="editFromVisible">
			<el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFromVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRoleConfirm('editForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加对话框 -->
		<el-dialog title="添加角色" :visible.sync="addFromVisible">
			<el-form ref="addFrom" :rules="rules" :model="addFrom" label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addFrom.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFromVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRoleConfirm('addFrom')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 权限设置 -->
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>卡片名称</span>
				<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
			</div>
			<div v-for="o in 4" :key="o" class="text item">
				{{'列表内容 ' + o }}
			</div>
		</el-card>
	</div>
</template>

<script>
	import { Rights } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				editForm: {
					id: 0,
					name: ''
				},
				addFrom: {
					name: ''
				},
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				editFromVisible: false,
				addFromVisible: false
			}
		},
		created() {
			this.loadRoleList();
			this.typeHandle();
			this.loadRights();
		},
		methods: {
			// 加载角色列表
			async loadRoleList() {
				let { status, data } = await Rights.list();
				if (status) {
					this.tableData = data;
				}
			},
			typeHandle(id) {
				if (id == 1) {
					return 'danger';
				}
			},
			// 获取权限
			async loadRights() {
				let res = await Rights.rights({ id: 1 });
				console.log(res);
			},
			// 编辑角色
			editRole(id, index) {
				this.editForm.id = id;
				this.editForm.name = this.tableData[index].name;
				this.editFromVisible = true;
			},
			editRoleConfirm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, data, msg } = await Rights.edit({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							this.loadRoleList();
							this.editFromVisible = false;
						}
					}
				});
			},
			// 添加角色
			addRole() {
				this.addFromVisible = true;
			},
			addRoleConfirm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, data, msg } = await Rights.add({ ...this.addFrom });
						if (status) {
							this.tableData.push(data);
							this.$message.success(msg);
							this.loadRoleList();
							this.addFromVisible = false;
						}
					}
				});
			},
			// 删除角色
			deleteRole(id, index) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let { status, data } = await Rights.del({ id });
					if (status) {
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.box-card {
		width: 700px;
	}

	.btn {
		cursor: default;
	}

	.el-form--label-left .el-form-item__label {
		text-align: left;
	}
</style>
