import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/LocationInfo'
export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data
		})
	},
	getLastLocation(carId) {
		return request({
			url: BASE_URL + '/GetLastLocationInfo',
			method: 'get',
			data: { carId }
		})
	},
}
