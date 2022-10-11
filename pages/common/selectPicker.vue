<template>
  <view>
    <view @click="open">
      <u-input v-model="label" style="height: 18px;" :inputAlign="align" :border="border" disabled
        disabledColor="#ffffff" :placeholder="placeholder" />
    </view>
    <u-picker :show="show" :columns="options" @confirm="onConfirm" @close="show=false" @cancel="show=false"
      confirmColor="orange" :keyName="labelKey" closeOnClickOverlay />
  </view>
</template>

<script>
  export default {
    props: {
      value: {},
      disabled: {
        type: Boolean,
        default: false
      },
      align: {
        type: String,
        default: "left"
      },
      border: {
        type: String,
        default: "surround"
      },
      placeholder: {
        type: String,
        default: "请选择"
      },
      labelKey: {
        default: "name"
      },
      valueKey: {
        default: "id"
      },
      options: {
        default: () => []
      }
    },
    mounted() {
      if (this.value != null) {
        this.setValue(this.value);
      }
    },
    watch: {
      value(e) {
        this.setValue(e);
      }
    },
    data() {
      return {
        show: false,
        val: null,
        label: "",
      }
    },
    methods: {
      open() {
        this.show = true;
      },
      onConfirm(e) {
        this.$emit('input', e.value[0][this.valueKey]);
        this.show = false;
      },
      setValue(value) {
        this.$nextTick(() => {
          var item = this.options[0].find(x => x[this.valueKey] == value);
          if (item) {
            this.val = item[this.valueKey];
            this.label = item[this.labelKey];
          }
        })
      },
      clearLabel() {
        this.label = "";
      }
    }
  }
</script>

<style>
</style>
