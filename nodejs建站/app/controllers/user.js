// 引入模型
const User = require('../models/user');
const Moment = require('moment');
// 删除用户
exports.delete = (request, response) => {
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
}
// user注册
exports.signup = (request, response) => {
	var _user = request.body.user;
	console.log(_user);
	User.findOne( {name: _user.name }, (error,user) => {
		if (error) {
			console.log(error);
		} else {
			if (user) {
				response.redirect("/user/signin");
			} else {
				var user = new User(_user);
				user.save((error, user) => {
					if (error) {
						console.log(error);
					} else {
						request.session.user = user;
						response.redirect("/admin/user/list");
					}
				})
			}
		}
	})	
}
// get showSignup
exports.showSignup = (request, response) => {
	response.render('pages/user-signup',{
		title : '用户注册页面'
	})
}
// get showSignin
exports.showSignin = (request, response) => {
	response.render('pages/user-signin',{
		title : '用户登陆页面'
	})
}
// 登出
exports.logout = (request, response) => {
	delete request.session.user;
    // delete app.locals.user;
	response.redirect('/');
	console.log('登出成功');
}
// user 登录
exports.signin = (request, response) => {
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
							// 设置登陆状态
							request.session.user = user;
							response.redirect('/');
						} else {
							console.log('密码输入错误');
						}
					}
				})
			}
		}
	})
}
// user 列表页面
exports.list = (request, response) => {
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
}