// 入口文件
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Moment = require('moment');
// 替换数据专用
const _ = require('underscore');
// 引入模型
const Movie = require('./models/movie');
const User = require('./models/user');
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
			name: movieObj.name,
			author : movieObj.author,
			poster: movieObj.poster,
			year : parseInt(movieObj.year),
			language : movieObj.language,
			country : movieObj.country,
			swf : movieObj.swf,
			summary : movieObj.summary,
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
				movies : movies,
				moment : Moment
			});
		}
	});
})
// 删除电影
app.delete('/admin/movie/detail', (request, response) => {
	var id = request.query.id ;
	if (id) {
		Movie.remove({_id : id}, (err) => {
			if (err) {
				console.log('删除出错')
			} else {
				response.json({success: 1});
			}
		})
	}
});
// 删除用户
app.delete('/admin/user/detail', (request, response) => {
	var id = request.query.id ;
	if (id) {
		User.remove({_id : id}, (err) => {
			if (err) {
				console.log('删除出错')
			} else {
				response.json({success: 1});
			}
		})
	}
});
// user注册
app.post('/user/signup', (request, response) => {
	var _user = request.body.user;
	console.log(_user);
	User.findOne( {name: _user.name }, (error,user) => {
		if (error) {
			console.log(error);
		} else {

			if (user) {
				response.redirect("/");
			} else {
				var user = new User(_user);
				user.save((error, user) => {
					if (error) {
						console.log(error);
					} else {
						response.redirect("/admin/user/list");
					}
				})
			}
		}
	})
	
})

// user 登录
app.post('/user/signin', (request, response) => {
	var _user = request.body.user;
	User.findOne({name : _user.name},(error, user) => {
		if (error) {
			console.log(error);
		} else {
			if (!user) {
				console.log('请输入正确的用户名!')
			} else {
				user.comparePassword(_user.password , (error, isMatch) => {
					if (error) {
						console.log('匹配密码出现错误');
					} else {
						if (isMatch) {
							console.log('登录成功');
							response.redirect('/');
						} else {
							console.log('密码输入错误');
						}
					}
				})
			}
		}
	})
})

// user 列表页面
app.get('/admin/user/list', (request, response) => {
	User.fetch( (error,users) => {
		if (error) {
			console.log(error)
		} else {
			response.render('pages/user-list',{
				title : '用户列表页面',
				users : users,
				moment : Moment
			})
		}
	}) 
})
// 启动服务
app.listen(port);

// 打印日志
console.log(`服务器已经在 localhost:${port} 端口启动`);