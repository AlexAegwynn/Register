import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.locale('zh-cn');

//QuarterOfYear 增加了 .quarter() API 返回当前实例是哪个季度，
//并扩展了 .add .subtract .startOf .endOf API 来支持 quarter 季度单位。
dayjs.extend(quarterOfYear);
Object.defineProperty(Vue.prototype, '$dayjs', { value: dayjs })