var http= require('http'); 
var options = { 
	protocal: 'http:',
	hostname: 'www.weather.com.cn', 
	port: 80, 
	path: '/data/sk/101020100.html', 
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
		console.log(JSON.parse(responseDate).weatherinfo.city);
	})
}); 
 
req.on('error', function(e) { 
	console.log('problem with request: ' + e.message); 
}); 
// write data to request body 
req.write('data\n'); 
req.write('data\n'); 
req.end();