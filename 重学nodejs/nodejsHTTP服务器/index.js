var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'ContentType': 'text/plain'});
	res.end('<h1>hello world nodejs</h1>');
}).listen(8080);
console.log('Server running on port 8080.');