<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">添加登记信息</view>
    </navbar>
    <view class="app-content" :style="height">
      <u-cell-group :border="false">
        <u-cell class="cell-item">
          <view slot="title" class="item-title">客户名称</view>
          <view slot="value" class="item-value" @tap.stop="openCustomer">
            <text v-if="data.CustomerName">{{data.CustomerName}}</text>
            <text v-else style="color: #c0c4cc;">选择客户</text>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title">费用类型</view>
          <view slot="value" class="item-value">
            <select-picker ref="select" v-model="data.CostType" :options="CostTypes" placeholder="请选择类型" />
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title">费用金额</view>
          <view slot="value" class="item-value">
            <u-input type="number" v-model="data.Amount" placeholder="请填写金额"></u-input>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title">费用日期</view>
          <view slot="value" class="item-value">
            <date-picker v-model="data.CostDate" placeholder="请选择日期"></date-picker>
          </view>
        </u-cell>
        <u-cell class="cell-item">
          <view slot="title" class="item-title">备注</view>
          <view slot="value" class="item-value">
            <u-textarea v-model="data.Remark" placeholder="请输入备注" count></u-textarea>
          </view>
        </u-cell>
      </u-cell-group>
    </view>
    <view style="padding: 5px 96px;">
      <u-button text="保 存" color="#ffa45d" @click="onSave"></u-button>
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
          CostId: 0,
          CustomerId: null,
          CustomerName: "",
          CostType: null,
          Amount: null,
          CostDate: this.$commonJs.getToday(),
          Remark: ""
        },
        CostTypes: [
          [{
            id: 0,
            name: '收入'
          }, {
            id: 1,
            name: '支出'
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
      onTabClick(val) {
        this.$store.dispatch("setTabIndex", val);
        switch (this.tabIndex) {
          case 0:
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
        console.log('openCustomer');
        this.$refs.customerDialog.open();
      },
      setCustomer(data) {
        console.log('setCustomer', data);
        this.data.CustomerId = data.CustomerId;
        this.data.CustomerName = data.CustomerName
      },
      onSave() {
        console.log('onSave', JSON.parse(JSON.stringify(this.data)));

        if (this.data.CustomerId == null) {
          uni.$u.toast('请选择客户');
          return;
        }

        if (this.data.CostType == null) {
          uni.$u.toast('请选择费用类型');
          return;
        }

        if (this.data.Amount == null || this.data.Amount == "") {
          uni.$u.toast('费用金额不能为空');
          return;
        }

        uni.showLoading({
          title: '正在保存...'
        });

        var fields = [];
        for (let key in this.data) {
          if (key == "CostId") continue;
          fields.push({
            key: key,
            value: this.data[key]
          })
        }

        var insert_sql = this.$sqlite.insertSql("RP_Cost", fields);
        console.log('insert_sql', insert_sql);
        this.$sqlite.insert(insert_sql).then(res => {
          uni.$u.toast('保存成功');
          this.data.CostId = 0;
          this.data.CustomerId = null;
          this.data.CustomerName = "";
          this.data.CostType = null;
          this.data.Amount = null;
          this.data.CostDate = this.$commonJs.getToday();
          this.data.Remark = "";
          this.$refs.select.clearLabel();
        }).catch(err => {
          console.log('err', err);
          uni.$u.toast('保存失败');
        });
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>
