import axios from 'axios'

// 获取角色列表
let list = (data) => axios.get('/api/role/list',{params:data});
// 获取子菜单
let sub = (data) => axios.get('/api/menu/sub',{params:data});
// 添加子菜单
let add_menu = (data) => axios.post('/api/menu',data);
// 编辑菜单节点
let edit_menu = (data) => axios.put('/api/menu',data);
// 删除角色
let del = (data) => axios.delete('/api/role',{params:data});
// 添加角色
let add = (data) => axios.post('/api/role',data);
// 更新角色
let edit = (data) => axios.put('/api/role',data);
// 删除节点
let del_node = (data) => axios.delete('/api/menu',{params:data});
// 获取所有图标
let icon = (data) => axios.get('/api/admin/icon/list',{params:data});
// 设置子菜单图标
let icon_set = (data) => axios.put('/api/menu/icon',data);
// 获取权限
let rights = (data) => axios.get('/api/role/config',{params:data});

export default{
	list,
	sub,
	add_menu,
	edit_menu,
	del,
	add,
	edit,
	del_node,
	icon,
	icon_set,
	rights
}