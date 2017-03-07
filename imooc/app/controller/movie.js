var Movie = require("../models/movie.js");
var Comment = require("../models/comment.js");
var Catetory = require("../models/catetory.js");
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
		// Comment.find({ movie : id},function(err,comments){
			
		// })
		Comment.find({movie : id})
		.populate("from",'name')
		.populate("to",'name')
		.populate("replay.to","name")
		.populate("replay.from","name")
		.exec(function(err,comments){
			res.render("detail",{
				title : movie.title ,
				movie : movie,
				comments : comments
			})
		})
	})
}

exports.new = function(req,res){
	Catetory.find({},function(arr,catetories){
		res.render("admin",{
			title : 'IMOOC 后台录入页面',
			catetorires : catetories,
			movie : {
				title : '',
				doctor : "",
				country : "",
				year : "",
				poster : "",
				flash : "",
				summary : '',
				language : '',
				catetoryName : "",
				catetory : ""
			}
		})
	})
}

// 提交数据

exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	console.log(movieObj);
	var _movie;
	// 更新
	if (id) {
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
				res.redirect("/admin/movie/" + movie._id)
			})
		})
	}else {		
		// 创建
		_movie = new Movie(movieObj);
		// 保存
		var catetoryId = _movie.catetory;
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}else {
				Catetory.findById(catetoryId,function(err,catetory){
					catetory.movies.push(movie._id);
					catetory.save(function(err,catetory){
						res.redirect("/admin/movie/" + movie._id)
					})
				})
			}
		})
	}
}

// 更新
exports.updata = function(req,res){
	var id = req.params.id;
	if (id) {
		Movie.findById(id,function(err,movie){
			Catetory.find({},function(err,catetorires){
				res.render("admin",{
					title : '后台更新页面',
					movie : movie ,
					catetorires,catetorires
				})
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