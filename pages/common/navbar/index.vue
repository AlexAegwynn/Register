<template>
  <view>
    <!-- 2.0.19支持autoBack，默认为false -->
    <u-navbar fixed placeholder :bgColor="bgColor">
      <view style="margin: 0px 5px;" slot="left">
        <slot name="left"></slot>
      </view>
      <view style="width: 100%;" slot="center">
        <slot name="center">{{title}}</slot>
      </view>
      <view style="margin: 0px 5px;" slot="right">
        <slot name="right"></slot>
      </view>
    </u-navbar>
  </view>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: "",
      },
      bgColor:{
        type: String,
        default: "",
      }
    },
    data() {
      return {

      }
    },
    methods: {}
  }
</script>
