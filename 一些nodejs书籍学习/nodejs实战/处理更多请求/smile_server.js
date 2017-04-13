const http = require('http');
const fs = require('fs');
const URL = require('url');
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
function load_album(album_name, page, size,callback) {
	fs.readdir('albums/' + album_name , (error, files) => {
		if (error) {
			callback(error);
			return ;
		} else {
			var only_files = [];
			var path = 'albums/' + album_name +'/';
			(function reFiles (index) {
				if (index == files.length) {
					var pageArr = only_files.splice(page * size, size);
					var obj = {
						name: album_name,
						photos: pageArr
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
	var urlObj = URL.parse(request.url, true);
	console.log('')
	var page = urlObj.query.page ? parseInt(urlObj.query.page) : 0;
	var size = urlObj.query.page_size ? parseInt(urlObj.query.page_size) : 20; 
	var url = urlObj.pathname;
	// 例子 /albums/xxxx.json
	var album_name = url.substr(7,url.length - 12);
	load_album(album_name, page, size,(error,data) => {
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
	// parse 解析 URL
	var urlObj = URL.parse(request.url, true);
	var url = urlObj.pathname;
	console.log(urlObj);
	// 路由
	if (url == '/albums.json') {
		console.log('add');
		handle_list_album(request, response);
	} else if (url.substr(0,7) == '/albums'
		&& url.substr(url.length - 5) == '.json') {
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