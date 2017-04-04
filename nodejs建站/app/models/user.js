// 导入模式
const UserSchema = require('../schemas/user');
const mongoose = require('mongoose');
// 编译生成模型
const User = mongoose.model('User',UserSchema);
// 导出 
module.exports = User;