// 引入模型
const Comment = require('../models/comment');
// 详情
// comment 提交
exports.save = (request ,response) => {
	var comment = request.body.comment;
	var movie = comment.movie;
	console.log(comment);
	var _comment;
	// 更新
	_comment = new Comment(comment);
	_comment.save((err, comment) => {
		if (err) {
			console.log(err)
		} else {
			response.redirect('/movie/' + movie);
		}
	})
}