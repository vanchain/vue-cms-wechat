<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>商品列表</span>
		</div>
		<div class="text item">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column label="商品名称" width="550">
					<template slot-scope="scope">
						<div class="name_cell">
							<el-image class="photo" :src="scope.row.img_md"></el-image>
							<div class="content">
								<span>{{scope.row.name}}</span>
								<span>商品货号：{{scope.row.articleNo}}</span>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="价格">
				</el-table-column>
				<el-table-column prop="inventory" label="库存">
				</el-table-column>
				<el-table-column prop="create_time" label="发布时间">
				</el-table-column>
				<el-table-column prop="operation" label="操作">
					<template slot-scope="scope">
						<el-link :href="`#/goodsmanage/edit/${scope.row.id}`" class="am-margin-right-sm">
							<el-button type="primary" size="mini" icon="el-icon-edit" plain>编辑</el-button>
						</el-link>
						<el-button @click="deleteGoods(scope.row.id,scope.$index)" type="danger" plain icon="el-icon-delete">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[4, 8, 16, 32]"
			 layout="prev, pager, next,sizes, total" :total="total">
			</el-pagination>
		</div>
	</el-card>
</template>

<script>
	import { Goods } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				pageSize: 4,
				pageIndex: 1
			}
		},
		created() {
			this.loadGoodsList();
		},
		methods: {
			// 获取商品列表
			async loadGoodsList() {
				let { status, goods, total } = await Goods.list();
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},

			async handleSizeChange(val) {
				this.pageSize = val;
				let { status, goods, total } = await Goods.list({ pageSize: this.pageSize, pageIndex: this.pageIndex });
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
			async handleCurrentChange(val) {
				this.pageIndex = val;
				let { status, goods, total } = await Goods.list({ pageSize: this.pageSize, pageIndex: this.pageIndex });
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
			deleteGoods(id,index) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					type: 'warning'
				}).then(async () => {
					let {status,data} = await Goods.del_goods({id});
					if(status){
						this.tableData.splice(index,1);
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
	.name_cell {
		display: flex;
		align-items: center;
	}

	.content {
		padding-left: 10px;
		display: flex;
		flex-direction: column;

		span {
			display: inline-block;
		}
	}

	.photo {
		width: 80px;
	}

	.paging {
		padding-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
</style>
