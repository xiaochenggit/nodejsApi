// 引入模型
const Movie = require('../models/movie');
// 首页的交互
exports.index = (request, response) => {
	Movie.fetch((err, movies) => {
		if (err) {
			console.log(err)
		} else {
			response.render('pages/index',{
					title : '首页',
					movies: movies
			});
		}
	});
}