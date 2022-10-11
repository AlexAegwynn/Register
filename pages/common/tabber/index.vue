<template>
  <u-tabbar activeColor="#FF9933" :value="value" fixed placeholder safeAreaInsetBottom>
    <u-tabbar-item text="信息登记" @click="onClick">
      <image class="u-page__item__slot-icon" slot="active-icon" src="/static/nav1_cur.png"></image>
      <image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/nav1.png"></image>
    </u-tabbar-item>
    <u-tabbar-item text="信息查询" @click="onClick">
      <image class="u-page__item__slot-icon" slot="active-icon" src="/static/nav2_cur.png"></image>
      <image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/nav2.png"></image>
    </u-tabbar-item>
    <u-tabbar-item text="客户资料" @click="onClick">
      <image class="u-page__item__slot-icon" slot="active-icon" src="/static/nav3_cur.png"></image>
      <image class="u-page__item__slot-icon" slot="inactive-icon" src="/static/nav3.png"></image>
    </u-tabbar-item>
  </u-tabbar>
</template>

<script>
  export default {
    data() {
      return {
        value: this.$store.state.tabIndex
      }
    },
    methods: {
      onClick(val) {
        this.$emit('tab-click', val)
        this.value = this.$store.state.tabIndex;
      },
      setValue(val) {
        this.value = val;
      }
    }
  }
</script>

<style>
  .u-page__item__slot-icon {
    height: 28px;
    width: 28px;
  }
</style>
