var express = require("express");
var path = require("path");
var logger = require('morgan'); 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var _ = require("underscore");
var cookieparser = require("cookie-parser");
var session = require('express-session');
// var connect = require('connect');
var mongoStore = require('connect-mongo')(session);
// 设置端口 默认值是3000
var port = process.env.PORT || 3000;

// 启动外围服务器
var app = express();

// 插入本地的输入库
mongoose.connect("mongodb://localhost:27017/imooc");

// 设置视图的根目录
app.set("views","./app/views/pages");

// 设置默认的模板引擎 默认为jade
app.set('view engine','jade');

// 表单数据格式化
app.use(bodyParser.urlencoded({ extended: true }));

// 保持用户登陆
app.use(cookieparser());
app.use(session({
	secret : 'imooc',
	store : new mongoStore({
		url : "mongodb://localhost:27017/imooc",
		collection : "session"
	})
}))

// 静态资源获取
app.use(express.static(path.join(__dirname,"static")));
// 配置入口文件
if ("development" === app.get("env")) {
	app.set("showStackError",true) ;
	app.use(logger(":method :url :status"));
	// 可读性 变好
	app.locals.pretty = true;
	// 数据库
	mongoose.set("debug",true);
}
// 运行 config 里的 路由
require("./config/routes.js")(app);
// 入口文件添加 moment
app.locals.moment = require("moment");

// 监听端口
app.listen(port);

console.log(" imooc is started on port " + 'localhost:' + port);

