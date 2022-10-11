import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Coach'
export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data: {...data, Status:3, CoachType:0}
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
