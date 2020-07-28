import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/components/Layout.vue'

const routes = [{
		path: '/login',
		alias: '/',
		name: 'Login',
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('../views/Register.vue')
	},
	{
		path: '/goodsmanage/',
		name: 'GoodsManage',
		component: Layout,
		children: [{
				path: 'category',
				name: 'Category',
				component: () => import('../views/GoodsManage/Category.vue')
			},
			{
				path: 'list',
				name: 'List',
				component: () => import('../views/GoodsManage/List.vue')
			},
			{
				path: 'release',
				name: 'Release',
				component: () => import('../views/GoodsManage/Release.vue')
			},
			{
				path: 'edit/:id',
				name: 'Edit',
				component: () => import('../views/GoodsManage/Edit.vue'),
				props:true
			}
		]
	},
	{
		path: '/ordermanage/',
		name: 'OrderManage',
		component: Layout,
		children: [{
			path: 'list',
			name: 'List',
			component: () => import('../views/OrderManage/List.vue')
		}]
	},
	{
		path: '/accountset/',
		name: 'AccountSet',
		component: Layout,
		children: [{
			path: 'info',
			name: 'Info',
			component: () => import('../views/AccountSet/Info.vue')
		}]
	},
	{
		path: '/usermanage/',
		name: 'UserManage',
		component: Layout,
		children: [{
			path: 'list',
			name: 'List',
			component: () => import('../views/UserManage/List.vue')
		}]
	},
	{
		path: '/rightsset/',
		name: 'RightsSet',
		component: Layout,
		children: [{
			path: 'menurights',
			name: 'MenuRights',
			component: () => import('../views/RightsSet/MenuRights.vue')
		},
		{
			path: 'userrole',
			name: 'UserRole',
			component: () => import('../views/RightsSet/UserRole.vue')
		}]
	}
]

const router = new VueRouter({
	routes
})

export default router
