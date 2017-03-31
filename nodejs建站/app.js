// 入口文件
const express = require('express');
const path = require('path');
var bodyParser = require("body-parser");
// 设置端口号 
const port = 8080;
// 实例化
const app = express();
// 设置模板目录 与引擎模板
app.set('views',"./views");
app.set('view engine','ejs');
// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'static')));
// 格式化表单数据
app.use(bodyParser.urlencoded({ extended: true }));
// 首页
app.get('/', (request, response) => {
	response.render('pages/index',{
		title : '首页',
		movies : [
		{
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		} , {
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		} , {
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		} , {
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		} , {
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		} ,{
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成'
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强'
		}]
	});
})
app.get('/movie/:id', (request, response) => {
	response.render('pages/movie-detail', {
		title: '电影详情页面',
		movie : {
			name: '精钢狼',
			author : '肖成',
			year : 1996,
			country : '中国',
			swf : '1.swf',
			language : '汉语'
		}
	});
})
app.get('/admin/movie/new', (request, response) => {
	response.render('pages/movie-new', {
		title: '电影创建页面',
		movie: {
			name : '',
			year : '',
			_id : '',
			poster : '',
			swf : '',
			language : '',
			country : '',
			author : ''
		}
	});
})
app.get('/admin/movie/admin', (request, response) => {
	response.render('pages/movie-admin',{
		title: '电影管理页面',
		movies : [{
			name : '速度与激情',
			poster : 'images/1.jpg',
			_id : 23,
			author : '肖成',
			year : 2016
		} , {
			name : '精钢狼',
			poster : 'images/1.jpg',
			_id : 23,
			author : '赵强',
			year : 2016,
		}]
	});
})
// 启动服务
app.listen(port);

// 打印日志
console.log(`服务器已经在 localhost:${port} 端口启动`);