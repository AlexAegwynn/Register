<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">
        <view style="position: absolute;left: 10px;top: 50%;transform: translateY(-50%);">
          <u-icon name="arrow-left" color="#FFFFFF" size="20" @click="leftClick"></u-icon>
        </view>
        <text>查询结果 - 汇总</text>
      </view>
    </navbar>
    <view class="app-content" :style="height">
      <view class="row-item" style="border-bottom: 1px solid #b0b1b3;">
        <view class="row-col first">客户名称</view>
        <view class="row-col">支出小计</view>
        <view class="row-col">收入小计</view>
      </view>
      <scroll-view style="height: calc(100% - 36px);" scroll-y>
        <view v-for="(i, key) in data" :key="key" class="row-item">
          <view class="row-col first">{{i.CustomerName}}</view>
          <view class="row-col">{{i.ExpenseAmount}}</view>
          <view class="row-col">{{i.IncomeAmount}}</view>
        </view>
      </scroll-view>
    </view>
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
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        data: [],
        params: {},
        isLoad: false,
        more: true,
        pageSize: 10,
        pageIndex: 0,
        total: {
          Income: 0, //收入
          Expense: 0, //支出
        }
      }
    },
    onLoad(option) {
      console.log(option)
      if (option.data) {
        this.params = JSON.parse(option.data);
      }
      this.reload();
    },
    computed: {
      height() {
        var val = 44 + 61 + this.$store.state.barHeight;
        return "height: calc(100% - " + val + "px);"
      },
    },
    methods: {
      leftClick() {
        uni.navigateBack({
          delta: 1
        });
      },
      getSql() {
        var sql = "SELECT CustomerName" +
          ", SUM(CASE WHEN CostType=0 THEN Amount ELSE 0 END) IncomeAmount" +
          ", SUM(CASE WHEN CostType=1 THEN Amount ELSE 0 END) ExpenseAmount" +
          " FROM RP_Cost ";
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
        return sql + " GROUP BY CustomerName";
      },
      reload() {
        var select_sql = this.$sqlite.selectSql(this.getSql(), 0, 0);
        uni.showLoading({
          title: '正在加载...'
        })
        this.$sqlite.select(select_sql).then(res => {
          // console.log('reload', res.length, res);
          uni.hideLoading();
          this.data = res;
          this.total.Income = 0;
          this.total.Expense = 0;
          res.forEach(x => {
            this.total.Income += parseFloat(x.IncomeAmount);
            this.total.Expense += parseFloat(x.ExpenseAmount);
          })
        }).catch(err => {
          uni.hideLoading();
          uni.$u.toast('查询失败');
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .row-item {
    display: flex;
    line-height: 40px;
    font-size: 16px;
    padding: 0 10px;

    .row-col {
      text-align: center;
      width: 90px;
    }

    .first {
      text-align: left;
      width: calc(100% - 180px);
    }
  }

  .row-item+.row-item {
    border-top: 1px solid #dadbde;
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
