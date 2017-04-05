// 引入模型
const Movie = require('../models/movie');
const Category = require('../models/category');
// 首页的交互
exports.index = (request, response) => {
	Category
	.find({})
	.populate({ path: 'movies', options: { limit: 5 } })
	.exec((error,categories) => {
		if (error) {
			console.log(error)
		} else {
			response.render('pages/index',{
				title : '首页',
				categories: categories
			});
		}
	})
}