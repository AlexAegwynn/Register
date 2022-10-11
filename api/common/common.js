import request from '@/utils/request'
import baseUrl from '@/api/baseUrl'

const BASE_URL = baseUrl + '/Common'
export default {
  getGuid() {
    return request({
      url: BASE_URL + '/GetGuid'
    })
  },
  getHomeStatistic() {
    return request({
      url: BASE_URL + '/GetHomeStatistic',
      method: 'get'
    })
  }  
}