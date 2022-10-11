import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Dp'
const BASE_URL2 = baseUrl + '/TeachArea'
export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data: {...data,Status:3}
		})
	},
	areaList(data) {
		return request({
			url: BASE_URL2 + '/List',
			method: 'post',
			data: {...data,Status:3}
		})
	},
	info(id) {
		return request({
			url: BASE_URL + '/Info',
			method: 'get',
			data: {id}
		})
	},
	areaInfo(id) {
		return request({
			url: BASE_URL2 + '/Info',
			method: 'get',
			data: {id}
		})
	},
	getTreeList(data) {
		return request({
			url: BASE_URL + '/GetTreeList',
			method: 'post',
			data: {...data, Status: 3}
		})
	},
}
