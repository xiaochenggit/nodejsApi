// 导入模式
const categorySchema = require('../schemas/category');
const mongoose = require('mongoose');
// 编译生成模型
const Category = mongoose.model('Category',categorySchema);
// 导出 
module.exports = Category;