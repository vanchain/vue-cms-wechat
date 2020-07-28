<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>菜单权限</span>
			</div>
			<div class="text item">
				<el-alert class="text_tip" title="Tips" type="warning" show-icon description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。">
				</el-alert>
				<el-tree :load="loadNode" lazy ref="tree" node-key="id" :default-expanded-keys="[1]" :props="defaultProps">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span class="layout">
							<el-button @click.stop="iconModel(node,data)" :disabled="node.level == 1" :icon="'el-icon-'+data.icon" type="text">图标</el-button>
							<el-button @click.stop="editMenuNode(node,data)" :disabled="node.level == 1" icon="el-icon-edit" type="text">编辑</el-button>
							<el-button @click.stop="addMenuNode(node,data)" icon="el-icon-plus" type="text">添加</el-button>
							<el-button @click.stop="deleteNode(node,data)" :disabled="node.level == 1" icon="el-icon-delete" type="text">删除</el-button>
							<div class="order_text">显示序号：<el-tag>{{data.order}}</el-tag>
							</div>
						</span>
					</span>
				</el-tree>
			</div>
		</el-card>

		<!-- 编辑节点 -->
		<el-dialog title="编辑节点" :visible.sync="editFormVisible">
			<el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
				<el-form-item label="菜单名称" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="链接地址">
					<el-input v-model="editForm.path" placeholder="指定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" prop="order">
					<el-input v-model="editForm.order"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editMenuNodeConfirm('editForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加节点 -->
		<el-dialog title="添加节点" :visible.sync="addFormVisible">
			<el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
				<el-form-item label="菜单名称" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="链接地址">
					<el-input v-model="addForm.path" placeholder="指定此菜单的链接地址,选填"></el-input>
				</el-form-item>
				<el-form-item label="显示顺序" prop="order">
					<el-input v-model="addForm.order" placeholder="显示顺序按照数字从小到大,如2001"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addMenuNodeConfirm('addForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 图标框 -->
		<el-dialog title="提示" :visible.sync="iconDialogVisible" width="70%">
			<ul class="icon_list">
				<li :class="{active : isChange === index}" @click="changeIcon(index,item.id,item.name)" v-for="(item,index) in iconAll">
					<i style="font-size: 26px;" :class="'el-icon-'+item.name"></i>
					{{item.name}}
				</li>
			</ul>
			<el-pagination class="paging" @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
			</el-pagination>
			<span slot="footer" class="dialog-footer">
				<el-button @click="iconDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="iconSet">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { Rights } from '@/api/index'
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				editForm: {
					id: '',
					name: '',
					path: '',
					order: ''
				},
				addForm: {
					name: '',
					pId: '',
					path: '',
					order: ''
				},
				node: [],
				nodeData: [],
				iconAll:[],
				icon:'',
				iconName:'',
				iconIndex:'', //点击那个节点打开的图标框
				rules: {
					name: [
						{ required: true, message: '请填写名称', trigger: 'blur' }
					],
					order: [
						{ required: true, message: '请填写顺序', trigger: 'blur' }
					]
				},
				editFormVisible: false,
				addFormVisible: false,
				iconDialogVisible:false,
				isChange:-1
			}
		},
		methods: {
			async loadNode(node, resolve) {
				if (node.level == 0) {
					let { data } = await Rights.sub({ pId: 0 });
					return resolve(data);
				}
				let pId = node.data.id;
				let { status, data } = await Rights.sub({ pId: pId });
				if (status) {
					return resolve(data);
				}
			},
			// 页数改变获取图标
			async handleCurrentChange(val) {
				this.isChange = -1;
				let { status, icons } = await Rights.icon({ pageSize: 30, pageIndex: val });
				if (status) {
					this.iconAll = icons;
				}
			},
			// 打开菜单图标
			iconModel(node,data){
				this.node = node;
				this.iconIndex = node.data.id;
				this.handleCurrentChange();
				this.iconDialogVisible = true;
			},
			// 设置菜单图标
			async iconSet(){
				let {status,msg} = await Rights.icon_set({id:this.iconIndex,icon:this.icon});
				if(status){
					this.node.data.icon = this.iconName;
					this.$message.success(msg);
					this.iconDialogVisible = false;
				}
			},
			changeIcon(index,iconId,name){
				this.isChange = index;
				this.icon = iconId;
				this.iconName = name;
			},
			// 编辑菜单节点
			editMenuNode(node, data) {
				this.editFormVisible = true;
				this.editForm.id = data.id;
				// 转存数据
				this.node = node;
			},
			editMenuNodeConfirm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, data, msg } = await Rights.edit_menu({ ...this.editForm });
						if (status) {
							// 更新tree节点
							this.node.data = this.editForm;
							this.$message.success(msg);
							this.editFormVisible = false;
						}
					}
				});
			},
			// 添加新的菜单节点
			addMenuNode(node, data) {
				// 储存父节点的node
				this.node = node;
				this.addForm.pId = data.id;
				this.addFormVisible = true;
			},
			addMenuNodeConfirm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await Rights.add_menu({ ...this.addForm });
						if (status) {
							this.$refs.tree.append({ ...this.addForm }, this.node);
							this.$message.success(msg);
							this.addFormVisible = false;
						}
					}
				});
			},
			// 删除菜单节点
			deleteNode(node, data) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let id = node.data.id;
					let { status, data } = await Rights.del_node({ id });
					if (status) {
						this.$refs.tree.remove(node);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				});
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.text_tip {
		margin-bottom: 20px;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.layout {
		display: flex;
		align-items: center;
		justify-content: center;

		.order_text {
			width: 100px;
			font-size: 11px;
			margin-left: 5px;
			margin-bottom: 2px;
		}
	}
	
	.icon_list{
		list-style-type: none;
		
		.active{
			color: white;
			background-color: #5cb6ff;
			// 关闭鼠标滑过事件
			pointer-events: none;
		}
		
		li{
			width: 10%;
			height: 100px;
			float: left;
			border: 1px solid #cfcfcf;
			box-sizing: border-box;
			padding: 20px 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			cursor: pointer;
			
			i{
				margin-bottom: 10px;
			}
		}
		
		li:hover{
			color: #5cb6ff;
		}
	}
	.icon_list::after{
	    content: "";/* 必须写，否则此伪元素创建不出来 */
	    clear: both;
	    height: 0;
	    display: block;
	}
	.paging {
		padding-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
</style>
