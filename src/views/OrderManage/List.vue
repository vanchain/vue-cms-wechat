<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>订单列表</span>
		</div>
		<div class="text item">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="id" label="#" width="50">
				</el-table-column>
				<el-table-column prop="" width="600">
					<template slot-scope="scope">
						<el-table :data="scope.row.goodsList" style="width: 100%">
							<el-table-column label="商品" width="400">
								<template slot-scope="scope">
									<div class="name_cell">
										<div class="img_box">
											<el-image class="photo" :src="scope.row.img_md"></el-image>
										</div>
										<span>{{scope.row.name}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="goods_price" label="单价">
							</el-table-column>
							<el-table-column prop="goods_num" label="数量">
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="payment" label="付款总额">
				</el-table-column>
				<el-table-column prop="create_time" label="下单时间">
				</el-table-column>
				<el-table-column prop="status" label="状态">
				</el-table-column>
				<el-table-column prop="operation" label="操作">
					<el-button type="primary" plain icon="el-icon-edit">编辑</el-button>
				</el-table-column>
			</el-table>
		</div>
	</el-card>
</template>

<script>
	import { Order } from '@/api/index'
	export default {
		data() {
			return {
				tableData: [],
			}
		},
		created() {
			this.loadOrderList();
		},
		methods: {
			async loadOrderList() {
				let { status, data } = await Order.list({ status: 'all' });
				if (status) {
					data.forEach((item) => {
						item.create_time = new Date(item.create_time).toLocaleString();
					})
					this.tableData = data;
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.name_cell {
		display: flex;
		align-items: center;
		
		.img_box{
			width: 80px;
		}
		
		.photo {
			border: 1px solid #e5e5e5;
			width: 80px;
		}
	}
	.name_cell>span{
		padding-left: 10px;
	}
</style>
