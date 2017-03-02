// 引入建模工具模块

var mongoose = require("mongoose");

// 声明

var MovieSchema = new mongoose.Schema({

	// 跟电影相关的字段

	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year : Number,

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

MovieSchema.pre("sava",function(next){

	// 如果是新创建的数据 创建时间和更新时间为当前时间、否则更新时间设为当前时间

	if (this.isNew) {
		this.meta.createAt = this.meta.updataAt = Date.now();
	}else {
		this.meta.updataAt = Date.now();
	}
	next()
})

// 添加一些静态方法

MovieSchema.statics = {

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

module.exports = MovieSchema;