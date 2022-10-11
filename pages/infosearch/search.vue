<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">
        <view style="position: absolute;left: 10px;top: 50%;transform: translateY(-50%);">
          <u-icon name="arrow-left" color="#FFFFFF" size="20" @click="leftClick"></u-icon>
        </view>
        <text>查询条件</text>
      </view>
    </navbar>
    <view class="app-content" :style="height">
      <u-cell-group :border="false">
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">查询类型</view>
          <view slot="value" class="item-value">
            <select-picker ref="select1" v-model="SearchType" :options="SearchTypes" placeholder="请选择类型" />
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">客户名称</view>
          <view slot="value" class="item-value" @tap.stop="openCustomer">
            <text v-if="data.CustomerName">{{data.CustomerName}}</text>
            <text v-else style="color: #c0c4cc;">选择客户</text>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">费用类型</view>
          <view slot="value" class="item-value">
            <select-picker ref="select2" v-model="data.CostType" :options="CostTypes" placeholder="请选择类型" />
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">费用日期起始</view>
          <view slot="value" class="item-value">
            <date-picker v-model="data.DateStart" placeholder="请选择日期"></date-picker>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">费用日期截止</view>
          <view slot="value" class="item-value">
            <date-picker v-model="data.DateEnd" placeholder="请选择日期"></date-picker>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title" style="width: 100px;">备注</view>
          <view slot="value" class="item-value">
            <u-input v-model="data.Remark" placeholder="请填写备注"></u-input>
          </view>
        </u-cell>
      </u-cell-group>
      <view style="line-height: 50px;padding-left: 15px;">
        <view style="display: inline-block;margin-right: 20px;">
          <u--text type="primary" text="本周" @click="setDate('本周')"></u--text>
        </view>
        <view style="display: inline-block;margin-right: 20px;">
          <u--text type="primary" text="本月" @click="setDate('本月')"></u--text>
        </view>
        <view style="display: inline-block;margin-right: 20px;">
          <u--text type="primary" text="本季度" @click="setDate('本季度')"></u--text>
        </view>
      </view>
    </view>
    <view style="padding: 5px 96px;">
      <u-button text="查 询" color="#ffa45d" @click="onSearch"></u-button>
    </view>
    <tabber @tab-click="onTabClick"></tabber>
    <customer-dialog ref="customerDialog" @select="setCustomer" />
  </view>
</template>

<script>
  import customerDialog from "@/pages/customer/selectDialog"
  export default {
    components: {
      customerDialog
    },
    data() {
      return {
        data: {
          CustomerId: null,
          CustomerName: "",
          CostType: null,
          DateStart: this.$commonJs.getToday(),
          DateEnd: this.$commonJs.getToday(),
          Remark: ""
        },
        SearchType: 0,
        CostTypes: [
          [{
            id: null,
            name: ''
          }, {
            id: 0,
            name: '收入'
          }, {
            id: 1,
            name: '支出'
          }]
        ],
        SearchTypes: [
          [{
            id: 0,
            name: '明细'
          }, {
            id: 1,
            name: '汇总'
          }]
        ],
      }
    },
    computed: {
      height() {
        var val = 44 + 50 + this.$store.state.barHeight + 51;
        return "height: calc(100% - " + val + "px);"
      },
      tabIndex() {
        return this.$store.state.tabIndex;
      }
    },
    onLoad() {
      // console.log('onLoad', this.tabIndex)
    },
    methods: {
      leftClick() {
        uni.navigateBack({
          delta: 1
        });
      },
      onTabClick(val) {
        this.$store.dispatch("setTabIndex", val);
        switch (this.tabIndex) {
          case 0:
            uni.redirectTo({
              url: '/pages/index/index'
            });
            break;
          case 1:
            uni.redirectTo({
              url: '/pages/infosearch/index'
            });
            break;
          case 2:
            uni.redirectTo({
              url: '/pages/customer/index'
            });
            break;
        }
      },
      openCustomer() {
        // console.log('openCustomer');
        this.$refs.customerDialog.open();
      },
      setCustomer(data) {
        // console.log('setCustomer', data);
        this.data.CustomerId = data.CustomerId;
        this.data.CustomerName = data.CustomerName
      },
      onSearch() {
        // console.log('onSave', JSON.parse(JSON.stringify(this.data)));
        var params = this.$commonJs.removeNullKey(this.data);
        if (this.SearchType == 0) {
          uni.navigateTo({
            url: '/pages/infosearch/details?data=' + JSON.stringify(params)
          });
        } else {
          uni.navigateTo({
            url: '/pages/infosearch/summary?data=' + JSON.stringify(params)
          });
        }
      },
      setDate(type) {
        var now_date = new Date();
        if (type == "本周") {
          var start = this.$dayjs(now_date).startOf("week").format('YYYY-MM-DD');
          this.data.DateStart = start;
          var end = this.$dayjs(now_date).endOf("week").format('YYYY-MM-DD');
          this.data.DateEnd = end;
        }
        if (type == "本月") {
          var start = this.$dayjs(now_date).startOf("month").format('YYYY-MM-DD');
          this.data.DateStart = start;
          var end = this.$dayjs(now_date).endOf("month").format('YYYY-MM-DD');
          this.data.DateEnd = end;
        }
        if (type == "本季度") {
          var start = this.$dayjs(now_date).startOf("quarter").format("YYYY-MM-DD");
          this.data.DateStart = start;
          var end = this.$dayjs(now_date).endOf("quarter").format('YYYY-MM-DD');
          this.data.DateEnd = end;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
