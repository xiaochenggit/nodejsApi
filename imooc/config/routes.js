var Index = require("../app/controller/index.js");
var Movie = require("../app/controller/movie.js");
var User = require("../app/controller/user.js");
 
// 添加几个主要页面的路由
module.exports = function (app){

	// 预处理，用户是否登陆
	app.use(function(req,res,next){
		var _user = req.session.user ;
		app.locals.user = _user ;
		next();
	})
	// 用户列表
	app.get("/user/list",User.signupRequired,User.adminRequired,User.list);
	// 退出
	app.get("/user/logout",User.logout);
	// 注册
	app.post("/user/signin",User.signin);
	// 登陆
	app.post("/user/signup",User.signup);
	// 登陆页面
	app.get("/signup",User.showSignup);
	// 注册页面
	app.get("/signin",User.showSignin);
	// 电影列表
	app.get("/admin/movie/list",Movie.list);
	// 电影后台录入
	app.get("/admin/movie",Movie.new);
	// 电影更新
	app.get("/admin/movie/updata/:id",Movie.updata);
	// 电影保存
	app.post("/admin/movie/new",Movie.save);
	// 电影详情页面
	app.get("/movie/:id",Movie.detail);
	// 电影删除
	app.delete("/admin/movie/list",User.signupRequired,User.adminRequired,Movie.del);
	// 首页
	app.get("*",Index.index);
}
