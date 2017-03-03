// 添加模块

var mongoose = require("mongoose");

// 引入模式

var MovieSchema = require("../schemas/movie.js");

// 编译生成 Movie 模型 参数为模型的名称、模式

var Movie = mongoose.model("Movie",MovieSchema);

// 导出

module.exports = Movie;

