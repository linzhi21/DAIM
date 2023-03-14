import axios, { type AxiosRequestHeaders, type AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import pinia from '@/stores/index';
import { useUserInfoStore } from '../stores/userInfo';

// 如果是在组件里面使用store对象，那么调用函数不需要传参
// const userInfoStore = useUserInfoStore()
// useUserInfoStore.token

// 如果不是在组件内部使用store对象，需要在调用函数的时候传递pinia
// 否则拿不到对应的store对象数据
// const userInfoStore = useUserInfoStore(pinia)

/* 定义response对象的data接口
约束response.data的类型
*/
interface ResponseData<T> {
	code: number;
	data: T;
	message: string;
}

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: '/mock', // app-dev || /app-prod
	timeout: 50000,
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		let token = useUserInfoStore(pinia).token
		if(token){
			(config.headers as AxiosRequestHeaders).token = token
		}
		return config;
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	/* 约束一下response */
	async (response: AxiosResponse<ResponseData<any>, any>) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code !== 20000 && res.code !== 200) { /* 成功数据的code值为20000/200 */
			// 统一的错误提示
			ElMessage({
				message: (typeof res.data == 'string' && res.data) || res.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			})

			// `token` 过期或者账号已在别处登录
			if (response.status === 401) {
				const storeUserInfo = useUserInfoStore(pinia)
				await storeUserInfo.reset()
				window.location.href = '/' // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => { })
					.catch(() => { })
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return res.data /* 返回成功响应数据中的data属性数据 */
			// 代表后期我们写action的时候，发请求不需要再去判断result.code，拿result.data
			// 而result就是我们要的最终数据
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

export default service;
