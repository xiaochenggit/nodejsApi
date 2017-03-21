var express = require('express');
var router = express.Router();
router.get("/",function (req, res){
	res.send('我是首页');
})
module.exports = router;