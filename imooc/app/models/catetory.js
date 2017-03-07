// 添加模块

var mongoose = require("mongoose");

// 引入模式

var CatetorySchema = require("../schemas/catetory.js");

// 编译生成 Movie 模型 参数为模型的名称、模式

var Catetory = mongoose.model("Catetory",CatetorySchema);

// 导出

module.exports = Catetory;

