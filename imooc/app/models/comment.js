// 添加模块

var mongoose = require("mongoose");

// 引入模式

var CommentSchema = require("../schemas/comment.js");

// 编译生成 Commnet 模型 参数为模型的名称、模式

var Comment = mongoose.model("Comment",CommentSchema);

// 导出

module.exports = Comment;

