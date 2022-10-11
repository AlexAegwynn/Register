<template>
  <view>
    <view @click="open">
      <u-input v-model="val" style="height: 18px;" disabled disabledColor="#ffffff" :placeholder="placeholder" />
    </view>
    <u-datetime-picker :show="show" :mode="mode" v-model="text" @confirm="onConfirm" @close="onClose"
      confirmColor="orange" @cancel="show = false" closeOnClickOverlay />
  </view>
</template>

<script>
  export default {
    props: {
      value: {},
      //date为日期选择，time为时间选择，year-month为年月选择
      mode: {
        type: String,
        default: "date"
      },
      placeholder: {
        type: String,
        default: "请选择"
      }
    },
    watch: {
      value(e) {
        this.$nextTick(() => {
          if (!e) {
            this.val = null;
            this.text = "";
          } else {
            this.val = e;
            this.text = e;
          }
        })
      }
    },
    data() {
      return {
        show: false,
        val: null,
        text: ""
      }
    },
    mounted() {
      if (this.value != null) {
        this.val = this.value;
      }
    },
    methods: {
      open() {
        this.show = true;
        switch (this.mode) {
          case "date":
            if (!this.text) this.text = Number(new Date());
            break;
          case "time":
            if (!this.text) this.text = '00:00';
            break;
          case "year-month":
            if (!this.text) this.text = uni.$u.timeFormat(new Date(), 'yyyy-mm');
            break;
        }
      },
      onConfirm(e) {
        console.log('confirm', e)
        switch (this.mode) {
          case "date":
            this.val = this.$dayjs(new Date(e.value)).format('YYYY-MM-DD');
            break;
          case "time":
            this.val = e.value;
            break;
          case "year-month":
            this.val = this.$dayjs(new Date(e.value)).format('YYYY-MM');
            // this.val = uni.$u.timeFormat(e.value, 'yyyy-mm');
            break;
        }
        this.$emit('input', this.val);
        this.$emit('change', e);
        this.show = false;
      },
      onClose() {
        this.show = false;
      },
    }
  }
</script>

<style>

</style>
