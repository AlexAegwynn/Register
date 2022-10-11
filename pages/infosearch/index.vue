<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">
        <text>信息查询</text>
        <view @click="onSearch" style="position: absolute;right: 10px;top: 50%;transform: translateY(-50%);">
          <u-icon name="search" color="#FFFFFF" size="30"></u-icon>
        </view>
      </view>
    </navbar>
    <view class="app-content" :style="height">
      <scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="scrolltolower">
        <view v-for="(i, key) in data" :key="key">
          <view class="row-item">
            <view class="row-cell">
              <view>客户名称</view>
              <view>{{i.CustomerName}}</view>
            </view>
            <view class="row-cell">
              <view>费用类型</view>
              <view>{{i.CostType==0?"收入":"支出"}}</view>
            </view>
            <view class="row-cell">
              <view>费用金额</view>
              <view>{{i.Amount}}</view>
            </view>
            <view class="row-cell">
              <view>费用日期</view>
              <view>{{i.CostDate}}</view>
            </view>
            <view class="row-cell">
              <view>备注</view>
              <view>{{i.Remark}}</view>
            </view>
            <view style="height: 5px;"></view>
            <view class="action">
              <u-button class="del-btn" text="删除" color="#F56C6C" @click="onDel(i)"></u-button>
            </view>
          </view>
          <u-gap height="10px" bgColor="#f2f3f3"></u-gap>
        </view>
      </scroll-view>
    </view>
    <tabber ref="tabber" @tab-click="onTabClick"></tabber>
    <u-modal :show="show" @confirm="onConfirm" @cancel="show=false" async-close show-cancel-button button-reverse>
      <view style="font-size: 16px;">确认删除吗？</view>
    </u-modal>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        isLoad: false,
        more: true,
        show: false,
        current: null,
        pageSize: 10,
        pageIndex: 0,
      }
    },
    onLoad() {
      this.loadmore()
    },
    computed: {
      height() {
        var val = 44 + 51 + this.$store.state.barHeight;
        return "height: calc(100% - " + val + "px);"
      },
      tabIndex() {
        return this.$store.state.tabIndex;
      }
    },
    watch: {
      show(val) {
        if (val == false) this.current = null
      }
    },
    methods: {
      onTabClick(val) {
        this.$store.dispatch("setTabIndex", val);
        switch (this.tabIndex) {
          case 0:
            uni.redirectTo({
              url: '/pages/index/index'
            });
            break;
          case 1:
            break;
          case 2:
            uni.redirectTo({
              url: '/pages/customer/index'
            });
            break;
        }
      },
      onDel(row) {
        this.show = true;
        this.current = row;
      },
      onConfirm() {
        var sql = "DELETE FROM RP_Cost WHERE CostId=" + this.current.CostId;
        this.$sqlite.delete(sql).then(res => {
          this.show = false;
          this.pageIndex = 0;
          this.more = true;
          this.data = [];
          this.loadmore();
        }).catch(err => {
          console.log('err', err);
          uni.$u.toast('删除失败');
        });
      },
      onSearch() {
        uni.navigateTo({
          url: '/pages/infosearch/search'
        });
      },
      scrolltolower() {
        if (!this.isLoad && this.more) {
          this.isLoad = true;
          this.loadmore();
        }
      },
      loadmore() {
        uni.showLoading({
          title: '正在加载...'
        })
        var select_sql = this.$sqlite.selectSql("SELECT * FROM RP_Cost", this.pageSize, this.pageIndex);
        this.$sqlite.select(select_sql).then(res => {
          // console.log('res', res.length, res);
          uni.hideLoading();
          res.forEach(x => this.data.push(x));
          this.pageIndex++;
          this.isLoad = false;
          if (res.length == 0 || res.length != this.pageSize) this.more = false;
        }).catch(err => {
          uni.hideLoading();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .row-item {
    padding: 0 15px;
    line-height: 36px;
    font-size: 16px;

    .row-cell {
      display: flex;
      line-height: 30px;
      justify-content: space-between;
    }

    .action {
      border-top: 1px solid #dadbde;
      padding: 5px 0;

      .del-btn {
        width: 60px;
        height: 28px;
        margin-right: 0px;
      }
    }
  }
</style>
