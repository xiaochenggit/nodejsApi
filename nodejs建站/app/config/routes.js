const Movie = require('../controllers/movie');
const User = require('../controllers/user');
const Index = require('../controllers/index');
const routes = function (app) {
	app.use((request, response, next) => {
		var user = request.session.user;
		if (user) {
			app.locals.user = user ;
			next();
		} else {
			app.locals.user = '' ;
			next();
		}
	})
	// 首页
	app.get('/', Index.index)

	app.get('/movie/:id', Movie.movie)

	app.post('/admin/movie/new', Movie.save)
	// 创建电影页面
	app.get('/admin/movie/new', Movie.new)
	// 更新电影页面
	app.get('/movie/update/:id', Movie.update)
	// 电影管理列表
	app.get('/admin/movie/admin', Movie.admin)
	// 删除电影
	app.delete('/admin/movie/detail', Movie.delete);
	// 删除用户
	app.delete('/admin/user/detail', User.delete);
	// user注册
	app.post('/user/signup', User.signup)
	// 登出
	app.get('/user/logout', User.logout)
	// user 登录
	app.post('/user/signin', User.signin)
	// user 列表页面
	app.get('/admin/user/list', User.list)
}
module.exports = routes;