import Vue from 'vue'
import Vuex from 'vuex'
import authApi from "@/api/common/auth.js"
import commonJs from "@/utils/common";
import api from "@/api/setting/setting.js";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userId: null,
    userName: "",
    employeeId: null,
    barHeight: 0,
    tabIndex: 0,
    permissionMenus: [],
	// baseUrl: "http://localhost:19202",
	baseUrl: "http://121.37.25.30:1083/api",
	baseUrl2: "http://121.37.25.30:1083",
  },
  getters: {
    hasIdentityInfo: state => {
      return state.userId != null;
    }
  },
  mutations: {
    SET_USER_ID(state, userId) {
      state.userId = userId
    },
    SET_USER_NAME(state, userName) {
      state.userName = userName
    },
    SET_EMPLOYEE_ID(state, employeeId) {
      state.employeeId = employeeId
    },
    SET_TAB_INDEX(state, tabIndex) {
      state.tabIndex = tabIndex
    },
    SET_BAR_HEIGHT(state, barHeight) {
      state.barHeight = barHeight
    },
    SET_PERMISSION_MENUS(state, permissionMenus) {
      state.permissionMenus = permissionMenus;
    }
  },
  actions: {
    setTabIndex({
      commit
    }, index) {
      commit("SET_TAB_INDEX", index);
    },
    setBarHeight({
      commit
    }, height) {
      commit("SET_BAR_HEIGHT", height);
    },
	getSetting() {
		return new Promise((resolve, reject) => {
			api.getMySetting().then((res) => {
				if(res.Code==0&&!res.Data) {
					res.Data = {};
				}
			  resolve(res);
			});
	    });
	},
    logout({
      commit
    }, path) {
      uni.removeStorageSync("token");
      commit("SET_USER_ID", null);
      commit("SET_USER_NAME", "");
      commit("SET_EMPLOYEE_ID", "");
      commit("SET_TAB_INDEX", 0);
      commit("SET_PERMISSION_MENUS", []);
      // uni.redirectTo({
      //   url: "/pages/auth/login"
      // })
    },
    getIdentityInfo({
      commit,
      dispatch
    }) {
      return new Promise((resolve, reject) => {
        authApi.getIdentityInfo().then(res => {
          commit('SET_USER_ID', res.data.userId);
          commit('SET_USER_NAME', res.data.userName);
          commit("SET_EMPLOYEE_ID", res.data.employeeId);
          let permissionMenus = res.data.permissionMenus;

          function buildFullPath(menu) {
            permissionMenus.forEach((m, i) => {
              if (m.parentId == menu.id) {
                m.fullPath = menu.fullPath + '/' + m.path;
                m.permissionPath = (menu.permissionPath ? (menu.permissionPath + '.') : "") + m.path;
                buildFullPath(m);
              }
            })
          }
          buildFullPath({
            id: null,
            fullPath: "",
            permissionPath: ""
          });
          commit('SET_PERMISSION_MENUS', permissionMenus);
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})
export default store;
