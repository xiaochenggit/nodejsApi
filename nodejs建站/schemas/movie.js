// 模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var movieSchema = new Schema({
	name: String,
	poster: String,
	year : Number,
	language : String,
	country : String,
	swf : String,
	summary : String,
	// 更新相关
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		}
	}
});
// 每次保存的时候都会触发下面的方法
movieSchema.pre('save', function (next) {
	// 如果是新创建的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	// 执行下一步
	next();
});

// 添加一些静态的方法

movieSchema.statics = {
	// 查询所有数据,并按照更新时间排序
	fetch: function (cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	// 查询单条数据
	findById: function (id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
}
// 导出
module.exports = movieSchema;