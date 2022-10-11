//INTEGER int字段类型
//PRIMARY KEY 主键
//AUTOINCREMENT 自增Id
//NOT NULL 不为空
let db_name = "sqlite";
let sqlite = {
  //创建数据库或者有该数据库就打开
  openSqlite: function() {
    //创建数据库或者打开
    //这plus.sqlite只在手机上运行
    return new Promise((resolve, reject) => {
      console.log("打开数据库");
      plus.sqlite.openDatabase({
        name: db_name, //数据库名称
        path: "_doc/" + db_name + ".db", //数据库地址，uniapp推荐以下划线为开头，这到底存在哪里去了，我也不清楚，哈哈
        success(e) {
          console.log('成功', e)
          resolve(e); //成功回调
        },
        fail(e) {
          console.log('失败', e)
          reject(e); //失败回调
        },
      });
    });
  },

  // ---------------------------------------------------创建表----------------------------------------------------------------
  //查询表格是否存在
  hasTabel: function(tbName, type = "table") {
    return new Promise((resolve, reject) => {
      if (!tbName) {
        reject("数据表名称不能为空");
      } else {
        plus.sqlite.selectSql({
          name: db_name,
          sql: "select count(*) count from sqlite_master where type='" + type + "' and name = '" + tbName +
            "';",
          success(e) {
            resolve(e);
          },
          fail(e) {
            reject(e);
          },
        });
      }
    });
  },
  //在该数据库里创建表格， 这一步也必须要！
  createTabel: function(create_sql) {
    return new Promise((resolve, reject) => {
      if (!create_sql) {
        reject("创建表格的数据库语句不能为空");
      } else {
        //创建表格在executeSql方法里写
        plus.sqlite.executeSql({
          name: db_name,
          //表格创建或者打开，后面为表格结构
          sql: create_sql,
          success(e) {
            console.log('新建表格成功', e);
            resolve(e);
          },
          fail(e) {
            console.log('新建表格失败', e);
            reject(e);
          },
        });
      }
    });
  },
  //删除表格
  dropTable(sqlstr) {
    return new Promise((resolve, reject) => {
      if (!sqlstr) {
        reject("数据库语句不能为空");
      } else {
        plus.sqlite.executeSql({
          name: db_name,
          //表格创建或者打开，后面为表格结构
          sql: sqlstr,
          success(e) {
            console.log('删除表格成功', e);
            resolve(e);
          },
          fail(e) {
            reject(e);
          },
        });
      }
    });
  },

  // ---------------------------------------------------插入数据-----------------------------------------------------------------
  //获取插入的数据库语句
  insertSql(tbName, data) {
    var sql = "INSERT INTO " + tbName + " (";
    var keys = "";
    var values = "";

    data.forEach((x, index) => {
      // console.log('x', index, x.key, x.value);
      if (index == data.length - 1) {
        keys += x.key;
        values += "'" + x.value + "'";
      } else {
        keys += x.key + ",";
        values += "'" + x.value + "',";
      }
    });
    sql += keys + ") VALUES (" + values + ");";
    return sql;
  },
  //向表格里添加数据
  insert: function(sqlstr) {
    return this.execute(sqlstr);
  },

  // ---------------------------------------------------删除数据-----------------------------------------------------------------
  delete(sqlstr) {
    return this.execute(sqlstr);
  },

  // ---------------------------------------------------修改数据-----------------------------------------------------------------
  modifySql(tbName, data, where) {
    var sql = "UPDATE " + tbName + " SET ";
    var columns = "";

    data.forEach((x, index) => {
      // console.log('x', index, x.key, x.value);
      if (index == data.length - 1) {
        columns += x.key + " = '" + x.value + "'";
      } else {
        columns += x.key + " = '" + x.value + "',";
      }
    });
    sql += columns + " WHERE " + where;
    return sql;
  },
  modify(sqlstr) {
    return this.execute(sqlstr);
  },

  // ---------------------------------------------------公用方法-----------------------------------------------------------------
  execute(sqlstr) {
    return new Promise((resolve, reject) => {
      if (sqlstr) {
        plus.sqlite.executeSql({
          name: db_name,
          sql: sqlstr,
          success(e) {
            console.log('success', e)
            resolve(e);
          },
          fail(e) {
            console.log('fail', e)
            reject(e);
          },
        });
      } else {
        reject("数据库语句不能为空");
      }
    });
  },

  // ---------------------------------------------------查询数据-----------------------------------------------------------------
  selectSql(sqlstr, pageSize = 0, pageIndex = 0) {
    var sql = sqlstr;
    if (pageSize == 0 && pageIndex == 0) {
      return sql;
    } else {
      var page_str = " LIMIT " + pageSize + " OFFSET " + (pageSize * pageIndex) + ";"
      return sql + page_str;
    }
  },
  select(sqlstr) {
    return new Promise((resolve, reject) => {
      if (sqlstr) {
        plus.sqlite.selectSql({
          name: db_name,
          sql: sqlstr,
          success(e) {
            resolve(e);
          },
          fail(e) {
            reject(e);
          },
        });
      } else {
        reject("数据库语句不能为空");
      }
    });
  },
  count(sqlstr) {
    return new Promise((resolve, reject) => {
      if (sqlstr) {
        plus.sqlite.selectSql({
          name: db_name,
          sql: sqlstr,
          success(e) {
            resolve(e);
          },
          fail(e) {
            reject(e);
          },
        });
      } else {
        reject("数据库语句不能为空");
      }
    });
  },

  // ---------------------------------------------------关闭数据库-----------------------------------------------------------------
  //关闭数据库
  closeSQL: function(name) {
    return new Promise((resolve, reject) => {
      plus.sqlite.closeDatabase({
        name: db_name,
        success(e) {
          resolve(e);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  },

  // ---------------------------------------------------监听数据库是否开启-----------------------------------------------------------------
  //监听数据库是否开启
  isOpen: function() {
    //数据库打开了就返回true,否则返回false
    var open = plus.sqlite.isOpenDatabase({
      name: db_name,
      path: "_doc/" + db_name + ".db",
    });
    return open;
  },

  //一次获取指定数据条数
  //不想一次性把数据全拿过来就可以这样写
  //id为表格名，desc代表倒序拿数据，正常是从第一条开始拿，倒序就从最后一条也是最新的一条数据开始拿
  //limit 15 offset '+num+''，后面这是两个单引号，这句的意思是跳过多少条拿15条数据，num是动态值
  //比如你刚开始给num设为0，那就从最后面的数据开始拿15条，你下次肯定不想再拿刚刚获取到的数据，所以可以让num为15，这样就能一步一步的拿完所有的数据
  pullSQL: function(id, num) {
    //id为表名，num为跳过多少条数据
    //根据list来倒序拿数据，跳过num条拿取15条
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: db_name,
        sql: "select * from " +
          id +
          " order by list desc limit 15 offset " +
          num +
          "",
        success(e) {
          resolve(e);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  },
};

//把这些方法导出去
export default sqlite;
