var fs = require("fs");
var rs = fs.createReadStream("new.psd");
var ws = fs.createWriteStream("new2.psd");
rs.on("data",function(chunk){
	if (ws.write(chunk) === false) {
		rs.pause();
		console.log("暂停读入");
	};
})
rs.on("end",function(){
	ws.end();
	console.log("读入,读写完毕");
})
ws.on("drain",function(){
	rs.resume();
	console.log("重启读入数据");
})