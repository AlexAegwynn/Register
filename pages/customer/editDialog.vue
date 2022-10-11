<template>
  <u-popup :show="show" close-on-click-overlay :round="10" @close="onClose">
    <view class="app-popup">
      <view class="title">添加客户</view>
      <view class="content">
        <u--form ref="form" labelPosition="left" :model="data" :rules="rules">
          <u-form-item label="客户名称" prop="CustomerName" label-width="75px">
            <u-input v-model="data.CustomerName" placeholder="请填写客户名称"></u-input>
          </u-form-item>
        </u--form>
      </view>
      <view class="footer">
        <u-grid :col="2">
          <u-grid-item>
            <view class="btn success" @click="onSave">保 存</view>
          </u-grid-item>
          <u-grid-item>
            <view class="btn danger" @click="onClose">关 闭</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>
  </u-popup>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        data: {
          CustomerId: 0,
          CustomerName: "",
          CreateTime: null
        },
        rules: {
          'CustomerName': {
            type: 'string',
            required: true,
            message: '请填写客户名称',
            trigger: ['blur', 'change']
          },
        },
      }
    },
    onLoad() {},
    computed: {},
    methods: {
      open(data = null) {
        if (data) {
          this.data = {
            ...data
          }
        }
        this.show = true;
      },
      onSave() {
        console.log('onSave');
        this.$refs.form.validate().then(res => {
          if (this.data.CustomerId == 0) {
            this.onInsert();
          } else {
            this.onModify();
          }
        }).catch(err => {
          if (err.length > 0) uni.$u.toast(err[0].message);
          else uni.$u.toast('表单验证不通过');
        })
      },
      onInsert() {
        var fields = [{
          key: "CustomerName",
          value: this.data.CustomerName
        }, {
          key: "CreateTime",
          value: this.$commonJs.getNowDatetimeString()
        }];
        var insert_sql = this.$sqlite.insertSql("BA_Customer", fields);
        console.log('insert_sql', insert_sql);
        this.$sqlite.insert(insert_sql).then(res => {
          this.$emit('save-close');
          this.show = false;
          this.$refs.form.resetFields();
        }).catch(err => {
          uni.$u.toast('保存失败');
        });
      },
      onModify() {
        var fields = [{
          key: "CustomerName",
          value: this.data.CustomerName
        }];
        var where = "CustomerId = " + this.data.CustomerId;
        var modify_sql = this.$sqlite.modifySql("BA_Customer", fields, where);
        console.log('modify_sql', modify_sql);
        this.$sqlite.modify(modify_sql).then(res => {
          this.$emit('save-close');
          this.show = false;
          this.$refs.form.resetFields();
        }).catch(err => {
          uni.$u.toast('保存失败');
        });
      },
      onClose() {
        console.log('onClose');
        this.show = false;
        this.data.CustomerId = 0;
        this.data.CustomerName = "";
        this.data.CreateTime = null;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-popup {
    height: 200px;

    .title {
      line-height: 46px;
      font-size: 16px;
      text-align: center;
      background-color: #ffa45d;
      color: #ffffff;
      border-radius: 10px 10px 0 0;
    }

    .content {
      padding: 10px;
      font-size: 16px;
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
