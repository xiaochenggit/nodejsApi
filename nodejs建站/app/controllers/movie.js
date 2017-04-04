// 引入模型
const Movie = require('../models/movie');
// 替换数据专用
const _ = require('underscore');
// 
const Moment = require('moment');
// 详情
exports.movie = (request, response) => {
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
}
// movie 创建 更新
exports.save = (request ,response) => {
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
}
// 创建电影页面
exports.new = (request, response) => {
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
}
// 更新电影页面
exports.update = (request, response) => {
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
}
// 电影管理列表
exports.admin = (request, response) => {
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
}
// 删除电影
exports.delete = (request, response) => {
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
}