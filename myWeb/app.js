var express = require("express");
var path = require("path");
var port = process.env.PORT || 3000;

// 启动外围服务器
var app = express();
// 静态资源获取地址
app.use(express.static(path.join(__dirname,"static")));
// 模板根目录
app.set("views","./app/views/pages");
// 需要安装 jade 模板
app.set("view engine","jade")
// 监听端口
app.listen(port);
console.log("my web on localhost:" + port)
var movieArr = [{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		},{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		},{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		},{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		},{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		},{
			title : '精钢狼',
			_id : 3,
			doctor : '肖成',
			porste : "/img/jgl.jpg",
		}];
app.get("/",function(req,res){
	res.render("index",{
		title : '首页',
		movies : movieArr
	})
})
app.get("/movie/list",function(req,res){
	res.render("movielist",{
		title : '电影列表',
		movies : movieArr
	})
})