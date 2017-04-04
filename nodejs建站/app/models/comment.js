// 导入模式
const commentSchema = require('../schemas/comment');
const mongoose = require('mongoose');
// 编译生成模型
const comment = mongoose.model('comment',commentSchema);
// 导出 
module.exports = comment;