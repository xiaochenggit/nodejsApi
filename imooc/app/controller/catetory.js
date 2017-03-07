var Catetory = require("../models/catetory.js");
exports.new = function(req,res){
	res.render("catetory_admin",{
		title : 'IMOOC 后台分类录入页面',
		catetory : {
			name : ""
		}
	})
}

// 提交数据

exports.save = function(req,res){
	var _catetory = req.body.catetory;
		// 创建
		catetory = new Catetory(_catetory)
		// 保存
		catetory.save(function(err,catetory){
			if (err) {
				console.log(err)
			}
			res.redirect("/admin/catetory/list")
		})
}
exports.list  = function(req,res){

	// 模型的fetch方法找到全部数据

	Catetory.fetch(function(err,catetories){
		if (err) {
			console.log(err); 
		}
		// 渲染模板
		res.render("catetories_list",{
			title : '分类列表',
			catetories : catetories
		})
	})
}