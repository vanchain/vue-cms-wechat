import axios from 'axios'
// loading 服务方式 --- 固定写法
import { Loading, Message } from 'element-ui'
// 将路由的实例 import 进来
import router from '@/router/index.js'

// 声明一个 loading 变量
let loading = '';

// 添加 请求 拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么

	// 开启loading
	loading = Loading.service({ background: 'rgba(0,0,0,0.3)' });

	// 获取token
	let token = sessionStorage.token;
	// 有 token
	config.headers.Authorization = `Bearer ${token}`;

	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 设置默认 baseURL
axios.defaults.baseURL = 'http://localhost:3003'

// 添加 响应 拦截器
axios.interceptors.response.use(function(response) {
	let { data, status } = response;

	// 关闭 loading
	loading.close();

	//在这里你可以判断后台返回数据携带的请求码

	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
