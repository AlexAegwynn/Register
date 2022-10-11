<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">
        <view style="position: absolute;left: 10px;top: 50%;transform: translateY(-50%);">
          <u-icon name="arrow-left" color="#FFFFFF" size="20" @click="leftClick"></u-icon>
        </view>
        <text>查询结果 - 明细</text>
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
      <view class="footer">
        <u-grid :col="2" border>
          <u-grid-item class="footer-item">
            <view class="title">支出合计</view>
            <view class="amount">{{total.Expense}}</view>
          </u-grid-item>
          <u-grid-item class="footer-item">
            <view class="title">收入合计</view>
            <view class="amount">{{total.Income}}</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
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
        params: {},
        isLoad: false,
        more: true,
        show: false,
        current: null,
        pageSize: 10,
        pageIndex: 0,
        total: {
          Income: 0, //收入
          Expense: 0, //支出
        }
      }
    },
    onLoad(option) {
      if (option.data) {
        console.log(option.data);
        this.params = JSON.parse(option.data);
      }
      this.loadmore();
      this.getTotal();
    },
    computed: {
      height() {
        var val = 44 + 61 + this.$store.state.barHeight;
        return "height: calc(100% - " + val + "px);"
      },
    },
    watch: {
      show(val) {
        if (val == false) this.current = null
      }
    },
    methods: {
      leftClick() {
        uni.navigateBack({
          delta: 1
        });
      },
      onDel(row) {
        // console.log('onDel', row);
        this.show = true;
        this.current = row;
      },
      onConfirm() {
        console.log('确认');
        var sql = "DELETE FROM RP_Cost WHERE CostId=" + this.current.CostId;
        this.$sqlite.delete(sql).then(res => {
          this.show = false;
          this.pageIndex = 0;
          this.more = true;
          this.data = [];
          this.loadmore();
          this.getTotal();
        }).catch(err => {
          console.log('err', err);
          uni.$u.toast('删除失败');
        });
      },
      scrolltolower() {
        if (!this.isLoad && this.more) {
          this.isLoad = true;
          this.loadmore();
        }
      },
      getSql() {
        var sql = "SELECT * FROM RP_Cost ";
        var where_list = [];

        if (this.params.CustomerId) {
          where_list.push("CustomerId=" + this.params.CustomerId);
        }
        if (this.params.CostType != undefined) {
          where_list.push("CostType=" + this.params.CostType);
        }
        if (this.params.Remark != undefined) {
          where_list.push("Remark LIKE '%" + this.params.Remark + "%'");
        }
        if (this.params.DateStart) {
          where_list.push("CostDate>='" + this.params.DateStart + "'");
        }
        if (this.params.DateEnd) {
          var end = this.$dayjs(this.params.DateEnd).add(1, 'day').format('YYYY-MM-DD');
          where_list.push("CostDate<'" + end + "'");
        }

        sql += "WHERE " + where_list.join(" AND ");
        return sql;
      },
      loadmore() {
        var select_page_sql = this.$sqlite.selectSql(this.getSql(), this.pageSize, this.pageIndex);
        // console.log('select_page_sql', select_page_sql);

        uni.showLoading({
          title: '正在加载...'
        })
        this.$sqlite.select(select_page_sql).then(res => {
          // console.log('res', res.length, res);
          uni.hideLoading();
          res.forEach(x => this.data.push(x));
          this.pageIndex++;
          this.isLoad = false;
          if (res.length == 0 || res.length != this.pageSize) this.more = false;
        }).catch(err => {
          uni.hideLoading();
        });
      },
      getTotal() {
        var select_sql = this.$sqlite.selectSql(this.getSql(), 0, 0);
        // console.log('select_sql', select_sql);
        this.$sqlite.select(select_sql).then(res => {
          // console.log('res', res);
          this.total.Income = 0;
          this.total.Expense = 0;
          var i = res.filter(x => x.CostType == 0);
          var e = res.filter(x => x.CostType == 1);
          i.forEach(x => {
            this.total.Income += parseFloat(x.Amount)
          })
          e.forEach(x => {
            this.total.Expense += parseFloat(x.Amount)
          })
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

  .footer {
    height: 55px;
    padding-top: 5px;
    border-top: 1px solid #f2f3f3;

    .footer-item {
      height: 50px;

      .title {
        font-size: 14px;
        color: #8d8d8d;
      }

      .amount {
        font-size: 16px;
        font-weight: 400;
        color: #ffa45d;
      }
    }
  }
</style>
