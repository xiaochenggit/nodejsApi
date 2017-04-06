// 引入模型
const Movie = require('../models/movie');
const Category = require('../models/category');
const Comment = require('../models/comment');
// 替换数据专用
const _ = require('underscore');
// 时间格式化
const Moment = require('moment');
// fs 读写 和路径
const fs = require('fs');
const path = require('path');
// 详情
exports.movie = (request, response) => {
	var id = request.params.id;
	Movie.findOne({ _id: id })
		.populate({ path: 'category' })
		.exec((err,movie) => {
			if (err) {
				console.log(err)
			} else {
				Comment
				.find({movie : movie.id})
				// 提取出 from  user 里的name
				.populate('from', 'name')
				.populate('reply.from reply.to','name')
				.exec((err, comments) => {
					if (err) {
						console.log(err);
					} else {
						response.render('pages/movie-detail', {
							title: '电影详情页面',
							movie : movie,
							comments : comments
						});
					}
				})
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
			_movie = _.extend(movie, movieObj);
			_movie.save((err, movie) => {
				Category.find({},(error,categories) => {
					categories.forEach( function(category, index) {
						category.movies.forEach( function(element, index) {
							if (element.toString() == _movie._id.toString()) {
								category.movies.splice(index,1);
							}
						});
						category.save((error,category) => {
						})
					});
				})
				var categories = _movie.category;
				if (err) {
					console.log(err)
				} else {
					// 是选择的
					if (categories) {
						categories.forEach( function(element, index) {
							Category.findById(element, (error, category) => {
								if (error) {
									console.log(error);
								} else {
									category.movies.push(movie._id);
									category.save((error,category) => {
									})
								}
							})
						});
						response.redirect('/movie/' + movie._id);
					} else {
						// 填写的
						// _category = new Category({
						// 	name : movieObj.catetoryName,
						// 	movies: [movie._id]
						// });
						// _category.save((err, category) => {
						// 	if (err) {
						// 		console.log(err)
						// 	} else {
						// 		// 电影分类保存
						// 		movie.category = category._id ;
						// 		movie.save((error,movie) =>{
						// 			response.redirect('/movie/' + movie._id);
						// 		})
						// 	}
						// })
					}
				}
			})
		})
	} else {
		console.log('false');
		_movie = new Movie(movieObj);
		_movie.save((err, movie) => {
			var categories = _movie.category;
			if (err) {
				console.log(err)
			} else {
				// 是选择的
				if (categories) {
					categories.forEach( function(element, index) {
						Category.findById(element, (error, category) => {
							if (error) {
								console.log(error);
							} else {
								category.movies.push(movie._id);
								category.save((error,category) => {
								})
							}
						})
					});
					response.redirect('/movie/' + movie._id);
				} else {
					// 填写的
					// _category = new Category({
					// 	name : movieObj.catetoryName,
					// 	movies: [movie._id]
					// });
					// _category.save((err, category) => {
					// 	if (err) {
					// 		console.log(err)
					// 	} else {
					// 		// 电影分类保存
					// 		movie.category = category._id ;
					// 		movie.save((error,movie) =>{
					// 			response.redirect('/movie/' + movie._id);
					// 		})
					// 	}
					// })
				}
			}
		})
	}
}
// 创建电影页面
exports.new = (request, response) => {
	Category.find({}, (error, categories) => {
		response.render('pages/movie-new', {
			title: '电影创建页面',
			categories : categories,
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
	});
}
// 更新电影页面
exports.update = (request, response) => {
	var id = request.params.id;
	if (id) {
		Category.find({}, (error,categories) => {
			Movie.findOne({ _id: id })
			.populate({ path: 'category' })
			.exec((err, movie) => {
				if (err) {
					console.log(err)
				} else {
					categories.forEach( function(category, index) {
						movie.category.forEach( function(element, index) {
							if (category.name.toString() == element.name.toString()) {
								category['checked'] = true;
							}
						});
					});
					console.log(categories);
					response.render('pages/movie-new',{
						movie : movie,
						title : '电影更新页面',
						categories : categories
					})
				}
			})
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