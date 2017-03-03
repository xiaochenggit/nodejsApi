var Movie = require("../models/movie.js");
var _ = require("underscore");
//  list page 列表页面
exports.list = function(req,res){

	// 模型的fetch方法找到全部数据

	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("list",{
			title : 'IMOOC 列表页面',
			movies : movies
		})
	})
}

exports.detail = function(req,res){
	// 拿到 id 
	var id = req.params.id;
	// 
	Movie.findById(id,function(err,movie){
		res.render("detail",{
			title : 'IMOOC ' ,
			movie : movie
		})
	})
}

exports.new = function(req,res){
	res.render("admin",{
		title : 'IMOOC 后台录入页面',
		movie : {
			title : '',
			doctor : "",
			country : "",
			year : "",
			poster : "",
			flash : "",
			summary : '',
			language : ''
		}
	})
}

// 提交数据

exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	// 更新
	if (id !== "undefined") {
		Movie.findById(id,function(err,movie){
			if (err) {
				console.log(err);
			}
			// 更新
			_movie = _.extend(movie,movieObj);
			// 保存
			_movie.save(function(err,movie){
				if (err) {
					console.log(err);
				}
				// 重新定向
				res.redirect("/movie/" + movie._id)
			})
		})
	}else {		
		// 创建
		_movie = new Movie({
			doctor : movieObj.doctor,
			title : movieObj.title,
			country : movieObj.country,
			language : movieObj.language,
			year : movieObj.year,
			poster : movieObj.poster,
			summary : movieObj.summary,
			flash : movieObj.flash
		})
		// 保存
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			res.redirect("/movie/" + movie._id)
		})
	}
}

// 更新
exports.updata = function(req,res){
	var id = req.params.id;
	if (id) {
		Movie.findById(id,function(err,movie){
			res.render("admin",{
				title : '后台更新页面',
				movie : movie 
			})
		})
	}
}

// list 删除请求

exports.del = function(req,res){
	var id = req.query.id;
	if (id) {
		Movie.remove({_id : id},function(err,movie){
			if (err) {
				console.log(err);
			}else{
				res.json({success : 1});
			}
		})
	}
}