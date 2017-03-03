// 添加模块

var mongoose = require("mongoose");

// 引入模式

var UserSchema = require("../schemas/user.js");

// 编译生成 Movie 模型 参数为模型的名称、模式

var User = mongoose.model("User",UserSchema);

// 导出

module.exports = User;

