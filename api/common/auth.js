import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'
const BASE_URL = baseUrl + '/Identity'
export default {
  qywxAuthUrl: baseUrl + '/wx/a',
  login(data) {
    return request({
      url: BASE_URL + '/Login',
      method: 'POST',
      data
    })
  },
  getIdentityInfo() {
    return request({
      url: BASE_URL + '/GetIdentityInfo',
    })
  }
}