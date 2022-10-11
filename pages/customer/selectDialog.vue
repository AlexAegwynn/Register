<template>
  <u-popup :show="show" close-on-click-overlay @close="onClose">
    <view class="app-popup" :style="height">
      <view class="title">选择客户</view>
      <view class="content">
        <view class="row-item" style="border-bottom: 1px solid #b0b1b3;">
          <view class="value">客户名称</view>
          <view class="action" v-if="!multiple">操作</view>
        </view>
        <scroll-view style="height: calc(100% - 36px);" scroll-y="true">
          <view v-for="(i, key) in data" :key="key" class="row-item">
            <view class="value">{{i.CustomerName}}</view>
            <view class="action primary" v-if="!multiple">
              <text @tap.stop="onSelect(i)">选择</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="footer">
        <u-grid :col="multiple?2:1">
          <u-grid-item v-if="multiple">
            <view class="btn primary" @click="onMultipleSelect">选 择</view>
          </u-grid-item>
          <u-grid-item>
            <view class="btn" @click="onClose">关 闭</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
  </u-popup>
</template>

<script>
  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        data: [],
      }
    },
    onLoad() {},
    computed: {
      height() {
        var val = this.$store.state.barHeight;
        return "height: calc(100vh - " + val + "px);"
      },
    },
    methods: {
      open() {
        this.reload();
        this.show = true;
      },
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
      onSelect(row) {
        this.$emit('select', row);
        this.show = false;
      },
      onMultipleSelect() {
        // this.$emit('select-multiple', row);
      },
      onClose() {
        // console.log('onClose');
        this.show = false;
        this.data = []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-popup {
    .title {
      line-height: 46px;
      font-size: 16px;
      text-align: center;
      background-color: #ffa45d;
      color: #ffffff;
    }

    .content {
      padding: 10px;
      font-size: 16px;
      height: calc(100% - 116px);

      .row-item {
        padding: 0 10px;
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
    }

    .footer {
      height: 50px;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #e3e3e3;

      .btn {
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        width: 100%;
      }
    }
  }
</style>
