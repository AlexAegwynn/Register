import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Student'
const BASE_URL2 = baseUrl + '/TrainHour'
const BASE_URL3 = baseUrl + '/TrainLog'
const BASE_URL4 = baseUrl + '/TrainLogPic'
const BASE_URL5 = baseUrl + '/TheoryLog'

export default {
	list(data) {
		return request({
			url: BASE_URL + '/List',
			method: 'post',
			data: {...data, Status:3}
		})
	},
	info(id) {
		return request({
			url: BASE_URL + '/Info',
			method: 'get',
			data: {id}
		})
	},
	trainList(StudentId) {
		return request({
			url: BASE_URL2 + '/List',
			method: 'post',
			data: { StudentId }
		})
	},
	getTrainList(data) {
		return request({
			url: BASE_URL3 + '/List',
			method: 'post',
			data
		})
	},
	getTrainLogStat(data) {
		return request({
			url: BASE_URL3 + '/GetTrainLogStat',
			method: 'post',
			data
		})
	},
	getLogs(data) {
		return request({
			url: BASE_URL2 + '/GetLogs',
			method: 'post',
			data
		})
	},
	getLogPics(TrainLogId) {
		return request({
			url: BASE_URL4 + '/List',
			method: 'post',
			data: {TrainLogId}
		})
	},
	theoryLogList(data) {
		return request({
			url: BASE_URL5 + '/List',
			method: 'post',
			data
		})
	},
}
