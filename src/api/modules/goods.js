import axios from 'axios'

// 获取商品列表
let list = (data) => axios.get('/api/goods/list',{params:data});
// 获取商品详情
let detail = (data) => axios.get('/api/goods/detail',{params:data});
// 删除商品
let del_goods = (data) => axios.delete('/api/admin/goods',{params:data});
// 发布商品
let release = (data) => axios.post('/api/admin/goods',data);
// 获取商品详情
let goodsInfo = (data) => axios.get('/api/admin/goods',{params:data});
// 编辑商品
let edit_goods = (data) => axios.put('/api/admin/goods',data);
// 获取所有树形分类
let cate = (data) => axios.get('/api/category/all',{params:data});
// 删除分类
let del = (data) => axios.delete('/api/category',{params:data});
// 更新分类
let edit = (data) => axios.put('/api/category',data);
// 添加子分类
let add = (data) => axios.post('/api/category',data);
// 获取子分类
let sub = (data) => axios.get('/api/category/sub',{params:data});
// 获取所有省份
let province = (data) => axios.get('/api/pcct/province',{params:data});
// 获取县区
let city = (data) => axios.get('/api/pcct/city',{params:data});
// 获取县区
let county = (data) => axios.get('/api/pcct/county',{params:data});

export default{
	list,
	detail,
	del_goods,
	cate,
	del,
	edit,
	add,
	sub,
	release,
	province,
	city,
	county,
	goodsInfo,
	edit_goods
}