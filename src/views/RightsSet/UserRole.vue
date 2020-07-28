<template>
	<div class="layout">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>角色列表</span>
				<el-button @click="addRole" icon="el-icon-circle-plus-outline" style="float: right" plain type="primary">添加角色</el-button>
			</div>
			<div class="text">
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
							<el-button @click="loadRights(scope.row.id)" type="primary" plain icon="el-icon-setting"></el-button>
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
		<div class="right" v-show="isRightsShow">
			<el-card v-for="item in rightsArrAll" :key="item.id" class="box-card box-card-right">
				<div slot="header" class="clearfix top">
					<span>{{item.name}}</span>
					<el-switch @change="clickParent(item)" v-model="item.checked"></el-switch>
				</div>
				<div v-for="option in item.children" :key="option.id" class="text item">
					<span>{{option.name}}</span>
					<el-switch v-model="option.checked" @change="clickChild(option,item)"></el-switch>
				</div>
			</el-card>
		</div>
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
				addFromVisible: false,
				rightsArrAll: [], // 权限数组
				rightsId: '',
				roleMenuId:'',
				isRightsShow: false,
				value1: true,
				value2: true
			}
		},
		created() {
			this.loadRoleList();
			this.typeHandle();
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
			async loadRights(id) {
				this.isRightsShow = true;
				let { status, data } = await Rights.rights({ id });
				if (status) {
					this.rightsArrAll = data;
					this.rightsId = id;
				}
			},
			async clickParent({ id, checked, children }) {
				if (checked) {
					let { status } = await Rights.add_rights({ role_id: this.rightsId, menu_id: id });
					children.forEach(async (item) => {
						let { status } = await Rights.add_rights({ role_id: this.rightsId, menu_id: item.id });
						item.checked = checked;
					})
				} else {
					let { status } = await Rights.del_rights({ role_id: this.rightsId, menu_id: id });
					children.forEach(async (item) => {
						let { status } = await Rights.del_rights({ role_id: this.rightsId, menu_id: item.id });
						item.checked = checked;
					})
				}
			},
			async clickChild({ checked, id }, parent) {
			    if (checked) {
			        let { status } = await Rights.add_rights({ role_id: this.rightsId, menu_id: id });
			        if (!parent.checked) {
			            let { status } = await Rights.add_rights({ role_id: this.rightsId, menu_id: parent.id });
			            parent.checked = checked;
			        }
			    } else {
			        let { status } = await Rights.del_rights({ role_id: this.rightsId, menu_id: id });
			        var isclick = parent.children.every((item) => item.checked == false);
			        if (isclick) {
			            let { status } = await Rights.del_rights({ role_id: this.rightsId, menu_id: parent.id });
			            parent.checked = checked;
			        }
			    }
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

<style lang="less" scoped="scoped">
	.layout {
		display: flex;
		justify-content: space-between;
	}

	.box-card {
		width: 700px;
		height: 100%;
	}

	.right {
		width: 55%;
	}

	.box-card-right.box-card {
		width: 100%;
		height: auto;
		margin-bottom: 20px;

		.top {
			display: flex;
			justify-content: space-between;
		}
	}

	.el-form--label-left .el-form-item__label {
		text-align: left;
	}

	.item {
		display: flex;
		justify-content: space-between;

		span {
			font-size: 14px;
			margin-bottom: 10px;
		}
	}
</style>
