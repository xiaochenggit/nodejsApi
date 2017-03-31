// 导入模式
const MovieSchema = require('../schemas/movie');
const mongoose = require('mongoose');
// 编译生成模型
const Movie = mongoose.model('Movie',MovieSchema);
// 导出 
module.exports = Movie;