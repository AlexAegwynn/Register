import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Data'
const BASE_URL2 = baseUrl + '/ClassType'
export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data
		})
	},
	info(id) {
		return request({
			url: BASE_URL + '/Info',
			method: 'get',
			data: {id}
		})
	},
	classTypeList(data) {
		return request({
			url: BASE_URL2 + '/List',
			method: 'post',
			data
		})
	},
}
