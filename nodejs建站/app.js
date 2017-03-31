// 入口文件
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// 替换数据专用
const _ = require('underscore');
// 引入模型
const Movie = require('./models/movie');
// 设置端口号 
const port = 8080;
// 实例化
const app = express();
// 连接数据库
mongoose.connect('mongodb://localhost:27017/website')
// 设置模板目录 与引擎模板
app.set('views',"./views");
app.set('view engine','ejs');
// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'static')));
// 格式化表单数据
app.use(bodyParser.urlencoded({ extended: true }));
// 首页
app.get('/', (request, response) => {
	Movie.fetch((err, movies) => {
		if (err) {
			console.log(err)
		} else {
			response.render('pages/index',{
					title : '首页',
					movies: movies
			});
		}
	});
})

app.get('/movie/:id', (request, response) => {
	var id = request.params.id;
	Movie.findById(id, (err,movie) => {
		if (err) {
			console.log(err)
		} else {
			response.render('pages/movie-detail', {
				title: '电影详情页面',
				movie : movie
			});
		}
	});
})

app.post('/admin/movie/new', (request ,response) => {
	console.log(request.body.movie);
	var id = request.body.movie._id;
	var movieObj = request.body.movie;
	var _movie;
	// 更新
	if (id) {
		Movie.findById(id, (err, movie) => {
			_movie = _.extend(movie, movieObj) ;
			_movie.save((err, movie) => {
				if (err) {
					console.log(err)
				} else {
					response.redirect('/movie/' + movie._id);
				}
			})
		})
	} else {
		_movie = new Movie({
			name : movieObj.name,
			author : movieObj.author,
			country : movieObj.country,
			language : movieObj.language,
			poster : movieObj.poster,
			swf : movieObj.swf,
			summary : movieObj.summary
		});
		_movie.save((err, movie) => {
				if (err) {
					console.log(err)
				} else {
					response.redirect('/movie/' + movie._id);
				}
			})
	}
})
// 创建电影页面
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
// 更新电影页面
app.get('/movie/update/:id', (request, response) => {
	var id = request.params.id;
	if (id) {
		Movie.findById(id, (err, movie) => {
			if (err) {
				console.log(err)
			} else {
				response.render('pages/movie-new',{
					movie : movie,
					title : '电影更新页面'
				})
			}
		})
	}
})
// 电影管理列表
app.get('/admin/movie/admin', (request, response) => {
	Movie.fetch((err, movies) => {
		if (err) {
			console.log(err)
		} else {
			response.render('pages/movie-admin',{
				title: '电影管理页面',
				movies : movies
			});
		}
	});
})

// 启动服务
app.listen(port);

// 打印日志
console.log(`服务器已经在 localhost:${port} 端口启动`);