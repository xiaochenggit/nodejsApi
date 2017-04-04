// 引入模型
const Comment = require('../models/comment');
// 详情
// comment 提交
exports.save = (request ,response) => {
	var comment = request.body.comment;
	var movie = comment.movie;
	// 判断是否是回复的评论，回复的评论 会有comment[cid] comment[tid]
	if (comment.cid) {
		Comment.findById(comment.cid, (err, com) => {
			var reply = {
				from: comment.from,
				to: comment.tid,
				content: comment.content
			}
			com.reply.push(reply);
			com.save((err, comment) => {
				if (err) {
					console.log(err)
				} else {
					response.redirect('/movie/' + movie);
				}
			})
		})
	} else {
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
}