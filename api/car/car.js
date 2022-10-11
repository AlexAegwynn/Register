import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Car';
const BASE_URL2 = baseUrl + '/LocationInfo';
export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data: {...data, Status:3, Scrap: false}
		})
	},
	info(id) {
		return request({
			url: BASE_URL + '/Info',
			method: 'get',
			data: {id}
		})
	},
	getLastLocationInfo(carId) {
		return request({
			url: BASE_URL2 + '/GetLastLocationInfo',
			method: 'get',
			data: {carId}
		})
	},
}
