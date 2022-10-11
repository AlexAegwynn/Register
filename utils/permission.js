import store from "@/store/index.js";
export default {
	//当不传path参数时，path为当前路由值
	//是否有读权限
	canRead(path = null) {
		return this.can("canRead", path);
	},
	//是否有写权限
	canWrite(path = null) {
		return this.can("canWrite", path);
	},
	//是否有审核权限
	canReview(path = null) {
		return this.can("canReview", path);
	},
	//是否为自己的数据（type用于确定是否商机业务员）
	isMine(id, type = null) {
		if (type) {
			return store.state.employeeId == id;
		}
		return store.state.userId == id;
	},
	can(action, path = null) {
		if (!path) {
			let pages = getCurrentPages();
			if (pages.length > 0) {
				path = pages[pages.length - 1].route;
				console.log(path);
			}
		}
		return store.state.permissionMenus.some(item => {
			if (item.fullPath == path || item.permissionPath == path) {
				return item[action] || false;
			}
		})
	},
	//是否有某个菜单
	hasMenu(path) {
		return store.state.permissionMenus.some(item => item.fullPath == path || item.permissionPath == path);
	}
}
