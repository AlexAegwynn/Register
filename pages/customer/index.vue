<template>
  <view class="app-main">
    <navbar bg-color="#ffa45d" class="tabbar">
      <view slot="center">客户资料</view>
    </navbar>
    <view class="app-content" :style="height">
      <view class="row-item" style="border-bottom: 1px solid #b0b1b3;">
        <view class="value">客户名称</view>
        <view class="action">操作</view>
      </view>
      <scroll-view style="height: calc(100% - 36px);" scroll-y="true">
        <view v-for="(i, key) in data" :key="key" class="row-item">
          <view class="value" @tap.stop="onEdit(i)">{{i.CustomerName}}</view>
          <view class="action" style="color: #F56C6C;">
            <text @tap.stop="onDel(i)">删除</text>
          </view>
        </view>
      </scroll-view>
      <view style="padding: 5px 96px;">
        <u-button text="添加客户" color="#ffa45d" @click="onAdd"></u-button>
      </view>
    </view>
    <tabber ref="tabber" @tab-click="onTabClick"></tabber>
    <u-modal :show="show" @confirm="onConfirm" @cancel="show=false" async-close show-cancel-button button-reverse>
      <view style="font-size: 16px;">确认删除吗？</view>
    </u-modal>
    <edit-dialog ref="editDialog" @save-close="reload" />
  </view>
</template>

<script>
  import editDialog from "./editDialog";
  export default {
    components: {
      editDialog
    },
    data() {
      return {
        data: [],
        isLoad: false,
        more: true,
        show: false,
        current: null
      }
    },
    onLoad() {
      this.reload();
    },
    computed: {
      height() {
        var val = 44 + 51 + this.$store.state.barHeight + 50;
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
        console.log('val', val)
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
            break;
        }
      },
      // onSearch() {
      //   uni.showLoading({
      //     title: '正在搜索...'
      //   })
      //   uni.$u.sleep(1000).then(() => {
      //     uni.hideLoading();
      //     this.reload();
      //   })
      // },
      // scrolltolower() {
      //   if (!this.isLoad && this.more) {
      //     this.isLoad = true;
      //     this.reload();
      //   }
      // },
      reload() {
        uni.showLoading({
          title: '正在加载...'
        })
        this.data = [];
        this.$sqlite.select("SELECT * FROM BA_Customer").then(res => {
          // console.log('res', res);
          uni.hideLoading();
          this.data = res;
        }).catch(err => {
          uni.hideLoading();
        })
      },
      onAdd() {
        this.$refs.editDialog.open();
      },
      onEdit(row) {
        this.$refs.editDialog.open(row);
      },
      onDel(row) {
        // console.log('onDel', row);
        this.show = true;
        this.current = row;
      },
      onConfirm() {
        var sql = "DELETE FROM BA_Customer WHERE CustomerId=" + this.current.CustomerId;
        this.$sqlite.delete(sql).then(res => {
          this.show = false;
          this.reload();
        }).catch(err => {
          console.log('err', err);
          uni.$u.toast('删除失败');
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .row-item {
    padding: 0 15px;
    line-height: 36px;
    font-size: 16px;

    .value {
      display: inline-block;
      width: calc(100% - 50px);
    }

    .action {
      display: inline-block;
      width: 50px;
      text-align: center;
    }
  }

  .row-item+.row-item {
    border-top: 1px solid #dadbde;
  }
</style>
