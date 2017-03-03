// 负责与首页进行交互
var Movie = require("../models/movie.js");
exports.index = function(req,res){
	// 模型的fetch方法找到全部数据
	if (req.session.user) {
		console.log( req.session.user.name + "用户已经登陆")
	}else{
		console.log(" 没有用户登录 ");
	}
	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("index",{
			title : 'IMOOC 首页',
			movies : movies
		})
	})
}