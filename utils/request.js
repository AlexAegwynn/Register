let baseUrl = "";
// #ifdef MP
baseUrl = "http://127.0.0.1:51813";
// #endif
import store from "@/store"
import common from "./common";

function request(params) {
  params.url = baseUrl + params.url;
  let token = uni.getStorageSync("token");
  // console.log(token)
  if (token) {
    params.header = params.header || {};
    params.header = {
      "Authorization": "Bearer " + token
    }
  }
  return new Promise((resolve, reject) => {
    params.complete = function(res) {
      if (res.statusCode == 200) {
        let resData = res.data;
        if (resData.Code < 0) {
          uni.showModal({
            title: "访问异常",
            content: "异常ID：" + resData.data + "；访问出现异常，请及时向系统管理员汇报，并将此异常ID给管理员。",
            showCancel: false
          })
        } else if(resData.Code==401) {
			common.refreshToken().then(res2 => {
				if (res2.Code == 0) {
					uni.setStorageSync("token", res2.Data.Token);
					uni.setStorageSync("rtoken", res2.Data.RefreshToken);
					params.header = params.header || {};
					params.header = {
					  "Authorization": "Bearer " + res2.Data.Token
					}
					uni.request(params);
				} else {
					uni.clearStorageSync();
					uni.redirectTo({
						url: "@/pages/login/login"
					})
				}
			}).catch(() => {
				uni.clearStorageSync();
				uni.redirectTo({
					url: "@/pages/login/login"
				})
			})
		} else {
          resolve(resData);
        }
        // //code大于1000的是全局错误码
        // if (resData.Code > 0) {
        //   switch (resData.Code) {
        //     case 401:
        //       console.log(resData)
        //       uni.removeStorageSync("token");
        //       let loginInfo = uni.getStorageSync('loginInfo');

        //       api.getToken(loginInfo).then(res => {
        //         console.log(res.Data, 'res')
        //         if (res.Data) {
        //           uni.hideLoading();
        //           uni.setStorage({
        //             key: 'token',
        //             data: res.Data.Token,
        //             success: function() {
        //               console.log('to')
        //               uni.reLaunch({
        //                 url: '../jobBook/index'
        //               });
        //             }
        //           });
        //         } else {
        //           this.msg = res.Msg;
        //           alert(res.Msg);
        //         }
        //       });
        //       console.log('break')
        //       break;
        //     case 1003:
        //       uni.removeStorageSync("token");
        //       uni.showModal({
        //         title: "认证授权失败",
        //         content: resData.message,
        //         showCancel: false,
        //         success() {
        //           let url;
        //           // #ifdef H5
        //           url = window.location.href;
        //           // #endif
        //           // #ifndef H5
        //           let pages = getCurrentPages();
        //           console.log(pages);
        //           url = pages[pages.length - 1].route;
        //           // #endif									
        //           store.dispatch("logout", url);
        //         }
        //       })
        //       break;
        //     case 1002:
        //       uni.showModal({
        //         title: "认证授权失败",
        //         content: resData.message,
        //         showCancel: false
        //       })
        //       break;
        //     case 2001:
        //       uni.showModal({
        //         title: "访问错误",
        //         message: res.message,
        //         showCancel: false
        //       })
        //       break;
        //     case 4001:
        //       uni.showModal({
        //         title: "操作失败",
        //         content: resData.message,
        //         showCancel: false
        //       })
        //       reject(resData);
        //       break;
        //     case 5001:
        //       uni.showModal({
        //         title: "Api接口出错",
        //         content: resData.message,
        //         showCancel: false,
        //         success() {

        //         }
        //       })
        //       break;
        //   }
        // } else if (resData.code < 0) {
        //   uni.showModal({
        //     title: "访问异常",
        //     content: "异常ID：" + resData.data + "；访问出现异常，请及时向系统管理员汇报，并将此异常ID给管理员。",
        //     showCancel: false
        //   })
        // } else {
        //   resolve(resData);
        // }
      } else {
        // console.log(res);
        uni.showModal({
          title: "服务出错",
          content: "服务器出错,请稍候再试",
          showCancel: false
        })
      }
    };
    uni.request(params);
  })
}
export default request;
// module.exports = request;
