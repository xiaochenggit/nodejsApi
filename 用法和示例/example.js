var http = require("http");
var hostName = '127.0.0.1';
var port = 8080;
http.createServer(function(req,res){
	res.statusCode = 200;
	res.setHeader('Content-Type','text/plain');
	res.end("Hello Wold Node.Js 我要学好nodejs");
}).listen(port,hostName,function(){
	console.log("Server running at http://" + hostName + ':' + port);
})