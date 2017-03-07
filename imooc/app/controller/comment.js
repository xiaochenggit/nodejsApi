var Comment = require("../models/comment");
// comment 
exports.save = function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;

	// 判断是否是会回别人的
	
	if (_comment.cid) {
		// 找到这个主评论
		Comment.findById(_comment.cid,function(err,comment){
			replay = {
				from : _comment.from,
				to : _comment.tid,
				content : _comment.content
			}
			comment.replay.push(replay);
			comment.save(function(err,comment){
				if (err) { 
					console.log(err)
				}else{
					res.redirect("/admin/movie/" + movieId)
				}
			})
		})
	}else{
		var comment = new Comment(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);	
			}else {
				res.redirect("/admin/movie/" + movieId)
			}
		})
	}
}