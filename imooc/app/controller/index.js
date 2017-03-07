// 负责与首页进行交互
var Movie = require("../models/movie.js");
var Catetory = require("../models/catetory.js");
exports.index = function(req,res){
	// 模型的fetch方法找到全部数据
	// if (req.session.user) {
	// 	console.log( req.session.user.name + "用户已经登陆")
	// }else{
	// 	console.log(" 没有用户登录 ");
	// }
	// Movie.fetch(function(err,movies){
	// 	if (err) {
	// 		console.log(err); 
	// 	}
	// 	// 渲染模板
	// 	res.render("index",{
	// 		title : 'IMOOC 首页',
	// 		movies : movies
	// 	})
	// })
	Catetory.find({})
	.populate({ path : "movies" , options : { limit : 5 } })
	.exec(function(err,catetories){
		if (err) {
			console.log(err)
		} else {
			res.render("index",{
				title : " 首页 ",
				catetories : catetories
			})
		}
	})
}