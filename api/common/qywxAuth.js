import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/QywxAuth'
export default {
	getTokenByCode(code) {
		return request({
			url: BASE_URL + '/GetTokenByCode',
			data: {
				code
			}
		})
	},
	getQywxAuthUrl(redirectUrl,state) {
		return request({
			url: BASE_URL + '/GetQywxAuthUrl',
			data: {
				redirectUrl,
				state
			}
		})
	},
	getJssdkConfig(url) {
		return request({
			url: BASE_URL + '/GetJssdkConfig',
			data: {
				url
			}
		})
	}
}
