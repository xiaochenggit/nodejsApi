var User = require("../models/user.js");
//  signin 注册
exports.signin = function(req,res){
	var _user = req.body.user;
	// req.param("user")
	
	// 是否重复注册名字
	User.findOne( { name : _user.name },function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect("/signup");
		}else{
			var user = new User(_user);
			user.save(function(err,user){
				if (err) {
					console.log(err);
				}else{
					res.redirect("/user/list");
				}
			})
		}
	});
}
exports.showSignin = function(res,res){
	res.render("signin",{
		title : "注册页面"
	})
}

// signup 登陆

exports.signup = function(req,res){
	var _user = req.body.user ;
	var name = _user.name ;
	var password = _user.password ;
	User.findOne({name : name},function(err,user){
		if (err) {
			console.log(user)
		}
		if (!user) {
			// 用户不存在返回 首页
			return res.redirect("/signin")
		}else{
			// 密码配对
			user.comparePassword(password,function(err,isMatch){
				if (err) {
					console.log(err);
				}
				if (isMatch) {
					// 实现保持登陆状态
					req.session.user = user;
					console.log("password true ");
					return res.redirect("/");
				}else{
					console.log("password no true");
					return res.redirect("/signup");
				}
			})
		}
	})
}
exports.showSignup = function(req,res){
	res.render("signup",{
		title : "登陆页面"
	})
}
// loyout 
exports.logout = function(req,res){
	delete req.session.user ;
	// delete app.locals.user ;
	return res.redirect("/")
}

// userlist 首页 不需要伪造数据了

exports.list  = function(req,res){

	// 模型的fetch方法找到全部数据

	User.fetch(function(err,users){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("userlist",{
			title : '用户列表',
			users : users
		})
	})
}

// 用户权限 验证是否登陆
exports.signupRequired = function (req,res,next){
	var user = req.session.user;
	if (!user) {
		res.redirect("/signup");
	}else{
		next();
	}
}
//  验证是否是管理员
exports.adminRequired = function (req,res,next){
	var user = req.session.user ;
	console.log(user.role);
	if ( user.role > 10 ) {
		next();
	}else{
		res.redirect("/");
	}
}