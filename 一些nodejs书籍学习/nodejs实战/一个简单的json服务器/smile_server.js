const http = require('http');
const fs = require('fs');
function readAlbum(callback){
	// 读取文件夹内容
	fs.readdir('albums', (error, files) => {
		var only_dirs = [];
		if (error) {
			callback(error);
			return ;
		} else {
			// 判断是否是文件
			(function pushDirectory (index) {
				if (index == files.length) {
					callback(null, only_dirs);
					return ;
				}
				fs.stat('albums/' + files[index], (error,stats) => {
					if (stats.isDirectory()) {
						only_dirs.push(files[index])
					}
					pushDirectory(index + 1);
				})
			})(0)
		}
	})
}
http.createServer( (request , response) => {
	console.log('REQUEST' + request.method + '---' + request.url);
	readAlbum((error, albums) => {
		if (error) {
			response.writeHead(503, { 'Content-Type' : 'application/json'});
			response.end(JSON.stringify(error) + '\n');
		} else {
			var data = {error: null, data: { albums : albums }};
			response.writeHead(200, { 'Content-Type' : 'application/json'});
			response.end(JSON.stringify(data) + '\n');
		}
	})
}).listen(8080)