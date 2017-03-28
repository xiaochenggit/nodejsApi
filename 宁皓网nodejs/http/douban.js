var http = require('http'); 
var fs = require('fs');
var options = { 
	protocal: 'http',
	hostname: 'api.douban.com', 
	port: 80, 
	path: '/v2/movie/top250', 
	method: 'GET' 
}; 
//http://www.duoqu.com/game/server/index/op/1/g/50?v=js&callback=dj.login.getGameServersCallback&_rnd=62986243894
var responseDate = '';
var req = http.request(options, function(res) { 
	console.log('STATUS: ' + res.statusCode); 
	console.log('HEADERS: ' + JSON.stringify(res.headers)); 
	res.setEncoding('utf8'); 
	res.on('data', function (chunk) { 
		responseDate += chunk; 
	}); 
	res.on('end',function(){
		console.log(JSON.parse(responseDate));
		fs.writeFile('top250.json', responseDate, (error) => {
			if (error) {
				console.log(error);
			} else {
				console.log('写入文件成功');
			}
		})
	})
}); 
 
req.on('error', function(e) { 
	console.log('problem with request: ' + e.message); 
}); 
// write data to request body 
req.write('data\n'); 
req.write('data\n'); 
req.end();