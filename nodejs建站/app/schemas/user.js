// 模式
const mongoose = require('mongoose');
// 密码加密算法
// const bcrypt = require('bcrypt');
// 加密强度
const SALT_WORK_FACTOR = 10; 
const Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: {
		type : String,
		// 唯一
		unique : true
	},
	password : '',
	question : String,
	key : String,
	// 权限相关
	role: {
		type: Number,
		default : 0
	},
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
UserSchema.pre('save', function (next) {
	var user = this;
	// 如果是新创建的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next()
	// bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
	// 	if (error) {
	// 		return next(error);
	// 	} else {
	// 		bcrypt.hash(user.password, salt, (error, hash) => {
	// 			if (error) {
	// 				return next(error);
	// 			} else {
	// 				user.password = hash;
	// 				next();
	// 			}
	// 		})
	// 	}
	// })
});

// 添加实例方法 用来匹配密码

UserSchema.methods = {
	comparePassword: function (_password, cb) {
		// bcrypt.compare(_password,this.password, (err, isMatch) => {
		// 	if (err) {
		// 		return cb(err);
		// 	} else {
		// 		cb(null,isMatch);
		// 	}
		// })
		if (_password == this.password) {
			return cb(null,true);
		} else {
			return cb(null,false);
		}
	}
}

// 添加一些静态的方法

UserSchema.statics = {
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
module.exports = UserSchema;