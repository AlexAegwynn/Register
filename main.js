import Vue from 'vue';
import App from './App';

import store from "./store";

import common from "./utils/common.js"
Vue.prototype.$commonJs = common;

import sqlite from "@/utils/sqlite";
Vue.prototype.$sqlite = sqlite;


import moment from 'moment';
Vue.prototype.$moment = moment;

import uView from '@/uni_modules/uview-ui';
Vue.use(uView);

import './plugins/dayjs'

import navbar from '@/pages/common/navbar/index'
Vue.component('navbar', navbar)
import tabber from '@/pages/common/tabber/index'
Vue.component('tabber', tabber)
import datePicker from '@/pages/common/datePicker'
Vue.component('date-picker', datePicker)
import selectPicker from '@/pages/common/selectPicker'
Vue.component('select-picker', selectPicker)
import calendarPicker from '@/pages/common/calendarPicker'
Vue.component('calendar-picker', calendarPicker)
// import qqMap from '@/pages/common/qqMap'
// Vue.component('qq-map', qqMap)
// import qqMapTrack from '@/pages/common/qqMapTrack'
// Vue.component('qq-map-track', qqMapTrack)

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});
app.$mount();
