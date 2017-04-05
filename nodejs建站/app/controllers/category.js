// 引入模型
const Category = require('../models/category');
const Moment = require('moment');
// Category 创建 更新
exports.save = (request ,response) => {
	var category = request.body.category;
	// 更新
	_category = new Category(category);
	_category.save((err, category) => {
		if (err) {
			console.log(err)
		} else {
			response.redirect('/admin/category/admin');
		}
	})
}
// 创建分类页面
exports.new = (request, response) => {
	response.render('pages/category-new', {
		title: '电影分类创建页面',
		category: {
			name : '',
		}
	});
}
// 分类管理列表
exports.admin = (request, response) => {
	Category.fetch((err, categories) => {
		if (err) {
			console.log(err)
		} else {
			response.render('pages/category-list',{
				title: '电影分类管理页面',
				categories : categories,
				moment : Moment
			});
		}
	});
}

// 删除分类
exports.delete = (request, response) => {
	var id = request.query.id ;
	if (id) {
		Category.remove({_id : id}, (err) => {
			if (err) {
				console.log('删除出错')
			} else {
				response.json({success: 1});
			}
		})
	}
}