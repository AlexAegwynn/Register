import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/User'
export default {
  // 登录
  login(data) {
    return request({
      url: BASE_URL + '/Login',
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
  logout() {
    return request({
      url: BASE_URL + '/Logout',
      method: 'post',
      data: {}
    })
  },
  refreshToken(data) {
    return request({
      url: BASE_URL + '/RefreshToken',
      method: 'post',
      data,
    })
  },
  getWorkbench() {
	  return request({
		  url: BASE_URL + '/GetWorkbench',
		  method: 'get',
		  data: {}
	  })
  },
}
