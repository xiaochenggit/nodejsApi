const http = require('http');
const url = require('url');
const port = 8888;
function start (route,handle) {
	http.createServer((request, response) => {
		var pathName = url.parse(request.url).pathname;
		route(handle,pathName);
		response.writeHead(200,{'Content-Type': 'text/plain'});
			response.write('<h1>hello node.js</h1>');
			response.end();
		})
	.listen(8888, () => {
		console.log(`开启服务器 : localhost:${port}`);
	});
}
exports.start = start;