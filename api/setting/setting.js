import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Setting'
export default {
	getMySetting(id) {
		return request({
			url: BASE_URL + '/GetMySetting',
			method: 'get',
			data: {}
		})
	},
}
