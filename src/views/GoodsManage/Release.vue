<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>发布商品</span>
		</div>
		<div class="text">
			<el-form :rules="rules" ref="form" :model="form" label-width="100px">
				<!-- 商品分类 -->
				<el-form-item label="商品分类">
					<el-select v-model="form.cate_1st" placeholder="请选择一级分类">
						<el-option v-for="item in options_1st" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="form.cate_2nd" placeholder="请选择二级分类">
						<el-option v-for="item in options_2nd" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="form.cate_3rd" placeholder="请选择三级分类">
						<el-option v-for="item in options_3rd" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<!-- 商品名称 -->
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="form.name" class="long_width"></el-input>
					<span class="text_btm">商品标题名称长度至少3个字符，最长200个汉字</span>
				</el-form-item>
				<!-- 商品卖点 -->
				<el-form-item label="商品卖点" prop="hotPoint">
					<el-input class="long_width" type="textarea" :rows="2" v-model="form.hotPoint"></el-input>
					<span class="text_btm">商品卖点不能超过140个汉字</span>
				</el-form-item>
				<!-- 商品价格 -->
				<el-form-item label="商品价格" prop="price">
					<el-input class="short_width" placeholder="请输入内容" v-model="form.price">
						<template slot="append">元</template>
					</el-input>
					<span class="text_btm">价格必须是0-999999之间的数字，且不能高于市场价</span>
					<span class="text_btm">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</span>
				</el-form-item>
				<!-- 市场价 -->
				<el-form-item label="市场价" prop="marketPrice">
					<el-input class="short_width" placeholder="请输入内容" v-model="form.marketPrice">
						<template slot="append">元</template>
					</el-input>
					<span class="text_btm">价格必须是0-999999之间的数字，此价格仅为市场参考价，请根据实际情况认真填写</span>
				</el-form-item>
				<!-- 成本价 -->
				<el-form-item label="成本价" prop="cost">
					<el-input class="short_width" placeholder="请输入内容" v-model="form.cost">
						<template slot="append">元</template>
					</el-input>
					<span class="text_btm">价格必须是0-999999之间的数字，此价格为商户对所销售的商品的实际成本价进行备注记录，非必填选项，不会在前台销售页面中显示</span>
				</el-form-item>
				<!-- 折扣 -->
				<el-form-item label="折扣" prop="discount">
					<el-input class="short_width" placeholder="请输入内容" v-model="discountRate">
						<template slot="append">折</template>
					</el-input>
					<span class="text_btm">根据销售价与市场价比例自动生成不需要编辑</span>
				</el-form-item>
				<!-- 库存 -->
				<el-form-item label="库存" prop="inventory">
					<el-input class="short_width" placeholder="请输入内容" v-model="form.inventory">
						<template slot="append">件</template>
					</el-input>
					<span class="text_btm">价格必须是0-999999之间的整数</span>
					<span class="text_btm">若启动了库存配置，则系统自动计算商品的总数，此处无需卖家填写</span>
				</el-form-item>
				<!-- 商品货号 -->
				<el-form-item label="商品货号" prop="articleNo">
					<el-input class="short_width" placeholder="请输入内容" v-model="form.articleNo"></el-input>
					<span class="text_btm">商品货号是商家管理商品的编号，买家不可见</span>
					<span class="text_btm">最多输入20个字符，只支持输入中文、字母、数字、_、/、-和小数点</span>
				</el-form-item>
				<!-- 商品主图 -->
				<el-form-item label="商品主图" prop="img_lg">
					<upload uploadAddress="/api/upload/goods" @remove="form.img_lg = ''" @success="loadPhoto($event)" :url="form.img_lg"></upload>
					<span class="text_btm">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
						800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</span>
				</el-form-item>
				<!-- 商品轮播图 -->
				<el-form-item label="商品轮播图" prop="slider">
					<el-upload :headers="headers" action="/api/upload/slider" list-type="picture-card" :on-success="uploadSuccess"
					 :on-preview="handlePictureCardPreview">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="form.slider" alt="">
					</el-dialog>
					<span class="text_btm">上传商品默认主图，如多规格时将默认图片或分规格上传规格主图，支持jpg、if、png格式上传或从图片空间选中，建议使用尺寸
						800*800像素以上，大小不超过1M的正方形图片，上传后的图片将自动保存在图片空间的默认分类中</span>
				</el-form-item>
				<!-- 分割线 -->
				<div class="text_detail">商品详情描述</div>
				<!-- 商品品牌 -->
				<el-form-item label="商品名称">
					<el-input class="long_width" v-model="form.brand"></el-input>
				</el-form-item>
				<!-- 商品描述 -->
				<el-form-item label="商品描述" prop="detail">
					<div v-model="form.detail" ref="editor"></div>
				</el-form-item>
				<!-- 分割线 -->
				<div class="text_detail">商品物流信息</div>
				<!-- 地址 -->
				<el-form-item label="所在地">
					<el-select v-model="form.province" placeholder="请选择省份">
						<el-option v-for="item in address_1st" :key="item.province_id" :label="item.name" :value="item.province_id"></el-option>
					</el-select>
					<el-select v-model="form.city" placeholder="请选择市">
						<el-option v-for="item in address_2nd" :key="item.city_id" :label="item.name" :value="item.city_id"></el-option>
					</el-select>
					<el-select v-model="form.county" placeholder="请选择区">
						<el-option v-for="item in address_3rd" :key="item.county_id" :label="item.name" :value="item.county_id"></el-option>
					</el-select>
				</el-form-item>
				<!-- 运费 -->
				<el-form-item label="运费" prop="freight">
					<el-input class="short_width" placeholder="0" v-model="form.freight">
						<template slot="append">元</template>
					</el-input>
					<span class="text_btm">运费设为0，前台商品将显示免运费</span>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item>
					<el-button type="success" @click="onSubmit">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>

<script>
	import E from 'wangeditor'
	import { Goods, Upload } from '@/api/index'
	import upload from '@/components/SingleUpload.vue'
	export default {
		components: {
			upload
		},
		data() {
			return {
				form: {
					name: '',
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					hotPoint: '',
					price: '',
					marketPrice: '',
					cost: '',
					discount: '',
					inventory: '',
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					brand: '',
					detail: '',
					freight: '',
					province: '',
					city: '',
					county: ''
				},
				rules: {
					name: [
						{ required: true, message: '商品名称不能为空', trigger: 'blur' },
						{ pattern: /^[\u4e00-\u9fa5]{3,200}$/, message: '请输入正确的商品名称', trigger: 'blur' }
					],
					hotPoint: [
						{ required: true, message: '商品卖点不能为空', trigger: 'blur' },
						{ pattern: /^[\u4e00-\u9fa5]{0,140}$/, message: '请输入正确的商品卖点内容', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '商品价格不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的商品价格', trigger: 'blur' }
					],
					marketPrice: [
						{ required: true, message: '市场价不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的市场价格', trigger: 'blur' }
					],
					cost: [
						{ required: true, message: '成本价不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的成本价', trigger: 'blur' }
					],
					inventory: [
						{ required: true, message: '商品库存不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的商品库存', trigger: 'blur' }
					],
					articleNo: [
						{ required: true, message: '商品货号不能为空', trigger: 'blur' },
						{ pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\-\/]{0,20}$/, message: '请输入正确的商品货号', trigger: 'blur' }
					],
					img_lg: [
						{ required: true, message: '商品主图不能为空', trigger: 'blur' },
					],
					slider: [
						{ required: true, message: '商品轮播图不能为空', trigger: 'blur' },
					],
					freight: [
						{ required: true, message: '运费不能为空', trigger: 'blur' },
						{ pattern: /^[0-9]*$/, message: '请输入正确的运费价格', trigger: 'blur' }
					],
					detail:[
						{ required: true, message: '商品描述不能为空', trigger: 'blur' },
					]
				},
				options_1st: [],
				options_2nd: [],
				options_3rd: [],
				address_1st: [],
				address_2nd: [],
				address_3rd: [],
				dialogVisible: false,
				disabled: false,
				index: '',
				sliderString: '',
				headers: {
					Authorization: `Bearer ${sessionStorage.token}`
				}
			}
		},
		async created() {
			// 获取一级分类
			this.options_1st = await this.loadSubCate(1);
			this.form.cate_1st = this.options_1st[0].id;
			// 获取省份
			this.address_1st = await this.loadProvince();
		},
		watch: {
			// 获取商品分类
			'form.cate_1st': async function(val) {
				this.options_2nd = await this.loadSubCate(val);
				this.form.cate_2nd = this.options_2nd[0].id;
			},
			'form.cate_2nd': async function(val) {
				this.options_3rd = await this.loadSubCate(val);
				this.form.cate_3rd = this.options_3rd[0].id;
			},
			// 获取三级地址
			'form.province': async function(val) {
				this.address_2nd = await this.loadCity(val);
				this.form.city = this.address_2nd[0].city_id;
			},
			'form.city': async function(val) {
				this.address_3rd = await this.loadCounty(val);
				this.form.county = this.address_3rd[0].county_id;
			},
		},
		async mounted() {
			var editor = new E(this.$refs.editor)
			// 同步 form 数据
			editor.customConfig.onchange = (html) => {
				this.form.detail = html
			}
			// 配置图片上传 --- 本地上传 --- 上传到服务器
			// 配置 api 接口
			editor.customConfig.uploadImgServer = '/api/upload/editor';
			// 配置上传的 fileName
			editor.customConfig.uploadFileName = 'file';
			// 自定义 header 头
			editor.customConfig.uploadImgHeaders = {
				Authorization: `Bearer ${sessionStorage.token}`
			};
			editor.create();
		},
		computed: {
			discountRate() {
				if (this.form.price != '' && this.form.marketPrice != '') {
					let temp = parseFloat((this.form.price / this.form.marketPrice) * 10).toFixed(2);
					this.form.discount = temp;
					return temp;
				}
			}
		},
		methods: {
			async onSubmit() {
				this.form.img_md = this.form.img_lg;
				this.form.slider = this.sliderString;
				let { status, data, msg } = await Goods.release({ ...this.form });
				if (status) {
					this.$message.success(msg);
					this.$router.push('/goodsmanage/list');
				}
			},
			// 加载商品的分类
			async loadSubCate(id) {
				let { status, data } = await Goods.sub({ pId: id });
				if (status) {
					return data;
				}
			},
			// 获取所有省
			async loadProvince() {
				let { status, data } = await Goods.province();
				if (status) {
					return data;
				}
			},
			// 获取城市
			async loadCity(id) {
				let { status, data } = await Goods.city({ id });
				if (status) {
					return data;
				}
			},
			// 获取县区
			async loadCounty(id) {
				let { status, data } = await Goods.county({ id });
				if (status) {
					return data;
				}
			},

			uploadSuccess(file) {
				if (this.sliderString == '') {
					this.sliderString = file.src;
				} else {
					this.sliderString = this.sliderString + ',' + file.src;
				}
			},
			handlePictureCardPreview(file) {
				this.form.slider = file.url;
				this.dialogVisible = true;
			},
			loadPhoto({ status, lgImg, msg }) {
				this.form.img_lg = lgImg;
			},
		}
	}
</script>

<style>
	.z_index {
		z-index: 10;
	}

	.text_btm {
		display: block;
		font-size: 12px !important;
		color: #878787;
	}

	.el-form-item__label {
		text-align: left;
	}

	.text_detail {
		padding: 10px;
		margin-bottom: 10px;
		background-color: #f5f5f5;
	}

	.long_width {
		width: 900px;
	}

	.short_width {
		width: 300px;
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
