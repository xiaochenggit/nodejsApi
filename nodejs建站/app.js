// 入口文件
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// 打印信息需要
const logger = require('morgan');
// 用于用户在线体验
const session = require('express-session');
const mongoSotre = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

// 设置端口号 
const port = 8080;
// 实例化
const app = express();
// 连接数据库
mongoose.connect('mongodb://localhost:27017/website')
// 设置模板目录 与引擎模板
app.set('views',"./app/views");
app.set('view engine','ejs');
// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'static')));
// 格式化表单数据
app.use(bodyParser.urlencoded({ extended: true }));
// 用户储存
app.use(cookieParser());
app.use(session({
	secret: 'website',
	// 配置
	store : new mongoSotre({
		url: 'mongodb://localhost:27017/website',
		collection: 'session'
	})
}));
// 一些日志信息
if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}
// 路由
const routes = require('./app/config/routes');
routes(app);
// 启动服务
app.listen(port);
// 打印日志
console.log(`服务器已经在 localhost:${port} 端口启动`);