<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品分类</span>
			</div>
			<div class="text item">
				<el-tree :load="loadNode" lazy ref="tree" node-key="id" :default-expanded-keys='[1]' :props="defaultProps">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span>
							<el-button @click.stop="() => openEditModel(node,data)" :disabled="node.level == 1" icon="el-icon-edit" type="text">编辑</el-button>
							<el-button @click.stop="() => openAddModel(node,data)" icon="el-icon-plus" type="text">添加</el-button>
							<el-button @click.stop="() => deleteNode(node)" :disabled="node.level == 1" icon="el-icon-delete" type="text">删除</el-button>
						</span>
					</span>
				</el-tree>
			</div>
		</el-card>

		<!-- 编辑对话框 -->
		<el-dialog title="编辑节点" :visible.sync="editFormVisible">
			<el-form ref="editForm" :rules="rules" :model="editForm">
				<el-form-item prop="name" label="名称" label-width="80px">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item prop="img" label="图片" label-width="80px">
					<upload uploadAddress="/api/upload/common" @remove="editForm.img = ''" @success="loadImg($event)" :url="editForm.img"></upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editNode('editForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加对话框 -->
		<el-dialog title="添加节点" :visible.sync="addFormVisible">
			<el-form ref="addForm" :rules="rules" :model="addForm">
				<el-form-item prop="name" label="名称" label-width="80px">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item prop="img" label="图片" label-width="80px">
					<upload uploadAddress="/api/upload/common" @remove="addForm.img = ''" @success="loadImg($event)" :url="addForm.img"></upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addNode('addForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Goods } from '@/api/index'
	import upload from '@/components/SingleUpload.vue'
	export default {
		components: {
			upload
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				addForm: {
					name: '',
					pId: '',
					img: '',
				},
				editForm: {
					name: '',
					id: '',
					img: ''
				},
				node: [],
				nodeData: [],
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					img: [
						{ required: true, message: '请选择图片', trigger: 'blur' }
					]
				},
				editFormVisible: false,
				addFormVisible: false,
			}
		},
		methods: {
			async loadNode(node, resolve) {
				// node：节点对象
				// resolve：返回下一级节点数据的方法
				if (node.level == 0) {
					let { data } = await Goods.sub({ pId: 0 });
					return resolve(data);
				}
				let pId = node.data.id;
				// 获取子节点数据
				let { status, data } = await Goods.sub({ pId });
				if (status) {
					return resolve(data);
				}
			},
			// 添加新的商品分类节点
			openAddModel(node, data) {
				this.addForm = { name: '', pId: '', img: '' };
				this.node = node;
				this.addForm.pId = data.id;
				this.addFormVisible = true;
			},
			async addNode(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status,data, msg } = await Goods.add({ ...this.addForm });
						if (status) {
							this.$refs.tree.append({ ...data,...this.addForm }, this.node);
							this.$message.success(msg);
							this.addFormVisible = false;
						}
					}
				});
			},
			// 编辑商品分类节点
			openEditModel(node, data) {
				this.editForm = { ...data };
				this.editFormVisible = true;
				this.node = node;
			},
			editNode(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Goods.edit({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							this.node.data = this.editForm;
							this.editFormVisible = false;
						}
					}
				});
			},
			// 删除商品分类节点
			deleteNode(node) {
				this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let id = node.id;
					let { status } = await Goods.del({ id });
					if (status) {
						// 删除dom
						this.$refs.tree.remove(node);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			},

			loadImg({ src }) {
				this.editForm.img = src;
				this.addForm.img = src;
			}
		}
	}
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
