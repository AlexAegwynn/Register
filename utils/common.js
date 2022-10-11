import Vue from 'vue'
import qs from "qs";
import commonApi from "@/api/common/common"
import api from '@/api/login/login.js';

export default {
  linkTo(url) {
    uni.navigateTo({
      url: url
    });
  },
  refreshToken(params) {
    return new Promise((resolve, reject) => {
      if (uni.getStorageSync("token") == "") {
        reject({});
        return;
      }
      api.refreshToken({
        Token: uni.getStorageSync("token"),
        RefreshToken: uni.getStorageSync("rtoken"),
      }).then(res => {
        if (res.Data) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  },
  //将arrayBuffer转换为base64图片
  arrayBufferToBase64Img(buffer) {
    let base64;
    // #ifdef H5
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var len = bytes.byteLength, i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = window.btoa(binary);
    // #endif
    // #ifdef MP-WEIXIN
    base64 = uni.arrayBufferToBase64(buffer);
    // #endif
    return "data:image/jpg;base64," + base64;
  },
  //验证字段
  async validateFields(data, rules) {
    for (let ruleKey in rules) {
      let rule = rules[ruleKey];
      rule = rule instanceof Array ? rule : [rule];
      let value = data[ruleKey];
      for (let r of rule) {
        //是否必填
        if (r.required) {
          if (value === undefined || value === null || value === "") {
            uni.showToast({
              title: r.message || `请填写${ruleKey}字段`,
              icon: "none"
            })
            return false
          }
        }
        if (r.validator) {
          // console.log(value);
          // console.log(!await r.validator(value))
          if (!await r.validator(value)) {
            uni.showToast({
              title: r.message || `${ruleKey}字段验证不通过`,
              icon: "none"
            })
            return false
          }
        }
      }
    }
    return true
  },
  getGuid() {
    return commonApi.getGuid().then(res => {
      return res.data;
    })
  },
  //获取分页数据
  getPageContinuityData({
    func,
    params = {},
    data,
    reload = false,
    size = 10
  }) {
    if (typeof(func) != "function") {
      uni.showModal({
        title: "getPageContinuityData方法错误",
        content: "请指定func值（函数）",
        showCancel: false
      })
      return;
    }
    if (!data) {
      uni.showModal({
        title: "getPageContinuityData方法错误",
        content: "请指定data属性",
        showCancel: false
      })
      return;
    }
    params.pageIndex = reload ? 0 : data.length;
    params.pageSize = size;
    params.pageContinuity = true;
    params = this.removeNullKey(params);
    return func(params).then(res => {
      if (reload) {
        data.splice(0);
      }
      res.Data.forEach(item => {
        data.push(item)
      });
      return {
        isEnd: res.Data.length < size
      };
    });
  },
  objToParamsString(obj) {
    return encodeURIComponent(JSON.stringify(obj))
  },
  paramsToObj(str) {
    return JSON.parse(decodeURIComponent(str));
  },
  //将对象转换成url参数字符串
  objToUrlString(obj) {
    return qs.stringify(obj);
  },
  getRows(rows, unit = "记录") {
    if (rows.length == 0) {
      Vue.prototype.$message.warning("请选择" + unit);
      return false;
    }
    return rows;
  },
  getOneRow(rows, unit = "记录") {
    rows = this.getRows(rows, unit);
    if (rows == false) return false;
    if (rows.length > 1) {
      Message.warning("只能选择一个" + unit);
      return false;
    }
    return rows[0];
  },
  getToday() {
    return this.toDateString(new Date());
  },
  convertTextarea(text) {
    text = text || '';
    if (text) {
      text = text.replace(/\r\n/g, "<br>")
      text = text.replace(/\n/g, "<br>")
      //替换所有的空格（中文空格、英文空格都会被替换）
      text = text.replace(/\s/g, "&nbsp;")
    }
    return text
  },
  textareaToHtml(text) {
    text = text || '';
    if (text) {
      text = text.replace(/\r\n/g, "<br>")
      text = text.replace(/\n/g, "<br>")
      //替换所有的空格（中文空格、英文空格都会被替换）
      text = text.replace(/\s/g, "&nbsp;")
    }
    return text
  },
  //
  round(value, point = 2) {
    value = Number(value)
    let a = Math.pow(10, point)
    return Math.round(value * a) / a || 0
  },
  getProgressPercentage(value) {
    value = Number(value) || 0
    if (value > 1) return 100
    return Math.round(value * 100 * 100) / 100 || 0
  },
  //
  getProgress(value) {
    value = Number(value) || 0
    if (value > 1) return 100
    return Math.round(value * 100 * 100) / 100 || 0
  },
  getNowDateString() {
    return this.toDateString(new Date());
  },
  getNowDatetimeString() {
    return this.toDatetimeString(new Date());
  },
  getNowShortDatetimeString() {
    return this.toShortDatetimeString(new Date());
  },
  //根据format格式化日期时间，返回字符串
  toDateStringByFormat(value, format) {
    if (!value) return ''
    return Vue.prototype.$moment(value).format(format);
  },
  //返回YYYY-MM-DD格式的字符串
  toDateString(value) {
    return this.toDateStringByFormat(value, 'YYYY-MM-DD');
  },
  //返回YYYY-MM-DD HH:mm:ss格式的字符串
  toDatetimeString(value) {
    return this.toDateStringByFormat(value, 'YYYY-MM-DD HH:mm:ss');
  },
  //返回YYYY-MM-DD HH:mm格式的字符串
  toShortDatetimeString(value) {
    return this.toDateStringByFormat(value, 'YYYY-MM-DD HH:mm');
  },
  hasUserPath(path) {
    return store.state.user.menus.some((item, index) => {
      return item.fullPath == path
    })
  },
  copyByKey(object, keys) {
    let newObject = {}
    for (let key of keys) {
      newObject[key] = object[key]
    }
    return newObject
  },
  //根据传入的对象，返回一个没有空值的新对象
  removeNullKey(obj) {
    let newObj = {}
    for (let key of Object.keys(obj)) {
      if (obj[key] !== null && obj[key] !== '' && obj[key] !== undefined) {
        newObj[key] = obj[key]
      }
    }
    return newObj
  },
  isNumber(value) {
    let regex = /^\d*\.?\d*$/;
    return regex.test(value);
  },
  //去除传入的值中非数字的字符
  toNumber(data) {
    data = data.toString();
    return data.replace(/^\D*([0-9]\d*\.?\d{0,4})?.*$/, "$1");
  },
  toInt(data) {
    data = data.toString();
    return data.replace(/[^0-9]/ig, "");
  },
  validateRules: {
    et0: (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('必须大于0'))
      } else {
        callback();
      }
    },
    num(rule, value, callback) {
      let regex = /^\d*\.?\d*$/;
      if (regex.test(value)) {
        callback();
      } else {
        callback("请输入数字");
      }
    },
    int(rule, value, callback) {
      let regex = /^\d*$/;
      if (regex.test(value)) {
        callback();
      } else {
        callback("请输入整数");
      }
    }
  },
  toTreeData(data, parentIdKey = "parentId", childrenKey = "children") {
    let rootList = []
    data.forEach((item, index) => {
      if (item[parentIdKey] == null) {
        rootList.push(item)
      }
    })

    function convertTree(treeData) {
      treeData.forEach(d => {
        data.forEach((item, index) => {
          if (item[parentIdKey] && item[parentIdKey] == d.id) {
            if (!d[childrenKey]) d[childrenKey] = []
            d.children.push(item)
          }
        })
        if (d[childrenKey]) convertTree(d[childrenKey])
      })
    }
    convertTree(rootList)
    return rootList
  },
  //传一个文件大小以字节为单位，返回一个对应单位的大小
  getFileSizeText(fileSize) {
    if (fileSize < 1024) {
      return size + " Byte";
    }
    if (fileSize < 1024 * 1024) {
      return this.round(fileSize / 1024, 2) + " Kb";
    }
    if (fileSize < 1024 * 1024 * 1024) {
      return this.round(fileSize / 1024 / 1024, 2) + " Mb";
    }
    return this.round(fileSize / 1024 / 1024 / 1024, 2) + " Gb";
  },

  compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // 该属性在任何一个对象上都不存在
        return 0;
      }

      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }
}
