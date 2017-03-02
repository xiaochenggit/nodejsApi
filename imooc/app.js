var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var _ = require("underscore");
var Movie = require("./models/movie.js");
// 设置端口 默认值是3000
var port = process.env.PORT || 3000;

// 启动外围服务器
var app = express();

// 插入本地的输入库
mongoose.connect("mongodb://localhost:27017/imooc");

// 设置视图的根目录
app.set("views","./views/pages");

// 设置默认的模板引擎 默认为jade
app.set('view engine','jade');

// 表单数据格式化
app.use(bodyParser.urlencoded({ extended: true }))

// 静态资源获取
app.use(express.static(path.join(__dirname,"static")));

// 入口文件添加 moment
app.locals.moment = require("moment");

// 监听端口
app.listen(port);

console.log(" imooc is started on port " + 'localhost:' + port);

// 添加几个主要页面的路由

//  index page
// app.get("/",function(req,res){
// 	res.render("index",{
// 		title : 'IMOOC 首页',
// 		movies : [{
// 			title : '机械战警',
// 			_id : 1,
// 			poster : '/img/timg.jpg'
// 		},{
// 			title : '机械战警',
// 			_id : 2,
// 			poster : '/img/timg.jpg'
// 		},{
// 			title : '机械战警',
// 			_id : 3,
// 			poster : '/img/timg.jpg'
// 		},{
// 			title : '机械战警',
// 			_id : 4,
// 			poster : '/img/timg.jpg'
// 		},{
// 			title : '机械战警',
// 			_id : 5,
// 			poster : '/img/timg.jpg'
// 		},{
// 			title : '机械战警',
// 			_id : 6,
// 			poster : '/img/timg.jpg'
// 		}]
// 	})
// })
// index 首页 不需要伪造数据了
app.get("/",function(req,res){

	// 模型的fetch方法找到全部数据

	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("index",{
			title : 'IMOOC 首页',
			movies : movies
		})
	})
})

//  list page 列表页面
app.get("/admin/list",function(req,res){

	// 模型的fetch方法找到全部数据

	Movie.fetch(function(err,movies){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("list",{
			title : 'IMOOC 列表页面',
			movies : movies
		})
	})
})

//  detail page
// app.get("/movie/:id",function(req,res){
// 	res.render("detail",{
// 		title : 'IMOOC 详情页面',
// 		movie : {
// 			doctor : '肖成布莱尔',
// 			country : "中国大陆",
// 			title : "机械战警",
// 			year : 2014,
// 			poster : 'http://p5.7k7kimg.cn/m/201703/0109/107-1F3010932360-L.jpg',
// 			language : '汉语',
// 			flash : '/swf/1.swf',
// 			summary : '添加一些描述而已我这么做不过分吧！添加一些描述而已我这么做不过分吧！添加一些描述而已我这么做不过分吧！添加一些描述而已我这么做不过分吧！添加一些描述而已我这么做不过分吧！'
// 		}
// 	})
// })
// detail page 详情页面
app.get("/movie/:id",function(req,res){
	// 拿到 id 
	var id = req.params.id;
	// 
	Movie.findById(id,function(err,movie){
		res.render("detail",{
			title : 'IMOOC ' ,
			movie : movie
		})
	})
})



//  admin page
// app.get("/admin/movie",function(req,res){
// 	res.render("admin",{
// 		title : 'IMOOC 后台录入页面',
// 		movie : {
// 			title : '',
// 			doctor : "",
// 			country : "",
// 			year : "",
// 			poster : "",
// 			flash : "",
// 			summary : '',
// 			language : ''
// 		}
// 	})
// })
// list 页面
app.get("/admin/movie",function(req,res){
	res.render("admin",{
		title : 'IMOOC 后台录入页面',
		movie : {
			title : '',
			doctor : "",
			country : "",
			year : "",
			poster : "",
			flash : "",
			summary : '',
			language : ''
		}
	})
})

// 提交数据

app.post("/admin/movie/new",function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	// 更新
	if (id !== "undefined") {
		Movie.findById(id,function(err,movie){
			if (err) {
				console.log(err);
			}
			// 更新
			_movie = _.extend(movie,movieObj);
			// 保存
			_movie.save(function(err,movie){
				if (err) {
					console.log(err);
				}
				// 重新定向
				res.redirect("/movie/" + movie._id)
			})
		})
	}else {		
		// 创建
		_movie = new Movie({
			doctor : movieObj.doctor,
			title : movieObj.title,
			country : movieObj.country,
			language : movieObj.language,
			year : movieObj.year,
			poster : movieObj.poster,
			summary : movieObj.summary,
			flash : movieObj.flash
		})
		// 保存
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			res.redirect("/movie/" + movie._id)
		})
	}
})

// 更新
app.get("/admin/updata/:id",function(req,res){
	var id = req.params.id;
	if (id) {
		Movie.findById(id,function(err,movie){
			res.render("admin",{
				title : '后台更新页面',
				movie : movie 
			})
		})
	}
})

// list 删除请求

app.delete("/admin/list",function(req,res){
	var id = req.query.id;
	if (id) {
		Movie.remove({_id : id},function(err,movie){
			if (err) {
				console.log(err);
			}else{
				res.json({success : 1});
			}
		})
	}
})