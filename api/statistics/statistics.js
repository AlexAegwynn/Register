import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/ComplexStatistic'
const BASE_URL2 = baseUrl + '/CarStatistic'
const BASE_URL3 = baseUrl + '/CoachStatistic'
const BASE_URL4 = baseUrl + '/ChargeStatistic'
export default {
	monthList(data) {
		return request({
			url: BASE_URL + '/MonthList',
			method: 'post',
			data
		})
	},
	carMonthList(data) {
		return request({
			url: BASE_URL2 + '/MonthList',
			method: 'post',
			data
		})
	},
	trainMonthList(data) {
		return request({
			url: BASE_URL2 + '/TrainMonthList',
			method: 'post',
			data
		})
	},
	coachMonthList(data) {
		return request({
			url: BASE_URL3 + '/MonthList',
			method: 'post',
			data
		})
	},
	hourMonthList(data) {
		return request({
			url: BASE_URL4 + '/HourMonthList',
			method: 'post',
			data
		})
	},
	chargeMonthList(data) {
		return request({
			url: BASE_URL4 + '/MonthList',
			method: 'post',
			data
		})
	},
}
