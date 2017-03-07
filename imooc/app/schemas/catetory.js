// 引入建模工具模块

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;
// 声明

var CatetorySchema = new Schema({

	// 跟设计分类的数据模型

	name : String,
	movies : [{
		type : ObjectId,
		ref : "Movie"
	}],
	// 创建、更新 时间
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updataAt : {
			type : Date,
			default : Date.now()
		}
	}
})

// 添加方法

CatetorySchema.pre("sava",function(next){

	// 如果是新创建的数据 创建时间和更新时间为当前时间、否则更新时间设为当前时间

	if (this.isNew) {
		this.meta.createAt = this.meta.updataAt = Date.now();
	}else {
		this.meta.updataAt = Date.now();
	}
	next()
})

// 添加一些静态方法

CatetorySchema.statics = {

	// 取出数据库的所有数据 按照更新时间排序并执行回调方法

	fetch : function(cb) {
		return this
		.find({})
		.sort("meta.updataAt")
		.exec(cb)
	},

	// 找出单条数据

	findById : function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

// 模式导出

module.exports = CatetorySchema;