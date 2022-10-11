import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Article'
const BASE_URL2 = baseUrl + '/User'
export default {
	list(data) {
		return request({
			url: BASE_URL2 + '/GetPageArticles',
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
}
