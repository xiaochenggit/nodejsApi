// 引入建模工具模块

var mongoose = require("mongoose");

// 密码存储的库

var bcrypt = require("bcrypt");

// 计算强度

var SALT_WORK_FACTOR = 10;

// 声明

var UserSchema = new mongoose.Schema({

	// 用户名和密码
	name : {
		unique : true,
		type : String
	},
	password : String,
	// 权限问题
	role : {
		type : Number,
		default : 0
	},
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
UserSchema.pre('save',function(next){
	var user = this;
	//保存新数据
	if ( this.isNew ) {
		this.meta.createAt = this.meta.updateAt =Date.now();
	}else{
		//更新数据
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if ( err ){  
			console.log(err); 
			return next(err)
		}
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) {
				return next(err);
			}
			user.password = hash;
			next();
		})
	})
	//调到下一个流程
	//next();//异步执行的
})


// UserSchema.pre("sava",function(next){

// 	var user = this;
// console.log('this is first');
// //保存新数据
// if(this.isNew){
// this.meta.createAt = this.meta.updateAt =Date.now();
// }
// else{
// //更新数据
// this.meta.updateAt = Date.now();
// }

// 	// 密码加盐 

// 	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
// 		if ( err ){  
// 			console.log(err);
// 			return next(err);
// 		}
// 		bcrypt.hash(user.password,salt,function(err,hash){
// 			if ( err ) {
// 				return next(err);
// 			}
// 			user.password = hash;
// 			next();
// 		})
// 	})
// })

// 一些实例方法
UserSchema.methods = {
	comparePassword : function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if (err) {
				return cb(err);
			}else{
				cb(null,isMatch);
			}
		})
	}
}


// 添加一些静态方法

UserSchema.statics = {

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

module.exports = UserSchema;