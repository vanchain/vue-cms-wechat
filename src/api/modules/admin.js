import axios from 'axios'

// 管理员登录
let login = (data) => axios.post('/api/admin/login',data);
// 管理员注册
let register = (data) => axios.post('/api/admin/register',data);
// 获取管理员的个人资料
let info = (data) => axios.get('/api/admin',{params:data});
// 获取管理员列表
let list = (data) => axios.get('/api/admin/list',{params:data});
// 删除管理员
let del = (data) => axios.delete('/api/admin',{params:data});
// 更新管理员个人资料
let edit = (data) => axios.put('/api/admin',data);
// 获取角色列表（身份）
let load_role = (data) => axios.get('/api/role/list',{params:data});

export default{
	login,
	register,
	info,
	list,
	del,
	edit,
	load_role
}