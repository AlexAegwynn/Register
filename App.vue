<style lang="scss">
  /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
  @import "@/uni_modules/uview-ui/index.scss";
  @import "@/styles/layout.scss";
  @import "@/styles/index.scss";
  @import "@/styles/wap.css";
</style>
<script>
  import commonJs from '@/utils/common.js';
  export default {
    onLaunch: function() {
      console.log('App Launch');
      let res = uni.getSystemInfoSync(); // 获取系统信息
      if (res) {
        console.log('手机系统信息', res);
        console.log('手机状态栏高度', res.statusBarHeight);
        this.$store.dispatch("setBarHeight", res.statusBarHeight);
      }
      
      
      // console.log('sqlite', sqlite);
      var open = this.$sqlite.isOpen();
      console.log('是否打开', open)
      if (!open) this.$sqlite.openSqlite();

      //判断是否有用户表，没有就创建表
      this.$sqlite.hasTabel("SY_User").then(res => {
        console.log('是否新建 SY_User 表', res[0].count == 0);
        var insert_sql = this.$sqlite.insertSql("SY_User", [{
          key: "LoginId",
          value: "admin"
        }, {
          key: "Pwd",
          value: "123456"
        }]);
        if (res[0].count == 0) {
          //创建表之后插入默认数据
          var sql = "CREATE TABLE IF NOT EXISTS SY_User (" +
            "UserId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "LoginId TEXT,Pwd TEXT);";
          this.$sqlite.createTabel(sql).then(res => {
            this.$sqlite.insert(insert_sql);
          });
        } else {
          //查询是否有用户信息，没有则插入默认用户信息
          this.$sqlite.select("SELECT * FROM SY_User").then(res => {
            if (res.length == 0) {
              this.$sqlite.insert(insert_sql);
            }
          });
        }
      });

      //判断是否有客户表，没有就创建表
      this.$sqlite.hasTabel("BA_Customer").then(res => {
        console.log('是否新建 BA_Customer 表', res[0].count == 0);
        if (res[0].count == 0) {
          var sql = "CREATE TABLE IF NOT EXISTS BA_Customer (" +
            "CustomerId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "CustomerName TEXT,CreateTime TEXT);";
          this.$sqlite.createTabel(sql);
        }
      });

      //判断是否有费用表，没有就创建表
      this.$sqlite.hasTabel("RP_Cost").then(res => {
        console.log('是否新建 RP_Cost 表', res[0].count == 0);
        if (res[0].count == 0) {
          var sql = "CREATE TABLE IF NOT EXISTS RP_Cost (" +
            "CostId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
            "CustomerId INTEGER NOT NULL," +
            "CustomerName TEXT NOT NULL," +
            "CostType INTEGER NOT NULL," +
            "Amount TEXT NOT NULL," +
            "CostDate TEXT NOT NULL," +
            "Remark TEXT);";
          this.$sqlite.createTabel(sql);
        }
      });

      /*******************/

      // // #ifdef APP-PLUS
      // // //加载字体
      // // const domModule = weex.requireModule('dom');
      // // domModule.addRule('fontFace', {
      // //   fontFamily: 'iconfont',
      // //   src: "url('https://at.alicdn.com/t/font_1104534_a85y6x274hj.ttf')"
      // // });
      // plus.push.getClientInfoAsync(
      //   function(info) {
      //     console.log(info);
      //     uni.setStorageSync('ClientInfo', JSON.stringify(info));
      //   },
      //   function(e) {
      //     console.log(JSON.stringify(e));
      //   }
      // );
      // const _handlePush = message => {
      //   //收到推送后
      //   let { payload } = message;
      //   commonJs.linkTo('..' + payload);

      //   // console.log(message);
      //   /* if(payload){
      // 			message.payload = JSON.parse(payload);
      // 		}	 */
      //   // uni.setStorageSync('Content', JSON.stringify(payload));

      //   // uni.showToast({
      //   //   title: JSON.stringify(message) + '',
      //   //   icon: 'none',
      //   //   duration: 5000
      //   // });
      //   /*
      // 		没有通知栏消息。这是透传的特点。想要有自己plus.push创建一个
      // 		http://www.html5plus.org/doc/zh_cn/push.html#plus.push.createMessage
      // 		特点就是通知栏要不要信息自己决定，有的通知是即时限制的发来就语音播报你有一条新的消息。不需要通知栏有的有需要。总之透传自己另外创建通知栏消息最方便了
      // 		 */
      // };

      // //监听push推送通知
      // plus.push.addEventListener('receive', function(message) {
      //   const cUrl = uni.getStorageSync('cUrl');
      //   // console.log(cUrl, 'currentWebview');
      //   // console.log('相等', cUrl == '..' + message.payload);
      //   if (cUrl == '..' + message.payload) {      
      //     // switch (message.payload) {
      //     //   case '/jobBook/index':
      //     //     uni.$emit('popup', '');
      //     //     break;
      //     //   default:
      //     //     plus.push.createMessage('你有一条通知', message.payload);
      //     //     break;
      //     // }
      //   } else {
      //     plus.push.createMessage('你有一条通知', message.payload);
      //   }
      //   // plus.nativeUI.toast('push receive');
      //   // _handlePush(message);
      // });
      // //监听点击通知栏
      // plus.push.addEventListener('click', function(message) {
      //   // plus.nativeUI.toast('push click');
      //   _handlePush(message);
      // });
      // // #endif
    },
    onShow: function() {
      console.log('App Show');
    },
    onHide: function() {
      console.log('App Hide');
    }
  };
</script>
