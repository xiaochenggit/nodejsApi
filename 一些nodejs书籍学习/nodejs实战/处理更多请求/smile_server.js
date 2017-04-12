const http = require('http');
const fs = require('fs');
// 列表
function load_album_list(callback){
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
// 内容
function load_album(album_name, callback) {
	fs.readdir('albums/' + album_name , (error, files) => {
		if (error) {
			callback(error);
			return ;
		} else {
			var only_files = [];
			var path = 'albums/' + album_name +'/';
			(function reFiles (index) {
				if (index == files.length) {
					var obj = {
						name: album_name,
						photos: only_files
					};
					callback(null, obj)
					return ;
				} else {
					fs.stat(path + files[index], (error,stats) => {
						if (error) {
							callback(error);
							return;
						} else {
							if (stats.isFile()) {
								var obj = {
									photoName: files[index],
									des: files[index]
								};
								only_files.push(obj)
							}
							reFiles(index + 1);
						}
					})
				}
			})(0)
		}
	})
}
function handle_list_album(request,response) {
	load_album_list((error,data) => {
		if (error) {
			send_error(response,error);
			return ;
		} else {
			send_success(response,{albums:data})
		}
	})
}
function handle_get_album(request,response) {
	// 例子 /albums/xxxx.json
	var album_name = request.url.substr(7,request.url.length - 12);
	load_album(album_name, (error,data) => {
		if (error) {
			send_error(response,error);
			return ;
		} else {
			send_success(response,{albums_list:data})
		}
	})
}
// 成功
function send_success (response,data) {
	response.writeHead(200, { 'Content-Type' : 'application/json'});
	response.end(JSON.stringify({error: null, data}) + '\n');
}
// 失败
function send_error (response,error) {
	response.writeHead(503, { 'Content-Type' : 'application/json'});
	response.end(JSON.stringify(error) + '\n');
}
http.createServer( (request , response) => {
	console.log('REQUEST' + request.method + '---' + request.url);
	// 路由
	if (request.url == '/albums.json') {
		console.log('add');
		handle_list_album(request, response);
	} else if (request.url.substr(0,7) == '/albums'
		&& request.url.substr(request.url.length - 5) == '.json') {
		handle_get_album(request, response);
	}
	// readAlbum((error, albums) => {
	// 	if (error) {
	// 		response.writeHead(503, { 'Content-Type' : 'application/json'});
	// 		response.end(JSON.stringify(error) + '\n');
	// 	} else {
			
	// 	}
	// })
}).listen(8080)