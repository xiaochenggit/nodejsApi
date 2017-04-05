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
exports.movieSreach = (request, response) => {
	const categoryId = request.query.id;
	console.log(categoryId);
	const page = parseInt(request.query.page);
	const cont = 2;
	const start = page * cont;
	Category
	.findOne({ _id: categoryId })
	.populate({path : 'movies'})
	.exec( (error,category) => {
		console.log(category);
		var name = category.name;
		var pagesLength = Math.floor(category.movies.length / cont);
		var oldPage = page > 0 ? page-1 : pagesLength ;
		var nextPage = page < pagesLength ? page + 1 : 0;
		var movies = category.movies.slice(start, start+cont);
		response.render('pages/movie-sreach',{
			title: '电影分页',
			categoryId : categoryId,
			movies: movies,
			name: name,
			thisPage: page,
			oldPage: oldPage,
			nextPage: nextPage,
			pagesLength :  pagesLength
		})
	})
}